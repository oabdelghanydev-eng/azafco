/**
 * StructuredData - Server-rendered JSON-LD for App Router
 *
 * Rendered on the server so crawlers see it in the initial HTML.
 * Each schema is only emitted on the page it describes:
 * - StructuredData (layout, every page): Organization, WebSite
 * - PageStructuredData (per page):
 *   - home / contact: LocalBusiness (the Motobas processing plant)
 *   - inner pages (about / contact / markets): BreadcrumbList
 *   The products page and species pages emit their own ItemList / Product.
 *
 * All text content is sourced from translations (schema.*, no hardcoded strings).
 * Approved facts only (docs/team/web/g/RELEASE-DECISIONS.md):
 * - 12 main species = data/products.ts `products` (eel is excluded there)
 * - certificates = the three ISO standards; TÜV AUSTRIA named once (recognizedBy), no numbers
 * - identity = legal name, commercial register and tax card (the same numbers shown on /contact and in the footer)
 * - founder is emitted only when schema.founder exists (removed until the owner confirms the spelling)
 * - markets = active markets from companyConfig (7), no price, no MOQ, no reply time
 * - no offers or prices: no hasOfferCatalog, makesOffer or priceRange (prices are confirmed per order)
 * - Organization and WebSite `name` = companyConfig.identity.tradeName (English) in every locale,
 *   so the shared @id nodes agree; the localized name goes into alternateName
 */

import { getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { ogImageMap, Locale } from '@/i18n';
import { routes } from '@/lib/v2/routes';

type PageType = 'home' | 'about' | 'contact' | 'markets';

const baseUrl = companyConfig.contact.baseUrl;

/**
 * Motobas processing plant (RELEASE-DECISIONS §4, same point as the factory map
 * embed in data/company.ts). TODO(lead): move to companyConfig.addresses.factory.geo.
 * The office coordinates (companyConfig.geo) are not emitted.
 */
const FACTORY_GEO = { latitude: 31.433264, longitude: 30.475957 } as const;
const FACTORY_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${FACTORY_GEO.latitude},${FACTORY_GEO.longitude}`;

/** Current identity logo (components/v2/Logo.tsx), 739 x 496. */
const LOGO = { path: '/brand/logo-primary.svg', width: 739, height: 496 } as const;

/** Visible breadcrumb label of each inner page (same text as the on-page breadcrumb). */
const BREADCRUMB_KEYS: Record<Exclude<PageType, 'home'>, { label: string; fallback: string; path: string }> = {
    about: { label: 'about_v2.breadcrumb', fallback: 'schema.about', path: routes.about },
    contact: { label: 'contact_v2.breadcrumb', fallback: 'schema.contact', path: routes.contact },
    markets: { label: 'markets_v2.breadcrumb', fallback: 'schema.markets', path: routes.markets },
};

/** Drops undefined / null / empty-string values and empty arrays (no empty fields in JSON-LD). */
function clean<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(clean).filter(v => v !== undefined && v !== null && v !== '') as unknown as T;
    }
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            const c = clean(v);
            if (c === undefined || c === null || c === '') continue;
            if (Array.isArray(c) && c.length === 0) continue;
            out[k] = c;
        }
        return out as T;
    }
    return value;
}

function JsonLd({ schemas }: { schemas: object[] }) {
    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    // Escape "<" so copy can never close the script tag
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(clean(schema)).replace(/</g, '\\u003c') }}
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

const activeMarkets = companyConfig.markets.filter(m => m.status === 'active');

/** Untyped root translator (keys below are built at runtime). */
type RootT = {
    (key: string, values?: Record<string, string | number>): string;
    raw(key: string): unknown;
    has(key: string): boolean;
};

async function rootT(locale: string): Promise<RootT> {
    return (await getTranslations({ locale })) as unknown as RootT;
}

/**
 * Message or undefined when the key is missing (es/ru/de/fr may lag behind ar/en
 * until translated); clean() then drops the field instead of emitting the key path.
 */
function opt(t: RootT, key: string): string | undefined {
    return t.has(key) ? t(key) : undefined;
}

/** Raw object/array from a translation key, or the fallback when missing. */
function rawOr<T>(t: RootT, key: string, fallback: T): T {
    if (!t.has(key)) return fallback;
    const v = t.raw(key);
    return v && typeof v === 'object' ? (v as T) : fallback;
}

/** String array from a translation key, or [] when missing. */
function rawStrings(t: RootT, key: string): string[] {
    if (!t.has(key)) return [];
    const v = t.raw(key);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : [];
}

/**
 * Active markets as schema.org Country nodes: localized name from data.markets
 * (English config name as fallback) plus the ISO 3166-1 code as identifier.
 */
function areaServedCountries(t: RootT) {
    return activeMarkets.map(m => ({
        '@type': 'Country',
        name: opt(t, `data.markets.${m.key}.country`) ?? m.name,
        identifier: m.countryCode
    }));
}

// ═══════════════════════════════════════════════════════════════
// SITE-WIDE: Organization + WebSite
// ═══════════════════════════════════════════════════════════════
export default async function StructuredData({ locale }: { locale: string }) {
    const t = await rootT(locale);
    const schemaImage = `${baseUrl}${ogImageMap[locale as Locale] ?? ogImageMap.en}`;

    // English brand name in every locale (one entity, one name); the localized name
    // (AR ازافكو العالمية) is listed as an alternate name instead.
    const brandName = companyConfig.identity.tradeName;
    const localizedName = opt(t, 'schema.companyName');
    const alternateNames = Array.from(
        new Set([...(localizedName && localizedName !== brandName ? [localizedName] : []), ...rawStrings(t, 'schema.alternateNames')])
    ).filter(n => n !== brandName);
    const credentials = rawOr<{ name: string; description: string }[]>(t, 'schema.credentials', []);
    const certificationBody = opt(t, 'schema.certificationBody');
    const founderName = opt(t, 'schema.founder');
    const commercialRegister = companyConfig.registration.commercialRegister;

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: brandName,
        legalName: opt(t, 'schema.legalName') ?? companyConfig.identity.legalName,
        alternateName: alternateNames,
        url: baseUrl,
        logo: {
            '@type': 'ImageObject',
            '@id': `${baseUrl}/#logo`,
            url: `${baseUrl}${LOGO.path}`,
            contentUrl: `${baseUrl}${LOGO.path}`,
            width: LOGO.width,
            height: LOGO.height,
            caption: t('schema.companyName')
        },
        image: schemaImage,
        description: opt(t, 'schema.description'),
        slogan: opt(t, 'schema.slogan'),
        foundingDate: String(companyConfig.identity.foundingYear),
        founder: founderName ? { '@type': 'Person', name: founderName } : undefined,
        taxID: companyConfig.registration.taxCard,
        // Commercial register: the most checkable identity fact, also shown on /contact and in the footer
        identifier: commercialRegister
            ? [{ '@type': 'PropertyValue', propertyID: opt(t, 'schema.commercialRegisterLabel'), value: commercialRegister }]
            : undefined,
        email: companyConfig.contact.email,
        telephone: companyConfig.contact.phone,
        address: factoryAddress,
        // WhatsApp = management direct (fast deals); email = export team (details and documents)
        contactPoint: [
            {
                '@type': 'ContactPoint',
                name: opt(t, 'schema.contactManagement'),
                telephone: companyConfig.contact.whatsapp,
                url: companyConfig.contact.social.whatsapp,
                contactType: 'sales',
                availableLanguage: ['Arabic', 'English'],
                areaServed: activeMarkets.map(m => m.countryCode)
            },
            {
                '@type': 'ContactPoint',
                name: opt(t, 'schema.contactExport'),
                email: companyConfig.contact.email,
                // 'sales', not 'customer service': this is the channel for new buyers' details and documents
                contactType: 'sales',
                availableLanguage: ['Arabic', 'English'],
                areaServed: activeMarkets.map(m => m.countryCode)
            }
        ],
        areaServed: areaServedCountries(t),
        // Only real, owned profiles (companyConfig.contact.social). WhatsApp is a contact channel, not a profile.
        sameAs: [companyConfig.contact.social.facebook],
        knowsAbout: rawStrings(t, 'schema.knowsAbout'),
        // ISO 9001 / 14001 / 45001; the certification body appears once per credential as recognizedBy,
        // not in the descriptions. No certificate numbers, dates, site or scope.
        hasCredential: credentials.map(c => ({
            '@type': 'EducationalOccupationalCredential',
            name: c.name,
            description: c.description,
            credentialCategory: opt(t, 'schema.credentialCategory'),
            recognizedBy: certificationBody ? { '@type': 'Organization', name: certificationBody } : undefined
        }))
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: brandName,
        alternateName: alternateNames,
        url: baseUrl,
        description: opt(t, 'schema.websiteDescription'),
        inLanguage: locale,
        publisher: {
            '@id': `${baseUrl}/#organization`
        }
    };

    return <JsonLd schemas={[organizationSchema, websiteSchema]} />;
}

