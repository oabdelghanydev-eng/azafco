import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';

/* ────────────────────────────────────────────────────────────────────────────
 * Container: 1320px max (design G), 20px side padding on phones, 32px from md.
 * `grid` turns it into the layout grid: 4 cols mobile, 8 tablet, 12 desktop.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface ContainerProps {
    children: ReactNode;
    /** Apply the 4/8/12-column grid (children use col-span-*) */
    grid?: boolean;
    /** Narrow reading width (prose pages) */
    narrow?: boolean;
    as?: ElementType;
    className?: string;
}

export function Container({ children, grid = false, narrow = false, as: Tag = 'div', className }: ContainerProps) {
    return (
        <Tag
            className={cn(
                'mx-auto box-border w-full px-5 md:px-8',
                narrow ? 'max-w-4xl' : 'max-w-v2',
                grid && 'grid grid-cols-4 gap-x-4 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8',
                className,
            )}
        >
            {children}
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Section: vertical rhythm + surface (design G: 64px on phones, 112px from lg).
 * `navy` (#001B47) sets data-surface="dark" so every surface-aware token
 * (fg, fg-muted, eyebrow, rule, focus ring, buttons) flips.
 * ──────────────────────────────────────────────────────────────────────────── */
export type SectionVariant = 'light' | 'offwhite' | 'navy';
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface SectionProps {
    children: ReactNode;
    variant?: SectionVariant;
    spacing?: SectionSpacing;
    id?: string;
    /** id of the section heading, for aria-labelledby */
    labelledBy?: string;
    /** Wrap children in <Container> (default true) */
    contained?: boolean;
    as?: ElementType;
    className?: string;
    /** Gentle fade-up on first scroll into view (components/v2/RevealSections). Default true. */
    reveal?: boolean;
}

const surface: Record<SectionVariant, string> = {
    light: 'bg-white',
    offwhite: 'bg-surface-offwhite',
    navy: 'bg-navy-900 text-white',
};

const space: Record<SectionSpacing, string> = {
    none: '',
    sm: 'py-10 md:py-12 lg:py-14',
    md: 'py-16 md:py-20 lg:py-28',
    lg: 'py-20 md:py-24 lg:py-28',
};

export function Section({
    children,
    variant = 'light',
    spacing = 'md',
    id,
    labelledBy,
    contained = true,
    as: Tag = 'section',
    className,
    reveal = true,
}: SectionProps) {
    return (
        <Tag
            id={id}
            aria-labelledby={labelledBy}
            data-surface={variant === 'navy' ? 'dark' : 'light'}
            data-reveal={reveal ? '' : undefined}
            className={cn('relative text-fg', surface[variant], space[spacing], className)}
        >
            {contained ? <Container>{children}</Container> : children}
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Eyebrow (design G): 2px gold rule (28px, 44px from lg) + short label.
 * Label navy on light, gold on navy. Sentence case, not uppercase.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface EyebrowProps {
    children: ReactNode;
    as?: ElementType;
    className?: string;
}

export function Eyebrow({ children, as: Tag = 'p', className }: EyebrowProps) {
    return (
        <Tag className={cn('m-0 flex items-center gap-2.5 text-overline text-eyebrow lg:gap-3.5', className)}>
            <span aria-hidden="true" className="block h-[2px] w-7 shrink-0 bg-gold lg:w-11" />
            <span>{children}</span>
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * SectionHeader: eyebrow + heading + intro (+ optional action on the end side).
 * ──────────────────────────────────────────────────────────────────────────── */
export interface SectionHeaderProps {
    title: ReactNode;
    eyebrow?: ReactNode;
    intro?: ReactNode;
    /** e.g. a <Button variant="text"> "View all" */
    action?: ReactNode;
    /** Heading level (default h2) */
    as?: 'h1' | 'h2' | 'h3';
    /** Heading id (pair with <Section labelledBy>) */
    id?: string;
    align?: 'start' | 'center';
    size?: 'lg' | 'md';
    className?: string;
}

export function SectionHeader({
    title,
    eyebrow,
    intro,
    action,
    as: H = 'h2',
    id,
    align = 'start',
    size = 'lg',
    className,
}: SectionHeaderProps) {
    const centered = align === 'center';
    return (
        <div
            className={cn(
                'mb-8 flex flex-col gap-6 md:mb-10 lg:mb-14',
                !centered && !!action && 'md:flex-row md:items-end md:justify-between md:gap-x-16',
                centered && 'items-center text-center',
                className,
            )}
        >
            <div className={cn('max-w-[760px]', centered && 'mx-auto')}>
                {eyebrow ? <Eyebrow className={cn('mb-3 lg:mb-4', centered && 'justify-center')}>{eyebrow}</Eyebrow> : null}
                <H id={id} className={cn('v2-heading m-0 font-display', size === 'lg' ? 'text-display-lg' : 'text-heading-xl')}>
                    {title}
                </H>
                {intro ? <div className={cn('mt-4 max-w-[680px] text-body-lg text-fg-muted lg:mt-5', centered && 'mx-auto')}>{intro}</div> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}
