/**
 * Server-side option lists for RfqForm (localised species + countries), and
 * query-param → topic resolution for /rfq and /contact.
 */
import { getTranslations } from 'next-intl/server';
import { products } from '@/data/products';
import { readRfqPrefill } from '@/lib/v2/routes';
import { countryOptions, type CountryOption } from './countries';
import type { Option } from './fields';
import type { RfqTopic } from './schema';

export async function getRfqFormOptions(locale: string): Promise<{ speciesOptions: Option[]; countries: CountryOption[] }> {
    const t = await getTranslations({ locale });
    const speciesOptions: Option[] = [
        ...products.map((p) => ({ value: p.slug, label: t(`data.products.${p.translationKey}.name`) })),
        { value: 'other', label: t('rfq_v2.form.species_other') },
    ];
    return { speciesOptions, countries: countryOptions(locale) };
}

type Params = Record<string, string | string[] | undefined>;

/**
 * Resolve the enquiry topic + prefill from ?product, ?country, ?type.
 * `type=documents` is accepted here although lib/v2/routes RfqType doesn't list it yet.
 */
export function resolveRfqParams(params: Params): { topic: RfqTopic; product?: string; country?: string; form?: string; grade?: string } {
    const prefill = readRfqPrefill(params);
    const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
    const topic: RfqTopic =
        rawType === 'documents' ? 'documents' : prefill.type ?? (prefill.product ? 'product' : prefill.country ? 'market' : 'general');
    return { topic, product: prefill.product, country: prefill.country, form: prefill.form, grade: prefill.grade };
}
