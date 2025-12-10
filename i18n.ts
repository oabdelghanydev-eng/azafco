import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales - easily scalable to 10+ languages
export const locales = ['ar', 'en', 'es', 'ru'] as const;
export type Locale = (typeof locales)[number];

// Default locale (Arabic for this Egyptian company)
export const defaultLocale: Locale = 'ar';

// Locale configuration with display names and direction
export const localeConfig: Record<Locale, { name: string; dir: 'rtl' | 'ltr'; nativeName: string }> = {
    ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' },
    en: { name: 'English', dir: 'ltr', nativeName: 'English' },
    es: { name: 'Spanish', dir: 'ltr', nativeName: 'Español' },
    ru: { name: 'Russian', dir: 'ltr', nativeName: 'Русский' },
};

// Request-scoped configuration for next-intl v3.25+
export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request (new API)
    const locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as Locale)) {
        notFound();
    }

    return {
        locale, // Must return locale in next-intl v3.25+
        messages: (await import(`./locales/${locale}.json`)).default,
        // Time zone for date formatting
        timeZone: 'Africa/Cairo',
        // Configure date/time formatting
        now: new Date(),
    };
});

