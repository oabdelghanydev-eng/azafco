import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Cairo } from 'next/font/google';
import { locales, localeConfig, Locale } from '@/i18n';
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
    const baseUrl = 'https://azafco.com.eg';
    const isArabic = locale === 'ar';

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: isArabic
                ? 'ازافكو العالمية - AZAFCO International'
                : 'AZAFCO International - Egyptian Fish Exporter',
            template: isArabic
                ? '%s | ازافكو العالمية'
                : '%s | AZAFCO International',
        },
        description: isArabic
            ? 'شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة لأكثر من 15 دولة منذ عام 2008'
            : 'Leading Egyptian company specialized in fresh fish packaging and export to worldwide markets since 2008',
        keywords: isArabic
            ? 'ازافكو, تصدير أسماك, أسماك طازجة, بلطي, قاروص, بوري, مصر'
            : 'AZAFCO, fish export, fresh fish, tilapia, sea bass, mullet, Egypt',
        authors: [{ name: 'AZAFCO International' }],
        creator: 'AZAFCO International',
        publisher: 'AZAFCO International',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            type: 'website',
            locale: isArabic ? 'ar_EG' : 'en_US',
            alternateLocale: isArabic ? 'en_US' : 'ar_EG',
            url: baseUrl,
            siteName: 'AZAFCO - ازافكو العالمية',
            images: [
                {
                    url: isArabic ? '/images/og-image-ar.jpg' : '/images/og-image-en.jpg',
                    width: 1200,
                    height: 630,
                    alt: isArabic
                        ? 'ازافكو العالمية - تصدير الأسماك الطازجة'
                        : 'AZAFCO International - Fresh Fish Export from Egypt',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            images: [isArabic ? '/images/og-image-ar.jpg' : '/images/og-image-en.jpg'],
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
            // Add your verification codes here
            // google: 'your-google-verification-code',
        },
        alternates: {
            canonical: baseUrl,
            languages: {
                'ar': `${baseUrl}/ar`,
                'en': `${baseUrl}/en`,
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

                {/* Favicon - Optimized for Google Search 2024 */}
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-48x48.png" />
                <link rel="icon" href="/favicon.ico" sizes="48x48" />
                <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />

                {/* Theme & Geo Tags */}
                <meta name="theme-color" content="#1e3a5f" />
                <meta name="geo.region" content="EG-KFS" />
                <meta name="geo.placename" content="Kafr El Sheikh, Egypt" />
                <meta name="geo.position" content="31.2653;30.9366" />
                <meta name="ICBM" content="31.2653, 30.9366" />

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
            </body>
        </html>
    );
}
