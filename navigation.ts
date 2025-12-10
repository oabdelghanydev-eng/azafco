import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';

/**
 * Type-safe navigation helpers for next-intl v3.22+
 * Use these instead of next/link and next/navigation for proper locale handling
 * 
 * Example usage:
 * import { Link, useRouter, usePathname } from '@/navigation';
 * 
 * <Link href="/products">Products</Link>  // Automatically prefixed with current locale
 * 
 * const router = useRouter();
 * router.push('/about');  // Navigates to /[locale]/about
 */

export const routing = defineRouting({
    locales,
    defaultLocale,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

