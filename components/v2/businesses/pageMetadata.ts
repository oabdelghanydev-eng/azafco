import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ogLocaleMap, ogImageMap, locales, type Locale } from '@/i18n';
import { companyConfig } from '@/config/company.config';

/**
 * Shared metadata for the v2 corporate pages (home / about / businesses):
 * canonical, hreflang (all 6 locales + x-default), Open Graph and Twitter,
 * same shape as the pre-v2 pages.
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
    const baseUrl = companyConfig.contact.baseUrl;
    const siteT = await getTranslations({ locale, namespace: 'metadata.site' });
    const url = `${baseUrl}/${locale}${path}`;
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${baseUrl}/${l}${path}`;
    languages['x-default'] = `${baseUrl}${path}`;

    return {
        // Absolute: the brand name is already in the copy, so skip the "%s | AZAFCO" template
        title: { absolute: title },
        description,
        alternates: { canonical: url, languages },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            siteName: siteT('name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{ url: ogImageMap[locale as Locale], width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageMap[locale as Locale]],
        },
    };
}
