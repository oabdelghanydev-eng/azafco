import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, CTABand, FeatureGrid, PageHero, Section, SpeciesRow, SectionHeader } from '@/components/v2';
import { CheckIcon, DocumentIcon } from '@/components/v2/icons';
import CatalogueBrowser from '@/components/v2/products/CatalogueBrowser';
import RangeBand from '@/components/v2/products/RangeBand';
import { baseUrl, getCatalogue, getSearchNames, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { productCategories } from '@/data/products';
import { routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'catalogue_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.products, title: t('title'), description: t('description'), siteName: site('name') });
}

export default async function CataloguePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const [catalogue, searchNames] = await Promise.all([getCatalogue(locale), getSearchNames()]);


    const categories = productCategories
        .filter((c) => catalogue.some((p) => p.category === c))
        .map((c) => ({ value: c, label: t(`water.${c}`) }));

    const items = catalogue.map((p, i) => {
        return {
        slug: p.slug,
        category: p.category,
        terms: [p.name, ...p.altNames, ...(searchNames[p.slug] ?? [])],
        card: (
            <SpeciesRow
                index={i + 1}
                name={p.name}
                scientificName={p.scientificName}
                altNames={p.altNames}
                href={p.href}
                image={p.image}
                facts={[
                    { label: t('card.origin'), value: t('card.origin_value') },
                    { label: t('card.water'), value: t(`water.${p.category}`) },
                ]}
            />
        ),
        };
    });

    const localeUrl = `${baseUrl}/${locale}`;
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${localeUrl}${routes.products}#catalogue`,
            name: t('schema.list_name'),
            numberOfItems: catalogue.length,
            itemListElement: catalogue.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.name,
                url: `${localeUrl}${p.href}`,
            })),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: tv('nav.seafood'), item: `${localeUrl}${routes.seafood}` },
                { '@type': 'ListItem', position: 3, name: tv('nav.products'), item: `${localeUrl}${routes.products}` },
            ],
        },
    ];

    const specify = ['species', 'form', 'packing', 'volume', 'destination', 'timing'] as const;

    return (
        <>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.seafood'), href: routes.seafood }, { label: tv('nav.products') }]} />}
                secondaryAction={{ label: t('hero.secondary'), href: routes.processing }}
            />

            {/* Range band: every species cut-out, same scale, linking to its page */}
            <RangeBand
                id="catalogue-range"
                eyebrow={t('range.eyebrow')}
                title={t('range.title')}
                intro={t('range.intro_products')}
                listLabel={t('range.list_label')}
                items={catalogue.map((p) => ({ slug: p.slug, name: p.name, href: p.href, image: p.image }))}
            />

            <Section variant="light" spacing="md" labelledBy="catalogue-species">
                <SectionHeader id="catalogue-species" eyebrow={t('grid.eyebrow')} title={t('grid.title')} intro={t('grid.intro')} size="md" />
                <CatalogueBrowser items={items} categories={categories} />

                {/* Quality reassurance: specifications confirmed per order */}
                <aside
                    aria-labelledby="catalogue-note"
                    className="mt-12 flex flex-col gap-4 rounded-card border-s-4 border-gold bg-surface-offwhite p-6 sm:flex-row md:p-8"
                >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-navy-50 text-navy">
                        <DocumentIcon size={22} />
                    </span>
                    <div>
                        <h3 id="catalogue-note" className="text-heading-md text-navy">
                            {t('note.title')}
                        </h3>
                        <p className="mt-2 max-w-prose-v2 text-body text-ink-muted">{t('note.text')}</p>
                    </div>
                </aside>
            </Section>

            <Section variant="offwhite" spacing="md" labelledBy="catalogue-specify">
                <SectionHeader id="catalogue-specify" eyebrow={t('specify.eyebrow')} title={t('specify.title')} intro={t('specify.intro')} size="md" />
                <FeatureGrid
                    columns={3}
                    items={specify.map((k) => ({
                        icon: <CheckIcon size={22} />,
                        title: t(`specify.${k}_title`),
                        description: t(`specify.${k}_text`),
                    }))}
                />
            </Section>

            <Section variant="light" spacing="md" labelledBy="catalogue-proof">
                <SectionHeader id="catalogue-proof" eyebrow={t('proof.eyebrow')} title={t('proof.title')} size="md" />
                <FeatureGrid
                    columns={3}
                    style="card"
                    items={[
                        { title: t('proof.processing_title'), description: t('proof.processing_text'), href: routes.processing, linkLabel: t('proof.processing_link') },
                        { title: t('proof.quality_title'), description: t('proof.quality_text'), href: routes.quality, linkLabel: t('proof.quality_link') },
                        { title: t('proof.importers_title'), description: t('proof.importers_text'), href: routes.forImporters, linkLabel: t('proof.importers_link') },
                    ]}
                />
            </Section>

            {/* Custom requirement block = closing RFQ */}
            <CTABand
                headingId="catalogue-custom"
                eyebrow={t('custom.eyebrow')}
                intro={t('custom.intro')}
                prefill={{ type: 'specifications' }}
            />
        </>
    );
}
