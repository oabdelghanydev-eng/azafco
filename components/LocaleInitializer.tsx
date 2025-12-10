'use client';

/**
 * LocaleInitializer Component
 * 
 * Reads saved locale preference from localStorage on page load
 * and redirects if necessary. This provides the localStorage
 * persistence feature from the current project while maintaining
 * App Router's URL-based locale.
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';

const LocaleInitializer: React.FC = () => {
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Only run on client side and only once
        if (typeof window === 'undefined' || hasChecked) return;

        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

        // If user has a saved preference different from current URL locale
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en') && savedLocale !== currentLocale) {
            // Check if this is the first visit (no explicit locale choice made)
            const hasExplicitChoice = sessionStorage.getItem('locale-choice-made');

            if (!hasExplicitChoice) {
                // Redirect to saved locale preference
                router.replace(pathname, { locale: savedLocale });
            }
        }

        setHasChecked(true);
    }, [currentLocale, pathname, router, hasChecked]);

    // This component doesn't render anything
    return null;
};

export default LocaleInitializer;
