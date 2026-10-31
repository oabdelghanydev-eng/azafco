import { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { FaHandshake } from 'react-icons/fa';
import { ogLocaleMap, ogImageMap, locales, Locale } from '@/i18n';
import { companyConfig, getFigureValues } from '@/config/company.config';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';

type Props = {
    params: Promise<{ locale: string }>;
};

const baseUrl = companyConfig.contact.baseUrl;
const path = '/faq';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const title = t('faq_page.meta_title');
    const description = t('faq_page.meta_description');

    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${baseUrl}/${l}${path}`;
    languages['x-default'] = `${baseUrl}${path}`;

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/${locale}${path}`,
            languages,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}${path}`,
            type: 'website',
            siteName: t('metadata.site.name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{
                url: ogImageMap[locale as Locale],
                width: 1200,
                height: 630,
                alt: title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageMap[locale as Locale]],
        },
    };
}

export default async function FaqPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });

    // The FAQ content lives in locales/[locale]/seo/faq.json. Each item is read
    // through t() so {countries}/{years} placeholders are filled exactly as they
    // are shown on screen, and the FAQPage schema below uses the same strings.
    const messages = await getMessages({ locale });
    const count = ((messages.faq as { questions?: unknown[] } | undefined)?.questions ?? []).length;
    const figures = getFigureValues();
    const items = Array.from({ length: count }, (_, i) => ({
        question: t(`faq.questions.${i}.question`, figures),
        answer: t(`faq.questions.${i}.answer`, figures),
    }));

    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = `${localeUrl}${path}`;
    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${pageUrl}#faq`,
            url: pageUrl,
            inLanguage: locale,
            mainEntity: items.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: t('faq_page.breadcrumb'), item: pageUrl },
            ],
        },
    ];

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <Layout>
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('faq_page.h1')}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            {t('faq_page.subtitle')}
                        </p>
                    </div>
                </section>

                {/* Questions & answers - all visible, matching the FAQPage schema */}
                <section className="py-16">
                    <div className="container-custom max-w-4xl">
                        <div className="divide-y divide-gray-200 bg-white rounded-2xl shadow-sm border border-gray-100">
                            {items.map((item, index) => (
                                <article key={index} className="p-6 md:p-8">
                                    <h2 className="text-lg md:text-xl font-bold text-primary-800 mb-3">
                                        {item.question}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-primary-900 text-white">
                    <div className="container-custom text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            {t('faq_page.more_title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('faq_page.more_text')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-secondary-500 text-white px-8 py-4 rounded-full font-bold hover:bg-secondary-600 transition-colors inline-flex items-center justify-center gap-3"
                            >
                                <FaHandshake className="text-xl" />
                                {t('common.contact_us')}
                            </Link>
                            <Link
                                href="/products"
                                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary-900 transition-colors inline-flex items-center justify-center"
                            >
                                {t('common.browse_products')}
                            </Link>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}
