import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending } from '@/components/v2';
import Workflow from '@/components/v2/processing/Workflow';
import {
    BoxIcon,
    Breadcrumbs,
    Button,
    Card,
    DocumentIcon,
    Eyebrow,
    ExternalLink,
    FishIcon,
    IceIcon,
    PageHero,
    PlaneIcon,
    Section,
    SectionHeading,
    StatStrip,
    TextLink,
    TruckIcon,
    typography,
} from '@/components/ui';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'processing_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({
        locale,
        path: routes.processing,
        title: t('title'),
        description: t('description'),
        siteName: site('name'),
    });
}

/** The approved in-house chain (owner, 13 Nov 2026), with the five G value-chain photos. */
const STAGES = [
    { key: 'farming', image: '/images/g/farm-ponds.webp' },
    { key: 'harvest', image: '/images/g/harvest.webp' },
    { key: 'packing', image: '/images/photos/processing.webp' },
    { key: 'inspection', image: '/images/g/temperature-check.webp' },
    { key: 'export', image: '/images/g/logistics-truck.webp' },
] as const;

/** Plant location, RELEASE-DECISIONS §4 (owner, 13 Nov 2026). */
const PLANT_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=31.433264,30.475957';

const LOGISTICS: { key: 'trucks' | 'stores' | 'freight'; icon: ReactNode }[] = [
    { key: 'trucks', icon: <TruckIcon size={24} /> },
    { key: 'stores', icon: <IceIcon size={24} /> },
    { key: 'freight', icon: <PlaneIcon size={24} /> },
];

const AGREE: { key: 'species' | 'form' | 'packing' | 'labels'; icon: ReactNode }[] = [
    { key: 'species', icon: <FishIcon size={24} /> },
    { key: 'form', icon: <IceIcon size={24} /> },
    { key: 'packing', icon: <BoxIcon size={24} /> },
    { key: 'labels', icon: <DocumentIcon size={24} /> },
];

type Stat = { value: string; label: string };

/**
 * /processing ("Value chain" in the G nav), design G, built on the design-system
 * primitives (components/ui). Copy: locales/<l>/pages/v2-processing.json.
 * No temperature figures (none approved); no certificate details (see /quality).
 */
