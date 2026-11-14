import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    Button,
    CheckIcon,
    DocumentIcon,
    PageHero,
    Section,
    SectionHeading,
    WhatsAppIcon,
    cn,
    typography,
} from '@/components/ui';
import FAQAccordion from '@/components/v2/FAQAccordion';
import FeatureGrid from '@/components/v2/FeatureGrid';
import ProcessSteps from '@/components/v2/ProcessSteps';
import { marketStepIcons } from '@/components/v2/markets/stepIcons';
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
                        <Button href={`${routes.forImporters}#${RFQ_ANCHOR}`} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'importers_hero_requirements' }}>
                            {t('hero.primary')}
                        </Button>
                        <Button
                            href={companyConfig.contact.social.whatsapp}
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

            {/* 02 Who we work with */}
            <Section variant="offwhite" labelledBy="fi-serve">
                <SectionHeading id="fi-serve" eyebrow={t('serve.eyebrow')} title={t('serve.title')} intro={t('serve.intro')} />
                <FeatureGrid columns={4} style="card" items={serve.map((s) => ({ title: s.title, description: s.text }))} />
            </Section>

            {/* 03 How to start */}
            <Section variant="navy" labelledBy="fi-process">
                <SectionHeading id="fi-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s, i) => ({ title: s.title, description: s.text, icon: marketStepIcons[i] }))} />
            </Section>

            {/* 04 What to prepare + documents the export team provides */}
            <Section variant="offwhite" labelledBy="fi-prepare">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeading id="fi-prepare" size="md" eyebrow={t('prepare.eyebrow')} title={t('prepare.title')} intro={t('prepare.intro')} />
                        <ul className="m-0 grid list-none grid-cols-1 gap-x-6 p-0 sm:grid-cols-2 lg:grid-cols-1">
                            {prepare.map((p) => (
                                <li key={p} className={cn('flex min-h-tap items-center gap-3 border-b border-rule py-2 text-fg', typography.body)}>
                                    <CheckIcon size={20} className="shrink-0 text-navy" />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-7">
                        <SectionHeading id="fi-documents" size="md" eyebrow={t('documents.eyebrow')} title={t('documents.title')} intro={t('documents.intro')} />
                        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0">
                            {documents.map((d) => (
                                <li key={d.title} className="flex gap-4 rounded-card border border-s-4 border-solid border-line border-s-gold bg-white p-5">
                                    <DocumentIcon size={24} className="mt-0.5 shrink-0 text-navy" />
                                    <div>
                                        <h3 className={cn('m-0 text-navy', typography.h4)}>{d.title}</h3>
                                        <p className={cn('m-0 mt-1 text-ink-muted', typography.small)}>{d.text}</p>
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

            {/* 05 Trade details: confirmed per order */}
            <Section variant="white" labelledBy="fi-terms">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeading id="fi-terms" size="md" eyebrow={t('terms.eyebrow')} title={t('terms.title')} intro={t('terms.intro')} />
                    </div>
                    <dl className="m-0 divide-y divide-line-soft rounded-card border border-solid border-line bg-white lg:col-span-7">
                        {terms.map((term) => (
                            <div key={term.title} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-6">
                                <dt className={cn('font-semibold text-navy', typography.body)}>{term.title}</dt>
                                <dd className={cn('m-0 text-ink-muted sm:col-span-2', typography.small)}>{term.text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            {/* 06 Check before you ask */}
            <Section variant="offwhite" labelledBy="fi-proof" spacing="sm">
                <SectionHeading id="fi-proof" size="md" eyebrow={t('proof.eyebrow')} title={t('proof.title')} />
                <FeatureGrid
                    columns={4}
                    style="card"
                    items={proof.map((p, i) => ({ title: p.title, description: p.text, href: proofHrefs[i], linkLabel: p.link }))}
                />
            </Section>

            {/* 07 FAQ */}
            <Section variant="white" labelledBy="fi-faq" id="faq">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <SectionHeading id="fi-faq" size="md" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                    </div>
                    <div className="lg:col-span-8">
                        <FAQAccordion items={faq} />
                    </div>
                </div>
            </Section>

            {/* 08 Send your requirements: prepared email / WhatsApp messages (no web form) */}
            <Section variant="offwhite" labelledBy="fi-rfq" id={RFQ_ANCHOR}>
                <SectionHeading id="fi-rfq" eyebrow={t('rfq.eyebrow')} title={t('rfq.title')} intro={t('rfq.intro')} />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:order-2 lg:col-span-8">
                        <RfqRequestPanel topic="general" idPrefix="fi-rfq" headingAs="h3" />
                    </div>
                    {/* short: the 'what to prepare' list already has its own section (04) */}
                    <RfqAside short headingAs="h3" className="lg:order-1 lg:col-span-4" />
                </div>
            </Section>
        </>
    );
}
