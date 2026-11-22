import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ExternalIcon, ExternalLink, TextLink, cardClass, cn, focusRing, typography } from '@/components/ui';
import { products } from '@/data/products';
import { importingDocuments, importingEuItems, importingSources, importingTariffRows } from '@/data/guides';
import { MARKET_IMPORT_REVIEWED, REVIEW_DATE_FORMAT, importMarketKeys, isoDate, marketImportSources } from '@/data/market-import';
import { importSourceViewer, marketImportView } from '@/components/v2/markets/importRules';
import { productHref, routes } from '@/lib/v2/routes';

/**
 * Body of the guide "Importing fresh fish from Egypt" in the insights article
 * template (design G, components/ui primitives and tokens). Content and sources
 * come from data/guides.ts and guides_page.importing.*; the HS table becomes a
 * label–value list on phones.
 *
 * Order (ROUND1-SPEC §3, 14 Nov 2026): answer-first summary, the Gulf and Levant
 * import rules (AZAFCO's real markets, verified items only), HS codes, documents,
 * cold chain, then the EU rules ("Exporting to the European Union": AZAFCO is approved
 * for export to the EU, owner 22 Nov 2026). Never an approval number or date, and
 * nothing that says shipments to the EU have taken place.
 *
 * The Gulf and Levant section is built from data/market-import.ts and the market
 * pages' strings (markets_v2.import.*), so the guide and the market pages show the
 * same items, authorities, lead-ins and sources (ROUND1-SPEC §6 R4). Those sources
 * open the source list, followed by the HS, EU and cold-chain sources of data/guides.ts.
 *
 * Release rules (RELEASE-DECISIONS 14 Nov 2026):
 * - species names are the short catalogue names (data.products.<key>.name);
 * - eel is sold but not shown: it has no tariff row here;
 * - rows whose product key is not in data/products.ts are dropped (safety net).
 */

export const IMPORTING_SECTIONS = ['gulf-levant', 'hs-codes', 'documents', 'cold-chain', 'europe', 'enquiry', 'sources'] as const;
const COLD_ITEMS = ['ice', 'boxes', 'handovers', 'arrival'] as const;
/** Five-line answer-first summary: guides_page.importing.summary.<line> */
const SUMMARY_LINES = ['who', 'markets', 'codes', 'europe', 'reviewed'] as const;
const HS_SOURCES = ['wco_hs', 'taric'];
const COLD_SOURCES = ['reg_853_2004'];
const EU_INTRO_SOURCES = ['reg_2026_2228'];

/** Sold but not shown on the site (RELEASE-DECISIONS §6) */
const HIDDEN_PRODUCT_KEYS = new Set(['eels']);

const productByKey = (key: string) => products.find((p) => p.translationKey === key);

const tariffRows = importingTariffRows.filter((r) => !HIDDEN_PRODUCT_KEYS.has(r.productKey) && productByKey(r.productKey));

/** Source ids in list order: the market import sources first, then the guide's own sources */
const sourceIds = [...marketImportSources.map((s) => s.id), ...importingSources.map((s) => s.id)];

export const importingSourceCount = sourceIds.length;

export interface GuideSourceView {
    id: string;
    url: string;
    /** Visible title */
    title: string;
    /** Language of the title when it is fixed (the guide's own sources keep their original titles) */
    titleLang?: string;
    publisher?: string;
    year?: string;
    /** Languages of the linked document */
    docLang: string[];
    /** Document language (when it differs from the page) and source type */
    notes: string[];
}

/** The guide's numbered source list in the page language (also used for the Article citation). */
export async function importingSourceList(locale: string): Promise<GuideSourceView[]> {
    const view = await importSourceViewer(locale);
    return [
        ...marketImportSources.map((s): GuideSourceView => {
            const v = view(s);
            return { id: v.id, url: v.url, title: v.title, year: v.year, docLang: v.docLang, notes: v.notes };
        }),
        ...importingSources.map(
            (s): GuideSourceView => ({
                id: s.id,
                url: s.url,
                title: s.title,
                titleLang: s.lang ?? 'en',
                publisher: s.publisher,
                docLang: [s.lang ?? 'en'],
                notes: [],
            }),
        ),
    ];
}

/** Inline links inside running text are underlined (WCAG 1.4.1, axe link-in-text-block). */
const inlineLink = cn('text-navy underline decoration-1 underline-offset-4 hover:decoration-2', focusRing);

