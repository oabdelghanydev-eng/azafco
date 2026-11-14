import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending, SHOW_PENDING } from '@/components/v2';
import Workflow from '@/components/v2/processing/Workflow';
import { Breadcrumbs, Button, Eyebrow, ExternalLink, PageHero, Section, SectionHeading, typography } from '@/components/ui';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { routes } from '@/lib/v2/routes';

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

/**
 * /processing ("Packing and shipping" in the G nav), design G, built on the
 * design-system primitives (components/ui). Copy: locales/<l>/pages/v2-processing.json.
 * Round 1 (ROUND1-SPEC §3 /processing, 14 Nov 2026): no stat row, no "what we agree"
 * block; logistics is one paragraph plus the truck sentence (§1.2). Order of
 * operations per §2.4. No temperature figures (none approved); no ISO (see /quality).
 */
export default async function ProcessingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'processing_v2' });

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

            {/* The five in-house stages */}
            <Section variant="white" labelledBy="processing-chain" reveal={false}>
                <SectionHeading id="processing-chain" eyebrow={t('chain.eyebrow')} title={t('chain.title')} />
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

            {/* Own logistics: one paragraph plus the capacity/truck sentence (ROUND1-SPEC §1.2). No temperature figures. */}
            <Section variant="navy" labelledBy="processing-logistics" reveal={false}>
                {/* Hand-built heading (as the G split blocks): SectionHeading's bottom margin would leave a gap with no content under it */}
                <div className="max-w-[760px]">
                    <Eyebrow className="mb-3 lg:mb-4">{t('logistics.eyebrow')}</Eyebrow>
                    <h2 id="processing-logistics" className={`v2-heading m-0 ${typography.h2}`}>
                        {t('logistics.title')}
                    </h2>
                    <p className={`mb-0 mt-4 text-fg-muted lg:mt-5 ${typography.lead}`}>{t('logistics.text')}</p>
                    <p className={`mb-0 mt-4 font-semibold text-fg ${typography.lead}`}>{t('logistics.capacity')}</p>
                </div>
                {SHOW_PENDING ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Pending label={t('pending.temperature')} />
                        <Pending label={t('pending.pack_formats')} />
                    </div>
                ) : null}
            </Section>
        </div>
    );
}
