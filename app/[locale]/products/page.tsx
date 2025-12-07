import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import ProductsPageClient from './ProductsPageClient';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
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

export default function ProductsPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    return <ProductsPageClient />;
}
