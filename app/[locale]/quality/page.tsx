import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending } from '@/components/v2';
import { G_FOCUS, GButton, GClosing, GPageHero, GSection, GSectionHead, GTextLink, gType } from '@/components/v2/processing/GPage';
import CertificateLibrary from '@/components/v2/quality/CertificateLibrary';
import GFaq from '@/components/v2/quality/GFaq';
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

const STEPS = ['spec', 'packing', 'final', 'cold'] as const;
const FAQ = [1, 2, 3, 4, 5, 6] as const;

/**
 * /quality, design G. Owner decision 13 Nov 2026: "we hold ISO certificates": the three
 * standard names with one plain line each, "certified by TÜV AUSTRIA" once; no numbers,
 * expiry dates, site, holder, scope, images or "copies on request".
 * Copy: locales/<l>/pages/v2-quality.json.
 */
export default async function QualityPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'quality_v2' });
    const ar = locale === 'ar';
    const ty = gType(ar);

    const { email, social } = companyConfig.contact;
    const inlineLink = `font-semibold text-[#002d72] underline underline-offset-4 hover:text-[#001b47] ${G_FOCUS}`;
    // a6 carries <wa>/<mail> tags: links on the page, plain text in the FAQPage JSON-LD.
    const richTags = {
        wa: (c: ReactNode) => (
            <a href={social.whatsapp} dir="ltr" data-cta="quality_faq_whatsapp" className={inlineLink}>
                {c}
            </a>
        ),
        mail: (c: ReactNode) => (
            <a href={`mailto:${email}`} data-cta="quality_faq_email" className={inlineLink}>
                {c}
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
        <div className={`g-scope text-[#0d1f3f] ${ty.base}`}>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <GPageHero
                ar={ar}
                image="/images/g/fish-on-ice.webp"
                imageAlt={t('hero.imageAlt')}
                crumbsLabel={t('breadcrumbs.label')}
                crumbs={[{ label: t('breadcrumbs.home'), href: routes.home }, { label: t('breadcrumbs.current') }]}
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                actions={
                    <>
                        <GButton ar={ar} href={routes.contact} variant="gold">
                            {t('hero.primary')}
                        </GButton>
                        <GButton ar={ar} href={routes.processing} variant="outlineLight">
                            {t('hero.secondary')}
                        </GButton>
                    </>
                }
            />

            {/* ISO certificates: names and one line each; certifier named once (intro) */}
            <GSection tone="white" labelledBy="quality-certs">
                <GSectionHead ar={ar} id="quality-certs" eyebrow={t('certs.eyebrow')} title={t('certs.title')} intro={t('certs.intro')} />
                <CertificateLibrary locale={locale} />
            </GSection>

            {/* Quality on every order: the working steps (not a certification) */}
            <GSection tone="offwhite" labelledBy="quality-practice">
                <GSectionHead ar={ar} id="quality-practice" eyebrow={t('practice.eyebrow')} title={t('practice.title')} intro={t('practice.intro')} />
                <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5">
                    {STEPS.map((k, i) => (
                        <li key={k} className="flex flex-col rounded border border-solid border-[#d5dde9] bg-white p-5 lg:p-6">
                            <p className={`m-0 flex items-center gap-3 text-[#002d72] ${ty.stage}`}>
                                <span aria-hidden="true" className="block h-[2px] w-7 shrink-0 bg-[#f7b500]" />
                                {t('practice.stepLabel', { n: i + 1 })}
                            </p>
                            <h3 className={`mb-0 mt-3 ${ty.h3}`}>{t(`practice.steps.${k}.title`)}</h3>
                            <p className={`mb-0 mt-2 text-[#4a5a75] ${ty.small}`}>{t(`practice.steps.${k}.text`)}</p>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 lg:mt-8">
                    <GTextLink ar={ar} href={routes.processing}>
                        {t('practice.link')}
                    </GTextLink>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Pending label={t('pending.traceability')} />
                    <Pending label={t('pending.market_approvals')} />
                </div>
            </GSection>

            <GSection tone="white" labelledBy="quality-faq">
                <GSectionHead ar={ar} id="quality-faq" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                <div className="max-w-[920px]">
                    <GFaq ar={ar} items={faq} />
                </div>
            </GSection>

            <GClosing
                ar={ar}
                id="quality-closing"
                eyebrow={t('closing.eyebrow')}
                title={t('closing.title')}
                text={t('closing.text')}
                actions={
                    <>
                        <GButton ar={ar} href={routes.contact} variant="gold">
                            {t('closing.primary')}
                        </GButton>
                        <GButton ar={ar} href={rfqHref({ type: 'specifications' })} variant="outline">
                            {t('closing.secondary')}
                        </GButton>
                        <GButton ar={ar} href={social.whatsapp} variant="outline" cta="quality_whatsapp">
                            {t('closing.whatsapp')}
                        </GButton>
                        <GButton ar={ar} href={`mailto:${email}`} variant="outline" cta="quality_email">
                            {t('closing.email')}
                        </GButton>
                    </>
                }
            />
        </div>
    );
}
