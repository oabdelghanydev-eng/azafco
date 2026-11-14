import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import type { ImageProps } from '@/lib/v2/media';
import {
    Breadcrumbs,
    Button,
    Card,
    ClipboardCheckIcon,
    ExternalLink,
    Icon,
    IceIcon,
    MapPinIcon,
    PageHero,
    Section,
    SectionHeading,
    Stat,
    TextLink,
    TruckIcon,
    WhatsAppIcon,
    FishIcon,
    cn,
    typography,
} from '@/components/ui';
import { LuWaves } from 'react-icons/lu';
import HeadingPhoto from '@/components/v2/HeadingPhoto';
import ProcessSteps from '@/components/v2/ProcessSteps';
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

/** Farming (pond), harvest, washing/icing/packing, inspection, export. */
function PondIcon({ size = 24 }: { size?: 24 }) {
    return <Icon icon={LuWaves} size={size} />;
}
const OPERATION_ICONS = [PondIcon, FishIcon, IceIcon, ClipboardCheckIcon, TruckIcon];

/**
 * The ISO standard names ("A · B · C" in the JSON) as unbreakable chunks, so a narrow
 * figure cell never splits "ISO" from its number or starts a line with the separator.
 */
function IsoStandards({ text }: { text: string }) {
    const items = text.split('·').map((s) => s.trim()).filter(Boolean);
    return (
        <span dir="ltr" className="mt-1 flex flex-wrap gap-x-1.5 text-caption font-normal rtl:justify-end">
            {items.map((s, i) => (
                <span key={s} className="whitespace-nowrap">
                    {s}
                    {i < items.length - 1 ? <span aria-hidden="true"> ·</span> : null}
                </span>
            ))}
        </span>
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about_v2.meta' });
    return buildPageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

/**
 * About: who we are (founded 2008, farm and source, in-house operations), the
 * figures the owner approved (founded, capacity, ISO, markets), the milestones
 * since 2008, how the businesses fit, where we work, our values and direction.
 * The global G footer closes the page with the partnership contacts
 * (WhatsApp = management, email = export team).
 */
export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'about_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });

    // Timeline: company milestones + the first export year of each active market,
    // grouped by year (within a year: company item, market openings, then the visit).
    const events = [
        ...COMPANY_MILESTONES.map((m) => ({ year: m.year, order: m.key === 'governor' ? 2 : 0, text: t(`journey.${m.key}`) })),
        ...companyConfig.markets
            .filter((m) => m.status === 'active' && typeof m.since === 'number')
            .map((m) => ({ year: m.since as number, order: 1, text: t('journey.market', { country: tm(`${m.key}.sentence`) }) })),
    ].sort((a, b) => a.year - b.year || a.order - b.order);
    const milestones: MilestoneYear[] = [];
    for (const e of events) {
        const last = milestones[milestones.length - 1];
        if (last && last.year === e.year) last.events.push(e.text);
        else milestones.push({ year: e.year, events: [e.text] });
    }

    const newTab = t('footprint.opens_new_tab');

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
                            href={companyConfig.contact.social.whatsapp}
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
                proof={<p className={cn('m-0 text-fg-muted', typography.small)}>{t('hero.reassure')}</p>}
            />

            {/* 02 · Story + approved figures */}
            <Section variant="offwhite" labelledBy="about-story">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading id="about-story" eyebrow={t('story.eyebrow')} title={t('story.title')} className="mb-0 md:mb-0 lg:mb-0" />
                        <HeadingPhoto id="photo-delta-landscape" />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className={cn('m-0 text-ink', typography.lead)}>{t('story.p1')}</p>
                        <p className={cn('m-0 mt-5 text-ink-muted', typography.body)}>{t('story.p2')}</p>
                        <dl className="m-0 mt-10 grid grid-cols-2 gap-x-5 gap-y-8 lg:gap-x-8">
                            {[
                                { value: t('facts.founded_value'), label: t('facts.founded_label') },
                                { value: t('facts.capacity_value'), label: t('facts.capacity_label') },
                                {
                                    value: t('facts.iso_value'),
                                    label: (
                                        <>
                                            {t('facts.iso_label')}
                                            <IsoStandards text={t('facts.iso_note')} />
                                        </>
                                    ),
                                },
                                { value: t('facts.markets_value'), label: t('facts.markets_label') },
                            ].map((s, i) => (
                                <Stat
                                    key={i}
                                    value={s.value}
                                    label={s.label}
                                    className="relative justify-end border-0 border-t border-solid border-line pt-5 before:absolute before:-top-px before:start-0 before:h-[3px] before:w-11 before:bg-gold before:content-[''] lg:pt-7"
                                />
                            ))}
                        </dl>
                        <TextLink href={routes.quality} className="mt-6" dataAttrs={{ 'data-cta': 'about_quality' }}>
                            {t('facts.iso_link')}
                        </TextLink>
                    </div>
                </div>
            </Section>

            {/* 03 · Milestones since 2008 (live-site achievements + market openings) */}
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

            {/* 04 · In-house operations, pond to pallet */}
            <Section variant="offwhite" labelledBy="about-operations">
                <SectionHeading
                    id="about-operations"
                    eyebrow={t('operations.eyebrow')}
                    title={t('operations.title')}
                    intro={t('operations.intro')}
                />
                <ProcessSteps
                    steps={OPERATION_ICONS.map((StepIcon, i) => ({
                        icon: <StepIcon size={24} />,
                        title: t(`operations.s${i + 1}_title`),
                        description: t(`operations.s${i + 1}_text`),
                    }))}
                />
            </Section>

            {/* 05 · Our businesses (detail on /businesses) */}
            <Section variant="white" labelledBy="about-businesses">
                <EditorialMedia
                    id="about-businesses"
                    eyebrow={t('businesses.eyebrow')}
                    title={t('businesses.title')}
                    body={[t('businesses.p1'), t('businesses.p2')]}
                    image={gImage('fish-on-ice', t('businesses.image_alt'))}
                    links={[
                        { label: t('businesses.link_businesses'), href: routes.businesses },
                        { label: t('businesses.link_seafood'), href: routes.seafood },
                        { label: t('businesses.link_products'), href: routes.products },
                        { label: t('businesses.link_importers'), href: routes.forImporters },
                    ]}
                />
            </Section>

            {/* 06 · Plant, trucks and cold stores */}
            <Section variant="offwhite" labelledBy="about-footprint">
                <EditorialMedia
                    id="about-footprint"
                    eyebrow={t('footprint.eyebrow')}
                    title={t('footprint.title')}
                    body={[t('footprint.p1'), t('footprint.p2')]}
                    image={gImage('sorting-packing', t('footprint.image_alt'))}
                    imageSide="start"
                >
                    <h3 className={cn('m-0 text-ink', typography.h4)}>{t('footprint.addresses_title')}</h3>
                    <ul className="m-0 mt-4 list-none space-y-4 p-0">
                        {(['factory', 'main'] as const).map((k) => (
                            <li key={k} className="flex items-start gap-3">
                                <MapPinIcon size={24} className="mt-0.5 shrink-0 text-navy" />
                                <div>
                                    <p className={cn('m-0 font-semibold text-ink', typography.small)}>{tc(`addresses.${k}.title`)}</p>
                                    <address className={cn('not-italic text-ink-muted', typography.small)}>{tc(`addresses.${k}.address`)}</address>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <ExternalLink href={PLANT_MAP_URL} newTabLabel={newTab} className="mt-4" dataAttrs={{ 'data-cta': 'about_plant_map' }}>
                        {t('footprint.map_link')}
                    </ExternalLink>
                </EditorialMedia>
            </Section>

            {/* 07 · Values (factual, how we deal with buyers) */}
            <Section variant="white" labelledBy="about-values">
                <SectionHeading id="about-values" eyebrow={t('values.eyebrow')} title={t('values.title')} intro={t('values.intro')} />
                <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <li key={n}>
                            <Card accent className="h-full">
                                <h3 className={cn('m-0 text-ink', typography.h3)}>{t(`values.i${n}_title`)}</h3>
                                <p className={cn('m-0 mt-2 text-ink-muted', typography.body)}>{t(`values.i${n}_text`)}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* 08 · Vision, mission, identity (the global G footer follows with the partnership contacts) */}
            <Section variant="offwhite" labelledBy="about-direction">
                <SectionHeading id="about-direction" eyebrow={t('direction.eyebrow')} title={t('direction.title')} />
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {(['vision', 'mission', 'identity'] as const).map((k) => (
                        <div key={k} className="border-0 border-t-2 border-solid border-gold pt-6">
                            <h3 className={cn('m-0 text-ink', typography.h3)}>{t(`direction.${k}_title`)}</h3>
                            <p className={cn('m-0 mt-3 text-ink-muted', typography.body)}>{t(`direction.${k}_text`)}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}
