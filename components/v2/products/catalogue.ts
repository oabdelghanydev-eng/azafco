/**
 * Server-side helpers shared by the v2 seafood pages (catalogue, product
 * detail, seafood overview, processing, quality).
 *
 * Species facts come only from data/products.ts, data/specs.ts (indicative
 * grades / forms / pack type) and data.products.<key> (name, alt names and the
 * one-line description in locales/<locale>/data/products.json). Only the 12
 * published species are used (eel is kept in data but unpublished).
 * No farmed / wild labels, no stock or availability claims.
 */
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { ogLocaleMap, ogImageMap, type Locale } from '@/i18n';
import { hreflangAlternates } from '@/components/v2/businesses/pageMetadata';
import { products, type Product, type ProductCategory } from '@/data/products';
import { mediaImage, productMediaId, type ImageProps } from '@/lib/v2/media';
import { productHref } from '@/lib/v2/routes';
import { formatGradeRange, getSpeciesSpec, type FormKind, type Grade, type Units } from '@/lib/v2/specs';

export const baseUrl = companyConfig.contact.baseUrl;

/**
 * Slugs whose scientific name is NOT yet verified (docs/reports/species-identification.md).
 * All 12 published scientific names are on the approved neutral-names table (owner's list,
 * 7 Nov 2026). Confidence is high for 11; bayad (Bagrus bajad) is rated medium-high because
 * B. docmak looks similar, but its name is approved for display.
 * Add a slug here to hide its scientific name until it is confirmed.
 */
const UNVERIFIED_SCIENTIFIC = new Set<string>();

/**
 * Extra search terms carried over from the live site's product list (origin/main,
 * locales/{ar,en}/data/products.json alt names). Search only: they are not shown,
 * so the visible names stay the short ones in data.products.<key>.
 */
const SEARCH_ALIASES: Record<string, string[]> = {
    'sea-bass': ['European bass', 'Mediterranean sea bass', 'قاروص متوسطي'],
    mullet: ['Striped mullet'],
    'common-carp': ['Carp', 'Mabrouk'],
    catfish: ['Sharptooth catfish', 'سمك القط الأفريقي'],
    'sea-bream': ['Gilthead bream'],
};

export interface CatalogueProduct {
    slug: string;
    href: string;
    category: ProductCategory;
    name: string;
    altNames: string[];
    /** One-line factual description (catalogue_v2.descriptions.<slug>) */
    description?: string;
    /** Only set when the identification is verified */
    scientificName?: string;
    image: ImageProps;
    // Size grades, forms and pack type live in data/specs.ts (lib/v2/specs.ts): one source for every page.
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
    // Alt text: the media manifest (every locale, short species names); the locale template only when a species has no manifest photo
    const image: ImageProps = mediaId
        ? mediaImage(mediaId, locale)
        : {
              src: p.image,
              alt: t.has('catalogue_v2.card.image_alt') ? t('catalogue_v2.card.image_alt', { name }) : name,
              width: 960,
              height: 1280,
          };
    return {
        slug: p.slug,
        href: productHref(p.slug),
        category: p.category,
        name,
        altNames: rawArray(t, `${key}.alt_names`),
        // In this namespace (not data.products.<key>.description) so every locale shows approved copy
        description: t.has(`catalogue_v2.descriptions.${p.slug}`) ? t(`catalogue_v2.descriptions.${p.slug}`) : undefined,
        scientificName: UNVERIFIED_SCIENTIFIC.has(p.slug) ? undefined : p.scientificName,
        image,
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
        out[p.slug].push(...(SEARCH_ALIASES[p.slug] ?? []));
        out[p.slug].push(p.slug.replace(/-/g, ' '));
    }
    return out;
}

export interface SpecView {
    /** Product form codes and labels, e.g. "Whole, fresh chilled" */
    forms: { kind: FormKind; label: string }[];
    /** Indicative weight grades, e.g. "Small (200–300 g)"; empty when the data has none */
    grades: string[];
    /** Indicative pack type label, e.g. "EPS foam box" */
    pack?: string;
}

/**
 * One weight grade as text. Open-ended grades read "500 g and above" / «500 جم فأكثر»
 * (as in data.products.<key>.sizes), not "500+ g".
 */
function gradeText(t: RootT, g: Grade, units: Units): string | null {
    if (g.minG !== undefined && g.maxG === undefined) {
        const kg = g.minG >= 1000;
        const num = String(kg ? Math.round(g.minG / 10) / 100 : g.minG);
        const lri = String.fromCharCode(0x2066);
        const pdi = String.fromCharCode(0x2069);
        const value = `${units.isolate ? `${lri}${num}${pdi}` : num} ${kg ? units.kg : units.g}`;
        return t('catalogue_v2.specs.and_above', { value });
    }
    return formatGradeRange(g, units);
}

/**
 * Published, indicative spec values for one species (data/specs.ts), labelled
 * from catalogue_v2.specs.*. Nothing is invented: missing data stays empty.
 */
export function getSpecView(t: RootT, locale: string, slug: string): SpecView {
    const spec = getSpeciesSpec(slug);
    const ns = 'catalogue_v2.specs';
    const units = { g: t(`${ns}.units.g`), kg: t(`${ns}.units.kg`), isolate: locale === 'ar' };
    const forms = Array.from(new Set(spec.forms.map((f) => f.kind))).map((kind) => ({ kind, label: t(`${ns}.forms.${kind}`) }));
    const grades: string[] = [];
    for (const f of spec.forms) {
        for (const g of f.grades) {
            const range = gradeText(t, g, units);
            if (!range) continue;
            const label = g.label && t.has(`${ns}.grades.${g.label}`) ? t(`${ns}.grades.${g.label}`) : null;
            const text = label ? `${label} (${range})` : range;
            if (!grades.includes(text)) grades.push(text);
        }
    }
    const packType = spec.forms.find((f) => f.packType)?.packType ?? spec.logistics.boxType;
    const pack = packType && t.has(`${ns}.packs.${packType}`) ? t(`${ns}.packs.${packType}`) : undefined;
    return { forms, grades, pack };
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
    const languages = hreflangAlternates(path);
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
