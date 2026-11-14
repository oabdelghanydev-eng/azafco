import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    BoxIcon,
    Breadcrumbs,
    Button,
    CheckIcon,
    ClipboardCheckIcon,
    CrateIcon,
    Eyebrow,
    HarvestNetIcon,
    MailIcon,
    PageHero,
    Section,
    SectionHeading,
    TextLink,
    TruckIcon,
    cn,
    typography,
} from '@/components/ui';
import FeatureGrid from '@/components/v2/FeatureGrid';
import HeadingPhoto from '@/components/v2/HeadingPhoto';
import Pending from '@/components/v2/Pending';
import ProcessSteps from '@/components/v2/ProcessSteps';
import SpeciesIndex from '@/components/v2/seafood/SpeciesIndex';
import { baseUrl, getCatalogue, jsonLd, pageMetadata } from '@/components/v2/products/catalogue';
import { routes } from '@/lib/v2/routes';
import { mediaImage } from '@/lib/v2/media';
import { companyConfig } from '@/config/company.config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seafood_v2.meta' });
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    return pageMetadata({
        locale,
        path: routes.seafood,
        title: t('title'),
        description: t('description'),
        siteName: site('name'),
    });
}

export default async function SeafoodPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'seafood_v2' });
    const tc = await getTranslations({ locale, namespace: 'catalogue_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    // Published species only (eel is kept in data but unpublished)
    const catalogue = await getCatalogue(locale);

    // The five approved value-chain stages (RELEASE-DECISIONS, 14 Nov 2026)
    const chain = ['farm', 'harvest', 'pack', 'inspect', 'export'] as const;
    const chainIcons = {
        farm: <HarvestNetIcon size={24} />,
        harvest: <CrateIcon size={24} />,
        pack: <BoxIcon size={24} />,
        inspect: <ClipboardCheckIcon size={24} />,
        export: <TruckIcon size={24} />,
    };
    const docsHref = `mailto:${companyConfig.contact.email}?subject=${encodeURIComponent(t('quality.docs_subject'))}`;
    const requirements = ['format', 'grade', 'weight', 'packing', 'destination'] as const;
    const audience = ['importers', 'distributors', 'foodservice', 'horeca', 'partners'] as const;

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: tv('breadcrumbs.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('breadcrumb'), item: `${localeUrl}${routes.seafood}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

            <PageHero
                image={mediaImage('photo-seafood-hero', locale)}
                imagePosition="center 40%"
                variant="fullbleed"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                actions={
                    <>
                        <Button href={routes.products} size="lg" stretch="phone" arrow>
                            {t('hero.primary')}
                        </Button>
                        <Button href={routes.processing} variant="outline" size="lg" stretch="phone">
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            {/* Buyer-spec language in the first scroll */}
            <Section variant="white" labelledBy="seafood-chain">
                <SectionHeading id="seafood-chain" eyebrow={t('chain.eyebrow')} title={t('chain.title')} intro={t('chain.intro')} />
                <ProcessSteps
                    steps={chain.map((k) => ({ title: t(`chain.${k}_title`), description: t(`chain.${k}_text`), icon: chainIcons[k] }))}
                />
            </Section>

            <Section variant="offwhite" labelledBy="seafood-species">
                <SectionHeading
                    id="seafood-species"
                    eyebrow={t('species.eyebrow')}
                    title={t('species.title')}
                    intro={t('species.intro')}
                    action={
                        <Button href={routes.products} variant="outline" arrow>
                            {t('species.view_all')}
                        </Button>
                    }
                />
                <SpeciesIndex
                    items={catalogue}
                    meta={Object.fromEntries(catalogue.map((p) => [p.slug, tc(`water.${p.category}`)]))}
                />
                {/* Owner, 13 Nov 2026: the 12 are the main species; others on request */}
                <p className={cn('m-0 mt-8 border-0 border-s-2 border-solid border-gold ps-4 font-medium text-fg', typography.lead)}>{t('species.more_species')}</p>
            </Section>

            {/* Farm / supply: no farm photos yet, so a typographic navy band */}
            <Section variant="navy" labelledBy="seafood-farm">
                <div className="relative grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('farm.eyebrow')}</Eyebrow>
                        <h2 id="seafood-farm" className={cn('v2-heading m-0', typography.h2)}>
                            {t('farm.title')}
                        </h2>
                        <HeadingPhoto id="photo-harvest" />
                    </div>
                    <div className={cn('space-y-5 text-fg-muted lg:col-span-6 lg:col-start-7', typography.lead)}>
                        <p className="m-0">{t('farm.text_1')}</p>
                        <Pending block label={t('pending.farm')} />
                    </div>
                </div>
            </Section>

            {/* Processing precision */}
            <Section variant="white" labelledBy="seafood-processing">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Eyebrow className="mb-5">{t('processing.eyebrow')}</Eyebrow>
                        <h2 id="seafood-processing" className={cn('v2-heading m-0', typography.h2)}>
                            {t('processing.title')}
                        </h2>
                        <HeadingPhoto id="photo-processing" />
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className={cn('m-0 text-fg-muted', typography.lead)}>{t('processing.text')}</p>
                        <ul className="m-0 mt-6 list-none space-y-3 p-0">
                            {(['point_1', 'point_2', 'point_3'] as const).map((k) => (
                                <li key={k} className={cn('flex gap-3 text-fg', typography.body)}>
                                    <CheckIcon size={24} className="mt-0.5 shrink-0 text-eyebrow" />
                                    <span>{t(`processing.${k}`)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <TextLink href={routes.processing}>{t('processing.link')}</TextLink>
                        </div>
                    </div>
                </div>
            </Section>

            <Section variant="offwhite" labelledBy="seafood-requirements">
                <SectionHeading id="seafood-requirements" eyebrow={t('requirements.eyebrow')} title={t('requirements.title')} intro={t('requirements.intro')} />
                <FeatureGrid
                    columns={3}
                    style="card"
                    items={[
                        ...requirements.map((k) => ({ title: t(`requirements.${k}_title`), description: t(`requirements.${k}_text`) })),
                        // Fills the sixth slot of the 3-column grid: a contact link
                        {
                            title: tv('fill.spec_title'),
                            description: tv('fill.spec_text'),
                            href: routes.contact,
                            linkLabel: tv('cta.contact_export_team'),
                            tint: true,
                        },
                    ]}
                />
            </Section>

            <Section variant="white" labelledBy="seafood-quality">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <Eyebrow className="mb-5">{t('quality.eyebrow')}</Eyebrow>
                        <h2 id="seafood-quality" className={cn('v2-heading m-0', typography.h2)}>
                            {t('quality.title')}
                        </h2>
                        <p className={cn('m-0 mt-5 max-w-prose-v2 text-fg-muted', typography.lead)}>{t('quality.text')}</p>
                        <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3.5">
                            <Button href={routes.quality} variant="outline" size="lg" stretch="phone" arrow>
                                {t('quality.link')}
                            </Button>
                            <Button
                                href={docsHref}
                                variant="ghost"
                                size="lg"
                                stretch="phone"
                                icon={<MailIcon size={20} />}
                                dataAttrs={{ 'data-cta': 'seafood_documents_email' }}
                            >
                                {t('quality.docs_email')}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-5 lg:col-start-8">
                        <Eyebrow className="mb-3">{t('audience.eyebrow')}</Eyebrow>
                        <h3 className={cn('m-0 text-fg', typography.h3)}>{t('audience.title')}</h3>
                        <ul className="m-0 mt-4 list-none divide-y divide-rule border-0 border-y border-solid border-rule p-0">
                            {audience.map((k) => (
                                <li key={k} className={cn('flex items-center gap-3 py-3.5 text-fg', typography.body)}>
                                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                    {t(`audience.${k}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>
            {/* The G footer closes the page with the WhatsApp (management) and email (export team) rows. */}
        </>
    );
}
