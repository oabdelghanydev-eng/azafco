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
    // false = sold, but not shown on the site: kept in data (HS table in the
    // import guide, translations) and hidden everywhere else (catalogue, seafood
    // index, related products, sitemap, RFQ species list; the product page 404s).
    // Default (omitted) = published.
    published?: boolean
}

// Locale-agnostic product data - all translatable strings are in locale JSON files
export const allProducts: Product[] = [
    {
        id: 1,
        slug: 'tilapia',
        translationKey: 'tilapia',
        category: 'freshwater',
        scientificName: 'Oreochromis niloticus',
        image: '/images/species/tilapia.webp',
        available: true,
    },
    {
        id: 2,
        slug: 'sea-bass',
        translationKey: 'sea_bass',
        category: 'marine',
        scientificName: 'Dicentrarchus labrax',
        image: '/images/species/sea-bass.webp',
        available: true,
    },
    {
        id: 3,
        slug: 'mullet',
        translationKey: 'mullet',
        category: 'brackish',
        scientificName: 'Mugil cephalus',
        image: '/images/species/mullet.webp',
        available: true,
    },
    {
        id: 4,
        // Was "buni" (Nile barb) until 7 Nov 2026; the owner's species list shows
        // this product is grass carp (حشايش). /products/buni redirects here (next.config.js).
        slug: 'grass-carp',
        translationKey: 'grass_carp',
        category: 'freshwater',
        scientificName: 'Ctenopharyngodon idella',
        image: '/images/species/grass-carp.webp',
        available: true,
    },
    {
        id: 5,
        slug: 'common-carp',
        translationKey: 'mubarakah',
        category: 'freshwater',
        scientificName: 'Cyprinus carpio',
        image: '/images/species/common-carp.webp',
        available: true,
    },
    {
        id: 6,
        slug: 'catfish',
        translationKey: 'catfish',
        category: 'freshwater',
        scientificName: 'Clarias gariepinus',
        image: '/images/species/catfish.webp',
        available: true,
    },
    {
        id: 7,
        slug: 'meagre',
        translationKey: 'lout',
        category: 'marine',
        scientificName: 'Argyrosomus regius',
        image: '/images/species/meagre.webp',
        available: true,
    },
    // Added from the owner's species list (7 Nov 2026), see docs/reports/species-identification.md
    {
        id: 9,
        slug: 'thinlip-mullet',
        translationKey: 'thinlip_mullet',
        category: 'brackish',
        scientificName: 'Chelon ramada',
        image: '/images/species/thinlip-mullet.webp',
        available: true,
    },
    {
        id: 10,
        slug: 'bayad-catfish',
        translationKey: 'bayad_catfish',
        category: 'freshwater',
        scientificName: 'Bagrus bajad',
        image: '/images/species/bayad-catfish.webp',
        available: true,
    },
    {
        id: 11,
        slug: 'silver-carp',
        translationKey: 'silver_carp',
        category: 'freshwater',
        scientificName: 'Hypophthalmichthys molitrix',
        image: '/images/species/silver-carp.webp',
        available: true,
    },
    {
        id: 12,
        slug: 'mirror-carp',
        translationKey: 'mirror_carp',
        category: 'freshwater',
        // Mirror-scaled variety of common carp
        scientificName: 'Cyprinus carpio',
        image: '/images/species/mirror-carp.webp',
        available: true,
    },
    {
        id: 13,
        slug: 'sea-bream',
        translationKey: 'sea_bream',
        category: 'marine',
        scientificName: 'Sparus aurata',
        image: '/images/species/sea-bream.webp',
        available: true,
    },
    // Eel is sold but not shown (owner, 13 Nov 2026: the 12 above are the main,
    // most-requested species; other species are supplied on request).
    {
        id: 8,
        slug: 'eel',
        translationKey: 'eels',
        category: 'brackish',
        scientificName: 'Anguilla anguilla',
        image: '' /* no photo in the owner's set (7 Nov 2026) */,
        available: true,
        published: false,
    },
]

// Published products: the 12 main species shown on the site (eel excluded).
// Use this list everywhere on the site; `allProducts` only for data maintenance.
export const products: Product[] = allProducts.filter((p) => p.published !== false)

// Published species-page slugs (used by generateStaticParams and the sitemap)
export const productSlugs: string[] = products.map((p) => p.slug)

// Published products only: hidden species resolve to undefined (→ notFound)
export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug)
}

// Products for homepage preview (first 4)
export const featuredProducts = products.slice(0, 4)
