import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs, Button, PageHero, Section, SectionHeading, WhatsAppIcon } from '@/components/ui';
import FAQAccordion from '@/components/v2/FAQAccordion';
import { products } from '@/data/products';
import { rfqHref, routes } from '@/lib/v2/routes';
import { whatsappLink } from '@/lib/v2/whatsapp';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { getRootT, getSpecView } from '@/components/v2/products/catalogue';
import JsonLd from '@/components/v2/rfq/JsonLd';

type Props = { params: Promise<{ locale: string }> };

/**
 * FAQ order (keys of importers_v2.faq.items). DEAI-SPEC (25 Nov 2026): the page is the
 * hero (capacity and truck sentence) plus five questions that each carry a fact; the
 * four steps, document cards and prices paragraph were cut (the footer has "Prices
 * confirmed per order").
 */
const FAQ_KEYS = ['species', 'grades', 'packing', 'markets', 'fraud'] as const;

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

    const faq = FAQ_KEYS.map((k) => ({
        id: `faq-${k}`,
        question: t(`faq.items.${k}.q`),
        answer: t(`faq.items.${k}.a`, values),
        // JSON-LD text without the bidi isolates/marks used for RTL display
        text: t(`faq.items.${k}.a`, values).replace(/[‎‏‪-‮⁦-⁩]/g, ''),
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

            {/* 02 FAQ */}
            <Section variant="offwhite" labelledBy="fi-faq" id="faq">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <SectionHeading id="fi-faq" size="md" title={t('faq.title')} />
                    </div>
                    <div className="lg:col-span-8">
                        <FAQAccordion items={faq.map(({ id, question, answer }) => ({ id, question, answer }))} />
                    </div>
                </div>
            </Section>
        </>
    );
}
