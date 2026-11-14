import { cn } from '@/lib/v2/cn';

/**
 * Design signature: thin globe meridian arcs + one swoosh curve, abstracted
 * from the logo's globe. Purely decorative (aria-hidden), low-contrast, never
 * placed next to or behind the logo itself.
 *
 * Position it with `className` inside a `relative` parent, e.g.
 *   <GeoArcs className="absolute -end-24 -top-24 w-[560px]" tone="onDark" />
 * In RTL it mirrors so the swoosh keeps sweeping toward the reading end.
 */
export interface GeoArcsProps {
    tone?: 'onLight' | 'onDark';
    /** Draw the gold swoosh accent (default true) */
    swoosh?: boolean;
    className?: string;
}

export default function GeoArcs({ tone = 'onLight', swoosh = true, className }: GeoArcsProps) {
    const line = tone === 'onDark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,45,114,0.10)';
    const accent = tone === 'onDark' ? 'rgba(247,181,0,0.55)' : 'rgba(247,181,0,0.7)';
    return (
        <svg
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
            focusable="false"
            className={cn('pointer-events-none select-none rtl:-scale-x-100', className)}
        >
            <g stroke={line} strokeWidth="1.25">
                <circle cx="300" cy="300" r="240" />
                <ellipse cx="300" cy="300" rx="160" ry="240" />
                <ellipse cx="300" cy="300" rx="70" ry="240" />
                <path d="M60 300h480" />
                <path d="M90 190c120 22 300 22 420 0" />
                <path d="M90 410c120-22 300-22 420 0" />
            </g>
            {swoosh ? (
                <path d="M20 430C170 300 360 210 590 190" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            ) : null}
        </svg>
    );
}
