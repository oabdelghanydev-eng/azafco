/**
 * Insights registry for site v2. Today every entry is a guide from
 * data/guides.ts (text in locales/<l>/pages/guides.json → guides_page.<key>).
 * Company news is not an article type: it lives in data/news.ts and is listed
 * on /insights itself (section id="news"). New article types get added here
 * with their own body component and an insights_v2.categories.<type> label.
 */
import { guides, type Guide } from '@/data/guides';

export type InsightCategory = 'importer_guide';

export interface InsightEntry {
    slug: string;
    category: InsightCategory;
    /** guides_page.<translationKey> */
    translationKey: string;
    datePublished: string;
    lastReviewed: string;
    /** lib/v2/media id for cards and article header. Leave unset until a professional photo exists. */
    imageId?: string;
}

/**
 * Guide slug -> lib/v2/media id. Lead-approved illustrative photo (8 Nov 2026);
 * its alt describes only what is visible, never "our plant".
 */
const GUIDE_IMAGE: Record<string, string> = {
    'importing-fresh-fish-from-egypt': 'photo-cold-chain',
};

export const insights: InsightEntry[] = guides.map((g: Guide) => ({
    slug: g.slug,
    category: 'importer_guide',
    translationKey: g.translationKey,
    datePublished: g.datePublished,
    lastReviewed: g.lastReviewed,
    imageId: GUIDE_IMAGE[g.slug],
}));

export const insightSlugs = insights.map((i) => i.slug);
export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);

/** Reading time from the article's own strings (~200 words per minute). */
export function readingMinutes(raw: unknown): number {
    let words = 0;
    const walk = (v: unknown) => {
        if (typeof v === 'string') words += v.split(/\s+/).filter(Boolean).length;
        else if (Array.isArray(v)) v.forEach(walk);
        else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(raw);
    return Math.max(1, Math.round(words / 200));
}
