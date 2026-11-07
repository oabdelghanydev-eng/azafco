/**
 * POST /api/contact - partnership / quote enquiry from the /[locale]/contact form.
 *
 * Sends the enquiry by email through Resend's HTTP API (no SDK, plain fetch).
 * Env vars (see .env.example):
 *   RESEND_API_KEY      Resend API key
 *   CONTACT_TO_EMAIL    recipient(s), comma-separated
 *   CONTACT_FROM_EMAIL  sender on a domain verified in Resend, e.g. "AZAFCO Website <website@azafco.com.eg>"
 *
 * If they are missing or Resend fails, the enquiry is written to the server log
 * (so it is never lost) and the client gets an error code; the form then shows
 * the company email / WhatsApp as a fallback.
 *
 * Two payload shapes (backward compatible):
 *   - legacy partnership form (components/PartnershipForm.tsx): no `form` key
 *   - site v2 RFQ (components/v2/rfq/RfqForm.tsx): `form: 'rfq'`, validated with
 *     components/v2/rfq/schema.ts; success also returns a reference `ref`.
 *
 * Responses: { ok: true, ref? } | { ok: false, error: 'invalid', fields } (400)
 *   | { ok: false, error: 'too_large' } (413) | { ok: false, error: 'rate_limited' } (429)
 *   | { ok: false, error: 'not_configured' } (503) | { ok: false, error: 'send_failed' } (502)
 */

import { NextResponse } from 'next/server';
import { locales } from '@/i18n';
import { products } from '@/data/products';
import productNamesEn from '@/locales/en/data/products.json';
import contactEn from '@/locales/en/pages/contact.json';
import {
    HONEYPOT_FIELD,
    MIN_FILL_MS,
    normalizeEnquiry,
    validateEnquiry,
    type PartnershipEnquiry,
} from '@/lib/partnershipForm';
import { RFQ_FORM_ID, makeRfqReference, normalizeRfq, validateRfq, type RfqData } from '@/components/v2/rfq/schema';
import { RFQ_COUNTRIES } from '@/components/v2/rfq/countries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Best-effort per-instance rate limit (serverless instances don't share memory).
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > RATE_LIMIT.max;
}

