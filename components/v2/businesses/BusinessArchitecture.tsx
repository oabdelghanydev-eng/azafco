import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import { ArrowIcon } from '@/components/v2';

export interface ArchitectureUnit {
    name: string;
    description?: ReactNode;
    /** Anchor id on the item (deep links such as /businesses#agriculture) */
    id?: string;
}

export interface BusinessArchitectureProps {
    parent: { name: string; role: string };
    core: ArchitectureUnit & { tag: string; href: string; linkLabel: string };
    /** Subordinate activities: agriculture, livestock, investments */
    others: ArchitectureUnit[];
    /** Label for the subordinate group (e.g. "Other activities") */
    othersLabel: string;
    headingAs?: 'h3' | 'h4';
    className?: string;
}

/**
 * Brand architecture: parent → dominant seafood core → smaller activities.
 * Seafood takes ~2/3 of the width on desktop; the others are quiet text modules
 * (no image, no CTA) so they never compete with the seafood route.
 * Surface-aware; works on light and offwhite sections.
 */
export default function BusinessArchitecture({
    parent,
    core,
    others,
    othersLabel,
    headingAs: H = 'h3',
    className,
}: BusinessArchitectureProps) {
    return (
        <div className={className}>
            {/* Parent brand bar */}
            <div className="flex flex-col gap-1 rounded-card bg-navy-900 px-6 py-5 text-white sm:flex-row sm:items-baseline sm:justify-between sm:gap-6" data-surface="dark">
                <p className="text-heading-md font-semibold">{parent.name}</p>
                <p className="text-body-sm text-fg-muted">{parent.role}</p>
            </div>

            {/* Connector */}
            <div aria-hidden="true" className="ms-8 h-6 border-s-2 border-gold" />

            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Core: seafood */}
                <Link
                    href={core.href}
                    className="group relative flex flex-col rounded-card border border-rule bg-panel p-6 shadow-card transition-shadow duration-base hover:shadow-raised motion-reduce:transition-none md:p-10 lg:col-span-7"
                >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 rounded-t-card bg-gold" />
                    <span className="text-overline uppercase text-eyebrow">{core.tag}</span>
                    <H className="v2-heading mt-3 font-display text-display-lg">{core.name}</H>
                    {core.description ? <div className="mt-4 max-w-prose-v2 text-body-lg text-fg-muted">{core.description}</div> : null}
                    <span className="mt-auto inline-flex min-h-[44px] items-center gap-2 pt-8 font-semibold text-fg underline decoration-gold decoration-2 underline-offset-[6px]">
                        {core.linkLabel}
                        <ArrowIcon size={18} />
                    </span>
                </Link>

                {/* Subordinate activities */}
                <div className="lg:col-span-5">
                    <p className="mb-3 text-overline uppercase text-fg-muted">{othersLabel}</p>
                    <ul className="divide-y divide-rule border-y border-rule">
                        {others.map((o) => (
                            <li key={o.name} id={o.id} className={cn('py-5', o.id && 'scroll-mt-28')}>
                                <H className="text-heading-sm text-fg">{o.name}</H>
                                {o.description ? <div className="mt-1.5 text-body-sm text-fg-muted">{o.description}</div> : null}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
