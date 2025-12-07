import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
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
        alternates: {
            canonical: `${baseUrl}/${locale}/contact`,
            languages: {
                'ar': `${baseUrl}/ar/contact`,
                'en': `${baseUrl}/en/contact`,
                'x-default': `${baseUrl}/ar/contact`,
            },
        },
    };
}

const ContactPageClient = dynamic(() => import('./ContactPageClient'), { ssr: false });

export default function ContactPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    return <ContactPageClient />;
}
