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
    keywords = 'أسماك، تصدير، مصر، ازافكو، أسماك طازجة، بلطي، بوري، قاروص، fish export Egypt, AZAFCO, fresh fish supplier, tilapia, mullet, sea bass, Egyptian seafood, fish wholesale, Gulf fish import, frozen fish Egypt, B2B seafood supplier',
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

    // Structured Data for Organization (Main Schema for B2B)
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://azafco.com.eg/#organization',
        name: 'ازافكو العالمية للإستثمار والتنمية',
        alternateName: ['AZAFCO International', 'AZAFCO', 'ازافكو'],
        url: 'https://azafco.com.eg',
        logo: {
            '@type': 'ImageObject',
            url: 'https://azafco.com.eg/images/logo.svg',
            width: '300',
            height: '100'
        },
        image: 'https://azafco.com.eg/images/og-image.png',
        description: 'Leading Egyptian company specialized in fresh fish packaging and export to worldwide markets since 2008. شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة.',
        foundingDate: '2008',
        founder: {
            '@type': 'Person',
            name: 'AZAFCO Founder'
        },
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 50,
            maxValue: 200
        },
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
                contactOption: 'TollFree',
                availableLanguage: ['Arabic', 'English'],
                areaServed: ['EG', 'AE', 'SA', 'QA', 'KW', 'BH', 'IQ', 'JO', 'LB', 'RU', 'ES']
            },
            {
                '@type': 'ContactPoint',
                telephone: '+201007514567',
                contactType: 'customer service',
                availableLanguage: ['Arabic', 'English']
            }
        ],
        sameAs: [
            'https://www.facebook.com/profile.php?id=100063620366349',
            'https://wa.me/201007514567'
        ],
        knowsAbout: [
            'Fresh Fish Export',
            'Seafood Packaging',
            'Tilapia',
            'Sea Bass',
            'Mullet',
            'Fish Processing',
            'B2B Seafood Supply'
        ],
        slogan: 'Premium Fresh Fish from Egypt to the World'
    }

    // LocalBusiness Schema (for local search)
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': 'https://azafco.com.eg/#localbusiness',
        name: 'مصنع ازافكو للأسماك',
        alternateName: 'AZAFCO Fish Processing Factory',
        image: 'https://azafco.com.eg/images/og-image.png',
        url: 'https://azafco.com.eg',
        telephone: '+201007514567',
        email: 'info@azafco.com.eg',
        priceRange: '$$',
        currenciesAccepted: 'USD, EGP, AED, SAR',
        paymentAccepted: 'Wire Transfer, Letter of Credit',
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
            { '@type': 'Country', name: 'Jordan' },
            { '@type': 'Country', name: 'Lebanon' },
            { '@type': 'Country', name: 'Russia' },
            { '@type': 'Country', name: 'Spain' }
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Fresh Fish Products Catalog',
            itemListElement: [
                { '@type': 'OfferCatalog', name: 'Freshwater Fish', description: 'Tilapia, Catfish, Mullet' },
                { '@type': 'OfferCatalog', name: 'Saltwater Fish', description: 'Sea Bass, Buni, Lout' }
            ]
        }
    }

    // Product Catalog Schema (ItemList - without prices, B2B appropriate)
    const productCatalogSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': 'https://azafco.com.eg/products#catalog',
        name: locale === 'ar' ? 'كتالوج منتجات ازافكو' : 'AZAFCO Products Catalog',
        description: locale === 'ar'
            ? 'تشكيلة متكاملة من الأسماك الطازجة للتصدير'
            : 'Complete range of fresh fish for export',
        numberOfItems: products.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${product.nameEn} - ${product.name}`,
            description: `${product.descriptionEn} | ${product.description}`,
            image: `https://azafco.com.eg${product.image}`,
            url: 'https://azafco.com.eg/products'
        }))
    } : null

    // WebSite Schema (for sitelinks in search)
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://azafco.com.eg/#website',
        name: 'AZAFCO International - ازافكو العالمية',
        alternateName: 'ازافكو',
        url: 'https://azafco.com.eg',
        description: 'Official website of AZAFCO International - Premium fresh fish exporter from Egypt',
        inLanguage: ['ar', 'en'],
        publisher: {
            '@id': 'https://azafco.com.eg/#organization'
        }
    }

    // BreadcrumbList Schema (helps with navigation in search results)
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'ar' ? 'الرئيسية' : 'Home',
                item: 'https://azafco.com.eg'
            }
        ]
    }

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="AZAFCO International - ازافكو العالمية" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Arabic, English" />
            <meta name="content-language" content={locale} />
            <meta name="geo.region" content="EG-KFS" />
            <meta name="geo.placename" content="Kafr El Sheikh, Egypt" />
            <meta name="geo.position" content="31.2653;30.9366" />
            <meta name="ICBM" content="31.2653, 30.9366" />

            {/* Mobile & PWA */}
            <meta name="theme-color" content="#1e3a5f" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="format-detection" content="telephone=yes" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="AZAFCO International - Fresh Fish Export from Egypt" />
            <meta property="og:locale" content={locale === 'ar' ? 'ar_EG' : 'en_US'} />
            <meta property="og:locale:alternate" content={locale === 'ar' ? 'en_US' : 'ar_EG'} />
            <meta property="og:site_name" content="AZAFCO - ازافكو العالمية" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
            <meta name="twitter:image:alt" content="AZAFCO International - Fresh Fish Export" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Alternate languages */}
            <link rel="alternate" hrefLang="ar" href={url} />
            <link rel="alternate" hrefLang="en" href={`${url}?lang=en`} />
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Structured Data - WebSite */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />

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

            {/* Structured Data - Breadcrumb */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Structured Data - Product Catalog (only on products page, no prices) */}
            {productCatalogSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
                />
            )}
        </Head>
    )
}

export default SEO
