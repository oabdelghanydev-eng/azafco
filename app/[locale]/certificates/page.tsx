import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata.certificates' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/certificates`,
            languages: {
                'ar': `${baseUrl}/ar/certificates`,
                'en': `${baseUrl}/en/certificates`,
                'x-default': `${baseUrl}/ar/certificates`,
            },
        },
    };
}

const CertificatesPageClient = dynamic(() => import('./CertificatesPageClient'), { ssr: false });

export default function CertificatesPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    return <CertificatesPageClient />;
}
