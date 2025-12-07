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
    titleEn?: string
    description: string
    descriptionEn?: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article' | 'product'
    products?: ProductSchemaItem[]
}

// Comprehensive keywords for global reach
const defaultKeywords = {
    en: `
        AZAFCO, AZAFCO International, Egyptian fish exporter, fresh fish supplier Egypt,
        tilapia supplier, tilapia export Egypt, Nile tilapia wholesale,
        sea bass supplier, Egyptian sea bass, fresh sea bass export,
        mullet fish supplier, fresh mullet Egypt, bouri fish export,
        B2B seafood supplier, wholesale fish Egypt, bulk fish order,
        Gulf fish import, Middle East fish supplier, fish export UAE, fish export Saudi Arabia,
        fish export Qatar, fish export Kuwait, fish export Bahrain, fish export Jordan,
        fresh fish packaging, frozen fish Egypt, seafood distributor Egypt,
        Egyptian seafood company, Kafr El Sheikh fish, Nile fish export,
        catfish supplier Egypt, freshwater fish export, saltwater fish Egypt,
        fish processing Egypt, HACCP certified fish, ISO certified seafood,
        commercial fish supplier, restaurant fish supplier, hotel fish supplier,
        fish wholesale price, bulk tilapia, bulk sea bass, bulk mullet,
        African tilapia, Mediterranean sea bass, Red Sea fish
    `.replace(/\s+/g, ' ').trim(),
    ar: `
        ازافكو, ازافكو العالمية, شركة تصدير أسماك مصرية, مورد أسماك طازجة مصر,
        بلطي, بلطي نيلي, تصدير بلطي, بلطي بالجملة,
        قاروص, قاروص بحري, تصدير قاروص, مورد قاروص,
        بوري, بوري طازج, تصدير بوري, مورد بوري,
        أسماك طازجة, أسماك مجمدة, مورد أسماك بالجملة,
        تصدير أسماك الخليج, تصدير أسماك السعودية, تصدير أسماك الإمارات,
        تصدير أسماك قطر, تصدير أسماك الكويت, تصدير أسماك البحرين,
        شركة أسماك كفر الشيخ, مصنع أسماك مطوبس, أسماك نيلية,
        أسماك بحرية, قراميط, لوت بحري, ثعابين,
        مورد مطاعم أسماك, مورد فنادق أسماك, أسماك بالجملة,
        شهادة HACCP, شهادة ISO, أسماك معتمدة
    `.replace(/\s+/g, ' ').trim()
}

