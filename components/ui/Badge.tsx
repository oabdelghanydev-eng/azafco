import type { ReactNode } from 'react';
import { cn } from './tokens';

/**
 * Pill / badge for short status labels ("Active", "Planned", "ISO 9001:2015").
 * Not interactive (use <Button size="sm" variant="outline"> for a clickable chip).
 *
 *   neutral  off-white + ink        (light surfaces)
 *   navy     navy + white
 *   gold     gold + navy-900        (sparingly: one highlight per group)
 *   outline  hairline border, follows the surface (works on navy)
 */
export type BadgeTone = 'neutral' | 'navy' | 'gold' | 'outline';

const tones: Record<BadgeTone, string> = {
    neutral: 'bg-surface-offwhite text-ink',
    navy: 'bg-navy text-white',
    gold: 'bg-gold text-navy-900',
    outline: 'border border-solid border-edge text-fg',
};

export interface BadgeProps {
    children: ReactNode;
    tone?: BadgeTone;
    /** Leading icon (16px) */
    icon?: ReactNode;
    className?: string;
}

export function Badge({ children, tone = 'neutral', icon, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex min-h-[28px] items-center gap-1.5 rounded-full px-3 py-1 text-caption font-semibold leading-tight',
                tones[tone],
                className,
            )}
        >
            {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
            {children}
        </span>
    );
}

/** Same component, the name some pages use. */
export const Pill = Badge;

export default Badge;
