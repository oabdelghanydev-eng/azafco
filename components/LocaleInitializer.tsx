'use client';

/**
 * LocaleInitializer Component
 * 
 * Handles locale detection and preference management.
 * Priority order:
 * 1. URL locale (already handled by Next.js routing)
 * 2. Saved user preference (localStorage)
 * 3. Browser language (navigator.languages / Accept-Language)
 * 4. Default locale (ar)
 * 
 * This component only redirects on first visit when no explicit choice was made.
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales, defaultLocale, Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';
const SESSION_CHOICE_KEY = 'azafco-locale-choice-made';

/**
 * Detects the best matching locale from browser settings
 * @returns The best matching locale or null if none found
 */
function detectBrowserLocale(): Locale | null {
    if (typeof window === 'undefined' || !navigator.languages) {
        return null;
    }

    // Get browser's preferred languages (e.g., ['en-US', 'en', 'ar'])
    const browserLanguages = navigator.languages || [navigator.language];

    for (const browserLang of browserLanguages) {
        // Extract the primary language code (e.g., 'en-US' -> 'en')
        const primaryLang = browserLang.split('-')[0].toLowerCase();

        // Check if it's a supported locale
        if (locales.includes(primaryLang as Locale)) {
            return primaryLang as Locale;
        }
    }

    return null;
}

/**
 * Gets the saved locale from localStorage
 * @returns The saved locale or null if not found/invalid
 */
function getSavedLocale(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

    // Validate that saved locale is still in supported locales list
    if (savedLocale && locales.includes(savedLocale as Locale)) {
        return savedLocale as Locale;
    }

    return null;
}

/**
 * Determines the preferred locale based on priority
 * Priority: saved preference > browser language > default
 */
function getPreferredLocale(): Locale {
    // 1. Check saved preference first
    const savedLocale = getSavedLocale();
    if (savedLocale) {
        return savedLocale;
    }

    // 2. Detect browser language
    const browserLocale = detectBrowserLocale();
    if (browserLocale) {
        return browserLocale;
    }

    // 3. Fall back to default
    return defaultLocale;
}

const LocaleInitializer: React.FC = () => {
    const currentLocale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Only run on client side and only once
        if (typeof window === 'undefined' || hasChecked) return;

        // Check if user has already made an explicit choice this session
        const hasExplicitChoice = sessionStorage.getItem(SESSION_CHOICE_KEY);

        if (!hasExplicitChoice) {
            const preferredLocale = getPreferredLocale();

            // Only redirect if preferred locale differs from current
            if (preferredLocale !== currentLocale) {
                router.replace(pathname, { locale: preferredLocale });
            }
        }

        setHasChecked(true);
    }, [currentLocale, pathname, router, hasChecked]);

    // This component doesn't render anything
    return null;
};

export default LocaleInitializer;

