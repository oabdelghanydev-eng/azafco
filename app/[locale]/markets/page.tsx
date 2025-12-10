import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import MarketsPageClient from './MarketsPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.markets' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'أسواق التصدير, تصدير أسماك الخليج, تصدير أسماك السعودية, تصدير أسماك الإمارات, أسواق ازافكو'
            : 'export markets, Gulf fish export, Saudi Arabia fish, UAE fish export, AZAFCO markets, Qatar Kuwait Bahrain',
        alternates: {
            canonical: `${baseUrl}/${locale}/markets`,
            languages: {
                'ar': `${baseUrl}/ar/markets`,
                'en': `${baseUrl}/en/markets`,
                'x-default': `${baseUrl}/ar/markets`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/markets`,
            type: 'website',
        },
    };
}

export default async function MarketsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <MarketsPageClient />;
}
