import { cn } from '@/lib/v2/cn';

/**
 * Official AZAFCO International artwork from public/brand/ (copied unchanged
 * from branding/group-identity/azafco-international/svg). English-only, same in
 * every locale. Never recolour, stretch, add effects, or place the full-colour
 * file on navy (use `reversed`).
 *
 * Minimum sizes (branding NOTES.md): full logo 120px wide, symbol 64px wide.
 * Aspect ratios are fixed: logo 739.133 x 495.527, symbol 412.137 x 290.6.
 */
export type LogoKind = 'primary' | 'reversed' | 'symbol' | 'symbol-reversed';

const files: Record<LogoKind, { src: string; ratio: number; min: number }> = {
    primary: { src: '/brand/logo-primary.svg', ratio: 495.527 / 739.133, min: 120 },
    reversed: { src: '/brand/logo-reversed.svg', ratio: 495.527 / 739.133, min: 120 },
    symbol: { src: '/brand/symbol.svg', ratio: 290.6 / 412.137, min: 64 },
    'symbol-reversed': { src: '/brand/symbol-reversed.svg', ratio: 290.6 / 412.137, min: 64 },
};

export interface LogoProps {
    kind?: LogoKind;
    /** Rendered width in CSS px (clamped to the minimum size) */
    width?: number;
    /** Accessible name; pass '' when the parent link already has a label */
    alt?: string;
    className?: string;
}

export default function Logo({ kind = 'primary', width = 132, alt = 'AZAFCO International', className }: LogoProps) {
    const f = files[kind];
    const w = Math.max(width, f.min);
    const h = Math.round(w * f.ratio);
    return (
        // Plain <img>: SVGs need no optimisation and must not be re-encoded.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.src} width={w} height={h} alt={alt} aria-hidden={alt === "" ? true : undefined} className={cn('block h-auto max-w-none', className)} style={{ width: w }} />
    );
}
