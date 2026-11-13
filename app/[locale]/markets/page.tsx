import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowIcon, Breadcrumbs, Button, CTABand, DocumentIcon, FeatureGrid, GlobeIcon, PageHero, ProcessSteps, Section, SectionHeader, TruckIcon } from '@/components/v2';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';
import { insightHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { activeMarketConfigs, pausedMarkets, plannedMarkets } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import { GPageScope, GStats } from '@/components/v2/markets/GBits';
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
    const ar = locale === 'ar';
    const t = await getTranslations({ locale, namespace: 'markets_v2' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });

    const stats = t.raw('stats') as { value: string; label: string }[];
    const points = t.raw('approach.points') as Item[];
    const steps = t.raw('process.steps') as Item[];
    const modes = t.raw('transport.modes') as Item[];
    const support = t.raw('support.items') as Item[];

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
            <PageStructuredData locale={locale} pageType="markets" />

            <PageHero
                variant="split"
                image={{ src: '/images/g/farm-ponds.webp', alt: t('hero.image_alt'), width: 1536, height: 1024 }}
                imagePosition="center"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: `${routes.forImporters}#request` }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.products }}
            />

            <GStats items={stats} ar={ar} label={t('hero.eyebrow')} />

            {/* Active markets (flags, start year, route map), planned and paused */}
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
                ar={ar}
            />

            {/* Market requirements */}
            <Section variant="offwhite" labelledBy="mk-approach">
                <SectionHeader id="mk-approach" eyebrow={t('approach.eyebrow')} title={t('approach.title')} intro={t('approach.intro')} />
                <FeatureGrid columns={3} style="card" items={points.map((p) => ({ title: p.title, description: p.text }))} />
            </Section>

            {/* How to start */}
            <Section variant="navy" labelledBy="mk-process">
                <SectionHeader id="mk-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {/* Transport + working terms */}
            <Section variant="light" labelledBy="mk-transport">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <SectionHeader id="mk-transport" size="md" eyebrow={t('transport.eyebrow')} title={t('transport.title')} intro={t('transport.intro')} />
                        <FeatureGrid
                            columns={2}
                            style="card"
                            items={modes.map((m, i) => ({ title: m.title, description: m.text, icon: i === 0 ? <GlobeIcon /> : <TruckIcon /> }))}
                        />
                        <p className="mt-6 text-body-sm text-fg-muted">{t('transport.note')}</p>
                    </div>
                    <div>
                        <SectionHeader id="mk-support" size="md" eyebrow={t('support.eyebrow')} title={t('support.title')} />
                        <ul className="divide-y divide-rule border-y border-rule">
                            {support.map((s) => (
                                <li key={s.title} className="py-5">
                                    <h3 className="font-display text-heading-sm text-fg">{s.title}</h3>
                                    <p className="mt-2 text-body-sm text-fg-muted">{s.text}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon size={18} />}>
                                {t('support.guide_link')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* New destination: contact, not a form */}
                <div className="mt-12 flex flex-col gap-4 rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-[#f2f5fa] p-5 sm:flex-row sm:items-center sm:justify-between lg:p-7">
                    <div>
                        <h2 className="m-0 font-display text-heading-md text-[#002d72]">{t('new_market.title')}</h2>
                        <p className="m-0 mt-1 text-body-sm text-[#4a5a75]">{t('new_market.text')}</p>
                    </div>
                    <Link
                        href={routes.contact}
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-2 font-semibold text-[#002d72] underline decoration-[#f7b500] decoration-2 underline-offset-[6px] hover:no-underline"
                    >
                        {t('new_market.action')}
                        <ArrowIcon size={16} />
                    </Link>
                </div>
            </Section>

            {/* One-tap next step: WhatsApp (management) and email (export team) + what happens next */}
            <CTABand placement="inline" headingId="mk-contact" prefill={{ type: 'market' }} />

            <Section variant="light" spacing="sm" reveal={false}>
                <p className="m-0 text-body-sm text-[#4a5a75]">{t('disclaimer')}</p>
            </Section>
        </GPageScope>
    );
}
