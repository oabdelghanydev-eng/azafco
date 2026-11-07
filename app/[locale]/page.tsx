import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageStructuredData } from '@/components/StructuredData';
import { products } from '@/data/products';
import { mediaImage, productMediaId } from '@/lib/v2/media';
import { productHref, rfqHref, routes } from '@/lib/v2/routes';
import {
    Button,
    CTABand,
    CheckIcon,
    DocumentIcon,
    FeatureGrid,
    GlobeIcon,
    MailIcon,
    MapPinIcon,
    PageHero,
    Pending,
    ProcessSteps,
    ProductCard,
    ProofStrip,
    Section,
    SectionHeader,
} from '@/components/v2';
import EditorialMedia from '@/components/v2/home/EditorialMedia';
import { buildPageMetadata } from '@/components/v2/businesses/pageMetadata';
import { activeMarketConfigs } from '@/components/v2/markets/marketData';
import { Link } from '@/navigation';

type Props = {
    params: Promise<{ locale: string }>;
};

/** Species featured on the home page (brief §08 block 04: 3–4 real products). */
const FEATURED = ['tilapia', 'sea-bass', 'mullet'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'home_v2.meta' });
    return buildPageMetadata({ locale, path: '', title: t('title'), description: t('description') });
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'home_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const td = await getTranslations({ locale, namespace: 'data.products' });
    const tm = await getTranslations({ locale, namespace: 'data.markets' });
    const img = (id: string) => mediaImage(id, locale);
    // Active markets from config/company.config.ts (same source as /markets)
    const activeMarkets = activeMarketConfigs.map((m) => ({ key: m.key, name: tm(`${m.key}.country`) }));
    const activeMarketList = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(
        activeMarkets.map((m) => m.name),
    );

    const featured = FEATURED.map((slug) => products.find((p) => p.slug === slug)).filter(
        (p): p is (typeof products)[number] => Boolean(p),
    );

    return (
        <>
            <PageStructuredData locale={locale} pageType="home" />

            {/* 01 · Hero */}
            <PageHero
                size="2xl"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                image={img('processing-hall-team')}
                imagePosition="center 40%"
                primaryAction={{ label: tv('cta.request_quote'), href: rfqHref() }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.products }}
            />

            {/* 02 · Trust strip (verified facts only; the rest stays Pending) */}
            <Section variant="offwhite" spacing="sm" labelledBy="home-trust">
                <h2 id="home-trust" className="sr-only">
                    {t('trust.title')}
                </h2>
                <ProofStrip
                    items={[
                        { title: t('trust.plant_title'), detail: t('trust.plant_detail'), icon: <MapPinIcon /> },
                        { title: t('trust.register_title'), detail: t('trust.register_detail'), icon: <DocumentIcon /> },
                        { title: t('trust.spec_title'), detail: t('trust.spec_detail'), icon: <CheckIcon /> },
                        { title: t('trust.direct_title'), detail: t('trust.direct_detail'), icon: <MailIcon /> },
                        { title: t('trust.markets_title'), detail: activeMarketList, icon: <GlobeIcon /> },
                        { title: '', pending: t('pending.certificates') },
                    ]}
                />
            </Section>

            {/* 03 · Seafood dominance */}
            <Section variant="light" labelledBy="home-seafood">
                <EditorialMedia
                    id="home-seafood"
                    eyebrow={t('seafood.eyebrow')}
                    title={t('seafood.title')}
                    body={[t('seafood.p1'), t('seafood.p2')]}
                    image={img('processing-hall-team-crates')}
                    aspect="4/5"
                    links={[
                        { label: t('seafood.link_overview'), href: routes.seafood },
                        { label: t('seafood.link_products'), href: routes.products },
                        { label: t('seafood.link_processing'), href: routes.processing },
                        { label: t('seafood.link_quality'), href: routes.quality },
                    ]}
                />
            </Section>

            {/* 04 · Core products */}
            <Section variant="offwhite" labelledBy="home-products">
                <SectionHeader
                    id="home-products"
                    eyebrow={t('products.eyebrow')}
                    title={t('products.title')}
                    intro={t('products.intro')}
                    action={
                        <Button href={routes.products} variant="outline" arrow>
                            {t('products.view_all')}
                        </Button>
                    }
                />
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {featured.map((p) => {
                        const mid = productMediaId(p.slug);
                        return (
                            <li key={p.slug}>
                                <ProductCard
                                    name={td(`${p.translationKey}.name`)}
                                    scientificName={p.scientificName}
                                    href={productHref(p.slug)}
                                    image={mid ? img(mid) : undefined}
                                    tag={td(`${p.translationKey}.category`)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </Section>

            {/* 05 · From origin to shipment */}
            <Section variant="light" labelledBy="home-process">
                <SectionHeader id="home-process" eyebrow={t('process.eyebrow')} title={t('process.title')} intro={t('process.intro')} />
                <ProcessSteps
                    orientation="horizontal"
                    steps={[1, 2, 3, 4].map((n) => ({ title: t(`process.s${n}_title`), description: t(`process.s${n}_text`) }))}
                />
                <Pending block label={t('pending.farm_photo')} className="mt-10" />
            </Section>

            {/* 06 · Processing capability */}
            <Section variant="navy" spacing="lg" labelledBy="home-processing">
                <EditorialMedia
                    id="home-processing"
                    eyebrow={t('processing.eyebrow')}
                    title={t('processing.title')}
                    body={[t('processing.p1'), t('processing.p2')]}
                    image={img('facility-exterior-night')}
                    imageSide="start"
                    aspect="16/9"
                >
                    <h3 className="text-heading-sm text-fg">{t('processing.req_title')}</h3>
                    <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <li key={n} className="flex items-start gap-3 text-body-sm text-fg-muted">
                                <CheckIcon size={18} className="mt-0.5 shrink-0 text-gold" />
                                <span>{t(`processing.req_${n}`)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <Button href={routes.processing} variant="outline" arrow>
                            {t('processing.cta')}
                        </Button>
                    </div>
                    <Pending label={t('pending.capacity')} className="mt-6" />
                </EditorialMedia>
            </Section>

            {/* 07 · Quality proof */}
            <Section variant="light" labelledBy="home-quality">
                <EditorialMedia
                    id="home-quality"
                    eyebrow={t('quality.eyebrow')}
                    title={t('quality.title')}
                    body={[t('quality.p1'), t('quality.p2')]}
                    image={img('processing-area-visit-hygiene')}
                    aspect="4/5"
                    imagePosition="center 30%"
                >
                    <Pending block label={t('pending.certificate_cards')} className="mb-6" />
                    <div className="flex flex-wrap gap-3">
                        <Button href={rfqHref({ type: 'documents' })} variant="secondary" icon={<DocumentIcon />}>
                            {t('quality.cta_docs')}
                        </Button>
                        <Button href={routes.quality} variant="text" arrow>
                            {t('quality.cta_quality')}
                        </Button>
                    </div>
                </EditorialMedia>
            </Section>

            {/* 08 · Markets / export approach (active list from config, same as /markets) */}
            <Section variant="offwhite" labelledBy="home-markets">
                <SectionHeader id="home-markets" eyebrow={t('markets.eyebrow')} title={t('markets.title')} intro={t('markets.intro')} />
                <FeatureGrid
                    columns={3}
                    items={[1, 2, 3].map((n) => ({
                        title: t(`markets.i${n}_title`),
                        description: t(`markets.i${n}_text`),
                        icon: n === 1 ? <GlobeIcon /> : n === 2 ? <DocumentIcon /> : <CheckIcon />,
                    }))}
                />
                <div className="mt-10 flex flex-wrap gap-3">
                    <Button href={routes.markets} variant="outline" arrow>
                        {t('markets.link_markets')}
                    </Button>
                    <Button href={routes.forImporters} variant="text" arrow>
                        {t('markets.link_importers')}
                    </Button>
                </div>
                <p className="mt-8 text-body-sm text-fg-muted">
                    <span className="font-semibold text-fg">{t('markets.active_label')}</span>{' '}
                    {activeMarkets.map((m, i) => (
                        <span key={m.key}>
                            {i > 0 ? (locale === 'ar' ? '، ' : ', ') : null}
                            <Link href={`${routes.markets}/${m.key}`} className="font-medium text-navy underline-offset-4 hover:underline">
                                {m.name}
                            </Link>
                        </span>
                    ))}
                </p>
            </Section>

            {/* 09 · Corporate group teaser (deliberately small) */}
            <Section variant="light" spacing="md" labelledBy="home-group">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeader
                            id="home-group"
                            eyebrow={t('group.eyebrow')}
                            title={t('group.title')}
                            intro={t('group.intro')}
                            size="md"
                            className="mb-6 md:mb-6"
                        />
                        <Button href={routes.businesses} variant="text" arrow>
                            {t('group.link')}
                        </Button>
                    </div>
                    <div className="lg:col-span-7 lg:col-start-6 lg:pt-12">
                        <FeatureGrid
                            columns={3}
                            items={[
                                { title: t('group.agri_title'), description: t('group.agri_text') },
                                { title: t('group.livestock_title'), description: t('group.livestock_text') },
                                { title: t('group.invest_title'), description: t('group.invest_text') },
                            ]}
                        />
                    </div>
                </div>
            </Section>

            {/* 10 · Final conversion */}
            <CTABand title={t('cta.title')} intro={t('cta.intro')} ctaLabel={t('cta.label')} />
        </>
    );
}
