import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { CheckIcon } from '@/components/v2';
import { products } from '@/data/products';
import { importingDocuments, importingSources, importingTariffRows } from '@/data/guides';
import { productHref } from '@/lib/v2/routes';

/**
 * Body of the guide "Importing fresh fish from Egypt" in the v2 article
 * template. Same content and sources as /guides/importing-fresh-fish-from-egypt
 * (guides_page.importing.*), restyled; the HS table becomes a label–value list on mobile.
 */

export const IMPORTING_SECTIONS = ['hs-codes', 'documents', 'cold-chain', 'enquiry', 'sources'] as const;
const COLD_ITEMS = ['temperature', 'ice', 'boxes', 'handovers', 'arrival'] as const;
const HS_SOURCES = ['wco_hs', 'taric'];
const COLD_SOURCES = ['reg_853_2004'];

export const importingSourceCount = importingSources.length;

function SourceRefs({ ids, label }: { ids: string[]; label: string }) {
    if (ids.length === 0) return null;
    return (
        <span className="ms-1 text-caption" aria-label={label}>
            {ids.map((id) => {
                const n = importingSources.findIndex((s) => s.id === id) + 1;
                return (
                    <a key={id} href={`#source-${id}`} className="inline-block px-0.5 font-semibold text-navy underline-offset-2 hover:underline">
                        [{n}]
                    </a>
                );
            })}
        </span>
    );
}

