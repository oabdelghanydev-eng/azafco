/**
 * Query-param → enquiry topic + prefill for /rfq and /contact, and the
 * localised labels the RFQ message needs (species, country, product form).
 */
import { getTranslations } from 'next-intl/server';
import { products } from '@/data/products';
import { readRfqPrefill, type RfqType } from '@/lib/v2/routes';
import { FORM_KINDS } from '@/lib/v2/specs';
import { countryOptions, type CountryOption } from './countries';

export type RfqTopic = RfqType;
export interface Option {
    value: string;
    label: string;
}

/** corporate / documents get the short message (no species, volume or packing). */
export function isShortTopic(topic: RfqTopic): topic is 'corporate' | 'documents' {
    return topic === 'corporate' || topic === 'documents';
}

/**
 * Localised species + country lists.
 * Kept for callers that still pass them to the (now form-less) RFQ panel.
 */
export async function getRfqFormOptions(locale: string): Promise<{ speciesOptions: Option[]; countries: CountryOption[] }> {
    const t = await getTranslations({ locale });
    const speciesOptions: Option[] = products.map((p) => ({ value: p.slug, label: t(`data.products.${p.translationKey}.name`) }));
    return { speciesOptions, countries: countryOptions(locale) };
}

type Params = Record<string, string | string[] | undefined>;

/** Resolve the enquiry topic + prefill from ?product, ?country, ?type, ?form, ?grade. */
export function resolveRfqParams(params: Params): { topic: RfqTopic; product?: string; country?: string; form?: string; grade?: string } {
    const prefill = readRfqPrefill(params);
    const topic: RfqTopic = prefill.type ?? (prefill.product ? 'product' : prefill.country ? 'market' : 'general');
    return { topic, product: prefill.product, country: prefill.country, form: prefill.form, grade: prefill.grade };
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

/**
 * Turn raw prefill into display text. Unknown slugs / form codes are dropped
 * (they never reach the message); the grade is free text, already length-capped.
 */
export async function prefillLabels(
    locale: string,
    p: { product?: string; country?: string; form?: string; grade?: string },
): Promise<PrefillLabels> {
    const t = await getTranslations({ locale });
    const product = p.product ? products.find((x) => x.slug === p.product) : undefined;
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
    const form = p.form && (FORM_KINDS as readonly string[]).includes(p.form) ? t(`catalogue_v2.specs.forms.${p.form}`) : undefined;
    // Strip control characters so a crafted ?grade= can't add lines to the message
    const grade = p.grade?.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() || undefined;
    return {
        speciesSlug: product?.slug,
        species: product ? t(`data.products.${product.translationKey}.name`) : undefined,
        countryCode: country ? countryCode : undefined,
        country,
        form,
        grade,
    };
}
