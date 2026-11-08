import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    CTABand,
    FAQAccordion,
    Pending,
    PageHero,
    SpeciesEntry,
    Section,
    SectionHeader,
    SpecTable,
} from '@/components/v2';
import { DocumentIcon } from '@/components/v2/icons';
import {
    baseUrl,
    getCatalogue,
    getRootT,
    jsonLd,
    pageMetadata,
    relatedProducts,
    toCatalogueProduct,
} from '@/components/v2/products/catalogue';
import { locales } from '@/i18n';
import { getProductBySlug, products } from '@/data/products';
import { productHref, rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string; slug: string }> };

const TITLE_MAX = 60; // full <title> incl. the layout's " | AZAFCO" template
const DESCRIPTION_MAX = 155;

// Only slugs in data/products.ts are valid; renamed slugs are redirected in next.config.js.
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
    const long = t('meta_title', { name: p.name });
    const short = t('meta_title_short', { name: p.name });
    const title = fits(long) ? long : fits(short) ? short : p.name;

    const descLong = t('meta_description', { name: p.name });
    const description = descLong.length <= DESCRIPTION_MAX ? descLong : t('meta_description_short', { name: p.name });

    return pageMetadata({
        locale,
        path: productHref(slug),
        title,
        description,
        siteName: root('metadata.site.name'),
        image: { url: p.image.src, alt: p.image.alt },
    });
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) notFound();
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const catalogue = await getCatalogue(locale);
    const p = catalogue.find((c) => c.slug === slug)!;
    const related = relatedProducts(catalogue, slug, 3);
    const name = p.name;
    const water = t(`water.${p.category}`);
    const note = t.has(`detail.notes.${slug}`) ? t(`detail.notes.${slug}`) : null;

    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${productHref(slug)}`;

    // No offers / price / rating / availability: AZAFCO publishes none.
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        name,
        description: t('detail.meta_description', { name }),
        image: `${baseUrl}${p.image.src}`,
        url: pageUrl,
        category: t('schema.category'),
        ...(p.altNames.length > 0 && { alternateName: p.altNames }),
        countryOfOrigin: { '@type': 'Country', name: 'Egypt' },
        additionalProperty: [
            ...(p.scientificName ? [{ '@type': 'PropertyValue', name: t('detail.scientific_name'), value: p.scientificName }] : []),
            { '@type': 'PropertyValue', name: t('detail.water_type'), value: water },
        ],
        brand: { '@type': 'Brand', name: 'AZAFCO International' },
        manufacturer: { '@id': `${baseUrl}/#organization` },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: tv('nav.seafood'), item: `${localeUrl}${routes.seafood}` },
            { '@type': 'ListItem', position: 3, name: tv('nav.products'), item: `${localeUrl}${routes.products}` },
            { '@type': 'ListItem', position: 4, name, item: pageUrl },
        ],
    };

    const faq = [
        { id: 'sizes', question: t('detail.faq_sizes_q'), answer: t('detail.faq_sizes_a') },
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
                            <p className="mb-4 text-heading-sm italic text-ink-muted" lang="la" dir="ltr">
                                {p.scientificName}
                            </p>
                        ) : null}
                        <p>{t('detail.intro')}</p>
                        {p.altNames.length > 0 ? (
                            <p className="mt-4 text-body-sm">
                                <span className="font-semibold text-ink">{t('detail.also_known_as')}: </span>
                                {p.altNames.join(' · ')}
                            </p>
                        ) : null}
                    </>
                }
                image={p.image}
                breadcrumbs={
                    <Breadcrumbs
                        items={[
                            { label: tv('nav.seafood'), href: routes.seafood },
                            { label: tv('nav.products'), href: routes.products },
                            { label: name },
                        ]}
                    />
                }
                primaryAction={{ label: t('detail.primary', { name }), href: rfqHref({ product: slug, type: 'product' }) }}
                secondaryAction={{ label: t('detail.secondary'), href: '#specifications', external: true }}
            />

            {/* Spec card + grading */}
            <Section variant="offwhite" spacing="md" labelledBy="specifications-title" id="specifications" className="scroll-mt-24">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <SectionHeader id="specifications-title" eyebrow={t('detail.spec_eyebrow')} title={t('detail.spec_title')} intro={t('detail.spec_intro')} size="md" />
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
                                { label: t('detail.water_type'), value: water },
                            ]}
                        />
                        {!p.scientificName ? (
                            <div className="mt-4">
                                <Pending label={t('pending.species_id', { name })} />
                            </div>
                        ) : null}
                        {note ? (
                            <p role="note" className="mt-6 rounded-card border-s-4 border-gold bg-white p-5 text-body-sm text-ink">
                                {note}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-8 lg:col-span-5">
                        <div className="rounded-card border border-line bg-white p-6">
                            <h3 className="text-heading-md text-navy">{t('detail.grading_title')}</h3>
                            <p className="mt-3 text-body-sm text-ink-muted">{t('detail.grading_text')}</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Quality documents */}
            <Section variant="light" spacing="md" labelledBy="packing-docs">
                <h2 id="packing-docs" className="sr-only">
                    {t('detail.docs_title')}
                </h2>
                <div className="grid gap-6">
                    <article className="flex flex-col rounded-card border border-line p-6 md:p-8">
                        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-control bg-navy-50 text-navy">
                            <DocumentIcon size={22} />
                        </span>
                        <h3 className="v2-heading font-display text-heading-xl">{t('detail.docs_title')}</h3>
                        <p className="mt-4 text-body text-fg-muted">{t('detail.docs_text')}</p>
                        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                            <Button href={rfqHref({ type: 'documents' })} variant="text">
                                {tv('cta.request_document_pack')}
                            </Button>
                            <Button href={routes.quality} variant="text">
                                {t('detail.docs_link')}
                            </Button>
                        </div>
                    </article>
                </div>
            </Section>

            {/* Related products */}
            {related.length > 0 ? (
                <Section variant="offwhite" spacing="md" labelledBy="related-products">
                    <SectionHeader
                        id="related-products"
                        eyebrow={t('detail.related_eyebrow')}
                        title={t('detail.related_title')}
                        size="md"
                        action={
                            <Button href={routes.products} variant="text">
                                {tv('cta.view_all')}
                            </Button>
                        }
                    />
                    <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((r) => (
                            <li key={r.slug}>
                                <SpeciesEntry name={r.name} scientificName={r.scientificName} href={r.href} image={r.image} />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            <Section variant={related.length > 0 ? 'light' : 'offwhite'} spacing="md" labelledBy="product-faq">
                <div className="mx-auto max-w-3xl">
                    <SectionHeader id="product-faq" title={t('detail.faq_title', { name })} size="md" />
                    <FAQAccordion items={faq} exclusiveName={`faq-${slug}`} />
                </div>
            </Section>

            {/* Contact band; its secondary quote link keeps this product preselected */}
            <CTABand
                headingId="product-rfq"
                prefill={{ product: slug, type: 'product' }}
                reassurance={[t('detail.rfq_after_1'), t('detail.rfq_after_2'), t('detail.rfq_after_3')]}
            />
        </>
    );
}
