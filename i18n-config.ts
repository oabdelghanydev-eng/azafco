/**
 * Locale list and per-locale settings. Plain module with no imports, so client
 * components and navigation.ts can use it without pulling next-intl/server or
 * the company config into the browser bundle. i18n.ts re-exports everything.
 */
// Supported locales - easily scalable to 10+ languages
export const locales = ['ar', 'en', 'es', 'ru', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

/**
 * Locales that are live: language switcher, hreflang alternates, sitemap and
 * middleware detection. A new language is added to `locales` with its
 * locales/<code>/ folder first, and listed here once its translation is complete.
 */
export const publishedLocales = ['ar', 'en', 'es', 'ru', 'de', 'fr'] as const satisfies readonly Locale[];
export type PublishedLocale = (typeof publishedLocales)[number];
export const isPublishedLocale = (l: string): l is PublishedLocale =>
    (publishedLocales as readonly string[]).includes(l);

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
