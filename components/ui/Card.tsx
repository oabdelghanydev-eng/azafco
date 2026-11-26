import type { ElementType, ReactNode } from 'react';
import { cn } from './tokens';

/**
 * Design G card: white, 1px hairline border (line #D5DDE9), 4px radius, no shadow
 * at rest. `accent` adds the 4px gold top rule of the G proof / quality cards.
 * `interactive` (whole card is a link) adds a navy border and soft shadow on hover.
 * On navy, use `tone="dark"`: translucent white panel with a white/16 border.
 */
export interface CardProps {
    children: ReactNode;
    accent?: boolean;
    interactive?: boolean;
    tone?: 'light' | 'dark';
    /** Inner padding: none, sm (20px), md (20px → 32px lg, default), lg (20px → 48px lg) */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    as?: ElementType;
    id?: string;
    className?: string;
}

const pad = {
    none: '',
    sm: 'p-5',
    md: 'p-5 lg:p-8',
    lg: 'px-5 py-8 lg:px-12 lg:py-14',
} as const;

/** Card classes, for elements that cannot use <Card> (e.g. a <Link> or <li> with its own markup). */
export function cardClass({
    accent = false,
    interactive = false,
    tone = 'light',
    padding = 'none',
    className,
}: Omit<CardProps, 'children' | 'as' | 'id'> = {}) {
    return cn(
        'rounded-card border border-solid',
        tone === 'dark' ? 'border-white/[.16] bg-white/[.06] text-white' : 'border-line bg-white text-ink',
        accent && 'border-t-4 border-t-gold',
        interactive &&
            'transition-[border-color,box-shadow] duration-base hover:border-navy hover:shadow-card motion-reduce:transition-none',
        pad[padding],
        className,
    );
}

export function Card({ children, accent, interactive, tone, padding = 'md', as: Tag = 'div', id, className }: CardProps) {
    return (
        <Tag id={id} className={cardClass({ accent, interactive, tone, padding, className })}>
            {children}
        </Tag>
    );
}

export default Card;
