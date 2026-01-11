// Product types - locale-agnostic, translations come from next-intl
export type ProductCategory = 'river' | 'sea'

export interface Product {
    id: number
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
        translationKey: 'tilapia',
        category: 'river',
        image: '/items/tilapia.jpg',
        available: true,
    },
    {
        id: 2,
        translationKey: 'sea_bass',
        category: 'sea',
        image: '/items/sea_bass.jpg',
        available: true,
    },
    {
        id: 3,
        translationKey: 'mullet',
        category: 'river',
        image: '/items/bouri.jpg',
        available: true,
    },
    {
        id: 4,
        translationKey: 'buni',
        category: 'sea',
        image: '/items/buni.jpg',
        available: true,
    },
    {
        id: 5,
        translationKey: 'mubarakah',
        category: 'river',
        image: '/items/mubarakah.jpg',
        available: true,
    },
    {
        id: 6,
        translationKey: 'catfish',
        category: 'river',
        image: '/items/catfish.jpg',
        available: true,
    },
    {
        id: 7,
        translationKey: 'lout',
        category: 'sea',
        image: '/items/lout.jpg',
        available: true,
    },
    {
        id: 8,
        translationKey: 'eels',
        category: 'river',
        image: '/items/eels.jpg',
        available: true,
    },
]

// Products for homepage preview (first 4)
export const featuredProducts = products.slice(0, 4)
