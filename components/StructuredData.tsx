'use client';

/**
 * StructuredData Component - Advanced SEO for App Router
 * 
 * Contains 7 Schema.org types for comprehensive B2B SEO:
 * 1. Organization - Company information
 * 2. LocalBusiness - Local search optimization
 * 3. WebSite - Sitelinks in search
 * 4. FAQPage - Rich snippets for questions
 * 5. BreadcrumbList - Navigation breadcrumbs
 * 6. SpeakableSpecification - Voice search optimization
 * 7. ProductGroup - B2B product visibility
 * 
 * Adapted from SEO.tsx (533 lines) for App Router compatibility
 */

import Script from 'next/script';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

interface ProductSchemaItem {
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    image: string;
    category: 'river' | 'sea';
}

interface StructuredDataProps {
    products?: ProductSchemaItem[];
    pageType?: 'home' | 'products' | 'about' | 'contact' | 'markets' | 'media' | 'certificates';
}

// Comprehensive B2B Keywords for Global Reach
export const defaultKeywords = {
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
    `.replace(/\s+/g, ' ').trim(),
    es: `
        AZAFCO, AZAFCO Internacional, exportador de pescado egipcio, proveedor de pescado fresco Egipto,
        proveedor de tilapia, exportación de tilapia Egipto, tilapia del Nilo al por mayor,
        proveedor de lubina, lubina egipcia, exportación de lubina fresca,
        proveedor de salmonete, salmonete fresco Egipto, exportación de pescado bouri,
        proveedor de mariscos B2B, pescado al por mayor Egipto, pedido de pescado a granel,
        importación de pescado del Golfo, proveedor de pescado Medio Oriente, exportación de pescado EAU, exportación de pescado Arabia Saudita,
        exportación de pescado Qatar, exportación de pescado Kuwait, exportación de pescado Bahréin, exportación de pescado Jordania,
        empaque de pescado fresco, pescado congelado Egipto, distribuidor de mariscos Egipto,
        empresa de mariscos egipcia, pescado Kafr El Sheikh, exportación de pescado del Nilo,
        proveedor de bagre Egipto, exportación de pescado de agua dulce, pescado de agua salada Egipto,
        procesamiento de pescado Egipto, pescado certificado HACCP, mariscos certificados ISO,
        proveedor comercial de pescado, proveedor de pescado para restaurantes, proveedor de pescado para hoteles,
        precio de pescado al por mayor, tilapia a granel, lubina a granel, salmonete a granel,
        tilapia africana, lubina mediterránea, pescado del Mar Rojo
    `.replace(/\s+/g, ' ').trim(),
    ru: `
        AZAFCO, AZAFCO International, египетский экспортёр рыбы, поставщик свежей рыбы Египет,
        поставщик тилапии, экспорт тилапии Египет, нильская тилапия оптом,
        поставщик морского окуня, египетский морской окунь, экспорт свежего морского окуня,
        поставщик кефали, свежая кефаль Египет, экспорт рыбы бури,
        B2B поставщик морепродуктов, оптовая продажа рыбы Египет, оптовый заказ рыбы,
        импорт рыбы Персидского залива, поставщик рыбы Ближний Восток, экспорт рыбы ОАЭ, экспорт рыбы Саудовская Аравия,
        экспорт рыбы Катар, экспорт рыбы Кувейт, экспорт рыбы Бахрейн, экспорт рыбы Иордания,
        упаковка свежей рыбы, замороженная рыба Египет, дистрибьютор морепродуктов Египет,
        египетская компания морепродуктов, рыба Кафр-эш-Шейх, экспорт нильской рыбы,
        поставщик сома Египет, экспорт пресноводной рыбы, морская рыба Египет,
        переработка рыбы Египет, рыба сертифицированная HACCP, морепродукты сертифицированные ISO,
        коммерческий поставщик рыбы, поставщик рыбы для ресторанов, поставщик рыбы для отелей,
        оптовая цена на рыбу, тилапия оптом, морской окунь оптом, кефаль оптом,
        африканская тилапия, средиземноморский морской окунь, рыба Красного моря
    `.replace(/\s+/g, ' ').trim()
};

const StructuredData: React.FC<StructuredDataProps> = ({ products, pageType = 'home' }) => {
    const locale = useLocale();
    const pathname = usePathname();
    const baseUrl = 'https://azafco.com.eg';
    const currentUrl = `${baseUrl}${pathname}`;

    const schemaImage = locale === 'ar'
        ? `${baseUrl}/images/og-image-ar.jpg`
        : `${baseUrl}/images/og-image-en.jpg`;

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 1: Organization (Main Schema for B2B)
    // ═══════════════════════════════════════════════════════════════
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: locale === 'ar' ? 'ازافكو العالمية للإستثمار والتنمية' : 'AZAFCO International Investment & Development',
        alternateName: ['AZAFCO International', 'AZAFCO', 'ازافكو', 'Azafco Egypt'],
        url: baseUrl,
        logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.svg`,
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
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 2: LocalBusiness (for local search)
    // ═══════════════════════════════════════════════════════════════
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': `${baseUrl}/#localbusiness`,
        name: locale === 'ar' ? 'مصنع ازافكو للأسماك' : 'AZAFCO Fish Processing Factory',
        alternateName: 'AZAFCO Fish Factory',
        image: schemaImage,
        url: baseUrl,
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
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 3: WebSite (for sitelinks in search)
    // ═══════════════════════════════════════════════════════════════
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: locale === 'ar' ? 'ازافكو العالمية - AZAFCO International' : 'AZAFCO International - Egyptian Fish Exporter',
        alternateName: ['ازافكو', 'AZAFCO', 'Azafco Egypt', 'AZAFCO Fish'],
        url: baseUrl,
        description: locale === 'ar'
            ? 'الموقع الرسمي لشركة ازافكو العالمية - تصدير الأسماك الطازجة من مصر'
            : 'Official website of AZAFCO International - Premium fresh fish exporter from Egypt to worldwide markets',
        inLanguage: ['ar', 'en', 'es', 'ru'],
        publisher: {
            '@id': `${baseUrl}/#organization`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 4: FAQPage (for rich snippets)
    // ═══════════════════════════════════════════════════════════════
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
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 5: BreadcrumbList (for navigation)
    // ═══════════════════════════════════════════════════════════════
    const getBreadcrumbItems = () => {
        const items = [
            {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'ar' ? 'الرئيسية' : 'Home',
                item: baseUrl
            }
        ];

        const pageNames: Record<string, { ar: string; en: string }> = {
            products: { ar: 'المنتجات', en: 'Products' },
            about: { ar: 'من نحن', en: 'About Us' },
            contact: { ar: 'اتصل بنا', en: 'Contact' },
            markets: { ar: 'الأسواق', en: 'Markets' },
            media: { ar: 'الوسائط', en: 'Media' },
            certificates: { ar: 'الشهادات', en: 'Certificates' }
        };

        if (pageType !== 'home' && pageNames[pageType]) {
            items.push({
                '@type': 'ListItem',
                position: 2,
                name: locale === 'ar' ? pageNames[pageType].ar : pageNames[pageType].en,
                item: currentUrl
            });
        }

        return items;
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: getBreadcrumbItems()
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 6: SpeakableSpecification (for voice search)
    // ═══════════════════════════════════════════════════════════════
    const speakableSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': currentUrl,
        name: locale === 'ar'
            ? 'ازافكو العالمية - تصدير الأسماك الطازجة'
            : 'AZAFCO International - Fresh Fish Export',
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'h2', '.section-title', '.company-description', '.hero-text']
        },
        mainEntity: {
            '@id': `${baseUrl}/#organization`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 7: ProductGroup (for B2B product visibility)
    // ═══════════════════════════════════════════════════════════════
    const productGroupSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ProductGroup',
        '@id': `${baseUrl}/products#productgroup`,
        name: locale === 'ar' ? 'أسماك ازافكو الطازجة' : 'AZAFCO Fresh Fish Products',
        description: locale === 'ar'
            ? 'منتجات الأسماك الطازجة من ازافكو للتصدير - بلطي، قاروص، بوري'
            : 'Premium fresh fish products from AZAFCO for export - Tilapia, Sea Bass, Mullet',
        brand: {
            '@type': 'Brand',
            name: 'AZAFCO',
            logo: `${baseUrl}/images/logo.svg`
        },
        manufacturer: {
            '@id': `${baseUrl}/#organization`
        },
        productGroupID: 'fresh-fish',
        hasVariant: products.map(product => ({
            '@type': 'Product',
            name: locale === 'ar' ? product.name : product.nameEn,
            description: locale === 'ar' ? product.description : product.descriptionEn,
            image: `${baseUrl}${product.image}`,
            category: product.category === 'river'
                ? (locale === 'ar' ? 'أسماك مياه عذبة' : 'Freshwater Fish')
                : (locale === 'ar' ? 'أسماك بحرية' : 'Saltwater Fish'),
            brand: {
                '@type': 'Brand',
                name: 'AZAFCO'
            }
        }))
    } : null;

    // Product Catalog Schema (for products page)
    const productCatalogSchema = products ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${baseUrl}/products#catalog`,
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
            image: `${baseUrl}${product.image}`,
            url: `${baseUrl}/${locale}/products`
        }))
    } : null;

    // Build schemas array
    const schemas = [
        organizationSchema,
        localBusinessSchema,
        websiteSchema,
        faqSchema,
        breadcrumbSchema,
        speakableSchema,
        ...(productGroupSchema ? [productGroupSchema] : []),
        ...(productCatalogSchema ? [productCatalogSchema] : [])
    ];

    return (
        <>
            {schemas.map((schema, index) => (
                <Script
                    key={`structured-data-${index}`}
                    id={`structured-data-${index}`}
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
};

export default StructuredData;
