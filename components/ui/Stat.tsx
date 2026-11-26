import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { ArrowIcon } from './icons';
import { cn } from './tokens';

/**
 * Figures. Only approved facts (docs/team/web/g/RELEASE-DECISIONS.md): never
 * invent a number to fill a cell.
 *
 * - <Stat>        one figure: big navy number over a muted label.
 * - <StatStrip>   the key-figures strip under the G home hero: 2x2 on phones,
 *                 one row of four from lg, hairline dividers.
 * - <FactCards>   label + value cards with the gold top rule (market facts).
 */

export interface StatItem {
    value: ReactNode;
    label: ReactNode;
}

const figure = 'm-0 font-display text-figure text-stat tabular-nums';
const figureLabel = 'font-semibold text-fg-muted text-body-sm lg:text-body';

/** One figure. Renders a <div> with dt/dd, so place it inside a <dl>. */
export function Stat({ value, label, className }: StatItem & { className?: string }) {
    return (
        <div className={cn('flex min-w-0 flex-col-reverse', className)}>
            <dt className={cn('mt-1.5 lg:mt-2', figureLabel)}>{label}</dt>
            <dd className={figure}>{value}</dd>
        </div>
    );
}

export interface StatStripProps {
    items: StatItem[];
    /** aria-label of the <section> (no visible heading) */
    label?: string;
    /** Render only the <dl> (no section/container), e.g. inside a hero */
    bare?: boolean;
    className?: string;
}

export function StatStrip({ items, label, bare = false, className }: StatStripProps) {
    const list = (
        <dl className={cn('m-0 grid grid-cols-2 border-0 border-b border-solid border-line-soft px-5 lg:grid-cols-4 lg:px-0', bare && className)}>
            {items.map((s, k) => (
                <Stat
                    key={k}
                    value={s.value}
                    label={s.label}
                    className={cn(
                        k < 2 ? 'border-0 border-b border-solid border-line-soft pb-[22px] pt-[26px]' : 'pb-[26px] pt-[22px]',
                        k % 2 === 0 ? 'pe-3' : 'border-0 border-s border-solid border-line-soft ps-4',
                        'lg:border-0 lg:py-9 lg:ps-0',
                        k === items.length - 1 ? 'lg:pe-0' : 'lg:pe-6',
                    )}
                />
            ))}
        </dl>
    );
    if (bare) return list;
    return (
        <section aria-label={label} data-surface="light" className={cn('bg-white text-ink', className)}>
            <div className="mx-auto box-border max-w-v2 lg:px-8">{list}</div>
        </section>
    );
}

/** Optional link under a fact value: external (new tab) or an internal route (locale-prefixed). */
export interface FactLink {
    href: string;
    label: string;
    external?: boolean;
    /** Screen-reader suffix for external links, e.g. "(opens in a new tab)" */
    newTabLabel?: string;
}

export interface FactItem {
    label: string;
    value: ReactNode;
    link?: FactLink;
}

const factLink =
    'mt-2 inline-flex min-h-tap items-center gap-2 text-body-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-[6px] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy';

export function FactCards({ items, className }: { items: FactItem[]; className?: string }) {
    return (
        <dl className={cn('m-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4', className)}>
            {items.map((f) => (
                <div key={f.label} className="rounded-card border border-t-4 border-solid border-line border-t-gold bg-white px-5 pb-5 pt-[18px] text-start">
                    <dt className="text-body-sm text-ink-muted">{f.label}</dt>
                    <dd className="m-0 mt-1 font-display text-heading-md font-extrabold text-navy">{f.value}</dd>
                    {f.link ? (
                        <dd className="m-0">
                            {f.link.external ? (
                                <a href={f.link.href} target="_blank" rel="noopener noreferrer" className={factLink}>
                                    {f.link.label}
                                    <ArrowIcon size={16} />
                                    {f.link.newTabLabel ? <span className="sr-only">{f.link.newTabLabel}</span> : null}
                                </a>
                            ) : (
                                <Link href={f.link.href} className={factLink}>
                                    {f.link.label}
                                    <ArrowIcon size={16} />
                                </Link>
                            )}
                        </dd>
                    ) : null}
                </div>
            ))}
        </dl>
    );
}
