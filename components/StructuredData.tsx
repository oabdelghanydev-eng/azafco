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
    `.replace(/\s+/g, ' ').trim(),
    de: `
        AZAFCO, AZAFCO International, ägyptischer Fischexporteur, Frischfischlieferant Ägypten,
        Tilapia-Lieferant, Tilapia-Export Ägypten, Nil-Tilapia Großhandel,
        Wolfsbarsch-Lieferant, ägyptischer Wolfsbarsch, Frischfisch-Export Wolfsbarsch,
        Meeräsche-Lieferant, frische Meeräsche Ägypten, Bouri-Fisch-Export,
        B2B Meeresfrüchte-Lieferant, Fisch Großhandel Ägypten, Fischbestellung in großen Mengen,
        Golf-Fischimport, Nahost-Fischlieferant, Fischexport VAE, Fischexport Saudi-Arabien,
        Fischexport Katar, Fischexport Kuwait, Fischexport Bahrain, Fischexport Jordanien,
        Frischfischverpackung, Tiefkühlfisch Ägypten, Meeresfrüchte-Distributor Ägypten,
        ägyptisches Meeresfrüchte-Unternehmen, Kafr El Sheikh Fisch, Nil-Fisch-Export,
        Wels-Lieferant Ägypten, Süßwasserfisch-Export, Salzwasserfisch Ägypten,
        Fischverarbeitung Ägypten, HACCP-zertifizierter Fisch, ISO-zertifizierte Meeresfrüchte,
        kommerzieller Fischlieferant, Restaurant-Fischlieferant, Hotel-Fischlieferant,
        Fisch-Großhandelspreis, Tilapia in großen Mengen, Wolfsbarsch in großen Mengen, Meeräsche in großen Mengen,
        afrikanische Tilapia, mediterraner Wolfsbarsch, Rotmeerfisch
    `.replace(/\s+/g, ' ').trim(),
    fr: `
        AZAFCO, AZAFCO International, exportateur de poisson égyptien, fournisseur de poisson frais Égypte,
        fournisseur de tilapia, exportation de tilapia Égypte, tilapia du Nil en gros,
        fournisseur de bar, bar égyptien, exportation de bar frais,
        fournisseur de mulet, mulet frais Égypte, exportation de poisson bouri,
        fournisseur de fruits de mer B2B, poisson en gros Égypte, commande de poisson en vrac,
        importation de poisson du Golfe, fournisseur de poisson Moyen-Orient, exportation de poisson EAU, exportation de poisson Arabie Saoudite,
        exportation de poisson Qatar, exportation de poisson Koweït, exportation de poisson Bahreïn, exportation de poisson Jordanie,
        emballage de poisson frais, poisson congelé Égypte, distributeur de fruits de mer Égypte,
        entreprise de fruits de mer égyptienne, poisson Kafr El Sheikh, exportation de poisson du Nil,
        fournisseur de poisson-chat Égypte, exportation de poisson d'eau douce, poisson d'eau salée Égypte,
        transformation de poisson Égypte, poisson certifié HACCP, fruits de mer certifiés ISO,
        fournisseur de poisson commercial, fournisseur de poisson pour restaurants, fournisseur de poisson pour hôtels,
        prix de poisson en gros, tilapia en vrac, bar en vrac, mulet en vrac,
        tilapia africain, bar méditerranéen, poisson de la mer Rouge
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
    // Multilingual Translations for Schema.org (All 6 Languages)
    // ═══════════════════════════════════════════════════════════════
    const i18n: Record<string, Record<string, string>> = {
        companyName: {
            ar: 'ازافكو العالمية للإستثمار والتنمية',
            en: 'AZAFCO International Investment & Development',
            es: 'AZAFCO International Inversión y Desarrollo',
            ru: 'AZAFCO International Инвестиции и Развитие',
            de: 'AZAFCO International Investition & Entwicklung',
            fr: 'AZAFCO International Investissement & Développement'
        },
        description: {
            ar: 'شركة مصرية رائدة متخصصة في تعبئة وتصدير الأسماك الطازجة لأكثر من 15 دولة منذ عام 2008.',
            en: 'Leading Egyptian company specialized in fresh fish packaging and export to worldwide markets since 2008. Serving distributors, restaurants, and hotels with premium quality seafood.',
            es: 'Empresa egipcia líder especializada en empaque y exportación de pescado fresco a mercados mundiales desde 2008.',
            ru: 'Ведущая египетская компания, специализирующаяся на упаковке и экспорте свежей рыбы на мировые рынки с 2008 года.',
            de: 'Führendes ägyptisches Unternehmen spezialisiert auf Verpackung und Export von Frischfisch seit 2008.',
            fr: 'Entreprise égyptienne leader spécialisée dans l\'emballage et l\'exportation de poisson frais vers les marchés mondiaux depuis 2008.'
        },
        slogan: {
            ar: 'أسماك طازجة فاخرة من مصر إلى العالم',
            en: 'Premium Fresh Fish from Egypt to the World',
            es: 'Pescado Fresco Premium de Egipto al Mundo',
            ru: 'Премиальная свежая рыба из Египта во весь мир',
            de: 'Premium Frischfisch aus Ägypten in die Welt',
            fr: 'Poisson Frais Premium d\'Égypte vers le Monde'
        },
        factoryName: {
            ar: 'مصنع ازافكو للأسماك',
            en: 'AZAFCO Fish Processing Factory',
            es: 'Fábrica de Procesamiento de Pescado AZAFCO',
            ru: 'Рыбоперерабатывающий завод AZAFCO',
            de: 'AZAFCO Fischverarbeitungsfabrik',
            fr: 'Usine de Traitement de Poisson AZAFCO'
        },
        websiteName: {
            ar: 'ازافكو العالمية - AZAFCO International',
            en: 'AZAFCO International - Egyptian Fish Exporter',
            es: 'AZAFCO International - Exportador de Pescado Egipcio',
            ru: 'AZAFCO International - Египетский экспортёр рыбы',
            de: 'AZAFCO International - Ägyptischer Fischexporteur',
            fr: 'AZAFCO International - Exportateur de Poisson Égyptien'
        },
        websiteDescription: {
            ar: 'الموقع الرسمي لشركة ازافكو العالمية - تصدير الأسماك الطازجة من مصر',
            en: 'Official website of AZAFCO International - Premium fresh fish exporter from Egypt to worldwide markets',
            es: 'Sitio web oficial de AZAFCO International - Exportador premium de pescado fresco de Egipto',
            ru: 'Официальный сайт AZAFCO International - Премиум экспортёр свежей рыбы из Египта',
            de: 'Offizielle Website von AZAFCO International - Premium Frischfischexporteur aus Ägypten',
            fr: 'Site officiel d\'AZAFCO International - Exportateur premium de poisson frais d\'Égypte'
        },
        productGroupName: {
            ar: 'أسماك ازافكو الطازجة',
            en: 'AZAFCO Fresh Fish Products',
            es: 'Productos de Pescado Fresco AZAFCO',
            ru: 'Свежая рыба AZAFCO',
            de: 'AZAFCO Frischfischprodukte',
            fr: 'Produits de Poisson Frais AZAFCO'
        },
        productGroupDesc: {
            ar: 'منتجات الأسماك الطازجة من ازافكو للتصدير - بلطي، قاروص، بوري',
            en: 'Premium fresh fish products from AZAFCO for export - Tilapia, Sea Bass, Mullet',
            es: 'Productos de pescado fresco premium de AZAFCO para exportación - Tilapia, Lubina, Mújol',
            ru: 'Премиальные продукты свежей рыбы от AZAFCO на экспорт - Тилапия, Морской окунь, Кефаль',
            de: 'Premium Frischfischprodukte von AZAFCO für Export - Tilapia, Wolfsbarsch, Meeräsche',
            fr: 'Produits de poisson frais premium d\'AZAFCO pour l\'exportation - Tilapia, Bar, Mulet'
        },
        catalogName: {
            ar: 'كتالوج منتجات ازافكو',
            en: 'AZAFCO Fresh Fish Products Catalog',
            es: 'Catálogo de Productos de Pescado Fresco AZAFCO',
            ru: 'Каталог продукции свежей рыбы AZAFCO',
            de: 'AZAFCO Frischfischprodukte Katalog',
            fr: 'Catalogue des Produits de Poisson Frais AZAFCO'
        },
        catalogDesc: {
            ar: 'تشكيلة متكاملة من الأسماك الطازجة للتصدير',
            en: 'Complete range of premium fresh fish for export from Egypt',
            es: 'Gama completa de pescado fresco premium para exportación desde Egipto',
            ru: 'Полный ассортимент премиальной свежей рыбы на экспорт из Египта',
            de: 'Komplettes Sortiment an Premium-Frischfisch für den Export aus Ägypten',
            fr: 'Gamme complète de poisson frais premium pour l\'exportation d\'Égypte'
        },
        offerDesc: {
            ar: 'اتصل بنا للحصول على عرض سعر بالجملة',
            en: 'Contact us for wholesale B2B pricing',
            es: 'Contáctenos para precios mayoristas B2B',
            ru: 'Свяжитесь с нами для оптовых B2B цен',
            de: 'Kontaktieren Sie uns für Großhandels-B2B-Preise',
            fr: 'Contactez-nous pour les prix de gros B2B'
        },
        freshwater: {
            ar: 'أسماك مياه عذبة',
            en: 'Freshwater Fish',
            es: 'Pescado de Agua Dulce',
            ru: 'Пресноводная рыба',
            de: 'Süßwasserfisch',
            fr: 'Poisson d\'Eau Douce'
        },
        saltwater: {
            ar: 'أسماك بحرية',
            en: 'Saltwater Fish',
            es: 'Pescado de Agua Salada',
            ru: 'Морская рыба',
            de: 'Salzwasserfisch',
            fr: 'Poisson d\'Eau Salée'
        },
        home: { ar: 'الرئيسية', en: 'Home', es: 'Inicio', ru: 'Главная', de: 'Startseite', fr: 'Accueil' },
        products: { ar: 'المنتجات', en: 'Products', es: 'Productos', ru: 'Продукты', de: 'Produkte', fr: 'Produits' },
        about: { ar: 'من نحن', en: 'About Us', es: 'Sobre Nosotros', ru: 'О нас', de: 'Über uns', fr: 'À propos' },
        contact: { ar: 'اتصل بنا', en: 'Contact', es: 'Contacto', ru: 'Контакты', de: 'Kontakt', fr: 'Contact' },
        markets: { ar: 'الأسواق', en: 'Markets', es: 'Mercados', ru: 'Рынки', de: 'Märkte', fr: 'Marchés' },
        media: { ar: 'الوسائط', en: 'Media', es: 'Medios', ru: 'Медиа', de: 'Medien', fr: 'Médias' },
        certificates: { ar: 'الشهادات', en: 'Certificates', es: 'Certificados', ru: 'Сертификаты', de: 'Zertifikate', fr: 'Certificats' }
    };

    // Helper function to get translation
    const t = (key: string): string => i18n[key]?.[locale] || i18n[key]?.en || '';

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 1: Organization (Main Schema for B2B)
    // ═══════════════════════════════════════════════════════════════
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: t('companyName'),
        alternateName: ['AZAFCO International', 'AZAFCO', 'ازافكو', 'Azafco Egypt'],
        url: baseUrl,
        logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.svg`,
            width: '300',
            height: '100'
        },
        image: schemaImage,
        description: t('description'),
        foundingDate: '2008',
        founder: {
            '@type': 'Person',
            name: 'AZAFCO Founder'
        },
        // 2025 B2B Properties
        legalName: 'AZAFCO International Investment & Development',
        taxID: '537-340-483',
        vatID: '537-340-483',
        email: 'business@azafco.com.eg',
        hasCredential: [
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: 'ISO 22000:2018',
                description: 'Food Safety Management System'
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: 'HACCP',
                description: 'Hazard Analysis Critical Control Points'
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: 'ISO 9001:2015',
                description: 'Quality Management System'
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: 'ISO 14001:2015',
                description: 'Environmental Management System'
            },
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'certification',
                name: 'ISO 45001:2018',
                description: 'Occupational Health and Safety'
            }
        ],
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
        slogan: t('slogan'),
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
        name: t('factoryName'),
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
        name: t('websiteName'),
        alternateName: ['ازافكو', 'AZAFCO', 'Azafco Egypt', 'AZAFCO Fish'],
        url: baseUrl,
        description: t('websiteDescription'),
        inLanguage: ['ar', 'en', 'es', 'ru', 'de', 'fr'],
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
                name: t('home'),
                item: baseUrl
            }
        ];

        if (pageType !== 'home') {
            items.push({
                '@type': 'ListItem',
                position: 2,
                name: t(pageType),
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
        name: t('productGroupName'),
        description: t('productGroupDesc'),
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
            category: product.category === 'river' ? t('freshwater') : t('saltwater'),
            brand: {
                '@type': 'Brand',
                name: 'AZAFCO'
            },
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                // B2B Indicators (2025 Best Practice)
                businessFunction: 'http://purl.org/goodrelations/v1#Sell',
                eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
                priceCurrency: 'USD',
                price: '0',
                priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                seller: {
                    '@type': 'Organization',
                    name: 'AZAFCO International'
                },
                url: `${baseUrl}/${locale}/contact`,
                description: t('offerDesc')
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

    // Build schemas array (ProductGroup removed - not suitable for B2B without fixed prices)
    const schemas = [
        organizationSchema,
        localBusinessSchema,
        websiteSchema,
        faqSchema,
        breadcrumbSchema,
        speakableSchema,
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
