import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, CTABand, FeatureGrid, PageHero, Section, SpeciesRow, SectionHeader } from '@/components/v2';
import { CheckIcon, DocumentIcon } from '@/components/v2/icons';
import CatalogueBrowser from '@/components/v2/products/CatalogueBrowser';
import { baseUrl, getCatalogue, getRootT, getSearchNames, getSpecView, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { companyConfig } from '@/config/company.config';
import { productCategories } from '@/data/products';
import { routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

/** id of the inline "custom requirements" band heading; the hero's partnership button points here */
const CUSTOM_ID = 'catalogue-custom';

/** Approved company facts (RELEASE-DECISIONS, 13 Nov 2026), in the G home key-figures style */
const FACTS = ['species', 'markets', 'founded', 'iso', 'capacity'] as const;

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
    const root = await getRootT(locale);
    // Published species only (eel is kept in data but unpublished)
    const [catalogue, searchNames] = await Promise.all([getCatalogue(locale), getSearchNames()]);

    const categories = productCategories
        .filter((c) => catalogue.some((p) => p.category === c))
        .map((c) => ({ value: c, label: t(`water.${c}`) }));

    const items = catalogue.map((p, i) => {
        // Published, indicative values from data/specs.ts: product form and weight grades
        const spec = getSpecView(root, locale, p.slug);
        const facts: { label: string; value: string | string[] }[] = [];
        if (spec.forms.length) facts.push({ label: t('browser.form_type'), value: spec.forms.map((f) => f.label) });
        if (spec.grades.length) facts.push({ label: t('card.grades'), value: spec.grades });
        if (!facts.length) facts.push({ label: t('card.origin'), value: t('card.origin_value') });
        return {
            slug: p.slug,
            category: p.category,
            forms: spec.forms.map((f) => f.kind),
            terms: [p.name, ...p.altNames, ...(searchNames[p.slug] ?? [])],
            card: (
                <SpeciesRow
                    index={i + 1}
                    name={p.name}
                    scientificName={p.scientificName}
                    altNames={p.altNames}
                    href={p.href}
                    image={p.image}
                    chips={[t(`water.${p.category}`), t('card.origin_value')]}
                    facts={facts}
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
                { '@type': 'ListItem', position: 2, name: t('breadcrumb'), item: `${localeUrl}${routes.products}` },
            ],
        },
    ];

    const specify = ['species', 'form', 'packing', 'volume', 'destination', 'timing'] as const;
    // Smallest first step for a cold buyer: WhatsApp to management, prefilled
    const whatsappHref = `${companyConfig.contact.social.whatsapp}?text=${encodeURIComponent(t('hero.whatsapp_message'))}`;
    const isAr = locale === 'ar';

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
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: `#${CUSTOM_ID}`, external: true }}
                secondaryAction={{ label: t('hero.secondary'), href: whatsappHref, external: true }}
            />

            {/* Supplier proof above the fold: the G home key-figures strip */}
            <section aria-label={t('hero.facts.label')} className="bg-white text-[#0d1f3f]">
                <div className="mx-auto box-border max-w-[1320px] lg:px-8">
                    <dl className="m-0 grid grid-cols-2 border-0 border-b border-solid border-[#e3e8f0] px-5 lg:grid-cols-5 lg:px-0">
                        {FACTS.map((k, i) => {
                            const lastOdd = i === FACTS.length - 1 && FACTS.length % 2 === 1;
                            const cell = [
                                // phone: 2 columns with inner rules; the odd last fact spans the row
                                'border-0 border-solid border-[#e3e8f0] py-[22px]',
                                lastOdd ? 'col-span-2' : '',
                                i < FACTS.length - (FACTS.length % 2 ? 1 : 2) ? 'border-b' : '',
                                !lastOdd && i % 2 === 1 ? 'ps-4 border-s' : 'pe-3',
                                // desktop: one row, no rules
                                'lg:col-span-1 lg:border-0 lg:py-9 lg:ps-0',
                                i === FACTS.length - 1 ? 'lg:pe-0' : 'lg:pe-6',
                            ].join(' ');
                            return (
                                <div key={k} className={`flex flex-col-reverse ${cell}`}>
                                    <dt
                                        className={`font-semibold text-[#4a5a75] ${
                                            isAr ? 'mt-2 text-[15px] leading-[1.6] lg:text-[17px] lg:leading-[1.8]' : 'mt-1.5 text-[14px] lg:mt-2 lg:text-[16px]'
                                        }`}
                                    >
                                        {t(`hero.facts.${k}.label`)}
                                    </dt>
                                    <dd
                                        className={`m-0 text-[40px] font-extrabold leading-none text-[#002d72] lg:text-[52px] ${
                                            isAr ? '' : 'tracking-[-0.02em]'
                                        }`}
                                    >
                                        {t(`hero.facts.${k}.value`)}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </section>

            {/* The species register: the one list on this page */}
            <Section variant="light" spacing="lg" labelledBy="catalogue-species">
                <SectionHeader id="catalogue-species" eyebrow={t('grid.eyebrow')} title={t('grid.title')} intro={t('grid.intro')} size="md" />
                <CatalogueBrowser items={items} categories={categories} />

                {/* Owner, 13 Nov 2026: the 12 are the main species; others on request */}
                <p className="mt-8 border-s-2 border-gold ps-4 text-body-lg font-medium text-fg">{t('grid.more_species')}</p>

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

            <Section variant="offwhite" spacing="lg" labelledBy="catalogue-specify">
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

            <Section variant="light" spacing="lg" labelledBy="catalogue-proof">
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

            {/* Custom requirements: inline contact band (WhatsApp, email, requirements form) */}
            <CTABand
                headingId={CUSTOM_ID}
                className="scroll-mt-24"
                eyebrow={t('custom.eyebrow')}
                intro={t('custom.intro')}
                prefill={{ type: 'specifications' }}
                placement="inline"
                reassurance={[t('custom.after_1'), t('custom.after_2'), t('custom.after_3')]}
            />
        </>
    );
}
