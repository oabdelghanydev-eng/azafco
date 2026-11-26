/**
 * Site v2 RFQ / business enquiry: field model + validation.
 *
 * Shared by the client form (components/v2/rfq/RfqForm.tsx) and the route
 * handler (app/api/contact/route.ts, `form: 'rfq'` payloads) so both apply the
 * same rules. Pure TypeScript: no server or browser APIs.
 *
 * Two shapes, one payload:
 *   variant 'full'  = 2-step seafood RFQ (brief §21): species, volume + unit and
 *                     destination are required.
 *   variant 'short' = corporate / documents enquiry: no species, message required.
 */

import { products } from '@/data/products';

export const RFQ_FORM_ID = 'rfq' as const;

/** Name of the hidden honeypot input; humans never fill it (same as the legacy form) */
export const RFQ_HONEYPOT = 'website';
/** Submissions faster than this after the form rendered are treated as bots */
export const RFQ_MIN_FILL_MS = 3000;

export type RfqVariant = 'full' | 'short';
/** What the enquiry is about. `documents` and `corporate` use the short form. */
export type RfqTopic = 'product' | 'market' | 'specifications' | 'general' | 'corporate' | 'documents';
export const RFQ_TOPICS: readonly RfqTopic[] = ['product', 'market', 'specifications', 'general', 'corporate', 'documents'];
export const SHORT_TOPICS: readonly RfqTopic[] = ['corporate', 'documents'];

/** Species values = product slugs + 'other' (describe in notes) */
export const RFQ_SPECIES: readonly string[] = [...products.map((p) => p.slug), 'other'];

/** Only what the site already states: fish shipped whole and fresh-chilled. Anything else goes to "other". */
export const PRODUCT_FORMS = ['fresh_whole', 'other'] as const;
/** EPS box with ice is stated in the importing guide; buyer spec / unsure otherwise */
export const PACKAGING = ['eps_ice', 'buyer_spec', 'not_sure'] as const;
export const VOLUME_UNITS = ['kg', 'tonnes', 'boxes'] as const;
export const FREQUENCIES = ['one_off', 'weekly', 'monthly', 'not_sure'] as const;
/** Buyer's preferred term, if known. Not an offer: terms are set per quote. */
export const INCOTERMS = ['not_sure', 'EXW', 'FCA', 'FOB', 'CPT', 'CFR', 'CIP', 'CIF', 'DAP', 'DDP'] as const;
export const DOCUMENTS = ['health_certificate', 'certificate_of_origin', 'specification_sheet', 'certificates', 'company_profile', 'other'] as const;
export const BUYER_TYPES = ['importer', 'distributor', 'horeca', 'foodservice', 'retail', 'other'] as const;
export const CORPORATE_TOPICS = ['partnership', 'investment', 'supplier', 'media', 'other'] as const;

export const LIMITS = {
    grade: 120,
    volume: 12,
    destinationOther: 80,
    company: 160,
    name: 120,
    jobTitle: 120,
    email: 200,
    phone: 30,
    countryOther: 80,
    notes: 3000,
    source: 300,
} as const;

export interface RfqData {
    form: typeof RFQ_FORM_ID;
    variant: RfqVariant;
    topic: RfqTopic;
    // Step 1: supply requirement (full form)
    species: string;
    grade: string;
    productForm: string;
    packaging: string;
    volume: string;
    volumeUnit: string;
    frequency: string;
    /** ISO alpha-2 or 'OTHER' */
    destination: string;
    destinationOther: string;
    /** YYYY-MM-DD */
    requiredDate: string;
    incoterm: string;
    documents: string[];
    // Short form
    corporateTopic: string;
    // Step 2: business credentials
    company: string;
    name: string;
    jobTitle: string;
    email: string;
    /** ISO alpha-2 or 'OTHER' (company country) */
    country: string;
    countryOther: string;
    /** ISO alpha-2 of the dialling code picked in the prefix select */
    phoneCountry: string;
    phone: string;
    buyerType: string;
    notes: string;
    consent: boolean;
    // Context (non-personal): page the form was sent from, UTM tags, prefill
    source: string;
    utm: Record<string, string>;
}

