'use client';

/**
 * useLocalePreference Hook
 * 
 * Saves and retrieves user's language preference from localStorage
 * Combines the best of both projects:
 * - App Router URL-based locale from azafcotested
 * - localStorage persistence from current project
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';

export function useLocalePreference() {
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitialized, setIsInitialized] = useState(false);

    // Save locale preference when it changes
    useEffect(() => {
        if (typeof window !== 'undefined' && isInitialized) {
            localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale);
        }
    }, [currentLocale, isInitialized]);

    // Check for saved preference on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

            // If user has a saved preference different from current locale
            if (savedLocale && savedLocale !== currentLocale && !isInitialized) {
                // Redirect to saved locale
                router.replace(pathname, { locale: savedLocale as 'ar' | 'en' });
            }

            setIsInitialized(true);
        }
    }, []);

    const setLocalePreference = (newLocale: 'ar' | 'en') => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        }
        router.replace(pathname, { locale: newLocale });
    };

    const clearLocalePreference = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCALE_STORAGE_KEY);
        }
    };

    return {
        currentLocale,
        setLocalePreference,
        clearLocalePreference,
        isInitialized
    };
}

export default useLocalePreference;
