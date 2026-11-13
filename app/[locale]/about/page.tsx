import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { companyConfig } from '@/config/company.config';
import { Link } from '@/navigation';
import { routes } from '@/lib/v2/routes';
import type { ImageProps } from '@/lib/v2/media';
import {
    ArrowIcon,
    Breadcrumbs,
    FeatureGrid,
    HeadingPhoto,
    MapPinIcon,
    PageHero,
    ProcessSteps,
    Section,
    SectionHeader,
    StatPanel,
} from '@/components/v2';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
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
 * The ISO standard names ("A · B · C" in the JSON) as unbreakable chunks, so a narrow
 * StatPanel cell never splits "ISO" from its number or starts a line with the separator.
 */
function IsoStandards({ text }: { text: string }) {
    const items = text.split('·').map((s) => s.trim()).filter(Boolean);
    return (
        <span dir="ltr" className="inline-flex flex-wrap gap-x-1.5">
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
 * About: who we are (2008, farm and source, in-house operations), the figures the
 * owner approved (founded, capacity, ISO, markets), how the businesses fit, where
 * we work and how we deal with buyers. The global G footer closes the page with
 * the partnership contacts (WhatsApp = management, email = export team).
 */
export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'about_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });

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
                primaryAction={{ label: t('hero.primary'), href: routes.contact }}
                secondaryAction={{ label: t('hero.secondary'), href: companyConfig.contact.social.whatsapp, external: true }}
                proof={<p className="text-body-sm text-fg-muted">{t('hero.reassure')}</p>}
            />

            {/* 02 · Story + approved figures */}
            <Section variant="offwhite" spacing="lg" labelledBy="about-story">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeader id="about-story" eyebrow={t('story.eyebrow')} title={t('story.title')} className="mb-0 md:mb-0" />
                        <HeadingPhoto id="photo-delta-landscape" />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className="text-body-lg text-fg">{t('story.p1')}</p>
                        <p className="mt-5 text-body text-fg-muted">{t('story.p2')}</p>
                        <StatPanel
                            className="mt-10"
                            columns={2}
                            stats={[
                                { value: t('facts.founded_value'), label: t('facts.founded_label'), verified: true },
                                { value: t('facts.capacity_value'), label: t('facts.capacity_label'), verified: true },
                                {
                                    value: t('facts.iso_value'),
                                    label: t('facts.iso_label'),
                                    note: <IsoStandards text={t('facts.iso_note')} />,
                                    verified: true,
                                },
                                { value: t('facts.markets_value'), label: t('facts.markets_label'), verified: true },
                            ]}
                        />
                        <Link
                            href={routes.quality}
                            data-cta="about_quality"
                            className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-fg underline decoration-gold decoration-2 underline-offset-[6px]"
                        >
                            {t('facts.iso_link')}
                            <ArrowIcon size={16} />
                        </Link>
                    </div>
                </div>
            </Section>

            {/* 03 · In-house operations, pond to pallet */}
            <Section variant="light" spacing="lg" labelledBy="about-operations">
                <SectionHeader
                    id="about-operations"
                    eyebrow={t('operations.eyebrow')}
                    title={t('operations.title')}
                    intro={t('operations.intro')}
                />
                <ProcessSteps
                    steps={[1, 2, 3, 4, 5].map((n) => ({
                        title: t(`operations.s${n}_title`),
                        description: t(`operations.s${n}_text`),
                    }))}
                />
            </Section>

            {/* 04 · Our businesses (detail on /businesses) */}
            <Section variant="offwhite" spacing="lg" labelledBy="about-businesses">
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

            {/* 05 · Plant, trucks and cold stores */}
            <Section variant="light" spacing="lg" labelledBy="about-footprint">
                <EditorialMedia
                    id="about-footprint"
                    eyebrow={t('footprint.eyebrow')}
                    title={t('footprint.title')}
                    body={[t('footprint.p1'), t('footprint.p2')]}
                    image={gImage('sorting-packing', t('footprint.image_alt'))}
                    imageSide="start"
                >
                    <h3 className="text-heading-sm text-fg">{t('footprint.addresses_title')}</h3>
                    <ul className="mt-4 space-y-4">
                        {(['factory', 'main'] as const).map((k) => (
                            <li key={k} className="flex items-start gap-3">
                                <MapPinIcon className="mt-1 shrink-0 text-eyebrow" />
                                <div>
                                    <p className="text-body-sm font-semibold text-fg">{tc(`addresses.${k}.title`)}</p>
                                    <address className="text-body-sm not-italic text-fg-muted">{tc(`addresses.${k}.address`)}</address>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <a
                        href={PLANT_MAP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="about_plant_map"
                        className="mt-4 inline-flex min-h-[44px] items-center gap-2 font-semibold text-fg underline decoration-gold decoration-2 underline-offset-[6px]"
                    >
                        {t('footprint.map_link')}
                        <span className="sr-only"> {t('footprint.opens_new_tab')}</span>
                        <ArrowIcon size={16} />
                    </a>
                </EditorialMedia>
            </Section>

            {/* 06 · How we work with buyers */}
            <Section variant="offwhite" spacing="lg" labelledBy="about-principles">
                <SectionHeader
                    id="about-principles"
                    eyebrow={t('principles.eyebrow')}
                    title={t('principles.title')}
                    intro={t('principles.intro')}
                />
                <FeatureGrid
                    columns={4}
                    items={[1, 2, 3, 4].map((n) => ({
                        title: t(`principles.i${n}_title`),
                        description: t(`principles.i${n}_text`),
                    }))}
                />
            </Section>

            {/* 07 · Vision, mission, identity (the global G footer follows with the partnership contacts) */}
            <Section variant="light" spacing="lg" labelledBy="about-direction">
                <SectionHeader id="about-direction" eyebrow={t('direction.eyebrow')} title={t('direction.title')} />
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {(['vision', 'mission', 'identity'] as const).map((k) => (
                        <div key={k} className="border-t-2 border-gold pt-6">
                            <h3 className="text-heading-md text-fg">{t(`direction.${k}_title`)}</h3>
                            <p className="mt-3 text-body text-fg-muted">{t(`direction.${k}_text`)}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}
