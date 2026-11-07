import createMiddleware from 'next-intl/middleware';
import { publishedLocales, defaultLocale, type PublishedLocale } from './i18n';

export default createMiddleware({
    // Published locales only (ar/en): Accept-Language / cookie detection must never
    // pick es/ru/de/fr, which next.config.js redirects to English until translated.
    locales: publishedLocales,

    // Used when no locale matches
    defaultLocale: defaultLocale as PublishedLocale,

    // Always use locale prefix in URL for SEO (e.g., /ar/products, /en/products)
    localePrefix: 'always',

    // Automatic locale detection based on Accept-Language header
    localeDetection: true,
});

export const config = {
    // Match all pathnames except for:
    // - API routes
    // - Static files (images, fonts, etc.)
    // - Next.js internals (_next)
    // - Certificate verification pages (/v/)
    matcher: [
        '/((?!api|v|_next|_vercel|.*\\..*).*)',
        // Also match root
        '/'
    ]
};
