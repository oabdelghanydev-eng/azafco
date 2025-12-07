import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata.media' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/media`,
            languages: {
                'ar': `${baseUrl}/ar/media`,
                'en': `${baseUrl}/en/media`,
                'x-default': `${baseUrl}/ar/media`,
            },
        },
    };
}

const MediaPageClient = dynamic(() => import('./MediaPageClient'), { ssr: false });

export default function MediaPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    return <MediaPageClient />;
}
