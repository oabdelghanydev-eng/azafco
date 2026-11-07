import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    CTABand,
    Eyebrow,
    FeatureGrid,
    GeoArcs,
    PageHero,
    Pending,
    ProcessSteps,
    Section,
    SectionHeader,
} from '@/components/v2';
import { CheckIcon } from '@/components/v2/icons';
import SpeciesIndex from '@/components/v2/seafood/SpeciesIndex';
import { baseUrl, getCatalogue, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { mediaImage } from '@/lib/v2/media';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seafood_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    const hero = mediaImage('processing-hall-team', locale);
    return pageMetadata({
        locale,
        path: routes.seafood,
        title: t('title'),
        description: t('description'),
        siteName: site('name'),
        image: { url: hero.src, alt: hero.alt, width: hero.width, height: hero.height },
    });
}

export default async function SeafoodPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'seafood_v2' });
    const tc = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const catalogue = await getCatalogue(locale);
    const processingImage = mediaImage('processing-hall-team-crates', locale);

    const chain = ['farm', 'select', 'process', 'pack', 'export'] as const;
    const requirements = ['format', 'grade', 'weight', 'packing', 'destination'] as const;
    const audience = ['importers', 'distributors', 'foodservice', 'horeca', 'partners'] as const;

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: tv('nav.seafood'), item: `${localeUrl}${routes.seafood}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

            <PageHero
                variant="fullbleed"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={mediaImage('processing-hall-team', locale)}
                imagePosition="center 40%"
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.seafood') }]} />}
                primaryAction={{ label: t('hero.primary'), href: routes.products }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.processing }}
            />

            {/* Buyer-spec language in the first scroll */}
            <Section variant="light" spacing="md" labelledBy="seafood-chain">
                <SectionHeader id="seafood-chain" eyebrow={t('chain.eyebrow')} title={t('chain.title')} intro={t('chain.intro')} />
                <ProcessSteps
                    steps={chain.map((k) => ({ title: t(`chain.${k}_title`), description: t(`chain.${k}_text`) }))}
                />
            </Section>

            <Section variant="offwhite" spacing="md" labelledBy="seafood-species">
                <SectionHeader
                    id="seafood-species"
                    eyebrow={t('species.eyebrow')}
                    title={t('species.title')}
                    intro={t('species.intro')}
                    action={
                        <Button href={routes.products} variant="secondary" arrow>
                            {t('species.view_all')}
                        </Button>
                    }
                />
                <SpeciesIndex
                    items={catalogue}
                    meta={Object.fromEntries(catalogue.map((p) => [p.slug, tc(`water.${p.category}`)]))}
                />
            </Section>

            {/* Farm / supply: no farm photos yet, so a typographic navy band */}
            <Section variant="navy" spacing="lg" labelledBy="seafood-farm" className="overflow-hidden">
                <GeoArcs tone="onDark" className="pointer-events-none absolute -end-40 -top-40 w-[560px] opacity-60" />
                <div className="relative grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('farm.eyebrow')}</Eyebrow>
                        <h2 id="seafood-farm" className="v2-heading font-display text-display-lg">
                            {t('farm.title')}
                        </h2>
                    </div>
                    <div className="space-y-5 text-body-lg text-fg-muted lg:col-span-6 lg:col-start-7">
                        <p>{t('farm.text_1')}</p>
                        <Pending block label="Fish farm photos + verified farm areas, species and production figures" />
                    </div>
                </div>
            </Section>

            {/* Processing precision */}
            <Section variant="light" spacing="lg" labelledBy="seafood-processing">
                <div className="grid items-center gap-10 lg:grid-cols-12">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-mist lg:col-span-6">
                        <Image
                            src={processingImage.src}
                            alt={processingImage.alt}
                            fill
                            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8">
                        <Eyebrow className="mb-5">{t('processing.eyebrow')}</Eyebrow>
                        <h2 id="seafood-processing" className="v2-heading font-display text-display-lg">
                            {t('processing.title')}
                        </h2>
                        <p className="mt-5 text-body-lg text-fg-muted">{t('processing.text')}</p>
                        <ul className="mt-6 space-y-3">
                            {(['point_1', 'point_2', 'point_3'] as const).map((k) => (
                                <li key={k} className="flex gap-3 text-body text-fg">
                                    <CheckIcon size={22} className="mt-0.5 shrink-0 text-eyebrow" />
                                    <span>{t(`processing.${k}`)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Button href={routes.processing} variant="text">
                                {t('processing.link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            <Section variant="offwhite" spacing="md" labelledBy="seafood-requirements">
                <SectionHeader id="seafood-requirements" eyebrow={t('requirements.eyebrow')} title={t('requirements.title')} intro={t('requirements.intro')} />
                <FeatureGrid
                    columns={3}
                    style="card"
                    items={requirements.map((k) => ({ title: t(`requirements.${k}_title`), description: t(`requirements.${k}_text`) }))}
                />
            </Section>

            <Section variant="light" spacing="md" labelledBy="seafood-quality">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Eyebrow className="mb-5">{t('quality.eyebrow')}</Eyebrow>
                        <h2 id="seafood-quality" className="v2-heading font-display text-display-lg">
                            {t('quality.title')}
                        </h2>
                        <p className="mt-5 max-w-prose-v2 text-body-lg text-fg-muted">{t('quality.text')}</p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button href={routes.quality} variant="secondary" arrow>
                                {t('quality.link')}
                            </Button>
                            <Button href={rfqHref({ type: 'specifications' })} variant="text">
                                {t('quality.docs')}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8">
                        <Eyebrow className="mb-3">{t('audience.eyebrow')}</Eyebrow>
                        <h3 className="text-heading-md text-fg">{t('audience.title')}</h3>
                        <ul className="mt-4 divide-y divide-rule border-y border-rule">
                            {audience.map((k) => (
                                <li key={k} className="flex items-center gap-3 py-3.5 text-body text-fg">
                                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                    {t(`audience.${k}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <CTABand
                headingId="seafood-cta"
                eyebrow={t('cta.eyebrow')}
                title={t('cta.title')}
                intro={t('cta.intro')}
                ctaLabel={t('cta.label')}
                prefill={{ type: 'product' }}
            />
        </>
    );
}
