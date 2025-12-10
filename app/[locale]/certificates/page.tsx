import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import CertificatesPageClient from './CertificatesPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.certificates' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'شهادات ازافكو, ISO 22000, HACCP, ISO 9001, شهادات جودة أسماك, معايير سلامة الغذاء'
            : 'AZAFCO certificates, ISO 22000, HACCP, ISO 9001, fish quality certificates, food safety standards',
        alternates: {
            canonical: `${baseUrl}/${locale}/certificates`,
            languages: {
                'ar': `${baseUrl}/ar/certificates`,
                'en': `${baseUrl}/en/certificates`,
                'es': `${baseUrl}/es/certificates`,
                'ru': `${baseUrl}/ru/certificates`,
                'de': `${baseUrl}/de/certificates`,
                'fr': `${baseUrl}/fr/certificates`,
                'x-default': `${baseUrl}/ar/certificates`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/certificates`,
            type: 'website',
            siteName: 'AZAFCO - ازافكو العالمية',
            locale: locale === 'ar' ? 'ar_EG' : 'en_US',
            images: [{
                url: `/images/og-image-${locale === 'ar' ? 'ar' : 'en'}.jpg`,
                width: 1200,
                height: 630,
                alt: t('title'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: [`/images/og-image-${locale === 'ar' ? 'ar' : 'en'}.jpg`],
        },
    };
}

export default async function CertificatesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <CertificatesPageClient />;
}
