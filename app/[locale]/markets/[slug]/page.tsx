import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge, Breadcrumbs, Button, PageHero, Section, SectionHeading, TextLink, WhatsAppIcon } from '@/components/ui';
import { insightHref, rfqHref, routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { activeMarketSlugs } from '@/data/markets';
import { MARKET_IMPORT_REVIEWED, REVIEW_DATE_FORMAT, isoDate } from '@/data/market-import';
import { getActiveMarketConfig } from '@/components/v2/markets/marketData';
import MarketImportRules from '@/components/v2/markets/MarketImportRules';
import { marketImportView } from '@/components/v2/markets/importRules';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';

type Props = { params: Promise<{ locale: string; slug: string }> };
type MarketsT = { has: (k: string) => boolean; (k: string): string };

/** Slug of the import guide (Media Center / insights) */
const IMPORT_GUIDE_SLUG = 'importing-fresh-fish-from-egypt';

/** Country name for use inside a sentence ("the United Arab Emirates"); falls back to the bare name. */
function sentenceName(tm: MarketsT, key: string): string {
    return tm.has(`${key}.sentence`) ? tm(`${key}.sentence`) : tm(`${key}.country`);
}

/** Shorter sentence form for the <title> and description where the full one is too long ("the UAE"). */
function titleName(tm: MarketsT, key: string): string {
    return tm.has(`${key}.title_name`) ? tm(`${key}.title_name`) : sentenceName(tm, key);
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
    const country = titleName(tm, market.key);
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
    const format = await getFormatter({ locale });
    // Bare name for breadcrumbs and headings that start with it; sentence form inside running text
    const country = tm(`${market.key}.country`);
    const inCountry = sentenceName(tm, market.key);
    const year = String(market.since ?? '');
    // Management WhatsApp, prefilled with this market (markets_v2.detail.whatsapp_message)
    const waHref = whatsappLink(t('detail.whatsapp_message', { country: inCountry }));
    const note = tm.has(`${market.key}.note`) ? tm(`${market.key}.note`) : undefined;
    const buyers = tm.has(`${market.key}.buyers`) ? (tm.raw(`${market.key}.buyers`) as string[]) : [];
    const newTab = tv('cta.opens_new_tab');

    // Import rules (data/market-import.ts, verified items only; strings in markets_v2.import.*)
    const rules = await marketImportView(locale, market.key);

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [
                    { name: t('breadcrumb'), path: routes.markets },
                    { name: country, path: `${routes.markets}/${slug}` },
                ])}
            />

            {/* Start year in the eyebrow; the market note (where there is one) is the intro */}
            <PageHero
                variant="split"
                image={{ src: '/images/g/fish-on-ice.webp', alt: t('detail.image_alt'), width: 1920, height: 1080 }}
                eyebrow={market.since ? t('detail.eyebrow', { year }) : t('index.eyebrow')}
                title={t('detail.title', { country: inCountry })}
                intro={note}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb'), href: routes.markets }, { label: country }]} />}
                actions={
                    <>
                        <Button
                            href={rfqHref({ country: market.countryCode, type: 'market' })}
                            size="lg"
                            stretch="phone"
                            arrow
                            dataAttrs={{ 'data-cta': 'market_hero_requirements' }}
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

            {/* Who we supply in this market (live-site buyer types) */}
            {buyers.length ? (
                <Section variant="offwhite" labelledBy="md-buyers">
                    <SectionHeading id="md-buyers" eyebrow={t('notes.eyebrow')} title={t('detail.buyers_title', { country: inCountry })} />
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {buyers.map((b) => (
                            <li key={b}>
                                <Badge tone="outline">{b}</Badge>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <TextLink href={routes.products}>{t('detail.products_link')}</TextLink>
                    </div>
                </Section>
            ) : null}

            {/* Last: importing into this market (authority where verified, documents and conditions, each with its source) */}
            <MarketImportRules
                headingId="md-import"
                eyebrow={t('import.eyebrow')}
                title={t('import.title', { country: inCountry })}
                authority={rules?.authority}
                groups={rules?.groups ?? []}
                sourceLabel={t('import.source_label')}
                newTabLabel={newTab}
                reviewed={t.rich('import.reviewed', {
                    date: format.dateTime(isoDate(MARKET_IMPORT_REVIEWED), REVIEW_DATE_FORMAT),
                    time: (chunks) => <time dateTime={MARKET_IMPORT_REVIEWED}>{chunks}</time>,
                })}
                disclaimer={t('import.disclaimer')}
                guide={{ href: insightHref(IMPORT_GUIDE_SLUG), label: t('support.guide_link') }}
                fallback={{ guide: t('import.fallback_guide'), confirm: t('import.fallback_confirm', { country: inCountry }) }}
            />
        </>
    );
}
