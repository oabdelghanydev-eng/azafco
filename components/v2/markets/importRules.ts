import { getTranslations } from 'next-intl/server';
import { getMarketImport, groupBySource, type ImportSource } from '@/data/market-import';

/**
 * Translated view of data/market-import.ts, shared by the market pages
 * (MarketImportRules) and the import guide's Gulf and Levant section (ROUND1-SPEC §6 R4):
 * one data set, one set of strings (markets_v2.import.*). Server only.
 */

export interface ImportSourceView {
    id: string;
    url: string;
    /** Short description of the document, in the page language */
    title: string;
    /** Document year, when known */
    year?: string;
    /** Languages of the linked document (BCP 47), e.g. ['ar', 'en'] */
    docLang: string[];
    /** Short labels shown after the link: document language when it differs from the page, then the source type */
    notes: string[];
    /** One attribution sentence for the items that rest on this source */
    leadIn?: string;
}

export interface ImportGroupView {
    source: ImportSourceView;
    items: { id: string; text: string }[];
}

export interface MarketImportView {
    authority?: { label: string; name: string; url: string };
    groups: ImportGroupView[];
}

/** Returns a function that turns an ImportSource into its translated view for `locale`. */
export async function importSourceViewer(locale: string): Promise<(s: ImportSource) => ImportSourceView> {
    const t = await getTranslations({ locale, namespace: 'markets_v2.import' });
    return (s) => {
        const notes: string[] = [];
        if (!(s.lang as string[]).includes(locale)) notes.push(t(`doc_lang.${s.lang.join('_')}`));
        if (s.label) notes.push(t(`source_labels.${s.label}`));
        return {
            id: s.id,
            url: s.url,
            title: t(`sources.${s.id}.title`),
            year: s.date?.slice(0, 4),
            docLang: s.lang,
            notes,
            leadIn: t.has(`sources.${s.id}.lead_in`) ? t(`sources.${s.id}.lead_in`) : undefined,
        };
    };
}

/** Authority (where verified) and items grouped by source for one market; undefined if the market has no rules. */
export async function marketImportView(locale: string, key: string): Promise<MarketImportView | undefined> {
    const rules = getMarketImport(key);
    if (!rules) return undefined;
    const t = await getTranslations({ locale, namespace: 'markets_v2.import' });
    const view = await importSourceViewer(locale);
    return {
        authority: rules.authority ? { label: t('authority_label'), name: t(`authorities.${key}`), url: rules.authority.url } : undefined,
        groups: groupBySource(rules.items).map((g) => ({
            source: view(g.source),
            items: g.ids.map((id) => ({ id, text: t(`items.${key}.${id}`) })),
        })),
    };
}
