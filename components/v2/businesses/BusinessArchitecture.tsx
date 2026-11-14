import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { ArrowIcon, Eyebrow, cardClass, cn, focusRing, typography } from '@/components/ui';

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
 * Brand architecture: parent -> dominant fish core -> smaller activities.
 * The fish core takes 7 of 12 columns from lg (an accent card that links to the
 * fish business); the other activities are quiet text rows (no image, no CTA) so
 * they never compete with it. Built on the design-system card, eyebrow and type roles.
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
            <div
                data-surface="dark"
                className="flex flex-col gap-1 rounded-card bg-navy-900 px-5 py-5 text-fg sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 lg:px-8"
            >
                <p className={cn('m-0 text-fg', typography.h3)}>{parent.name}</p>
                <p className={cn('m-0 text-fg-muted', typography.small)}>{parent.role}</p>
            </div>

            {/* Connector */}
            <div aria-hidden="true" className="ms-8 h-6 border-0 border-s-2 border-solid border-gold" />

            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Core: fish */}
                <Link
                    href={core.href}
                    className={cardClass({
                        accent: true,
                        interactive: true,
                        className: cn('group flex flex-col p-6 md:p-10 lg:col-span-7', focusRing),
                    })}
                >
                    <Eyebrow as="span" tone="light">
                        {core.tag}
                    </Eyebrow>
                    <H className={cn('v2-heading m-0 mt-3', typography.h2)}>{core.name}</H>
                    {core.description ? <div className={cn('mt-4 max-w-prose-v2 text-ink-muted', typography.lead)}>{core.description}</div> : null}
                    <span className="v2-btn mt-auto inline-flex min-h-tap items-center gap-2.5 pt-8 text-body text-navy group-hover:underline group-hover:underline-offset-4">
                        {core.linkLabel}
                        <ArrowIcon
                            size={20}
                            className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                    </span>
                </Link>

                {/* Other activities */}
                <div className="lg:col-span-5">
                    <p className={cn('m-0 mb-3 text-fg-muted', typography.overline)}>{othersLabel}</p>
                    <ul className="m-0 list-none divide-y divide-rule border-0 border-y border-solid border-rule p-0">
                        {others.map((o) => (
                            <li key={o.name} id={o.id} className={cn('py-5', o.id && 'scroll-mt-28')}>
                                <H className={cn('m-0 text-fg', typography.h4)}>{o.name}</H>
                                {o.description ? <div className={cn('mt-1.5 text-fg-muted', typography.small)}>{o.description}</div> : null}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
