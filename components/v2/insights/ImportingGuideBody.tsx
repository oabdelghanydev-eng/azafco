import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { CheckIcon } from '@/components/v2/icons';
import { products } from '@/data/products';
import { importingDocuments, importingSources, importingTariffRows } from '@/data/guides';
import { productHref } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import { gH3 } from '@/components/v2/contact/g';

/**
 * Body of the guide "Importing fresh fish from Egypt" in the insights article
 * template (design G). Content and sources come from data/guides.ts and
 * guides_page.importing.*; the HS table becomes a label–value list on mobile.
 *
 * Release rules (RELEASE-DECISIONS 14 Nov 2026):
 * - species names are the short catalogue names (data.products.<key>.name);
 * - eel is sold but not shown: its tariff row, the CITES document item and the
 *   eel-only sources are filtered out here;
 * - rows whose product key is no longer in data/products.ts (old "buni") are dropped.
 */

export const IMPORTING_SECTIONS = ['hs-codes', 'documents', 'cold-chain', 'enquiry', 'sources'] as const;
const COLD_ITEMS = ['temperature', 'ice', 'boxes', 'handovers', 'arrival'] as const;
const HS_SOURCES = ['wco_hs', 'taric'];
const COLD_SOURCES = ['reg_853_2004'];

/** Not shown on the site (eel): product keys, document items and their sources */
const HIDDEN_PRODUCT_KEYS = new Set(['eels']);
const HIDDEN_DOCUMENTS = new Set(['cites']);
const HIDDEN_SOURCES = new Set(['cites_eel', 'eprs_eel']);

const productByKey = (key: string) => products.find((p) => p.translationKey === key);

const tariffRows = importingTariffRows.filter((r) => !HIDDEN_PRODUCT_KEYS.has(r.productKey) && productByKey(r.productKey));
const documents = importingDocuments.filter((d) => !HIDDEN_DOCUMENTS.has(d.id));
const sources = importingSources.filter((s) => !HIDDEN_SOURCES.has(s.id));

export const importingSourceCount = sources.length;

function SourceRefs({ ids, label }: { ids: string[]; label: string }) {
    const shown = ids.filter((id) => sources.some((s) => s.id === id));
    if (shown.length === 0) return null;
    return (
        <span className="ms-1 text-[14px]" aria-label={label}>
            {shown.map((id) => {
                const n = sources.findIndex((s) => s.id === id) + 1;
                return (
                    <a key={id} href={`#source-${id}`} className="inline-block min-h-[24px] px-0.5 font-bold text-[#002d72] underline-offset-2 hover:underline">
                        [{n}]
                    </a>
                );
            })}
        </span>
    );
}

const h2Cls = (ar: boolean) =>
    cn(
        'm-0 scroll-mt-28 text-[#0d1f3f]',
        ar ? 'text-[26px] font-bold leading-[1.45] lg:text-[32px]' : 'text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] lg:text-[34px]',
    );
