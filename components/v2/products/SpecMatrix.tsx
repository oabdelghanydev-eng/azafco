/**
 * Data-driven spec blocks for the product pages, fed by data/specs.ts
 * (lib/v2/specs.ts). Server components. Empty fields read "Confirmed with
 * sales"; nothing here may print a value that is not in the data.
 *
 *   <FormSpecMatrix slug="tilapia" name="Tilapia" />   per-form spec matrix + "Quote this grade"
 *   <PackingLogisticsBlock slug="tilapia" name="Tilapia" />
 *   <LogisticsSummary items={[{ slug, name, href }]} />  (/processing; null without data)
 */
import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Pending, Section, SectionHeader, SpecTable } from '@/components/v2';
import { cn } from '@/lib/v2/cn';
import { rfqHref } from '@/lib/v2/routes';
import {
    formatGradeRange,
    getSpeciesSpec,
    hasAnyLogistics,
    hasLogisticsData,
    type FormKind,
    type Grade,
    type PackingLogistics,
    type ProductFormSpec,
} from '@/lib/v2/specs';

/** Translator for the catalogue_v2.specs namespace (useTranslations or getTranslations). */
export type SpecT = (key: string, values?: Record<string, string | number>) => string;
type T = SpecT;

/** Label helpers shared by the matrix, the catalogue facts and RFQ prefill text. */
export function specText(t: T, locale: string) {
    const units = { g: t('units.g'), kg: t('units.kg'), isolate: locale === 'ar' };
    const range = (g: Grade) => formatGradeRange(g, units);
    return {
        form: (k: FormKind) => t(`forms.${k}`),
        gradeLabel: (g: Grade) => (g.label ? t(`grades.${g.label}`) : null),
        range,
        /** "Medium (300–500 g)": used in the RFQ grade field */
        gradeFull: (g: Grade) => {
            const l = g.label ? t(`grades.${g.label}`) : null;
            const r = range(g);
            return l && r ? `${l} (${r})` : (l ?? r ?? '');
        },
        /** "Medium · 300–500 g": used in lists */
        gradeShort: (g: Grade) => [g.label ? t(`grades.${g.label}`) : null, range(g)].filter(Boolean).join(' · '),
    };
}

function Empty() {
    const t = useTranslations('v2.spec');
    return (
        <span className="inline-flex items-center gap-2 text-ink-subtle">
            <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
            {t('confirmed_with_sales')}
        </span>
    );
}

const val = (v: ReactNode | null | undefined) => (v === null || v === undefined || v === '' ? <Empty /> : v);

function QuoteLink({ href, label, context }: { href: string; label: string; context: string }) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-control border border-navy px-3 text-body-sm font-semibold text-navy transition-colors duration-fast hover:bg-navy hover:text-white motion-reduce:transition-none"
        >
            {label}
            <span className="sr-only">: {context}</span>
        </Link>
    );
}

/** Keep a number group in LTR order inside Arabic text ("-1", "40 × 30 × 15"). Invisible in LTR. */
const LRI = String.fromCharCode(0x2066);
const PDI = String.fromCharCode(0x2069);
const ltr = (v: string | number) => `${LRI}${v}${PDI}`;
const dims = (d: { l: number; w: number; h: number }) => ltr(`${d.l} × ${d.w} × ${d.h}`);

function formFields(f: ProductFormSpec, t: T) {
    return {
        shelf: f.shelfLifeDays !== undefined ? t('days', { count: f.shelfLifeDays }) : null,
        temp: f.tempC ? <bdi>{t('temp_range', { min: ltr(f.tempC.min), max: ltr(f.tempC.max) })}</bdi> : null,
        pack: f.packType ? t(`pack_types.${f.packType}`) : null,
        net: f.netWeightKg !== undefined ? <bdi>{t('kg', { value: f.netWeightKg })}</bdi> : null,
    };
}

