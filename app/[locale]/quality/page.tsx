import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    CTABand,
    Eyebrow,
    FAQAccordion,
    FeatureGrid,
    MediaGallery,
    PageHero,
    Pending,
    ProcessSteps,
    Section,
    SectionHeader,
} from '@/components/v2';
import { DocumentIcon } from '@/components/v2/icons';
import CertificateLibrary from '@/components/v2/quality/CertificateLibrary';
import { baseUrl, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { mediaImage } from '@/lib/v2/media';
import { rfqHref, routes, type RfqPrefill } from '@/lib/v2/routes';

type Props = { params: Promise<{ locale: string }> };

/**
 * Document requests. The RFQ form has no 'documents' type yet (lib/v2/routes.ts
 * RfqType), so this uses 'specifications'; switch to { type: 'documents' } once added.
 */
const DOCUMENTS_PREFILL: RfqPrefill = { type: 'documents' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quality_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({ locale, path: routes.quality, title: t('title'), description: t('description'), siteName: site('name') });
}

export default async function QualityPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'quality_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });

    const system = ['spec', 'receiving', 'process', 'release'] as const;
    const share = ['spec', 'shipment', 'docs'] as const;
    const faq = ([1, 2, 3, 4, 5] as const).map((n) => ({ id: `q${n}`, question: t(`faq.q${n}`), answer: t(`faq.a${n}`) }));

    const localeUrl = `${baseUrl}/${locale}`;
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: tv('nav.seafood'), item: `${localeUrl}${routes.seafood}` },
                { '@type': 'ListItem', position: 3, name: tv('nav.quality'), item: `${localeUrl}${routes.quality}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
        },
    ];

    return (
        <>
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
            ))}

            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={mediaImage('processing-area-visit-hygiene', locale)}
                imagePosition="center 30%"
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.seafood'), href: routes.seafood }, { label: tv('nav.quality') }]} />}
                primaryAction={{ label: t('hero.primary'), href: rfqHref(DOCUMENTS_PREFILL) }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.processing }}
            />

            {/* Quality system: internal procedure, clearly not a certification */}
            <Section variant="offwhite" spacing="md" labelledBy="quality-system">
                <SectionHeader id="quality-system" eyebrow={t('system.eyebrow')} title={t('system.title')} intro={t('system.intro')} />
                <ProcessSteps
                    steps={system.map((k) => ({
                        title: t(`system.${k}_title`),
                        description: t(`system.${k}_text`),
                        extra: (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-panel px-2.5 py-0.5 text-caption font-medium text-fg-muted">
                                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-navy" />
                                {t('system.legend_procedure')}
                            </span>
                        ),
                    }))}
                />
                <p className="mt-10 max-w-prose-v2 border-s-4 border-gold ps-4 text-body text-fg">{t('system.legend_note')}</p>
            </Section>

            <Section variant="light" spacing="md" labelledBy="quality-share">
                <SectionHeader id="quality-share" eyebrow={t('share.eyebrow')} title={t('share.title')} />
                <FeatureGrid
                    columns={3}
                    style="card"
                    items={share.map((k) => ({
                        icon: <DocumentIcon size={24} />,
                        title: t(`share.${k}_title`),
                        description: t(`share.${k}_text`),
                    }))}
                />
            </Section>

            {/* Certificates library */}
            <Section variant="offwhite" spacing="lg" labelledBy="quality-certs">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('certs.eyebrow')}</Eyebrow>
                        <h2 id="quality-certs" className="v2-heading font-display text-display-lg">
                            {t('certs.title')}
                        </h2>
                        <p className="mt-5 text-body-lg text-fg-muted">{t('certs.intro')}</p>
                        <div className="mt-8 rounded-card border border-line bg-white p-6">
                            <h3 className="text-heading-sm text-navy">{t('certs.standards_title')}</h3>
                            <p className="mt-2 text-body-sm text-ink-muted">{t('certs.standards_text')}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <CertificateLibrary
                            locale={locale}
                            empty={
                                <div className="flex h-full flex-col rounded-card border border-dashed border-line-strong bg-white p-8">
                                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-control bg-navy-50 text-navy">
                                        <DocumentIcon size={24} />
                                    </span>
                                    <h3 className="text-heading-lg text-navy">{t('certs.empty_title')}</h3>
                                    <p className="mt-3 text-body text-ink-muted">{t('certs.empty_text')}</p>
                                    <div className="mt-6">
                                        <Button href={rfqHref(DOCUMENTS_PREFILL)} variant="secondary" arrow>
                                            {t('certs.request')}
                                        </Button>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            </Section>

            {/* Traceability + market requirements */}
            <Section variant="navy" spacing="lg" labelledBy="quality-trace">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Eyebrow className="mb-5">{t('trace.eyebrow')}</Eyebrow>
                        <h2 id="quality-trace" className="v2-heading font-display text-display-lg">
                            {t('trace.title')}
                        </h2>
                        <div className="mt-6 space-y-4 text-body-lg text-fg-muted">
                            <p>{t('trace.text_1')}</p>
                            <p>{t('trace.text_2')}</p>
                        </div>
                        <div className="mt-6">
                            <Pending label={t('pending.traceability')} />
                        </div>
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8">
                        <div className="rounded-card border border-rule p-6 md:p-8">
                            <h3 className="text-heading-md text-fg">{t('trace.markets_title')}</h3>
                            <p className="mt-3 text-body text-fg-muted">{t('trace.markets_text')}</p>
                            <div className="mt-4">
                                <Pending label={t('pending.market_approvals')} />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section variant="light" spacing="md" labelledBy="quality-visuals">
                <SectionHeader id="quality-visuals" eyebrow={t('visuals.eyebrow')} title={t('visuals.title')} intro={t('visuals.intro')} />
                <MediaGallery
                    label={t('visuals.label')}
                    columns={2}
                    aspect="3/4"
                    items={[{ id: 'processing-area-entrance-visit' }, { id: 'processing-crew-hygiene-gear' }]}
                    className="lg:max-w-4xl"
                />
                <div className="mt-6">
                    <Pending block label={t('pending.qc_photos')} />
                </div>
            </Section>

            <Section variant="offwhite" spacing="md" labelledBy="quality-faq">
                <div className="mx-auto max-w-3xl">
                    <SectionHeader id="quality-faq" eyebrow={t('faq.eyebrow')} title={t('faq.title')} size="md" />
                    <FAQAccordion items={faq} exclusiveName="quality-faq" />
                </div>
            </Section>

            <CTABand
                headingId="quality-cta"
                eyebrow={t('cta.eyebrow')}
                title={t('cta.title')}
                intro={t('cta.intro')}
                ctaLabel={t('cta.label')}
                prefill={DOCUMENTS_PREFILL}
            />
        </>
    );
}
