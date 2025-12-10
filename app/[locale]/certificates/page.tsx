import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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
        keywords: locale === 'ar'
            ? 'شهادات ازافكو, ISO 22000, HACCP, ISO 9001, شهادات جودة أسماك, معايير سلامة الغذاء'
            : 'AZAFCO certificates, ISO 22000, HACCP, ISO 9001, fish quality certificates, food safety standards',
        alternates: {
            canonical: `${baseUrl}/${locale}/certificates`,
            languages: {
                'ar': `${baseUrl}/ar/certificates`,
                'en': `${baseUrl}/en/certificates`,
                'x-default': `${baseUrl}/ar/certificates`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/certificates`,
            type: 'website',
        },
    };
}

const CertificatesPageClient = dynamic(() => import('./CertificatesPageClient'), { ssr: false });

export default function CertificatesPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <CertificatesPageClient />;
}
