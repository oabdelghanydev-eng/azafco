/**
 * "Send your request" panel (server wrapper, no form).
 *
 * Owner decision (7 Nov 2026): no web form anywhere. A request must come from
 * the buyer's own company email or WhatsApp number, so the source is checkable.
 * The panel prepares the message from the page the buyer came from
 * (?product, ?grade, ?form, ?country, ?type) and offers:
 *   1. Email the export team (details and documents): mailto: with subject + labelled body
 *   2. WhatsApp, direct to management (fast deals): wa.me with a shorter text
 *   3. Phone (tel:) + the address and subject as plain, copyable text
 * Clicks are tracked by RfqTracker (rfq_email_click / rfq_whatsapp_click / rfq_phone_click).
 *
 * This wrapper translates the copy and the species / form names and renders the
 * client view (RfqRequestPanelView):
 * - with fixed props (topic, product, ...) where the page knows them (/for-importers);
 * - with `fromQuery`, the view reads the query in the browser (useSearchParams in
 *   <Suspense>), so /requirements stays static; the static HTML shows the general message.
 */
import { Suspense } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { phoneDisplay } from '@/components/ui/format';
import { getPrefillNames } from './options';
import { labelSeparator, type RfqMailCopy } from './compose';
import type { RfqTopic } from './params';
import RfqRequestPanelView, { type RfqPanelContact, type RfqPanelCopy } from './RfqRequestPanelView';
import { RfqPanelFromQuery } from './RfqQuery';

export interface RfqRequestPanelProps {
    topic?: RfqTopic;
    /** Product slug (?product=); ignored if unknown */
    product?: string;
    /** ISO alpha-2 (?country=) */
    country?: string;
    /** Product form code (?form=), lib/v2/specs FORM_KINDS */
    form?: string;
    /** Free-text size grade (?grade=) */
    grade?: string;
    /** Read topic and prefill from the URL query in the browser (static /requirements) */
    fromQuery?: boolean;
    /** Unique per page if the panel appears more than once */
    idPrefix?: string;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

/** Every string of a message group, formatted; `*_for` keys keep a literal {item} for the client to fill. */
function formatGroup(t: (key: string, values?: Record<string, string>) => string, raw: unknown, prefix: string): Record<string, string> {
    const out: Record<string, string> = {};
    if (!raw || typeof raw !== 'object') return out;
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        if (typeof v !== 'string') continue;
        out[k] = k.endsWith('_for') ? t(`${prefix}${k}`, { item: '{item}' }) : t(`${prefix}${k}`);
    }
    return out;
}

export default async function RfqRequestPanel({ topic = 'general', product, country, form, grade, fromQuery = false, idPrefix = 'rfq', headingAs = 'h2', className }: RfqRequestPanelProps) {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'rfq_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2.cta' });
    const tt = t as unknown as (key: string, values?: Record<string, string>) => string;

    const mail: RfqMailCopy = {
        text: formatGroup(tt, t.raw('mail'), 'mail.'),
        labels: formatGroup(tt, t.raw('mail.labels'), 'mail.labels.'),
        separator: labelSeparator(locale),
    };
    const copy: RfqPanelCopy = {
        request: formatGroup(tt, t.raw('request'), 'request.'),
        mail,
        newTab: tv('opens_new_tab'),
        call: tv('call'),
    };
    const c = companyConfig.contact;
    const contact: RfqPanelContact = { email: c.email, whatsappNumber: c.whatsappNumber, phone: c.phone, phoneDisplay: phoneDisplay(c.whatsappNumber) };
    const names = await getPrefillNames(locale);
    const shared = { locale, copy, names, contact, idPrefix, headingAs, className };

    if (fromQuery) {
        return (
            <Suspense fallback={<RfqRequestPanelView {...shared} topic="general" />}>
                <RfqPanelFromQuery {...shared} />
            </Suspense>
        );
    }
    return <RfqRequestPanelView {...shared} topic={topic} product={product} country={country} form={form} grade={grade} />;
}