function GradeList({ slug, name, form, t }: { slug: string; name: string; form: ProductFormSpec; t: T }) {
    const s = specText(t, useLocale());
    const formLabel = s.form(form.kind);
    if (form.grades.length === 0) {
        return (
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Empty />
                <QuoteLink
                    href={rfqHref({ product: slug, type: 'product', form: form.kind })}
                    label={t('quote_form')}
                    context={`${name}, ${formLabel}`}
                />
            </div>
        );
    }
    return (
        <ul className="divide-y divide-line">
            {form.grades.map((g, i) => {
                const label = s.gradeLabel(g);
                const range = s.range(g);
                return (
                    <li key={i} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 first:pt-0 last:pb-0">
                        <span>
                            {label ? <span className="font-semibold text-ink">{label}</span> : null}
                            {label && range ? <span aria-hidden="true" className="mx-2 text-ink-subtle">·</span> : null}
                            {range ? <bdi className="tabular-nums">{range}</bdi> : null}
                        </span>
                        <QuoteLink
                            href={rfqHref({ product: slug, type: 'product', form: form.kind, grade: s.gradeFull(g) })}
                            label={t('quote_grade')}
                            context={`${name}, ${formLabel}, ${s.gradeFull(g)}`}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

/** One row per product form (table at lg+, label–value blocks below). */
export function FormSpecMatrix({ slug, name, headingId }: { slug: string; name: string; headingId: string }) {
    const t = useTranslations('catalogue_v2.specs');
    const s = specText(t, useLocale());
    const { forms } = getSpeciesSpec(slug);
    const anyIndicative = forms.some((f) => f.indicative);
    const cols = [t('col_grades'), t('col_shelf_life'), t('col_temp'), t('col_pack'), t('col_net_weight')];

    return (
        <div>
            <h3 id={headingId} className="text-heading-lg text-navy">
                {t('matrix_title')}
            </h3>
            <p className="mt-2 max-w-prose-v2 text-body-sm text-ink-muted">{t('matrix_intro')}</p>

            {forms.length === 0 ? (
                <div className="mt-6">
                    <SpecTable caption={t('matrix_caption', { name })} hideCaption rows={[{ label: t('col_form'), value: null }]} />
                </div>
            ) : (
                <>
                    {/* lg+: matrix table */}
                    <div data-surface="light" className="mt-6 hidden overflow-hidden rounded-card border border-line bg-white text-ink lg:block">
                        <table className="w-full border-collapse text-start text-body-sm">
                            <caption className="sr-only">{t('matrix_caption', { name })}</caption>
                            <thead className="bg-surface-offwhite">
                                <tr>
                                    <th scope="col" className="px-5 py-3 text-start text-caption font-semibold uppercase tracking-wide text-ink-muted">
                                        {t('col_form')}
                                    </th>
                                    {cols.map((c, i) => (
                                        <th
                                            key={c}
                                            scope="col"
                                            className={cn(
                                                'px-5 py-3 text-start text-caption font-semibold uppercase tracking-wide text-ink-muted',
                                                i === 0 && 'w-[34%]',
                                            )}
                                        >
                                            {c}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {forms.map((f) => {
                                    const v = formFields(f, t);
                                    return (
                                        <tr key={f.kind} className="border-t border-line">
                                            <th scope="row" className="px-5 py-4 text-start align-top">
                                                <span className="text-heading-sm text-navy">{s.form(f.kind)}</span>
                                                {f.indicative ? <span className="mt-1 block text-caption font-normal text-ink-subtle">{t('indicative')}</span> : null}
                                            </th>
                                            <td className="px-5 py-4 align-top font-medium">
                                                <GradeList slug={slug} name={name} form={f} t={t} />
                                            </td>
                                            <td className="px-5 py-4 align-top font-medium">{val(v.shelf)}</td>
                                            <td className="px-5 py-4 align-top font-medium">{val(v.temp)}</td>
                                            <td className="px-5 py-4 align-top font-medium">{val(v.pack)}</td>
                                            <td className="px-5 py-4 align-top font-medium">{val(v.net)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* < lg: one label–value block per form */}
                    <div className="mt-6 space-y-4 lg:hidden">
                        {forms.map((f) => {
                            const v = formFields(f, t);
                            return (
                                <section
                                    key={f.kind}
                                    data-surface="light"
                                    aria-label={`${name}: ${s.form(f.kind)}`}
                                    className="rounded-card border border-line bg-white text-ink"
                                >
                                    <div className="px-4 pt-4 pb-3">
                                        <p className="text-heading-sm text-navy">{s.form(f.kind)}</p>
                                        {f.indicative ? <p className="mt-1 text-caption text-ink-subtle">{t('indicative')}</p> : null}
                                    </div>
                                    <dl>
                                        <div className="border-t border-line px-4 py-3">
                                            <dt className="text-caption text-ink-subtle">{t('col_grades')}</dt>
                                            <dd className="mt-2 text-body-sm font-medium">
                                                <GradeList slug={slug} name={name} form={f} t={t} />
                                            </dd>
                                        </div>
                                        {(
                                            [
                                                [t('col_shelf_life'), v.shelf],
                                                [t('col_temp'), v.temp],
                                                [t('col_pack'), v.pack],
                                                [t('col_net_weight'), v.net],
                                            ] as const
                                        ).map(([label, value]) => (
                                            <div key={label} className="border-t border-line px-4 py-3">
                                                <dt className="text-caption text-ink-subtle">{label}</dt>
                                                <dd className="mt-0.5 text-body-sm font-medium">{val(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            );
                        })}
                    </div>
                </>
            )}
            {anyIndicative ? <p className="mt-4 max-w-prose-v2 text-body-sm text-ink-muted">{t('indicative_note')}</p> : null}
        </div>
    );
}

function logisticsRows(l: PackingLogistics, t: T) {
    const modes = l.shippingModes;
    return [
        { label: t('box_type'), value: l.boxType ? t(`pack_types.${l.boxType}`) : null },
        {
            label: t('box_dims'),
            value: l.boxOuterCm ? <bdi>{t('box_dims_value', { dims: dims(l.boxOuterCm) })}</bdi> : null,
        },
        { label: t('boxes_per_pallet'), value: l.boxesPerPallet ?? null },
        { label: t('shipping_modes'), value: modes.length ? modes.map((m) => t(`modes.${m.mode}`)).join(' · ') : null },
        ...(modes.length
            ? modes.map((m) => ({
                  label: t('moq_mode', { mode: t(`modes.${m.mode}`) }),
                  value: m.moqKg !== undefined ? <bdi>{t('kg', { value: m.moqKg })}</bdi> : null,
              }))
            : [{ label: t('moq'), value: null }]),
        { label: t('farm_to_plant'), value: l.farmToPlantHours !== undefined ? t('hours', { count: l.farmToPlantHours }) : null },
        { label: t('plant_to_port'), value: l.plantToPortHours !== undefined ? t('hours', { count: l.plantToPortHours }) : null },
    ];
}

/** Product detail "Packing and logistics". Honest line + Pending when there is no data. */
export function PackingLogisticsBlock({ slug, name }: { slug: string; name: string }) {
    const t = useTranslations('catalogue_v2.specs');
    const { logistics } = getSpeciesSpec(slug);
    return (
        <div className="space-y-4">
            {/* Honest line until real box / pallet / mode / time data exists */}
            {!hasLogisticsData(logistics) ? <p className="text-body text-fg-muted">{t('logistics_empty')}</p> : null}
            {hasAnyLogistics(logistics) ? (
                <>
                    <SpecTable caption={t('logistics_caption', { name })} hideCaption rows={logisticsRows(logistics, t)} />
                    {logistics.indicative ? <p className="text-caption text-ink-subtle">{t('indicative')}</p> : null}
                </>
            ) : null}
            {!hasLogisticsData(logistics) ? <Pending block label={t('pending_logistics', { name })} /> : null}
        </div>
    );
}

/** /processing summary table. Renders nothing until at least one species has logistics data. */
export function LogisticsSummary({ items }: { items: { slug: string; name: string; href: string }[] }) {
    const t = useTranslations('catalogue_v2.specs');
    const rows = items.map((it) => ({ ...it, l: getSpeciesSpec(it.slug).logistics })).filter((r) => hasLogisticsData(r.l));
    if (rows.length === 0) return null;
    const cell = 'px-5 py-3 align-top';
    const head = 'px-5 py-3 text-start text-caption font-semibold uppercase tracking-wide text-ink-muted';
    return (
        <Section variant="light" spacing="md" labelledBy="processing-logistics">
            <SectionHeader id="processing-logistics" eyebrow={t('summary_eyebrow')} title={t('summary_title')} intro={t('summary_intro')} size="md" />
            <div data-surface="light" className="overflow-x-auto rounded-card border border-line bg-white text-ink">
                <table className="w-full min-w-[720px] border-collapse text-start text-body-sm">
                    <caption className="sr-only">{t('summary_title')}</caption>
                    <thead className="bg-surface-offwhite">
                        <tr>
                            {[t('col_species'), t('box_type'), t('box_dims'), t('boxes_per_pallet'), t('shipping_modes'), t('farm_to_plant'), t('plant_to_port')].map((c) => (
                                <th key={c} scope="col" className={head}>
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ slug, name, href, l }) => (
                            <tr key={slug} className="border-t border-line">
                                <th scope="row" className={cn(cell, 'text-start font-semibold')}>
                                    <Link href={href} className="inline-flex min-h-[44px] items-center text-navy underline-offset-4 hover:underline">
                                        {name}
                                    </Link>
                                </th>
                                <td className={cell}>{val(l.boxType ? t(`pack_types.${l.boxType}`) : null)}</td>
                                <td className={cell}>
                                    {val(l.boxOuterCm ? <bdi>{t('box_dims_value', { dims: dims(l.boxOuterCm) })}</bdi> : null)}
                                </td>
                                <td className={cell}>{val(l.boxesPerPallet ?? null)}</td>
                                <td className={cell}>
                                    {val(
                                        l.shippingModes.length
                                            ? l.shippingModes
                                                  .map((m) => (m.moqKg !== undefined ? `${t(`modes.${m.mode}`)} (${t('moq_short', { value: m.moqKg })})` : t(`modes.${m.mode}`)))
                                                  .join(' · ')
                                            : null,
                                    )}
                                </td>
                                <td className={cell}>{val(l.farmToPlantHours !== undefined ? t('hours', { count: l.farmToPlantHours }) : null)}</td>
                                <td className={cell}>{val(l.plantToPortHours !== undefined ? t('hours', { count: l.plantToPortHours }) : null)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
}
