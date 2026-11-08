import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FaArrowRight, FaBookOpen } from 'react-icons/fa';
import { dateLocaleMap, ogLocaleMap, ogImageMap, locales, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { Link } from '@/navigation';
import Layout from '@/components/Layout';
import { guides } from '@/data/guides';

type Props = {
    params: Promise<{ locale: string }>;
};

const baseUrl = companyConfig.contact.baseUrl;
const path = '/guides';

const formatDate = (locale: string, iso: string) =>
    new Intl.DateTimeFormat(dateLocaleMap[locale as Locale] ?? 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const title = t('guides_page.index.meta_title');
    const description = t('guides_page.index.meta_description');

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

export default async function GuidesIndexPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });

    const localeUrl = `${baseUrl}/${locale}`;
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('guides_page.index.breadcrumb'), item: `${localeUrl}${path}` },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
            />
            <Layout>
                <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('guides_page.index.h1')}</h1>
                        <p className="text-xl max-w-3xl mx-auto">{t('guides_page.index.subtitle')}</p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container-custom max-w-4xl">
                        <ul className="grid gap-6">
                            {guides.map((guide) => {
                                const ns = `guides_page.${guide.translationKey}`;
                                return (
                                    <li key={guide.slug}>
                                        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                            <h2 className="text-xl md:text-2xl font-bold text-primary-800 mb-3 flex items-start gap-3">
                                                <FaBookOpen className="text-secondary-500 mt-1 shrink-0" aria-hidden="true" />
                                                <Link href={`/guides/${guide.slug}`} className="hover:underline">
                                                    {t(`${ns}.h1`)}
                                                </Link>
                                            </h2>
                                            <p className="text-gray-700 leading-relaxed mb-4">{t(`${ns}.card_summary`)}</p>
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <time dateTime={guide.lastReviewed} className="text-sm text-gray-500">
                                                    {t('guides_page.index.last_reviewed', { date: formatDate(locale, guide.lastReviewed) })}
                                                </time>
                                                <Link
                                                    href={`/guides/${guide.slug}`}
                                                    className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:underline"
                                                >
                                                    {t('guides_page.index.read_guide')}
                                                    <FaArrowRight className="rtl:rotate-180" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>
            </Layout>
        </>
    );
}
