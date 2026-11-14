/** Purpose group on /quality (site v2) */
export type CertificateGroup = 'food_safety' | 'export_approval' | 'management_system'

export interface Certificate {
    id: number
    name: string
    description: string
    image: string
    issuer: string
    /** ISO date (YYYY-MM-DD) or a year */
    validUntil: string
    /** Site v2 fields (owner sheet "Certificates"); optional so legacy pages keep compiling */
    group?: CertificateGroup
    /** Certificate / approval number, only if the owner allows publishing it */
    number?: string
    /** Products / activities covered */
    scope?: string
    /** Site covered (address) */
    site?: string
    /** Owner approved public display. false = never shown */
    publishable?: boolean
    /** Stable key for public copy (locales/<l>/pages/v2-quality.json · certs.items.<key>) */
    key?: CertificateKey
}

/** Standards AZAFCO holds today; the key picks the localized name and one-line summary. */
export type CertificateKey = 'iso9001' | 'iso14001' | 'iso45001'

/**
 * Public display policy (owner decision 13 Nov 2026, docs/team/web/g/RELEASE-DECISIONS.md §3).
 * Site copy says "we hold ISO certificates": the standard name, what it covers in one
 * line, and "certified by TÜV AUSTRIA" once. Numbers, expiry dates, the plant/site,
 * the holder name, the scope and certificate images are kept here for internal use
 * (and the /v/[token] verification pages) but are NEVER rendered on public pages.
 * No "copies on request" promise either.
 */
export const CERTIFICATE_PUBLIC_FIELDS = {
    name: true,
    issuer: true,
    number: false,
    validUntil: false,
    scope: false,
    site: false,
    holder: false,
    image: false,
} as const

/** Certifier name as shown on the site (short form, without accreditation notes). */
export const CERTIFIER_PUBLIC_NAME = 'TÜV AUSTRIA'

/** The only certificate shape public pages may render. */
export interface PublicCertificate {
    id: number
    key: CertificateKey
    /** Standard and edition, e.g. "ISO 9001:2015" */
    name: string
}

/**
 * Certificates safe to show: publishable, still valid (checked here, never displayed)
 * and carrying a copy key. Returns only the public fields.
 */
export function publicCertificates(now: Date = new Date()): PublicCertificate[] {
    const today = now.toISOString().slice(0, 10)
    return certificates
        .filter((c) => c.publishable !== false && !!c.key)
        .filter((c) => !/^\d{4}-\d{2}-\d{2}$/.test(c.validUntil) || c.validUntil >= today)
        .map((c) => ({ id: c.id, key: c.key as CertificateKey, name: c.name }))
}

// Hidden temporarily - expired certificates
// When new valid certificates are obtained, add them to the array below

// Current certificates (owner PDFs in D:\azafco\cert, received 7 Nov 2026).
// Name on the certificates reads "IZAFCO INTERNATIONAL INVESTMENT & DEVELOPMENT",
// site "Baltim Industrial Zone": both being corrected. Public pages render only
// the standard name and the certifier (CERTIFICATE_PUBLIC_FIELDS above); number,
// validity, scope, site and image stay internal.
const TUV = 'TÜV AUSTRIA Egypt (EGAC-accredited, IAF MLA)'
const SCOPE = 'Production of frozen fish'

export const certificates: Certificate[] = [
    {
        id: 101,
        key: 'iso9001',
        name: 'ISO 9001:2015',
        description: 'Quality management system',
        // image withheld: the certificate shows the site address, which is being corrected
        image: '',
        issuer: TUV,
        validUntil: '2029-03-15',
        group: 'management_system',
        number: 'Tuveg-000039',
        scope: SCOPE,
        publishable: true,
    },
    {
        id: 102,
        key: 'iso14001',
        name: 'ISO 14001:2015',
        description: 'Environmental management system',
        // image withheld: the certificate shows the site address, which is being corrected
        image: '',
        issuer: TUV,
        validUntil: '2029-02-19',
        group: 'management_system',
        number: 'Tuveg-000035',
        scope: SCOPE,
        publishable: true,
    },
    {
        id: 103,
        key: 'iso45001',
        name: 'ISO 45001:2018',
        description: 'Occupational health and safety management system',
        // image withheld: the certificate shows the site address, which is being corrected
        image: '',
        issuer: TUV,
        validUntil: '2029-02-19',
        group: 'management_system',
        number: 'Tuveg-000036',
        scope: SCOPE,
        publishable: true,
    },
]

// Commented out expired certificates for reference:
// export const expiredCertificates: Certificate[] = [

//     {
//         id: 1,
//         name: 'ISO 22000:2018 IGC',
//         description: 'نظام إدارة سلامة الأغذية - المعيار الدولي لضمان سلامة الغذاء في جميع مراحل سلسلة التوريد',
//         image: '/certificate/iso_22000_2018.jpg',
//         issuer: 'IGC',
//         validUntil: '2023',
//     },
//     {
//         id: 2,
//         name: 'ISO 22000:2005 IGC',
//         description: 'نظام إدارة سلامة الأغذية - الإصدار السابق للمعيار الدولي',
//         image: '/certificate/iso_22000_2005.jpg',
//         issuer: 'IGC',
//         validUntil: '2021',
//     },
//     {
//         id: 3,
//         name: 'HACCP Code:2003',
//         description: 'تحليل المخاطر ونقاط التحكم الحرجة - نظام وقائي لضمان سلامة الأغذية',
//         image: '/certificate/haccp_2003.jpg',
//         issuer: 'International HACCP Alliance',
//         validUntil: '2021',
//     },
//     {
//         id: 4,
//         name: 'ISO 14001:2015 U4F',
//         description: 'نظام إدارة البيئة - التزامنا بالحفاظ على البيئة وتقليل الأثر البيئي',
//         image: '/certificate/iso_14001_2015.jpg',
//         issuer: 'U4F',
//         validUntil: '2021',
//     },
//     {
//         id: 5,
//         name: 'ISO 9001:2015 U4F',
//         description: 'نظام إدارة الجودة - ضمان أعلى معايير الجودة في جميع عملياتنا',
//         image: '/certificate/iso_9001_2015.jpg',
//         issuer: 'U4F',
//         validUntil: '2021',
//     },
//     {
//         id: 6,
//         name: 'ISO 45001:2018 U4F',
//         description: 'نظام إدارة الصحة والسلامة المهنية - ضمان بيئة عمل آمنة وصحية',
//         image: '/certificate/iso_45001_2018.jpg',
//         issuer: 'U4F',
//         validUntil: '2021',
//     },
//     {
//         id: 7,
//         name: 'ISO 22000 UCS',
//         description: 'نظام إدارة سلامة الأغذية - شهادة إضافية من UCS',
//         image: '/certificate/iso_22000_ucs.jpg',
//         issuer: 'UCS',
//         validUntil: '2019',
//     },
// ]
