/**
 * Builds the email (mailto:) and WhatsApp messages for /requirements.
 *
 * Owner decision (7 Nov 2026): no web form. Every enquiry is sent from the
 * buyer's own company email or WhatsApp number, so the source can be checked.
 * The page prepares the message; the buyer completes the blank lines and sends it.
 *
 * Pure TypeScript with no imports (no React, no next-intl, no config): labels are
 * passed in already translated, so the client view (RfqRequestPanelView) can use
 * it. message.ts re-exports it for server callers.
 */

/** How the message is shaped. quote = seafood RFQ (product/market/specifications/general). */
export type RfqMessageKind = 'quote' | 'corporate' | 'documents';

export interface RfqLine {
    label: string;
    /** Prefilled value; empty → the buyer fills it in after the colon */
    value?: string;
}

export interface RfqMessageInput {
    subject: string;
    greeting: string;
    intro: string;
    /** Every labelled line of the email body, in order */
    lines: RfqLine[];
    /** WhatsApp: opening sentence */
    waIntro: string;
    /** WhatsApp: shorter list (prefilled lines + a few identity lines) */
    waLines: RfqLine[];
}

const CRLF = '\r\n';

/** "Species: Tilapia" or "Company: " (blank after the colon) */
const line = (l: RfqLine) => `${l.label}: ${l.value?.trim() ?? ''}`;

/** Plain-text email body (CRLF line breaks, as RFC 6068 expects). */
export function emailBody(m: RfqMessageInput): string {
    return [m.greeting, '', m.intro, '', ...m.lines.map(line)].join(CRLF);
}

/** mailto: URL with subject and body, both percent-encoded. */
export function mailtoHref(email: string, m: RfqMessageInput): string {
    return `mailto:${email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(emailBody(m))}`;
}

/** WhatsApp text: shorter than the email. */
export function whatsappText(m: RfqMessageInput): string {
    return [m.waIntro, '', ...m.waLines.map(line)].join('\n');
}

/**
 * https://wa.me/<digits>?text=… (number in international format, digits only).
 * Client-safe: the number is passed in (no company config in the browser bundle).
 */
export function whatsappHrefFor(number: string, m: RfqMessageInput): string {
    return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText(m))}`;
}

// ── Message content per topic ─────────────────────────────────────────────

/** Copy for the prepared messages, formatted on the server (rfq_v2.mail). */
export interface RfqMailCopy {
    /** greeting, intro_*, subject_*, wa_intro_*; `*_for` subjects keep a literal "{item}" placeholder */
    text: Record<string, string>;
    /** mail.labels.* */
    labels: Record<string, string>;
}

/** Prefill already turned into display text (params.ts labelPrefill). */
export interface RfqMessageValues {
    species?: string;
    country?: string;
    form?: string;
    grade?: string;
}

/** Topic of the enquiry (lib/v2/routes RfqType). */
type Topic = 'product' | 'market' | 'specifications' | 'documents' | 'corporate' | 'general';

const fill = (template: string, item: string) => template.split('{item}').join(item);

/** Email + WhatsApp message for a topic and its prefill (the same on server and client). */
export function buildRfqMessage(topic: Topic, p: RfqMessageValues, copy: RfqMailCopy): RfqMessageInput {
    const T = (k: string) => copy.text[k] ?? '';
    const L = (k: string) => copy.labels[k] ?? k;
    const identity: RfqLine[] = [{ label: L('company') }, { label: L('name') }, { label: L('job') }, { label: L('website') }, { label: L('phone') }];

    if (topic === 'corporate') {
        return {
            subject: T('subject_corporate'),
            greeting: T('greeting'),
            intro: T('intro_corporate'),
            lines: [{ label: L('topic') }, ...identity, { label: L('message') }],
            waIntro: T('wa_intro_corporate'),
            waLines: [{ label: L('topic') }, { label: L('company') }, { label: L('name') }],
        };
    }
    if (topic === 'documents') {
        return {
            subject: p.species ? fill(T('subject_documents_for'), p.species) : T('subject_documents'),
            greeting: T('greeting'),
            intro: T('intro_documents'),
            lines: [{ label: L('documents') }, { label: L('product'), value: p.species }, { label: L('market'), value: p.country }, ...identity],
            waIntro: T('wa_intro_documents'),
            waLines: [
                { label: L('documents') },
                ...(p.species ? [{ label: L('product'), value: p.species }] : []),
                ...(p.country ? [{ label: L('market'), value: p.country }] : []),
                { label: L('company') },
                { label: L('name') },
            ],
        };
    }
    const item = p.species ?? p.country;
    const base = topic === 'specifications' ? 'specs' : 'quote';
    return {
        subject: item ? fill(T(`subject_${base}_for`), item) : T(`subject_${base}`),
        greeting: T('greeting'),
        intro: T(`intro_${base}`),
        lines: [
            { label: L('species'), value: p.species },
            { label: L('grade'), value: p.grade },
            { label: L('form'), value: p.form },
            { label: L('packing') },
            { label: L('volume') },
            { label: L('frequency') },
            { label: L('destination'), value: p.country },
            { label: L('freight') },
            { label: L('terms') },
            { label: L('date') },
            ...identity,
        ],
        waIntro: T(`wa_intro_${base}`),
        waLines: [
            { label: L('species'), value: p.species },
            ...(p.grade ? [{ label: L('grade'), value: p.grade }] : []),
            ...(p.form ? [{ label: L('form'), value: p.form }] : []),
            { label: L('volume') },
            { label: L('destination'), value: p.country },
            { label: L('company') },
            { label: L('name') },
        ],
    };
}

/** Read-only summary of what is already filled in. */
export function summaryRows(topic: Topic, p: RfqMessageValues, copy: RfqMailCopy): { label: string; value: string }[] {
    const L = (k: string) => copy.labels[k] ?? k;
    const rows =
        topic === 'corporate' || topic === 'documents'
            ? [
                  { label: L('product'), value: p.species },
                  { label: L('market'), value: p.country },
              ]
            : [
                  { label: L('species'), value: p.species },
                  { label: L('grade'), value: p.grade },
                  { label: L('form'), value: p.form },
                  { label: L('destination'), value: p.country },
              ];
    return rows.filter((r): r is { label: string; value: string } => Boolean(r.value));
}
