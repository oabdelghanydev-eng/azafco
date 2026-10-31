import { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { companyConfig } from '@/config/company.config';
import { productSlugs } from '@/data/products';
import { activeMarketSlugs } from '@/data/markets';

const baseUrl = companyConfig.contact.baseUrl;

// Define all static pages with their priorities and change frequencies
const pages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: 'products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'markets', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'media', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: 'certificates', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: 'eu-buyers', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: 'faq', priority: 0.6, changeFrequency: 'monthly' as const },
    ...productSlugs.map((slug) => ({ path: `products/${slug}`, priority: 0.8, changeFrequency: 'monthly' as const })),
    ...activeMarketSlugs.map((slug) => ({ path: `markets/${slug}`, priority: 0.7, changeFrequency: 'monthly' as const })),
];

const pageUrl = (locale: string, path: string) =>
    path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate entries for each page in each locale, each listing its
    // language alternates (hreflang). lastModified is omitted: a build-time
    // date on every URL tells search engines nothing changed meaningfully.
    for (const page of pages) {
        const languages = Object.fromEntries(
            locales.map((locale) => [locale, pageUrl(locale, page.path)])
        );

        for (const locale of locales) {
            sitemapEntries.push({
                url: pageUrl(locale, page.path),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: { languages },
            });
        }
    }

    return sitemapEntries;
}
