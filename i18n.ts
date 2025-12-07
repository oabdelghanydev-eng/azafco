import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales - easily scalable to 10+ languages
export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

// Default locale (Arabic for this Egyptian company)
export const defaultLocale: Locale = 'ar';

// Locale configuration with display names and direction
export const localeConfig: Record<Locale, { name: string; dir: 'rtl' | 'ltr'; nativeName: string }> = {
    ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' },
    en: { name: 'English', dir: 'ltr', nativeName: 'English' },
    // Future languages can be added here:
    // fr: { name: 'French', dir: 'ltr', nativeName: 'Français' },
    // de: { name: 'German', dir: 'ltr', nativeName: 'Deutsch' },
    // es: { name: 'Spanish', dir: 'ltr', nativeName: 'Español' },
    // ru: { name: 'Russian', dir: 'ltr', nativeName: 'Русский' },
    // zh: { name: 'Chinese', dir: 'ltr', nativeName: '中文' },
    // ja: { name: 'Japanese', dir: 'ltr', nativeName: '日本語' },
    // ko: { name: 'Korean', dir: 'ltr', nativeName: '한국어' },
    // pt: { name: 'Portuguese', dir: 'ltr', nativeName: 'Português' },
};

// Request-scoped configuration for next-intl v3
export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    return {
        messages: (await import(`./locales/${locale}.json`)).default,
        // Time zone for date formatting
        timeZone: 'Africa/Cairo',
        // Configure date/time formatting
        now: new Date(),
    };
});
