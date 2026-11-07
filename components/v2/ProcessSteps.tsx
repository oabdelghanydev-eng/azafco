import type { ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';

export interface ProcessStep {
    title: ReactNode;
    description?: ReactNode;
    /** Optional slot under the text (e.g. <Pending/> or a small link) */
    extra?: ReactNode;
}

export interface ProcessStepsProps {
    steps: ProcessStep[];
    /** `horizontal` = row on desktop (stacks on mobile); `vertical` = timeline */
    orientation?: 'horizontal' | 'vertical';
    /** Heading level for step titles (default h3) */
    headingAs?: 'h3' | 'h4';
    className?: string;
}

/**
 * Numbered process (origin → shipment, how to order, QC flow). Semantic <ol>.
 * Numbers are 01, 02… in Latin digits in every locale (consistent with specs).
 */
export default function ProcessSteps({ steps, orientation = 'horizontal', headingAs: H = 'h3', className }: ProcessStepsProps) {
    const horizontal = orientation === 'horizontal';
    const cols = steps.length >= 5 ? 'lg:grid-cols-5' : steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
    return (
        <ol
            className={cn(
                horizontal ? cn('grid gap-8 sm:grid-cols-2 lg:gap-6', cols) : 'relative space-y-8 border-s border-rule ps-8',
                className,
            )}
        >
            {steps.map((s, i) => {
                const n = String(i + 1).padStart(2, '0');
                return (
                    <li key={i} className={cn('relative', horizontal && 'border-t-2 border-rule pt-5')}>
                        {horizontal ? (
                            <span aria-hidden="true" className="absolute -top-0.5 start-0 h-0.5 w-12 bg-gold" />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="absolute -start-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-[color:var(--v2-tint-strong)]"
                            />
                        )}
                        <span className="block font-display text-heading-lg font-semibold tabular-nums text-eyebrow" aria-hidden="true">
                            {n}
                        </span>
                        <H className="mt-2 text-heading-md text-fg">
                            <span className="sr-only">{n}. </span>
                            {s.title}
                        </H>
                        {s.description ? <div className="mt-2 text-body-sm text-fg-muted">{s.description}</div> : null}
                        {s.extra ? <div className="mt-3">{s.extra}</div> : null}
                    </li>
                );
            })}
        </ol>
    );
}
