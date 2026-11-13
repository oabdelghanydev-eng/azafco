import type { SVGProps } from 'react';

/**
 * Thin, restrained line icons (1.6px stroke as the G header icons, 24 grid). Decorative by default
 * (aria-hidden); give the parent control an accessible name.
 * Directional icons (ArrowIcon, ChevronEndIcon) flip automatically in RTL.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, className, ...rest }: IconProps) {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
        focusable: false,
        className,
        ...rest,
    };
}

/** Points to the reading direction's end (→ in LTR, ← in RTL). */
export function ArrowIcon({ className, ...p }: IconProps) {
    return (
        <svg {...base({ ...p, className: `rtl:-scale-x-100 ${className ?? ''}` })}>
            <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
    );
}

export function ChevronDownIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

/** Points to the reading direction's end (› in LTR, ‹ in RTL). */
export function ChevronEndIcon({ className, ...p }: IconProps) {
    return (
        <svg {...base({ ...p, className: `rtl:-scale-x-100 ${className ?? ''}` })}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}

export function MenuIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

export function CloseIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}

export function GlobeIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
    );
}

export function PhoneIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M5 4h3l1.5 4-2 1.2a11 11 0 005.3 5.3l1.2-2 4 1.5v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" />
        </svg>
    );
}

export function MailIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3.5 6.5L12 13l8.5-6.5" />
        </svg>
    );
}

export function WhatsAppIcon({ size = 20, className, ...rest }: IconProps) {
    // Brand glyph (filled), recognisable at small sizes
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} className={className} {...rest}>
            <path d="M12.04 2a9.9 9.9 0 00-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1012.04 2zm0 18.1a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3a8.2 8.2 0 1116.9-4.3 8.2 8.2 0 01-10 8.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" />
        </svg>
    );
}

export function MapPinIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
        </svg>
    );
}

export function CheckIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    );
}

export function PlusIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

export function DocumentIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M7 3h7l5 5v13H7z" />
            <path d="M14 3v5h5M10 13h6M10 17h6" />
        </svg>
    );
}

export function ExternalIcon({ className, ...p }: IconProps) {
    return (
        <svg {...base({ ...p, className: `rtl:-scale-x-100 ${className ?? ''}` })}>
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
        </svg>
    );
}

/* ── Process / supply-chain line icons (24px, 1.5px stroke) ──────────────── */

/** Pond with a harvest net */
export function HarvestNetIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M3 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
            <path d="M6 14l3-9h6l3 9" />
            <path d="M7.3 10h9.4M9 5l1.5 9M15 5l-1.5 9" />
        </svg>
    );
}

/** Sorting / grading by size */
export function SortGradeIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M4 6h16M6.5 12h11M9 18h6" />
        </svg>
    );
}

/** Receiving crate */
export function CrateIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M3 9h18l-1.5 10h-15z" />
            <path d="M8 13h8M7 5.5c1.5-1 3.5-1 5 0s3.5 1 5 0" />
        </svg>
    );
}

/** Processing (filleting knife) */
export function KnifeIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M4 20l7-7" />
            <path d="M11 13l8.5-8.5c.8 3.5-.7 7-4 9.5L13 15.5z" />
        </svg>
    );
}

/** Packed box */
export function BoxIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
            <path d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9" />
        </svg>
    );
}

/** Weighing scale */
export function ScaleIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <rect x="4" y="9" width="16" height="11" rx="2" />
            <path d="M8 5h8M12 5v4M10 15l2-2.5" />
        </svg>
    );
}

/** Temperature control */
export function ThermometerIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M10 13.5V5a2 2 0 014 0v8.5a4 4 0 11-4 0z" />
            <path d="M12 10v6M16.5 6h2M16.5 9h2" />
        </svg>
    );
}

/** Road dispatch */
export function TruckIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5v3h-7" />
            <circle cx="6.5" cy="17.5" r="1.75" />
            <circle cx="17" cy="17.5" r="1.75" />
        </svg>
    );
}

/** Review / compliance check */
export function ClipboardCheckIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <path d="M9 4.5H6.5v16h11v-16H15" />
            <path d="M9 3.5h6v2.5H9zM9 13l2 2 4-4.5" />
        </svg>
    );
}

/** Coordination / schedule */
export function CalendarIcon(p: IconProps) {
    return (
        <svg {...base(p)}>
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path d="M3.5 10h17M8 3v4M16 3v4M8 14h3M8 17h6" />
        </svg>
    );
}
