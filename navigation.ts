import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

/**
 * Type-safe navigation helpers for next-intl v3
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
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
    locales,
});
