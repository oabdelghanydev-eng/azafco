import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending, SHOW_PENDING } from '@/components/v2';
import FAQAccordion from '@/components/v2/FAQAccordion';
import CertificateLibrary from '@/components/v2/quality/CertificateLibrary';
import Workflow from '@/components/v2/quality/Workflow';
import { Breadcrumbs, Button, ExternalLink, PageHero, Section, SectionHeading, isolateStandards, typography } from '@/components/ui';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quality_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.quality, title: t('title'), description: t('description'), siteName: site('name') });
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

/** One FAQ item: the three standard names (ROUND1-SPEC §1.1). */
const FAQ = [1] as const;

/**
 * /quality ("Packing and quality" in the G nav), design G, built on the design-system
 * primitives (components/ui). Since 26 Nov 2026 (SIMPLIFY-SPEC §1.1) it also carries
 * the five stages of the former /processing page, which now redirects here.
 * Order: head (h1 and what the plant does, no contact buttons), the five stages,
 * the generic ISO sentence ("We hold ISO certificates, certified by TÜV AUSTRIA",
 * ROUND1-SPEC §1.1) with the EU approval line and the documents button, one FAQ item.
 * Each fact once: the inspection sentence sits under stage 4 (it was in the head
 * until 26 Nov 2026, which left the stage empty), and the capacity and truck
 * sentence (ROUND1-SPEC §1.2) sits under Export.
 * The three standard names appear here only in the FAQ answer (and in the
 * Organization JSON-LD). No numbers, expiry dates, site, scope or "copies on
 * request"; no ISO 22000 / HACCP; no temperature figures (none approved).
 * Copy: locales/<l>/pages/v2-quality.json.
 */
export default async function QualityPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'quality_v2' });

    // Visible FAQ and FAQPage JSON-LD come from the same keys, so they stay in step.
    const faq = FAQ.map((n) => ({
        id: `q${n}`,
        question: t(`faq.q${n}`),
        answer: isolateStandards(t(`faq.a${n}`)),
        text: t(`faq.a${n}`),
    }));

    const localeUrl = `${baseUrl}/${locale}`;
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: t('breadcrumbs.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: t('breadcrumbs.current'), item: `${localeUrl}${routes.quality}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
        },
    ];

    return (
        <div className={`text-ink ${typography.body}`}>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            {/* Head: no contact buttons (SIMPLIFY-SPEC §1.5); the header, footer and WhatsApp float carry the contact */}
            <PageHero
                variant="split"
                image={{ src: '/images/g/sorting-packing.webp', alt: t('hero.imageAlt'), width: 1536, height: 1024 }}
                mirrorImage={locale === 'ar'}
                headingId="quality-title"
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
            />

            {/* The five in-house stages */}
            <Section variant="white" labelledBy="quality-chain" reveal={false}>
                <SectionHeading id="quality-chain" title={t('chain.title')} />
                <Workflow
                    stages={STAGES.map((s, i) => ({
                        key: s.key,
                        label: t('chain.stageLabel', { n: i + 1 }),
                        title: t(`chain.stages.${s.key}.title`),
                        text: t(`chain.stages.${s.key}.text`),
                        image: s.image,
                        imageAlt: t(`chain.stages.${s.key}.alt`),
                        note: s.key === 'export' ? t('chain.capacity') : undefined,
                        extra:
                            s.key === 'harvest' ? (
                                <ExternalLink href={PLANT_MAP_URL} newTabLabel={t('chain.newTab')} dataAttrs={{ 'data-cta': 'quality_plant_map' }}>
                                    {t('chain.plantMap')}
                                </ExternalLink>
                            ) : undefined,
                    }))}
                />
                {SHOW_PENDING ? (
                    <div className="mt-10 flex flex-wrap gap-2">
                        <Pending label={t('pending.temperature')} />
                        <Pending label={t('pending.pack_formats')} />
                    </div>
                ) : null}
            </Section>

            {/* ISO: one generic statement (ROUND1-SPEC §1.1) */}
            <Section variant="offwhite" labelledBy="quality-certs" reveal={false}>
                <SectionHeading id="quality-certs" title={t('certs.title')} />
                <CertificateLibrary locale={locale} />
                {/* EU export status (owner, 22 Nov 2026: approved; never print a number or date)
                    and the documents button (ROUND-ASTRA-SPEC §1.7, §3.4); it opens /contact since 26 Nov 2026,
                    where the email row is the export team for details and documents */}
                <div className="mt-8 flex max-w-[920px] flex-col items-start gap-3">
                    <p className={`m-0 font-semibold text-navy ${typography.body}`}>{t('pending.market_approvals')}</p>
                    <Button href={routes.contact} variant="outline" dataAttrs={{ 'data-cta': 'quality_documents' }}>
                        {t('next.button')}
                    </Button>
                </div>
                {SHOW_PENDING ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Pending label={t('pending.traceability')} />
                    </div>
                ) : null}
            </Section>

            <Section variant="white" labelledBy="quality-faq" reveal={false}>
                <SectionHeading id="quality-faq" title={t('faq.title')} />
                <FAQAccordion items={faq} exclusiveName="quality-faq" className="max-w-[920px]" />
            </Section>
        </div>
    );
}
