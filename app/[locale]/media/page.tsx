import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import MediaPageClient from './MediaPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.media' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'أخبار ازافكو, معرض صور الأسماك, فعاليات ازافكو, المركز الإعلامي'
            : 'AZAFCO news, fish gallery, AZAFCO events, media center, fish company news',
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

export default async function MediaPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <MediaPageClient />;
}
