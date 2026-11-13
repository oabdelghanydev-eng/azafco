import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import type { ImageProps } from '@/lib/v2/media';
import { routes } from '@/lib/v2/routes';
import { Breadcrumbs, Button, PageHero, Section, SectionHeader } from '@/components/v2';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import BusinessArchitecture from '@/components/v2/businesses/BusinessArchitecture';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';

type Props = {
    params: Promise<{ locale: string }>;
};

/** Design G photography (public/images/g), 3:2 masters. */
function gImage(name: 'farm-ponds' | 'sorting-packing', alt: string): ImageProps {
    return { src: `/images/g/${name}.webp`, width: 1536, height: 1024, alt };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'businesses_v2.meta' });
    return buildPageMetadata({ locale, path: '/businesses', title: t('title'), description: t('description') });
}

/**
 * Our businesses: fish at the core (dominant), agriculture, livestock and investments
 * alongside (anchors #agriculture #livestock #investments are redirect targets in
 * next.config.js). The global G footer closes the page with the partnership contacts.
 */
export default async function BusinessesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'businesses_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });

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

            {/* 01 · Hero */}
            <PageHero
                variant="split"
                image={gImage('farm-ponds', t('hero.image_alt'))}
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: routes.contact }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.seafood }}
                proof={<p className="text-body-sm text-fg-muted">{t('hero.reassure')}</p>}
            />

            {/* 02 · Structure: seafood dominant, the other activities alongside (with deep-link anchors) */}
            <Section variant="offwhite" spacing="lg" labelledBy="biz-allocation">
                <SectionHeader
                    id="biz-allocation"
                    eyebrow={t('allocation.eyebrow')}
                    title={t('allocation.title')}
                    intro={t('allocation.intro')}
                />
                <BusinessArchitecture
                    parent={{ name: t('allocation.parent_name'), role: t('allocation.parent_role') }}
                    core={{
                        tag: t('allocation.core_tag'),
                        name: t('allocation.core_name'),
                        description: t('allocation.core_text'),
                        href: routes.seafood,
                        linkLabel: t('allocation.core_link'),
                    }}
                    othersLabel={t('allocation.others_label')}
                    others={[
                        { id: 'agriculture', name: t('allocation.agri_title'), description: t('allocation.agri_text') },
                        { id: 'livestock', name: t('allocation.livestock_title'), description: t('allocation.livestock_text') },
                        { id: 'investments', name: t('allocation.invest_title'), description: t('allocation.invest_text') },
                    ]}
                />
            </Section>

            {/* 03 · Fish business deep link */}
            <Section variant="light" spacing="lg" labelledBy="biz-seafood">
                <EditorialMedia
                    id="biz-seafood"
                    eyebrow={t('seafood.eyebrow')}
                    title={t('seafood.title')}
                    body={[t('seafood.p1'), t('seafood.p2')]}
                    image={gImage('sorting-packing', t('seafood.image_alt'))}
                    links={[
                        { label: t('seafood.link_products'), href: routes.products },
                        { label: t('seafood.link_processing'), href: routes.processing },
                        { label: t('seafood.link_quality'), href: routes.quality },
                        { label: t('seafood.link_importers'), href: routes.forImporters },
                    ]}
                >
                    <Button href={routes.seafood} arrow>
                        {t('seafood.cta_primary')}
                    </Button>
                </EditorialMedia>
            </Section>
        </>
    );
}
