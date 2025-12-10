import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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
        keywords: locale === 'ar'
            ? 'أخبار ازافكو, معرض صور الأسماك, فعاليات ازافكو, المركز الإعلامي'
            : 'AZAFCO news, fish gallery, AZAFCO events, media center, fish company news',
        alternates: {
            canonical: `${baseUrl}/${locale}/media`,
            languages: {
                'ar': `${baseUrl}/ar/media`,
                'en': `${baseUrl}/en/media`,
                'x-default': `${baseUrl}/ar/media`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/media`,
            type: 'website',
        },
    };
}

const MediaPageClient = dynamic(() => import('./MediaPageClient'), { ssr: false });

export default function MediaPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <MediaPageClient />;
}
