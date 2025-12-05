import Head from 'next/head'
import { useI18n } from '../contexts/I18nContext'

interface ProductSchemaItem {
    name: string
    nameEn: string
    description: string
    descriptionEn: string
    image: string
    category: string
}

interface SEOProps {
    title: string
    description: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article' | 'product'
    products?: ProductSchemaItem[]
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = 'أسماك، تصدير، مصر، ازافكو، أسماك طازجة، بلطي، بوري، قاروص، fish export Egypt, AZAFCO, fresh fish supplier, tilapia, mullet, sea bass, Egyptian seafood, fish wholesale, Gulf fish import, frozen fish Egypt',
    image = '/images/og-image.png',
    url = 'https://azafco.com.eg',
    type = 'website',
    products
}) => {
    const { locale } = useI18n()
    const fullTitle = locale === 'ar'
        ? `${title} | ازافكو العالمية - AZAFCO International`
        : `${title} | AZAFCO International`
    const fullImage = image.startsWith('http') ? image : `https://azafco.com.eg${image}`

    // Structured Data for Organization
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ازافكو العالمية للإستثمار والتنمية',
        alternateName: 'AZAFCO International Investment & Development',
        url: 'https://azafco.com.eg',
        logo: 'https://azafco.com.eg/images/logo.svg',
        description: 'Leading Egyptian company specialized in fresh fish packaging and export to worldwide markets. شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة.',
        foundingDate: '2008',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'المنطقة الصناعية، مطوبس',
            addressLocality: 'كفر الشيخ',
            addressRegion: 'Kafr El Sheikh',
            postalCode: '33511',
            addressCountry: 'EG'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '31.2653',
            longitude: '30.9366'
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+201007514567',
                contactType: 'sales',
                availableLanguage: ['Arabic', 'English'],
                areaServed: ['EG', 'AE', 'SA', 'QA', 'KW', 'BH', 'IQ', 'JO']
            },
            {
                '@type': 'ContactPoint',
                telephone: '+201007514567',
                contactType: 'customer service',
                availableLanguage: ['Arabic', 'English']
            }
        ],
        sameAs: [
            'https://wa.me/201007514567'
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Fresh Fish Products',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Fresh Tilapia - بلطي طازج'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Fresh Mullet - بوري طازج'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Product',
                        name: 'Sea Bass - قاروص'
                    }
                }
            ]
        }
    }

    // LocalBusiness Schema
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'FoodProcessingBusiness',
        name: 'مصنع ازافكو للأسماك',
        alternateName: 'AZAFCO Fish Processing Factory',
        image: 'https://azafco.com.eg/images/og-image.png',
        '@id': 'https://azafco.com.eg',
        url: 'https://azafco.com.eg',
        telephone: '+201007514567',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'المنطقة الصناعية',
            addressLocality: 'مطوبس',
            addressRegion: 'كفر الشيخ',
            postalCode: '33511',
            addressCountry: 'EG'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 31.2653,
            longitude: 30.9366
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '17:00'
        },
        areaServed: [
            { '@type': 'Country', name: 'Egypt' },
            { '@type': 'Country', name: 'United Arab Emirates' },
            { '@type': 'Country', name: 'Saudi Arabia' },
            { '@type': 'Country', name: 'Qatar' },
            { '@type': 'Country', name: 'Kuwait' },
            { '@type': 'Country', name: 'Bahrain' },
            { '@type': 'Country', name: 'Iraq' },
            { '@type': 'Country', name: 'Jordan' }
        ]
    }

    // Product List Schema for products page
    const productListSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'AZAFCO Fresh Fish Products',
        description: 'Premium fresh fish products for export from Egypt',
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Product',
                name: `${product.nameEn} - ${product.name}`,
                description: `${product.descriptionEn} | ${product.description}`,
                image: `https://azafco.com.eg${product.image}`,
                brand: {
                    '@type': 'Brand',
                    name: 'AZAFCO'
                },
                manufacturer: {
                    '@type': 'Organization',
                    name: 'AZAFCO International'
                },
                category: product.category === 'river' ? 'Freshwater Fish' : 'Saltwater Fish',
                offers: {
                    '@type': 'Offer',
                    availability: 'https://schema.org/InStock',
                    priceCurrency: 'USD',
                    priceSpecification: {
                        '@type': 'PriceSpecification',
                        priceCurrency: 'USD'
                    },
                    seller: {
                        '@type': 'Organization',
                        name: 'AZAFCO International'
                    }
                }
            }
        }))
    } : null

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="AZAFCO International - ازافكو العالمية" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Arabic, English" />
            <meta name="content-language" content="ar" />
            <meta name="geo.region" content="EG-KFS" />
            <meta name="geo.placename" content="Kafr El Sheikh, Egypt" />
            <meta name="geo.position" content="31.2653;30.9366" />
            <meta name="ICBM" content="31.2653, 30.9366" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="ar_EG" />
            <meta property="og:locale:alternate" content="en_US" />
            <meta property="og:site_name" content="AZAFCO - ازافكو العالمية" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Alternate languages */}
            <link rel="alternate" hrefLang="ar" href={url} />
            <link rel="alternate" hrefLang="en" href={`${url}?lang=en`} />
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Structured Data - Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            {/* Structured Data - LocalBusiness */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            {/* Structured Data - Product List (only on products page) */}
            {productListSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
                />
            )}
        </Head>
    )
}

export default SEO

