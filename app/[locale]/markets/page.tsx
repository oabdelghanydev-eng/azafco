import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata.markets' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/markets`,
            languages: {
                'ar': `${baseUrl}/ar/markets`,
                'en': `${baseUrl}/en/markets`,
                'x-default': `${baseUrl}/ar/markets`,
            },
        },
    };
}

const MarketsPageClient = dynamic(() => import('./MarketsPageClient'), { ssr: false });

export default function MarketsPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    return <MarketsPageClient />;
}
