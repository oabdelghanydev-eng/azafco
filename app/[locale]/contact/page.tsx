import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
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

const ContactPageClient = dynamic(() => import('./ContactPageClient'), { ssr: false });

export default function ContactPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <ContactPageClient />;
}
