/**
 * Import rules per active market: the one data set behind the "Importing fresh fish
 * into {country}" block on /markets/[slug] and the "Importing into the Gulf and the
 * Levant" section of the import guide (ROUND1-SPEC §6 R4). There is no second copy.
 *
 * Source: docs/team/web/g/research/import-rules.json (verified research, reviewed 14 Nov 2026).
 * Rules for this file:
 * - Only items marked `verified: true` in the research file are listed here.
 * - Every visible string lives in locales/<locale>/pages/v2-markets.json under
 *   `markets_v2.import`: items.<market>.<id> (worded no more strongly than the verified
 *   claim), sources.<sourceId>.title (a short description of the document in the page
 *   language) and the optional sources.<sourceId>.lead_in (one attribution per source
 *   group, so the items themselves stay plain), authorities.<market> (the name).
 * - `authority` is set only where the research has `authority.verified: true` and the
 *   body is the authority for fish imports (Kuwait, Bahrain, Qatar, Lebanon). Iraq's
 *   COSQC is a standards body, so it is described in an item, not labelled. UAE and
 *   Syria: the research could not verify the authority from its own site, so the
 *   attributed item naming the body comes first, with no label and no link.
 * - Items about halal certificates or numeric temperatures are left out (banned in visible copy).
 * - Markets are in the site's order (first export year: UAE, Kuwait, Bahrain, Lebanon,
 *   Qatar, Iraq, Syria); items in the order they are shown.
 */

/** Date the research was last checked against the sources (ISO). The only copy of this date. */
export const MARKET_IMPORT_REVIEWED = '2026-11-14';

/** One date format for review dates in every language ("14 November 2026" / «14 نوفمبر 2026»). */
export const REVIEW_DATE_FORMAT = { dateStyle: 'long', timeZone: 'UTC' } as const;

/** ISO date (YYYY-MM-DD) → Date at midnight UTC, for format.dateTime(date, REVIEW_DATE_FORMAT) */
export const isoDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Language(s) of a linked document */
export type ImportDocLang = 'ar' | 'en';

/** `source_tier` from the research file */
export type ImportSourceTier = 'official' | 'foreign_government_report' | 'intergovernmental_or_foreign_government_report';

/**
 * Short label shown after a source link: markets_v2.import.source_labels.<label>.
 * Every source whose tier is not `official` has one.
 */
export type ImportSourceLabel = 'us_government_report' | 'copy_elsewhere' | 'fao_study';

export interface ImportSource {
    /** Key for markets_v2.import.sources.<id> (title, optional lead_in); also the guide's anchor id */
    id: string;
    url: string;
    /** Language(s) of the linked document */
    lang: ImportDocLang[];
    tier: ImportSourceTier;
    label?: ImportSourceLabel;
    /** Document date (ISO, YYYY / YYYY-MM / YYYY-MM-DD) when known; the year is shown */
    date?: string;
}

export interface MarketImport {
    /** Official site of the competent authority; its name is markets_v2.import.authorities.<market> */
    authority: { url: string } | null;
    /** Items in display order: id = markets_v2.import.items.<market>.<id> */
    items: { id: string; source: string }[];
}

const USDA_UAE =
    'https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=FAIRS%20Country%20Report%20Annual_Dubai_United%20Arab%20Emirates_TC2025-0008';

