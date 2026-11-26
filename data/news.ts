/**
 * Company news and press, shown on /about in the section with id="news"
 * (the old /insights index, /insights/news and /media 308 there). Locale-agnostic
 * data; every visible string lives in locales/<l>/pages/v2-news.json under
 * news_v2.items.<key>.
 *
 * Sources: the live site's Media Center (origin/main data/news.ts), re-checked on
 * 2026-11-14. Rules (RELEASE-DECISIONS and ROUND1-SPEC, 14 Nov 2026):
 * - company coverage is described neutrally: no "best exporter", "all countries"
 *   or EU-approval claims (the 2020 newspaper feature is shown as a feature only);
 * - the industry-context items and the milestones timeline were removed in round 1
 *   (the timeline was a copy of the /about milestones);
 * - no photos until the owner sends real ones (B2B review, ledger C11);
 * - sourceUrl only when it opens the coverage itself: the 2020 newspaper feature
 *   has only the paper's home page, so it shows its source name and date as text.
 */

export interface NewsItem {
    /** news_v2.items.<key> */
    key: string;
    /** ISO date (YYYY-MM-DD) of the event or publication */
    date: string;
    /** Original source (opens in a new tab). Omit when no public link exists. */
    sourceUrl?: string;
}

const items: NewsItem[] = [
    {
        key: 'governor_visit',
        date: '2025-09-17',
        sourceUrl: 'https://www.facebook.com/reel/1122525626517427',
    },
    {
        key: 'press_feature',
        date: '2020-11-18',
        // Article URL pending (owner question 10); the paper's home page is not a source link
    },
    {
        key: 'tv_program',
        date: '2017-12-10',
        sourceUrl: 'https://www.youtube.com/watch?v=kuT4e6PXcFI',
    },
];

/** Newest first */
export const newsItems: NewsItem[] = items.slice().sort((a, b) => b.date.localeCompare(a.date));
