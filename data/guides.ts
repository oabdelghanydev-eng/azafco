// Media Center guides - locale-agnostic data. Text lives in locales/[locale]/pages/guides.json.

export interface Guide {
    /** URL segment: /[locale]/guides/[slug] */
    slug: string;
    /** Key under guides_page.<translationKey> */
    translationKey: string;
    /** ISO dates (YYYY-MM-DD). lastReviewed is shown on the page and used as dateModified. */
    datePublished: string;
    lastReviewed: string;
}

export const guides: Guide[] = [
    {
        slug: 'importing-fresh-fish-from-egypt',
        translationKey: 'importing',
        datePublished: '2026-10-31',
        lastReviewed: '2026-11-14',
    },
];

export const guideSlugs = guides.map((guide) => guide.slug);

export const getGuideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);

// ─────────────────────────────────────────────────────────────────────────────
// "Importing fresh fish from Egypt" - tariff table and sources
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fresh or chilled whole fish, heading 0302 (fillets are 0304, frozen fish 0303).
 * HS = WCO Harmonized System 2022 (6 digits, same in every country).
 * CN = EU Combined Nomenclature (8 digits), checked in EU TARIC on 2026-11-14:
 *   0302 71 00 tilapias (Oreochromis spp.) · 0302 72 00 catfish (Clarias spp. …)
 *   0302 73 00 carp (Cyprinus spp., Ctenopharyngodon idellus, Hypophthalmichthys spp. …)
 *   0302 84 10 European sea bass (Dicentrarchus labrax) · 0302 85 30 gilt-head sea bream (Sparus aurata)
 *   0302 89 10 other freshwater fish · 0302 89 90 other fish.
 * Bagrus bajad (Bagridae) is not one of the catfish genera named in 0302.72, and
 * mullets and meagre are not named in any subheading, so they fall under 0302.89.
 * Species identities: docs/reports/species-identification.md.
 * productKey = Product.translationKey in data/products.ts (used to link the species page).
 * One row per species shown on the site (the 12 main species, in catalogue order).
 */
export interface TariffRow {
    productKey: string;
    scientificName: string;
    hs: string;
    cn: string;
    /** Key under guides_page.importing.hs.notes, if the row needs a remark */
    note?: string;
}

export const importingTariffRows: TariffRow[] = [
    { productKey: 'tilapia', scientificName: 'Oreochromis niloticus', hs: '0302.71', cn: '0302 71 00' },
    { productKey: 'catfish', scientificName: 'Clarias gariepinus', hs: '0302.72', cn: '0302 72 00' },
    { productKey: 'bayad_catfish', scientificName: 'Bagrus bajad', hs: '0302.89', cn: '0302 89 10', note: 'freshwater_other' },
    { productKey: 'mubarakah', scientificName: 'Cyprinus carpio', hs: '0302.73', cn: '0302 73 00' },
    { productKey: 'mirror_carp', scientificName: 'Cyprinus carpio', hs: '0302.73', cn: '0302 73 00' },
    { productKey: 'grass_carp', scientificName: 'Ctenopharyngodon idella', hs: '0302.73', cn: '0302 73 00' },
    { productKey: 'silver_carp', scientificName: 'Hypophthalmichthys molitrix', hs: '0302.73', cn: '0302 73 00' },
    { productKey: 'sea_bass', scientificName: 'Dicentrarchus labrax', hs: '0302.84', cn: '0302 84 10' },
    { productKey: 'sea_bream', scientificName: 'Sparus aurata', hs: '0302.85', cn: '0302 85 30' },
    { productKey: 'mullet', scientificName: 'Mugil cephalus', hs: '0302.89', cn: '0302 89 90', note: 'other_fish' },
    { productKey: 'thinlip_mullet', scientificName: 'Chelon ramada', hs: '0302.89', cn: '0302 89 90', note: 'other_fish' },
    { productKey: 'lout', scientificName: 'Argyrosomus regius', hs: '0302.89', cn: '0302 89 90', note: 'other_fish' },
];

