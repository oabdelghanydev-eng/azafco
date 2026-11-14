import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, locales, isPublishedLocale, type Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';

const baseUrl = companyConfig.contact.baseUrl;

/**
 * hreflang alternates for a locale-less path. The one helper for every page,
 * the root layout and the sitemap.
 *
 * Built from i18n `locales`, gated by `isPublishedLocale` (i18n `publishedLocales`):
 * a locale gets an alternate only once its copy is published. x-default is the
 * English page (`/en<path>`): the locale-less URL only redirects, so it must not
 * be an hreflang target.
 *
 * @param path locale-less path: '' for home, '/about', '/products/tilapia'
 */
export function hreflangAlternates(path: string): Record<string, string> {
    const p = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
    const languages: Record<string, string> = {};
    for (const l of locales) {
        if (isPublishedLocale(l)) languages[l] = `${baseUrl}/${l}${p}`;
    }
    languages['x-default'] = `${baseUrl}/en${p}`;
    return languages;
}

/** Open Graph alternate locales: the other published locales (ar_EG, en_US, ...). */
export function ogAlternateLocales(locale: string): string[] {
    return locales.filter(l => l !== locale && isPublishedLocale(l)).map(l => ogLocaleMap[l]);
}

/**
 * Shared metadata for the v2 corporate pages (home / about / businesses):
 * self-canonical, hreflang (published locales + x-default → /en), Open Graph and Twitter.
 * An unpublished locale (still redirected to English) is marked noindex as a guard,
 * so it can never be indexed if the redirect is removed before the copy is translated.
 *
 * @param path locale-less path: '' for home, '/about', '/businesses'
 */
export async function buildPageMetadata({
    locale,
    path,
    title,
    description,
}: {
    locale: string;
    path: '' | `/${string}`;
    title: string;
    description: string;
}): Promise<Metadata> {
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });
    const url = `${baseUrl}/${locale}${path}`;
    const image = ogImageMap[locale as Locale] ?? ogImageMap.en;
    const published = isPublishedLocale(locale);

    return {
        // Absolute: the brand name is already in the copy, so skip the "%s | AZAFCO" template
        title: { absolute: title },
        description,
        alternates: { canonical: url, languages: hreflangAlternates(path) },
        ...(published ? {} : { robots: { index: false, follow: true } }),
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            siteName: siteT('name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            alternateLocale: ogAlternateLocales(locale),
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}
