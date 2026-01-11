// News types - locale-agnostic, translations come from next-intl
export type NewsCategory = 'company' | 'industry' | 'achievement'

export interface NewsItem {
    id: number
    // Translation key for news data (e.g., 'governor_visit', 'best_exporter')
    // Used to lookup translations at data.news.[key] including title, summary, content, source
    translationKey: string
    date: string
    sourceUrl?: string
    image?: string
    category: NewsCategory
}

// Locale-agnostic news data - all translatable strings are in locale JSON files
// Source names are now in translations at data.news.[translationKey].source
export const newsItems: NewsItem[] = [
    // === Company News ===
    {
        id: 1,
        translationKey: 'governor_visit',
        date: '2025-09-17',
        sourceUrl: 'https://www.facebook.com/reel/1122525626517427',
        category: 'company',
    },
    {
        id: 10,
        translationKey: 'best_exporter',
        date: '2020-11-18',
        sourceUrl: 'https://alshrqalawsat.com/',
        category: 'company',
    },
    {
        id: 2,
        translationKey: 'tv_program',
        date: '2017-12-10',
        sourceUrl: 'https://www.youtube.com/watch?v=kuT4e6PXcFI',
        category: 'company',
    },

    // === Industry News ===
    {
        id: 3,
        translationKey: 'egypt_ranking',
        date: '2024-06-01',
        sourceUrl: 'https://sis.gov.eg/en/media-center/news/agriculture-minister-egypt-comes-in-1st-rank-in-fisheries-in-africa',
        category: 'industry',
    },
    {
        id: 4,
        translationKey: 'kafr_el_sheikh_production',
        date: '2024-01-15',
        sourceUrl: 'https://gate.ahram.org.eg/News/2550584.aspx',
        category: 'industry',
    },
    {
        id: 5,
        translationKey: 'ghalioun_project',
        date: '2017-11-18',
        sourceUrl: 'https://www.presidency.eg/',
        category: 'industry',
    },

    // === Achievements ===
    {
        id: 6,
        translationKey: 'iso_certifications',
        date: '2018-01-01',
        category: 'achievement',
    },
    {
        id: 7,
        translationKey: 'baltim_factory',
        date: '2018-01-01',
        category: 'achievement',
    },
    {
        id: 8,
        translationKey: 'motobas_factory',
        date: '2025-01-01',
        category: 'achievement',
    },
    {
        id: 9,
        translationKey: 'founding',
        date: '2008-01-01',
        category: 'achievement',
    },
]

// Sort by date (newest first)
const sortedNews = [...newsItems].sort((a, b) => {
    const dateA = new Date(a.date.split('-').length === 3 ? a.date : `${a.date}-01-01`)
    const dateB = new Date(b.date.split('-').length === 3 ? b.date : `${b.date}-01-01`)
    return dateB.getTime() - dateA.getTime()
})

// Latest news for homepage (top 3 by date)
export const latestNews = sortedNews.slice(0, 3)

// News by category
export const companyNews = newsItems.filter(n => n.category === 'company')
export const industryNews = newsItems.filter(n => n.category === 'industry')
export const achievementNews = newsItems.filter(n => n.category === 'achievement')
