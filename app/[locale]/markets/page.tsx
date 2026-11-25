import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button, Breadcrumbs, PageHero, Section, SectionHeading } from '@/components/ui';
import { routes } from '@/lib/v2/routes';
import { activeMarketConfigs, pausedMarkets, plannedMarkets } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import MarketNotes from '@/components/v2/markets/MarketNotes';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'markets_v2.meta' });
    return pageMetadata({ locale, path: routes.markets, title: t('title'), description: t('description') });
}

export default async function MarketsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'markets_v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });

    const since = (year: number | null) => (year ? t('index.since', { year: String(year) }) : '');
    const active = activeMarketConfigs.map((m) => ({
        key: m.key,
        countryCode: m.countryCode,
        name: tm(`${m.key}.country`),
        short: tm(`${m.key}.short`),
        since: since(m.since),
    }));
    const notes = activeMarketConfigs.map((m) => ({
        key: m.key,
        countryCode: m.countryCode,
        name: tm(`${m.key}.country`),
        note: tm.has(`${m.key}.note`) ? tm(`${m.key}.note`) : undefined,
        buyers: tm.has(`${m.key}.buyers`) ? (tm.raw(`${m.key}.buyers`) as string[]) : [],
    }));
    const planned = plannedMarkets.map((m) => ({ key: m.key, countryCode: m.countryCode, name: tm(`${m.key}.country`) }));
    const pausedNote = pausedMarkets.map((m) => t('index.paused', { country: tm(`${m.key}.country`) })).join(' · ') || undefined;

    return (
        <>
            <PageStructuredData locale={locale} pageType="markets" />

            <PageHero
                variant="split"
                image={{ src: '/images/g/farm-ponds.webp', alt: t('hero.image_alt'), width: 1536, height: 1024 }}
                imagePosition="center"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                actions={
                    <>
                        <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'markets_hero_partnership' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button href={routes.products} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            {/* Active markets (flags, start year, route map), planned and paused: the page's one navy band */}
            <MarketsIndex
                headingId="mk-active"
                eyebrow={t('index.eyebrow')}
                title={t('index.title')}
                active={active}
                planned={planned}
                plannedTitle={t('index.planned_title')}
                approvedNote={t('index.approved')}
                pausedNote={pausedNote}
                mapLabel={t('index.map_label')}
                origin={t('index.origin')}
            />

            {/* Who we supply in each active market (live-site notes), + new-market tile */}
            <Section variant="offwhite" labelledBy="mk-notes">
                <SectionHeading id="mk-notes" eyebrow={t('notes.eyebrow')} title={t('notes.title')} />
                <MarketNotes
                    items={notes}
                    detailsLabel={t('notes.details')}
                    newMarket={{ title: t('new_market.title'), text: t('new_market.text'), action: t('new_market.action'), href: routes.contact }}
                />
            </Section>
        </>
    );
}
