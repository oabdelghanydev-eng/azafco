import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ProductsPageClient from './ProductsPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.products' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'أسماك طازجة, بلطي, قاروص, بوري, أسماك مصرية, تصدير أسماك'
            : 'fresh fish Egypt, tilapia supplier, sea bass wholesale, mullet export, Egyptian fish, B2B seafood',
        alternates: {
            canonical: `${baseUrl}/${locale}/products`,
            languages: {
                'ar': `${baseUrl}/ar/products`,
                'en': `${baseUrl}/en/products`,
                'es': `${baseUrl}/es/products`,
                'ru': `${baseUrl}/ru/products`,
                'de': `${baseUrl}/de/products`,
                'fr': `${baseUrl}/fr/products`,
                'x-default': `${baseUrl}/ar/products`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/products`,
        },
    };
}

export default async function ProductsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ProductsPageClient />;
}
