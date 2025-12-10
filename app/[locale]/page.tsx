import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePageClient from './HomePageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.home' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                'ar': `${baseUrl}/ar`,
                'en': `${baseUrl}/en`,
                'es': `${baseUrl}/es`,
                'ru': `${baseUrl}/ru`,
                'de': `${baseUrl}/de`,
                'fr': `${baseUrl}/fr`,
                'x-default': `${baseUrl}/ar`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}`,
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

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <HomePageClient />;
}
