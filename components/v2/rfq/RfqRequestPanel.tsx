/**
 * "Send your request" panel for /rfq (server component, no form).
 *
 * Owner decision (7 Nov 2026): no web form anywhere. A request must come from
 * the buyer's own company email or WhatsApp number, so the source is checkable.
 * This panel prepares the message from the page the buyer came from
 * (?product, ?grade, ?form, ?country, ?type) and offers:
 *   1. Email the export team (details and documents): mailto: with subject + labelled body
 *   2. WhatsApp, direct to management (fast deals): wa.me with a shorter text
 *   3. Phone (tel:) + the address and subject as plain, copyable text
 * Clicks are tracked by RfqTracker (rfq_email_click / rfq_whatsapp_click / rfq_phone_click).
 */
import { getLocale, getTranslations } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { cn, focusRing, typography } from '@/components/ui/tokens';
import { phoneDisplay } from '@/components/ui/format';
import { isShortTopic, prefillLabels, type RfqTopic } from './options';
import { mailtoHref, whatsappHref, type RfqLine, type RfqMessageInput } from './message';
import RfqTracker from './RfqTracker';

export interface RfqRequestPanelProps {
    topic: RfqTopic;
    /** Product slug (?product=); ignored if unknown */
    product?: string;
    /** ISO alpha-2 (?country=) */
    country?: string;
    /** Product form code (?form=), lib/v2/specs FORM_KINDS */
    form?: string;
    /** Free-text size grade (?grade=) */
    grade?: string;
    /** Unique per page if the panel appears more than once */
    idPrefix?: string;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export default async function RfqRequestPanel({ topic, product, country, form, grade, idPrefix = 'rfq', headingAs: H = 'h2', className }: RfqRequestPanelProps) {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'rfq_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2.cta' });
    const p = await prefillLabels(locale, { product, country, form, grade });
    const c = companyConfig.contact;
    const Sub = H === 'h2' ? 'h3' : 'h4';
    const L = (k: string) => t(`mail.labels.${k}`);

    // ── Message content ────────────────────────────────────────────────────
    const identity: RfqLine[] = [
        { label: L('company') },
        { label: L('name') },
        { label: L('job') },
        { label: L('website') },
        { label: L('phone') },
    ];
    let msg: RfqMessageInput;
    if (topic === 'corporate') {
        msg = {
            subject: t('mail.subject_corporate'),
            greeting: t('mail.greeting'),
            intro: t('mail.intro_corporate'),
            lines: [{ label: L('topic') }, ...identity, { label: L('message') }],
            waIntro: t('mail.wa_intro_corporate'),
            waLines: [{ label: L('topic') }, { label: L('company') }, { label: L('name') }],
        };
    } else if (topic === 'documents') {
        msg = {
            subject: p.species ? t('mail.subject_documents_for', { item: p.species }) : t('mail.subject_documents'),
            greeting: t('mail.greeting'),
            intro: t('mail.intro_documents'),
            lines: [{ label: L('documents') }, { label: L('product'), value: p.species }, { label: L('market'), value: p.country }, ...identity],
            waIntro: t('mail.wa_intro_documents'),
            waLines: [
                { label: L('documents') },
                ...(p.species ? [{ label: L('product'), value: p.species }] : []),
                ...(p.country ? [{ label: L('market'), value: p.country }] : []),
                { label: L('company') },
                { label: L('name') },
            ],
        };
    } else {
        const item = p.species ?? p.country;
        const base = topic === 'specifications' ? 'specs' : 'quote';
        msg = {
            subject: item ? t(`mail.subject_${base}_for`, { item }) : t(`mail.subject_${base}`),
            greeting: t('mail.greeting'),
            intro: t(`mail.intro_${base}`),
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
            waIntro: t(`mail.wa_intro_${base}`),
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

    const mailto = mailtoHref(c.email, msg);
    const wa = whatsappHref(c.whatsappNumber, msg);
    const track = (event: string): Record<`data-${string}`, string> => ({
        'data-rfq-track': event,
        'data-rfq-type': topic,
        ...(p.speciesSlug ? { 'data-rfq-species': p.speciesSlug } : {}),
        ...(p.countryCode ? { 'data-rfq-destination': p.countryCode } : {}),
    });

    // Read-only summary of what is already filled in
    const summary = (
        isShortTopic(topic)
            ? [
                  { label: L('product'), value: p.species },
                  { label: L('market'), value: p.country },
              ]
            : [
                  { label: L('species'), value: p.species },
                  { label: L('grade'), value: p.grade },
                  { label: L('form'), value: p.form },
                  { label: L('destination'), value: p.country },
              ]
    ).filter((r): r is { label: string; value: string } => Boolean(r.value));

    const titleKey = topic === 'corporate' ? 'title_corporate' : topic === 'documents' ? 'title_documents' : 'title';
    const phone = phoneDisplay(c.whatsappNumber);

    return (
        <section aria-labelledby={`${idPrefix}-send-title`} className={cardClass({ accent: true, className: cn('p-5 text-ink md:p-8 lg:p-10', className) })}>
            <RfqTracker />
            <H id={`${idPrefix}-send-title`} className={cn('m-0 text-ink', typography.h2Sm)}>
                {t(`request.${titleKey}`)}
            </H>
            <p className="mb-0 mt-3 max-w-[640px] text-ink-muted">{t('request.intro')}</p>

            {summary.length ? (
                <div className="mt-6 rounded-card bg-surface-offwhite p-5">
                    <Sub className={cn('m-0 text-ink', typography.h4)}>{t('request.summary_title')}</Sub>
                    <dl className="m-0 mt-3 grid gap-4 sm:grid-cols-2">
                        {summary.map((r) => (
                            <div key={r.label} className="min-w-0">
                                <dt className={cn('text-ink-muted', typography.small)}>{r.label}</dt>
                                <dd className="m-0 mt-1 font-semibold text-ink">
                                    <bdi>{r.value}</bdi>
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className={cn('mb-0 mt-3 text-ink-muted', typography.small)}>{t('request.summary_note')}</p>
                </div>
            ) : null}

            {/* Two channels, two roles (as in the G footer): email = export team, WhatsApp = management.
                Intrinsic layout (flex-wrap, basis = label width): side by side only when both labels fit on one line,
                otherwise stacked full width. The role notes (w-0 min-w-full) do not widen their column. */}
            <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex min-w-0 flex-auto flex-col">
                    <Button href={mailto} external icon={<MailIcon size={20} />} fullWidth dataAttrs={track('rfq_email_click')}>
                        {t('request.email_cta')}
                    </Button>
                    <p className={cn('mb-0 mt-2 w-0 min-w-full text-center text-ink-muted', typography.small)}>{t('request.email_role')}</p>
                </div>
                <div className="flex min-w-0 flex-auto flex-col">
                    <Button
                        href={wa}
                        external
                        newTabLabel={tv('opens_new_tab')}
                        variant="outline"
                        icon={<WhatsAppIcon size={20} />}
                        fullWidth
                        dataAttrs={track('rfq_whatsapp_click')}
                    >
                        {t('request.whatsapp_cta')}
                    </Button>
                    <p className={cn('mb-0 mt-2 w-0 min-w-full text-center text-ink-muted', typography.small)}>{t('request.whatsapp_role')}</p>
                </div>
            </div>
            <p className={cn('mb-0 mt-5 text-ink-muted', typography.small)}>{t('request.attach_note')}</p>

            {/* Never a dead end: plain, copyable address + subject + phone if the mail app does not open */}
            <div className="mt-8 border-0 border-t border-solid border-line pt-6">
                <Sub className={cn('m-0 text-ink', typography.h3)}>{t('request.fallback_title')}</Sub>
                <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>{t('request.fallback_text')}</p>
                <dl className="m-0 mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{t('request.email_label')}</dt>
                        <dd className="m-0 mt-1">
                            <bdi dir="ltr" className="select-all break-all font-semibold text-navy">
                                {c.email}
                            </bdi>
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{t('request.subject_label')}</dt>
                        <dd className="m-0 mt-1">
                            <bdi className="select-all font-semibold text-ink">{msg.subject}</bdi>
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{t('request.phone_label')}</dt>
                        <dd className="m-0">
                            <a
                                href={`tel:${c.phone}`}
                                className={cn('inline-flex min-h-tap items-center gap-2 font-semibold text-navy underline-offset-4 hover:underline', focusRing)}
                                {...track('rfq_phone_click')}
                            >
                                <PhoneIcon size={20} />
                                <span className="sr-only">{tv('call')}: </span>
                                <bdi dir="ltr">{phone}</bdi>
                            </a>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