export default async function ProcessingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'processing_v2' });
    const stats = (t.raw('stats.items') ?? []) as Stat[];

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('breadcrumbs.current'), item: `${localeUrl}${routes.processing}` },
        ],
    };

    return (
        <div className={`text-ink ${typography.body}`}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

            <PageHero
                variant="split"
                image={{ src: '/images/g/sorting-packing.webp', alt: t('hero.imageAlt'), width: 1536, height: 1024 }}
                mirrorImage={locale === 'ar'}
                headingId="processing-title"
                breadcrumbs={
                    <Breadcrumbs
                        includeHome={false}
                        label={t('breadcrumbs.label')}
                        items={[{ label: t('breadcrumbs.home'), href: routes.home }, { label: t('breadcrumbs.current') }]}
                    />
                }
                eyebrow={t('hero.kicker')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                actions={
                    <>
                        <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'processing_hero_partner' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button href={routes.quality} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            {/* Key figures: same strip as the G home (approved facts only) */}
            <StatStrip label={t('stats.label')} items={stats} />

            {/* The five in-house stages */}
            <Section variant="white" labelledBy="processing-chain" reveal={false}>
                <SectionHeading id="processing-chain" eyebrow={t('chain.eyebrow')} title={t('chain.title')} intro={t('chain.intro')} />
                <Workflow
                    stages={STAGES.map((s, i) => ({
                        key: s.key,
                        label: t('chain.stageLabel', { n: i + 1 }),
                        title: t(`chain.stages.${s.key}.title`),
                        text: t(`chain.stages.${s.key}.text`),
                        image: s.image,
                        imageAlt: t(`chain.stages.${s.key}.alt`),
                        extra:
                            s.key === 'harvest' ? (
                                <ExternalLink href={PLANT_MAP_URL} newTabLabel={t('chain.newTab')} dataAttrs={{ 'data-cta': 'processing_plant_map' }}>
                                    {t('chain.plantMap')}
                                </ExternalLink>
                            ) : undefined,
                    }))}
                />
            </Section>

            {/* Own logistics: trucks, cold stores, freight. No temperature figures. */}
            <Section variant="navy" labelledBy="processing-logistics" reveal={false}>
                <SectionHeading id="processing-logistics" eyebrow={t('logistics.eyebrow')} title={t('logistics.title')} intro={t('logistics.intro')} />
                <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4 lg:gap-5">
                    {LOGISTICS.map(({ key, icon }) => (
                        <Card key={key} as="li" tone="dark" accent padding="md">
                            <span className="flex text-gold">{icon}</span>
                            <h3 className={`mb-0 mt-4 text-white ${typography.h3}`}>{t(`logistics.items.${key}.title`)}</h3>
                            <p className={`mb-0 mt-2 text-fg-muted ${typography.small}`}>{t(`logistics.items.${key}.text`)}</p>
                        </Card>
                    ))}
                </ul>
                <div className="mt-6">
                    <Pending label={t('pending.temperature')} />
                </div>
            </Section>

            {/* What is agreed per order */}
            <Section variant="white" labelledBy="processing-agree" reveal={false}>
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-3 lg:mb-4">{t('agree.eyebrow')}</Eyebrow>
                        <h2 id="processing-agree" className={`v2-heading m-0 ${typography.h2}`}>
                            {t('agree.title')}
                        </h2>
                        <p className={`mb-0 mt-4 text-ink-muted ${typography.lead}`}>{t('agree.intro')}</p>
                        <p className="mb-0 mt-6 flex items-center gap-3 font-bold text-navy">
                            <span aria-hidden="true" className="block h-0.5 w-7 shrink-0 bg-gold" />
                            {t('agree.prices')}
                        </p>
                    </div>
                    <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-4 lg:col-span-7 lg:mt-0 lg:gap-5">
                        {AGREE.map(({ key, icon }) => (
                            <Card key={key} as="li" accent padding="md">
                                <span className="flex text-navy">{icon}</span>
                                <h3 className={`mb-0 mt-4 ${typography.h3}`}>{t(`agree.items.${key}.title`)}</h3>
                                <p className={`mb-0 mt-2 text-ink-muted ${typography.small}`}>{t(`agree.items.${key}.text`)}</p>
                            </Card>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 lg:mt-8">
                    <TextLink href={routes.products}>{t('agree.speciesLink')}</TextLink>
                </div>
                <div className="mt-4">
                    <Pending label={t('pending.pack_formats')} />
                </div>
            </Section>

            {/* Closing action (DESIGN-SYSTEM §6.3: offwhite section + accent card) */}
            <Section variant="offwhite" labelledBy="processing-closing" reveal={false}>
                <Card accent padding="lg">
                    <div className="max-w-[760px]">
                        <Eyebrow className="mb-3 lg:mb-4">{t('closing.eyebrow')}</Eyebrow>
                        <h2 id="processing-closing" className={`v2-heading m-0 ${typography.h2}`}>
                            {t('closing.title')}
                        </h2>
                        <p className="mb-0 mt-4 text-ink-muted">{t('closing.text')}</p>
                    </div>
                    <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                        <Button href={routes.contact} size="lg" stretch="phone" dataAttrs={{ 'data-cta': 'processing_closing_partner' }}>
                            {t('closing.primary')}
                        </Button>
                        <Button href={rfqHref({ type: 'specifications' })} variant="outline" size="lg" stretch="phone">
                            {t('closing.secondary')}
                        </Button>
                    </div>
                </Card>
            </Section>
        </div>
    );
}