/** Documents section: order on the page, with the sources that back each item. */
export const importingDocuments: { id: string; sources: string[] }[] = [
    { id: 'invoice', sources: [] },
    { id: 'packing_list', sources: [] },
    { id: 'health_certificate', sources: ['reg_2020_2235', 'reg_2021_405', 'reg_2026_2228', 'establishments', 'egypt_eu_access'] },
    { id: 'origin', sources: ['a2m_egypt'] },
    { id: 'catch', sources: ['reg_1005_2008', 'catch_it'] },
    { id: 'ched', sources: ['reg_2017_625', 'traces'] },
    { id: 'labelling', sources: ['reg_1379_2013'] },
];

export interface GuideSource {
    id: string;
    /** Official title, kept in its original language */
    title: string;
    publisher: string;
    url: string;
}

export const importingSources: GuideSource[] = [
    {
        id: 'wco_hs',
        title: 'Harmonized System Nomenclature 2022, Chapter 3 (heading 03.02)',
        publisher: 'World Customs Organization',
        url: 'https://www.wcoomd.org/-/media/wco/public/global/pdf/topics/nomenclature/instruments-and-tools/hs-nomenclature-2022/2022/0103_2022e.pdf',
    },
    {
        id: 'taric',
        title: 'TARIC consultation, heading 0302',
        publisher: 'European Commission, DG TAXUD',
        url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en&Taric=0302&Expand=true',
    },
    {
        id: 'reg_2020_2235',
        title: 'Commission Implementing Regulation (EU) 2020/2235, Annex III, Chapter 28 (model certificate FISH-CRUST-HC)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg_impl/2020/2235/oj/eng',
    },
    {
        id: 'reg_2021_405',
        title: 'Commission Implementing Regulation (EU) 2021/405 (third countries authorised for entry into the Union)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg_impl/2021/405/oj/eng',
    },
    {
        id: 'reg_2026_2228',
        title: 'Commission Implementing Regulation (EU) 2026/2228 of 14 October 2026 (Egypt listed for aquaculture finfish and crustaceans)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg_impl/2026/2228/oj/eng',
    },
    {
        id: 'establishments',
        title: 'Non-EU countries: authorised establishments',
        publisher: 'European Commission, DG SANTE',
        url: 'https://food.ec.europa.eu/food-safety/biological-safety/food-hygiene/non-eu-countries-authorised-establishments_en',
    },
    {
        id: 'reg_2017_625',
        title: 'Regulation (EU) 2017/625 on official controls (border control posts, CHED)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg/2017/625/oj/eng',
    },
    {
        id: 'traces',
        title: 'TRACES',
        publisher: 'European Commission, DG SANTE',
        url: 'https://food.ec.europa.eu/horizontal-topics/traces_en',
    },
    {
        id: 'reg_1005_2008',
        title: 'Council Regulation (EC) No 1005/2008 (IUU Regulation), Annex I: products excluded from catch certification',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02008R1005-20240109',
    },
    {
        id: 'catch_it',
        title: 'Mandatory use of the EU CATCH system for fish imports from 10 January 2026',
        publisher: 'Austrian Federal Office for Food Safety (BAES)',
        url: 'https://baes.gv.at/en/details/mandatory-use-of-the-eu-catch-system-for-fish-imports-from-january-10th-2026',
    },
    {
        id: 'a2m_egypt',
        title: 'EU-Egypt Association Agreement',
        publisher: 'European Commission, Access2Markets',
        url: 'https://trade.ec.europa.eu/access-to-markets/en/content/eu-egypt-association-agreement',
    },
    {
        id: 'reg_1379_2013',
        title: 'Regulation (EU) No 1379/2013, Article 35 (consumer information for fishery and aquaculture products)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg/2013/1379/oj/eng',
    },
    {
        id: 'reg_853_2004',
        title: 'Regulation (EC) No 853/2004, Annex III, Section VIII, Chapters VII and VIII (storage and transport of fishery products)',
        publisher: 'EUR-Lex',
        url: 'https://eur-lex.europa.eu/eli/reg/2004/853/oj/eng',
    },
    {
        id: 'egypt_eu_access',
        title: 'Egypt secures EU market access for farmed fish exports (18 October 2026)',
        publisher: 'Daily News Egypt',
        url: 'https://www.dailynewsegypt.com/2026/10/18/egypt-secures-eu-market-access-for-farmed-fish-exports/',
    },
];
