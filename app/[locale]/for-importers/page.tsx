import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Breadcrumbs,
    CheckIcon,
    FAQAccordion,
    FeatureGrid,
    PageHero,
    ProcessSteps,
    Section,
    SectionHeader,
} from '@/components/v2';
import { routes } from '@/lib/v2/routes';
import RfqForm from '@/components/v2/rfq/RfqForm';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { getRfqFormOptions } from '@/components/v2/rfq/options';
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
    const { speciesOptions, countries } = await getRfqFormOptions(locale);

    const serve = t.raw('serve.items') as Item[];
    const steps = t.raw('process.steps') as Item[];
    const prepare = t.raw('prepare.items') as string[];
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

            {/* 01 Buyer-first hero */}
            <PageHero
                variant="split"
                eyebrow={t('hero.eyebrow')}
                title={t('hero.title')}
                intro={t('hero.intro')}
                breadcrumbs={<Breadcrumbs items={[{ label: tv('nav.export') }, { label: t('breadcrumb') }]} />}
                primaryAction={{ label: t('hero.primary'), href: `${routes.forImporters}#${RFQ_ANCHOR}` }}
                secondaryAction={{ label: t('hero.secondary'), href: routes.contact }}
            />

            {/* 02 Who we serve */}
            <Section variant="light" labelledBy="fi-serve">
                <SectionHeader id="fi-serve" eyebrow={t('serve.eyebrow')} title={t('serve.title')} intro={t('serve.intro')} />
                <FeatureGrid columns={4} style="card" items={serve.map((s) => ({ title: s.title, description: s.text }))} />
            </Section>

            {/* 03 How procurement works */}
            <Section variant="navy" labelledBy="fi-process">
                <SectionHeader id="fi-process" eyebrow={t('process.eyebrow')} title={t('process.title')} />
                <ProcessSteps steps={steps.map((s) => ({ title: s.title, description: s.text }))} />
            </Section>

            {/* 04 What to prepare + 05 Trade details */}
            <Section variant="offwhite" labelledBy="fi-prepare">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <SectionHeader id="fi-prepare" size="md" eyebrow={t('prepare.eyebrow')} title={t('prepare.title')} intro={t('prepare.intro')} />
                        <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
                            {prepare.map((p) => (
                                <li key={p} className="flex min-h-[44px] items-center gap-3 border-b border-rule py-2 text-body text-fg">
                                    <CheckIcon size={18} className="shrink-0 text-navy" />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-7">
                        <SectionHeader id="fi-terms" size="md" eyebrow={t('terms.eyebrow')} title={t('terms.title')} intro={t('terms.intro')} />
                        <dl className="divide-y divide-rule rounded-card border border-line bg-white">
                            {terms.map((term) => (
                                <div key={term.title} className="grid grid-cols-1 gap-1 p-5 sm:grid-cols-3 sm:gap-6">
                                    <dt className="font-semibold text-ink">{term.title}</dt>
                                    <dd className="text-body-sm text-ink-muted sm:col-span-2">{term.text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </Section>

            {/* 06 Supporting proof */}
            <Section variant="light" labelledBy="fi-proof" spacing="sm">
                <SectionHeader id="fi-proof" size="md" eyebrow={t('proof.eyebrow')} title={t('proof.title')} />
                <FeatureGrid
                    columns={4}
                    style="card"
                    items={proof.map((p, i) => ({ title: p.title, description: p.text, href: proofHrefs[i], linkLabel: p.link }))}
                />
            </Section>

            {/* 07 Procurement FAQ */}
            <Section variant="offwhite" labelledBy="fi-faq" id="faq" className="scroll-mt-24">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <SectionHeader id="fi-faq" size="md" eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
                    </div>
                    <div className="lg:col-span-8">
                        <FAQAccordion items={faq} />
                    </div>
                </div>
            </Section>

            {/* 08 Embedded RFQ */}
            <Section variant="light" labelledBy="fi-rfq" id={RFQ_ANCHOR} className="scroll-mt-24">
                <SectionHeader id="fi-rfq" eyebrow={t('rfq.eyebrow')} title={t('rfq.title')} intro={t('rfq.intro')} />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="lg:order-2 lg:col-span-8">
                        <RfqForm topic="general" speciesOptions={speciesOptions} countries={countries} idPrefix="fi-rfq" headingAs="h3" />
                    </div>
                    <RfqAside headingAs="h3" className="lg:order-1 lg:col-span-4" />
                </div>
            </Section>
        </>
    );
}
