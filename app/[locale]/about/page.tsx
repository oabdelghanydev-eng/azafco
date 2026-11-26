import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { REVIEW_DATE_FORMAT, isoDate } from '@/data/market-import';
import { newsItems } from '@/data/news';
import { ORIGIN_SOURCE_URL } from '@/data/origin';
import { products } from '@/data/products';
import { routes } from '@/lib/v2/routes';
import type { ImageProps } from '@/lib/v2/media';
import { Breadcrumbs, PageHero, Section, SectionHeading, TextLink, cn, focusRing, phoneDisplay, typography } from '@/components/ui';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import Milestones, { type MilestoneYear } from '@/components/v2/businesses/Milestones';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';
import NewsCard from '@/components/v2/insights/NewsCard';

type Props = {
    params: Promise<{ locale: string }>;
};

/** Design G photography (public/images/g). The truck photo is left to the G footer. */
const G_IMAGES = {
    harvest: { width: 1536, height: 1024 },
    'fish-on-ice': { width: 1920, height: 1080 },
} as const;

function gImage(name: keyof typeof G_IMAGES, alt: string): ImageProps {
    return { src: `/images/g/${name}.webp`, ...G_IMAGES[name], alt };
}

/**
 * Company milestones (live site, data/news.ts "achievement" and company items on
 * origin/main): founding 2008, first factory in Baltim 2018, second factory in
 * Motobas 2025. Each fact once on the page (26 Nov 2026): the market openings are
 * the "Active markets (year of first export)" row of the fact table, and the
 * governor's visit (Sept 2025) is an item of the news section. Not used on
 * purpose: the "one of 6 EU-authorised plants" line, the old ISO 22000 / HACCP
 * list and the "+9 markets" item.
 */
const COMPANY_MILESTONES: { year: number; key: 'founded' | 'baltim' | 'motobas' }[] = [
    { year: 2008, key: 'founded' },
    { year: 2018, key: 'baltim' },
    { year: 2025, key: 'motobas' },
];