export type RfqField = Exclude<keyof RfqData, 'form' | 'variant' | 'topic' | 'source' | 'utm'>;
/** Error codes map to rfq_v2.errors.<code> */
export type RfqError = 'required' | 'too_long' | 'invalid_email' | 'invalid_phone' | 'invalid_option' | 'invalid_number' | 'invalid_date' | 'consent';
export type RfqErrors = Partial<Record<RfqField, RfqError>>;

export const EMPTY_RFQ: RfqData = {
    form: RFQ_FORM_ID,
    variant: 'full',
    topic: 'general',
    species: '',
    grade: '',
    productForm: '',
    packaging: '',
    volume: '',
    volumeUnit: 'kg',
    frequency: '',
    destination: '',
    destinationOther: '',
    requiredDate: '',
    incoterm: '',
    documents: [],
    corporateTopic: '',
    company: '',
    name: '',
    jobTitle: '',
    email: '',
    country: '',
    countryOther: '',
    phoneCountry: '',
    phone: '',
    buyerType: '',
    notes: '',
    consent: false,
    source: '',
    utm: {},
};

/** Fields per step, in visual order (used for focus management). */
export const STEP1_FIELDS: RfqField[] = ['species', 'grade', 'productForm', 'packaging', 'volume', 'volumeUnit', 'frequency', 'destination', 'destinationOther', 'requiredDate', 'incoterm', 'documents'];
export const STEP2_FIELDS: RfqField[] = ['corporateTopic', 'documents', 'company', 'name', 'jobTitle', 'email', 'country', 'countryOther', 'phoneCountry', 'phone', 'buyerType', 'notes', 'consent'];

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_CHARS_RE = /^[\d\s\-().]+$/;
const ISO2_RE = /^[A-Z]{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

const str = (v: unknown, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max + 1) : '');
const oneOf = <T extends string>(list: readonly T[], v: string) => (list as readonly string[]).includes(v);

export function variantForTopic(topic: RfqTopic): RfqVariant {
    return (SHORT_TOPICS as readonly string[]).includes(topic) ? 'short' : 'full';
}

/** Coerce unknown input (JSON body) into trimmed RFQ data. */
export function normalizeRfq(input: unknown): RfqData {
    const o = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
    const topicRaw = str(o.topic);
    const topic: RfqTopic = oneOf(RFQ_TOPICS, topicRaw) ? (topicRaw as RfqTopic) : 'general';
    const docs = Array.isArray(o.documents)
        ? Array.from(new Set(o.documents.filter((d): d is string => typeof d === 'string').map((d) => d.trim()))).slice(0, DOCUMENTS.length + 1)
        : [];
    const utmIn = (o.utm && typeof o.utm === 'object' ? o.utm : {}) as Record<string, unknown>;
    const utm: Record<string, string> = {};
    for (const k of UTM_KEYS) {
        const v = str(utmIn[k], 100);
        if (v) utm[k] = v.slice(0, 100);
    }
    return {
        form: RFQ_FORM_ID,
        variant: variantForTopic(topic),
        topic,
        species: str(o.species),
        grade: str(o.grade),
        productForm: str(o.productForm),
        packaging: str(o.packaging),
        volume: str(o.volume),
        volumeUnit: str(o.volumeUnit),
        frequency: str(o.frequency),
        destination: str(o.destination).toUpperCase(),
        destinationOther: str(o.destinationOther),
        requiredDate: str(o.requiredDate),
        incoterm: str(o.incoterm),
        documents: docs,
        corporateTopic: str(o.corporateTopic),
        company: str(o.company),
        name: str(o.name),
        jobTitle: str(o.jobTitle),
        email: str(o.email),
        country: str(o.country).toUpperCase(),
        countryOther: str(o.countryOther),
        phoneCountry: str(o.phoneCountry).toUpperCase(),
        phone: str(o.phone),
        buyerType: str(o.buyerType),
        notes: str(o.notes),
        consent: o.consent === true,
        source: str(o.source, LIMITS.source).slice(0, LIMITS.source),
        utm,
    };
}

function checkLimits(d: RfqData, fields: RfqField[], errors: RfqErrors) {
    for (const f of fields) {
        const max = (LIMITS as Record<string, number>)[f];
        const v = d[f];
        if (max && typeof v === 'string' && v.length > max && !errors[f]) errors[f] = 'too_long';
    }
}

