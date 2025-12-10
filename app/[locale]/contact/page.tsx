import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactPageClient from './ContactPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.contact' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'اتصل بازافكو, تواصل معنا, طلب شراكة أسماك, رقم ازافكو, عنوان مصنع أسماك'
            : 'contact AZAFCO, get in touch, fish partnership request, AZAFCO phone, fish factory address',
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

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactPageClient />;
}
