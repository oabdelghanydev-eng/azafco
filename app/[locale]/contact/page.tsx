import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import ContactPageClient from './ContactPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.contact' });
    const baseUrl = companyConfig.contact.baseUrl;
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: `${baseUrl}/${locale}/contact`,
            languages: {
                'ar': `${baseUrl}/ar/contact`,
                'en': `${baseUrl}/en/contact`,
                'es': `${baseUrl}/es/contact`,
                'ru': `${baseUrl}/ru/contact`,
                'de': `${baseUrl}/de/contact`,
                'fr': `${baseUrl}/fr/contact`,
                'x-default': `${baseUrl}/ar/contact`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/contact`,
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

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactPageClient />;
}
