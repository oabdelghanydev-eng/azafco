import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    CheckIcon,
    DocumentIcon,
    FAQAccordion,
    FeatureGrid,
    PageHero,
    ProcessSteps,
    Section,
    SectionHeader,
} from '@/components/v2';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';
import { GPageScope } from '@/components/v2/markets/GBits';
import { insightHref, routes } from '@/lib/v2/routes';
import { companyConfig } from '@/config/company.config';
import RfqRequestPanel from '@/components/v2/rfq/RfqRequestPanel';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { breadcrumbJsonLd, pageMetadata } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';

type Props = { params: Promise<{ locale: string }> };
type Item = { title: string; text: string; link?: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'importers_v2.meta' });
    return pageMetadata({ locale, path: routes.forImporters, title: t('title'), description: t('description') });
}

const RFQ_ANCHOR = 'request';

export default async function ForImportersPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'importers_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });

    const serve = t.raw('serve.items') as Item[];
    const steps = t.raw('process.steps') as Item[];
    const prepare = t.raw('prepare.items') as string[];
    const documents = t.raw('documents.items') as Item[];
    const terms = t.raw('terms.items') as Item[];
    const proof = t.raw('proof.items') as Item[];
    const proofHrefs = [routes.products, routes.processing, routes.quality, routes.markets];
    const faq = (t.raw('faq.items') as { q: string; a: string }[]).map((f, i) => ({ id: `faq-${i + 1}`, question: f.q, answer: f.a }));

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    };

    return (
        <GPageScope>
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
                primaryAction={{ label: t('hero.primary'), href: `${routes.forImporters}#${RFQ_ANCHOR}` }}
                secondaryAction={{ label: t('hero.secondary'), href: companyConfig.contact.social.whatsapp, external: true }}
            />

            {/* 02 Who we work with */}
            <Section variant="offwhite" labelledBy="fi-serve">
                <SectionHeader id="fi-serve" eyebrow={t('serve.eyebrow')} title={t('serve.title')} intro={t('serve.intro')} />
                <FeatureGrid columns={4} style="card" items={serve.map((s) => ({ title: s.title, description: s.text }))} />
            </Section>

            {/* 03 How to start */}
            <Section variant="navy" labelledBy="fi-process">
                <SectionHeader id="fi-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {/* 04 What to prepare + documents the export team provides */}
            <Section variant="offwhite" labelledBy="fi-prepare">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeader id="fi-prepare" size="md" eyebrow={t('prepare.eyebrow')} title={t('prepare.title')} intro={t('prepare.intro')} />
                        <ul className="m-0 grid list-none grid-cols-1 gap-x-6 p-0 sm:grid-cols-2 lg:grid-cols-1">
                            {prepare.map((p) => (
                                <li key={p} className="flex min-h-[44px] items-center gap-3 border-b border-rule py-2 text-body text-fg">
                                    <CheckIcon size={18} className="shrink-0 text-navy" />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-7">
                        <SectionHeader id="fi-documents" size="md" eyebrow={t('documents.eyebrow')} title={t('documents.title')} intro={t('documents.intro')} />
                        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0">
                            {documents.map((d) => (
                                <li key={d.title} className="flex gap-4 rounded border border-s-4 border-[#d5dde9] border-s-[#f7b500] bg-white p-5">
                                    <DocumentIcon size={22} className="mt-0.5 shrink-0 text-[#002d72]" />
                                    <div>
                                        <h3 className="m-0 font-display text-heading-sm text-[#002d72]">{d.title}</h3>
                                        <p className="m-0 mt-1 text-body-sm text-[#4a5a75]">{d.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5">
                            <Button href={insightHref('importing-fresh-fish-from-egypt')} variant="text" icon={<DocumentIcon size={18} />}>
                                {t('documents.guide_link')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 05 Trade details: confirmed per order */}
            <Section variant="light" labelledBy="fi-terms">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeader id="fi-terms" size="md" eyebrow={t('terms.eyebrow')} title={t('terms.title')} intro={t('terms.intro')} />
                    </div>
                    <dl className="m-0 divide-y divide-rule rounded border border-line bg-white lg:col-span-7">
                        {terms.map((term) => (
                            <div key={term.title} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="font-semibold text-[#002d72]">{term.title}</dt>
                                <dd className="m-0 text-body-sm text-[#4a5a75] sm:col-span-2">{term.text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            {/* 06 Check before you ask */}
            <Section variant="offwhite" labelledBy="fi-proof" spacing="sm">
                <SectionHeader id="fi-proof" size="md" eyebrow={t('proof.eyebrow')} title={t('proof.title')} />
                <FeatureGrid
                    columns={4}
                    style="card"
                    items={proof.map((p, i) => ({ title: p.title, description: p.text, href: proofHrefs[i], linkLabel: p.link }))}
                />
            </Section>

            {/* 07 FAQ */}
            <Section variant="light" labelledBy="fi-faq" id="faq" className="scroll-mt-24">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <SectionHeader id="fi-faq" size="md" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                    </div>
                    <div className="lg:col-span-8">
                        <FAQAccordion items={faq} />
                    </div>
                </div>
            </Section>

            {/* 08 Send your requirements: prepared email / WhatsApp messages (no web form) */}
            <Section variant="offwhite" labelledBy="fi-rfq" id={RFQ_ANCHOR} className="scroll-mt-24">
                <SectionHeader id="fi-rfq" eyebrow={t('rfq.eyebrow')} title={t('rfq.title')} intro={t('rfq.intro')} />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:order-2 lg:col-span-8">
                        <RfqRequestPanel topic="general" idPrefix="fi-rfq" headingAs="h3" />
                    </div>
                    {/* short: the 'what to prepare' list already has its own section (04) */}
                    <RfqAside short headingAs="h3" className="lg:order-1 lg:col-span-4" />
                </div>
            </Section>
        </GPageScope>
    );
}
