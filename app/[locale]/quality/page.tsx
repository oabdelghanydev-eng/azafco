import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending } from '@/components/v2';
import FAQAccordion from '@/components/v2/FAQAccordion';
import CertificateLibrary from '@/components/v2/quality/CertificateLibrary';
import {
    BoxIcon,
    Breadcrumbs,
    Button,
    Card,
    ClipboardCheckIcon,
    DocumentIcon,
    Eyebrow,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    TruckIcon,
    focusRing,
    typography,
} from '@/components/ui';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { rfqHref, routes } from '@/lib/v2/routes';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quality_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.quality, title: t('title'), description: t('description'), siteName: site('name') });
}

const STEPS: { key: 'spec' | 'packing' | 'final' | 'cold'; icon: ReactNode }[] = [
    { key: 'spec', icon: <DocumentIcon size={24} /> },
    { key: 'packing', icon: <BoxIcon size={24} /> },
    { key: 'final', icon: <ClipboardCheckIcon size={24} /> },
    { key: 'cold', icon: <TruckIcon size={24} /> },
];
const FAQ = [1, 2, 3, 4, 5, 6] as const;

/**
 * /quality, design G, built on the design-system primitives (components/ui).
 * Owner decision 13 Nov 2026 (RELEASE-DECISIONS §3): "we hold ISO certificates": the
 * three standard names with one plain line each, "certified by TÜV AUSTRIA" once; no
 * numbers, expiry dates, site, holder, scope, images or "copies on request"; no
 * ISO 22000 / HACCP. Copy: locales/<l>/pages/v2-quality.json.
 */
export default async function QualityPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'quality_v2' });

    const { email, social } = companyConfig.contact;
    const inlineLink = `font-semibold text-navy underline underline-offset-4 hover:text-navy-900 ${focusRing}`;
    // a6 carries <wa>/<mail> tags: links on the page, plain text in the FAQPage JSON-LD.
    const richTags = {
        wa: (c: ReactNode) => (
            <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" data-cta="quality_faq_whatsapp" className={inlineLink}>
                <bdi dir="ltr">{c}</bdi>
                <span className="sr-only"> {t('newTab')}</span>
            </a>
        ),
        mail: (c: ReactNode) => (
            <a href={`mailto:${email}`} data-cta="quality_faq_email" className={inlineLink}>
                <bdi dir="ltr">{c}</bdi>
            </a>
        ),
    };
    const plainTags = { wa: (c: string) => c, mail: (c: string) => c };
    const faq = FAQ.map((n) => ({
        id: `q${n}`,
        question: t(`faq.q${n}`),
        answer: t.rich(`faq.a${n}`, richTags),
        text: t.markup(`faq.a${n}`, plainTags),
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

            {/* ISO certificates: names and one line each; certifier named once (intro) */}
            <Section variant="white" labelledBy="quality-certs" reveal={false}>
                <SectionHeading id="quality-certs" eyebrow={t('certs.eyebrow')} title={t('certs.title')} intro={t('certs.intro')} />
                <CertificateLibrary locale={locale} />
            </Section>

            {/* Quality on every order: the working steps (not a certification) */}
            <Section variant="offwhite" labelledBy="quality-practice" reveal={false}>
                <SectionHeading id="quality-practice" eyebrow={t('practice.eyebrow')} title={t('practice.title')} intro={t('practice.intro')} />
                <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5">
                    {STEPS.map(({ key, icon }, i) => (
                        <Card key={key} as="li" padding="md" className="flex flex-col">
                            <div className="flex items-center justify-between gap-3">
                                <Eyebrow tone="light">{t('practice.stepLabel', { n: i + 1 })}</Eyebrow>
                                <span className="flex text-navy">{icon}</span>
                            </div>
                            <h3 className={`mb-0 mt-4 ${typography.h3}`}>{t(`practice.steps.${key}.title`)}</h3>
                            <p className={`mb-0 mt-2 text-ink-muted ${typography.small}`}>{t(`practice.steps.${key}.text`)}</p>
                        </Card>
                    ))}
                </ol>
                <div className="mt-6 lg:mt-8">
                    <TextLink href={routes.processing}>{t('practice.link')}</TextLink>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Pending label={t('pending.traceability')} />
                    <Pending label={t('pending.market_approvals')} />
                </div>
            </Section>

            <Section variant="white" labelledBy="quality-faq" reveal={false}>
                <SectionHeading id="quality-faq" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                <FAQAccordion items={faq} exclusiveName="quality-faq" className="max-w-[920px]" />
            </Section>

            {/* Closing action (DESIGN-SYSTEM §6.3: offwhite section + accent card) */}
            <Section variant="offwhite" labelledBy="quality-closing" reveal={false}>
                <Card accent padding="lg">
                    <div className="max-w-[760px]">
                        <Eyebrow className="mb-3 lg:mb-4">{t('closing.eyebrow')}</Eyebrow>
                        <h2 id="quality-closing" className={`v2-heading m-0 ${typography.h2}`}>
                            {t('closing.title')}
                        </h2>
                        <p className="mb-0 mt-4 text-ink-muted">{t('closing.text')}</p>
                    </div>
                    <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                        <Button href={routes.contact} size="lg" stretch="phone" dataAttrs={{ 'data-cta': 'quality_closing_partner' }}>
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
