/**
 * Builds the email (mailto:) and WhatsApp messages for /rfq.
 *
 * Owner decision (7 Nov 2026): no web form. Every enquiry is sent from the
 * buyer's own company email or WhatsApp number, so the source can be checked.
 * The page prepares the message; the buyer completes the blank lines and sends it.
 *
 * Pure TypeScript (no React, no next-intl): labels are passed in already translated.
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

/** https://wa.me/<digits>?text=… (number in international format, digits only). */
export function whatsappHref(number: string, m: RfqMessageInput): string {
    return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText(m))}`;
}