/** "A, B and C" in the page locale (en-GB style for English: no Oxford comma). */
function joinList(locale: string, items: string[]): string {
    return new Intl.ListFormat(locale === 'en' ? 'en-GB' : locale, { style: 'long', type: 'conjunction' }).format(items);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about_v2.meta' });
    return buildPageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

/**
 * About: who we are (hero, no contact buttons), the company fact table ("at a
 * glance": legal name, exporting since 2008, activity, the 12 species, capacity
 * with the truck sentence, own trucks and cold stores, plant, office, active
 * markets, certificates, official contacts), the milestones since 2008
 * (#about-journey), our businesses (#businesses: fish at the core, agriculture,
 * livestock, investments; the old /businesses page redirects here) and the
 * visits and media coverage (#news; the old /insights index, /insights/news and
 * /media redirect here). The global G footer closes the page with the
 * partnership contacts, the WhatsApp link and the plant map link.
 */
export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'about_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const tp = await getTranslations({ locale, namespace: 'data.products' });
    const tn = await getTranslations({ locale, namespace: 'news_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const format = await getFormatter({ locale });
    // One date format everywhere ("14 November 2026" / «14 نوفمبر 2026»)
    const fmt = (iso: string) => format.dateTime(isoDate(iso), REVIEW_DATE_FORMAT);
    const { email, whatsappNumber } = companyConfig.contact;

    const activeMarkets = companyConfig.markets
        .filter((m) => m.status === 'active' && typeof m.since === 'number')
        .sort((a, b) => (a.since as number) - (b.since as number));

    const milestones: MilestoneYear[] = COMPANY_MILESTONES.map((m) => ({ year: m.year, events: [t(`journey.${m.key}`)] }));

    const inlineLink = cn('font-semibold text-navy underline underline-offset-4 hover:text-navy-900', focusRing);

    // Fact table: species names from data.products (the 12 published species), markets
    // from companyConfig (year of first export; rank 1 = largest export market).
    const speciesNames = joinList(locale, products.map((p) => tp(`${p.translationKey}.name`)));
    const marketList = joinList(
        locale,
        activeMarkets.map((m) =>
            t(m.rank === 1 ? 'glance.market_largest' : 'glance.market_item', { country: tm(`${m.key}.country`), year: String(m.since) }),
        ),
    );
    const facts: { label: string; value: ReactNode }[] = [
        { label: t('glance.legal_label'), value: tc('fullName') },
        { label: t('glance.founded_label'), value: t('glance.founded_value') },
        { label: t('glance.activity_label'), value: t('glance.activity_value') },
        { label: t('glance.species_label'), value: t('glance.species_value', { species: speciesNames }) },
        { label: t('glance.capacity_label'), value: t('glance.capacity_value') },
        { label: t('glance.fleet_label'), value: t('glance.fleet_value') },
        {
            // Why Egypt: one sourced sector fact (owner, 26 Nov 2026; data/origin.ts)
            label: t('glance.origin_label'),
            value: (
                <>
                    {tv('origin.fact')}{' '}
                    <a href={ORIGIN_SOURCE_URL} target="_blank" rel="noopener noreferrer" className={inlineLink} data-cta="about_origin_source">
                        {tv('origin.source')}
                        <span className="sr-only"> {tv('cta.opens_new_tab')}</span>
                    </a>
                </>
            ),
        },
        { label: t('glance.plant_label'), value: <address className="not-italic">{tc('addresses.factory.address')}</address> },
        { label: t('glance.office_label'), value: <address className="not-italic">{tc('addresses.main.address')}</address> },
        { label: t('glance.markets_label'), value: marketList },
        { label: t('glance.certificates_label'), value: t('glance.certificates_value') },
        {
            label: t('glance.contacts_label'),
            value: (
                <ul className="m-0 list-none space-y-1 p-0">
                    <li>
                        {t('glance.email_label')}:{' '}
                        <a href={`mailto:${email}`} className={inlineLink} data-cta="about_facts_email">
                            <bdi dir="ltr">{email}</bdi>
                        </a>
                    </li>
                    {/* The number as text: the header, the footer and the float carry the WhatsApp link */}
                    <li>
                        {t('glance.whatsapp_label')}: <bdi dir="ltr">{phoneDisplay(whatsappNumber)}</bdi>
                    </li>
                </ul>
            ),
        },
    ];

    return (
        <>
            <PageStructuredData locale={locale} pageType="about" />

            {/* 01 · Hero (no contact buttons: the header, the footer and the float carry them) */}
            <PageHero
                image={gImage('harvest', t('hero.image_alt'))}
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
            />

            {/* 02 · At a glance: the company fact table (third person, quotable) */}
            <Section variant="offwhite" labelledBy="about-glance">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <SectionHeading id="about-glance" size="md" title={t('glance.title')} />
                        <TextLink href={routes.quality} dataAttrs={{ 'data-cta': 'about_quality' }}>
                            {t('glance.quality_link')}
                        </TextLink>
                    </div>
                    <dl className="m-0 divide-y divide-line-soft rounded-card border border-solid border-line bg-white lg:col-span-8">
                        {facts.map((f) => (
                            <div key={f.label} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-6">
                                <dt className={cn('font-semibold text-navy', typography.body)}>{f.label}</dt>
                                <dd className={cn('m-0 text-ink sm:col-span-2', typography.body)}>{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            {/* 03 · Milestones since 2008 (founding and the two plants) */}
            <Section variant="white" labelledBy="about-journey">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-28">
                            <SectionHeading id="about-journey" title={t('journey.title')} className="mb-0 md:mb-0 lg:mb-0" />
                        </div>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <Milestones years={milestones} label={t('journey.list_label')} />
                    </div>
                </div>
            </Section>

            {/* 04 · Our businesses. #businesses is the target of the /businesses,
                /agriculture, /livestock and /investments redirects. */}
            <Section id="businesses" variant="offwhite" labelledBy="about-businesses">
                <EditorialMedia
                    id="about-businesses"
                    eyebrow={t('businesses.eyebrow')}
                    title={t('businesses.title')}
                    body={[t('businesses.p2')]}
                    image={gImage('fish-on-ice', t('businesses.image_alt'))}
                >
                    <TextLink href={routes.products} dataAttrs={{ 'data-cta': 'about_products' }}>
                        {t('businesses.link_products')}
                    </TextLink>
                </EditorialMedia>
            </Section>

            {/* 05 · Visits and media coverage (data/news.ts). #news is the target of the
                /insights, /insights/news and /media redirects; each card keeps its
                #news-<key> anchor. */}
            {newsItems.length > 0 ? (
                <Section id="news" variant="white" labelledBy="about-news" className="scroll-mt-28">
                    <SectionHeading id="about-news" title={tn('press.title')} />
                    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {newsItems.map((n) => (
                            <li key={n.key} className="min-w-0">
                                <NewsCard
                                    id={`news-${n.key}`}
                                    title={tn(`items.${n.key}.title`)}
                                    summary={tn(`items.${n.key}.summary`)}
                                    date={n.date}
                                    dateLabel={fmt(n.date)}
                                    sourceLine={tn('source', { name: tn(`items.${n.key}.source`) })}
                                    sourceUrl={n.sourceUrl}
                                    viewSourceLabel={tn('view_source')}
                                    newTabLabel={tn('new_tab')}
                                />
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}
        </>
    );
}
