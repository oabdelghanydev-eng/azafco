import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import { ArrowIcon } from './icons';

export interface Feature {
    title: ReactNode;
    description?: ReactNode;
    /** Thin icon from ./icons, only when meaningful */
    icon?: ReactNode;
    /** Makes the whole card a link (segment / capability cards) */
    href?: string;
    linkLabel?: string;
}

export interface FeatureGridProps {
    items: Feature[];
    columns?: 2 | 3 | 4;
    /** `plain` = text blocks with top rule; `card` = bordered cards */
    style?: 'plain' | 'card';
    headingAs?: 'h3' | 'h4';
    className?: string;
}

/** Grid of capabilities / segments / buyer requirements. Surface-aware. */
export default function FeatureGrid({ items, columns = 3, style = 'plain', headingAs: H = 'h3', className }: FeatureGridProps) {
    const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
    return (
        <ul className={cn('grid gap-6 lg:gap-8', cols, className)}>
            {items.map((f, i) => {
                const body = (
                    <>
                        {f.icon ? <span className="mb-4 inline-flex text-eyebrow">{f.icon}</span> : null}
                        <H className="text-heading-md text-fg">{f.title}</H>
                        {f.description ? <div className="mt-2 text-body-sm text-fg-muted">{f.description}</div> : null}
                        {f.href ? (
                            <span className="mt-4 inline-flex items-center gap-2 text-body-sm font-semibold text-fg underline decoration-gold decoration-2 underline-offset-[6px]">
                                {f.linkLabel}
                                <ArrowIcon size={16} />
                            </span>
                        ) : null}
                    </>
                );
                const box = cn(
                    'block h-full',
                    style === 'card'
                        ? 'rounded-card border border-rule p-6 transition-colors duration-base hover:bg-tint motion-reduce:transition-none'
                        : 'border-t border-rule pt-5',
                );
                return (
                    <li key={i}>
                        {f.href ? (
                            <Link href={f.href} className={box}>
                                {body}
                            </Link>
                        ) : (
                            <div className={box}>{body}</div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
