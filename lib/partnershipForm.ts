/**
 * Partnership / quote enquiry form: shared field definitions and validation.
 *
 * Imported by the client form (components/PartnershipForm.tsx) and the route
 * handler (app/api/contact/route.ts) so both sides apply the same rules.
 * Pure TypeScript only - no server or browser APIs.
 */

import { products } from '@/data/products';

/** Allowed species values = product slugs from data/products.ts */
export const SPECIES_SLUGS: readonly string[] = products.map(p => p.slug);

/** Monthly volume ranges (labels in locales/[locale]/pages/contact.json → partnership_form.volume_options) */
export const VOLUME_OPTIONS = ['under_5', '5_20', '20_50', '50_100', 'over_100', 'not_sure'] as const;
export type VolumeOption = (typeof VOLUME_OPTIONS)[number];

/** Max lengths per text field */
export const LIMITS = {
    company: 160,
    name: 120,
    email: 200,
    phone: 40,
    country: 80,
    message: 3000,
} as const;

/** Name of the hidden honeypot input; humans never fill it */
export const HONEYPOT_FIELD = 'website';

/** Submissions faster than this after the form rendered are treated as bots */
export const MIN_FILL_MS = 3000;

export interface PartnershipEnquiry {
    company: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    species: string[];
    volume: VolumeOption | '';
    message: string;
}

export type FieldName = keyof PartnershipEnquiry;
/** Error codes map to translation keys partnership_form.errors.<code> */
export type FieldError = 'required' | 'too_long' | 'invalid_email' | 'invalid_phone' | 'invalid_option';
export type FieldErrors = Partial<Record<FieldName, FieldError>>;

export const EMPTY_ENQUIRY: PartnershipEnquiry = {
    company: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    species: [],
    volume: '',
    message: '',
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// Digits with optional leading +, spaces, dashes, dots, parentheses; 7-15 digits in total
const PHONE_CHARS_RE = /^\+?[\d\s\-().]+$/;

function str(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

/** Coerce unknown input (form state or JSON body) into a trimmed enquiry. */
export function normalizeEnquiry(input: unknown): PartnershipEnquiry {
    const o = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
    const species = Array.isArray(o.species)
        ? Array.from(new Set(o.species.filter((s): s is string => typeof s === 'string').map(s => s.trim())))
        : [];
    const volume = str(o.volume);
    return {
        company: str(o.company),
        name: str(o.name),
        email: str(o.email),
        phone: str(o.phone),
        country: str(o.country),
        species,
        volume: (volume as VolumeOption) || '',
        message: str(o.message),
    };
}

/** Validate an enquiry. Returns an empty object when valid. */
export function validateEnquiry(e: PartnershipEnquiry): FieldErrors {
    const errors: FieldErrors = {};

    const required: FieldName[] = ['company', 'name', 'email', 'phone', 'country'];
    for (const field of required) {
        if (!(e[field] as string)) errors[field] = 'required';
    }

    (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).forEach(field => {
        if (!errors[field] && e[field].length > LIMITS[field]) errors[field] = 'too_long';
    });

    if (!errors.email && !EMAIL_RE.test(e.email)) errors.email = 'invalid_email';

    if (!errors.phone) {
        const digits = e.phone.replace(/\D/g, '').length;
        if (!PHONE_CHARS_RE.test(e.phone) || digits < 7 || digits > 15) errors.phone = 'invalid_phone';
    }

    if (e.species.length > SPECIES_SLUGS.length || e.species.some(s => !SPECIES_SLUGS.includes(s))) {
        errors.species = 'invalid_option';
    }

    if (e.volume && !(VOLUME_OPTIONS as readonly string[]).includes(e.volume)) {
        errors.volume = 'invalid_option';
    }

    return errors;
}