function json(body: Record<string, unknown>, status = 200) {
    return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Strip CR/LF so user input can't break the subject header */
function oneLine(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').slice(0, 120);
}

function speciesLabels(slugs: string[]): string[] {
    const names = productNamesEn as unknown as Record<string, { name?: string }>;
    return slugs.map(slug => {
        const key = products.find(p => p.slug === slug)?.translationKey;
        return (key && names[key]?.name) || slug;
    });
}

function volumeLabel(volume: string): string {
    const labels = (contactEn as { partnership_form?: { volume_options?: Record<string, string> } })
        .partnership_form?.volume_options;
    return (volume && labels?.[volume]) || volume || '—';
}

function buildEmail(e: PartnershipEnquiry, locale: string, ip: string) {
    const rows: [string, string][] = [
        ['Company', e.company],
        ['Name', e.name],
        ['Email', e.email],
        ['Phone / WhatsApp', e.phone],
        ['Country', e.country],
        ['Species of interest', speciesLabels(e.species).join(', ') || '—'],
        ['Monthly volume', volumeLabel(e.volume)],
        ['Site language', locale],
        ['Message', e.message || '—'],
    ];

    const text =
        rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
        `\n\nSent from the partnership form on ${new Date().toISOString()} (IP ${ip}).\nReply to this email to answer the buyer directly.`;

    const html =
        `<h2 style="font-family:sans-serif">New partnership enquiry</h2>` +
        `<table style="font-family:sans-serif;border-collapse:collapse" cellpadding="6">` +
        rows
            .map(
                ([k, v]) =>
                    `<tr><td style="vertical-align:top;font-weight:bold;border-bottom:1px solid #eee">${escapeHtml(k)}</td>` +
                    `<td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
            )
            .join('') +
        `</table><p style="font-family:sans-serif;color:#666;font-size:12px">Sent from the partnership form (IP ${escapeHtml(ip)}). Reply to this email to answer the buyer directly.</p>`;

    const subject = oneLine(`Partnership enquiry: ${e.company} (${e.country})`);
    return { subject, text, html };
}

// ── Site v2 RFQ (form: 'rfq') ───────────────────────────────────────────────

const countryNameEn = (() => {
    let names: Intl.DisplayNames | null = null;
    try {
        names = new Intl.DisplayNames(['en'], { type: 'region' });
    } catch {
        names = null;
    }
    return (code: string) => (code && code !== 'OTHER' ? names?.of(code) ?? code : code);
})();

function buildRfqEmail(d: RfqData, ref: string, locale: string, ip: string) {
    const dest = d.destination === 'OTHER' ? `${d.destinationOther} (typed)` : countryNameEn(d.destination);
    const country = d.country === 'OTHER' ? `${d.countryOther} (typed)` : countryNameEn(d.country);
    const dial = RFQ_COUNTRIES.find((c) => c.code === d.phoneCountry)?.dial;
    const phone = `${dial ? `+${dial} ` : ''}${d.phone}`;
    const species = d.species === 'other' ? 'Other / several (see notes)' : speciesLabels([d.species]).join(', ');

    const rows: [string, string][] = [
        ['Reference', ref],
        ['Enquiry type', d.topic],
    ];
    if (d.variant === 'full') {
        rows.push(
            ['Species', species],
            ['Grade / size', d.grade || '—'],
            ['Product form', d.productForm || '—'],
            ['Packaging', d.packaging || '—'],
            ['Volume per shipment', `${d.volume} ${d.volumeUnit}`],
            ['Frequency', d.frequency || '—'],
            ['Destination', dest],
            ['Required date', d.requiredDate || '—'],
            ['Preferred Incoterm', d.incoterm || '—'],
            ['Documents requested', d.documents.join(', ') || '—'],
            ['Buyer type', d.buyerType],
        );
    } else {
        if (d.corporateTopic) rows.push(['Corporate topic', d.corporateTopic]);
        if (d.documents.length) rows.push(['Documents requested', d.documents.join(', ')]);
    }
    rows.push(
        ['Company', d.company],
        ['Name', d.name],
        ['Job title', d.jobTitle || '—'],
        ['Email', d.email],
        ['Phone / WhatsApp', phone],
        ['Company country', country],
        ['Notes', d.notes || '—'],
        ['Site language', locale],
        ['Sent from page', d.source || '—'],
        ['UTM', Object.entries(d.utm).map(([k, v]) => `${k}=${v}`).join(' ') || '—'],
    );

    const heading = d.variant === 'full' ? 'New request for quotation' : d.topic === 'documents' ? 'New document request' : 'New corporate enquiry';
    const text =
        rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
        `\n\nSent from the website on ${new Date().toISOString()} (IP ${ip}).\nReply to this email to answer the sender directly.`;
    const html =
        `<h2 style="font-family:sans-serif">${escapeHtml(heading)}</h2>` +
        `<table style="font-family:sans-serif;border-collapse:collapse" cellpadding="6">` +
        rows
            .map(
                ([k, v]) =>
                    `<tr><td style="vertical-align:top;font-weight:bold;border-bottom:1px solid #eee">${escapeHtml(k)}</td>` +
                    `<td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
            )
            .join('') +
        `</table><p style="font-family:sans-serif;color:#666;font-size:12px">Sent from the website form (IP ${escapeHtml(ip)}). Reply to this email to answer the sender directly.</p>`;

    const subject =
        d.variant === 'full'
            ? oneLine(`RFQ ${ref}: ${species}, ${d.volume} ${d.volumeUnit} to ${dest} (${d.company})`)
            : oneLine(`${d.topic === 'documents' ? 'Document request' : 'Corporate enquiry'} ${ref}: ${d.company} (${country})`);
    return { subject, text, html };
}

async function handleRfq(body: Record<string, unknown>, ip: string) {
    const rfq = normalizeRfq(body);
    const fields = validateRfq(rfq);
    if (Object.keys(fields).length > 0) return json({ ok: false, error: 'invalid', fields }, 400);

    const locale = typeof body.locale === 'string' && (locales as readonly string[]).includes(body.locale) ? body.locale : 'unknown';
    const ref = makeRfqReference();
    const { subject, text, html } = buildRfqEmail(rfq, ref, locale, ip);
    const logPayload = JSON.stringify({ ...rfq, ref, locale });

    const apiKey = process.env.RESEND_API_KEY;
    const to = (process.env.CONTACT_TO_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean);
    const from = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || to.length === 0 || !from) {
        // Preview deployments without keys: keep the RFQ in the log, tell the form to offer email/WhatsApp.
        console.error('[contact] email not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL); RFQ NOT emailed:', logPayload);
        return json({ ok: false, error: 'not_configured' }, 503);
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, reply_to: rfq.email, subject, text, html }),
            signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            console.error(`[contact] Resend responded ${res.status}: ${detail.slice(0, 500)}; RFQ NOT emailed:`, logPayload);
            return json({ ok: false, error: 'send_failed' }, 502);
        }
    } catch (err) {
        console.error('[contact] Resend request failed:', err, '; RFQ NOT emailed:', logPayload);
        return json({ ok: false, error: 'send_failed' }, 502);
    }
    return json({ ok: true, ref });
}

