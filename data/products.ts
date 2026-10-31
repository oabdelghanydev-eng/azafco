// Product types - locale-agnostic, translations come from next-intl
// Water type the species lives / is farmed in (see docs/reports/species-identification.md)
export type ProductCategory = 'freshwater' | 'marine' | 'brackish'

export const productCategories: ProductCategory[] = ['freshwater', 'marine', 'brackish']

// Translation key for each category label (products_page.<category>)
export const categoryLabelKey = (category: ProductCategory) => `products_page.${category}`

// Badge colour per category
export const categoryBadgeClass: Record<ProductCategory, string> = {
    freshwater: 'bg-blue-500',
    marine: 'bg-cyan-600',
    brackish: 'bg-teal-600',
}

export interface Product {
    id: number
    // English, URL-safe slug for the species page: /[locale]/products/[slug]
    slug: string
    // Translation key for product data (e.g., 'tilapia', 'sea_bass')
    // Used to lookup translations at data.products.[key]
    translationKey: string
    category: ProductCategory
    // Latin binomial, shown on species pages and in Product JSON-LD
    scientificName: string
    image: string
    available: boolean
}

// Locale-agnostic product data - all translatable strings are in locale JSON files
export const products: Product[] = [
    {
        id: 1,
        slug: 'tilapia',
        translationKey: 'tilapia',
        category: 'freshwater',
        scientificName: 'Oreochromis niloticus',
        image: '/items/tilapia.jpg',
        available: true,
    },
    {
        id: 2,
        slug: 'sea-bass',
        translationKey: 'sea_bass',
        category: 'marine',
        scientificName: 'Dicentrarchus labrax',
        image: '/items/sea_bass.jpg',
        available: true,
    },
    {
        id: 3,
        slug: 'mullet',
        translationKey: 'mullet',
        category: 'brackish',
        scientificName: 'Mugil cephalus',
        image: '/items/bouri.jpg',
        available: true,
    },
    {
        id: 4,
        slug: 'buni',
        translationKey: 'buni',
        category: 'freshwater',
        scientificName: 'Labeobarbus bynni',
        image: '/items/buni.jpg',
        available: true,
    },
    {
        id: 5,
        slug: 'common-carp',
        translationKey: 'mubarakah',
        category: 'freshwater',
        scientificName: 'Cyprinus carpio',
        image: '/items/mubarakah.jpg',
        available: true,
    },
    {
        id: 6,
        slug: 'catfish',
        translationKey: 'catfish',
        category: 'freshwater',
        scientificName: 'Clarias gariepinus',
        image: '/items/catfish.jpg',
        available: true,
    },
    {
        id: 7,
        slug: 'meagre',
        translationKey: 'lout',
        category: 'marine',
        scientificName: 'Argyrosomus regius',
        image: '/items/lout.jpg',
        available: true,
    },
    {
        id: 8,
        slug: 'eel',
        translationKey: 'eels',
        category: 'brackish',
        scientificName: 'Anguilla anguilla',
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
