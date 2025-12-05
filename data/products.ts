export interface Product {
    id: number
    name: string
    nameEn: string
    category: 'river' | 'sea'
    image: string
    sizes: string[]
    sizesEn: string[]
    available: boolean
    description: string
    descriptionEn: string
}

export const products: Product[] = [
    {
        id: 1,
        name: 'بلطي',
        nameEn: 'Tilapia',
        category: 'river',
        image: '/items/tilapia.jpg',
        sizes: ['صغير (200-300 جم)', 'متوسط (300-500 جم)', 'كبير (500+ جم)'],
        sizesEn: ['Small (200-300g)', 'Medium (300-500g)', 'Large (500g+)'],
        available: true,
        description: 'بلطي طازج من أفضل المزارع المحلية',
        descriptionEn: 'Fresh tilapia from the best local farms',
    },
    {
        id: 2,
        name: 'قاروص',
        nameEn: 'Sea Bass',
        category: 'sea',
        image: '/items/sea_bass.jpg',
        sizes: ['متوسط (400-600 جم)', 'كبير (600+ جم)'],
        sizesEn: ['Medium (400-600g)', 'Large (600g+)'],
        available: true,
        description: 'قاروص بحري طازج، مثالي للشوي والقلي',
        descriptionEn: 'Fresh sea bass, perfect for grilling and frying',
    },
    {
        id: 3,
        name: 'بوري',
        nameEn: 'Bouri - Biya - Mullet',
        category: 'river',
        image: '/items/bouri.jpg',
        sizes: ['صغير (150-250 جم)', 'متوسط (250-400 جم)'],
        sizesEn: ['Small (150-250g)', 'Medium (250-400g)'],
        available: true,
        description: 'بوري طازج، ممتاز للشوي والتدخين',
        descriptionEn: 'Fresh mullet, excellent for grilling and smoking',
    },
    {
        id: 4,
        name: 'بني - حشايش',
        nameEn: 'Buni',
        category: 'sea',
        image: '/items/Buni.jpg',
        sizes: ['متوسط (300-500 جم)', 'كبير (500+ جم)'],
        sizesEn: ['Medium (300-500g)', 'Large (500g+)'],
        available: true,
        description: 'بني بحري فاخر',
        descriptionEn: 'Premium sea buni',
    },
    {
        id: 5,
        name: 'مبروكة',
        nameEn: 'Mubarakah',
        category: 'river',
        image: '/items/mubarakah.jpg',
        sizes: ['كبير (1-2 كجم)', 'جامبو (2+ كجم)'],
        sizesEn: ['Large (1-2kg)', 'Jumbo (2kg+)'],
        available: true,
        description: 'مبروكة طازجة، مثالية للأطباق التقليدية',
        descriptionEn: 'Fresh mubarakah, ideal for traditional dishes',
    },
    {
        id: 6,
        name: 'قراميط',
        nameEn: 'Catfish',
        category: 'river',
        image: '/items/catfish.jpg',
        sizes: ['متوسط (500-800 جم)', 'كبير (800+ جم)'],
        sizesEn: ['Medium (500-800g)', 'Large (800g+)'],
        available: true,
        description: 'قراميط طازج من المياه العذبة',
        descriptionEn: 'Fresh catfish from freshwater',
    },
    {
        id: 7,
        name: 'لوت',
        nameEn: 'Lout',
        category: 'sea',
        image: '/items/lout.jpg',
        sizes: ['متوسط (400-600 جم)', 'كبير (600+ جم)'],
        sizesEn: ['Medium (400-600g)', 'Large (600g+)'],
        available: true,
        description: 'لوت بحري طازج',
        descriptionEn: 'Fresh sea lout',
    },
    {
        id: 8,
        name: 'ثعابين',
        nameEn: 'Eels Fish',
        category: 'river',
        image: '/items/eels.jpg',
        sizes: ['متوسط (300-500 جم)', 'كبير (500+ جم)'],
        sizesEn: ['Medium (300-500g)', 'Large (500g+)'],
        available: true,
        description: 'ثعابين طازجة من المياه العذبة',
        descriptionEn: 'Fresh eels from freshwater',
    },
]

// Products for homepage preview (first 4)
export const featuredProducts = products.slice(0, 4)