/** Every source cited by the import rules, keyed by id */
export const importSources: Record<string, ImportSource> = {
    uae_portal: {
        id: 'uae_portal',
        url: 'https://u.ae/en/information-and-services/health-and-fitness/Policy-and-governance/food-safety-and-health-tips',
        lang: ['en'],
        tier: 'official',
        date: '2026-11-10',
    },
    usda_uae: {
        id: 'usda_uae',
        url: USDA_UAE,
        lang: ['en'],
        tier: 'intergovernmental_or_foreign_government_report',
        label: 'us_government_report',
        date: '2025-11-21',
    },
    kw_res_6_2023: {
        id: 'kw_res_6_2023',
        url: 'https://faolex.fao.org/docs/pdf/kuw221743E.pdf',
        lang: ['en'],
        tier: 'intergovernmental_or_foreign_government_report',
        label: 'copy_elsewhere',
        date: '2023-04-30',
    },
    kw_model_hc: {
        id: 'kw_model_hc',
        url: 'https://pafn.gov.kw/assets/images/Uploads/202142915412.pdf',
        lang: ['ar', 'en'],
        tier: 'official',
        date: '2021-04-29',
    },
    kw_raqeb: {
        id: 'kw_raqeb',
        url: 'https://betacweb.pafn.gov.kw/Documents/Guides/Clearance_Request_EN.pdf',
        lang: ['en'],
        tier: 'official',
    },
    bh_guide: {
        id: 'bh_guide',
        url: 'https://www.moh.gov.bh/Content/Upload/File/638242462505098875-imported-food-guide-line-in-bahrain-english-version_EN.pdf',
        lang: ['en'],
        tier: 'official',
        date: '2023-07-06',
    },
    lb_fao_study: {
        id: 'lb_fao_study',
        url: 'https://www.agriculture.gov.lb/getattachment/3446e66a-1147-457b-a75f-08a5ca6b97a3/Assessment-of-the-Commercial-Seafood-Chain-in-Lebanon',
        lang: ['en'],
        tier: 'official',
        label: 'fao_study',
        date: '2018',
    },
    lb_239: {
        id: 'lb_239',
        url: 'https://www.unrwa.org/sites/default/files/decision_239-1.pdf',
        lang: ['en'],
        tier: 'intergovernmental_or_foreign_government_report',
        label: 'copy_elsewhere',
        date: '2009-05-16',
    },
    qa_guide: {
        id: 'qa_guide',
        url: 'https://emsfsa.moph.gov.qa/en/MOPH_Documents/Guides%20and%20Instructions/Food%20Importers%20Guide.pdf',
        lang: ['en'],
        tier: 'official',
        // The guide itself is undated; the research dates its file to 2017 (the lead-in says so)
        date: '2017',
    },
    qa_watheq: {
        id: 'qa_watheq',
        url: 'https://emsfsa.moph.gov.qa/ar/MOPH_Documents/%D9%88%D8%AB%D8%A7%D8%A6%D9%82%20%D8%A7%D9%84%D8%AA%D8%B3%D8%AC%D9%8A%D9%84/%D8%A7%D9%84%D8%A3%D8%B3%D8%B3%20%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9%20%D9%84%D8%AA%D8%B3%D8%AC%D9%8A%D9%84%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%AF%20%D8%A7%D9%84%D8%BA%D8%B0%D8%A7%D8%A6%D9%8A%D8%A9.pdf',
        lang: ['ar'],
        tier: 'official',
        date: '2023-10',
    },
    qa_third_party: {
        id: 'qa_third_party',
        url: 'https://emsfsa.moph.gov.qa/en/MOPH_Documents/Approved%20Lists/List%20of%20Technically%20Qualified%20Bodies%20as%20a%20Third%20Parties-23-DEC-2025.pdf',
        lang: ['en'],
        tier: 'official',
        date: '2025-12-23',
    },
    usda_iraq: {
        id: 'usda_iraq',
        url: 'https://agriexchange.apeda.gov.in/ImportRegulations/Iraq_Food_and_Agricultural_Import_Regulations_and_Standards_-_Narrative_Baghdad_Iraq_12-12-2011.pdf',
        lang: ['en'],
        tier: 'foreign_government_report',
        label: 'us_government_report',
        date: '2011-12-12',
    },
    sy_guide: {
        id: 'sy_guide',
        url: 'https://moaar.gov.sy/storage/attachments/articles/%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D8%B3%D8%AA%D9%8A%D8%B1%D8%A7%D8%AF-%D8%A7%D9%84%D8%AD%D9%8A%D9%88%D8%A7%D9%86%D8%A7%D8%AA-%D9%88%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%D9%87%D8%A7-Aw6eI9.pdf',
        lang: ['ar'],
        tier: 'official',
        date: '2021-07',
    },
};

