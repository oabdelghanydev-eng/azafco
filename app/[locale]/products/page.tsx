import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Button,
    Card,
    CheckIcon,
    DocumentIcon,
    Eyebrow,
    MailIcon,
    PageHead,
    Section,
    SectionHeading,
    StatStrip,
    WhatsAppIcon,
    cn,
    typography,
} from '@/components/ui';
import FeatureGrid from '@/components/v2/FeatureGrid';
import CatalogueBrowser from '@/components/v2/products/CatalogueBrowser';
import { SpeciesRow } from '@/components/v2/products/SpeciesRow';
import { baseUrl, getCatalogue, getRootT, getSearchNames, getSpecView, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { companyConfig } from '@/config/company.config';
import { productCategories } from '@/data/products';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

/** id of the closing "custom requirements" heading; the hero's partnership button points here */
const CUSTOM_ID = 'catalogue-custom';

/** Approved company facts (RELEASE-DECISIONS, 13 Nov 2026). The species count is in the h1. */
const FACTS = ['markets', 'founded', 'iso', 'capacity'] as const;

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
        if (spec.pack) facts.push({ label: t('detail.packaging'), value: spec.pack });
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
    const { email, social } = companyConfig.contact;
    const whatsappHref = `${social.whatsapp}?text=${encodeURIComponent(t('hero.whatsapp_message'))}`;
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
                    <Button href={`#${CUSTOM_ID}`} external size="lg" stretch="phone" arrow>
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

            {/* Supplier proof above the fold: the G home key-figures strip */}
            <StatStrip
                label={t('hero.facts.label')}
                items={FACTS.map((k) => ({ value: t(`hero.facts.${k}.value`), label: t(`hero.facts.${k}.label`) }))}
            />

            {/* The species register: the one list on this page */}
            <Section variant="white" labelledBy="catalogue-species">
                <SectionHeading id="catalogue-species" eyebrow={t('grid.eyebrow')} title={t('grid.title')} intro={t('grid.intro')} />
                <CatalogueBrowser items={items} categories={categories} />

                {/* Owner, 13 Nov 2026: the 12 are the main species; others on request */}
                <p className={cn('m-0 mt-8 border-0 border-s-2 border-solid border-gold ps-4 font-medium text-fg', typography.lead)}>
                    {t('grid.more_species')}
                </p>

                {/* Specifications and prices are confirmed per order */}
                <Card as="aside" padding="md" className="mt-12 flex flex-col gap-4 border-s-4 border-s-gold bg-surface-offwhite sm:flex-row" >
                    <span className="flex h-tap w-tap shrink-0 items-center justify-center rounded-control bg-white text-navy">
                        <DocumentIcon size={24} />
                    </span>
                    <div className="min-w-0">
                        <h3 className={cn('m-0 text-navy', typography.h3)}>{t('note.title')}</h3>
                        <p className={cn('m-0 mt-2 max-w-prose-v2 text-ink-muted', typography.body)}>{t('note.text')}</p>
                    </div>
                </Card>
            </Section>

            <Section variant="offwhite" labelledBy="catalogue-specify">
                <SectionHeading id="catalogue-specify" eyebrow={t('specify.eyebrow')} title={t('specify.title')} intro={t('specify.intro')} />
                <FeatureGrid
                    columns={3}
                    items={specify.map((k) => ({
                        icon: <CheckIcon size={24} />,
                        title: t(`specify.${k}_title`),
                        description: t(`specify.${k}_text`),
                    }))}
                />
            </Section>

            <Section variant="white" labelledBy="catalogue-proof">
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

            {/* Closing: custom requirements (offwhite + accent card; the G footer carries the contact block) */}
            <Section variant="offwhite" labelledBy={CUSTOM_ID}>
                <Card accent padding="lg">
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-7">
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
                        <div className="lg:col-span-5">
                            <h3 id="catalogue-next" className={cn('m-0 text-ink', typography.h4)}>
                                {t('custom.after_title')}
                            </h3>
                            <ol aria-labelledby="catalogue-next" className="m-0 mt-4 list-none space-y-3 border-0 border-t border-solid border-line p-0 pt-4">
                                {(['after_1', 'after_2', 'after_3'] as const).map((k) => (
                                    <li key={k} className={cn('flex gap-3 text-ink-muted', typography.body)}>
                                        <CheckIcon size={20} className="mt-1 shrink-0 text-navy" />
                                        <span>{t(`custom.${k}`)}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </Card>
            </Section>
        </>
    );
}
