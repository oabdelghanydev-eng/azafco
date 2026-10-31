import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FaCalendarAlt, FaCheckCircle, FaHandshake, FaShip, FaTruck, FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ogLocaleMap, ogImageMap, locales, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { activeMarkets, activeMarketSlugs, getActiveMarketBySlug } from '@/data/markets';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

const baseUrl = companyConfig.contact.baseUrl;

// Only active markets get a page; any other slug is a 404
export const dynamicParams = false;

export function generateStaticParams() {
    return activeMarketSlugs.map((slug) => ({ slug }));
}

function getMarketConfig(key: string) {
    return companyConfig.markets.find((m) => m.key === key);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const market = getActiveMarketBySlug(slug);
    if (!market) return {};

    const t = await getTranslations({ locale });
    const country = t(`data.markets.${market.translationKey}.country`);
    const title = t('market_detail_page.meta_title', { country });
    const description = t('market_detail_page.meta_description', { country, since: market.since });
    const path = `/markets/${slug}`;

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

export default async function MarketDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const market = getActiveMarketBySlug(slug);
    if (!market) notFound();

    setRequestLocale(locale);
    const t = await getTranslations({ locale });
    const isAr = locale === 'ar';
    const Chevron = isAr ? FaChevronLeft : FaChevronRight;

    const key = market.translationKey;
    const country = t(`data.markets.${key}.country`);
    const config = getMarketConfig(key);
    const volumeTons = config?.volumeTons ?? null;
    const buyers = (t.raw(`data.markets.${key}.features`) ?? []) as string[];
    const otherMarkets = activeMarkets.filter((m) => m.slug !== slug);
    const products = companyConfig.products;

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('schema.markets'), item: `${localeUrl}/markets` },
            { '@type': 'ListItem', position: 3, name: country, item: `${localeUrl}/markets/${slug}` },
        ],
    };

    const facts = [
        { icon: <FaCalendarAlt />, label: t('market_detail_page.since_label'), value: market.since },
        ...(volumeTons !== null
            ? [{ icon: <FaShip />, label: t('market_detail_page.volume_label'), value: t('market_detail_page.volume_value', { tons: volumeTons }) }]
            : []),
        { icon: <FaTruck />, label: t('market_detail_page.shipping_label'), value: t('market_detail_page.shipping_value') },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Layout>
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-14">
                    <div className="container-custom">
                        <nav aria-label={t('market_detail_page.breadcrumb_label')} className="text-sm text-primary-100 mb-8">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link href="/" className="hover:text-white underline-offset-4 hover:underline">{t('schema.home')}</Link></li>
                                <li aria-hidden="true"><Chevron className="text-xs" /></li>
                                <li><Link href="/markets" className="hover:text-white underline-offset-4 hover:underline">{t('schema.markets')}</Link></li>
                                <li aria-hidden="true"><Chevron className="text-xs" /></li>
                                <li aria-current="page" className="text-white font-semibold">{country}</li>
                            </ol>
                        </nav>
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-24 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white">
                                <img
                                    src={market.flag}
                                    alt={`${t('common.flag_of')} ${country}`}
                                    className="w-full h-full object-cover"
                                    width={96}
                                    height={64}
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                                    {t('market_detail_page.h1', { country })}
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl text-primary-50">
                                    {t(`data.markets.${key}.description`)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key facts */}
                <section className="bg-gray-100 py-10">
                    <div className="container-custom">
                        <dl className={`grid grid-cols-1 gap-6 ${facts.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                            {facts.map((fact, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                                    <div className="text-primary-600 text-3xl flex-shrink-0">{fact.icon}</div>
                                    <div>
                                        <dt className="text-sm text-gray-500">{fact.label}</dt>
                                        <dd className="text-xl font-bold text-primary-800">{fact.value}</dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* Who we supply */}
                {buyers.length > 0 && (
                    <section className="py-16">
                        <div className="container-custom">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-6">
                                {t('market_detail_page.buyers_title', { country })}
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {buyers.map((buyer, index) => (
                                    <li key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
                                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{buyer}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Products */}
                <section className="py-16 bg-gray-50">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
                                    {t('market_detail_page.products_title')}
                                </h2>
                                <p className="text-gray-600 max-w-2xl">
                                    {t('market_detail_page.products_subtitle', { count: products.length })}
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-900"
                            >
                                {t('market_detail_page.view_products')}
                                <Chevron className="text-xs" />
                            </Link>
                        </div>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <li key={product.key} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={t(`data.products.${product.key}.name`)}
                                        className="w-full h-32 object-cover"
                                        loading="lazy"
                                    />
                                    <p className="p-3 font-semibold text-gray-800 text-center">
                                        {t(`data.products.${product.key}.name`)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Logistics & documents */}
                <section className="py-16">
                    <div className="container-custom">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row gap-6 md:items-center">
                            <FaFileAlt className="text-4xl text-primary-600 flex-shrink-0" />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-primary-800 mb-2">
                                    {t('market_detail_page.logistics_title')}
                                </h2>
                                <p className="text-gray-600">
                                    {t('market_detail_page.logistics_text', { country })}
                                </p>
                            </div>
                            <Link
                                href="/contact"
                                className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors text-center"
                            >
                                {t('market_detail_page.contact_team')}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Other markets */}
                {otherMarkets.length > 0 && (
                    <section className="pb-16">
                        <div className="container-custom">
                            <h2 className="text-2xl font-bold text-primary-800 mb-6">
                                {t('market_detail_page.other_markets_title')}
                            </h2>
                            <ul className="flex flex-wrap gap-3">
                                {otherMarkets.map((m) => (
                                    <li key={m.slug}>
                                        <Link
                                            href={`/markets/${m.slug}`}
                                            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-primary-500 hover:text-primary-700 transition-colors"
                                        >
                                            <img src={m.flag} alt="" className="w-6 h-4 object-cover rounded-sm" width={24} height={16} loading="lazy" />
                                            {t(`data.markets.${m.translationKey}.country`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="py-16 bg-primary-900 text-white">
                    <div className="container-custom text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            {t('market_detail_page.cta_title', { country })}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('market_detail_page.cta_text')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-secondary-500 text-white px-8 py-4 rounded-full font-bold hover:bg-secondary-600 transition-colors inline-flex items-center justify-center gap-3"
                            >
                                <FaHandshake className="text-xl" />
                                {t('market_detail_page.cta_button')}
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
