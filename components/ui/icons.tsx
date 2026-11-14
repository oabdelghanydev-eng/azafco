/**
 * The site's icon set: semantic names over Lucide (react-icons/lu) line icons,
 * plus the official WhatsApp brand mark (Simple Icons, react-icons/si).
 *
 * - Decorative by default (aria-hidden). Pass `label` when the icon carries meaning
 *   on its own; otherwise give the parent control a text label.
 * - Sizes: 16 / 20 / 24 (default 20). Stroke 1.75 for every line icon.
 * - Directional icons (ArrowIcon, ChevronEndIcon, ExternalIcon) mirror in RTL.
 * - Each Lucide icon is imported by name, so only the icons used here ship.
 *
 * Need a new icon? Add one wrapper here (Lucide first; https://lucide.dev), never
 * hand-draw an <svg>.
 */
import type { IconType } from 'react-icons';
import {
    LuArrowRight,
    LuArrowUp,
    LuArrowUpRight,
    LuBadgeCheck,
    LuCalendarDays,
    LuCheck,
    LuChevronDown,
    LuChevronRight,
    LuClipboardCheck,
    LuFileCheck2,
    LuFileText,
    LuFish,
    LuGlobe,
    LuListFilter,
    LuMail,
    LuMapPin,
    LuMenu,
    LuPackage,
    LuPackageOpen,
    LuPhone,
    LuPlaneTakeoff,
    LuPlus,
    LuScale,
    LuSlice,
    LuSnowflake,
    LuThermometerSnowflake,
    LuTruck,
    LuX,
} from 'react-icons/lu';
import { SiWhatsapp } from 'react-icons/si';
import { Icon, type IconSize } from './Icon';

export interface IconProps {
    /**
     * 16 / 20 / 24 for UI icons (default 20); 28 / 32 for brand marks on a floating
     * action. Other numbers snap to the nearest step (14 -> 16, 18 -> 20, 22 -> 24).
     */
    size?: IconSize | number;
    /** Accessible name; omit for decorative icons */
    label?: string;
    className?: string;
    /** Accepted for old call sites; icons are aria-hidden unless `label` is set */
    'aria-hidden'?: boolean | 'true' | 'false';
}

/** Snap any requested size onto the 16 / 20 / 24 / 28 / 32 scale. */
export function iconSize(n: number): IconSize {
    if (n <= 17) return 16;
    if (n <= 21) return 20;
    if (n <= 25) return 24;
    if (n <= 29) return 28;
    return 32;
}

function make(glyph: IconType, opts: { flip?: boolean; kind?: 'line' | 'brand' } = {}) {
    function SetIcon({ size = 20, label, className }: IconProps) {
        return <Icon icon={glyph} size={iconSize(size)} label={label} className={className} flip={opts.flip} kind={opts.kind} />;
    }
    return SetIcon;
}

/* ── Navigation and actions ──────────────────────────────────────────────── */
/** Points to the reading direction's end (→ in LTR, ← in RTL). */
export const ArrowIcon = /* @__PURE__ */ make(LuArrowRight, { flip: true });
export const ArrowUpIcon = /* @__PURE__ */ make(LuArrowUp);
export const ChevronDownIcon = /* @__PURE__ */ make(LuChevronDown);
/** Points to the reading direction's end (› in LTR, ‹ in RTL). */
export const ChevronEndIcon = /* @__PURE__ */ make(LuChevronRight, { flip: true });
export const MenuIcon = /* @__PURE__ */ make(LuMenu);
export const CloseIcon = /* @__PURE__ */ make(LuX);
export const PlusIcon = /* @__PURE__ */ make(LuPlus);
export const CheckIcon = /* @__PURE__ */ make(LuCheck);
/** Opens in a new tab / leaves the site (↗, mirrored in RTL). */
export const ExternalIcon = /* @__PURE__ */ make(LuArrowUpRight, { flip: true });

/* ── Contact ─────────────────────────────────────────────────────────────── */
export const GlobeIcon = /* @__PURE__ */ make(LuGlobe);
export const PhoneIcon = /* @__PURE__ */ make(LuPhone);
export const MailIcon = /* @__PURE__ */ make(LuMail);
export const MapPinIcon = /* @__PURE__ */ make(LuMapPin);
/** Official WhatsApp mark (Simple Icons). Brand colour: bg-whatsapp / text-whatsapp. */
export const WhatsAppIcon = /* @__PURE__ */ make(SiWhatsapp, { kind: 'brand' });

/* ── Documents and quality ───────────────────────────────────────────────── */
export const DocumentIcon = /* @__PURE__ */ make(LuFileText);
export const DocumentCheckIcon = /* @__PURE__ */ make(LuFileCheck2);
export const ClipboardCheckIcon = /* @__PURE__ */ make(LuClipboardCheck);
export const BadgeCheckIcon = /* @__PURE__ */ make(LuBadgeCheck);
export const CalendarIcon = /* @__PURE__ */ make(LuCalendarDays);

/* ── Supply chain (process steps) ────────────────────────────────────────── */
/** Farming and sourcing / harvest */
export const HarvestNetIcon = /* @__PURE__ */ make(LuFish);
export const FishIcon = /* @__PURE__ */ make(LuFish);
/** Grading / sorting by weight */
export const SortGradeIcon = /* @__PURE__ */ make(LuListFilter);
/** Receiving crate */
export const CrateIcon = /* @__PURE__ */ make(LuPackageOpen);
/** Processing / cutting */
export const KnifeIcon = /* @__PURE__ */ make(LuSlice);
/** Packed box */
export const BoxIcon = /* @__PURE__ */ make(LuPackage);
/** Weighing */
export const ScaleIcon = /* @__PURE__ */ make(LuScale);
/** Chilled / temperature (no °C claims in copy without an approved figure) */
export const ThermometerIcon = /* @__PURE__ */ make(LuThermometerSnowflake);
/** Icing */
export const IceIcon = /* @__PURE__ */ make(LuSnowflake);
/** Road dispatch */
export const TruckIcon = /* @__PURE__ */ make(LuTruck);
/** Air freight */
export const PlaneIcon = /* @__PURE__ */ make(LuPlaneTakeoff);
