import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { IBM_Plex_Sans_Arabic, Manrope } from 'next/font/google';
import { locales, localeConfig, ogImageMap, ogLocaleMap, Locale } from '@/i18n';
import { companyConfig, getFigureValues } from '@/config/company.config';
import StructuredData from '@/components/StructuredData';
import { hreflangAlternates, ogAlternateLocales } from '@/components/v2/businesses/pageMetadata';
import GHeader from '@/components/g/GHeader';
import GFooter from '@/components/g/GFooter';
import MobileQuoteBar from '@/components/v2/MobileQuoteBar';
import RevealSections from '@/components/v2/RevealSections';
import ConsentBanner, { type ConsentBannerCopy } from '@/components/v2/ConsentBanner';
import { CONSENT_STORAGE_KEY, CONSENT_TYPES } from '@/components/v2/consent';
import { routes } from '@/lib/v2/routes';
import '../globals.css';

// Design G typography: Manrope for Latin and Cyrillic, IBM Plex Sans Arabic for Arabic.
// Exposed as CSS variables; globals.css builds the stacks (--v2-font-body / --v2-font-display).
const manrope = Manrope({
    subsets: ['latin', 'latin-ext', 'cyrillic'],
    // Variable font: one file per subset covers 400-800.
    display: 'swap',
    variable: '--font-manrope',
    // No auto 'Manrope Fallback' (local Arial): Arial has Arabic glyphs and would catch
    // Arabic text before IBM Plex Sans Arabic in the .g-font stack.
    adjustFontFallback: false,
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
    // Per-locale share image (i18n.ts ogImageMap; es/ru/de/fr use the English image until their own exists)
    const ogImage = ogImageMap[locale as Locale] ?? ogImageMap.en;

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
            alternateLocale: ogAlternateLocales(locale),
            url: `${baseUrl}/${locale}`,
            siteName: t('site.name'),
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: t('site.og_alt'),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            images: [ogImage],
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
        // Default for any page without its own metadata: the locale home. Every page
        // sets its own canonical + hreflang via buildPageMetadata / pageMetadata.
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: hreflangAlternates(''),
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

    // Client components get their copy as props from server wrappers. Only the
    // catalogue search (CatalogueBrowser) still reads messages in the browser.
    const allMessages = (await getMessages()) as Record<string, any>;
    const messages = { catalogue_v2: { browser: allMessages.catalogue_v2?.browser ?? {} } };

    // Get direction for the locale
    const dir = localeConfig[locale as Locale]?.dir || 'ltr';
    const tv = await getTranslations({ locale, namespace: 'v2' });
    const skipLabel = tv('skip_to_main');

    // Consent banner copy (v2.consent). es/ru/de/fr fall back to English until translated.
    const tConsent = tv.has('consent.title') ? tv : await getTranslations({ locale: 'en', namespace: 'v2' });
    const consentCopy: ConsentBannerCopy = {
        title: tConsent('consent.title'),
        text: tConsent('consent.text'),
        accept: tConsent('consent.accept'),
        reject: tConsent('consent.reject'),
        privacy: tConsent('consent.privacy'),
    };
    const gaId = companyConfig.analytics.googleAnalyticsId;
    const consentDenied = JSON.stringify(Object.fromEntries(CONSENT_TYPES.map((k) => [k, 'denied'])));
    const consentGranted = JSON.stringify(Object.fromEntries(CONSENT_TYPES.map((k) => [k, 'granted'])));

    return (
        <html lang={locale} dir={dir} data-scroll-behavior="smooth" className={`${manrope.variable} ${plexArabic.variable}`} suppressHydrationWarning>
            <head>
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
                    <StructuredData locale={locale} />
                    {/* Site v2 shell: skip link, header, main, footer, mobile RFQ bar */}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
                    >
                        {skipLabel}
                    </a>
                    <div className="flex min-h-screen flex-col">
                        <GHeader />
                        <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
                            {children}
                        </main>
                        <GFooter />
                    </div>
                    <MobileQuoteBar />
                    <RevealSections />
                    {/* Cookie consent: GA Consent Mode update + Microsoft Clarity only after Accept */}
                    <ConsentBanner copy={consentCopy} clarityId={companyConfig.analytics.clarityId} privacyHref={routes.privacy} />
                </NextIntlClientProvider>

                {/* Vercel Analytics - only in production to avoid dev mode issues */}
                {process.env.NODE_ENV === 'production' && <Analytics />}

                {/* Google Analytics 4 with Consent Mode v2: every consent type defaults to 'denied'
                    before the config call (cookieless pings only). A visitor who accepted earlier
                    (localStorage, see components/v2/ConsentBanner.tsx) is granted again before the
                    first hit. Microsoft Clarity is not loaded here: ConsentBanner injects it after Accept. */}
                <Script
                    id="ga4-gtag"
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                />
                <Script
                    id="ga4-config"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('consent', 'default', Object.assign(${consentDenied}, { wait_for_update: 500 }));
                            try {
                                if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'granted') {
                                    gtag('consent', 'update', ${consentGranted});
                                }
                            } catch (e) {}
                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `,
                    }}
                />
            </body>
        </html>
    );
}