// ═══════════════════════════════════════════════════════════════
// PER-PAGE: LocalBusiness, breadcrumbs
// ═══════════════════════════════════════════════════════════════
export async function PageStructuredData({ locale, pageType }: { locale: string; pageType: PageType }) {
    const t = await rootT(locale);
    const localeUrl = `${baseUrl}/${locale}`;
    const schemas: object[] = [];

    if (pageType === 'home' || pageType === 'contact') {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${baseUrl}/#localbusiness`,
            name: t('schema.factoryName'),
            alternateName: opt(t, 'schema.factoryAlternateName'),
            description: opt(t, 'schema.factoryDescription'),
            image: `${baseUrl}${ogImageMap[locale as Locale] ?? ogImageMap.en}`,
            logo: { '@id': `${baseUrl}/#logo` },
            url: localeUrl,
            telephone: companyConfig.contact.whatsapp,
            email: companyConfig.contact.email,
            parentOrganization: { '@id': `${baseUrl}/#organization` },
            address: factoryAddress,
            geo: {
                '@type': 'GeoCoordinates',
                latitude: FACTORY_GEO.latitude,
                longitude: FACTORY_GEO.longitude
            },
            hasMap: FACTORY_MAP_URL,
            // Office hours (Cairo time), as stated on the contact page
            openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                opens: '08:00',
                closes: '17:00'
            },
            areaServed: areaServedCountries(t)
        });
    }

    if (pageType !== 'home') {
        const crumb = BREADCRUMB_KEYS[pageType];
        const homeLabel = t.has('v2.breadcrumbs.home') ? t('v2.breadcrumbs.home') : t('schema.home');
        const pageLabel = t.has(crumb.label) ? t(crumb.label) : t(crumb.fallback);
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: homeLabel, item: localeUrl },
                { '@type': 'ListItem', position: 2, name: pageLabel, item: `${localeUrl}${crumb.path}` }
            ]
        });
    }

    return <JsonLd schemas={schemas} />;
}