function SourceRefs({ ids, label }: { ids: string[]; label: string }) {
    const shown = ids.filter((id) => sourceIds.includes(id));
    if (shown.length === 0) return null;
    return (
        <span className={cn('ms-1', typography.caption)} aria-label={label} dir="ltr">
            {shown.map((id) => {
                const n = sourceIds.indexOf(id) + 1;
                return (
                    <a key={id} href={`#source-${id}`} className={cn('inline-block min-h-6 px-0.5 font-bold', inlineLink)}>
                        [{n}]
                    </a>
                );
            })}
        </span>
    );
}

const h2 = cn('m-0 scroll-mt-28 text-ink', typography.h2Sm);
const h3 = cn('m-0 text-ink', typography.h3);
const p = cn('m-0 text-ink', typography.body);
const small = cn('m-0 text-ink-muted', typography.small);
const note = cn(small, 'rounded-card border-s-4 border-solid border-gold bg-surface-offwhite p-4 lg:p-5');

export async function importingSectionTitles(locale: string) {
    const t = await getTranslations({ locale, namespace: 'guides_page.importing' });
    return {
        'gulf-levant': t('markets.title'),
        'hs-codes': t('hs.title'),
        documents: t('docs.title'),
        'cold-chain': t('cold.title'),
        europe: t('eu.title'),
        enquiry: t('enquiry.title'),
        sources: t('sources.title'),
    } as Record<(typeof IMPORTING_SECTIONS)[number], string>;
}

