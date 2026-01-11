/**
 * AZAFCO Company Configuration - SINGLE SOURCE OF TRUTH
 * 
 * This file contains all NON-TRANSLATABLE business data:
 * - Numbers, dates, rankings, URLs, computed values
 * 
 * Translations (labels, descriptions) are in: locales/[locale]/data/*.json
 * 
 * @see docs/COMPANY_PROFILE.md for full business context
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type MarketStatus = 'active' | 'paused' | 'planned';

export interface MarketConfig {
    /** Translation key - matches locales data markets.json keys */
    key: string;
    /** English display name for Schema.org */
    name: string;
    /** Business ranking (1 = largest) */
    rank: number;
    /** Monthly export volume in tons (null if not tracked) */
    volumeTons: number | null;
    /** Year started serving this market */
    since: number | null;
    /** Current market status */
    status: MarketStatus;
    /** ISO country code for flag */
    countryCode: string;
}

export interface CertificationConfig {
    code: string;
    name: string;
    description: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPANY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const companyConfig = {
    // ─────────────────────────────────────────────────────────────────────────
    // IDENTITY
    // ─────────────────────────────────────────────────────────────────────────
    identity: {
        legalName: 'AZAFCO International Investment & Development LLC',
        tradeName: 'AZAFCO International',
        foundingYear: 2008,
        founder: 'Haj Mohamed Abdullah Al-Kuwaitihi',
        employees: 300,
        industry: 'Fresh Fish Packaging & Export',
        businessType: 'B2B Wholesale Exporter',
        country: 'Egypt',
        region: 'Kafr El Sheikh Governorate',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // CONTACT (Non-translatable)
    // ─────────────────────────────────────────────────────────────────────────
    contact: {
        phone: '+201007736419',
        phoneDisplay: '+20-100-7736419',
        email: 'business@azafco.com.eg',
        whatsapp: '+201007736419',
        whatsappNumber: '201007736419',
        website: 'azafco.com.eg',
        baseUrl: 'https://azafco.com.eg',
        partnershipForm: 'https://forms.gle/rEYRPSP3vpW8Cggv5',
        social: {
            facebook: 'https://www.facebook.com/profile.php?id=100063620366349',
            whatsapp: 'https://wa.me/201007736419',
        },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ADDRESSES
    // ─────────────────────────────────────────────────────────────────────────
    addresses: {
        factory: {
            street: 'Industrial Zone, Number 120, Feed Sector',
            city: 'Motobas',
            region: 'Kafr El Sheikh',
            postalCode: '33511',
        },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // REGISTRATION (Official codes)
    // ─────────────────────────────────────────────────────────────────────────
    registration: {
        commercialRegister: '100776',
        taxCard: '537-340-483',
        euAuthorized: true,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // GEO COORDINATES & LOCATION
    // ─────────────────────────────────────────────────────────────────────────
    geo: {
        latitude: 31.2653,
        longitude: 30.9366,
        postalCode: '33511',
        region: 'EG-KFS',
        placename: 'Kafr El Sheikh, Egypt',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ANALYTICS & TRACKING (IDs only - scripts in layout.tsx)
    // ─────────────────────────────────────────────────────────────────────────
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-KKH7RD7SRV',
        clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || 'ujhz7pyrbs',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // BRANDING
    // ─────────────────────────────────────────────────────────────────────────
    branding: {
        themeColor: '#1e3a5f',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // MARKETS (Ordered by rank - Kuwait #1)
    // We export worldwide via air & land - these are our current active markets
    // ─────────────────────────────────────────────────────────────────────────
    markets: [
        { key: 'kuwait', name: 'Kuwait', rank: 1, volumeTons: 650, since: 2009, status: 'active', countryCode: 'KW' },
        { key: 'uae', name: 'United Arab Emirates', rank: 2, volumeTons: 400, since: 2008, status: 'active', countryCode: 'AE' },
        { key: 'qatar', name: 'Qatar', rank: 3, volumeTons: 350, since: 2024, status: 'active', countryCode: 'QA' },
        { key: 'iraq', name: 'Iraq', rank: 4, volumeTons: 175, since: 2025, status: 'active', countryCode: 'IQ' },
        { key: 'bahrain', name: 'Bahrain', rank: 5, volumeTons: 100, since: 2012, status: 'active', countryCode: 'BH' },
        { key: 'lebanon', name: 'Lebanon', rank: 6, volumeTons: null, since: 2015, status: 'active', countryCode: 'LB' },
        { key: 'spain', name: 'Spain', rank: 7, volumeTons: null, since: 2018, status: 'paused', countryCode: 'ES' },
        { key: 'russia', name: 'Russia', rank: 8, volumeTons: null, since: null, status: 'planned', countryCode: 'RU' },
    ] as MarketConfig[],

    // ─────────────────────────────────────────────────────────────────────────
    // PRODUCTS (Non-translatable metadata)
    // ─────────────────────────────────────────────────────────────────────────
    products: [
        { key: 'tilapia', category: 'freshwater', isMain: true, image: '/items/tilapia.jpg' },
        { key: 'sea_bass', category: 'saltwater', isMain: true, image: '/items/sea_bass.jpg' },
        { key: 'mullet', category: 'freshwater', isMain: true, image: '/items/bouri.jpg' },
        { key: 'buni', category: 'saltwater', isMain: false, image: '/items/buni.jpg' },
        { key: 'mubarakah', category: 'freshwater', isMain: false, image: '/items/mubarakah.jpg' },
        { key: 'catfish', category: 'freshwater', isMain: false, image: '/items/catfish.jpg' },
        { key: 'lout', category: 'saltwater', isMain: false, image: '/items/lout.jpg' },
        { key: 'eels', category: 'freshwater', isMain: false, image: '/items/eels.jpg' },
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // CERTIFICATIONS
    // ─────────────────────────────────────────────────────────────────────────
    certifications: [
        { code: 'ISO_22000', name: 'ISO 22000:2018', description: 'Food Safety Management System' },
        { code: 'HACCP', name: 'HACCP', description: 'Hazard Analysis Critical Control Points' },
        { code: 'ISO_9001', name: 'ISO 9001:2015', description: 'Quality Management System' },
        { code: 'ISO_14001', name: 'ISO 14001:2015', description: 'Environmental Management System' },
        { code: 'ISO_45001', name: 'ISO 45001:2018', description: 'Occupational Health and Safety' },
    ] as CertificationConfig[],

    // ─────────────────────────────────────────────────────────────────────────
    // MILESTONES
    // ─────────────────────────────────────────────────────────────────────────
    milestones: [
        { year: 2008, event: 'company_founded' },
        { year: 2008, event: 'started_gulf_export' },
        { year: 2018, event: 'baltim_factory_opened' },
        { year: 2018, event: 'iso_certifications' },
        { year: 2025, event: 'motobas_factory_opened' },
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // STATIC STATS (not computed)
    // ─────────────────────────────────────────────────────────────────────────
    staticStats: {
        clients: 500,
        totalVolumeEstimate: 2500,  // Use this for display (rounded estimate)
    },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMPUTED VALUES (Auto-calculated from config)
// ═══════════════════════════════════════════════════════════════════════════

/** Years in business - auto-computed from founding year */
export function getYearsInBusiness(): number {
    return new Date().getFullYear() - companyConfig.identity.foundingYear;
}

/** Count of active markets */
function getActiveMarketCount(): number {
    return companyConfig.markets.filter(m => m.status === 'active').length;
}

/** Count of certifications */
function getCertificateCount(): number {
    return companyConfig.certifications.length;
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMATTED STATS (Ready for display)
// ═══════════════════════════════════════════════════════════════════════════

/** Get formatted stats for UI display */
export function getFormattedStats() {
    return {
        experience: `+${getYearsInBusiness()}`,
        employees: `+${companyConfig.identity.employees}`,
        countries: '+7', // Static display value (includes paused/planned markets)
        tonnage: `+${companyConfig.staticStats.totalVolumeEstimate}`,
        certificates: `+${getCertificateCount()}`,
        clients: `+${companyConfig.staticStats.clients}`,
    };
}
