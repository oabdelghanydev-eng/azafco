/**
 * generateMetadata helper for the v2 pages owned by page agent C
 * (markets, for-importers, insights, contact, rfq). Canonical + hreflang for
 * published locales (ar/en) + x-default, OpenGraph, Twitter. Candidate for lib/v2.
 */
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, ogImageMap, ogLocaleMap, type Locale, publishedLocales } from '@/i18n';
import { companyConfig } from '@/config/company.config';

const baseUrl = companyConfig.contact.baseUrl;

export interface PageMetaInput {
    locale: string;
    /** Locale-less path, '/markets' */
    path: string;
    title: string;
    description: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    noindex?: boolean;
}

export async function pageMetadata({ locale, path, title, description, type = 'website', publishedTime, modifiedTime, noindex }: PageMetaInput): Promise<Metadata> {
    const site = await getTranslations({ locale, namespace: 'metadata.site' });
    const languages: Record<string, string> = {};
    for (const l of publishedLocales) languages[l] = `${baseUrl}/${l}${path}`;
    languages['x-default'] = `${baseUrl}${path}`;
    const url = `${baseUrl}/${locale}${path}`;
    const image = ogImageMap[locale as Locale] ?? ogImageMap.en;

    return {
        title,
        description,
        alternates: { canonical: url, languages },
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
        openGraph: {
            title,
            description,
            url,
            type,
            ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
            siteName: site('name'),
            locale: ogLocaleMap[locale as Locale] || 'en_US',
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [image] },
    };
}

/** BreadcrumbList JSON-LD (Home + items). Paths are locale-less. */
export function breadcrumbJsonLd(locale: string, homeLabel: string, items: { name: string; path: string }[]) {
    const root = `${baseUrl}/${locale}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: homeLabel, path: '' }, ...items].map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            item: `${root}${it.path}`,
        })),
    };
}
