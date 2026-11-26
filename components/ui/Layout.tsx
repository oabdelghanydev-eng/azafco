import type { ElementType, ReactNode } from 'react';
import { cn, containerClass, sectionY, typography as type } from './tokens';

/* ────────────────────────────────────────────────────────────────────────────
 * Container: 1320px max (design G), 20px side padding on phones, 32px from md.
 * `grid` turns it into the layout grid: 4 cols mobile, 8 tablet, 12 desktop.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface ContainerProps {
    children: ReactNode;
    /** Apply the 4/8/12-column grid (children use col-span-*) */
    grid?: boolean;
    /** Narrow reading width (prose pages, 896px) */
    narrow?: boolean;
    as?: ElementType;
    className?: string;
}

export function Container({ children, grid = false, narrow = false, as: Tag = 'div', className }: ContainerProps) {
    return (
        <Tag
            className={cn(
                containerClass,
                narrow && 'max-w-4xl',
                grid && 'grid grid-cols-4 gap-x-4 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8',
                className,
            )}
        >
            {children}
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Section: vertical rhythm + surface (design G: 64px phone, 80px tablet, 112px lg).
 * `navy` (#001B47) sets data-surface="dark" so every surface-aware token
 * (fg, fg-muted, eyebrow, rule, focus ring, buttons) flips.
 * ──────────────────────────────────────────────────────────────────────────── */
export type SectionVariant = 'light' | 'white' | 'offwhite' | 'navy';
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface SectionProps {
    children: ReactNode;
    /** 'light' and 'white' are the same white surface */
    variant?: SectionVariant;
    spacing?: SectionSpacing;
    id?: string;
    /** id of the section heading, for aria-labelledby */
    labelledBy?: string;
    /** aria-label when there is no visible heading */
    label?: string;
    /** Wrap children in <Container> (default true) */
    contained?: boolean;
    as?: ElementType;
    className?: string;
    /** Gentle fade-up on first scroll into view (components/v2/RevealSections). Default true. */
    reveal?: boolean;
}

const surface: Record<SectionVariant, string> = {
    light: 'bg-white',
    white: 'bg-white',
    offwhite: 'bg-surface-offwhite',
    navy: 'bg-navy-900 text-white',
};

const space: Record<SectionSpacing, string> = {
    none: '',
    sm: 'py-10 md:py-12 lg:py-14',
    md: sectionY,
    lg: 'py-20 md:py-24 lg:py-section',
};

export function Section({
    children,
    variant = 'light',
    spacing = 'md',
    id,
    labelledBy,
    label,
    contained = true,
    as: Tag = 'section',
    className,
    reveal = true,
}: SectionProps) {
    return (
        <Tag
            id={id}
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : label}
            data-surface={variant === 'navy' ? 'dark' : 'light'}
            data-reveal={reveal ? '' : undefined}
            className={cn('relative scroll-mt-24 text-fg', surface[variant], space[spacing], className)}
        >
            {contained ? <Container>{children}</Container> : children}
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Eyebrow (design G): 2px gold rule (28px, 44px from lg) + short label.
 * Label navy on light, gold on navy (follows data-surface; `tone` forces one).
 * Sentence case, never uppercase.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface EyebrowProps {
    children: ReactNode;
    as?: ElementType;
    /** 'auto' follows the surface (default); 'light' = navy text; 'dark' = gold text */
    tone?: 'auto' | 'light' | 'dark';
    align?: 'start' | 'center';
    id?: string;
    className?: string;
}

const eyebrowTone = { auto: 'text-eyebrow', light: 'text-navy', dark: 'text-gold' } as const;

export function Eyebrow({ children, as: Tag = 'p', tone = 'auto', align = 'start', id, className }: EyebrowProps) {
    return (
        <Tag
            id={id}
            className={cn(
                'm-0 flex items-center gap-2.5 lg:gap-3.5',
                type.overline,
                eyebrowTone[tone],
                align === 'center' && 'justify-center',
                className,
            )}
        >
            <span aria-hidden="true" className="block h-0.5 w-7 shrink-0 bg-gold lg:w-11" />
            <span>{children}</span>
        </Tag>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * SectionHeading: eyebrow + heading + intro (+ optional action on the end side).
 * `layout="split"` puts the intro on the end side from lg (G quality / markets).
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
    /** 'stack' (default): intro under the heading. 'split': intro on the end side from lg. */
    layout?: 'stack' | 'split';
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
    layout = 'stack',
    size = 'lg',
    className,
}: SectionHeaderProps) {
    const centered = align === 'center';
    const heading = (
        <H id={id} className={cn('v2-heading m-0', size === 'lg' ? type.h2 : type.h2Sm)}>
            {title}
        </H>
    );

    if (layout === 'split') {
        return (
            <div className={cn('mb-8 lg:mb-12 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-16 lg:gap-y-4', className)}>
                <div className="min-w-0 max-w-[760px]">
                    {eyebrow ? <Eyebrow className="mb-2 lg:mb-3">{eyebrow}</Eyebrow> : null}
                    {heading}
                </div>
                {intro ? <div className="mb-0 mt-3.5 text-fg-muted lg:m-0 lg:max-w-[460px]">{intro}</div> : null}
                {action ? <div className="mt-6 shrink-0 lg:mt-0">{action}</div> : null}
            </div>
        );
    }

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
                {eyebrow ? (
                    <Eyebrow align={centered ? 'center' : 'start'} className="mb-3 lg:mb-4">
                        {eyebrow}
                    </Eyebrow>
                ) : null}
                {heading}
                {intro ? <div className={cn('mt-4 max-w-[680px] text-body-lg text-fg-muted lg:mt-5', centered && 'mx-auto')}>{intro}</div> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

/** Preferred name in new code. */
export const SectionHeading = SectionHeader;
export type SectionHeadingProps = SectionHeaderProps;
