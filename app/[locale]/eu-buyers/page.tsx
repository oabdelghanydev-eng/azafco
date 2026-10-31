import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import EUBuyersPageClient from './EUBuyersPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

const PATH = 'eu-buyers';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'eu_buyers_page.meta' });
    const baseUrl = companyConfig.contact.baseUrl;
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/${PATH}`,
            languages: {
                'ar': `${baseUrl}/ar/${PATH}`,
                'en': `${baseUrl}/en/${PATH}`,
                'es': `${baseUrl}/es/${PATH}`,
                'ru': `${baseUrl}/ru/${PATH}`,
                'de': `${baseUrl}/de/${PATH}`,
                'fr': `${baseUrl}/fr/${PATH}`,
                'x-default': `${baseUrl}/${PATH}`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/${PATH}`,
            type: 'website',
            siteName: siteT('name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{
                url: ogImageMap[locale as Locale],
                width: 1200,
                height: 630,
                alt: t('title'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: [ogImageMap[locale as Locale]],
        },
    };
}

export default async function EUBuyersPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });
    const baseUrl = companyConfig.contact.baseUrl;
    const localeUrl = `${baseUrl}/${locale}`;

    // Server-rendered BreadcrumbList, same approach as components/StructuredData.tsx
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
            { '@type': 'ListItem', position: 2, name: t('eu_buyers_page.breadcrumb'), item: `${localeUrl}/${PATH}` },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
            />
            <EUBuyersPageClient />
        </>
    );
}
