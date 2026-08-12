import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { Cairo } from 'next/font/google';
import { locales, localeConfig, ogLocaleMap, Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import StructuredData from '@/components/StructuredData';
import LocaleInitializer from '@/components/LocaleInitializer';
import '../globals.css';

// Configure Cairo font with next/font for optimal loading (same as original)
const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    display: 'swap',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-cairo',
});

// Generate static params for all locales
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

// Generate metadata for the root layout
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const baseUrl = companyConfig.contact.baseUrl;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t('site.title_default'),
            template: t('site.title_template'),
        },
        description: t('home.description'),
        keywords: t('home.keywords'),
        authors: [{ name: t('site.author') }],
        creator: t('site.creator'),
        publisher: t('site.publisher'),
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            type: 'website',
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            alternateLocale: ['ar_EG', 'en_US', 'es_ES', 'ru_RU', 'de_DE', 'fr_FR'].filter(l => !l.startsWith(locale)),
            url: baseUrl,
            siteName: t('site.name'),
            images: [
                {
                    url: `/images/og-image-${locale === 'ar' || locale === 'en' ? locale : 'en'}.jpg`,
                    width: 1200,
                    height: 630,
                    alt: t('site.og_alt'),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            images: [`/images/og-image-${locale === 'ar' || locale === 'en' ? locale : 'en'}.jpg`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // Property verified via Google Analytics integration
            // No HTML meta tag needed
        },
        alternates: {
            canonical: baseUrl,
            languages: {
                'ar': `${baseUrl}/ar`,
                'en': `${baseUrl}/en`,
                'es': `${baseUrl}/es`,
                'ru': `${baseUrl}/ru`,
                'de': `${baseUrl}/de`,
                'fr': `${baseUrl}/fr`,
                'x-default': `${baseUrl}/ar`,
            },
        },
    };
}

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function RootLayout({
    children,
    params,
}: RootLayoutProps) {
    const { locale } = await params;

    // Validate locale
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the current locale
    const messages = await getMessages();

    // Get direction for the locale
    const dir = localeConfig[locale as Locale]?.dir || 'ltr';

    return (
        <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                {/* Performance: DNS Prefetch */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Favicon - 2025 Best Practices: SVG first (scalable), PNG/ICO fallback for legacy + Google */}
                <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicons/favicon.ico" sizes="48x48" />
                <link rel="icon" type="image/png" sizes="192x192" href="/favicons/icons-192.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
                <link rel="manifest" href="/favicons/manifest.webmanifest" />

                {/* Theme & Geo Tags */}
                <meta name="theme-color" content={companyConfig.branding.themeColor} />
                <meta name="geo.region" content={companyConfig.geo.region} />
                <meta name="geo.placename" content={companyConfig.geo.placename} />
                <meta name="geo.position" content={`${companyConfig.geo.latitude};${companyConfig.geo.longitude}`} />
                <meta name="ICBM" content={`${companyConfig.geo.latitude}, ${companyConfig.geo.longitude}`} />

                {/* Mobile & PWA */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body className={cairo.className}>
                <NextIntlClientProvider messages={messages}>
                    <LocaleInitializer />
                    <StructuredData />
                    {children}
                </NextIntlClientProvider>

                {/* Vercel Analytics - only in production to avoid dev mode issues */}
                {process.env.NODE_ENV === 'production' && <Analytics />}

                {/* Vercel Speed Insights - only in production to avoid dev mode issues */}
                {process.env.NODE_ENV === 'production' && <SpeedInsights />}

                {/* Google Analytics 4 - Best Practice: afterInteractive */}
                <Script
                    id="ga4-gtag"
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${companyConfig.analytics.googleAnalyticsId}`}
                />
                <Script
                    id="ga4-config"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${companyConfig.analytics.googleAnalyticsId}');
                        `,
                    }}
                />

                {/* Microsoft Clarity - Best Practice: lazyOnload for non-critical analytics */}
                <Script
                    id="clarity-script"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "${companyConfig.analytics.clarityId}");
                        `,
                    }}
                />
            </body>
        </html>
    );
}
