import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import MediaPageClient from './MediaPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.media' });
    const baseUrl = companyConfig.contact.baseUrl;
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: `${baseUrl}/${locale}/media`,
            languages: {
                'ar': `${baseUrl}/ar/media`,
                'en': `${baseUrl}/en/media`,
                'es': `${baseUrl}/es/media`,
                'ru': `${baseUrl}/ru/media`,
                'de': `${baseUrl}/de/media`,
                'fr': `${baseUrl}/fr/media`,
                'x-default': `${baseUrl}/ar/media`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/media`,
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

export default async function MediaPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <MediaPageClient />;
}
