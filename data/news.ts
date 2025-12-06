export interface NewsItem {
    id: number
    title: string
    titleEn: string
    summary: string
    summaryEn: string
    content: string
    contentEn: string
    date: string
    source?: string
    sourceUrl?: string
    image?: string
    category: 'company' | 'industry' | 'achievement'
}

export const newsItems: NewsItem[] = [
    // === أخبار الشركة (Company News) ===
    {
        id: 1,
        title: 'محافظ كفر الشيخ يتفقد مصنع ازافكو للاستثمار بالمنطقة الصناعية بمطوبس',
        titleEn: 'Governor of Kafr El Sheikh Inspects AZAFCO Factory in Motobas Industrial Zone',
        summary: 'اللواء دكتور علاء عبدالمعطي، محافظ كفرالشيخ، يتفقد مصنع ازافكو للاستثمار بالمنطقة الصناعية بمطوبس لتعزيز الصناعات السمكية وتطوير منظومة التصدير.',
        summaryEn: 'Governor Dr. Alaa Abdel Moaty inspects AZAFCO factory to enhance fish industries and develop export systems.',
        content: 'قام اللواء دكتور علاء عبدالمعطي، محافظ كفر الشيخ، بزيارة تفقدية لمصنع ازافكو للاستثمار والتنمية بالمنطقة الصناعية بمطوبس، وذلك في إطار جهود المحافظة لتعزيز الصناعات السمكية وتطوير منظومة التصدير.',
        contentEn: 'Governor Dr. Alaa Abdel Moaty visited AZAFCO Investment & Development factory in Motobas Industrial Zone as part of the governorate\'s efforts to enhance fish industries and develop the export system.',
        date: '2025-09-17',
        source: 'محافظة كفر الشيخ',
        sourceUrl: 'https://www.facebook.com/reel/1122525626517427',
        category: 'company',
    },
    {
        id: 9,
        title: 'شركة إزافكو العالمية.. الأفضل في عالم تصدير الأسماك',
        titleEn: 'AZAFCO International.. The Best in the World of Fish Export',
        summary: 'الحاج محمد عبد الله الكويتيحي رئيس مجلس الإدارة: نصدر لجميع دول العالم.. وحصلنا على موافقة الاتحاد الأوروبي لاستيراد منتجاتنا.',
        summaryEn: 'Haj Mohamed Abdullah Al-Kuwaitihi, Chairman: We export to all countries.. and obtained EU approval to import our products.',
        content: 'شاب صاحب طموح كبير، ورث العمل بمجال الأسماك عن أبيه وجدوده، لكنه أبدع فيه وحقق طفرة كبيرة من خلال الانفتاح على الأسواق الخارجية ليجذب العملة الصعبة للدولة المصرية. الحاج محمد عبدالله الكويتيحي، رئيس مجلس إدارة شركة إزافكو العالمية، بدأ نشاط شركته في عام 2009، متجها مباشرة للتصدير لأغلب دول العالم، وذلك بفضل الحصول على موافقة الاتحاد الأوروبي. توفر الشركة عملة صعبة بنحو 50 مليون دولار سنويا، وتصدر للكويت والإمارات والبحرين والأردن ولبنان وأوروبا، وحصلت مؤخراً على موافقة التصدير لروسيا.',
        contentEn: 'A young man with great ambition, Haj Mohamed Abdullah Al-Kuwaitihi, Chairman of AZAFCO International, inherited the fish business and achieved a boom by opening up to foreign markets. He started in 2009, exporting directly to most countries thanks to EU approval. The company provides about $50 million annually in hard currency, exporting to Kuwait, UAE, Bahrain, Jordan, Lebanon, and Europe, and recently obtained approval to export to Russia.',
        date: '2020-11-18',
        source: 'جريدة دار الشرق الاوسط',
        sourceUrl: 'https://alshrqalawsat.com/%D8%B4%D8%B1%D9%83%D8%A9-%D8%A5%D8%B2%D8%A7%D9%81%D9%83%D9%88-%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%A3%D9%81%D8%B6%D9%84-%D9%81%D9%8A-%D8%B9%D8%A7%D9%84%D9%85-%D8%AA%D8%B5',
        category: 'company',
    },
    {
        id: 2,
        title: 'برنامج حلوة يا بلدي - حلقة خاصة عن شركة ازافكو العالمية للإستثمار والتنمية',
        titleEn: 'TV Program "Helwa Ya Baladi" - Special Episode About AZAFCO International',
        summary: 'حلقة تلفزيونية خاصة من برنامج "حلوة يا بلدي" تسلط الضوء على شركة ازافكو العالمية ودورها في صناعة تعبئة وتصدير الأسماك.',
        summaryEn: 'Special TV episode highlighting AZAFCO International and its role in fish packaging and export industry.',
        content: 'استضاف برنامج "حلوة يا بلدي" شركة ازافكو العالمية للإستثمار والتنمية في حلقة خاصة، تناولت نشاط الشركة في مجال تعبئة وتغليف وتصدير الأسماك الطازجة، ودورها في دعم الاقتصاد المحلي وتوفير فرص العمل.',
        contentEn: 'The "Helwa Ya Baladi" program hosted AZAFCO International in a special episode covering the company\'s activities in fresh fish packaging and export, and its role in supporting the local economy and providing jobs.',
        date: '2017-12-10',
        source: 'برنامج حلوة يا بلدى',
        sourceUrl: 'https://www.youtube.com/watch?v=kuT4e6PXcFI',
        category: 'company',
    },

    // === أخبار القطاع (Industry News) ===
    {
        id: 3,
        title: 'مصر الأولى أفريقياً والسادسة عالمياً في الاستزراع السمكي',
        titleEn: 'Egypt Ranks 1st in Africa and 6th Globally in Aquaculture',
        summary: 'حققت مصر مراكز متقدمة عالمياً في إنتاج الأسماك والاستزراع السمكي، وتحتل المركز الثالث عالمياً في إنتاج البلطي.',
        summaryEn: 'Egypt achieves advanced global positions in fish production and aquaculture, ranking 3rd worldwide in tilapia production.',
        content: 'تحتل مصر المركز الأول في أفريقيا والسادس عالمياً في مجال الاستزراع السمكي، كما تحتل المركز الثالث عالمياً في إنتاج البلطي. ويبلغ إجمالي إنتاج مصر من الأسماك حوالي 2 مليون طن سنوياً، منها 1.6 مليون طن من الاستزراع السمكي.',
        contentEn: 'Egypt ranks 1st in Africa and 6th globally in aquaculture, and 3rd worldwide in tilapia production. Egypt\'s total fish production is about 2 million tons annually, with 1.6 million tons from aquaculture.',
        date: '2024-06-01',
        source: 'الهيئة العامة للاستعلامات',
        sourceUrl: 'https://sis.gov.eg/en/media-center/news/agriculture-minister-egypt-comes-in-1st-rank-in-fisheries-in-africa',
        category: 'industry',
    },
    {
        id: 4,
        title: 'كفر الشيخ تنتج 50% من إنتاج مصر السمكي',
        titleEn: 'Kafr El Sheikh Produces 50% of Egypt\'s Fish Production',
        summary: 'تعد محافظة كفر الشيخ - حيث يقع مصنعنا - المحافظة الأولى في إنتاج الأسماك على مستوى الجمهورية بإنتاج يتجاوز 750 ألف طن سنوياً.',
        summaryEn: 'Kafr El Sheikh governorate - where our factory is located - is the top fish-producing governorate in Egypt with over 750,000 tons annually.',
        content: 'تنتج محافظة كفر الشيخ ما يقرب من 50% من إجمالي إنتاج مصر من الأسماك، بإنتاج يتجاوز 750 ألف طن سنوياً. يأتي هذا الإنتاج من مصادر متنوعة تشمل بحيرة البرلس، والمياه البحرية، ونهر النيل، بالإضافة إلى مساحات شاسعة من الاستزراع السمكي.',
        contentEn: 'Kafr El Sheikh produces nearly 50% of Egypt\'s total fish production, exceeding 750,000 tons annually. This production comes from diverse sources including Lake Burullus, marine waters, the Nile River, and vast aquaculture areas.',
        date: '2024-01-15',
        source: 'الأهرام (Gate)',
        sourceUrl: 'https://gate.ahram.org.eg/News/2550584.aspx',
        category: 'industry',
    },
    {
        id: 5,
        title: 'مشروع غليون السمكي - أكبر مشروع للاستزراع السمكي في الشرق الأوسط',
        titleEn: 'Ghalioun Fish Project - Largest Aquaculture Project in the Middle East',
        summary: 'يُعد مشروع بركة غليون بكفر الشيخ أكبر مزرعة سمكية في الشرق الأوسط وأفريقيا، ويوفر 15 ألف فرصة عمل.',
        summaryEn: 'Ghalioun Lake project in Kafr El Sheikh is the largest fish farm in the Middle East and Africa, providing 15,000 jobs.',
        content: 'افتتح الرئيس عبد الفتاح السيسي مشروع بركة غليون السمكي في 18 نوفمبر 2017. يُعد المشروع أكبر مزرعة سمكية في الشرق الأوسط وأفريقيا، ويضم 1359 حوضًا للأسماك والجمبري، ومصانع للتجهيز والأعلاف والثلج، ومركزًا للأبحاث. يوفر المشروع 5 آلاف فرصة عمل مباشرة و10 آلاف غير مباشرة.',
        contentEn: 'President Abdel Fattah El-Sisi inaugurated Ghalioun Fish Project on November 18, 2017. It is the largest fish farm in the Middle East and Africa, featuring 1,359 fish and shrimp ponds, processing and feed factories, and a research center. The project provides 5,000 direct and 10,000 indirect jobs.',
        date: '2017-11-18',
        source: 'رئاسة الجمهورية',
        sourceUrl: 'https://www.presidency.eg/ar/%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%D8%B9-%D8%A7%D9%84%D9%82%D9%88%D9%85%D9%8A%D8%A9/%D8%A8%D8%B1%D9%83%D8%A9-%D8%BA%D9%84%D9%8A%D9%88%D9%86-%D8%A3%D9%83%D8%A8%D8%B1-%D9%85%D8%B2%D8%B1%D8%B9%D8%A9-%D9%84%D9%84%D8%A7%D8%B3%D8%AA%D8%B2%D8%B1%D8%A7%D8%B9-%D8%A7%D9%84%D8%B3%D9%85%D9%83%D9%8A-%D8%A8%D8%A7%D9%84%D8%B4%D8%B1%D9%82-%D8%A7%D9%84%D8%A3%D9%88%D8%B3%D8%B7/',
        category: 'industry',
    },

    // === إنجازات الشركة (Achievements) ===
    {
        id: 6,
        title: 'ازافكو تحصل على شهادات الأيزو الدولية',
        titleEn: 'AZAFCO Obtains International ISO Certifications',
        summary: 'حصلت الشركة على مجموعة من شهادات الأيزو الدولية التي تؤكد التزامها بأعلى معايير الجودة والسلامة.',
        summaryEn: 'The company obtained several international ISO certifications confirming its commitment to the highest quality and safety standards.',
        content: 'نفخر في ازافكو بحصولنا على شهادات ISO 22000 وHACCP وISO 14001 وISO 9001 وISO 45001، مما يؤكد التزامنا بأعلى معايير الجودة وسلامة الأغذية والبيئة والصحة المهنية.',
        contentEn: 'At AZAFCO, we are proud to have obtained ISO 22000, HACCP, ISO 14001, ISO 9001, and ISO 45001 certifications, confirming our commitment to the highest standards of quality, food safety, environment, and occupational health.',
        date: '2018-01-01',
        category: 'achievement',
    },
    {
        id: 7,
        title: 'افتتاح المصنع الأول في المنطقة الصناعية ببلطيم',
        titleEn: 'Opening of First Factory in Baltim Industrial Zone',
        summary: 'تم افتتاح مصنع ازافكو الأول في المنطقة الصناعية ببلطيم، وهو أحد 6 مصانع فقط في مصر المصرح لها بالتصدير للاتحاد الأوروبي.',
        summaryEn: 'AZAFCO\'s first factory opened in Baltim Industrial Zone, one of only 6 factories in Egypt authorized to export to the European Union.',
        content: 'في عام 2018، افتتحت شركة ازافكو مصنعها الأول في المنطقة الصناعية ببلطيم، محافظة كفر الشيخ. المصنع مجهز بأحدث التقنيات العالمية لتعبئة وتغليف الأسماك وفقاً للمعايير الدولية، وهو أحد 6 مصانع فقط في مصر حاصلة على تصريح التصدير للاتحاد الأوروبي.',
        contentEn: 'In 2018, AZAFCO opened its first factory in Baltim Industrial Zone, Kafr El Sheikh. The factory is equipped with the latest global technologies for fish packaging according to international standards, and is one of only 6 factories in Egypt authorized to export to the European Union.',
        date: '2018-01-01',
        category: 'achievement',
    },
    {
        id: 8,
        title: 'افتتاح المصنع الجديد في المنطقة الصناعية بمطوبس',
        titleEn: 'Opening of New Factory in Motobas Industrial Zone',
        summary: 'تم افتتاح مصنع ازافكو الجديد في المنطقة الصناعية بمطوبس لتوسيع الطاقة الإنتاجية.',
        summaryEn: 'AZAFCO\'s new factory opened in Motobas Industrial Zone to expand production capacity.',
        content: 'في عام 2025، افتتحت شركة ازافكو مصنعها الثاني في المنطقة الصناعية بمطوبس، محافظة كفر الشيخ، لتوسيع طاقتها الإنتاجية وتلبية الطلب المتزايد على منتجاتها في الأسواق العالمية.',
        contentEn: 'In 2025, AZAFCO opened its second factory in Motobas Industrial Zone, Kafr El Sheikh, to expand its production capacity and meet the growing demand for its products in global markets.',
        date: '2025-01-01',
        category: 'achievement',
    },
    {
        id: 9,
        title: 'تأسيس شركة ازافكو العالمية',
        titleEn: 'Founding of AZAFCO International',
        summary: 'تأسست شركة ازافكو العالمية للإستثمار والتنمية وبدأت رحلتها في مجال تصدير الأسماك.',
        summaryEn: 'AZAFCO International Investment & Development was established and began its journey in fish export.',
        content: 'في عام 2008، تأسست شركة ازافكو العالمية للإستثمار والتنمية في محافظة كفر الشيخ، وبدأت رحلتها الناجحة في مجال تعبئة وتغليف وتصدير الأسماك الطازجة إلى الأسواق العربية والعالمية.',
        contentEn: 'In 2008, AZAFCO International Investment & Development was established in Kafr El Sheikh governorate, beginning its successful journey in fresh fish packaging and export to Arab and international markets.',
        date: '2008-01-01',
        category: 'achievement',
    },
]

// Sort by date (newest first)
const sortedNews = [...newsItems].sort((a, b) => {
    const dateA = new Date(a.date.split('-').length === 3 ? a.date : `${a.date}-01-01`)
    const dateB = new Date(b.date.split('-').length === 3 ? b.date : `${b.date}-01-01`)
    return dateB.getTime() - dateA.getTime()
})

// Latest news for homepage (top 3 by date)
export const latestNews = sortedNews.slice(0, 3)

// News by category
export const companyNews = newsItems.filter(n => n.category === 'company')
export const industryNews = newsItems.filter(n => n.category === 'industry')
export const achievementNews = newsItems.filter(n => n.category === 'achievement')
