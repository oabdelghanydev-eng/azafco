import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
    const baseUrl = 'https://azafco.com.eg';

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/privacy-policy`,
            languages: {
                'ar': `${baseUrl}/ar/privacy-policy`,
                'en': `${baseUrl}/en/privacy-policy`,
                'es': `${baseUrl}/es/privacy-policy`,
                'ru': `${baseUrl}/ru/privacy-policy`,
                'de': `${baseUrl}/de/privacy-policy`,
                'fr': `${baseUrl}/fr/privacy-policy`,
                'x-default': `${baseUrl}/ar/privacy-policy`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}/privacy-policy`,
            type: 'website',
            siteName: 'AZAFCO - ازافكو العالمية',
            locale: locale === 'ar' ? 'ar_EG' : 'en_US',
            images: [{
                url: `/images/og-image-${locale === 'ar' ? 'ar' : 'en'}.jpg`,
                width: 1200,
                height: 630,
                alt: t('title'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: [`/images/og-image-${locale === 'ar' ? 'ar' : 'en'}.jpg`],
        },
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
            },
        },
    };
}

export default async function PrivacyPolicyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'privacy' });
    const isAr = locale === 'ar';

    return (
        <div className={`min-h-screen bg-gray-50 ${isAr ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center">
                        {t('title')}
                    </h1>
                    <p className="text-center text-gray-300 mt-4">
                        {t('last_updated')}: {new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('intro.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('intro.content')}</p>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('data_collection.title')}</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">{t('data_collection.content')}</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                            <li>{t('data_collection.item1')}</li>
                            <li>{t('data_collection.item2')}</li>
                            <li>{t('data_collection.item3')}</li>
                        </ul>
                    </section>

                    {/* Analytics */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('analytics.title')}</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">{t('analytics.content')}</p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-gray-700"><strong>Google Analytics 4:</strong> {t('analytics.ga4')}</p>
                            <p className="text-gray-700"><strong>Microsoft Clarity:</strong> {t('analytics.clarity')}</p>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('cookies.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('cookies.content')}</p>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('sharing.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('sharing.content')}</p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('rights.title')}</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">{t('rights.content')}</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                            <li>{t('rights.item1')}</li>
                            <li>{t('rights.item2')}</li>
                            <li>{t('rights.item3')}</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary-800 mb-4">{t('contact.title')}</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">{t('contact.content')}</p>
                        <div className="bg-primary-50 rounded-lg p-4">
                            <p className="text-primary-800">
                                <strong>{t('contact.email_label')}:</strong>{' '}
                                <a href="mailto:info@azafco.com.eg" className="text-primary-600 hover:underline">
                                    info@azafco.com.eg
                                </a>
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
