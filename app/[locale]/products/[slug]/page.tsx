import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    cn,
    noBreakValue,
    typography,
} from '@/components/ui';
import Pending from '@/components/v2/Pending';
import SpecTable, { type SpecRow } from '@/components/v2/SpecTable';
import ProductContact from '@/components/v2/products/ProductContact';
import { SpeciesEntry } from '@/components/v2/products/SpeciesRow';
import {
    bareName,
    baseUrl,
    getCatalogue,
    getRootT,
    getSpecView,
    inlineName,
    jsonLd,
    pageMetadata,
    relatedProducts,
    toCatalogueProduct,
} from '@/components/v2/products/catalogue';
import { locales } from '@/i18n';
import { importingTariffRows } from '@/data/guides';
import { activeMarkets } from '@/data/markets';
import { getProductBySlug, products } from '@/data/products';
import { insightHref, productHref, rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string; slug: string }> };

const TITLE_MAX = 60; // full <title> incl. the layout's " | AZAFCO" template
const DESCRIPTION_MAX = 155;
const SPEC_ID = 'specifications';
/** The importer guide with the HS / CN table (data/guides.ts) */
const HS_GUIDE_SLUG = 'importing-fresh-fish-from-egypt';

/** Bidi isolates / marks and the word joiner are for display only: strip them from JSON-LD strings. */
const plain = (s: string) => s.replace(/[\u200e\u200f\u202a-\u202e\u2060\u2066-\u2069]/g, '');

/** The seven active markets in the order every other page shows them: by first export year (UAE 2008 … Syria 2026). */
const marketsByYear = [...activeMarkets].sort((a, b) => Number(a.since) - Number(b.since));

// Only the 12 published slugs (data/products.ts `products`) are valid: eel is kept in
// data but unpublished, so /products/eel 404s. Renamed slugs redirect in next.config.js.
export const dynamicParams = false;

