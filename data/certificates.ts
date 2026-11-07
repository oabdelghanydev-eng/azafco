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
}

// Hidden temporarily - expired certificates
// When new valid certificates are obtained, add them to the array below

// Current certificates (owner PDFs in D:\azafco\cert, received 7 Nov 2026).
// Name on the certificates reads "IZAFCO INTERNATIONAL INVESTMENT & DEVELOPMENT",
// site "Baltim Industrial Zone, Kafr El Sheikh": both open owner questions.
const TUV = 'TÜV AUSTRIA Egypt (EGAC-accredited, IAF MLA)'
const SITE = 'Baltim Industrial Zone, Kafr El Sheikh, Egypt'
const SCOPE = 'Production of frozen fish'

export const certificates: Certificate[] = [
    {
        id: 101,
        name: 'ISO 9001:2015',
        description: 'Quality management system',
        image: '/certificate/v2/iso-9001-2015.webp',
        issuer: TUV,
        validUntil: '2029-03-15',
        group: 'management_system',
        number: 'Tuveg-000039',
        scope: SCOPE,
        site: SITE,
        publishable: true,
    },
    {
        id: 102,
        name: 'ISO 14001:2015',
        description: 'Environmental management system',
        image: '/certificate/v2/iso-14001-2015.webp',
        issuer: TUV,
        validUntil: '2029-02-19',
        group: 'management_system',
        number: 'Tuveg-000035',
        scope: SCOPE,
        site: SITE,
        publishable: true,
    },
    {
        id: 103,
        name: 'ISO 45001:2018',
        description: 'Occupational health and safety management system',
        image: '/certificate/v2/iso-45001-2018.webp',
        issuer: TUV,
        validUntil: '2029-02-19',
        group: 'management_system',
        number: 'Tuveg-000036',
        scope: SCOPE,
        site: SITE,
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
