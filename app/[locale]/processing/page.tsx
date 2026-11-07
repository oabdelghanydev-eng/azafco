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
    MediaGallery,
    PageHero,
    Pending,
    Section,
    SectionHeader,
} from '@/components/v2';
import { CheckIcon, DocumentIcon } from '@/components/v2/icons';
import Workflow from '@/components/v2/processing/Workflow';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { mediaImage } from '@/lib/v2/media';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

const HERO_ID = 'processing-crew-hygiene-gear';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'processing_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    const og = mediaImage('processing-hall-team', locale);
    return pageMetadata({
        locale,
        path: routes.processing,
        title: t('title'),
        description: t('description'),
        siteName: site('name'),
        image: { url: og.src, alt: og.alt, width: og.width, height: og.height },
    });
}

export default async function ProcessingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'processing_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const hall = mediaImage('processing-hall-team', locale);

    const steps = [
        { key: 'receiving', checkpoint: true },
        { key: 'grading', checkpoint: true },
        { key: 'processing' },
        { key: 'packing', checkpoint: true },
        { key: 'temperature' },
        { key: 'dispatch', checkpoint: true },
    ] as const;
    const capabilities = ['pack', 'weight', 'label', 'destination'] as const;
    const checkpoints = ['receiving', 'grading', 'release'] as const;

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: tv('nav.seafood'), item: `${localeUrl}${routes.seafood}` },
            { '@type': 'ListItem', position: 3, name: tv('nav.processing'), item: `${localeUrl}${routes.processing}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={mediaImage(HERO_ID, locale)}
                imagePosition="center 35%"
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.seafood'), href: routes.seafood }, { label: tv('nav.processing') }]} />}
                primaryAction={{ label: t('hero.primary'), href: rfqHref({ type: 'specifications' }) }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.quality }}
            />

            {/* Factory introduction: function only; location/dates/capacity wait for reconciled facts */}
            <Section variant="offwhite" spacing="md" labelledBy="processing-intro">
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('intro.eyebrow')}</Eyebrow>
                        <h2 id="processing-intro" className="v2-heading font-display text-display-lg">
                            {t('intro.title')}
                        </h2>
                    </div>
                    <div className="space-y-4 lg:col-span-6 lg:col-start-7">
                        <p className="text-body-lg text-fg-muted">{t('intro.text')}</p>
                        <Pending block label="Factory location(s), opening dates (Baltim 2018 / Motobas 2025 vs About page), approval/registration numbers, capacity definition" />
                    </div>
                </div>
            </Section>

            <Section variant="navy" spacing="lg" labelledBy="processing-workflow" className="overflow-hidden">
                <GeoArcs tone="onDark" className="pointer-events-none absolute -bottom-56 -start-40 w-[560px] opacity-50" />
                <div className="relative">
                    <SectionHeader id="processing-workflow" eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} intro={t('workflow.intro')} />
                    <Workflow
                        checkpointLabel={t('workflow.checkpoint')}
                        steps={steps.map((s) => ({
                            key: s.key,
                            title: t(`workflow.${s.key}_title`),
                            description: t(`workflow.${s.key}_text`),
                            checkpoint: 'checkpoint' in s ? s.checkpoint : false,
                        }))}
                    />
                    <div className="mt-6">
                        <Pending label="Step order and control points to be confirmed by the plant manager" />
                    </div>
                </div>
            </Section>

            <Section variant="light" spacing="md" labelledBy="processing-capabilities">
                <SectionHeader id="processing-capabilities" eyebrow={t('capabilities.eyebrow')} title={t('capabilities.title')} intro={t('capabilities.intro')} />
                <FeatureGrid
                    columns={4}
                    items={capabilities.map((k) => ({ title: t(`capabilities.${k}_title`), description: t(`capabilities.${k}_text`) }))}
                />
                <p className="mt-10 flex items-start gap-3 text-body text-fg">
                    <span aria-hidden="true" className="mt-2.5 h-px w-8 shrink-0 bg-gold" />
                    {t('capabilities.constraints')}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    <Pending label="Validated pack formats (box/crate types, net weights), label options, operational constraints" />
                    <Pending label="Packing line / boxed product photos" />
                </div>
            </Section>

            {/* Quality checkpoints + documents */}
            <Section variant="offwhite" spacing="lg" labelledBy="processing-checkpoints">
                <div className="grid items-start gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Eyebrow className="mb-5">{t('checkpoints.eyebrow')}</Eyebrow>
                        <h2 id="processing-checkpoints" className="v2-heading font-display text-display-lg">
                            {t('checkpoints.title')}
                        </h2>
                        <p className="mt-5 text-body-lg text-fg-muted">{t('checkpoints.intro')}</p>
                        <ul className="mt-8 space-y-4">
                            {checkpoints.map((k) => (
                                <li key={k} className="flex gap-3 rounded-card border border-line bg-white p-4 text-body text-ink">
                                    <CheckIcon size={22} className="mt-0.5 shrink-0 text-navy" />
                                    <span>{t(`checkpoints.${k}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-mist">
                            <Image src={hall.src} alt={hall.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                        </div>
                        <div className="mt-6 rounded-card border border-line bg-white p-6">
                            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-control bg-navy-50 text-navy">
                                <DocumentIcon size={22} />
                            </span>
                            <h3 className="text-heading-md text-navy">{t('checkpoints.docs_title')}</h3>
                            <p className="mt-2 text-body-sm text-ink-muted">{t('checkpoints.docs_text')}</p>
                            <div className="mt-5">
                                <Button href={rfqHref({ type: 'specifications' })} variant="secondary">
                                    {t('checkpoints.docs_cta')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Cold chain: no blanket temperature claim */}
            <Section variant="light" spacing="md" labelledBy="processing-coldchain">
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('coldchain.eyebrow')}</Eyebrow>
                        <h2 id="processing-coldchain" className="v2-heading font-display text-heading-xl">
                            {t('coldchain.title')}
                        </h2>
                    </div>
                    <div className="space-y-4 text-body-lg text-fg-muted lg:col-span-6 lg:col-start-7">
                        <p>{t('coldchain.text_1')}</p>
                        <p>{t('coldchain.text_2')}</p>
                        <Pending block label="Verified storage/transport temperature per product + control points and logs" />
                        <Button href={routes.quality} variant="text">
                            {t('coldchain.link')}
                        </Button>
                    </div>
                </div>
            </Section>

            {/* Photography (no video: layout works without one) */}
            <Section variant="offwhite" spacing="md" labelledBy="processing-gallery">
                <SectionHeader id="processing-gallery" eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} intro={t('gallery.intro')} />
                <MediaGallery
                    label={t('gallery.label')}
                    columns={3}
                    items={[{ id: 'processing-hall-team-crates' }, { id: 'facility-exterior-night' }, { id: 'dispatch-truck-loading-bays-wide' }]}
                />
                <div className="mt-10 flex flex-col gap-4 rounded-card border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                    <div>
                        <h3 className="text-heading-md text-navy">{t('gallery.visit_title')}</h3>
                        <p className="mt-2 max-w-prose-v2 text-body-sm text-ink-muted">{t('gallery.visit_text')}</p>
                    </div>
                    <Button href={rfqHref({ type: 'general' })} variant="outline" className="shrink-0">
                        {t('gallery.visit_cta')}
                    </Button>
                </div>
            </Section>

            <CTABand
                headingId="processing-cta"
                eyebrow={t('cta.eyebrow')}
                title={t('cta.title')}
                intro={t('cta.intro')}
                ctaLabel={t('cta.label')}
                prefill={{ type: 'specifications' }}
            />
        </>
    );
}
