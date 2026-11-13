import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';

export interface ProcessStep {
    title: ReactNode;
    description?: ReactNode;
    /** Optional slot under the text (e.g. <Pending/> or a small link) */
    extra?: ReactNode;
    /** 24px line icon from ./icons (shown in the timeline marker instead of the number) */
    icon?: ReactNode;
}

export interface ProcessStepsProps {
    steps: ProcessStep[];
    /**
     * `horizontal` = connected timeline: a row on desktop, a vertical line on
     * mobile/tablet. `vertical` = vertical timeline at every width.
     */
    orientation?: 'horizontal' | 'vertical';
    /** Heading level for step titles (default h3) */
    headingAs?: 'h3' | 'h4';
    className?: string;
}

/**
 * Numbered process (origin → shipment, how to order, QC flow). Semantic <ol>.
 * Steps are joined by a thin rule (logical properties, RTL-safe). Markers show
 * the step icon when given, else the number. Numbers are 01, 02… in Latin
 * digits in every locale (consistent with specs). Surface-aware.
 * Design G value-chain look: round markers with a white gap and a navy ring
 * (gold ring on navy), 2px connector, small navy stage number, bold step titles.
 */
export default function ProcessSteps({ steps, orientation = 'horizontal', headingAs: H = 'h3', className }: ProcessStepsProps) {
    // Six or more steps only fit in a row from xl
    const wide = steps.length >= 6;
    const row = orientation === 'horizontal';
    const cols = row
        ? wide
            ? 'xl:grid-cols-6 xl:gap-6'
            : steps.length === 5
              ? 'lg:grid-cols-5 lg:gap-6'
              : steps.length === 4
                ? 'lg:grid-cols-4 lg:gap-6'
                : 'lg:grid-cols-3 lg:gap-6'
        : '';
    // Breakpoint-prefixed overrides that switch the connector from vertical to horizontal
    const lineRow = row
        ? wide
            ? 'xl:start-[60px] xl:-end-4 xl:top-[23px] xl:bottom-auto xl:h-0.5 xl:w-auto'
            : 'lg:start-[60px] lg:-end-4 lg:top-[23px] lg:bottom-auto lg:h-0.5 lg:w-auto'
        : '';
    const liRow = row ? (wide ? 'xl:ps-0' : 'lg:ps-0') : '';
    const markerRow = row ? (wide ? 'xl:relative xl:mb-5' : 'lg:relative lg:mb-5') : '';

    return (
        <ol className={cn('m-0 grid list-none gap-8 p-0', cols, className)}>
            {steps.map((s, i) => {
                const n = String(i + 1).padStart(2, '0');
                const last = i === steps.length - 1;
                return (
                    <li key={i} className={cn('relative ps-16', liRow)}>
                        {/* Connector to the next step: vertical on small screens, horizontal in the row layout */}
                        {!last ? (
                            <span
                                aria-hidden="true"
                                className={cn('absolute start-[23px] top-[60px] -bottom-6 w-0.5 bg-connector', lineRow)}
                            />
                        ) : null}
                        <span
                            aria-hidden="true"
                            className={cn(
                                'absolute start-0 top-0 box-border flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-solid border-[color:var(--v2-panel)] bg-panel text-eyebrow shadow-[0_0_0_2px_var(--v2-eyebrow)]',
                                markerRow,
                            )}
                        >
                            {s.icon ?? <span className="text-body-sm font-extrabold tabular-nums">{n}</span>}
                        </span>
                        {s.icon ? (
                            <span className="block text-caption font-bold tabular-nums text-eyebrow" aria-hidden="true">
                                {n}
                            </span>
                        ) : null}
                        <H className={cn('m-0 text-heading-md text-fg', s.icon ? 'mt-1' : 'pt-2.5')}>
                            <span className="sr-only">{n}. </span>
                            {s.title}
                        </H>
                        {s.description ? <div className="mt-1.5 text-body-sm text-fg-muted">{s.description}</div> : null}
                        {s.extra ? <div className="mt-3">{s.extra}</div> : null}
                    </li>
                );
            })}
        </ol>
    );
}
