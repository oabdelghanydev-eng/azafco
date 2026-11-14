/**
 * Class-name tokens shared by the primitives. Colours resolve to Tailwind tokens
 * (tailwind.config.js) or to the surface-aware CSS variables in app/globals.css,
 * never to inline hex. See docs/team/web/g/DESIGN-SYSTEM.md.
 */
export { cn } from '@/lib/v2/cn';

/**
 * Focus ring that follows the surface: navy on light, gold inside any
 * data-surface="dark" block (Section variant="navy", PageHero, PageHead).
 */
export const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Fixed navy ring, for controls on a light surface outside the shell's surface system. */
export const focusRingLight =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy';

/** Fixed gold ring, for controls on navy that are not inside a data-surface="dark" block. */
export const focusRingDark =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

/** 1320px container with the G side padding (20px phone, 32px from md). */
export const containerClass = 'mx-auto box-border w-full max-w-v2 px-5 md:px-8';

/** Section rhythm: 64px on phones, 80px tablet, 112px from lg. */
export const sectionY = 'py-section-sm md:py-20 lg:py-section';

/**
 * Type roles. Sizes, leading, tracking and weight come from CSS variables, so the
 * same class gives the Arabic or the Latin setting from the element's lang.
 */
export const typography = {
    /** Home hero h1 only */
    display: 'font-display text-display-xl',
    /** Inner-page h1 (PageHead, photo heroes) */
    h1: 'font-display text-display-page',
    /** Section h2 */
    h2: 'font-display text-display-lg',
    /** Smaller h2 (sub-sections, closing cards) */
    h2Sm: 'font-display text-heading-xl',
    /** Larger h3 (footer contact rows, feature titles): 21px -> 24px */
    h3Lg: 'font-display text-heading-lg',
    /** Card / step h3 */
    h3: 'font-display text-heading-md',
    /** h4 / list titles */
    h4: 'font-display text-heading-sm',
    lead: 'text-body-lg',
    body: 'text-body',
    small: 'text-body-sm',
    caption: 'text-caption',
    /** Legal lines, language chips, row numbers (13px EN / 14px AR) */
    micro: 'text-micro',
    /** Eyebrow / stage label */
    overline: 'text-overline',
} as const;

export type TypeRole = keyof typeof typography;
