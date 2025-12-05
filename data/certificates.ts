export interface Certificate {
    id: number
    name: string
    description: string
    image: string
    issuer: string
    validUntil: string
}

export const certificates: Certificate[] = [
    {
        id: 1,
        name: 'ISO 22000:2018 IGC',
        description: 'نظام إدارة سلامة الأغذية - المعيار الدولي لضمان سلامة الغذاء في جميع مراحل سلسلة التوريد',
        image: '/certificate/iso_22000_2018.jpg',
        issuer: 'IGC',
        validUntil: '2025',
    },
    // Hidden temporarily - expired certificate
    // {
    //     id: 2,
    //     name: 'ISO 22000:2005 IGC',
    //     description: 'نظام إدارة سلامة الأغذية - الإصدار السابق للمعيار الدولي',
    //     image: '/certificate/iso_22000_2005.jpg',
    //     issuer: 'IGC',
    //     validUntil: '2024',
    // },
    {
        id: 3,
        name: 'HACCP Code:2003',
        description: 'تحليل المخاطر ونقاط التحكم الحرجة - نظام وقائي لضمان سلامة الأغذية',
        image: '/certificate/haccp_2003.jpg',
        issuer: 'International HACCP Alliance',
        validUntil: '2025',
    },
    {
        id: 4,
        name: 'ISO 14001:2015 U4F',
        description: 'نظام إدارة البيئة - التزامنا بالحفاظ على البيئة وتقليل الأثر البيئي',
        image: '/certificate/iso_14001_2015.jpg',
        issuer: 'U4F',
        validUntil: '2025',
    },
    {
        id: 5,
        name: 'ISO 9001:2015 U4F',
        description: 'نظام إدارة الجودة - ضمان أعلى معايير الجودة في جميع عملياتنا',
        image: '/certificate/iso_9001_2015.jpg',
        issuer: 'U4F',
        validUntil: '2025',
    },
    {
        id: 6,
        name: 'ISO 45001:2018 U4F',
        description: 'نظام إدارة الصحة والسلامة المهنية - ضمان بيئة عمل آمنة وصحية',
        image: '/certificate/iso_45001_2018.jpg',
        issuer: 'U4F',
        validUntil: '2025',
    },
    {
        id: 7,
        name: 'ISO 22000 UCS',
        description: 'نظام إدارة سلامة الأغذية - شهادة إضافية من UCS',
        image: '/certificate/iso_22000_ucs.jpg',
        issuer: 'UCS',
        validUntil: '2025',
    },
]
