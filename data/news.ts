/**
 * News & press (Insights → /insights/news). Locale-agnostic data; every visible
 * string lives in locales/<l>/pages/v2-news.json under news_v2.items.<key>.
 *
 * Sources: the live site's Media Center (origin/main data/news.ts), re-checked on
 * 2026-11-14. Rules (RELEASE-DECISIONS 14 Nov 2026):
 * - company coverage is described neutrally: no "best exporter", "all countries"
 *   or EU-approval claims (the 2020 newspaper feature is shown as a feature only);
 * - industry items carry their named source and only figures that source states;
 *   industry data is never presented as AZAFCO data;
 * - milestones: founding 2008, Baltim 2018, Motobas 2025. No "one of 6 EU plants"
 *   claim. The ISO item names only ISO 9001, 14001 and 45001 and has no date
 *   (certificate dates are not shown on the site).
 * - photos: existing manifest photos only (lib/v2/media), on industry items only.
 *   They are illustrative context, never presented as photos of the event; cards
 *   label them as such. Company news items (visit, press feature, TV episode) show
 *   no image until the owner sends real photos (B2B review, ledger C11).
 * - sourceUrl only when it opens the coverage itself: the 2020 newspaper feature
 *   has only the paper's home page, so it shows its source name and date as text.
 */

export type NewsKind = 'press' | 'industry';

export interface NewsItem {
    /** news_v2.items.<key> */
    key: string;
    kind: NewsKind;
    /** ISO date (YYYY-MM-DD) of the event or publication */
    date: string;
    /** Original source (opens in a new tab). Omit when no public link exists. */
    sourceUrl?: string;
    /** lib/v2/media id for the card photo */
    imageId?: string;
}

export const newsItems: NewsItem[] = [
    // ── Company news and press ──
    {
        key: 'governor_visit',
        kind: 'press',
        date: '2025-09-17',
        sourceUrl: 'https://www.facebook.com/reel/1122525626517427',
    },
    {
        key: 'press_feature',
        kind: 'press',
        date: '2020-11-18',
        // Article URL pending (owner question 10); the paper's home page is not a source link
    },
    {
        key: 'tv_program',
        kind: 'press',
        date: '2017-12-10',
        sourceUrl: 'https://www.youtube.com/watch?v=kuT4e6PXcFI',
    },

    // ── Industry context (named sources, neutral wording) ──
    {
        key: 'egypt_ranking',
        kind: 'industry',
        date: '2024-06-08',
        sourceUrl: 'https://sis.gov.eg/en/media-center/news/agriculture-minister-egypt-comes-in-1st-rank-in-fisheries-in-africa',
        imageId: 'photo-delta-landscape',
    },
    {
        key: 'kafr_el_sheikh_production',
        kind: 'industry',
        date: '2020-12-28',
        sourceUrl: 'https://gate.ahram.org.eg/News/2550584.aspx',
        imageId: 'photo-harvest',
    },
    {
        key: 'ghalioun_project',
        kind: 'industry',
        date: '2017-11-18',
        sourceUrl:
            'https://www.youm7.com/story/2017/11/18/%D8%B5%D9%88%D8%B1-%D8%AA%D8%B9%D8%B1%D9%81-%D8%B9%D9%84%D9%89-%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84-%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%D8%B9-%D8%A7%D9%84%D9%85%D9%81%D8%AA%D8%AA%D8%AD%D8%A9-%D8%A7%D9%84%D9%8A%D9%88%D9%85-%D9%81%D9%89-%D8%A8%D8%B1%D9%83%D8%A9-%D8%BA%D9%84%D9%8A%D9%88%D9%86/3515538',
        imageId: 'photo-home-hero',
    },
];

/** Company milestones (year only). Text: news_v2.milestones.items.<key>. */
export interface Milestone {
    key: string;
    year: number;
}

export const milestones: Milestone[] = [
    { key: 'founding', year: 2008 },
    { key: 'baltim', year: 2018 },
    { key: 'motobas', year: 2025 },
];

/** ISO standards shown on the milestones card (names only: no numbers, dates or scope). */
export const isoStandards = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018'] as const;

const byDateDesc = (a: NewsItem, b: NewsItem) => b.date.localeCompare(a.date);

export const pressItems = newsItems.filter((n) => n.kind === 'press').sort(byDateDesc);
export const industryItems = newsItems.filter((n) => n.kind === 'industry').sort(byDateDesc);

/** Newest company items, for the teaser on /insights */
export const latestPress = (count = 3) => pressItems.slice(0, count);
