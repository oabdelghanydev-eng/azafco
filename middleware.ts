import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

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
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // Also match root
        '/'
    ]
};
