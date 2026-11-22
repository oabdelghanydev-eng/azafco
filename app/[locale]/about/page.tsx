import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { products } from '@/data/products';
import { routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import type { ImageProps } from '@/lib/v2/media';
import {
    Breadcrumbs,
    Button,
    ExternalLink,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    WhatsAppIcon,
    cn,
    focusRing,
    phoneDisplay,
    typography,
} from '@/components/ui';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import Milestones, { type MilestoneYear } from '@/components/v2/businesses/Milestones';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';

type Props = {
    params: Promise<{ locale: string }>;
};

/** Plant pin (same point as the G footer factory link and data/company.ts map embed). */
const PLANT_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=31.433264,30.475957';

/** Design G photography (public/images/g). The truck photo is left to the G footer. */
const G_IMAGES = {
    harvest: { width: 1536, height: 1024 },
    'sorting-packing': { width: 1536, height: 1024 },
    'fish-on-ice': { width: 1920, height: 1080 },
} as const;

function gImage(name: keyof typeof G_IMAGES, alt: string): ImageProps {
    return { src: `/images/g/${name}.webp`, ...G_IMAGES[name], alt };
}

/**
 * Company milestones that are not market openings (live site, data/news.ts
 * "achievement" and company items on origin/main): founding 2008, first factory
 * in Baltim 2018, second factory in Motobas 2025, the governor's visit to the
 * Motobas plant (Sept 2025). Market openings come from companyConfig.markets
 * (active markets and their `since` year), so the timeline never drifts from
 * the markets data. Not used on purpose: the "one of 6 EU-authorised plants"
 * line, the old ISO 22000 / HACCP list and the "+9 markets" item.
 */
const COMPANY_MILESTONES: { year: number; key: 'founded' | 'baltim' | 'motobas' | 'governor' }[] = [
    { year: 2008, key: 'founded' },
    { year: 2018, key: 'baltim' },
    { year: 2025, key: 'motobas' },
    { year: 2025, key: 'governor' },
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
 * About: who we are (hero), the company fact table ("at a glance": legal name,
 * exporting since 2008, activity, the 12 species, capacity with the truck sentence, plant,
 * office, active markets, certificates, official contacts), the milestones
 * since 2008 (#about-journey, linked from /insights), our businesses
 * (#businesses: fish at the core, agriculture, livestock, investments; the old
 * /businesses page redirects here) and the plant with its map link (the
 * addresses are in the fact table only). The global G footer closes the page
 * with the partnership contacts.
 */
export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'about_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const tp = await getTranslations({ locale, namespace: 'data.products' });
    // Management WhatsApp with the standard prefilled opening (g_header_v2.whatsapp_message)
    const waHref = whatsappLink((await getTranslations({ locale, namespace: 'g_header_v2' }))('whatsapp_message'));
    const { email, whatsappNumber } = companyConfig.contact;

    const activeMarkets = companyConfig.markets
        .filter((m) => m.status === 'active' && typeof m.since === 'number')
        .sort((a, b) => (a.since as number) - (b.since as number));

    // Timeline: company milestones + the first export year of each active market,
    // grouped by year (within a year: company item, market openings, then the visit).
    const events = [
        ...COMPANY_MILESTONES.map((m) => ({ year: m.year, order: m.key === 'governor' ? 2 : 0, text: t(`journey.${m.key}`) })),
        ...activeMarkets.map((m) => ({ year: m.since as number, order: 1, text: t('journey.market', { country: tm(`${m.key}.sentence`) }) })),
    ].sort((a, b) => a.year - b.year || a.order - b.order);
    const milestones: MilestoneYear[] = [];
    for (const e of events) {
        const last = milestones[milestones.length - 1];
        if (last && last.year === e.year) last.events.push(e.text);
        else milestones.push({ year: e.year, events: [e.text] });
    }

    const newTab = t('footprint.opens_new_tab');
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
                    <li>
                        {t('glance.whatsapp_label')}:{' '}
                        <a href={waHref} target="_blank" rel="noopener noreferrer" className={inlineLink} data-cta="about_facts_whatsapp">
                            <bdi dir="ltr">{phoneDisplay(whatsappNumber)}</bdi>
                            <span className="sr-only"> {newTab}</span>
                        </a>
                    </li>
                </ul>
            ),
        },
    ];

    const otherBusinesses: { title: string; text?: string }[] = [
        { title: t('businesses.agri_title'), text: t('businesses.agri_text') },
        { title: t('businesses.livestock_title'), text: t('businesses.livestock_text') },
        { title: t('businesses.invest_title'), text: t('businesses.invest_text') },
    ];

    return (
        <>
            <PageStructuredData locale={locale} pageType="about" />

            {/* 01 · Hero */}
            <PageHero
                image={gImage('harvest', t('hero.image_alt'))}
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                actions={
                    <>
                        <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'about_partnership' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button
                            href={waHref}
                            variant="outline"
                            size="lg"
                            stretch="phone"
                            icon={<WhatsAppIcon />}
                            newTabLabel={newTab}
                            dataAttrs={{ 'data-cta': 'about_whatsapp' }}
                        >
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            {/* 02 · At a glance: the company fact table (third person, quotable) */}
            <Section variant="offwhite" labelledBy="about-glance">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <SectionHeading id="about-glance" size="md" eyebrow={t('glance.eyebrow')} title={t('glance.title')} />
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

            {/* 03 · Milestones since 2008 (live-site achievements + market openings).
                Keep id="about-journey": /insights links to it. */}
            <Section variant="white" labelledBy="about-journey">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-28">
                            <SectionHeading
                                id="about-journey"
                                eyebrow={t('journey.eyebrow')}
                                title={t('journey.title')}
                                intro={t('journey.intro')}
                                className="mb-0 md:mb-0 lg:mb-0"
                            />
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
                    <ul className="m-0 list-none space-y-4 p-0">
                        {otherBusinesses.map((b) => (
                            <li key={b.title} className="border-0 border-s-2 border-solid border-gold ps-4">
                                <p className={cn('m-0 font-semibold text-ink', typography.body)}>{b.title}</p>
                                {b.text ? <p className={cn('m-0 mt-1 text-ink-muted', typography.small)}>{b.text}</p> : null}
                            </li>
                        ))}
                    </ul>
                    <TextLink href={routes.products} className="mt-4" dataAttrs={{ 'data-cta': 'about_products' }}>
                        {t('businesses.link_products')}
                    </TextLink>
                </EditorialMedia>
            </Section>

            {/* 05 · Plant, trucks and cold stores: the map link and the five stages (addresses live in the fact table) */}
            <Section variant="white" labelledBy="about-footprint">
                <EditorialMedia
                    id="about-footprint"
                    eyebrow={t('footprint.eyebrow')}
                    title={t('footprint.title')}
                    body={[t('footprint.p1'), t('footprint.p2')]}
                    image={gImage('sorting-packing', t('footprint.image_alt'))}
                    imageSide="start"
                >
                    <div className="flex flex-col items-start gap-1">
                        <ExternalLink href={PLANT_MAP_URL} newTabLabel={newTab} dataAttrs={{ 'data-cta': 'about_plant_map' }}>
                            {t('footprint.map_link')}
                        </ExternalLink>
                        <TextLink href={routes.processing} dataAttrs={{ 'data-cta': 'about_stages' }}>
                            {t('footprint.stages_link')}
                        </TextLink>
                    </div>
                </EditorialMedia>
            </Section>
        </>
    );
}
