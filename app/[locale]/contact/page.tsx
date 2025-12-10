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
                'x-default': `${baseUrl}/ar/contact`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/contact`,
            type: 'website',
        },
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactPageClient />;
}
