import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { mediaImage } from '@/lib/v2/media';
import { rfqHref, routes } from '@/lib/v2/routes';
import { Breadcrumbs, Button, FeatureGrid, MediaGallery, PageHero, Pending, Section, SectionHeader } from '@/components/v2';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import BusinessArchitecture from '@/components/v2/businesses/BusinessArchitecture';
import CorporateCta from '@/components/v2/businesses/CorporateCta';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'businesses_v2.meta' });
    return buildPageMetadata({ locale, path: '/businesses', title: t('title'), description: t('description') });
}

export default async function BusinessesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'businesses_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const img = (id: string) => mediaImage(id, locale);

    const baseUrl = companyConfig.contact.baseUrl;
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: `${baseUrl}/${locale}` },
            { '@type': 'ListItem', position: 2, name: t('breadcrumb'), item: `${baseUrl}/${locale}/businesses` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            {/* 01 · Corporate portfolio hero */}
            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={img('meeting-room-visit')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: routes.seafood }}
                secondaryAction={{ label: t('hero.secondary'), href: rfqHref({ type: 'corporate' }) }}
            />

            {/* 02 · Business allocation: seafood dominant, the rest subordinate */}
            <Section variant="offwhite" labelledBy="biz-allocation">
                <SectionHeader
                    id="biz-allocation"
                    eyebrow={t('allocation.eyebrow')}
                    title={t('allocation.title')}
                    intro={t('allocation.intro')}
                />
                <BusinessArchitecture
                    parent={{ name: 'AZAFCO International', role: t('allocation.parent_role') }}
                    core={{
                        tag: t('allocation.core_tag'),
                        name: t('allocation.core_name'),
                        description: t('allocation.core_text'),
                        href: routes.seafood,
                        linkLabel: t('allocation.core_link'),
                    }}
                    othersLabel={t('allocation.others_label')}
                    others={[{ name: t('others.agri_title') }, { name: t('others.livestock_title') }, { name: t('others.invest_title') }]}
                />
            </Section>

            {/* 03 · Seafood deep link, proof-led imagery */}
            <Section variant="light" spacing="lg" labelledBy="biz-seafood">
                <EditorialMedia
                    id="biz-seafood"
                    eyebrow={t('seafood.eyebrow')}
                    title={t('seafood.title')}
                    body={[t('seafood.p1'), t('seafood.p2')]}
                    image={img('processing-hall-team')}
                    aspect="4/5"
                    links={[
                        { label: t('seafood.link_products'), href: routes.products },
                        { label: t('seafood.link_processing'), href: routes.processing },
                        { label: t('seafood.link_quality'), href: routes.quality },
                        { label: t('seafood.link_importers'), href: routes.forImporters },
                    ]}
                >
                    <div className="flex flex-wrap gap-3">
                        <Button href={routes.seafood} arrow>
                            {t('seafood.cta_primary')}
                        </Button>
                        <Button href={rfqHref()} variant="outline">
                            {t('seafood.cta_rfq')}
                        </Button>
                    </div>
                </EditorialMedia>
                <MediaGallery
                    className="mt-12 md:mt-16"
                    columns={3}
                    items={[{ id: 'processing-crew-hygiene-gear' }, { id: 'dispatch-truck-loading-bays-group' }, { id: 'product-sea-bass-whole' }]}
                />
            </Section>

            {/* 04–06 · Agriculture, Livestock, Investments: factual text only, no empty cards */}
            <Section variant="offwhite" labelledBy="biz-others" id="other-activities">
                <SectionHeader
                    id="biz-others"
                    eyebrow={t('others.eyebrow')}
                    title={t('others.title')}
                    intro={t('others.intro')}
                    size="md"
                />
                <FeatureGrid
                    columns={3}
                    items={(['agri', 'livestock', 'invest'] as const).map((k) => ({
                        // Anchors for /businesses#agriculture etc. (redirect targets in next.config.js)
                        id: ({ agri: 'agriculture', livestock: 'livestock', invest: 'investments' } as const)[k],
                        title: t(`others.${k}_title`),
                        description: (
                            <>
                                <p>{t(`others.${k}_text`)}</p>
                                <Pending label={t(`pending.${k}`)} className="mt-3" />
                            </>
                        ),
                    }))}
                />
            </Section>

            {/* 07 · Partner enquiry (separate from the fish RFQ) + 08 route back to seafood */}
            <CorporateCta
                id="biz-partner"
                eyebrow={t('partner.eyebrow')}
                title={t('partner.title')}
                intro={t('partner.intro')}
                primary={{ label: t('partner.primary'), href: rfqHref({ type: 'corporate' }) }}
                secondary={{ label: t('partner.secondary'), href: routes.contact }}
                supplyLink={{ lead: t('partner.supply_lead'), label: t('partner.supply_link'), href: rfqHref() }}
                emailLabel={t('partner.email_label')}
                extra={<Pending block label={t('pending.profile')} />}
            />
        </>
    );
}
