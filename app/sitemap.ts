import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const baseUrl = 'https://azafco.com.eg';

// Define all static pages with their priorities and change frequencies
const pages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: 'products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'markets', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'media', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: 'certificates', priority: 0.6, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate entries for each page in each locale
    for (const page of pages) {
        for (const locale of locales) {
            const url = page.path
                ? `${baseUrl}/${locale}/${page.path}`
                : `${baseUrl}/${locale}`;

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
            });
        }
    }

    return sitemapEntries;
}
