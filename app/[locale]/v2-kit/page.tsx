import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { products } from '@/data/products';
import { mediaImage, productMediaId } from '@/lib/v2/media';
import { productHref, rfqHref, routes } from '@/lib/v2/routes';
import {
    Breadcrumbs,
    Button,
    CTABand,
    CertificateCard,
    FAQAccordion,
    FeatureGrid,
    GeoArcs,
    InsightCard,
    MarketCard,
    MediaGallery,
    PageHero,
    Pending,
    ProcessSteps,
    ProductCard,
    ProofStrip,
    Section,
    SectionHeader,
    SpecTable,
    StatPanel,
    DocumentIcon,
    GlobeIcon,
    CheckIcon,
} from '@/components/v2';

/**
 * Internal component-kit preview (noindex, not in sitemap or nav).
 * Open /en/v2-kit and /ar/v2-kit to review LTR and RTL.
 * Sample copy below is demo-only placeholder text (not customer-facing, not
 * translated into es/ru/de/fr). It contains no business facts: unapproved items
 * are shown through <Pending>.
 */
export const metadata: Metadata = {
    title: 'v2 component kit (internal)',
    robots: { index: false, follow: false, nocache: true },
};

type Props = { params: Promise<{ locale: string }> };

const copy = {
    en: {
        eyebrow: 'Component kit',
        heroTitle: 'From Egyptian Production to Global Partnerships.',
        heroIntro: 'Demo hero (full-bleed). Real photo, navy scrim, one headline, gold action.',
        splitTitle: 'Clear Specifications. Stronger Partnerships.',
        splitIntro: 'Demo hero (split editorial). Headline on the start side, facility photo on the end side.',
        buttons: 'Buttons',
        surfaces: 'Sections and surfaces',
        offwhite: 'Off-white section',
        navy: 'Navy section',
        proof: 'Proof strip',
        steps: 'Process steps',
        stepTitles: ['Requirement', 'Specification', 'Processing & packing', 'Dispatch'],
        stepText: 'Demo step description.',
        features: 'Feature grid',
        featureTitles: ['Specifications on request', 'Packing options', 'Export documents'],
        products: 'Product cards',
        spec: 'Specification table',
        specCaption: 'Tilapia: specifications (demo)',
        certs: 'Certificate card',
        markets: 'Market cards',
        insights: 'Insight cards',
        faq: 'FAQ accordion',
        q1: 'How do I request a quote?',
        a1: 'Use the Request a Quote form with species, size, packing, volume and destination.',
        q2: 'Can I ask for product specifications first?',
        a2: 'Yes. Ask the export team for the specification sheet of the species you need.',
        stats: 'Stat panel',
        gallery: 'Media gallery',
        pending: 'Pending facts',
        decoration: 'Geometric decoration',
        loading: 'Sending…',
        insightTitle: 'Importing fresh fish from Egypt: a buyer guide',
        insightExcerpt: 'Documents, cold chain and codes buyers ask about.',
        guides: 'Guides',
    },
    ar: {
        eyebrow: 'مكتبة المكونات',
        heroTitle: 'من الإنتاج في مصر إلى شراكات في العالم.',
        heroIntro: 'واجهة تجريبية بصورة كاملة العرض: صورة حقيقية وطبقة كحلية وعنوان واحد وزر ذهبي.',
        splitTitle: 'مواصفات واضحة. شراكات أقوى.',
        splitIntro: 'واجهة تجريبية مقسومة: العنوان في جهة البداية وصورة المنشأة في الجهة الأخرى.',
        buttons: 'الأزرار',
        surfaces: 'الأقسام والخلفيات',
        offwhite: 'قسم بخلفية فاتحة',
        navy: 'قسم كحلي',
        proof: 'شريط الإثبات',
        steps: 'خطوات العمل',
        stepTitles: ['المتطلبات', 'المواصفات', 'التجهيز والتعبئة', 'الشحن'],
        stepText: 'وصف تجريبي للخطوة.',
        features: 'شبكة المزايا',
        featureTitles: ['المواصفات عند الطلب', 'خيارات التعبئة', 'مستندات التصدير'],
        products: 'بطاقات المنتجات',
        spec: 'جدول المواصفات',
        specCaption: 'البلطي: المواصفات (تجريبي)',
        certs: 'بطاقة الشهادة',
        markets: 'بطاقات الأسواق',
        insights: 'بطاقات المقالات',
        faq: 'الأسئلة الشائعة',
        q1: 'كيف أطلب عرض سعر؟',
        a1: 'استخدم نموذج طلب عرض السعر وحدّد النوع والمقاس والتعبئة والكمية ووجهة الشحن.',
        q2: 'هل يمكنني طلب مواصفات المنتج أولًا؟',
        a2: 'نعم، اطلب من فريق التصدير ورقة مواصفات النوع الذي تحتاجه.',
        stats: 'لوحة الأرقام',
        gallery: 'معرض الصور',
        pending: 'بيانات بانتظار التأكيد',
        decoration: 'الزخرفة الهندسية',
        loading: 'جارٍ الإرسال…',
        insightTitle: 'استيراد الأسماك الطازجة من مصر: دليل المشتري',
        insightExcerpt: 'المستندات وسلسلة التبريد والأكواد التي يسأل عنها المشترون.',
        guides: 'أدلة',
    },
};