export default async function ImportingGuideBody({ locale, reviewedLabel }: { locale: string; reviewedLabel: string }) {
    const t = await getTranslations({ locale, namespace: 'guides_page.importing' });
    const tAll = await getTranslations({ locale });
    const tImport = await getTranslations({ locale, namespace: 'markets_v2.import' });
    const format = await getFormatter({ locale });
    const sourceLabel = t('source_label');
    const name = (key: string) => tAll(`data.products.${key}.name`);
    const newTab = tAll('v2.cta.opens_new_tab');

    // Gulf and Levant: the same view the market pages render (data/market-import.ts + markets_v2.import.*)
    const markets = await Promise.all(importMarketKeys.map(async (key) => ({ key, view: await marketImportView(locale, key) })));
    const sources = await importingSourceList(locale);

    const speciesCell = (key: string) => {
        const slug = productByKey(key)?.slug;
        return slug ? (
            <Link href={productHref(slug)} className={inlineLink}>
                {name(key)}
            </Link>
        ) : (
            name(key)
        );
    };

    /** Numbered card list used for the general documents and the EU items */
    const itemCards = (items: { id: string; sources: string[] }[], prefix: 'docs' | 'eu') => (
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {items.map((doc, i) => (
                <li key={doc.id} className={cardClass({ padding: 'sm' })}>
                    <h3 className={cn(h3, 'flex gap-3')}>
                        <span dir="ltr" aria-hidden="true" className="shrink-0 text-navy">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        {t(`${prefix}.items.${doc.id}.title`)}
                    </h3>
                    <p className={cn(small, 'mt-2')}>
                        {t(`${prefix}.items.${doc.id}.text`)}
                        <SourceRefs ids={doc.sources} label={sourceLabel} />
                    </p>
                </li>
            ))}
        </ol>
    );

    return (
        <div className="flex flex-col gap-14 lg:gap-16">
            {/* Answer-first summary */}
            <div className="flex flex-col gap-6">
                <div className="rounded-card border-s-4 border-solid border-navy bg-surface-offwhite p-5 lg:p-6">
                    <p className="m-0 font-bold text-ink">{t('summary_title')}</p>
                    <ul className={cn('m-0 mt-3 flex list-disc flex-col gap-2 ps-5 text-ink', typography.body)}>
                        {SUMMARY_LINES.map((line) => (
                            <li key={line}>{t(`summary.${line}`, { date: reviewedLabel })}</li>
                        ))}
                    </ul>
                </div>
                <p className={note}>{t('disclaimer')}</p>
            </div>

            {/* Gulf and Levant */}
            <section id="gulf-levant" aria-labelledby="gulf-levant-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="gulf-levant-title" className={h2}>
                    {t('markets.title')}
                </h2>
                <p className={p}>{t('markets.intro')}</p>
                <ul className="m-0 flex list-none flex-col gap-4 p-0">
                    {markets.map(({ key, view }) =>
                        view && view.groups.length ? (
                            <li key={key} className={cardClass({ padding: 'sm' })}>
                                <h3 className={h3}>
                                    <Link href={`${routes.markets}/${key}`} className={inlineLink}>
                                        {tAll(`data.markets.${key}.country`)}
                                    </Link>
                                </h3>
                                {view.authority ? (
                                    <p className={cn('m-0 mt-3 flex flex-wrap items-center gap-x-2 text-ink', typography.small)}>
                                        <span className="font-bold">{view.authority.label}</span>
                                        <ExternalLink href={view.authority.url} newTabLabel={newTab}>
                                            <bdi>{view.authority.name}</bdi>
                                        </ExternalLink>
                                    </p>
                                ) : null}
                                {view.groups.map((g) => (
                                    <div key={g.source.id} className={cn('mt-3', typography.small)}>
                                        {g.source.leadIn ? (
                                            <p className="m-0 font-bold text-ink">
                                                {g.source.leadIn}
                                                <SourceRefs ids={[g.source.id]} label={sourceLabel} />
                                            </p>
                                        ) : null}
                                        {g.caveats.map((c) => (
                                            <p key={c.id} className="m-0 mt-1.5 text-ink">
                                                {c.text}
                                            </p>
                                        ))}
                                        <ul
                                            className={cn(
                                                'm-0 flex list-disc flex-col gap-1.5 ps-5 text-ink-muted',
                                                (g.source.leadIn || g.caveats.length > 0) && 'mt-1.5',
                                            )}
                                        >
                                            {g.items.map((item, i) => (
                                                <li key={item.id}>
                                                    {item.text}
                                                    {!g.source.leadIn && i === g.items.length - 1 ? <SourceRefs ids={[g.source.id]} label={sourceLabel} /> : null}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </li>
                        ) : null,
                    )}
                </ul>
                <p className={small}>
                    {tImport.rich('reviewed', {
                        date: format.dateTime(isoDate(MARKET_IMPORT_REVIEWED), REVIEW_DATE_FORMAT),
                        time: (chunks) => <time dateTime={MARKET_IMPORT_REVIEWED}>{chunks}</time>,
                    })}
                </p>
                <p className={note}>{tImport('disclaimer')}</p>
            </section>

            {/* HS codes */}
            <section id="hs-codes" aria-labelledby="hs-codes-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="hs-codes-title" className={h2}>
                    {t('hs.title')}
                </h2>
                <p className={p}>
                    {t('hs.intro_1')}
                    <SourceRefs ids={HS_SOURCES} label={sourceLabel} />
                </p>
                <p className={p}>{t('hs.intro_2')}</p>

                {/* Tablet and up: table */}
                <div className="hidden overflow-hidden rounded-card border border-solid border-line md:block">
                    <table className={cn('w-full border-collapse', typography.small)}>
                        <caption className="bg-surface-offwhite p-4 text-start font-bold text-ink">{t('hs.table_caption')}</caption>
                        <thead className="bg-navy text-white">
                            <tr>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_species')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_scientific')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_hs')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_cn')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_notes')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-solid divide-line">
                            {tariffRows.map((row) => (
                                <tr key={row.productKey} className="align-top">
                                    <th scope="row" className="p-3 text-start font-bold text-ink">
                                        {speciesCell(row.productKey)}
                                    </th>
                                    <td className="p-3 italic text-ink-muted" lang="la">
                                        {row.scientificName}
                                    </td>
                                    <td className="whitespace-nowrap p-3 font-mono text-ink" dir="ltr">
                                        {row.hs}
                                    </td>
                                    <td className="whitespace-nowrap p-3 font-mono text-ink" dir="ltr">
                                        {row.cn}
                                    </td>
                                    <td className="min-w-[180px] p-3 text-ink-muted">{row.note ? t(`hs.notes.${row.note}`) : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phones: label–value list per species */}
                <div className="md:hidden">
                    <p className="m-0 mb-3 font-bold text-ink">{t('hs.table_caption')}</p>
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {tariffRows.map((row) => (
                            <li key={row.productKey} className={cardClass({ padding: 'sm' })}>
                                <p className="m-0 font-bold text-ink">{speciesCell(row.productKey)}</p>
                                <p className={cn(small, 'italic')} lang="la">
                                    {row.scientificName}
                                </p>
                                <dl className={cn('m-0 mt-3 grid grid-cols-2 gap-2', typography.small)}>
                                    <dt className="text-ink-muted">{t('hs.col_hs')}</dt>
                                    <dd className="m-0 font-mono text-ink" dir="ltr">
                                        {row.hs}
                                    </dd>
                                    <dt className="text-ink-muted">{t('hs.col_cn')}</dt>
                                    <dd className="m-0 font-mono text-ink" dir="ltr">
                                        {row.cn}
                                    </dd>
                                </dl>
                                {row.note ? <p className={cn('m-0 mt-2 text-ink-muted', typography.caption)}>{t(`hs.notes.${row.note}`)}</p> : null}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className={small}>{t('hs.after', { date: reviewedLabel })}</p>
            </section>

            {/* Documents (any destination) */}
            <section id="documents" aria-labelledby="documents-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="documents-title" className={h2}>
                    {t('docs.title')}
                </h2>
                <p className={p}>{t('docs.intro')}</p>
                {itemCards(importingDocuments, 'docs')}
            </section>

            {/* Cold chain */}
            <section id="cold-chain" aria-labelledby="cold-chain-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="cold-chain-title" className={h2}>
                    {t('cold.title')}
                </h2>
                <p className={p}>
                    {t('cold.intro')}
                    <SourceRefs ids={COLD_SOURCES} label={sourceLabel} />
                </p>
                <dl className="m-0 grid gap-4 sm:grid-cols-2">
                    {COLD_ITEMS.map((id) => (
                        <div key={id} className="rounded-card bg-surface-offwhite p-5">
                            <dt className="font-bold text-ink">{t(`cold.items.${id}.title`)}</dt>
                            <dd className={cn(small, 'mt-1')}>{t(`cold.items.${id}.text`)}</dd>
                        </div>
                    ))}
                </dl>
                <p className={cn(p, 'rounded-card border-s-4 border-solid border-navy bg-surface-offwhite p-4 font-semibold lg:p-5')}>{t('cold.azafco')}</p>
            </section>

            {/* Europe: approved for export (no number, no date), then the EU rules */}
            <section id="europe" aria-labelledby="europe-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="europe-title" className={h2}>
                    {t('eu.title')}
                </h2>
                <p className={p}>
                    {t('eu.intro')}
                    <SourceRefs ids={EU_INTRO_SOURCES} label={sourceLabel} />
                </p>
                {itemCards(importingEuItems, 'eu')}
            </section>

            {/* Next step */}
            <section id="enquiry" aria-labelledby="enquiry-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="enquiry-title" className={h2}>
                    {t('enquiry.title')}
                </h2>
                <p className={p}>{t('enquiry.intro')}</p>
                <p className="m-0">
                    <TextLink href={routes.rfq} dataAttrs={{ 'data-cta': 'guide_requirements' }}>
                        {t('enquiry.cta_requirements')}
                    </TextLink>
                </p>
            </section>

            {/* Sources */}
            <section id="sources" aria-labelledby="sources-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="sources-title" className={h2}>
                    {t('sources.title')}
                </h2>
                <p className={p}>{t('sources.intro', { date: reviewedLabel })}</p>
                <ol className={cn('m-0 list-decimal space-y-2 ps-6 text-ink', typography.small)}>
                    {sources.map((src) => {
                        // Market sources are described in the page language; the guide's own sources keep their English titles
                        const textLang =
                            src.titleLang && src.titleLang !== locale
                                ? { lang: src.titleLang, dir: src.titleLang === 'ar' ? ('rtl' as const) : ('ltr' as const) }
                                : {};
                        return (
                            <li key={src.id} id={`source-${src.id}`} className="scroll-mt-28">
                                <a href={src.url} target="_blank" rel="noopener noreferrer" className={cn('inline-block py-1', inlineLink)} {...textLang}>
                                    {src.title}
                                    {src.year ? <> ({src.year})</> : null}
                                    <span className="sr-only"> {newTab}</span>
                                    <ExternalIcon size={16} className="ms-1 align-[-2px]" />
                                </a>
                                {src.publisher ? (
                                    <>
                                        {' '}
                                        <span className="text-ink-muted" {...textLang}>
                                            ({src.publisher})
                                        </span>
                                    </>
                                ) : null}
                                {src.notes.length ? <span className="text-ink-muted"> · {src.notes.join(' · ')}</span> : null}
                            </li>
                        );
                    })}
                </ol>
            </section>
        </div>
    );
}
