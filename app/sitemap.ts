import { MetadataRoute } from 'next';
import { publishedLocales as locales } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { productSlugs } from '@/data/products';
import { activeMarketSlugs } from '@/data/markets';
import { guides } from '@/data/guides';
import { hreflangAlternates } from '@/components/v2/businesses/pageMetadata';

const baseUrl = companyConfig.contact.baseUrl;

type Page = {
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
    /** Content date: the guide's lastReviewed, otherwise SITE_REVIEWED. */
    lastModified?: string;
};

/**
 * Date of the last content review of the site pages (round 1, 14 Nov 2026).
 * Update it when page copy changes; guides carry their own lastReviewed.
 */
const SITE_REVIEWED = '2026-11-22';

// Define all static pages with their priorities and change frequencies
const pages: Page[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: 'products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'markets', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'processing', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'quality', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'for-importers', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: 'requirements', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'insights', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: 'privacy-policy', priority: 0.2, changeFrequency: 'yearly' as const },
    ...productSlugs.map((slug) => ({ path: `products/${slug}`, priority: 0.8, changeFrequency: 'monthly' as const })),
    ...activeMarketSlugs.map((slug) => ({ path: `markets/${slug}`, priority: 0.7, changeFrequency: 'monthly' as const })),
    ...guides.map((guide) => ({
        path: `insights/${guide.slug}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
        lastModified: guide.lastReviewed,
    })),
];

const pageUrl = (locale: string, path: string) =>
    path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate entries for each page in each locale, each listing its
    // language alternates (hreflang, same helper as the page <head>: published
    // locales + x-default → /en). lastModified is a content date (guides:
    // lastReviewed; other pages: SITE_REVIEWED), never the build time.
    // Removed pages (/seafood, /businesses, /insights/news) 308 in next.config.js.
    for (const page of pages) {
        const languages = hreflangAlternates(page.path ? `/${page.path}` : '');

        for (const locale of locales) {
            sitemapEntries.push({
                url: pageUrl(locale, page.path),
                lastModified: page.lastModified ?? SITE_REVIEWED,
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: { languages },
            });
        }
    }

    return sitemapEntries;
}
