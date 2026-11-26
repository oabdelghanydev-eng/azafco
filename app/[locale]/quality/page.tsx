import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending, SHOW_PENDING } from '@/components/v2';
import FAQAccordion from '@/components/v2/FAQAccordion';
import CertificateLibrary from '@/components/v2/quality/CertificateLibrary';
import { Breadcrumbs, Button, PageHero, Section, SectionHeading, isolateStandards, typography } from '@/components/ui';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quality_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.quality, title: t('title'), description: t('description'), siteName: site('name') });
}

/** One FAQ item: the three standard names (ROUND1-SPEC §1.1). The cold-chain item was cut in the review round: /processing covers it. */
const FAQ = [1] as const;

/**
 * /quality, design G, built on the design-system primitives (components/ui).
 * Round 1 (ROUND1-SPEC §1.1, §3 /quality, 14 Nov 2026): lead with the inspection on
 * every order (hero), then the generic ISO sentence ("We hold ISO
 * certificates, certified by TÜV AUSTRIA"), which lives only in the certificates block. The three standard names appear here only in the FAQ answer (and in
 * the Organization JSON-LD). No numbers, expiry dates, site, scope or "copies on
 * request"; no ISO 22000 / HACCP; nothing that implies a food-safety certificate.
 * The working stages live on /processing (linked, not repeated).
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

            <PageHero
                variant="split"
                image={{ src: '/images/g/fish-on-ice.webp', alt: t('hero.imageAlt'), width: 1920, height: 1080 }}
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
                actions={
                    <>
                        <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'quality_hero_partner' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button href={routes.processing} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

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
