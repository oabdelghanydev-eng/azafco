import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
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

// Dynamic import for the client page from the existing pages folder
// This is a simplified approach - the full migration would move all content here
import dynamic from 'next/dynamic';

const AboutPageContent = dynamic(() => import('./AboutPageClient'), { ssr: false });

export default function AboutPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <AboutPageContent />;
}