const p = 'm-0 text-[#0d1f3f]';
const muted = 'text-[#4a5a75]';

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
    const ar = locale === 'ar';
    const t = await getTranslations({ locale, namespace: 'guides_page.importing' });
    const tAll = await getTranslations({ locale });
    const sourceLabel = t('source_label');
    const name = (key: string) => tAll(`data.products.${key}.name`);
    const checklist = (t.raw('enquiry.checklist') ?? []) as string[];
    const h2 = h2Cls(ar);
    const h3 = cn(gH3(ar), 'text-[#0d1f3f]');

    return (
        <div className="flex flex-col gap-14 lg:gap-16">
            <div className="flex flex-col gap-6">
                <p className={cn(p, ar ? 'text-[19px] leading-[1.85] lg:text-[20px]' : 'text-[18px] leading-[1.65] lg:text-[19px]')}>{t('intro')}</p>
                <p className={cn('m-0 rounded border-s-4 border-[#f7b500] bg-[#f2f5fa] p-4 text-[15px] lg:p-5', muted)}>{t('disclaimer')}</p>
            </div>

            {/* HS codes */}
            <section id="hs-codes" aria-labelledby="hs-codes-title" className="flex flex-col gap-4">
                <h2 id="hs-codes-title" className={h2}>
                    {t('hs.title')}
                </h2>
                <p className={p}>
                    {t('hs.intro_1')}
                    <SourceRefs ids={HS_SOURCES} label={sourceLabel} />
                </p>
                <p className={p}>{t('hs.intro_2')}</p>

                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded border border-[#d5dde9] md:block">
                    <table className="w-full text-[15px]">
                        <caption className="bg-[#f2f5fa] p-4 text-start font-bold text-[#0d1f3f]">{t('hs.table_caption')}</caption>
                        <thead className="bg-[#002d72] text-white">
                            <tr>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_species')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_scientific')}</th>
                                <th scope="col" className="whitespace-nowrap p-3 text-start font-bold">{t('hs.col_hs')}</th>
                                <th scope="col" className="whitespace-nowrap p-3 text-start font-bold">{t('hs.col_cn')}</th>
                                <th scope="col" className="p-3 text-start font-bold">{t('hs.col_notes')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d5dde9]">
                            {tariffRows.map((row) => {
                                const slug = productByKey(row.productKey)?.slug;
                                return (
                                    <tr key={row.productKey} className="align-top">
                                        <th scope="row" className="p-3 text-start font-bold text-[#0d1f3f]">
                                            {slug ? (
                                                <Link href={productHref(slug)} className="text-[#002d72] underline-offset-4 hover:underline">
                                                    {name(row.productKey)}
                                                </Link>
                                            ) : (
                                                name(row.productKey)
                                            )}
                                        </th>
                                        <td className={cn('p-3 italic', muted)} lang="la">{row.scientificName}</td>
                                        <td className="whitespace-nowrap p-3 font-mono" dir="ltr">{row.hs}</td>
                                        <td className="whitespace-nowrap p-3 font-mono" dir="ltr">{row.cn}</td>
                                        <td className={cn('p-3', muted)}>{row.note ? t(`hs.notes.${row.note}`) : '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: label–value list per species */}
                <div className="md:hidden">
                    <p className="m-0 mb-3 font-bold text-[#0d1f3f]">{t('hs.table_caption')}</p>
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {tariffRows.map((row) => {
                            const slug = productByKey(row.productKey)?.slug;
                            return (
                                <li key={row.productKey} className="rounded border border-[#d5dde9] p-4">
                                    <p className="m-0 font-bold text-[#0d1f3f]">
                                        {slug ? (
                                            <Link href={productHref(slug)} className="text-[#002d72] underline underline-offset-4">
                                                {name(row.productKey)}
                                            </Link>
                                        ) : (
                                            name(row.productKey)
                                        )}
                                    </p>
                                    <p className={cn('m-0 text-[15px] italic', muted)} lang="la">{row.scientificName}</p>
                                    <dl className="m-0 mt-3 grid grid-cols-2 gap-2 text-[15px]">
                                        <dt className={muted}>{t('hs.col_hs')}</dt>
                                        <dd className="m-0 font-mono" dir="ltr">{row.hs}</dd>
                                        <dt className={muted}>{t('hs.col_cn')}</dt>
                                        <dd className="m-0 font-mono" dir="ltr">{row.cn}</dd>
                                    </dl>
                                    {row.note ? <p className={cn('m-0 mt-2 text-[14px]', muted)}>{t(`hs.notes.${row.note}`)}</p> : null}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <p className={cn('m-0 text-[15px]', muted)}>
                    {t('hs.more')} {t('hs.after', { date: reviewedLabel })}
                </p>
            </section>

            {/* Documents */}
            <section id="documents" aria-labelledby="documents-title" className="flex flex-col gap-4">
                <h2 id="documents-title" className={h2}>
                    {t('docs.title')}
                </h2>
                <p className={p}>{t('docs.intro')}</p>
                <ol className="m-0 flex list-none flex-col gap-3 p-0">
                    {documents.map((doc, i) => (
                        <li key={doc.id} className="rounded border border-[#d5dde9] p-5">
                            <h3 className={cn(h3, 'flex gap-3')}>
                                <span dir="ltr" aria-hidden="true" className="shrink-0 text-[#002d72]">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {t(`docs.items.${doc.id}.title`)}
                            </h3>
                            <p className={cn('m-0 mt-2 text-[15px]', muted)}>
                                {t(`docs.items.${doc.id}.text`)}
                                <SourceRefs ids={doc.sources} label={sourceLabel} />
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Cold chain */}
            <section id="cold-chain" aria-labelledby="cold-chain-title" className="flex flex-col gap-4">
                <h2 id="cold-chain-title" className={h2}>
                    {t('cold.title')}
                </h2>
                <p className={p}>
                    {t('cold.intro')}
                    <SourceRefs ids={COLD_SOURCES} label={sourceLabel} />
                </p>
                <dl className="m-0 grid gap-4 sm:grid-cols-2">
                    {COLD_ITEMS.map((id) => (
                        <div key={id} className="rounded bg-[#f2f5fa] p-5">
                            <dt className="font-bold text-[#0d1f3f]">{t(`cold.items.${id}.title`)}</dt>
                            <dd className={cn('m-0 mt-1 text-[15px]', muted)}>{t(`cold.items.${id}.text`)}</dd>
                        </div>
                    ))}
                </dl>
                <p className="m-0 rounded border-s-4 border-[#002d72] bg-[#f2f5fa] p-4 font-semibold text-[#0d1f3f] lg:p-5">{t('cold.azafco')}</p>
            </section>

            {/* Requirements */}
            <section id="enquiry" aria-labelledby="enquiry-title" className="flex flex-col gap-4">
                <h2 id="enquiry-title" className={h2}>
                    {t('enquiry.title')}
                </h2>
                <p className={p}>{t('enquiry.intro')}</p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {checklist.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[#0d1f3f]">
                            <CheckIcon size={18} className="mt-1 shrink-0 text-[#002d72]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <h3 className={cn(h3, 'mt-4')}>{t('enquiry.species_title')}</h3>
                <p className={cn('m-0 text-[15px]', muted)}>{t('enquiry.species_text')}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                    {products
                        .filter((x) => !HIDDEN_PRODUCT_KEYS.has(x.translationKey))
                        .map((x) => (
                            <li key={x.slug}>
                                <Link
                                    href={productHref(x.slug)}
                                    className="inline-flex min-h-[44px] items-center rounded-full border border-[#d5dde9] px-4 text-[15px] font-semibold text-[#002d72] transition-colors hover:border-[#002d72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]"
                                >
                                    {name(x.translationKey)}
                                </Link>
                            </li>
                        ))}
                </ul>
            </section>

            {/* Sources */}
            <section id="sources" aria-labelledby="sources-title" className="flex flex-col gap-4">
                <h2 id="sources-title" className={h2}>
                    {t('sources.title')}
                </h2>
                <p className={p}>{t('sources.intro', { date: reviewedLabel })}</p>
                <ol className="m-0 list-decimal space-y-2 ps-6 text-[15px] text-[#0d1f3f]" dir="ltr" lang="en">
                    {sources.map((s) => (
                        <li key={s.id} id={`source-${s.id}`} className="scroll-mt-28">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#002d72] underline-offset-4 hover:underline">
                                {s.title}
                            </a>{' '}
                            <span className={muted}>({s.publisher})</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
