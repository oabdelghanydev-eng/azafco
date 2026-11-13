import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Pending } from '@/components/v2';
import { GButton, GClosing, GExternalLink, GEyebrow, GPageHero, GSection, GSectionHead, GTextLink, gType } from '@/components/v2/processing/GPage';
import Workflow from '@/components/v2/processing/Workflow';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { rfqHref, routes } from '@/lib/v2/routes';
import { companyConfig } from '@/config/company.config';

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

const LOGISTICS = ['trucks', 'stores', 'freight'] as const;
const AGREE = ['species', 'form', 'packing', 'labels'] as const;

type Stat = { value: string; label: string };

/**
 * /processing ("Value chain" in the G nav), design G. Copy: locales/<l>/pages/v2-processing.json.
 * No temperature figures (none approved); no certificate details (see /quality).
 */
export default async function ProcessingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'processing_v2' });
    const ar = locale === 'ar';
    const ty = gType(ar);
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
        <div className={`g-scope text-[#0d1f3f] ${ty.base}`}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

            <GPageHero
                ar={ar}
                image="/images/g/sorting-packing.webp"
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
                        <GButton ar={ar} href={routes.quality} variant="outlineLight">
                            {t('hero.secondary')}
                        </GButton>
                    </>
                }
            />

            {/* Key figures: same strip as the G home (approved facts only) */}
            <section aria-label={t('stats.label')} className="bg-white">
                <div className="mx-auto box-border max-w-[1320px] lg:px-8">
                    <dl className="m-0 grid grid-cols-2 border-0 border-b border-solid border-[#e3e8f0] px-5 lg:grid-cols-4 lg:px-0">
                        {stats.map((s, k) => (
                            <div
                                key={s.label}
                                className={`flex flex-col-reverse py-6 lg:border-0 lg:py-9 ${k % 2 === 0 ? 'pe-3' : 'border-0 border-s border-solid border-[#e3e8f0] ps-4 lg:ps-0'} ${
                                    k < 2 ? 'border-b border-solid border-[#e3e8f0] lg:border-b-0' : ''
                                }`}
                            >
                                <dt className={`font-semibold text-[#4a5a75] ${ar ? 'mt-2 text-[15px] leading-[1.6] lg:text-[18px]' : 'mt-1.5 text-[14px] lg:mt-2 lg:text-[17px]'}`}>
                                    {s.label}
                                </dt>
                                <dd className={`m-0 text-[42px] font-extrabold leading-none text-[#002d72] lg:text-[56px] ${ar ? '' : 'tracking-[-0.02em]'}`}>
                                    {s.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* The five in-house stages */}
            <GSection tone="white" labelledBy="processing-chain">
                <GSectionHead ar={ar} id="processing-chain" eyebrow={t('chain.eyebrow')} title={t('chain.title')} intro={t('chain.intro')} />
                <Workflow
                    ar={ar}
                    stages={STAGES.map((s, i) => ({
                        key: s.key,
                        label: t('chain.stageLabel', { n: i + 1 }),
                        title: t(`chain.stages.${s.key}.title`),
                        text: t(`chain.stages.${s.key}.text`),
                        image: s.image,
                        imageAlt: t(`chain.stages.${s.key}.alt`),
                        extra:
                            s.key === 'harvest' ? (
                                <GExternalLink ar={ar} href={PLANT_MAP_URL} newTabHint={t('chain.newTab')} cta="processing_plant_map">
                                    {t('chain.plantMap')}
                                </GExternalLink>
                            ) : undefined,
                    }))}
                />
            </GSection>

            {/* Own logistics: trucks, cold stores, freight. No temperature figures. */}
            <GSection tone="navy" labelledBy="processing-logistics">
                <GSectionHead ar={ar} id="processing-logistics" onDark eyebrow={t('logistics.eyebrow')} title={t('logistics.title')} intro={t('logistics.intro')} />
                <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4 lg:gap-5">
                    {LOGISTICS.map((k) => (
                        <li key={k} className="rounded border border-t-4 border-white/20 border-t-[#f7b500] bg-white/[.04] p-5 lg:p-7">
                            <h3 className={`m-0 text-white ${ty.h3}`}>{t(`logistics.items.${k}.title`)}</h3>
                            <p className={`mb-0 mt-2 text-white/[.86] ${ty.small}`}>{t(`logistics.items.${k}.text`)}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    <Pending label={t('pending.temperature')} />
                </div>
            </GSection>

            {/* What is agreed per order */}
            <GSection tone="white" labelledBy="processing-agree">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                    <div className="lg:col-span-5">
                        <GEyebrow ar={ar}>{t('agree.eyebrow')}</GEyebrow>
                        <h2 id="processing-agree" className={`m-0 ${ty.h2}`}>
                            {t('agree.title')}
                        </h2>
                        <p className={`mb-0 text-[#4a5a75] ${ar ? 'mt-3.5' : 'mt-4'}`}>{t('agree.intro')}</p>
                        <p className="mb-0 mt-6 inline-flex items-center gap-3 font-bold text-[#002d72]">
                            <span aria-hidden="true" className="block h-[2px] w-7 shrink-0 bg-[#f7b500]" />
                            {t('agree.prices')}
                        </p>
                    </div>
                    <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:gap-4 lg:col-span-7 lg:mt-0 lg:gap-5">
                        {AGREE.map((k) => (
                            <li key={k} className="rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-white p-5 lg:p-7">
                                <h3 className={`m-0 ${ty.h3}`}>{t(`agree.items.${k}.title`)}</h3>
                                <p className={`mb-0 mt-2 text-[#4a5a75] ${ty.small}`}>{t(`agree.items.${k}.text`)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 lg:mt-8">
                    <GTextLink ar={ar} href={routes.products}>
                        {t('agree.speciesLink')}
                    </GTextLink>
                </div>
                <div className="mt-4">
                    <Pending label={t('pending.pack_formats')} />
                </div>
            </GSection>

            <GClosing
                ar={ar}
                id="processing-closing"
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
                        <GButton ar={ar} href={companyConfig.contact.social.whatsapp} variant="outline" cta="processing_whatsapp">
                            {t('closing.whatsapp')}
                        </GButton>
                    </>
                }
            />
        </div>
    );
}
