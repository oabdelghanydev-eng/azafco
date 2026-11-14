import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Button,
    Breadcrumbs,
    DocumentIcon,
    PageHero,
    PlaneIcon,
    Section,
    SectionHeading,
    StatStrip,
    TruckIcon,
    cn,
    typography,
} from '@/components/ui';
import FeatureGrid from '@/components/v2/FeatureGrid';
import ProcessSteps from '@/components/v2/ProcessSteps';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';
import { insightHref, routes } from '@/lib/v2/routes';
import { activeMarketConfigs, pausedMarkets, plannedMarkets } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import MarketNotes from '@/components/v2/markets/MarketNotes';
import MarketsClosing from '@/components/v2/markets/MarketsClosing';
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
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });

    const stats = t.raw('stats') as { value: string; label: string }[];
    const points = t.raw('approach.points') as Item[];
    const steps = t.raw('process.steps') as Item[];
    const modes = t.raw('transport.modes') as Item[];
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
    const modeIcons = [<PlaneIcon key="air" size={24} />, <TruckIcon key="road" size={24} />];

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
                        <Button href={`${routes.forImporters}#request`} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'markets_hero_partnership' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button href={routes.products} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            <StatStrip items={stats} label={t('hero.eyebrow')} />

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

            {/* Market requirements */}
            <Section variant="white" labelledBy="mk-approach">
                <SectionHeading id="mk-approach" eyebrow={t('approach.eyebrow')} title={t('approach.title')} intro={t('approach.intro')} />
                <FeatureGrid columns={3} style="card" items={points.map((p) => ({ title: p.title, description: p.text }))} />
            </Section>

            {/* How to start */}
            <Section variant="offwhite" labelledBy="mk-process">
                <SectionHeading id="mk-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {/* Transport + working terms */}
            <Section variant="white" labelledBy="mk-transport">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <SectionHeading id="mk-transport" size="md" eyebrow={t('transport.eyebrow')} title={t('transport.title')} intro={t('transport.intro')} />
                        <FeatureGrid
                            columns={2}
                            style="card"
                            items={modes.map((m, i) => ({ title: m.title, description: m.text, icon: modeIcons[i] }))}
                        />
                        <p className={cn('m-0 mt-6 text-fg-muted', typography.small)}>{t('transport.note')}</p>
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
                        <div className="mt-6">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon />}>
                                {t('support.guide_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Closing: one accent card (WhatsApp = management, email = export team); the G footer follows */}
            <MarketsClosing
                headingId="mk-contact"
                eyebrow={t('closing.eyebrow')}
                title={t('closing.title')}
                text={t('closing.text')}
                primary={{ label: t('closing.primary'), href: `${routes.forImporters}#request` }}
                whatsappLabel={tv('cta.whatsapp_management')}
                emailLabel={tv('cta.email_export_team')}
                emailSubject={tv('cta_band.email_subject', { topic: t('breadcrumb') })}
                newTabLabel={tv('cta.opens_new_tab')}
                disclaimer={t('disclaimer')}
                cta="markets"
            />
        </>
    );
}
