import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Badge,
    Breadcrumbs,
    Button,
    Card,
    DocumentIcon,
    FactCards,
    PageHero,
    Section,
    SectionHeading,
    WhatsAppIcon,
    buttonClass,
    cn,
    typography,
} from '@/components/ui';
import FeatureGrid from '@/components/v2/FeatureGrid';
import ProcessSteps from '@/components/v2/ProcessSteps';
import { insightHref, productHref, rfqHref, routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { Link } from '@/navigation';
import { products } from '@/data/products';
import { activeMarketSlugs } from '@/data/markets';
import { activeMarketConfigs, getActiveMarketConfig, pausedMarkets, plannedMarkets, regionOf } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
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

    const t = await getTranslations({ locale, namespace: 'markets_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const tp = await getTranslations({ locale, namespace: 'data.products' });
    // Management WhatsApp with the standard prefilled opening (g_header_v2.whatsapp_message)
    const waHref = whatsappLink((await getTranslations({ locale, namespace: 'g_header_v2' }))('whatsapp_message'));
    // Bare name for breadcrumbs and headings that start with it; sentence form inside running text
    const country = tm(`${market.key}.country`);
    const inCountry = sentenceName(tm, market.key);
    const year = String(market.since ?? '');
    const note = tm.has(`${market.key}.note`) ? tm(`${market.key}.note`) : undefined;
    const buyers = tm.has(`${market.key}.buyers`) ? (tm.raw(`${market.key}.buyers`) as string[]) : [];
    const newTab = tv('cta.opens_new_tab');

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
            link: { href: PLANT_MAP_URL, label: t('detail.facts.plant_link'), external: true, newTabLabel: newTab },
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
        <>
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
                actions={
                    <>
                        <Button
                            href={rfqHref({ country: market.countryCode, type: 'market' })}
                            size="lg"
                            stretch="phone"
                            arrow
                            dataAttrs={{ 'data-cta': 'market_hero_partnership' }}
                        >
                            {t('detail.primary')}
                        </Button>
                        <Button
                            href={waHref}
                            variant="outline"
                            size="lg"
                            stretch="phone"
                            icon={<WhatsAppIcon />}
                            newTabLabel={newTab}
                            dataAttrs={{ 'data-cta': 'market_hero_whatsapp' }}
                        >
                            {t('detail.secondary')}
                        </Button>
                    </>
                }
            />

            {/* At a glance: who we supply in this market (live-site note) + key facts */}
            <Section variant="offwhite" labelledBy="md-glance">
                <SectionHeading id="md-glance" eyebrow={t('detail.glance_eyebrow')} title={t('detail.facts_title', { country })} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    {note || buyers.length ? (
                        <Card accent className="lg:col-span-5 lg:self-start">
                            <h3 className={cn('m-0 text-ink', typography.h3)}>{t('detail.buyers_title', { country: inCountry })}</h3>
                            {note ? <p className={cn('m-0 mt-3 text-ink-muted', typography.body)}>{note}</p> : null}
                            {buyers.length ? (
                                <div className="mt-5">
                                    <p className={cn('m-0 mb-2 font-semibold text-ink', typography.caption)}>{t('notes.buyers_label')}</p>
                                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                                        {buyers.map((b) => (
                                            <li key={b}>
                                                <Badge tone="outline">{b}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </Card>
                    ) : null}
                    <FactCards items={facts} className={note || buyers.length ? 'lg:col-span-7' : 'lg:col-span-12 lg:grid-cols-3'} />
                </div>
            </Section>

            {/* What we agree */}
            <Section variant="white" labelledBy="md-discuss">
                <SectionHeading id="md-discuss" eyebrow={t('detail.discuss_eyebrow')} title={t('detail.discuss_title', { country: inCountry })} />
                <FeatureGrid columns={2} style="card" items={discuss} className="xl:grid-cols-4" />
                <div className="mt-6">
                    <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon />}>
                        {t('support.guide_link')}
                    </Button>
                </div>
            </Section>

            {/* This market on the route map, with links to the other markets (the page's one navy band) */}
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
            />

            {/* Main species */}
            <Section variant="offwhite" labelledBy="md-products">
                <SectionHeading id="md-products" size="md" eyebrow={t('detail.products_eyebrow')} title={t('detail.products_title')} intro={t('detail.products_note')} />
                <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                    {products.map((p) => (
                        <li key={p.slug}>
                            <Link href={productHref(p.slug)} className={buttonClass({ variant: 'outline', size: 'sm', className: 'bg-white' })}>
                                {tp(`${p.translationKey}.name`)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* How to start */}
            <Section variant="white" labelledBy="md-process">
                <SectionHeading id="md-process" size="md" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
                {/* Kept from the removed closing card (the G footer carries the contact block) */}
                <p className={cn('m-0 mt-10 border-0 border-t border-solid border-rule pt-5 text-fg-muted', typography.caption)}>{t('disclaimer')}</p>
            </Section>
        </>
    );
}
