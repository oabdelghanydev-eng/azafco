// Product types - locale-agnostic, translations come from next-intl
export type ProductCategory = 'river' | 'sea'

export interface Product {
    id: number
    // English, URL-safe slug for the species page: /[locale]/products/[slug]
    slug: string
    // Translation key for product data (e.g., 'tilapia', 'sea_bass')
    // Used to lookup translations at data.products.[key]
    translationKey: string
    category: ProductCategory
    image: string
    available: boolean
}

// Locale-agnostic product data - all translatable strings are in locale JSON files
export const products: Product[] = [
    {
        id: 1,
        slug: 'tilapia',
        translationKey: 'tilapia',
        category: 'river',
        image: '/items/tilapia.jpg',
        available: true,
    },
    {
        id: 2,
        slug: 'sea-bass',
        translationKey: 'sea_bass',
        category: 'sea',
        image: '/items/sea_bass.jpg',
        available: true,
    },
    {
        id: 3,
        slug: 'mullet',
        translationKey: 'mullet',
        category: 'river',
        image: '/items/bouri.jpg',
        available: true,
    },
    {
        id: 4,
        slug: 'buni',
        translationKey: 'buni',
        category: 'sea',
        image: '/items/buni.jpg',
        available: true,
    },
    {
        id: 5,
        slug: 'mubarakah',
        translationKey: 'mubarakah',
        category: 'river',
        image: '/items/mubarakah.jpg',
        available: true,
    },
    {
        id: 6,
        slug: 'catfish',
        translationKey: 'catfish',
        category: 'river',
        image: '/items/catfish.jpg',
        available: true,
    },
    {
        id: 7,
        slug: 'lout',
        translationKey: 'lout',
        category: 'sea',
        image: '/items/lout.jpg',
        available: true,
    },
    {
        id: 8,
        slug: 'eel',
        translationKey: 'eels',
        category: 'river',
        image: '/items/eels.jpg',
        available: true,
    },
]

// All species-page slugs (used by generateStaticParams and the sitemap)
export const productSlugs: string[] = products.map((p) => p.slug)

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug)
}

// Products for homepage preview (first 4)
export const featuredProducts = products.slice(0, 4)