export function generateStaticParams() {
    return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return {};
    const root = await getRootT(locale);
    const t = await getTranslations({ locale, namespace: 'catalogue_v2.detail' });
    const p = toCatalogueProduct(root, locale, product);

    const template = (root.raw('metadata.site.title_template') ?? '%s') as string;
    const fits = (s: string) => template.replace('%s', s).length <= TITLE_MAX;
    const titleValues = { name: inlineName(p.name, locale) };
    const long = t('meta_title', titleValues);
    const short = t('meta_title_short', titleValues);
    const title = fits(long) ? long : fits(short) ? short : p.name;

    const values = { name: p.name, scientific: p.scientificName ?? '' };
    const descLong = p.scientificName ? t('meta_description', values) : '';
    const description = descLong && descLong.length <= DESCRIPTION_MAX ? descLong : t('meta_description_short', values);

    return pageMetadata({
        locale,
        path: productHref(slug),
        title,
        description,
        siteName: root('metadata.site.name'),
        image: { url: p.image.src, alt: p.image.alt, width: p.image.width, height: p.image.height },
    });
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) notFound();
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const root = await getRootT(locale);
    const catalogue = await getCatalogue(locale);
    const p = catalogue.find((c) => c.slug === slug)!;
    const related = relatedProducts(catalogue, slug, 3);
    const spec = getSpecView(root, locale, slug);
    // HS / CN code from the guide's tariff table (data/guides.ts), so both pages show the same code;
    // species that share the "Other" subheading 0302.89 also get the guide's note on why.
    const tariff = importingTariffRows.find((r) => r.productKey === product.translationKey);
    const tariffNoteKey = tariff?.note ? `guides_page.importing.hs.notes.${tariff.note}` : null;
    const tariffNote = tariffNoteKey && root.has(tariffNoteKey) ? root(tariffNoteKey) : null;
    const name = p.name;
    const water = t(`water.${p.category}`);

    // Arabic lists take the Arabic comma
    const listSep = locale === 'ar' ? '، ' : ', ';
    // One species line (data.products.<key>.description: other names, graded by weight where grades exist,
    // packed on ice). The grades themselves are in the spec card, so they are not repeated here.
    const descriptionKey = `data.products.${product.translationKey}.description`;
    const summary = root.has(descriptionKey) ? root(descriptionKey) : '';
    // "Also known as": only the names the species line does not already give
    const summaryLower = summary.toLocaleLowerCase(locale);
    const otherNames = p.altNames.filter((a) => !summaryLower.includes(a.toLocaleLowerCase(locale)));

    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${productHref(slug)}`;

    // No offers / price / rating / availability: AZAFCO publishes none.
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        name,
        description: plain(summary),
        image: `${baseUrl}${p.image.src}`,
        url: pageUrl,
        category: t('schema.category'),
        ...(p.altNames.length > 0 && { alternateName: p.altNames }),
        countryOfOrigin: { '@type': 'Country', name: t('detail.origin_value') },
        additionalProperty: [
            ...(p.scientificName ? [{ '@type': 'PropertyValue', name: t('detail.scientific_name'), value: p.scientificName }] : []),
            { '@type': 'PropertyValue', name: t('detail.water_type'), value: water },
            ...(spec.forms.length ? [{ '@type': 'PropertyValue', name: t('detail.form'), value: spec.forms.map((f) => f.label).join(listSep) }] : []),
            ...(spec.grades.length ? [{ '@type': 'PropertyValue', name: t('detail.sizes'), value: plain(spec.grades.join(listSep)) }] : []),
            ...(tariff
                ? [
                      { '@type': 'PropertyValue', propertyID: 'HS', name: 'HS', value: tariff.hs },
                      { '@type': 'PropertyValue', propertyID: 'CN', name: 'CN', value: tariff.cn },
                  ]
                : []),
        ],
        brand: { '@type': 'Brand', name: 'AZAFCO International' },
        manufacturer: { '@id': `${baseUrl}/#organization` },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('breadcrumb'), item: `${localeUrl}${routes.products}` },
            { '@type': 'ListItem', position: 3, name, item: pageUrl },
        ],
    };

    const specRows: SpecRow[] = [
        { label: t('detail.trade_name'), value: name },
        {
            label: t('detail.scientific_name'),
            value: p.scientificName ? (
                <i lang="la" dir="ltr">
                    {p.scientificName}
                </i>
            ) : null,
        },
        { label: t('detail.origin'), value: t('detail.origin_value') },
        { label: t('detail.packed_at'), value: t('detail.packed_at_value') },
        { label: t('detail.transport'), value: t('detail.transport_value') },
        { label: t('detail.water_type'), value: water },
        { label: t('detail.form'), value: spec.forms.length ? spec.forms.map((f) => f.label).join(' · ') : null },
        spec.grades.length
            ? {
                  label: t('detail.sizes'),
                  value: (
                      <ul className="m-0 list-none space-y-1 p-0">
                          {spec.grades.map((g) => (
                              <li key={g}>
                                  <bdi>{noBreakValue(g)}</bdi>
                              </li>
                          ))}
                      </ul>
                  ),
              }
            : {
                  label: t('card.grades_label'),
                  // No published grades: "Send us your target range" opens this product's prefilled /requirements
                  value: (
                      <TextLink href={rfqHref({ product: slug, type: 'product' })} dataAttrs={{ 'data-cta': 'product_grades_requirements' }}>
                          {t('card.grades_none')}
                      </TextLink>
                  ),
              },
        { label: t('detail.packaging'), value: spec.pack ?? null },
    ];
    if (tariff) {
        specRows.push({
            label: t('detail.hs_code'),
            value: (
                <>
                    <span className="block">
                        <bdi dir="ltr">HS {tariff.hs}</bdi> · {t('detail.cn_label')} <bdi dir="ltr">{tariff.cn}</bdi>
                    </span>
                    {tariffNote ? <span className={cn('mt-1 block font-normal text-ink-muted', typography.small)}>{tariffNote}</span> : null}
                    <TextLink href={insightHref(HS_GUIDE_SLUG)} dataAttrs={{ 'data-cta': 'product_hs_guide' }}>
                        {t('detail.hs_guide')}
                    </TextLink>
                </>
            ),
        });
    }

    return (
        <>
            {[productSchema, breadcrumbSchema].map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <PageHero
                variant="split"
                title={t('detail.h1', { name: bareName(name, locale) })}
                intro={
                    <>
                        {p.scientificName ? (
                            <p className={cn('m-0 mb-4 italic text-fg-muted', typography.h4)}>
                                <span lang="la" dir="ltr">
                                    {p.scientificName}
                                </span>
                            </p>
                        ) : null}
                        {summary ? <p className="m-0 font-medium text-fg">{summary}</p> : null}
                        {otherNames.length > 0 ? (
                            <p className={cn('m-0 mt-4', typography.small)}>
                                <span className="font-semibold text-fg">{t('detail.also_known_as')}: </span>
                                {otherNames.join(' · ')}
                            </p>
                        ) : null}
                    </>
                }
                image={p.image}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.products }, { label: name }]} />}
                actions={
                    <>
                        <Button
                            href={rfqHref({ product: slug, type: 'product' })}
                            size="lg"
                            stretch="phone"
                            arrow
                            dataAttrs={{ 'data-cta': 'product_hero_requirements' }}
                        >
                            {t('detail.primary')}
                        </Button>
                        <Button href={`#${SPEC_ID}`} external variant="outline" size="lg" stretch="phone">
                            {t('detail.secondary')}
                        </Button>
                    </>
                }
            />

            {/* Spec card, with the contact card beside it */}
            <Section variant="offwhite" labelledBy="specifications-title" id={SPEC_ID}>
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <SectionHeading id="specifications-title" title={t('detail.spec_title')} size="md" />
                        {/* The h2 above names the table: the caption stays for screen readers only */}
                        <SpecTable caption={t('detail.spec_caption', { name: bareName(name, locale) })} rows={specRows} hideCaption />
                        {!p.scientificName ? (
                            <div className="mt-4">
                                <Pending label={t('pending.species_id', { name })} />
                            </div>
                        ) : null}
                    </div>

                    <div className="lg:col-span-5">
                        <ProductContact name={name} titleName={bareName(name, locale)} />
                    </div>
                </div>
            </Section>

            {/* The seven active markets, each linking to its market page (same order as the home and /markets) */}
            <Section variant="white" labelledBy="product-markets">
                <SectionHeading
                    id="product-markets"
                    title={t('detail.markets_title')}
                    size="md"
                    action={<TextLink href={routes.markets}>{t('detail.markets_link')}</TextLink>}
                />
                <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
                    {marketsByYear.map((m) => (
                        <li key={m.slug}>
                            <TextLink href={`${routes.markets}/${m.slug}`}>{tm(`${m.translationKey}.country`)}</TextLink>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Related products */}
            {related.length > 0 ? (
                <Section variant="offwhite" labelledBy="related-products">
                    <SectionHeading
                        id="related-products"
                        title={t('detail.related_title')}
                        size="md"
                        action={<TextLink href={routes.products}>{tv('cta.view_all')}</TextLink>}
                    />
                    <ul className="m-0 grid list-none gap-x-10 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((r) => (
                            <li key={r.slug}>
                                <SpeciesEntry name={r.name} scientificName={r.scientificName} href={r.href} image={r.image} />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}
            {/* The G footer closes the page with the WhatsApp (management) and email (export team) rows. */}
        </>
    );
}
