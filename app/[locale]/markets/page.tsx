import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Button,
    Breadcrumbs,
    DocumentIcon,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    cn,
    typography,
} from '@/components/ui';
import { insightHref, routes } from '@/lib/v2/routes';
import { activeMarketConfigs, pausedMarkets, plannedMarkets } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import MarketNotes from '@/components/v2/markets/MarketNotes';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';

type Props = { params: Promise<{ locale: string }> };
type Item = { title: string; text: string };

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

    const support = t.raw('support.items') as Item[];

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
        since: since(m.since),
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
                intro={t('index.intro')}
                active={active}
                planned={planned}
                plannedTitle={t('index.planned_title')}
                pausedNote={pausedNote}
                mapLabel={t('index.map_label')}
                origin={t('index.origin')}
            />

            {/* Market by market: who we supply in each active market (live-site notes), + new-market tile */}
            <Section variant="offwhite" labelledBy="mk-notes">
                <SectionHeading id="mk-notes" eyebrow={t('notes.eyebrow')} title={t('notes.title')} intro={t('notes.intro')} />
                <MarketNotes
                    items={notes}
                    buyersLabel={t('notes.buyers_label')}
                    detailsLabel={t('notes.details')}
                    newMarket={{ title: t('new_market.title'), text: t('new_market.text'), action: t('new_market.action'), href: routes.contact }}
                />
            </Section>

            {/* Transport + working terms */}
            <Section variant="white" labelledBy="mk-transport">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <SectionHeading id="mk-transport" size="md" eyebrow={t('transport.eyebrow')} title={t('transport.title')} intro={t('transport.intro')} />
                        <p className={cn('m-0 text-fg-muted', typography.small)}>{t('transport.note')}</p>
                    </div>
                    <div>
                        <SectionHeading id="mk-support" size="md" eyebrow={t('support.eyebrow')} title={t('support.title')} />
                        <ul className="m-0 list-none divide-y divide-rule border-y border-rule p-0">
                            {support.map((s) => (
                                <li key={s.title} className="py-5">
                                    <h3 className={cn('m-0 text-fg', typography.h4)}>{s.title}</h3>
                                    <p className={cn('m-0 mt-2 text-fg-muted', typography.small)}>{s.text}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex flex-col items-start gap-1">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon />}>
                                {t('support.guide_link')}
                            </Button>
                            <TextLink href={routes.forImporters}>{t('support.importers_link')}</TextLink>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
}
