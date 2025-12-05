export interface Market {
    country: string
    countryEn: string
    flag: string
    description: string
    descriptionEn: string
    features: string[]
    featuresEn: string[]
    since: string
    sinceAr?: string
    status?: 'active' | 'paused' | 'coming-soon'
}

export const markets: Market[] = [
    {
        country: 'الإمارات العربية المتحدة',
        countryEn: 'United Arab Emirates',
        flag: '/flags/ae.svg',
        description: 'السوق الأكبر والأهم لنا في منطقة الخليج، نخدم أكبر الموزعين والمطاعم.',
        descriptionEn: 'Our largest market in the Gulf region, serving major distributors and restaurants.',
        features: ['موزعين معتمدين', 'مطاعم فاخرة', 'سلاسل سوبرماركت'],
        featuresEn: ['Certified Distributors', 'Luxury Restaurants', 'Supermarket Chains'],
        since: '2008',
    },
    {
        country: 'الكويت',
        countryEn: 'Kuwait',
        flag: '/flags/kw.svg',
        description: 'سوق متنامي مع طلب مرتفع على الأسماك الطازجة والمجمدة.',
        descriptionEn: 'Growing market with high demand for fresh and frozen fish.',
        features: ['موزعين محليين', 'مطاعم', 'فنادق'],
        featuresEn: ['Local Distributors', 'Restaurants', 'Hotels'],
        since: '2009',
    },
    {
        country: 'قطر',
        countryEn: 'Qatar',
        flag: '/flags/qa.svg',
        description: 'شراكة جديدة واعدة مع موزعين قطريين.',
        descriptionEn: 'Promising new partnership with Qatari distributors.',
        features: ['موزعين', 'مطاعم', 'فنادق'],
        featuresEn: ['Distributors', 'Restaurants', 'Hotels'],
        since: '2024',
    },
    {
        country: 'العراق',
        countryEn: 'Iraq',
        flag: '/flags/iq.svg',
        description: 'سوق كبير ومتنامي مع فرص واعدة للتوسع.',
        descriptionEn: 'Large and growing market with promising expansion opportunities.',
        features: ['موزعين محليين', 'أسواق الجملة'],
        featuresEn: ['Local Distributors', 'Wholesale Markets'],
        since: '2025',
    },
    {
        country: 'لبنان',
        countryEn: 'Lebanon',
        flag: '/flags/lb.svg',
        description: 'سوق متميز مع تقدير عالي للجودة والطزاجة.',
        descriptionEn: 'Distinguished market with high appreciation for quality and freshness.',
        features: ['مطاعم راقية', 'موزعين', 'فنادق'],
        featuresEn: ['High-end Restaurants', 'Distributors', 'Hotels'],
        since: '2015',
    },
    {
        country: 'البحرين',
        countryEn: 'Bahrain',
        flag: '/flags/bh.svg',
        description: 'سوق نشط مع طلب متزايد على منتجاتنا.',
        descriptionEn: 'Active market with increasing demand for our products.',
        features: ['موزعين', 'مطاعم', 'جمعيات تعاونية'],
        featuresEn: ['Distributors', 'Restaurants', 'Cooperative Societies'],
        since: '2012',
    },
    {
        country: 'إسبانيا',
        countryEn: 'Spain',
        flag: '/flags/es.svg',
        description: 'أول أسواقنا في أوروبا - متوقف حالياً.',
        descriptionEn: 'Our first European market - currently paused.',
        features: ['موزعين أوروبيين', 'أسواق السمك'],
        featuresEn: ['European Distributors', 'Fish Markets'],
        since: '2018',
        status: 'paused',
    },
    {
        country: 'روسيا',
        countryEn: 'Russia',
        flag: '/flags/ru.svg',
        description: 'سوق واعد نعمل على دخوله قريباً.',
        descriptionEn: 'Promising market we are planning to enter soon.',
        features: ['موزعين دوليين', 'سلاسل تجارية'],
        featuresEn: ['International Distributors', 'Retail Chains'],
        since: 'Soon',
        sinceAr: 'قريباً',
        status: 'coming-soon',
    },
]

export const marketCountries = markets.filter(m => m.status !== 'coming-soon')
