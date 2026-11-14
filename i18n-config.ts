/**
 * Locale list and per-locale settings. Plain module with no imports, so client
 * components and navigation.ts can use it without pulling next-intl/server or
 * the company config into the browser bundle. i18n.ts re-exports everything.
 */
// Supported locales - easily scalable to 10+ languages
export const locales = ['ar', 'en', 'es', 'ru', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

/**
 * Locales with real (translated) site v2 copy. Only these appear in the language
 * switcher, hreflang alternates and the sitemap. es/ru/de/fr still route, but
 * next.config.js redirects them (307) to the English page until translated.
 */
export const publishedLocales = ['ar', 'en'] as const satisfies readonly Locale[];
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