export async function POST(request: Request) {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

    // Reject cross-site posts (the form always posts from the same origin)
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (origin && host) {
        try {
            if (new URL(origin).host !== host) return json({ ok: false, error: 'forbidden' }, 403);
        } catch {
            return json({ ok: false, error: 'forbidden' }, 403);
        }
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

    let body: Record<string, unknown>;
    try {
        body = JSON.parse(raw);
        if (!body || typeof body !== 'object') throw new Error('not an object');
    } catch {
        return json({ ok: false, error: 'invalid', fields: {} }, 400);
    }

    // Spam traps: honeypot filled or submitted implausibly fast → pretend success, send nothing
    const honeypot = body[HONEYPOT_FIELD];
    const elapsed = body.elapsedMs;
    if ((typeof honeypot === 'string' && honeypot.trim() !== '') || (typeof elapsed === 'number' && elapsed < MIN_FILL_MS)) {
        console.warn('[contact] spam trap triggered', { ip });
        return json({ ok: true });
    }

    if (rateLimited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

    // Site v2 RFQ / corporate / documents form
    if (body.form === RFQ_FORM_ID) return handleRfq(body, ip);

    const enquiry = normalizeEnquiry(body);
    const fields = validateEnquiry(enquiry);
    if (Object.keys(fields).length > 0) return json({ ok: false, error: 'invalid', fields }, 400);

    const locale = typeof body.locale === 'string' && (locales as readonly string[]).includes(body.locale) ? body.locale : 'unknown';

    const apiKey = process.env.RESEND_API_KEY;
    const to = (process.env.CONTACT_TO_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean);
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || to.length === 0 || !from) {
        // Keep the enquiry in the server log so it can be recovered.
        console.error('[contact] email not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL); enquiry NOT emailed:', JSON.stringify({ ...enquiry, locale }));
        return json({ ok: false, error: 'not_configured' }, 503);
    }

    const { subject, text, html } = buildEmail(enquiry, locale, ip);

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from, to, reply_to: enquiry.email, subject, text, html }),
            signal: AbortSignal.timeout(10_000),
        });

        if (!res.ok) {
            const detail = await res.text().catch(() => '');
            console.error(`[contact] Resend responded ${res.status}: ${detail.slice(0, 500)}; enquiry NOT emailed:`, JSON.stringify({ ...enquiry, locale }));
            return json({ ok: false, error: 'send_failed' }, 502);
        }
    } catch (err) {
        console.error('[contact] Resend request failed:', err, '; enquiry NOT emailed:', JSON.stringify({ ...enquiry, locale }));
        return json({ ok: false, error: 'send_failed' }, 502);
    }

    return json({ ok: true });
}