/** Keyed by market slug (= companyConfig market key), in the site's market order. */
export const marketImport: Record<string, MarketImport> = {
    uae: {
        authority: null,
        items: [
            // First item names the bodies, attributed by the group's lead-in (authority not verified)
            { id: 'municipalities', source: 'usda_uae' },
            { id: 'aquatic', source: 'usda_uae' },
            { id: 'labels', source: 'usda_uae' },
            { id: 'dates', source: 'usda_uae' },
            { id: 'zad', source: 'uae_portal' },
        ],
    },
    kuwait: {
        authority: { url: 'https://pafn.gov.kw/' },
        items: [
            { id: 'resolution', source: 'kw_res_6_2023' },
            { id: 'high_risk', source: 'kw_res_6_2023' },
            { id: 'documents', source: 'kw_res_6_2023' },
            { id: 'certificate_issuer', source: 'kw_res_6_2023' },
            { id: 'certificate_content', source: 'kw_res_6_2023' },
            { id: 'inspection', source: 'kw_res_6_2023' },
            { id: 'model_certificate', source: 'kw_model_hc' },
            { id: 'raqeb', source: 'kw_raqeb' },
        ],
    },
    bahrain: {
        authority: { url: 'https://www.moh.gov.bh/Ministry/Regulations?lang=en' },
        items: [
            { id: 'ports', source: 'bh_guide' },
            { id: 'importer', source: 'bh_guide' },
            { id: 'registration', source: 'bh_guide' },
            { id: 'arrival', source: 'bh_guide' },
            { id: 'health_certificate', source: 'bh_guide' },
            { id: 'labels', source: 'bh_guide' },
            { id: 'dates', source: 'bh_guide' },
            { id: 'inspection', source: 'bh_guide' },
        ],
    },
    lebanon: {
        authority: { url: 'https://www.agriculture.gov.lb' },
        items: [
            { id: 'registration', source: 'lb_fao_study' },
            { id: 'labels', source: 'lb_fao_study' },
            { id: 'inspection', source: 'lb_fao_study' },
            { id: 'commitment', source: 'lb_fao_study' },
            { id: 'cold_chain_record', source: 'lb_fao_study' },
            { id: 'veterinary_certificate', source: 'lb_239' },
            { id: 'origin_certificate', source: 'lb_239' },
            { id: 'seal', source: 'lb_239' },
        ],
    },
    qatar: {
        authority: { url: 'https://emsfsa.moph.gov.qa/en/border-port-health' },
        items: [
            { id: 'control', source: 'qa_guide' },
            { id: 'health_certificate', source: 'qa_guide' },
            { id: 'detention', source: 'qa_guide' },
            { id: 'inspection', source: 'qa_guide' },
            { id: 'watheq', source: 'qa_watheq' },
            { id: 'third_party', source: 'qa_third_party' },
        ],
    },
    iraq: {
        // COSQC is a standards body, not the authority for fish imports: no authority label
        authority: null,
        items: [
            { id: 'cosqc', source: 'usda_iraq' },
            { id: 'licence', source: 'usda_iraq' },
            { id: 'certificates', source: 'usda_iraq' },
            { id: 'dates', source: 'usda_iraq' },
            { id: 'testing', source: 'usda_iraq' },
            // Last item: the report is from 2011, confirm the current steps
            { id: 'old_source', source: 'usda_iraq' },
        ],
    },
    syria: {
        authority: null,
        items: [
            // First item names the Directorate of Animal Health, attributed by the group's lead-in
            { id: 'application', source: 'sy_guide' },
            { id: 'disease_free', source: 'sy_guide' },
            { id: 'laboratory', source: 'sy_guide' },
            { id: 'labels', source: 'sy_guide' },
            { id: 'shelf_life', source: 'sy_guide' },
            { id: 'veterinary_certificate', source: 'sy_guide' },
        ],
    },
};

/** Market keys that have import rules, in display order */
export const importMarketKeys: string[] = Object.keys(marketImport);

export function getMarketImport(slug: string): MarketImport | undefined {
    return marketImport[slug];
}

/** Items grouped by source, in order of first appearance (one lead-in and one source link per group). */
export function groupBySource(items: MarketImport['items']): { source: ImportSource; ids: string[] }[] {
    const groups: { source: ImportSource; ids: string[] }[] = [];
    for (const item of items) {
        const group = groups.find((g) => g.source.id === item.source);
        if (group) group.ids.push(item.id);
        else groups.push({ source: importSources[item.source], ids: [item.id] });
    }
    return groups;
}

/** Every cited source once, in the order the markets cite them (the guide's source list starts with these). */
export const marketImportSources: ImportSource[] = importMarketKeys
    .flatMap((key) => groupBySource(marketImport[key].items).map((g) => g.source))
    .filter((s, i, all) => all.findIndex((x) => x.id === s.id) === i);
