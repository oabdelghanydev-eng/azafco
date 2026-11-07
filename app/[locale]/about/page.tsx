import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { mediaImage } from '@/lib/v2/media';
import { rfqHref, routes } from '@/lib/v2/routes';
import { Breadcrumbs, FeatureGrid, MapPinIcon, PageHero, Pending, Section, SectionHeader } from '@/components/v2';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import BusinessArchitecture from '@/components/v2/businesses/BusinessArchitecture';
import CorporateCta from '@/components/v2/businesses/CorporateCta';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about_v2.meta' });
    return buildPageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'about_v2' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const img = (id: string) => mediaImage(id, locale);

    return (
        <>
            <PageStructuredData locale={locale} pageType="about" />

            {/* 01 · Opening corporate manifesto */}
            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={img('facility-exterior-night')}
                imagePosition="60% center"
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: routes.businesses }}
                secondaryAction={{ label: t('hero.secondary'), href: rfqHref({ type: 'corporate' }) }}
            />

            {/* 02 · Origin and history: editorial only, no unverified timeline */}
            <Section variant="offwhite" labelledBy="about-story">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeader id="about-story" eyebrow={t('story.eyebrow')} title={t('story.title')} className="mb-0 md:mb-0" />
                    </div>
                    <div className="space-y-5 lg:col-span-6 lg:col-start-7">
                        <p className="text-body-lg text-fg">{t('story.p1')}</p>
                        <p className="text-body text-fg-muted">{t('story.p2')}</p>
                        <Pending block label={t('pending.milestones')} />
                    </div>
                </div>
            </Section>

            {/* 03 · Business architecture */}
            <Section variant="light" labelledBy="about-architecture">
                <SectionHeader
                    id="about-architecture"
                    eyebrow={t('architecture.eyebrow')}
                    title={t('architecture.title')}
                    intro={t('architecture.intro')}
                />
                <BusinessArchitecture
                    parent={{ name: 'AZAFCO International', role: t('architecture.parent_role') }}
                    core={{
                        tag: t('architecture.core_tag'),
                        name: t('architecture.core_name'),
                        description: t('architecture.core_text'),
                        href: routes.seafood,
                        linkLabel: t('architecture.core_link'),
                    }}
                    othersLabel={t('architecture.others_label')}
                    others={[
                        { name: t('architecture.agri_title'), description: t('architecture.agri_text') },
                        { name: t('architecture.livestock_title'), description: t('architecture.livestock_text') },
                        {
                            name: t('architecture.invest_title'),
                            description: t('architecture.invest_text'),
                            note: <Pending label={t('pending.invest')} />,
                        },
                    ]}
                />
            </Section>

            {/* 04 · Operating footprint (verified plant only; no map until address approval) */}
            <Section variant="offwhite" labelledBy="about-footprint">
                <EditorialMedia
                    id="about-footprint"
                    eyebrow={t('footprint.eyebrow')}
                    title={t('footprint.title')}
                    body={[t('footprint.p1'), t('footprint.p2')]}
                    image={img('dispatch-truck-loading-bays-wide')}
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
                    <Pending block label={t('pending.assets')} className="mt-6" />
                </EditorialMedia>
            </Section>

            {/* 05 · Principles */}
            <Section variant="light" labelledBy="about-principles">
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

            {/* 06 · People (leadership only once approved) */}
            <Section variant="offwhite" labelledBy="about-people">
                <EditorialMedia
                    id="about-people"
                    eyebrow={t('people.eyebrow')}
                    title={t('people.title')}
                    body={[t('people.p1'), t('people.p2')]}
                    image={img('staff-recognition-group')}
                >
                    <Pending block label={t('pending.leadership')} />
                </EditorialMedia>
            </Section>

            {/* 07 · Our direction */}
            <Section variant="light" labelledBy="about-direction">
                <SectionHeader id="about-direction" eyebrow={t('direction.eyebrow')} title={t('direction.title')} />
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {(['vision', 'mission', 'identity'] as const).map((k) => (
                        <div key={k} className="border-t border-gold pt-6">
                            <h3 className="text-heading-md text-fg">{t(`direction.${k}_title`)}</h3>
                            <p className="mt-3 text-body text-fg-muted">{t(`direction.${k}_text`)}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 08 · Corporate CTA */}
            <CorporateCta
                id="about-cta"
                eyebrow={t('cta.eyebrow')}
                title={t('cta.title')}
                intro={t('cta.intro')}
                primary={{ label: t('cta.primary'), href: routes.businesses }}
                secondary={{ label: t('cta.secondary'), href: rfqHref({ type: 'corporate' }) }}
                supplyLink={{ lead: t('cta.supply_lead'), label: t('cta.supply_link'), href: rfqHref() }}
                emailLabel={t('cta.email_label')}
                extra={<Pending block label={t('pending.profile')} />}
            />
        </>
    );
}
