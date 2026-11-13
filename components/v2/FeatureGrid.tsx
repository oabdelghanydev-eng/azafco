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
    /** Anchor id on the item (deep links such as /businesses#agriculture) */
    id?: string;
    /** Tinted tile (e.g. a closing link that fills the last grid slot) */
    tint?: boolean;
}

export interface FeatureGridProps {
    items: Feature[];
    columns?: 2 | 3 | 4;
    /**
     * `plain` = text blocks under a hairline with a short gold segment (G eyebrow rule);
     * `card` = G cards: white, thin border, 4px gold top bar.
     */
    style?: 'plain' | 'card';
    headingAs?: 'h3' | 'h4';
    className?: string;
}

/** Grid of capabilities / segments / buyer requirements (design G). Surface-aware. */
export default function FeatureGrid({ items, columns = 3, style = 'plain', headingAs: H = 'h3', className }: FeatureGridProps) {
    const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
    return (
        <ul className={cn('m-0 grid list-none gap-4 p-0 md:gap-5 lg:gap-6', style === 'plain' && 'gap-y-8 lg:gap-y-10', cols, className)}>
            {items.map((f, i) => {
                const body = (
                    <>
                        {style === 'plain' && !f.tint ? (
                            <span aria-hidden="true" className="absolute -top-px start-0 h-[3px] w-11 bg-gold" />
                        ) : null}
                        {f.icon ? <span className="mb-4 inline-flex text-eyebrow">{f.icon}</span> : null}
                        <H className="m-0 text-heading-md text-fg">{f.title}</H>
                        {f.description ? <div className="mt-2 text-body text-fg-muted">{f.description}</div> : null}
                        {f.href ? (
                            <span className="v2-btn mt-auto inline-flex items-center gap-2.5 pt-5 text-body text-link group-hover:text-link-hover group-hover:underline group-hover:underline-offset-4">
                                {f.linkLabel}
                                <ArrowIcon size={18} className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none" />
                            </span>
                        ) : null}
                    </>
                );
                const box = cn(
                    'group relative flex h-full flex-col',
                    style === 'card'
                        ? 'rounded-card border border-edge border-t-4 border-t-gold bg-panel px-5 pb-6 pt-5 lg:px-7 lg:pb-7 lg:pt-6'
                        : 'border-t border-rule pt-6',
                    f.href && style === 'card' && 'transition-[border-color,box-shadow] duration-base hover:border-x-[color:var(--v2-link)] hover:border-b-[color:var(--v2-link)] hover:shadow-card motion-reduce:transition-none',
                    f.tint && 'rounded-card border-0 bg-tint-strong p-6 hover:bg-tint lg:p-7',
                );
                return (
                    <li key={i} id={f.id} className={f.id ? 'scroll-mt-28' : undefined}>
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
