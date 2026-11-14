import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Button, DocumentIcon, PageHero, Section, SectionHeading, TextLink, WhatsAppIcon, cn, focusRing, typography } from '@/components/ui';
import FAQAccordion from '@/components/v2/FAQAccordion';
import ProcessSteps from '@/components/v2/ProcessSteps';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';
import { products } from '@/data/products';
import { Link } from '@/navigation';
import { insightHref, rfqHref, routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { getRootT, getSpecView } from '@/components/v2/products/catalogue';
import JsonLd from '@/components/v2/rfq/JsonLd';

type Props = { params: Promise<{ locale: string }> };
type Item = { title: string; text: string };
/** A document card; the text line is optional (the company profile needs no descriptor). */
type DocItem = { title: string; text?: string };

/** FAQ order (keys of importers_v2.faq.items). Price and minimum order live in the "Prices and terms" paragraph. */
const FAQ_KEYS = ['who', 'start', 'species', 'grades', 'packing', 'certificates', 'shipping', 'markets', 'eu', 'recurring', 'fraud'] as const;

/** "A, B and C" in the page locale (en-GB style for English: no Oxford comma). */
function joinList(locale: string, items: string[]): string {
    return new Intl.ListFormat(locale === 'en' ? 'en-GB' : locale, { style: 'long', type: 'conjunction' }).format(items);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'importers_v2.meta' });
    return pageMetadata({ locale, path: routes.forImporters, title: t('title'), description: t('description') });
}

export default async function ForImportersPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'importers_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const tp = await getTranslations({ locale, namespace: 'data.products' });
    // Management WhatsApp with the standard prefilled opening (g_header_v2.whatsapp_message)
    const waHref = whatsappLink((await getTranslations({ locale, namespace: 'g_header_v2' }))('whatsapp_message'));

    const steps = t.raw('process.steps') as Item[];
    const documents = t.raw('documents.items') as DocItem[];

    // FAQ facts from the product data (the 12 published species; indicative grades
    // only for the species that have them). Grades come from getSpecView, the same
    // source (data/specs.ts) and formatter (LTR isolates around ranges in Arabic) as
    // the species pages, so the answers never drift from them.
    const root = await getRootT(locale);
    const species = joinList(locale, products.map((p) => tp(`${p.translationKey}.name`)));
    const grades = products
        .map((p) => ({ name: tp(`${p.translationKey}.name`), sizes: getSpecView(root, locale, p.slug).grades }))
        .filter((g) => g.sizes.length > 0)
        .map((g) => `${g.name}: ${joinList(locale, g.sizes)}`)
        .join(locale === 'ar' ? '؛ ' : '; ');
    const values = { species, grades };

    // <req>/<quality> tags: links on the page, plain text in the FAQPage JSON-LD.
    const inlineLink = cn('font-semibold text-navy underline underline-offset-4 hover:text-navy-900', focusRing);
    const richTags = {
        req: (c: ReactNode) => (
            <Link href={rfqHref()} className={inlineLink} data-cta="importers_faq_requirements">
                {c}
            </Link>
        ),
        quality: (c: ReactNode) => (
            <Link href={routes.quality} className={inlineLink} data-cta="importers_faq_quality">
                {c}
            </Link>
        ),
    };
    const plainTags = { req: (c: string) => c, quality: (c: string) => c };
    const faq = FAQ_KEYS.map((k) => ({
        id: `faq-${k}`,
        question: t(`faq.items.${k}.q`),
        answer: t.rich(`faq.items.${k}.a`, { ...values, ...richTags }),
        // JSON-LD text without the bidi isolates/marks used for RTL display
        text: t.markup(`faq.items.${k}.a`, { ...values, ...plainTags }).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, ''),
    }));

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
    };

    return (
        <>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.forImporters }])} />
            <JsonLd data={faqJsonLd} />

            {/* 01 Hero */}
            <PageHero
                image={{ src: '/images/g/hero-fish-ice.webp', alt: t('hero.image_alt'), width: 1920, height: 1080 }}
                imagePosition="70% center"
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: t('breadcrumb') }]} />}
                actions={
                    <>
                        <Button href={rfqHref()} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'importers_hero_requirements' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button
                            href={waHref}
                            variant="outline"
                            size="lg"
                            stretch="phone"
                            icon={<WhatsAppIcon />}
                            newTabLabel={tv('cta.opens_new_tab')}
                            dataAttrs={{ 'data-cta': 'importers_hero_whatsapp' }}
                        >
                            {t('hero.secondary')}
                        </Button>
                    </>
                }
            />

            {/* 02 How to start (the only home of the four steps); what to send lives on /requirements */}
            <Section variant="navy" labelledBy="fi-process">
                <SectionHeading id="fi-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
                <TextLink href={rfqHref()} className="mt-8" dataAttrs={{ 'data-cta': 'importers_process_requirements' }}>
                    {t('process.link')}
                </TextLink>
            </Section>

            {/* 03 Documents the export team provides */}
            <Section variant="offwhite" labelledBy="fi-documents">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeading id="fi-documents" size="md" eyebrow={t('documents.eyebrow')} title={t('documents.title')} intro={t('documents.intro')} />
                    </div>
                    <div className="lg:col-span-7">
                        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0">
                            {documents.map((d) => (
                                <li key={d.title} className="flex gap-4 rounded-card border border-s-4 border-solid border-line border-s-gold bg-white p-5">
                                    <DocumentIcon size={24} className="mt-0.5 shrink-0 text-navy" />
                                    <div>
                                        <h3 className={cn('m-0 text-navy', typography.h4)}>{d.title}</h3>
                                        {d.text ? <p className={cn('m-0 mt-1 text-ink-muted', typography.small)}>{d.text}</p> : null}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon />}>
                                {t('documents.guide_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 04 Prices and terms: one paragraph instead of five "agreed per order" rows */}
            <Section variant="white" labelledBy="fi-terms">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeading id="fi-terms" size="md" eyebrow={t('terms.eyebrow')} title={t('terms.title')} className="mb-0 md:mb-0 lg:mb-0" />
                    </div>
                    <p className={cn('m-0 text-ink lg:col-span-7', typography.lead)}>{t('terms.text')}</p>
                </div>
            </Section>

            {/* 05 FAQ */}
            <Section variant="offwhite" labelledBy="fi-faq" id="faq">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <SectionHeading id="fi-faq" size="md" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                    </div>
                    <div className="lg:col-span-8">
                        <FAQAccordion items={faq.map(({ id, question, answer }) => ({ id, question, answer }))} />
                    </div>
                </div>
            </Section>
        </>
    );
}
