import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button, Card, Eyebrow, MailIcon, PageHead, Section, SectionHeading, WhatsAppIcon, cn, typography } from '@/components/ui';
import FeatureGrid from '@/components/v2/FeatureGrid';
import CatalogueBrowser from '@/components/v2/products/CatalogueBrowser';
import { SpeciesRow } from '@/components/v2/products/SpeciesRow';
import { baseUrl, getCatalogue, getRootT, getSearchNames, getSpecView, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { companyConfig } from '@/config/company.config';
import { productCategories } from '@/data/products';
import { rfqHref, routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';

type Props = { params: Promise<{ locale: string }> };

/** id of the closing "custom requirements" heading */
const CUSTOM_ID = 'catalogue-custom';

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
        // Origin, form and packing are the same for all 12 and said once above the grid (grid.intro);
        // each card keeps only what differs: the indicative weight grades from data/specs.ts.
        const spec = getSpecView(root, locale, p.slug);
        const facts: { label: string; value: string | string[] }[] = spec.grades.length
            ? [{ label: t('card.grades'), value: spec.grades }]
            : [{ label: t('card.grades_label'), value: t('card.grades_none') }];
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
                    chips={[t(`water.${p.category}`)]}
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

    // Smallest first step for a cold buyer: WhatsApp to management, prefilled
    const { email } = companyConfig.contact;
    const whatsappHref = whatsappLink(t('hero.whatsapp_message'));
    const mailHref = `mailto:${email}?subject=${encodeURIComponent(t('custom.email_subject'))}`;

    return (
        <>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <PageHead
                crumbs={[{ label: t('breadcrumb') }]}
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                titleId="catalogue-title"
                intro={t('hero.intro')}
            >
                <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'catalogue_hero_partnership' }}>
                        {t('hero.primary')}
                    </Button>
                    <Button
                        href={whatsappHref}
                        variant="outline"
                        size="lg"
                        stretch="phone"
                        icon={<WhatsAppIcon size={20} />}
                        newTabLabel={t('new_tab')}
                        dataAttrs={{ 'data-cta': 'catalogue_hero_whatsapp' }}
                    >
                        {t('hero.secondary')}
                    </Button>
                </div>
            </PageHead>

            {/* The species register: the one list on this page */}
            <Section variant="white" labelledBy="catalogue-species">
                <SectionHeading id="catalogue-species" eyebrow={t('grid.eyebrow')} title={t('grid.title')} intro={t('grid.intro')} />
                <CatalogueBrowser items={items} categories={categories} />

                {/* Owner, 13 Nov 2026: the 12 are the main species; others on request */}
                <p className={cn('m-0 mt-8 border-0 border-s-2 border-solid border-gold ps-4 font-medium text-fg', typography.lead)}>
                    {t('grid.more_species')}
                </p>
            </Section>

            <Section variant="offwhite" labelledBy="catalogue-proof">
                <SectionHeading id="catalogue-proof" eyebrow={t('proof.eyebrow')} title={t('proof.title')} />
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

            {/* Closing: custom requirements (accent card; the G footer carries the contact block).
                The steps after the buyer writes live on /requirements only. */}
            <Section variant="white" labelledBy={CUSTOM_ID}>
                <Card accent padding="lg">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-8">
                            <Eyebrow>{t('custom.eyebrow')}</Eyebrow>
                            <h2 id={CUSTOM_ID} className={cn('v2-heading m-0 mt-3 scroll-mt-28', typography.h2Sm)}>
                                {t('custom.title')}
                            </h2>
                            <p className={cn('m-0 mt-4 max-w-prose-v2 text-ink-muted', typography.lead)}>{t('custom.intro')}</p>
                            <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5">
                                <Button
                                    href={rfqHref({ type: 'specifications' })}
                                    size="lg"
                                    stretch="phone"
                                    arrow
                                    dataAttrs={{ 'data-cta': 'catalogue_requirements' }}
                                >
                                    {t('custom.form')}
                                </Button>
                                {/* WhatsApp (management) is in the hero and in the G footer just below */}
                                <Button
                                    href={mailHref}
                                    variant="outline"
                                    size="lg"
                                    stretch="phone"
                                    icon={<MailIcon size={20} />}
                                    dataAttrs={{ 'data-cta': 'catalogue_email' }}
                                >
                                    {t('custom.email')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </Section>
        </>
    );
}
