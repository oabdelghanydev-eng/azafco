import type { IconType } from 'react-icons';
import { cn } from './tokens';

/**
 * Icon sizes (px). UI icons use 16 / 20 / 24. 28 and 32 are reserved for brand
 * marks on a floating or hero action (e.g. the WhatsApp button).
 */
export type IconSize = 16 | 20 | 24 | 28 | 32;

/** Stroke width for every line (Lucide) icon: a little lighter than Lucide's 2, as the G header. */
export const ICON_STROKE = 1.75;

export interface IconProps {
    /**
     * A react-icons component, imported per icon:
     *   import { LuMail } from 'react-icons/lu';        // UI icons: Lucide only
     *   import { SiWhatsapp } from 'react-icons/si';    // brand marks
     */
    icon: IconType;
    size?: IconSize;
    /**
     * Accessible name. Omit for decorative icons (the default: aria-hidden), e.g.
     * when the parent link or button already has a text label.
     */
    label?: string;
    /** Mirror in RTL (arrows, chevrons, "external" arrows) */
    flip?: boolean;
    /** 'line' = Lucide stroke icon (default), 'brand' = filled brand mark (no stroke) */
    kind?: 'line' | 'brand';
    className?: string;
}

/**
 * The one way to render an icon. Server-component friendly (no hooks, no
 * context provider needed), tree-shaken per icon by Next's optimizePackageImports
 * for react-icons/*.
 */
export function Icon({ icon: Glyph, size = 20, label, flip = false, kind = 'line', className }: IconProps) {
    return (
        <Glyph
            size={size}
            {...(kind === 'line' ? { strokeWidth: ICON_STROKE } : {})}
            className={cn('inline-block shrink-0', flip && 'rtl:-scale-x-100', className)}
            focusable="false"
            {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        />
    );
}

export default Icon;
