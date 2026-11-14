import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Badge,
    Breadcrumbs,
    Button,
    Card,
    DocumentIcon,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    cn,
    noBreakValue,
    typography,
} from '@/components/ui';
import FAQAccordion from '@/components/v2/FAQAccordion';
import Pending from '@/components/v2/Pending';
import SpecTable from '@/components/v2/SpecTable';
import ProductContact from '@/components/v2/products/ProductContact';
import { SpeciesEntry } from '@/components/v2/products/SpeciesRow';
import {
    baseUrl,
    getCatalogue,
    getRootT,
    getSpecView,
    jsonLd,
    pageMetadata,
    relatedProducts,
    toCatalogueProduct,
} from '@/components/v2/products/catalogue';
import { companyConfig } from '@/config/company.config';
import { locales } from '@/i18n';
import { getProductBySlug, products } from '@/data/products';
import { insightHref, productHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string; slug: string }> };

const TITLE_MAX = 60; // full <title> incl. the layout's " | AZAFCO" template
const DESCRIPTION_MAX = 155;
const CONTACT_ID = 'start-partnership';
/** The importer guide with the HS codes (data/guides.ts) */
const HS_GUIDE_SLUG = 'importing-fresh-fish-from-egypt';

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
    const values = { name: p.name, scientific: p.scientificName ?? '' };

    const template = (root.raw('metadata.site.title_template') ?? '%s') as string;
    const fits = (s: string) => template.replace('%s', s).length <= TITLE_MAX;
    const long = t('meta_title', values);
    const short = t('meta_title_short', values);
    const title = fits(long) ? long : fits(short) ? short : p.name;

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
    const root = await getRootT(locale);
    const catalogue = await getCatalogue(locale);
    const p = catalogue.find((c) => c.slug === slug)!;
    const related = relatedProducts(catalogue, slug, 3);
    const spec = getSpecView(root, locale, slug);
    const name = p.name;
    const water = t(`water.${p.category}`);
    const note = t.has(`detail.notes.${slug}`) ? t(`detail.notes.${slug}`) : null;

    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${productHref(slug)}`;
    const docsHref = `mailto:${companyConfig.contact.email}?subject=${encodeURIComponent(t('detail.docs_subject', { name }))}`;

    // No offers / price / rating / availability: AZAFCO publishes none.
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        name,
        description: [p.description, t('detail.meta_description_short', { name })].filter(Boolean).join(' '),
        image: `${baseUrl}${p.image.src}`,
        url: pageUrl,
        category: t('schema.category'),
        ...(p.altNames.length > 0 && { alternateName: p.altNames }),
        countryOfOrigin: { '@type': 'Country', name: t('detail.origin_value') },
        additionalProperty: [
            ...(p.scientificName ? [{ '@type': 'PropertyValue', name: t('detail.scientific_name'), value: p.scientificName }] : []),
            { '@type': 'PropertyValue', name: t('detail.water_type'), value: water },
            ...(spec.forms.length ? [{ '@type': 'PropertyValue', name: t('detail.form'), value: spec.forms.map((f) => f.label).join(', ') }] : []),
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

    const faq = [
        {
            id: 'sizes',
            question: t('detail.faq_sizes_q'),
            answer: spec.grades.length ? t('detail.faq_sizes_a_listed') : t('detail.faq_sizes_a_none'),
        },
        { id: 'packing', question: t('detail.faq_packing_q'), answer: t('detail.faq_packing_a') },
        { id: 'price', question: t('detail.faq_price_q'), answer: t('detail.faq_price_a') },
    ];

    return (
        <>
            {[productSchema, breadcrumbSchema].map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <PageHero
                variant="split"
                eyebrow={t('detail.eyebrow')}
                title={name}
                intro={
                    <>
                        {p.scientificName ? (
                            <p className={cn('m-0 mb-4 italic text-fg-muted', typography.h4)}>
                                <span lang="la" dir="ltr">
                                    {p.scientificName}
                                </span>
                            </p>
                        ) : null}
                        {p.description ? <p className="m-0 mb-3 font-medium text-fg">{p.description}</p> : null}
                        <p className="m-0">{t('detail.intro')}</p>
                        {p.altNames.length > 0 ? (
                            <p className={cn('m-0 mt-4', typography.small)}>
                                <span className="font-semibold text-fg">{t('detail.also_known_as')}: </span>
                                {p.altNames.join(' · ')}
                            </p>
                        ) : null}
                        <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                            <li>
                                <Badge tone="outline">{water}</Badge>
                            </li>
                            {spec.forms.map((f) => (
                                <li key={f.kind}>
                                    <Badge tone="outline">{f.label}</Badge>
                                </li>
                            ))}
                        </ul>
                    </>
                }
                image={p.image}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.products }, { label: name }]} />}
                actions={
                    <>
                        <Button href={`#${CONTACT_ID}`} external size="lg" stretch="phone" arrow>
                            {t('detail.primary')}
                        </Button>
                        <Button href="#specifications" external variant="outline" size="lg" stretch="phone">
                            {t('detail.secondary')}
                        </Button>
                    </>
                }
            />

            {/* Spec card + weight grades, with the partnership card beside it */}
            <Section variant="offwhite" labelledBy="specifications-title" id="specifications">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <SectionHeading id="specifications-title" eyebrow={t('detail.spec_eyebrow')} title={t('detail.spec_title')} intro={t('detail.spec_intro')} size="md" />
                        <SpecTable
                            caption={t('detail.spec_caption', { name })}
                            rows={[
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
                                {
                                    label: t('detail.sizes'),
                                    value: spec.grades.length ? (
                                        <ul className="m-0 list-none space-y-1 p-0">
                                            {spec.grades.map((g) => (
                                                <li key={g}>
                                                    <bdi>{noBreakValue(g)}</bdi>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null,
                                },
                                { label: t('detail.packaging'), value: spec.pack ?? null },
                            ]}
                        />
                        {/* Weight grades sit under the spec h2 (before the contact aside's h2) to keep the outline */}
                        <Card padding="sm" className="mt-6">
                            <h3 className={cn('m-0 text-navy', typography.h3)}>{t('detail.grading_title')}</h3>
                            <p className={cn('m-0 mt-3 text-ink-muted', typography.small)}>{t('detail.grading_text')}</p>
                        </Card>
                        {!p.scientificName ? (
                            <div className="mt-4">
                                <Pending label={t('pending.species_id', { name })} />
                            </div>
                        ) : null}
                        {note ? (
                            <p role="note" className={cn('m-0 mt-6 rounded-card border-0 border-s-4 border-solid border-gold bg-white p-5 text-ink', typography.small)}>
                                {note}
                            </p>
                        ) : null}
                    </div>

                    <div className="lg:col-span-5">
                        <ProductContact slug={slug} name={name} id={CONTACT_ID} />
                    </div>
                </div>
            </Section>

            {/* Quality documents: the export team handles details and documents */}
            <Section variant="white" labelledBy="packing-docs">
                <Card as="article" padding="md" className="flex flex-col gap-6 md:flex-row md:items-start">
                    <span className="flex h-tap w-tap shrink-0 items-center justify-center rounded-control bg-navy-50 text-navy">
                        <DocumentIcon size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 id="packing-docs" className={cn('v2-heading m-0', typography.h2Sm)}>
                            {t('detail.docs_title')}
                        </h2>
                        <p className={cn('m-0 mt-4 max-w-prose-v2 text-ink-muted', typography.body)}>{t('detail.docs_text')}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-8">
                            <TextLink href={docsHref} dataAttrs={{ 'data-cta': 'product_documents_email' }}>
                                {t('detail.docs_email')}
                            </TextLink>
                            <TextLink href={routes.quality}>{t('detail.docs_link')}</TextLink>
                            <TextLink href={insightHref(HS_GUIDE_SLUG)} dataAttrs={{ 'data-cta': 'product_hs_guide' }}>
                                {t('detail.docs_guide')}
                            </TextLink>
                        </div>
                    </div>
                </Card>
            </Section>

            {/* Related products */}
            {related.length > 0 ? (
                <Section variant="offwhite" labelledBy="related-products">
                    <SectionHeading
                        id="related-products"
                        eyebrow={t('detail.related_eyebrow')}
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
                    <p className={cn('m-0 mt-10 border-0 border-s-2 border-solid border-gold ps-4 text-fg-muted', typography.body)}>{t('grid.more_species')}</p>
                </Section>
            ) : null}

            <Section variant={related.length > 0 ? 'white' : 'offwhite'} labelledBy="product-faq">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading id="product-faq" title={t('detail.faq_title', { name })} size="md" />
                    <FAQAccordion items={faq} exclusiveName={`faq-${slug}`} />
                </div>
            </Section>
            {/* The G footer closes the page with the WhatsApp (management) and email (export team) rows. */}
        </>
    );
}
