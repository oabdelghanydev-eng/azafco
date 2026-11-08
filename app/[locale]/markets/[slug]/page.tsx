import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, CTABand, FeatureGrid, MarketCard, PageHero, Pending, ProcessSteps, Section, SectionHeader } from '@/components/v2';
import { productHref, rfqHref, routes } from '@/lib/v2/routes';
import { Link } from '@/navigation';
import { products } from '@/data/products';
import { activeMarketSlugs } from '@/data/markets';
import { activeMarketConfigs, getActiveMarketConfig, regionOf } from '@/components/v2/markets/marketData';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';

type Props = { params: Promise<{ locale: string; slug: string }> };
type Item = { title: string; text: string };

// Only active markets get a page; any other slug is a 404 (same rule as before v2)
export const dynamicParams = false;

export function generateStaticParams() {
    return activeMarketSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const market = getActiveMarketConfig(slug);
    if (!market) return {};
    const tAll = await getTranslations({ locale });
    const country = tAll(`data.markets.${market.key}.country`);
    return pageMetadata({
        locale,
        path: `${routes.markets}/${slug}`,
        title: tAll('markets_v2.detail.meta_title', { country }),
        description: tAll('markets_v2.detail.meta_description', { country }),
    });
}

export default async function MarketDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const market = getActiveMarketConfig(slug);
    if (!market) notFound();
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'markets_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tm = await getTranslations({ locale, namespace: 'v2.market' });
    const tAll = await getTranslations({ locale });
    const name = (key: string) => tAll(`data.markets.${key}.country`);
    const country = name(market.key);
    const discuss = (t.raw('detail.discuss') as Item[]).map((d) => ({
        title: d.title,
        description: d.text.replace('{country}', country),
    }));
    const steps = t.raw('process.steps') as Item[];
    const others = activeMarketConfigs.filter((m) => m.key !== market.key);
    const rfq = rfqHref({ country: market.countryCode, type: 'market' });

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
                eyebrow={t('detail.eyebrow')}
                title={t('detail.title', { country })}
                intro={t('detail.intro', { country })}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.markets }, { label: country }]} />}
                primaryAction={{ label: t('detail.primary', { country }), href: rfq }}
                secondaryAction={{ label: t('detail.secondary'), href: routes.markets }}
            />

            <Section variant="offwhite" labelledBy="md-discuss">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <h2 className="sr-only">{t('detail.status_title')}</h2>
                        <MarketCard
                            name={country}
                            status={market.status}
                            region={t(`regions.${regionOf(market)}`)}
                            countryCode={market.countryCode}
                            facts={[
                                { label: tm('fact_species'), value: tm('fact_species_value', { count: products.length }) },
                                { label: tm('fact_transport'), value: tm('fact_transport_value') },
                                { label: tm('fact_documents'), value: tm('fact_documents_value') },
                            ]}
                        />
                        <Pending block label={t('pending.since')} className="mt-4" />
                    </div>
                    <div className="lg:col-span-8">
                        <SectionHeader id="md-discuss" size="md" eyebrow={t('detail.discuss_eyebrow')} title={t('detail.discuss_title', { country })} />
                        <FeatureGrid columns={2} style="card" items={discuss} />
                    </div>
                </div>
            </Section>

            <Section variant="light" labelledBy="md-products">
                <SectionHeader id="md-products" size="md" eyebrow={t('detail.products_eyebrow')} title={t('detail.products_title')} intro={t('detail.products_intro')} />
                <ul className="flex flex-wrap gap-3">
                    {products.map((p) => (
                        <li key={p.slug}>
                            <Link
                                href={productHref(p.slug)}
                                className="inline-flex min-h-[44px] items-center rounded-full border border-line-strong px-5 text-body-sm font-medium text-navy transition-colors duration-fast hover:border-navy hover:bg-surface-offwhite motion-reduce:transition-none"
                            >
                                {tAll(`data.products.${p.translationKey}.name`)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section variant="navy" labelledBy="md-process">
                <SectionHeader id="md-process" size="md" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {others.length > 0 ? (
                <Section variant="light" labelledBy="md-others" spacing="sm">
                    <h2 id="md-others" className="v2-heading font-display text-heading-lg">
                        {t('detail.other_title')}
                    </h2>
                    <ul className="mt-6 flex flex-wrap gap-3">
                        {others.map((m) => (
                            <li key={m.key}>
                                <Link
                                    href={`${routes.markets}/${m.key}`}
                                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-4 text-body-sm font-medium text-navy hover:border-navy"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`/flags/${m.countryCode.toLowerCase()}.svg`} alt="" aria-hidden="true" width={24} height={16} className="h-4 w-6 rounded-[2px] border border-line object-cover" loading="lazy" />
                                    {name(m.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 rounded-card bg-surface-mist p-5 text-body-sm text-ink-muted">{t('disclaimer')}</p>
                </Section>
            ) : null}

            <CTABand
                headingId="md-cta"
                prefill={{ country: market.countryCode, type: 'market' }}
                eyebrow={t('cta.eyebrow')}
            />
        </>
    );
}
