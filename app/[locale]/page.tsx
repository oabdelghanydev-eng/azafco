import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePageClient from './HomePageClient';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
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
                'x-default': `${baseUrl}/ar`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}`,
        },
    };
}

export default function HomePage({ params: { locale } }: Props) {
    // Enable static rendering
    setRequestLocale(locale);

    return <HomePageClient />;
}
