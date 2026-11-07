/**
 * StructuredData - Server-rendered JSON-LD for App Router
 *
 * Rendered on the server so crawlers see it in the initial HTML.
 * Each schema is only emitted on the page it describes:
 * - StructuredData (layout, every page): Organization, WebSite
 * - PageStructuredData (per page):
 *   - home / contact: LocalBusiness
 *   - products: ItemList of products
 *   - inner pages: BreadcrumbList
 *
 * All text content is sourced from translations (no hardcoded strings)
 */

import { getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { ogImageMap, Locale } from '@/i18n';

type PageType = 'home' | 'products' | 'about' | 'contact' | 'markets' | 'media' | 'certificates';

const baseUrl = companyConfig.contact.baseUrl;

function JsonLd({ schemas }: { schemas: object[] }) {
    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}

const factoryAddress = {
    '@type': 'PostalAddress',
    streetAddress: companyConfig.addresses.factory.street,
    addressLocality: companyConfig.addresses.factory.city,
    addressRegion: companyConfig.addresses.factory.region,
    postalCode: companyConfig.addresses.factory.postalCode,
    addressCountry: 'EG'
};

const activeMarketCodes = companyConfig.markets
    .filter(m => m.status === 'active')
    .map(m => m.countryCode);

// ═══════════════════════════════════════════════════════════════
// SITE-WIDE: Organization + WebSite
// ═══════════════════════════════════════════════════════════════
export default async function StructuredData({ locale }: { locale: string }) {
    const t = await getTranslations({ locale });
    const schemaImage = `${baseUrl}${ogImageMap[locale as Locale]}`;

    const alternateNames = (t.raw('schema.alternateNames') ?? ['AZAFCO International', 'AZAFCO']) as string[];
    const knowsAboutList = (t.raw('schema.knowsAbout') ?? []) as string[];
    const services = t.raw('schema.services') as Record<string, { name: string; description: string }> | undefined;

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
        // No hasCredential / numberOfEmployees: certificates and headcount are not
        // verified yet (site v2 review). Re-add only from verified data.
        address: factoryAddress,
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: companyConfig.contact.whatsapp,
                contactType: 'sales',
                availableLanguage: ['Arabic', 'English'],
                areaServed: activeMarketCodes
            }
        ],
        sameAs: [companyConfig.contact.social.facebook],
        knowsAbout: knowsAboutList,
        slogan: t('schema.slogan'),
        makesOffer: Object.values(services ?? {}).map(service => ({
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: service.name,
                description: service.description
            }
        }))
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: t('schema.websiteName'),
        alternateName: alternateNames,
        url: baseUrl,
        description: t('schema.websiteDescription'),
        inLanguage: locale,
        publisher: {
            '@id': `${baseUrl}/#organization`
        }
    };

    return <JsonLd schemas={[organizationSchema, websiteSchema]} />;
}

// ═══════════════════════════════════════════════════════════════
// PER-PAGE: LocalBusiness, product list, breadcrumbs
// ═══════════════════════════════════════════════════════════════
export async function PageStructuredData({ locale, pageType }: { locale: string; pageType: PageType }) {
    const t = await getTranslations({ locale });
    const localeUrl = `${baseUrl}/${locale}`;
    const pageUrl = pageType === 'home' ? localeUrl : `${localeUrl}/${pageType}`;
    const schemas: object[] = [];

    if (pageType === 'home' || pageType === 'contact') {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${baseUrl}/#localbusiness`,
            name: t('schema.factoryName'),
            alternateName: t('schema.factoryAlternateName'),
            image: `${baseUrl}${ogImageMap[locale as Locale]}`,
            url: localeUrl,
            telephone: companyConfig.contact.whatsapp,
            email: companyConfig.contact.email,
            parentOrganization: { '@id': `${baseUrl}/#organization` },
            address: factoryAddress,
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
            areaServed: companyConfig.markets
                .filter(m => m.status === 'active')
                .map(m => ({ '@type': 'Country', name: m.name }))
        });
    }

    if (pageType === 'products') {
        // No offers/ratings until species pages carry real specs (Phase 3)
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${pageUrl}#products`,
            name: t('products_page.title'),
            numberOfItems: companyConfig.products.length,
            itemListElement: companyConfig.products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: t(`data.products.${product.key}.name`),
                    description: t(`data.products.${product.key}.description`),
                    image: `${baseUrl}${product.image}`,
                    category: t('schema.freshFishCategory'),
                    brand: { '@type': 'Brand', name: t('schema.alternateName') },
                    manufacturer: { '@id': `${baseUrl}/#organization` }
                }
            }))
        });
    }

    if (pageType !== 'home') {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: t('schema.home'), item: localeUrl },
                { '@type': 'ListItem', position: 2, name: t(`schema.${pageType}`), item: pageUrl }
            ]
        });
    }

    return <JsonLd schemas={schemas} />;
}