export default async function V2KitPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const c = locale === 'ar' ? copy.ar : copy.en;
    const t = await getTranslations({ locale });
    const img = (id: string) => mediaImage(id, locale);

    const cardProducts = products.slice(0, 4);
    const markets = companyConfig.markets.filter((m) => m.key === 'kuwait' || m.status !== 'active').slice(0, 4);

    return (
        <>
            <PageHero
                eyebrow={c.eyebrow}
                title={c.heroTitle}
                intro={c.heroIntro}
                image={img('dispatch-truck-loading-bays-wide')}
                imagePosition="center 40%"
                size="2xl"
                headingId="kit-hero"
                primaryAction={{ label: t('v2.cta.request_quote'), href: rfqHref() }}
                secondaryAction={{ label: t('v2.cta.talk_to_export_team'), href: routes.contact }}
                breadcrumbs={<Breadcrumbs items={[{ label: c.eyebrow }]} />}
            />

            <PageHero
                variant="split"
                eyebrow={t('v2.nav.processing')}
                title={c.splitTitle}
                intro={c.splitIntro}
                image={img('processing-hall-team')}
                priority={false}
                primaryAction={{ label: t('v2.cta.request_quote'), href: rfqHref({ type: 'specifications' }) }}
                secondaryAction={{ label: t('v2.cta.view_specifications'), href: routes.products }}
                breadcrumbs={<Breadcrumbs items={[{ label: t('v2.nav.seafood'), href: routes.seafood }, { label: t('v2.nav.processing') }]} />}
                proof={
                    <ProofStrip
                        compact
                        items={[
                            { title: t('data.company.addresses.factory.title'), detail: companyConfig.geo.placename },
                            { title: t('v2.cta.view_specifications'), detail: t('v2.spec.confirmed_with_sales') },
                            { title: '—', pending: 'Monthly processing capacity (definition + figure)' },
                        ]}
                    />
                }
            />

            <Section variant="light" labelledBy="kit-buttons">
                <SectionHeader id="kit-buttons" eyebrow="Button" title={c.buttons} size="md" />
                <div className="flex flex-wrap items-center gap-3">
                    <Button href={rfqHref()}>{t('v2.cta.request_quote')}</Button>
                    <Button href={routes.products} variant="secondary">
                        {t('v2.cta.view_specifications')}
                    </Button>
                    <Button href={routes.contact} variant="outline">
                        {t('v2.nav.contact')}
                    </Button>
                    <Button href={routes.about} variant="ghost">
                        {t('v2.cta.learn_more')}
                    </Button>
                    <Button href={routes.insights} variant="text">
                        {t('v2.cta.read_more')}
                    </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button size="sm">sm</Button>
                    <Button size="md">md</Button>
                    <Button size="lg" arrow>
                        lg + arrow
                    </Button>
                    <Button loading loadingLabel={c.loading}>
                        {t('v2.cta.request_quote')}
                    </Button>
                    <Button disabled variant="secondary">
                        disabled
                    </Button>
                    <Button href={`tel:${companyConfig.contact.phone}`} variant="outline" icon={<GlobeIcon size={18} />}>
                        icon
                    </Button>
                </div>
            </Section>

            <Section variant="offwhite" labelledBy="kit-proof">
                <SectionHeader id="kit-proof" eyebrow="ProofStrip" title={c.proof} size="md" />
                <ProofStrip
                    items={[
                        { title: t('data.company.addresses.factory.title'), detail: companyConfig.geo.placename, icon: <GlobeIcon /> },
                        { title: t('v2.nav.processing'), detail: t('v2.footer.tagline'), icon: <CheckIcon /> },
                        { title: t('v2.cta.view_specifications'), detail: t('v2.spec.confirmed_with_sales'), icon: <DocumentIcon /> },
                        { title: '—', pending: 'Active export market count' },
                    ]}
                />
            </Section>

            <Section variant="navy" labelledBy="kit-surface">
                <SectionHeader
                    id="kit-surface"
                    eyebrow={c.navy}
                    title={c.surfaces}
                    intro={c.heroIntro}
                    size="md"
                    action={
                        <Button href={routes.seafood} variant="text">
                            {t('v2.cta.view_all')}
                        </Button>
                    }
                />
                <div className="flex flex-wrap gap-3">
                    <Button href={rfqHref()}>{t('v2.cta.request_quote')}</Button>
                    <Button href={routes.products} variant="secondary">
                        {t('v2.cta.view_specifications')}
                    </Button>
                    <Button href={routes.contact} variant="outline">
                        {t('v2.nav.contact')}
                    </Button>
                    <Button href={routes.about} variant="ghost">
                        {t('v2.cta.learn_more')}
                    </Button>
                </div>
                <div className="mt-12">
                    <ProcessSteps
                        steps={c.stepTitles.map((title) => ({ title, description: c.stepText }))}
                    />
                </div>
            </Section>

            <Section variant="light" labelledBy="kit-steps">
                <SectionHeader id="kit-steps" eyebrow="ProcessSteps" title={c.steps} size="md" />
                <div className="grid gap-12 lg:grid-cols-2">
                    <ProcessSteps steps={c.stepTitles.slice(0, 3).map((title) => ({ title, description: c.stepText }))} />
                    <ProcessSteps
                        orientation="vertical"
                        steps={c.stepTitles.map((title, i) => ({
                            title,
                            description: c.stepText,
                            extra: i === 3 ? <Pending label="Typical transit time by market" /> : undefined,
                        }))}
                    />
                </div>
            </Section>

            <Section variant="offwhite" labelledBy="kit-features">
                <SectionHeader id="kit-features" eyebrow="FeatureGrid" title={c.features} size="md" />
                <FeatureGrid
                    items={c.featureTitles.map((title, i) => ({
                        title,
                        description: c.stepText,
                        icon: [<DocumentIcon key="d" size={28} />, <CheckIcon key="c" size={28} />, <GlobeIcon key="g" size={28} />][i],
                    }))}
                />
                <FeatureGrid
                    className="mt-10"
                    style="card"
                    columns={3}
                    items={[
                        { title: t('v2.nav.processing'), description: c.stepText, href: routes.processing, linkLabel: t('v2.cta.learn_more') },
                        { title: t('v2.nav.quality'), description: c.stepText, href: routes.quality, linkLabel: t('v2.cta.learn_more') },
                        { title: t('v2.nav.for_importers'), description: c.stepText, href: routes.forImporters, linkLabel: t('v2.cta.learn_more') },
                    ]}
                />
            </Section>

            <Section variant="light" labelledBy="kit-products">
                <SectionHeader id="kit-products" eyebrow="ProductCard" title={c.products} size="md" />
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cardProducts.map((p) => {
                        const mid = productMediaId(p.slug);
                        return (
                            <li key={p.slug}>
                                <ProductCard
                                    name={t(`data.products.${p.translationKey}.name`)}
                                    scientificName={p.scientificName}
                                    href={productHref(p.slug)}
                                    image={mid ? img(mid) : undefined}
                                    tag={t(`data.products.${p.translationKey}.category`)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </Section>

            <Section variant="offwhite" labelledBy="kit-spec">
                <SectionHeader id="kit-spec" eyebrow="SpecTable" title={c.spec} size="md" />
                <div className="max-w-3xl">
                    <SpecTable
                        caption={c.specCaption}
                        rows={[
                            { label: 'Scientific name', value: <i lang="la">Oreochromis niloticus</i> },
                            { label: t('data.products.tilapia.category'), value: t('data.products.tilapia.packaging') },
                            { label: 'Size grades', value: null },
                            { label: 'MOQ', value: null },
                            { label: 'Lead time', value: undefined },
                        ]}
                    />
                </div>
            </Section>

            <Section variant="light" labelledBy="kit-proofcards">
                <SectionHeader id="kit-proofcards" eyebrow="CertificateCard · MarketCard" title={`${c.certs} · ${c.markets}`} size="md" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Unverified → only a Pending chip (nothing in production) */}
                    <CertificateCard name="ISO 22000:2018" verified={false} />
                </div>
                <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {markets.map((m) => (
                        <li key={m.key}>
                            <MarketCard
                                name={t(`data.markets.${m.key}.country`)}
                                status={m.status}
                                countryCode={m.countryCode}
                                href={`${routes.markets}/${m.key}`}
                            />
                        </li>
                    ))}
                </ul>
            </Section>

            <Section variant="offwhite" labelledBy="kit-insights">
                <SectionHeader id="kit-insights" eyebrow="InsightCard" title={c.insights} size="md" />
                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <li>
                        <InsightCard
                            title={c.insightTitle}
                            excerpt={c.insightExcerpt}
                            href="/guides/importing-fresh-fish-from-egypt"
                            category={c.guides}
                            date="2026-10-31"
                            readingMinutes={8}
                            image={img('dispatch-truck-loading-bays-group')}
                        />
                    </li>
                    <li>
                        <InsightCard title={c.splitTitle} excerpt={c.stepText} href={routes.insights} category={c.guides} image={img('processing-hall-team-crates')} />
                    </li>
                    <li>
                        <InsightCard title={c.heroTitle} excerpt={c.stepText} href={routes.insights} />
                    </li>
                </ul>
            </Section>

            <Section variant="light" labelledBy="kit-faq">
                <SectionHeader id="kit-faq" eyebrow="FAQAccordion" title={c.faq} size="md" />
                <div className="max-w-3xl">
                    <FAQAccordion
                        exclusiveName="kit-faq"
                        defaultOpen={0}
                        items={[
                            { question: c.q1, answer: <p>{c.a1}</p> },
                            { question: c.q2, answer: <p>{c.a2}</p> },
                        ]}
                    />
                </div>
            </Section>

            <Section variant="navy" labelledBy="kit-stats">
                <SectionHeader id="kit-stats" eyebrow="StatPanel" title={c.stats} size="md" />
                <StatPanel
                    stats={[
                        { value: companyConfig.identity.foundingYear, label: 'Founded', verified: false, pendingLabel: 'Founding year 2008 vs S.A.E. registration 2017' },
                        { value: '—', label: 'Monthly capacity (t)', verified: false },
                        { value: '—', label: 'Employees', verified: false },
                    ]}
                />
                <p className="mt-4 text-caption text-fg-muted">All three figures above are unverified, so production shows nothing here.</p>
            </Section>

            <Section variant="light" labelledBy="kit-gallery">
                <SectionHeader id="kit-gallery" eyebrow="MediaGallery" title={c.gallery} size="md" />
                <MediaGallery
                    items={[
                        { id: 'facility-exterior-night' },
                        { id: 'processing-hall-team' },
                        { id: 'processing-area-visit-hygiene' },
                        { id: 'meeting-room-visit' },
                        { id: 'product-sea-bass-whole' },
                        { id: 'product-mullet-whole' },
                    ]}
                />
            </Section>

            <Section variant="offwhite" labelledBy="kit-pending">
                <SectionHeader id="kit-pending" eyebrow="Pending · GeoArcs" title={`${c.pending} · ${c.decoration}`} size="md" />
                <div className="flex flex-wrap gap-3">
                    <Pending label="MOQ per species" />
                    <Pending label="EU approval number + scope" />
                </div>
                <Pending block className="mt-4" label="Leadership names, titles and photos (with consent)" />
                <div className="relative mt-10 h-72 overflow-hidden rounded-card bg-white">
                    <GeoArcs className="absolute -end-10 -top-16 w-[420px]" />
                </div>
                <div data-surface="dark" className="relative mt-6 h-72 overflow-hidden rounded-card bg-navy-900">
                    <GeoArcs tone="onDark" className="absolute -end-10 -top-16 w-[420px]" />
                </div>
            </Section>

            <CTABand prefill={{ product: 'tilapia', type: 'product' }} />

            <Section spacing="sm">
                <p className="text-caption text-ink-subtle">
                    Internal preview. Compare <a className="underline" href="/en/v2-kit">/en/v2-kit</a> and{' '}
                    <a className="underline" href="/ar/v2-kit">/ar/v2-kit</a>.
                </p>
            </Section>
        </>
    );
}
