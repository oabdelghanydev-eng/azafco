import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button, Breadcrumbs, DocumentIcon, PageHero } from '@/components/ui';
import { insightHref, routes } from '@/lib/v2/routes';
import { guides } from '@/data/guides';
import { activeMarketConfigs, pausedMarkets, plannedMarkets } from '@/components/v2/markets/marketData';
import MarketsIndex from '@/components/v2/markets/MarketsIndex';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { PageStructuredData } from '@/components/StructuredData';

type Props = { params: Promise<{ locale: string }> };

/** The import guide (data/guides.ts), at /insights/[slug] */
const IMPORT_GUIDE_SLUG = guides[0].slug;

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
    const planned = plannedMarkets.map((m) => ({ key: m.key, countryCode: m.countryCode, name: tm(`${m.key}.country`) }));
    const pausedNote = pausedMarkets.map((m) => t('index.paused', { country: tm(`${m.key}.country`) })).join(' · ') || undefined;

    return (
        <>
            <PageStructuredData locale={locale} pageType="markets" />

            {/* No contact buttons in the head (the header, footer and floating WhatsApp carry the contact): the species list and the import guide */}
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
                        <Button href={routes.products} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                        <Button
                            href={insightHref(IMPORT_GUIDE_SLUG)}
                            variant="text"
                            icon={<DocumentIcon />}
                            className="justify-self-start"
                            dataAttrs={{ 'data-cta': 'markets_hero_guide' }}
                        >
                            {t('support.guide_link')}
                        </Button>
                    </>
                }
            />

            {/* Active markets (flags, start year, route map), the EU approval line, planned and paused: the page's one navy band */}
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
        </>
    );
}