const h2 = 'v2-heading scroll-mt-28 font-display text-heading-xl text-navy';
const p = 'text-body text-ink';

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
    const slugOf = (key: string) => products.find((x) => x.translationKey === key)?.slug;
    const checklist = (t.raw('enquiry.checklist') ?? []) as string[];

    return (
        <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-6">
                <p className="text-body-lg text-ink">{t('intro')}</p>
                <p className="rounded-control border-s-4 border-gold bg-surface-offwhite p-4 text-body-sm text-ink-muted">{t('disclaimer')}</p>
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
                <div className="hidden overflow-hidden rounded-card border border-line md:block">
                    <table className="w-full text-body-sm">
                        <caption className="bg-surface-offwhite p-4 text-start font-semibold text-ink">{t('hs.table_caption')}</caption>
                        <thead className="bg-navy text-white">
                            <tr>
                                <th scope="col" className="p-3 text-start font-semibold">{t('hs.col_species')}</th>
                                <th scope="col" className="p-3 text-start font-semibold">{t('hs.col_scientific')}</th>
                                <th scope="col" className="whitespace-nowrap p-3 text-start font-semibold">{t('hs.col_hs')}</th>
                                <th scope="col" className="whitespace-nowrap p-3 text-start font-semibold">{t('hs.col_cn')}</th>
                                <th scope="col" className="p-3 text-start font-semibold">{t('hs.col_notes')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {importingTariffRows.map((row) => {
                                const slug = slugOf(row.productKey);
                                const name = t(`hs.species.${row.productKey}`);
                                return (
                                    <tr key={row.productKey} className="align-top">
                                        <th scope="row" className="p-3 text-start font-semibold text-ink">
                                            {slug ? (
                                                <Link href={productHref(slug)} className="text-navy underline-offset-4 hover:underline">
                                                    {name}
                                                </Link>
                                            ) : (
                                                name
                                            )}
                                        </th>
                                        <td className="p-3 italic text-ink-muted" lang="la">{row.scientificName}</td>
                                        <td className="whitespace-nowrap p-3 font-mono" dir="ltr">{row.hs}</td>
                                        <td className="whitespace-nowrap p-3 font-mono" dir="ltr">{row.cn}</td>
                                        <td className="p-3 text-ink-muted">
                                            {row.note ? t(`hs.notes.${row.note}`) : '—'}
                                            {row.note === 'eel' ? <SourceRefs ids={['cites_eel']} label={sourceLabel} /> : null}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: label–value list per species */}
                <div className="md:hidden">
                    <p className="mb-3 font-semibold text-ink">{t('hs.table_caption')}</p>
                    <ul className="flex flex-col gap-3">
                        {importingTariffRows.map((row) => {
                            const slug = slugOf(row.productKey);
                            const name = t(`hs.species.${row.productKey}`);
                            return (
                                <li key={row.productKey} className="rounded-card border border-line p-4">
                                    <p className="font-semibold text-ink">
                                        {slug ? (
                                            <Link href={productHref(slug)} className="text-navy underline underline-offset-4">
                                                {name}
                                            </Link>
                                        ) : (
                                            name
                                        )}
                                    </p>
                                    <p className="text-body-sm italic text-ink-muted" lang="la">{row.scientificName}</p>
                                    <dl className="mt-3 grid grid-cols-2 gap-2 text-body-sm">
                                        <dt className="text-ink-muted">{t('hs.col_hs')}</dt>
                                        <dd className="font-mono" dir="ltr">{row.hs}</dd>
                                        <dt className="text-ink-muted">{t('hs.col_cn')}</dt>
                                        <dd className="font-mono" dir="ltr">{row.cn}</dd>
                                    </dl>
                                    {row.note ? (
                                        <p className="mt-2 text-caption text-ink-muted">
                                            {t(`hs.notes.${row.note}`)}
                                            {row.note === 'eel' ? <SourceRefs ids={['cites_eel']} label={sourceLabel} /> : null}
                                        </p>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <p className="text-body-sm text-ink-muted">{t('hs.after', { date: reviewedLabel })}</p>
            </section>

            {/* Documents */}
            <section id="documents" aria-labelledby="documents-title" className="flex flex-col gap-4">
                <h2 id="documents-title" className={h2}>
                    {t('docs.title')}
                </h2>
                <p className={p}>{t('docs.intro')}</p>
                <ol className="flex flex-col gap-3">
                    {importingDocuments.map((doc, i) => (
                        <li key={doc.id} className="rounded-card border border-line p-5">
                            <h3 className="flex gap-3 font-display text-heading-sm text-ink">
                                <span aria-hidden="true" className="text-gold-ink">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {t(`docs.items.${doc.id}.title`)}
                            </h3>
                            <p className="mt-2 text-body-sm text-ink-muted">
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
                <dl className="grid gap-4 sm:grid-cols-2">
                    {COLD_ITEMS.map((id) => (
                        <div key={id} className="rounded-card bg-surface-offwhite p-5">
                            <dt className="font-semibold text-ink">{t(`cold.items.${id}.title`)}</dt>
                            <dd className="mt-1 text-body-sm text-ink-muted">{t(`cold.items.${id}.text`)}</dd>
                        </div>
                    ))}
                </dl>
                <p className="rounded-control border-s-4 border-navy bg-surface-mist p-4 text-body-sm font-medium text-ink">{t('cold.azafco')}</p>
            </section>

            {/* Enquiry */}
            <section id="enquiry" aria-labelledby="enquiry-title" className="flex flex-col gap-4">
                <h2 id="enquiry-title" className={h2}>
                    {t('enquiry.title')}
                </h2>
                <p className={p}>{t('enquiry.intro')}</p>
                <ul className="flex flex-col gap-2">
                    {checklist.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-body text-ink">
                            <CheckIcon size={18} className="mt-1 shrink-0 text-navy" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <h3 className="mt-4 font-display text-heading-sm text-ink">{t('enquiry.species_title')}</h3>
                <p className="text-body-sm text-ink-muted">{t('enquiry.species_text')}</p>
                <ul className="flex flex-wrap gap-2">
                    {importingTariffRows.map((row) => {
                        const slug = slugOf(row.productKey);
                        if (!slug) return null;
                        return (
                            <li key={row.productKey}>
                                <Link
                                    href={productHref(slug)}
                                    className="inline-flex min-h-[44px] items-center rounded-full border border-line-strong px-4 text-body-sm font-medium text-navy hover:border-navy"
                                >
                                    {tAll(`data.products.${row.productKey}.name`)}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Sources */}
            <section id="sources" aria-labelledby="sources-title" className="flex flex-col gap-4">
                <h2 id="sources-title" className={h2}>
                    {t('sources.title')}
                </h2>
                <p className={p}>{t('sources.intro', { date: reviewedLabel })}</p>
                <ol className="list-decimal space-y-2 ps-6 text-body-sm text-ink" dir="ltr" lang="en">
                    {importingSources.map((s) => (
                        <li key={s.id} id={`source-${s.id}`} className="scroll-mt-28">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy underline-offset-4 hover:underline">
                                {s.title}
                            </a>{' '}
                            <span className="text-ink-muted">({s.publisher})</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
