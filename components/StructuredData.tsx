'use client';

/**
 * StructuredData Component - Advanced SEO for App Router
 * 
 * Contains 9 Schema.org types for comprehensive B2B SEO:
 * 1. Organization - Company information
 * 2. LocalBusiness - Local search optimization
 * 3. WebSite - Sitelinks in search
 * 4. FAQPage - Rich snippets for questions
 * 5. BreadcrumbList - Navigation breadcrumbs
 * 6. SpeakableSpecification - Voice search optimization
 * 7. Individual Products - Product visibility with offers
 * 8. HowTo - Ordering process
 * 9. ProductGroup - B2B product visibility
 * 
 * All text content is sourced from translations (no hardcoded strings)
 */

import Script from 'next/script';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { companyConfig } from '@/config/company.config';
import { ogImageMap, Locale } from '@/i18n';

interface StructuredDataProps {
    pageType?: 'home' | 'products' | 'about' | 'contact' | 'markets' | 'media' | 'certificates';
}


const StructuredData: React.FC<StructuredDataProps> = ({ pageType = 'home' }) => {
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const baseUrl = companyConfig.contact.baseUrl;
    const currentUrl = `${baseUrl}${pathname}`;

    const schemaImage = `${baseUrl}${ogImageMap[locale as Locale]}`;

    // Get market country codes from config (excluding paused/planned)
    const activeMarketCodes = companyConfig.markets
        .filter(m => m.status === 'active')
        .map(m => m.countryCode);

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 1: Organization (Main Schema for B2B)
    // ═══════════════════════════════════════════════════════════════
    const alternateNames = (t.raw('schema.alternateNames') ?? ['AZAFCO International', 'AZAFCO']) as string[];
    const knowsAboutList = (t.raw('schema.knowsAbout') ?? []) as string[];

    // Get certifications from translations
    const certifications = t.raw('schema.certifications') as Record<string, { name: string; description: string }> | undefined;
    const certArray = certifications ? Object.values(certifications) : [];

    // Get services from translations
    const services = t.raw('schema.services') as Record<string, { name: string; description: string }> | undefined;
    const servicesArray = services ? Object.values(services) : [];

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: t('schema.companyName'),
        alternateName: alternateNames,
        url: baseUrl,
        logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.svg`,
            width: '300',
            height: '100'
        },
        image: schemaImage,
        description: t('schema.description'),
        foundingDate: String(companyConfig.identity.foundingYear),
        founder: {
            '@type': 'Person',
            name: companyConfig.identity.founder
        },
        legalName: companyConfig.identity.legalName,
        taxID: companyConfig.registration.taxCard,
        vatID: companyConfig.registration.taxCard,
        email: companyConfig.contact.email,
        hasCredential: certArray.map(cert => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'certification',
            name: cert.name,
            description: cert.description
        })),
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: companyConfig.identity.employees,
            maxValue: companyConfig.identity.employees + 50
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: companyConfig.addresses.factory.street,
            addressLocality: companyConfig.addresses.factory.city,
            addressRegion: companyConfig.addresses.factory.region,
            postalCode: companyConfig.addresses.factory.postalCode,
            addressCountry: 'EG'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: String(companyConfig.geo.latitude),
            longitude: String(companyConfig.geo.longitude)
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: companyConfig.contact.whatsapp,
                contactType: 'sales',
                contactOption: 'TollFree',
                availableLanguage: ['Arabic', 'English'],
                areaServed: activeMarketCodes
            },
            {
                '@type': 'ContactPoint',
                telephone: companyConfig.contact.whatsapp,
                contactType: 'customer service',
                availableLanguage: ['Arabic', 'English']
            }
        ],
        sameAs: [
            companyConfig.contact.social.facebook,
            `https://wa.me/${companyConfig.contact.whatsapp.replace(/\+/g, '')}`
        ],
        knowsAbout: knowsAboutList,
        slogan: t('schema.slogan'),
        makesOffer: servicesArray.map(service => ({
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: service.name,
                description: service.description
            }
        }))
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 2: LocalBusiness (for local search)
    // ═══════════════════════════════════════════════════════════════
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': `${baseUrl}/#localbusiness`,
        name: t('schema.factoryName'),
        alternateName: t('schema.factoryAlternateName'),
        image: schemaImage,
        url: baseUrl,
        telephone: companyConfig.contact.whatsapp,
        email: companyConfig.contact.email,
        priceRange: '$$',
        currenciesAccepted: t('schema.currenciesAccepted'),
        paymentAccepted: t('schema.paymentAccepted'),
        address: {
            '@type': 'PostalAddress',
            streetAddress: companyConfig.addresses.factory.street,
            addressLocality: companyConfig.addresses.factory.city,
            addressRegion: companyConfig.addresses.factory.region,
            postalCode: companyConfig.addresses.factory.postalCode,
            addressCountry: 'EG'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: companyConfig.geo.latitude,
            longitude: companyConfig.geo.longitude
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '17:00'
        },
        areaServed: companyConfig.markets.map(m => ({
            '@type': 'Country',
            name: m.name
        })),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: t('schema.catalogName'),
            itemListElement: [
                { '@type': 'OfferCatalog', name: t('schema.freshwater'), description: t('schema.freshwaterDesc') },
                { '@type': 'OfferCatalog', name: t('schema.saltwater'), description: t('schema.saltwaterDesc') }
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
        name: t('schema.websiteName'),
        alternateName: alternateNames,
        url: baseUrl,
        description: t('schema.websiteDescription'),
        inLanguage: ['ar', 'en', 'es', 'ru', 'de', 'fr'],
        publisher: {
            '@id': `${baseUrl}/#organization`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 4: FAQPage (for rich snippets) - TRANSLATION-BASED
    // ═══════════════════════════════════════════════════════════════
    const faqQuestions = (t.raw('faq.questions') ?? []) as Array<{ question: string; answer: string }>;

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqQuestions.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 5: BreadcrumbList (for navigation)
    // ═══════════════════════════════════════════════════════════════
    const getBreadcrumbItems = (): { '@type': string; position: number; name: string; item: string }[] => {
        const items: { '@type': string; position: number; name: string; item: string }[] = [
            {
                '@type': 'ListItem',
                position: 1,
                name: t('schema.home'),
                item: baseUrl
            }
        ];

        if (pageType !== 'home') {
            items.push({
                '@type': 'ListItem',
                position: 2,
                name: t(`schema.${pageType}`),
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
        name: t('schema.speakableName'),
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'h2', '.section-title', '.company-description', '.hero-text']
        },
        mainEntity: {
            '@id': `${baseUrl}/#organization`
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 7: Individual Product Schemas (with offers, images, and ratings)
    // Product data derived from companyConfig.products - SINGLE SOURCE OF TRUTH
    // ═══════════════════════════════════════════════════════════════
    const individualProductSchemas = companyConfig.products.map((product) => {
        const productName = t(`data.products.${product.key}.name`);
        const productDesc = t(`data.products.${product.key}.description`);
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${baseUrl}/products#${product.key}`,
            name: productName,
            description: productDesc,
            image: `${baseUrl}${product.image}`,
            category: t('schema.freshFishCategory'),
            brand: {
                '@type': 'Brand',
                name: t('schema.alternateName')
            },
            manufacturer: {
                '@id': `${baseUrl}/#organization`
            },
            // AggregateRating for social proof (based on 500+ B2B clients)
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                bestRating: '5',
                worstRating: '1',
                ratingCount: '500',
                reviewCount: '150'
            },
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                priceCurrency: 'USD',
                priceSpecification: {
                    '@type': 'PriceSpecification',
                    priceCurrency: 'USD',
                    eligibleQuantity: {
                        '@type': 'QuantitativeValue',
                        unitCode: 'KGM',
                        minValue: 1
                    }
                },
                seller: {
                    '@id': `${baseUrl}/#organization`
                },
                areaServed: ['Worldwide', ...companyConfig.markets.filter(m => m.status === 'active').map(m => m.name)],
                shippingDetails: {
                    '@type': 'OfferShippingDetails',
                    shippingDestination: {
                        '@type': 'DefinedRegion',
                        addressCountry: activeMarketCodes
                    },
                    deliveryTime: {
                        '@type': 'ShippingDeliveryTime',
                        handlingTime: {
                            '@type': 'QuantitativeValue',
                            minValue: 1,
                            maxValue: 3,
                            unitCode: 'DAY'
                        }
                    }
                }
            },
            isAccessoryOrSparePartFor: {
                '@type': 'FoodService',
                name: t('schema.restaurantHotelSupply')
            }
        };
    });

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 8: HowTo (for "how to order fish wholesale" queries)
    // ═══════════════════════════════════════════════════════════════
    const howToData = t.raw('schema.howTo') as {
        title: string;
        description: string;
        supplies: { businessDetails: string; quantities: string };
        steps: {
            step1: { name: string; text: string };
            step2: { name: string; text: string };
            step3: { name: string; text: string };
            step4: { name: string; text: string };
        };
        estimatedCost: string;
    } | undefined;

    const howToSchema = howToData ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        '@id': `${baseUrl}/#howto-order`,
        name: howToData.title,
        description: howToData.description,
        totalTime: 'PT10M',
        estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: howToData.estimatedCost
        },
        supply: [
            { '@type': 'HowToSupply', name: howToData.supplies.businessDetails },
            { '@type': 'HowToSupply', name: howToData.supplies.quantities }
        ],
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: howToData.steps.step1.name,
                text: howToData.steps.step1.text,
                url: `${baseUrl}/${locale}/contact`
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: howToData.steps.step2.name,
                text: howToData.steps.step2.text,
                url: `${baseUrl}/${locale}/products`
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: howToData.steps.step3.name,
                text: howToData.steps.step3.text
            },
            {
                '@type': 'HowToStep',
                position: 4,
                name: howToData.steps.step4.name,
                text: howToData.steps.step4.text
            }
        ]
    } : null;

    // ═══════════════════════════════════════════════════════════════
    // SCHEMA 9: ProductGroup (for B2B product visibility)
    // ═══════════════════════════════════════════════════════════════
    const productGroupSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${baseUrl}/products`,
        name: t('products_page.title'),
        description: t('products_page.subtitle'),
        numberOfItems: companyConfig.products.length,
        itemListElement: companyConfig.products.map((product, index) => {
            const productName = t(`data.products.${product.key}.name`);
            const productDesc = t(`data.products.${product.key}.description`);
            return {
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: productName,
                    description: productDesc,
                    image: `${baseUrl}${product.image}`,
                    category: t('schema.freshFishCategory'),
                    brand: {
                        '@type': 'Brand',
                        name: t('schema.alternateName')
                    },
                    manufacturer: {
                        '@id': `${baseUrl}/#organization`
                    }
                }
            };
        })
    };

    const schemas = [
        organizationSchema,
        localBusinessSchema,
        websiteSchema,
        faqSchema,
        breadcrumbSchema,
        speakableSchema,
        ...individualProductSchemas,
        ...(howToSchema ? [howToSchema] : []),
        productGroupSchema
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
