import type { ReactNode } from 'react';
import { cn } from '@/components/ui';

export interface MilestoneYear {
    year: number;
    /** One or more events in that year (already translated) */
    events: ReactNode[];
}

export interface MilestonesProps {
    years: MilestoneYear[];
    /** aria-label of the list, e.g. "Company milestones" */
    label: string;
    className?: string;
}

/**
 * Company timeline (design G): a vertical rail on the start side, the year as a
 * navy figure, a gold marker on the rail and the year's events beside it.
 * Same layout at every width (no horizontal scroll), RTL-safe (logical props only).
 * Semantic: <ol> of years, each with a <time> and a list of events.
 */
export default function Milestones({ years, label, className }: MilestonesProps) {
    return (
        <ol aria-label={label} className={cn('m-0 list-none p-0', className)}>
            {years.map((y, i) => {
                const last = i === years.length - 1;
                return (
                    <li key={y.year} className="grid grid-cols-[4.5rem_1fr] gap-x-4 sm:grid-cols-[6.5rem_1fr] sm:gap-x-6">
                        <p className="m-0 pt-0.5 font-display text-heading-xl text-navy tabular-nums">
                            <time dateTime={String(y.year)}>{y.year}</time>
                        </p>
                        <div className={cn('relative border-0 border-s-2 border-solid border-line-track ps-6 sm:ps-8', last ? 'pb-0' : 'pb-9 lg:pb-10')}>
                            <span
                                aria-hidden="true"
                                className="absolute -start-2 top-3 box-content h-2 w-2 rounded-full border-[3px] border-solid border-white bg-gold ring-2 ring-navy lg:top-3.5"
                            />
                            <ul className="m-0 list-none space-y-2 p-0 pt-1.5 lg:pt-2">
                                {y.events.map((e, k) => (
                                    <li key={k} className="text-body text-ink">
                                        {e}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
