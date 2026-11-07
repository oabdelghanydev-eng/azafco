/**
 * Server-side helpers shared by the v2 seafood pages (catalogue, product
 * detail, seafood overview, processing, quality).
 *
 * Species facts come only from data/products.ts + data.products.<key>
 * (locales/<locale>/data/products.json). Free-text descriptions in that file
 * carry unapproved claims ("#1", "HACCP certified", "0 to 4°C", "year-round",
 * "1 carton MOQ") and are deliberately NOT used here.
 */
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { locales, ogLocaleMap, ogImageMap, type Locale } from '@/i18n';
import { products, type Product, type ProductCategory } from '@/data/products';
import { mediaImage, productMediaId, type ImageProps } from '@/lib/v2/media';
import { productHref } from '@/lib/v2/routes';

export const baseUrl = companyConfig.contact.baseUrl;

/**
 * Slugs whose scientific name is NOT yet verified (docs/reports/species-identification.md).
 * `buni` (Nile barb vs grass carp) is medium confidence; once seo/species-fix
 * 3824efc lands, the slug becomes `grass-carp` (high confidence) and this entry is inert.
 */
const UNVERIFIED_SCIENTIFIC = new Set<string>(['buni']);

export interface CatalogueProduct {
    slug: string;
    href: string;
    category: ProductCategory;
    name: string;
    altNames: string[];
    /** Only set when the identification is verified */
    scientificName?: string;
    image: ImageProps;
    /** Indicative size grades from the current product list (numeric entries only) */
    sizes: string[];
    /** Indicative pack type from the current product list */
    packaging?: string;
}

/** Untyped view of a root translator (message keys here are built at runtime). */
export type RootT = {
    (key: string, values?: Record<string, string | number>): string;
    raw(key: string): unknown;
    has(key: string): boolean;
};

export async function getRootT(locale: string): Promise<RootT> {
    return (await getTranslations({ locale })) as unknown as RootT;
}

function rawArray(t: RootT, key: string): string[] {
    if (!t.has(key)) return [];
    const v = t.raw(key);
    return Array.isArray(v) ? (v as unknown[]).filter((x): x is string => typeof x === 'string') : [];
}

export function toCatalogueProduct(t: RootT, locale: string, p: Product): CatalogueProduct {
    const key = `data.products.${p.translationKey}`;
    const name = t.has(`${key}.name`) ? t(`${key}.name`) : p.slug;
    const mediaId = productMediaId(p.slug);
    const fallbackAlt = t.has('catalogue_v2.card.image_alt') ? t('catalogue_v2.card.image_alt', { name }) : name;
    const image: ImageProps = mediaId
        ? mediaImage(mediaId, locale)
        : { src: p.image, alt: fallbackAlt, width: 960, height: 1280 };
    return {
        slug: p.slug,
        href: productHref(p.slug),
        category: p.category,
        name,
        altNames: rawArray(t, `${key}.alt_names`),
        scientificName: UNVERIFIED_SCIENTIFIC.has(p.slug) ? undefined : p.scientificName,
        image,
        // Drop "Custom sizes available"-style entries: keep only real ranges
        sizes: rawArray(t, `${key}.sizes`).filter((s) => /\d/.test(s)),
        packaging: t.has(`${key}.packaging`) ? t(`${key}.packaging`) : undefined,
    };
}

export async function getCatalogue(locale: string): Promise<CatalogueProduct[]> {
    const t = await getRootT(locale);
    return products.map((p) => toCatalogueProduct(t, locale, p));
}

/** Names in Arabic + English for every product, so either script finds a species. */
export async function getSearchNames(): Promise<Record<string, string[]>> {
    const [ar, en] = await Promise.all([getRootT('ar'), getRootT('en')]);
    const out: Record<string, string[]> = {};
    for (const p of products) {
        const key = `data.products.${p.translationKey}`;
        out[p.slug] = [ar, en].flatMap((t) => [t.has(`${key}.name`) ? t(`${key}.name`) : '', ...rawArray(t, `${key}.alt_names`)]);
        if (!UNVERIFIED_SCIENTIFIC.has(p.slug)) out[p.slug].push(p.scientificName);
        out[p.slug].push(p.slug.replace(/-/g, ' '));
    }
    return out;
}

/** Related products: same water type first, then the rest, in catalogue order. */
export function relatedProducts(all: CatalogueProduct[], slug: string, count = 3): CatalogueProduct[] {
    const self = all.find((p) => p.slug === slug);
    const others = all.filter((p) => p.slug !== slug);
    return [...others.filter((p) => p.category === self?.category), ...others.filter((p) => p.category !== self?.category)].slice(0, count);
}

/** Canonical + hreflang + OG + Twitter for a locale-less path. */
export function pageMetadata({
    locale,
    path,
    title,
    description,
    siteName,
    image,
}: {
    locale: string;
    path: string;
    title: string;
    description: string;
    siteName: string;
    image?: { url: string; alt: string; width?: number; height?: number };
}): Metadata {
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${baseUrl}/${l}${path}`;
    languages['x-default'] = `${baseUrl}${path}`;
    const og = image ?? { url: ogImageMap[locale as Locale] ?? ogImageMap.en, alt: title, width: 1200, height: 630 };
    return {
        title,
        description,
        alternates: { canonical: `${baseUrl}/${locale}${path}`, languages },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}${path}`,
            type: 'website',
            siteName,
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [og],
        },
        twitter: { card: 'summary_large_image', title, description, images: [og.url] },
    };
}

/** <script type="application/ld+json"> with "<" escaped. */
export function jsonLd(schema: object): string {
    return JSON.stringify(schema).replace(/</g, '\\u003c');
}
