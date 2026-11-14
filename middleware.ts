import createMiddleware from 'next-intl/middleware';
import { publishedLocales, defaultLocale, type PublishedLocale } from './i18n';

export default createMiddleware({
    // Published locales only: Accept-Language / cookie detection never picks a
    // language whose translation is not live yet.
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
    // - QR contact card (/qr)
    // - Hidden offer pages (/offer/...)
    matcher: [
        '/((?!api|v|qr|offer|_next|_vercel|.*\\..*).*)',
        // Also match root
        '/'
    ]
};
