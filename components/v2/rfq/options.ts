/**
 * Server side of the enquiry options: the localised names the requirements
 * panel needs (species, product form, country lists). The query parsing and the
 * label logic are pure and live in ./params (also used by client components).
 */
import { getTranslations } from 'next-intl/server';
import { products } from '@/data/products';
import { FORM_KINDS } from '@/lib/v2/specs';
import { countryOptions, type CountryOption } from './countries';
import { labelPrefill, type PrefillLabels, type PrefillNames } from './params';

export { isShortTopic, resolveRfqParams, labelPrefill } from './params';
export type { RfqTopic, RfqQuery, PrefillLabels, PrefillNames } from './params';

export interface Option {
    value: string;
    label: string;
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

/** Localised species names (by slug) and product-form labels (by code), for labelPrefill. */
export async function getPrefillNames(locale: string): Promise<PrefillNames> {
    const t = await getTranslations({ locale });
    return {
        species: Object.fromEntries(products.map((p) => [p.slug, t(`data.products.${p.translationKey}.name`)])),
        forms: Object.fromEntries(FORM_KINDS.map((k) => [k, t(`catalogue_v2.specs.forms.${k}`)])),
    };
}

/** Server-side labels for a known prefill (see labelPrefill). */
export async function prefillLabels(
    locale: string,
    p: { product?: string; country?: string; form?: string; grade?: string },
): Promise<PrefillLabels> {
    return labelPrefill(locale, p, await getPrefillNames(locale));
}
