'use client';

/**
 * Markup of the "Send your request" panel (no form). Client component so the
 * /requirements page can build the message from the query in the browser
 * (RfqPanelFromQuery) and stay statically rendered. All copy arrives
 * pre-translated from the server wrapper (RfqRequestPanel); the message logic is
 * the pure buildRfqMessage (message.ts), the labels the pure labelPrefill (params.ts).
 */
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { cn, focusRing, typography } from '@/components/ui/tokens';
import { buildRfqMessage, mailtoHref, summaryRows, whatsappHrefFor, type RfqMailCopy } from './compose';
import { labelPrefill, type PrefillNames, type RfqTopic } from './params';
import RfqTracker from './RfqTracker';

export interface RfqPanelCopy {
    /** rfq_v2.request.* */
    request: Record<string, string>;
    mail: RfqMailCopy;
    /** v2.cta.opens_new_tab */
    newTab: string;
    /** v2.cta.call */
    call: string;
}

export interface RfqPanelContact {
    email: string;
    whatsappNumber: string;
    phone: string;
    /** Display form of the management number */
    phoneDisplay: string;
}

export interface RfqRequestPanelViewProps {
    locale: string;
    copy: RfqPanelCopy;
    names: PrefillNames;
    contact: RfqPanelContact;
    topic: RfqTopic;
    product?: string;
    country?: string;
    form?: string;
    grade?: string;
    idPrefix?: string;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export default function RfqRequestPanelView({
    locale,
    copy,
    names,
    contact: c,
    topic,
    product,
    country,
    form,
    grade,
    idPrefix = 'rfq',
    headingAs: H = 'h2',
    className,
}: RfqRequestPanelViewProps) {
    const Sub = H === 'h2' ? 'h3' : 'h4';
    const r = (k: string) => copy.request[k] ?? '';
    const p = labelPrefill(locale, { product, country, form, grade }, names);

    const msg = buildRfqMessage(topic, p, copy.mail);
    const mailto = mailtoHref(c.email, msg);
    const wa = whatsappHrefFor(c.whatsappNumber, msg);
    const track = (event: string): Record<`data-${string}`, string> => ({
        'data-rfq-track': event,
        'data-rfq-type': topic,
        ...(p.speciesSlug ? { 'data-rfq-species': p.speciesSlug } : {}),
        ...(p.countryCode ? { 'data-rfq-destination': p.countryCode } : {}),
    });
    const summary = summaryRows(topic, p, copy.mail);
    const titleKey = topic === 'corporate' ? 'title_corporate' : topic === 'documents' ? 'title_documents' : 'title';

    return (
        <section aria-labelledby={`${idPrefix}-send-title`} className={cardClass({ accent: true, className: cn('p-5 text-ink md:p-8 lg:p-10', className) })}>
            <RfqTracker />
            <H id={`${idPrefix}-send-title`} className={cn('m-0 text-ink', typography.h2Sm)}>
                {r(titleKey)}
            </H>
            <p className="mb-0 mt-3 max-w-[640px] text-ink-muted">{r('intro')}</p>

            {summary.length ? (
                <div className="mt-6 rounded-card bg-surface-offwhite p-5">
                    <Sub className={cn('m-0 text-ink', typography.h4)}>{r('summary_title')}</Sub>
                    <dl className="m-0 mt-3 grid gap-4 sm:grid-cols-2">
                        {summary.map((row) => (
                            <div key={row.label} className="min-w-0">
                                <dt className={cn('text-ink-muted', typography.small)}>{row.label}</dt>
                                <dd className="m-0 mt-1 font-semibold text-ink">
                                    <bdi>{row.value}</bdi>
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className={cn('mb-0 mt-3 text-ink-muted', typography.small)}>{r('summary_note')}</p>
                </div>
            ) : null}

            {/* Two channels, two roles (as in the G footer): email = export team, WhatsApp = management.
                Intrinsic layout (flex-wrap, basis = label width): side by side only when both labels fit on one line,
                otherwise stacked full width. The role notes (w-0 min-w-full) do not widen their column. */}
            <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex min-w-0 flex-auto flex-col">
                    <Button href={mailto} external icon={<MailIcon size={20} />} fullWidth dataAttrs={track('rfq_email_click')}>
                        {r('email_cta')}
                    </Button>
                    <p className={cn('mb-0 mt-2 w-0 min-w-full text-center text-ink-muted', typography.small)}>{r('email_role')}</p>
                </div>
                <div className="flex min-w-0 flex-auto flex-col">
                    <Button
                        href={wa}
                        external
                        newTabLabel={copy.newTab}
                        variant="outline"
                        icon={<WhatsAppIcon size={20} />}
                        fullWidth
                        dataAttrs={track('rfq_whatsapp_click')}
                    >
                        {r('whatsapp_cta')}
                    </Button>
                    <p className={cn('mb-0 mt-2 w-0 min-w-full text-center text-ink-muted', typography.small)}>{r('whatsapp_role')}</p>
                </div>
            </div>
            <p className={cn('mb-0 mt-5 text-ink-muted', typography.small)}>{r('attach_note')}</p>

            {/* Never a dead end: plain, copyable address + subject + phone if the mail app does not open */}
            <div className="mt-8 border-0 border-t border-solid border-line pt-6">
                <Sub className={cn('m-0 text-ink', typography.h3)}>{r('fallback_title')}</Sub>
                <p className={cn('mb-0 mt-1 text-ink-muted', typography.small)}>{r('fallback_text')}</p>
                <dl className="m-0 mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{r('email_label')}</dt>
                        <dd className="m-0 mt-1">
                            <bdi dir="ltr" className="select-all break-all font-semibold text-navy">
                                {c.email}
                            </bdi>
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{r('subject_label')}</dt>
                        <dd className="m-0 mt-1">
                            <bdi className="select-all font-semibold text-ink">{msg.subject}</bdi>
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className={cn('text-ink-muted', typography.small)}>{r('phone_label')}</dt>
                        <dd className="m-0">
                            <a
                                href={`tel:${c.phone}`}
                                className={cn('inline-flex min-h-tap items-center gap-2 font-semibold text-navy underline-offset-4 hover:underline', focusRing)}
                                {...track('rfq_phone_click')}
                            >
                                <PhoneIcon size={20} />
                                <span className="sr-only">{copy.call}: </span>
                                <bdi dir="ltr">{c.phoneDisplay}</bdi>
                            </a>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}
