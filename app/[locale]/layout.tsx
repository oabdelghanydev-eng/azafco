import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { locales, localeConfig, ogLocaleMap, Locale } from '@/i18n';
import { companyConfig, getFigureValues } from '@/config/company.config';
import StructuredData from '@/components/StructuredData';
import LocaleInitializer from '@/components/LocaleInitializer';
import SiteHeader from '@/components/v2/SiteHeader';
import SiteFooter from '@/components/v2/SiteFooter';
import MobileQuoteBar from '@/components/v2/MobileQuoteBar';
import '../globals.css';

// Site v2 typography (brief §06): Inter for Latin display + body (variable font),
// IBM Plex Sans Arabic for Arabic. Exposed as CSS variables; globals.css picks
// the order per language (--v2-font-body / --v2-font-display).
const inter = Inter({
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
});

const plexArabic = IBM_Plex_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-plex-arabic',
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
    // Default description from the v2 home copy (the legacy metadata.home.description
    // carries unapproved figures)
    const tHome = await getTranslations({ locale, namespace: 'home_v2.meta' });

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t('site.title_default'),
            template: t('site.title_template'),
        },
        description: tHome('description'),
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
            alternateLocale: ['ar_EG', 'en_US'].filter(l => !l.startsWith(locale)),
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
                'x-default': `${baseUrl}`,
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
    // Only the v2 namespaces (+ common) go to the browser: old namespaces still hold
    // unapproved claims and must not ship in the page payload.
    const allMessages = await getMessages();
    const messages = Object.fromEntries(
        Object.entries(allMessages).filter(([key]) => key === 'common' || key === 'v2' || key.endsWith('_v2'))
    );

    // Get direction for the locale
    const dir = localeConfig[locale as Locale]?.dir || 'ltr';
    const skipLabel = (await getTranslations({ locale, namespace: 'v2' }))('skip_to_main');

    return (
        <html lang={locale} dir={dir} data-scroll-behavior="smooth" className={`${inter.variable} ${plexArabic.variable}`} suppressHydrationWarning>
            <head>
                {/* Performance: DNS Prefetch */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Favicon: new identity (public/brand, from branding/group-identity). SVG first, ICO/PNG fallbacks */}
                <link rel="icon" href="/brand/favicon-32.svg" type="image/svg+xml" />
                <link rel="icon" href="/brand/favicon.ico" sizes="16x16 32x32" />
                <link rel="icon" type="image/png" sizes="512x512" href="/brand/app-icon-512.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/brand/app-icon-180.png" />
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
            <body className="v2-scope font-body">
                <NextIntlClientProvider messages={messages} defaultTranslationValues={getFigureValues()}>
                    <LocaleInitializer />
                    <StructuredData locale={locale} />
                    {/* Site v2 shell: skip link, header, main, footer, mobile RFQ bar */}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
                    >
                        {skipLabel}
                    </a>
                    <div className="flex min-h-screen flex-col">
                        <SiteHeader />
                        <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
                            {children}
                        </main>
                        <SiteFooter />
                    </div>
                    <MobileQuoteBar />
                </NextIntlClientProvider>

                {/* Vercel Analytics - only in production to avoid dev mode issues */}
                {process.env.NODE_ENV === 'production' && <Analytics />}

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