/** Step 1 (supply requirement). Empty object when valid. Short form has no step 1. */
export function validateStep1(d: RfqData): RfqErrors {
    const e: RfqErrors = {};
    if (d.variant === 'short') return e;

    if (!d.species) e.species = 'required';
    else if (!oneOf(RFQ_SPECIES, d.species)) e.species = 'invalid_option';

    if (!d.volume) e.volume = 'required';
    else if (!/^\d+([.,]\d{1,3})?$/.test(d.volume) || Number(d.volume.replace(',', '.')) <= 0) e.volume = 'invalid_number';
    if (!oneOf(VOLUME_UNITS, d.volumeUnit)) e.volumeUnit = 'invalid_option';

    if (!d.destination) e.destination = 'required';
    else if (d.destination === 'OTHER') {
        if (!d.destinationOther) e.destinationOther = 'required';
    } else if (!ISO2_RE.test(d.destination)) e.destination = 'invalid_option';

    if (d.productForm && !oneOf(PRODUCT_FORMS, d.productForm)) e.productForm = 'invalid_option';
    if (d.packaging && !oneOf(PACKAGING, d.packaging)) e.packaging = 'invalid_option';
    if (d.frequency && !oneOf(FREQUENCIES, d.frequency)) e.frequency = 'invalid_option';
    if (d.incoterm && !oneOf(INCOTERMS, d.incoterm)) e.incoterm = 'invalid_option';
    if (d.documents.some((x) => !oneOf(DOCUMENTS, x))) e.documents = 'invalid_option';
    if (d.requiredDate && (!DATE_RE.test(d.requiredDate) || Number.isNaN(Date.parse(d.requiredDate)))) e.requiredDate = 'invalid_date';

    checkLimits(d, ['grade', 'volume', 'destinationOther'], e);
    return e;
}

/** Step 2 (business credentials), or the whole short form. */
export function validateStep2(d: RfqData): RfqErrors {
    const e: RfqErrors = {};
    const required: RfqField[] = ['company', 'name', 'email', 'country', 'phone'];
    if (d.variant === 'full') required.push('buyerType');
    if (d.variant === 'short') required.push('notes');
    if (d.variant === 'short' && d.topic === 'corporate') required.push('corporateTopic');
    for (const f of required) if (!d[f]) e[f] = 'required';

    if (!e.email && !EMAIL_RE.test(d.email)) e.email = 'invalid_email';

    if (!e.country) {
        if (d.country === 'OTHER') {
            if (!d.countryOther) e.countryOther = 'required';
        } else if (!ISO2_RE.test(d.country)) e.country = 'invalid_option';
    }
    if (d.phoneCountry && d.phoneCountry !== 'OTHER' && !ISO2_RE.test(d.phoneCountry)) e.phoneCountry = 'invalid_option';
    if (!e.phone) {
        const digits = d.phone.replace(/\D/g, '').length;
        const raw = d.phone.replace(/^\+/, '');
        if (!PHONE_CHARS_RE.test(raw) || digits < 6 || digits > 15) e.phone = 'invalid_phone';
    }
    if (d.buyerType && !oneOf(BUYER_TYPES, d.buyerType)) e.buyerType = 'invalid_option';
    if (d.corporateTopic && !oneOf(CORPORATE_TOPICS, d.corporateTopic)) e.corporateTopic = 'invalid_option';
    if (d.variant === 'short' && d.documents.some((x) => !oneOf(DOCUMENTS, x))) e.documents = 'invalid_option';
    if (!d.consent) e.consent = 'consent';

    checkLimits(d, ['company', 'name', 'jobTitle', 'email', 'countryOther', 'phone', 'notes'], e);
    return e;
}

export function validateRfq(d: RfqData): RfqErrors {
    return { ...validateStep1(d), ...validateStep2(d) };
}

/** Short reference shown to the buyer and used in the email subject, e.g. AZ-261107-K3F9 */
export function makeRfqReference(now = new Date()): string {
    const y = String(now.getUTCFullYear()).slice(2);
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
    return `AZ-${y}${m}${day}-${rand}`;
}

export const RFQ_REF_RE = /^AZ-\d{6}-[A-Z0-9]{4}$/;

/** sessionStorage key for the non-sensitive summary shown on /rfq/thank-you */
export const RFQ_SUMMARY_KEY = 'azafco_rfq_summary';
export interface RfqSummary {
    ref?: string;
    variant: RfqVariant;
    topic: RfqTopic;
    species?: string;
    volume?: string;
    destination?: string;
}
