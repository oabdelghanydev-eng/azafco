import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AboutPageClient from './AboutPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.about' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        keywords: locale === 'ar'
            ? 'عن ازافكو, شركة تصدير أسماك مصرية, تاريخ ازافكو, خبرة تصدير الأسماك, شركة أسماك كفر الشيخ'
            : 'about AZAFCO, Egyptian fish export company, AZAFCO history, fish export experience, Kafr El Sheikh fish company',
        alternates: {
            canonical: `${baseUrl}/${locale}/about`,
            languages: {
                'ar': `${baseUrl}/ar/about`,
                'en': `${baseUrl}/en/about`,
                'x-default': `${baseUrl}/ar/about`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/about`,
            type: 'website',
        },
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <AboutPageClient />;
}
