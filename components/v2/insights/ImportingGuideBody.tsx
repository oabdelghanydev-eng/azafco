import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { CheckIcon, ExternalIcon, buttonClass, cardClass, cn, focusRing, typography } from '@/components/ui';
import { products } from '@/data/products';
import { importingDocuments, importingSources, importingTariffRows } from '@/data/guides';
import { productHref } from '@/lib/v2/routes';

/**
 * Body of the guide "Importing fresh fish from Egypt" in the insights article
 * template (design G, components/ui primitives and tokens). Content and sources
 * come from data/guides.ts and guides_page.importing.*; the HS table becomes a
 * label–value list on phones.
 *
 * Release rules (RELEASE-DECISIONS 14 Nov 2026):
 * - species names are the short catalogue names (data.products.<key>.name);
 * - eel is sold but not shown: it has no tariff row, document item or source here,
 *   and the species chips skip it;
 * - rows whose product key is not in data/products.ts are dropped (safety net).
 */

export const IMPORTING_SECTIONS = ['hs-codes', 'documents', 'cold-chain', 'enquiry', 'sources'] as const;
const COLD_ITEMS = ['temperature', 'ice', 'boxes', 'handovers', 'arrival'] as const;
const HS_SOURCES = ['wco_hs', 'taric'];
const COLD_SOURCES = ['reg_853_2004'];

/** Sold but not shown on the site (RELEASE-DECISIONS §6) */
const HIDDEN_PRODUCT_KEYS = new Set(['eels']);

const productByKey = (key: string) => products.find((p) => p.translationKey === key);

const tariffRows = importingTariffRows.filter((r) => !HIDDEN_PRODUCT_KEYS.has(r.productKey) && productByKey(r.productKey));
const documents = importingDocuments;
const sources = importingSources;

export const importingSourceCount = sources.length;

/** Inline links inside running text are underlined (WCAG 1.4.1, axe link-in-text-block). */
const inlineLink = cn('text-navy underline decoration-1 underline-offset-4 hover:decoration-2', focusRing);

function SourceRefs({ ids, label }: { ids: string[]; label: string }) {
    const shown = ids.filter((id) => sources.some((s) => s.id === id));
    if (shown.length === 0) return null;
    return (
        <span className={cn('ms-1', typography.caption)} aria-label={label} dir="ltr">
            {shown.map((id) => {
                const n = sources.findIndex((s) => s.id === id) + 1;
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

export async function importingSectionTitles(locale: string) {
    const t = await getTranslations({ locale, namespace: 'guides_page.importing' });
    return {
        'hs-codes': t('hs.title'),
        documents: t('docs.title'),
        'cold-chain': t('cold.title'),
        enquiry: t('enquiry.title'),
        sources: t('sources.title'),
    } as Record<(typeof IMPORTING_SECTIONS)[number], string>;
}

export default async function ImportingGuideBody({ locale, reviewedLabel }: { locale: string; reviewedLabel: string }) {
    const t = await getTranslations({ locale, namespace: 'guides_page.importing' });
    const tAll = await getTranslations({ locale });
    const sourceLabel = t('source_label');
    const name = (key: string) => tAll(`data.products.${key}.name`);
    const checklist = (t.raw('enquiry.checklist') ?? []) as string[];
    const newTab = tAll('v2.cta.opens_new_tab');

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

    return (
        <div className="flex flex-col gap-14 lg:gap-16">
            <div className="flex flex-col gap-6">
                <p className={cn('m-0 text-ink', typography.lead)}>{t('intro')}</p>
                <p className={cn(small, 'rounded-card border-s-4 border-solid border-gold bg-surface-offwhite p-4 lg:p-5')}>{t('disclaimer')}</p>
            </div>

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

            {/* Documents */}
            <section id="documents" aria-labelledby="documents-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="documents-title" className={h2}>
                    {t('docs.title')}
                </h2>
                <p className={p}>{t('docs.intro')}</p>
                <ol className="m-0 flex list-none flex-col gap-3 p-0">
                    {documents.map((doc, i) => (
                        <li key={doc.id} className={cardClass({ padding: 'sm' })}>
                            <h3 className={cn(h3, 'flex gap-3')}>
                                <span dir="ltr" aria-hidden="true" className="shrink-0 text-navy">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {t(`docs.items.${doc.id}.title`)}
                            </h3>
                            <p className={cn(small, 'mt-2')}>
                                {t(`docs.items.${doc.id}.text`)}
                                <SourceRefs ids={doc.sources} label={sourceLabel} />
                            </p>
                        </li>
                    ))}
                </ol>
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

            {/* Requirements */}
            <section id="enquiry" aria-labelledby="enquiry-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="enquiry-title" className={h2}>
                    {t('enquiry.title')}
                </h2>
                <p className={p}>{t('enquiry.intro')}</p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {checklist.map((item) => (
                        <li key={item} className={cn('flex items-start gap-3 text-ink', typography.body)}>
                            <CheckIcon size={20} className="mt-1 text-navy" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <h3 className={cn(h3, 'mt-4')}>{t('enquiry.species_title')}</h3>
                <p className={small}>{t('enquiry.species_text')}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {products
                        .filter((x) => !HIDDEN_PRODUCT_KEYS.has(x.translationKey))
                        .map((x) => (
                            <li key={x.slug}>
                                <Link href={productHref(x.slug)} className={buttonClass({ variant: 'outline', size: 'sm' })}>
                                    {name(x.translationKey)}
                                </Link>
                            </li>
                        ))}
                </ul>
            </section>

            {/* Sources */}
            <section id="sources" aria-labelledby="sources-title" className="flex scroll-mt-28 flex-col gap-4">
                <h2 id="sources-title" className={h2}>
                    {t('sources.title')}
                </h2>
                <p className={p}>{t('sources.intro', { date: reviewedLabel })}</p>
                <ol className={cn('m-0 list-decimal space-y-2 ps-6 text-ink', typography.small)} dir="ltr" lang="en">
                    {sources.map((s) => (
                        <li key={s.id} id={`source-${s.id}`} className="scroll-mt-28">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className={cn('inline-block py-1', inlineLink)}>
                                {s.title}
                                <span className="sr-only"> {newTab}</span>
                                <ExternalIcon size={16} className="ms-1 align-[-2px]" />
                            </a>{' '}
                            <span className="text-ink-muted">({s.publisher})</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
