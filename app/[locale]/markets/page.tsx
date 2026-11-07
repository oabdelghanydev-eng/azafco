import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    CTABand,
    FeatureGrid,
    MarketCard,
    PageHero,
    Pending,
    ProcessSteps,
    Section,
    SectionHeader,
    Button,
    DocumentIcon,
    GlobeIcon,
    CheckIcon,
} from '@/components/v2';
import { mediaImage } from '@/lib/v2/media';
import { insightHref, rfqHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { activeMarketConfigs, otherMarketConfigs, regionOf } from '@/components/v2/markets/marketData';
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
    const tAll = await getTranslations({ locale });
    const country = (key: string) => tAll(`data.markets.${key}.country`);

    const points = t.raw('proposition.points') as Item[];
    const steps = t.raw('process.steps') as Item[];
    const modes = t.raw('transport.modes') as Item[];
    const support = t.raw('support.items') as Item[];

    return (
        <>
            <PageStructuredData locale={locale} pageType="markets" />

            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={mediaImage('dispatch-truck-loading-bays-group', locale)}
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.export') }, { label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: rfqHref({ type: 'market' }) }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.forImporters }}
            />

            {/* 01 Market proposition */}
            <Section variant="light" labelledBy="mk-proposition">
                <SectionHeader id="mk-proposition" eyebrow={t('proposition.eyebrow')} title={t('proposition.title')} intro={t('proposition.intro')} />
                <FeatureGrid columns={3} style="card" items={points.map((p) => ({ title: p.title, description: p.text }))} />
            </Section>

            {/* 02 Active market index */}
            <Section variant="offwhite" labelledBy="mk-active">
                <SectionHeader id="mk-active" eyebrow={t('active.eyebrow')} title={t('active.title')} intro={t('active.intro')} />
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {activeMarketConfigs.map((m) => (
                        <li key={m.key}>
                            <MarketCard
                                name={country(m.key)}
                                status={m.status}
                                region={t(`regions.${regionOf(m)}`)}
                                description={t('active.card_cta', { country: country(m.key) })}
                                countryCode={m.countryCode}
                                href={rfqHref({ country: m.countryCode, type: 'market' })}
                            />
                        </li>
                    ))}
                </ul>
                <p className="mt-8 max-w-prose-v2 border-s-2 border-gold ps-4 text-body text-fg-muted">{t('active.gulf_focus')}</p>
                <nav aria-label={t('active.details_label')} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm">
                    <span className="text-fg-muted">{t('active.details_label')}</span>
                    {activeMarketConfigs.map((m) => (
                        <Link key={m.key} href={`${routes.markets}/${m.key}`} className="inline-flex min-h-[44px] items-center font-medium text-navy underline-offset-4 hover:underline">
                            {country(m.key)}
                        </Link>
                    ))}
                </nav>
            </Section>

            {/* 03 Status semantics: paused / planned, no flags, no links */}
            {otherMarketConfigs.length > 0 ? (
                <Section variant="light" labelledBy="mk-other" spacing="sm">
                    <SectionHeader id="mk-other" size="md" eyebrow={t('other.eyebrow')} title={t('other.title')} intro={t('other.intro')} />
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {otherMarketConfigs.map((m) => (
                            <li key={m.key}>
                                <MarketCard name={country(m.key)} status={m.status} region={t(`regions.${regionOf(m)}`)} />
                            </li>
                        ))}
                    </ul>
                    <Pending block label={t('pending.saudi')} className="mt-6" />
                    <p className="mt-6 text-body-sm text-fg-muted">
                        {t('other.new_destination')}{' '}
                        <Link href={rfqHref({ type: 'market' })} className="inline-flex min-h-[44px] items-center font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">
                            {tv('cta.request_quote')}
                        </Link>
                    </p>
                </Section>
            ) : null}

            {/* 05 Export process */}
            <Section variant="navy" labelledBy="mk-process">
                <SectionHeader id="mk-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s) => ({ title: s.title, description: s.text }))} />
            </Section>

            {/* 06 Transport modes + 07 Buyer support */}
            <Section variant="light" labelledBy="mk-transport">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <SectionHeader id="mk-transport" size="md" eyebrow={t('transport.eyebrow')} title={t('transport.title')} intro={t('transport.intro')} />
                        <FeatureGrid
                            columns={2}
                            style="card"
                            items={modes.map((m, i) => ({ title: m.title, description: m.text, icon: i === 0 ? <GlobeIcon /> : <CheckIcon /> }))}
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
                <p className="mt-12 rounded-card bg-surface-mist p-5 text-body-sm text-ink-muted">{t('disclaimer')}</p>
            </Section>

            {/* 08 Market enquiry CTA */}
            <CTABand
                headingId="mk-cta"
                prefill={{ type: 'market' }}
                eyebrow={t('cta.eyebrow')}
                title={t('cta.title')}
                intro={t('cta.intro')}
                ctaLabel={t('cta.button')}
            />
        </>
    );
}
