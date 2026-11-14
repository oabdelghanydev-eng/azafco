/**
 * Query-param → enquiry topic + prefill for /requirements and /contact.
 * Pure (no next-intl, no React): used by the server (options.ts re-exports it)
 * and by the client components that read the query with useSearchParams, so
 * both pages can be statically rendered.
 */
import { readRfqPrefill, rfqParams, type RfqType } from '@/lib/v2/routes';

export type RfqTopic = RfqType;

export interface RfqQuery {
    topic: RfqTopic;
    product?: string;
    country?: string;
    form?: string;
    grade?: string;
}

type Params = Record<string, string | string[] | undefined>;

/** corporate / documents get the short message (no species, volume or packing). */
export function isShortTopic(topic: RfqTopic): topic is 'corporate' | 'documents' {
    return topic === 'corporate' || topic === 'documents';
}

/** Resolve the enquiry topic + prefill from ?product, ?country, ?type, ?form, ?grade. */
export function resolveRfqParams(params: Params): RfqQuery {
    const prefill = readRfqPrefill(params);
    const topic: RfqTopic = prefill.type ?? (prefill.product ? 'product' : prefill.country ? 'market' : 'general');
    return { topic, product: prefill.product, country: prefill.country, form: prefill.form, grade: prefill.grade };
}

/** Same as resolveRfqParams, from URLSearchParams (first value of each key, as on the server). */
export function resolveRfqSearch(search: Pick<URLSearchParams, 'get'> | null): RfqQuery {
    const params: Params = {};
    if (search) {
        for (const key of Object.values(rfqParams)) {
            const v = search.get(key);
            if (v !== null) params[key] = v;
        }
    }
    return resolveRfqParams(params);
}

export interface PrefillLabels {
    /** Known product slug, or undefined */
    speciesSlug?: string;
    species?: string;
    /** ISO alpha-2 if it looks like one */
    countryCode?: string;
    country?: string;
    form?: string;
    grade?: string;
}

/** Localised names the labels need, prepared on the server. */
export interface PrefillNames {
    /** product slug → localised species name (data/products.ts, data.products.*.name) */
    species: Record<string, string>;
    /** form code (lib/v2/specs FORM_KINDS) → localised label (catalogue_v2.specs.forms.*) */
    forms: Record<string, string>;
}

/**
 * Turn raw prefill into display text. Unknown slugs / form codes are dropped
 * (they never reach the message); the grade is free text, already length-capped.
 */
export function labelPrefill(
    locale: string,
    p: { product?: string; country?: string; form?: string; grade?: string },
    names: PrefillNames,
): PrefillLabels {
    const species = p.product && Object.prototype.hasOwnProperty.call(names.species, p.product) ? names.species[p.product] : undefined;
    const countryCode = p.country && /^[A-Z]{2}$/.test(p.country) ? p.country : undefined;
    let country: string | undefined;
    if (countryCode) {
        try {
            country = new Intl.DisplayNames([locale, 'en'], { type: 'region' }).of(countryCode);
        } catch {
            country = undefined;
        }
        // Intl returns the code itself for unknown regions
        if (country === countryCode) country = undefined;
    }
    const form = p.form && Object.prototype.hasOwnProperty.call(names.forms, p.form) ? names.forms[p.form] : undefined;
    // Strip control characters so a crafted ?grade= can't add lines to the message
    const grade = p.grade?.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() || undefined;
    return {
        speciesSlug: species ? p.product : undefined,
        species,
        countryCode: country ? countryCode : undefined,
        country,
        form,
        grade,
    };
}
