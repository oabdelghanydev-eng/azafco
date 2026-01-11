import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import ProductsPageClient from './ProductsPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.products' });
    const baseUrl = companyConfig.contact.baseUrl;
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: `${baseUrl}/${locale}/products`,
            languages: {
                'ar': `${baseUrl}/ar/products`,
                'en': `${baseUrl}/en/products`,
                'es': `${baseUrl}/es/products`,
                'ru': `${baseUrl}/ru/products`,
                'de': `${baseUrl}/de/products`,
                'fr': `${baseUrl}/fr/products`,
                'x-default': `${baseUrl}/ar/products`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/products`,
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

export default async function ProductsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ProductsPageClient />;
}