const SEO: React.FC<SEOProps> = ({
    title,
    titleEn,
    description,
    descriptionEn,
    keywords,
    image,
    url = 'https://azafco.com.eg',
    type = 'website',
    products
}) => {
    const { locale } = useI18n()

    // Dynamic OG image based on language
    const defaultImage = locale === 'ar'
        ? '/images/og-image-ar.jpg'
        : '/images/og-image-en.jpg'
    const ogImage = image || defaultImage

    // Dynamic title based on language
    const displayTitle = locale === 'ar' ? title : (titleEn || title)
    const fullTitle = locale === 'ar'
        ? `${displayTitle} | ازافكو العالمية - AZAFCO International`
        : `${displayTitle} | AZAFCO International - Egyptian Fish Exporter`

    // Dynamic description based on language
    const displayDescription = locale === 'ar' ? description : (descriptionEn || description)

    // Dynamic keywords based on language
    const displayKeywords = keywords || defaultKeywords[locale]

    const fullImage = ogImage.startsWith('http') ? ogImage : `https://azafco.com.eg${ogImage}`

    // Full URL for Schema.org images
    const schemaImage = `https://azafco.com.eg${defaultImage}`

    // Structured Data for Organization (Main Schema for B2B)
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://azafco.com.eg/#organization',
        name: locale === 'ar' ? 'ازافكو العالمية للإستثمار والتنمية' : 'AZAFCO International Investment & Development',
        alternateName: ['AZAFCO International', 'AZAFCO', 'ازافكو', 'Azafco Egypt'],
        url: 'https://azafco.com.eg',
        logo: {
            '@type': 'ImageObject',
            url: 'https://azafco.com.eg/images/logo.svg',
            width: '300',
            height: '100'
        },
        image: schemaImage,
        description: locale === 'ar'
            ? 'شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة لأكثر من 15 دولة منذ عام 2008.'
            : 'Leading Egyptian company specialized in fresh fish packaging and export to worldwide markets since 2008. Serving distributors, restaurants, and hotels with premium quality seafood.',
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
            streetAddress: 'Industrial Zone, Motobas',
            addressLocality: 'Kafr El Sheikh',
            addressRegion: 'Kafr El Sheikh Governorate',
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
                areaServed: ['EG', 'AE', 'SA', 'QA', 'KW', 'BH', 'IQ', 'JO', 'LB', 'RU', 'ES', 'US', 'GB', 'DE', 'FR']
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
            'Tilapia Wholesale',
            'Sea Bass Export',
            'Mullet Fish',
            'Fish Processing',
            'B2B Seafood Supply',
            'Egyptian Seafood',
            'Nile Fish',
            'Mediterranean Fish'
        ],
        slogan: locale === 'ar'
            ? 'أسماك طازجة فاخرة من مصر إلى العالم'
            : 'Premium Fresh Fish from Egypt to the World',
        makesOffer: [
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Fresh Tilapia Export',
                    description: 'Premium Nile Tilapia for wholesale and export'
                }
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Sea Bass Supply',
                    description: 'Fresh Mediterranean Sea Bass for international markets'
                }
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Mullet Fish Export',
                    description: 'Fresh Mullet (Bouri) for Gulf and European markets'
                }
            }
        ]
    }

    // LocalBusiness Schema (for local search)
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': 'https://azafco.com.eg/#localbusiness',
        name: locale === 'ar' ? 'مصنع ازافكو للأسماك' : 'AZAFCO Fish Processing Factory',
        alternateName: 'AZAFCO Fish Factory',
        image: schemaImage,
        url: 'https://azafco.com.eg',
        telephone: '+201007514567',
        email: 'business@azafco.com.eg',
        priceRange: '$$',
        currenciesAccepted: 'USD, EGP, AED, SAR, EUR',
        paymentAccepted: 'Wire Transfer, Letter of Credit, Bank Transfer',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Industrial Zone, Number 120, Feed Sector',
            addressLocality: 'Motobas',
            addressRegion: 'Kafr El Sheikh',
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
            { '@type': 'Country', name: 'Spain' },
            { '@type': 'Country', name: 'United States' },
            { '@type': 'Country', name: 'United Kingdom' },
            { '@type': 'Country', name: 'Germany' },
            { '@type': 'Country', name: 'France' }
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Fresh Fish Products Catalog',
            itemListElement: [
                { '@type': 'OfferCatalog', name: 'Freshwater Fish', description: 'Tilapia, Catfish, Mullet, Mubarakah' },
                { '@type': 'OfferCatalog', name: 'Saltwater Fish', description: 'Sea Bass, Buni, Lout, Eels' }
            ]
        }
    }

    // Product Catalog Schema (ItemList - without prices, B2B appropriate)
    const productCatalogSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': 'https://azafco.com.eg/products#catalog',
        name: locale === 'ar' ? 'كتالوج منتجات ازافكو' : 'AZAFCO Fresh Fish Products Catalog',
        description: locale === 'ar'
            ? 'تشكيلة متكاملة من الأسماك الطازجة للتصدير'
            : 'Complete range of premium fresh fish for export from Egypt',
        numberOfItems: products.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: locale === 'ar' ? `${product.name} - ${product.nameEn}` : `${product.nameEn} - ${product.name}`,
            description: locale === 'ar' ? `${product.description} | ${product.descriptionEn}` : `${product.descriptionEn} | ${product.description}`,
            image: `https://azafco.com.eg${product.image}`,
            url: 'https://azafco.com.eg/products'
        }))
    } : null

    // WebSite Schema (for sitelinks in search)
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://azafco.com.eg/#website',
        name: locale === 'ar' ? 'ازافكو العالمية - AZAFCO International' : 'AZAFCO International - Egyptian Fish Exporter',
        alternateName: ['ازافكو', 'AZAFCO', 'Azafco Egypt', 'AZAFCO Fish'],
        url: 'https://azafco.com.eg',
        description: locale === 'ar'
            ? 'الموقع الرسمي لشركة ازافكو العالمية - تصدير الأسماك الطازجة من مصر'
            : 'Official website of AZAFCO International - Premium fresh fish exporter from Egypt to worldwide markets',
        inLanguage: ['ar', 'en'],
        publisher: {
            '@id': 'https://azafco.com.eg/#organization'
        }
    }

    // BreadcrumbList Schema
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

    // FAQ Schema (for rich snippets)
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: locale === 'ar' ? 'ما هي أنواع الأسماك التي تصدرها ازافكو؟' : 'What types of fish does AZAFCO export?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: locale === 'ar'
                        ? 'نصدر البلطي النيلي، القاروص البحري، البوري، المبروكة، القراميط، واللوت البحري بأحجام متعددة.'
                        : 'We export Nile Tilapia, Sea Bass, Mullet (Bouri), Mubarakah, Catfish, and Sea Bream in various sizes.'
                }
            },
            {
                '@type': 'Question',
                name: locale === 'ar' ? 'ما هي الدول التي تصدرون إليها؟' : 'Which countries do you export to?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: locale === 'ar'
                        ? 'نصدر إلى الإمارات، السعودية، قطر، الكويت، البحرين، العراق، الأردن، لبنان، روسيا، وإسبانيا.'
                        : 'We export to UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Iraq, Jordan, Lebanon, Russia, and Spain.'
                }
            },
            {
                '@type': 'Question',
                name: locale === 'ar' ? 'ما هي شهادات الجودة لديكم؟' : 'What quality certifications do you have?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: locale === 'ar'
                        ? 'حاصلون على شهادات ISO 22000، HACCP، ISO 9001، ISO 14001، و ISO 45001.'
                        : 'We are certified with ISO 22000, HACCP, ISO 9001, ISO 14001, and ISO 45001.'
                }
            },
            {
                '@type': 'Question',
                name: locale === 'ar' ? 'ما هو الحد الأدنى للطلب؟' : 'What is the minimum order quantity?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: locale === 'ar'
                        ? 'نتعامل مع طلبات الجملة فقط. تواصل معنا لمناقشة احتياجاتك المحددة.'
                        : 'We handle wholesale orders only. Contact us to discuss your specific requirements.'
                }
            },
            {
                '@type': 'Question',
                name: locale === 'ar' ? 'كيف يتم شحن الأسماك؟' : 'How are the fish shipped?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: locale === 'ar'
                        ? 'نستخدم سلسلة تبريد متكاملة مع حاويات مبردة لضمان وصول الأسماك طازجة.'
                        : 'We use a complete cold chain with refrigerated containers to ensure fish arrive fresh.'
                }
            }
        ]
    }

    // SpeakableSpecification Schema (for voice search and AI assistants)
    const speakableSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': url,
        name: fullTitle,
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'h2', '.section-title', '.company-description']
        }
    }

    // ProductGroup Schema (for B2B product visibility)
    const productGroupSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ProductGroup',
        '@id': 'https://azafco.com.eg/products#productgroup',
        name: locale === 'ar' ? 'أسماك ازافكو الطازجة' : 'AZAFCO Fresh Fish Products',
        description: locale === 'ar'
            ? 'منتجات الأسماك الطازجة من ازافكو للتصدير - بلطي، قاروص، بوري'
            : 'Premium fresh fish products from AZAFCO for export - Tilapia, Sea Bass, Mullet',
        brand: {
            '@type': 'Brand',
            name: 'AZAFCO',
            logo: 'https://azafco.com.eg/images/logo.svg'
        },
        manufacturer: {
            '@id': 'https://azafco.com.eg/#organization'
        },
        productGroupID: 'fresh-fish',
        hasVariant: products.map(product => ({
            '@type': 'Product',
            name: locale === 'ar' ? product.name : product.nameEn,
            description: locale === 'ar' ? product.description : product.descriptionEn,
            image: `https://azafco.com.eg${product.image}`,
            category: product.category === 'river'
                ? (locale === 'ar' ? 'أسماك مياه عذبة' : 'Freshwater Fish')
                : (locale === 'ar' ? 'أسماك بحرية' : 'Saltwater Fish'),
            brand: {
                '@type': 'Brand',
                name: 'AZAFCO'
            }
        }))
    } : null

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={displayDescription} />
            <meta name="keywords" content={displayKeywords} />
            <meta name="author" content="AZAFCO International - ازافكو العالمية" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content={locale === 'ar' ? 'Arabic' : 'English'} />
            <meta name="content-language" content={locale} />
            <meta name="geo.region" content="EG-KFS" />
            <meta name="geo.placename" content="Kafr El Sheikh, Egypt" />
            <meta name="geo.position" content="31.2653;30.9366" />
            <meta name="ICBM" content="31.2653, 30.9366" />

            {/* Favicon - Optimized for Google Search 2024 */}
            {/* Google prefers 48x48+ PNG or ICO */}
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-48x48.png" />
            <link rel="icon" href="/favicon.ico" sizes="48x48" />
            {/* Modern browsers prefer SVG */}
            <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
            {/* Fallback sizes */}
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
            {/* Apple devices */}
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
            {/* PWA Manifest */}
            <link rel="manifest" href="/manifest.json" />

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
            <meta property="og:description" content={displayDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={locale === 'ar' ? 'ازافكو العالمية - تصدير الأسماك الطازجة' : 'AZAFCO International - Fresh Fish Export from Egypt'} />
            <meta property="og:locale" content={locale === 'ar' ? 'ar_EG' : 'en_US'} />
            <meta property="og:locale:alternate" content={locale === 'ar' ? 'en_US' : 'ar_EG'} />
            <meta property="og:site_name" content="AZAFCO - ازافكو العالمية" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={displayDescription} />
            <meta name="twitter:image" content={fullImage} />
            <meta name="twitter:image:alt" content="AZAFCO International - Fresh Fish Export" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Alternate languages - Proper hreflang setup */}
            <link rel="alternate" hrefLang="ar" href={`${url}?lang=ar`} />
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

            {/* Structured Data - FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Structured Data - Speakable (for voice search) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
            />

            {/* Structured Data - ProductGroup (for B2B AI visibility) */}
            {productGroupSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productGroupSchema) }}
                />
            )}
        </Head>
    )
}

export default SEO
