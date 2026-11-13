import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Button, CTABand, DocumentIcon, FeatureGrid, PageHero, ProcessSteps, Section, SectionHeader } from '@/components/v2';
import { insightHref, productHref, rfqHref, routes } from '@/lib/v2/routes';
import { companyConfig } from '@/config/company.config';
import { Link } from '@/navigation';
import { products } from '@/data/products';
import { activeMarketSlugs } from '@/data/markets';
import { activeMarketConfigs, getActiveMarketConfig, pausedMarkets, plannedMarkets, regionOf } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import { GFactCards, GPageScope } from '@/components/v2/markets/GBits';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';

type Props = { params: Promise<{ locale: string; slug: string }> };
type Item = { title: string; text: string };

/** Plant location (RELEASE-DECISIONS §4, approved map link) */
const PLANT_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=31.433264,30.475957';

/** Country name for use inside a sentence ("the United Arab Emirates"); falls back to the bare name. */
function sentenceName(tm: { has: (k: string) => boolean; (k: string): string }, key: string): string {
    return tm.has(`${key}.sentence`) ? tm(`${key}.sentence`) : tm(`${key}.country`);
}

// Only active markets get a page; any other slug is a 404
export const dynamicParams = false;

export function generateStaticParams() {
    return activeMarketSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const market = getActiveMarketConfig(slug);
    if (!market) return {};
    const tAll = await getTranslations({ locale });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const country = sentenceName(tm, market.key);
    const year = String(market.since ?? '');
    return pageMetadata({
        locale,
        path: `${routes.markets}/${slug}`,
        title: tAll('markets_v2.detail.meta_title', { country }),
        description: tAll('markets_v2.detail.meta_description', { country, year }),
    });
}

export default async function MarketDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const market = getActiveMarketConfig(slug);
    if (!market) notFound();
    setRequestLocale(locale);
    const ar = locale === 'ar';

    const t = await getTranslations({ locale, namespace: 'markets_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const tp = await getTranslations({ locale, namespace: 'data.products' });
    // Bare name for breadcrumbs and headings that start with it; sentence form inside running text
    const country = tm(`${market.key}.country`);
    const inCountry = sentenceName(tm, market.key);
    const year = String(market.since ?? '');

    const discuss = (t.raw('detail.discuss') as Item[]).map((d) => ({
        title: d.title,
        description: d.text.replace('{country}', inCountry),
    }));
    const steps = t.raw('process.steps') as Item[];

    const facts = [
        ...(market.since ? [{ label: t('detail.facts.since_label'), value: year }] : []),
        { label: t('detail.facts.region_label'), value: t(`regions.${regionOf(market)}`) },
        {
            label: t('detail.facts.plant_label'),
            value: t('detail.facts.plant_value'),
            link: { href: PLANT_MAP_URL, label: t('detail.facts.plant_link'), external: true, newTabLabel: tv('cta.opens_new_tab') },
        },
        {
            label: t('detail.facts.quality_label'),
            value: t('detail.facts.quality_value'),
            link: { href: routes.quality, label: t('detail.facts.quality_link') },
        },
        { label: t('detail.facts.transport_label'), value: t('detail.facts.transport_value') },
        { label: t('detail.facts.prices_label'), value: t('detail.facts.prices_value') },
    ];

    const active = activeMarketConfigs.map((m) => ({
        key: m.key,
        countryCode: m.countryCode,
        name: tm(`${m.key}.country`),
        short: tm(`${m.key}.short`),
        since: m.since ? t('index.since', { year: String(m.since) }) : '',
    }));
    const planned = plannedMarkets.map((m) => ({ key: m.key, countryCode: m.countryCode, name: tm(`${m.key}.country`) }));
    const pausedNote = pausedMarkets.map((m) => t('index.paused', { country: tm(`${m.key}.country`) })).join(' · ') || undefined;

    return (
        <GPageScope>
            <JsonLd
                data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [
                    { name: t('breadcrumb'), path: routes.markets },
                    { name: country, path: `${routes.markets}/${slug}` },
                ])}
            />

            <PageHero
                variant="split"
                image={{ src: '/images/g/fish-on-ice.webp', alt: t('detail.image_alt'), width: 1920, height: 1080 }}
                eyebrow={market.since ? t('detail.eyebrow', { year }) : t('index.eyebrow')}
                title={t('detail.title', { country: inCountry })}
                intro={t('detail.intro', { country: inCountry, year })}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.markets }, { label: country }]} />}
                primaryAction={{ label: t('detail.primary'), href: rfqHref({ country: market.countryCode, type: 'market' }) }}
                secondaryAction={{ label: t('detail.secondary'), href: companyConfig.contact.social.whatsapp, external: true }}
            />

            {/* At a glance + what we agree */}
            <Section variant="offwhite" labelledBy="md-discuss">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-4">
                        <h2 id="md-facts" className="m-0 mb-5 font-display text-heading-md text-[#002d72]">
                            {t('detail.facts_title', { country })}
                        </h2>
                        <GFactCards items={facts} ar={ar} className="sm:grid-cols-2 lg:grid-cols-1" />
                    </div>
                    <div className="lg:col-span-8">
                        <SectionHeader id="md-discuss" size="md" eyebrow={t('detail.discuss_eyebrow')} title={t('detail.discuss_title', { country: inCountry })} />
                        <FeatureGrid columns={2} style="card" items={discuss} />
                        <div className="mt-6">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon size={18} />}>
                                {t('support.guide_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* This market on the route map, with links to the other markets */}
            <MarketsIndex
                headingId="md-markets"
                eyebrow={t('detail.map_eyebrow')}
                title={t('detail.map_title', { country: inCountry })}
                intro={t('detail.map_intro')}
                active={active}
                planned={planned}
                plannedTitle={t('index.planned_title')}
                pausedNote={pausedNote}
                current={market.key}
                mapLabel={t('index.map_label')}
                origin={t('index.origin')}
                ar={ar}
            />

            {/* Main species */}
            <Section variant="light" labelledBy="md-products">
                <SectionHeader id="md-products" size="md" eyebrow={t('detail.products_eyebrow')} title={t('detail.products_title')} intro={t('detail.products_note')} />
                <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                    {products.map((p) => (
                        <li key={p.slug}>
                            <Link
                                href={productHref(p.slug)}
                                className="inline-flex min-h-[44px] items-center rounded-full border border-[#d5dde9] bg-white px-5 text-body-sm font-semibold text-[#002d72] transition-colors duration-200 hover:border-[#002d72] hover:bg-[#f2f5fa] motion-reduce:transition-none"
                            >
                                {tp(`${p.translationKey}.name`)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* How to start (off-white: the contact band below is navy) */}
            <Section variant="offwhite" labelledBy="md-process">
                <SectionHeader id="md-process" size="md" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {/* One-tap next step: WhatsApp (management) and email (export team) + what happens next */}
            <CTABand placement="inline" headingId="md-contact" prefill={{ country: market.countryCode, type: 'market' }} />

            <Section variant="light" spacing="sm" reveal={false}>
                <p className="m-0 text-body-sm text-[#4a5a75]">{t('disclaimer')}</p>
            </Section>
        </GPageScope>
    );
}
