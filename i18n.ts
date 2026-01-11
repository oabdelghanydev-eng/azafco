import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales - easily scalable to 10+ languages
export const locales = ['ar', 'en', 'es', 'ru', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

// Default locale (Arabic for this Egyptian company)
export const defaultLocale: Locale = 'ar';

// Locale configuration with display names and direction
export const localeConfig: Record<Locale, { name: string; dir: 'rtl' | 'ltr'; nativeName: string }> = {
    ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' },
    en: { name: 'English', dir: 'ltr', nativeName: 'English' },
    es: { name: 'Spanish', dir: 'ltr', nativeName: 'Español' },
    ru: { name: 'Russian', dir: 'ltr', nativeName: 'Русский' },
    de: { name: 'German', dir: 'ltr', nativeName: 'Deutsch' },
    fr: { name: 'French', dir: 'ltr', nativeName: 'Français' },
};

// OpenGraph locale codes (for SEO meta tags)
export const ogLocaleMap: Record<Locale, string> = {
    ar: 'ar_EG',
    en: 'en_US',
    es: 'es_ES',
    ru: 'ru_RU',
    de: 'de_DE',
    fr: 'fr_FR',
};

// Date formatting locale codes (for Intl.DateTimeFormat)
export const dateLocaleMap: Record<Locale, string> = {
    ar: 'ar-EG',
    en: 'en-US',
    es: 'es-ES',
    ru: 'ru-RU',
    de: 'de-DE',
    fr: 'fr-FR',
};

// OpenGraph image paths per locale (for social sharing previews)
// When locale-specific images are created, update the paths here
export const ogImageMap: Record<Locale, string> = {
    ar: '/images/og-image-ar.jpg',
    en: '/images/og-image-en.jpg',
    es: '/images/og-image-en.jpg',  // fallback to EN until ES image created
    ru: '/images/og-image-en.jpg',  // fallback to EN until RU image created
    de: '/images/og-image-en.jpg',  // fallback to EN until DE image created
    fr: '/images/og-image-en.jpg',  // fallback to EN until FR image created
};

// Request-scoped configuration for next-intl v3.25+
export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request (new API)
    const locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as Locale)) {
        notFound();
    }

    // Load messages from domain-driven split structure
    // Each locale has an index.ts that merges all split files
    let messages;
    try {
        messages = (await import(`./locales/${locale}/index`)).default;
    } catch (error) {
        // This should never happen in production - fail fast with clear error
        console.error(
            `[i18n] CRITICAL: Failed to load locale '${locale}' from split structure.`,
            error instanceof Error ? error.message : error
        );
        throw new Error(`Failed to load translations for locale: ${locale}`);
    }

    return {
        locale, // Must return locale in next-intl v3.25+
        messages,
        // Time zone for date formatting
        timeZone: 'Africa/Cairo',
        // Configure date/time formatting
        now: new Date(),
    };
});
