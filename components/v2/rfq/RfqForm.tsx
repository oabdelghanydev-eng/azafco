'use client';

/**
 * Site v2 RFQ form (brief §21): the main conversion.
 *
 *   full  (seafood quote): Step 1 supply requirement → Step 2 business details
 *   short (corporate / documents): one step, no species
 *
 * - One state object for both steps, so nothing is lost going Back/Next or
 *   after a server error.
 * - Inline validation (same rules as the API: ./schema.ts), focus moves to the
 *   first invalid field; step change moves focus to the step heading.
 * - Honeypot + minimum fill time (spam); POST /api/contact with form: 'rfq'.
 * - Success → /rfq/thank-you?ref=… (non-sensitive summary in sessionStorage).
 * - Analytics: rfq_start, rfq_step_complete, qualified_rfq_submit /
 *   document_request / generate_lead (no personal data).
 *
 * Option labels (species, countries) are resolved on the server and passed in,
 * so SSR and hydration render identical text.
 */

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import Button from '@/components/v2/Button';
import { MailIcon, WhatsAppIcon } from '@/components/v2/icons';
import {
    BUYER_TYPES,
    CORPORATE_TOPICS,
    DOCUMENTS,
    EMPTY_RFQ,
    FREQUENCIES,
    INCOTERMS,
    PACKAGING,
    PRODUCT_FORMS,
    RFQ_HONEYPOT,
    RFQ_SUMMARY_KEY,
    STEP1_FIELDS,
    STEP2_FIELDS,
    VOLUME_UNITS,
    validateStep1,
    validateStep2,
    variantForTopic,
    type RfqData,
    type RfqErrors,
    type RfqField,
    type RfqSummary,
    type RfqTopic,
} from './schema';
import type { CountryOption } from './countries';
import { Choice, ERROR_TEXT, FieldError, FieldShell, Select, controlClass, describedBy, type Option } from './fields';
import { trackRfq } from './track';

export interface RfqFormProps {
    /** Enquiry type (from ?type=…). corporate/documents → short form. */
    topic: RfqTopic;
    /** Product slug (from ?product=…), only applied if it is a known option */
    prefillSpecies?: string;
    /** ISO alpha-2 (from ?country=…), only applied if it is a known option */
    prefillCountry?: string;
    speciesOptions: Option[];
    countries: CountryOption[];
    /** Unique per page if the form appears more than once */
    idPrefix?: string;
    /** Heading level for the step titles */
    headingAs?: 'h2' | 'h3';
    className?: string;
}

type Status = 'idle' | 'submitting' | 'error';
type ServerError = 'not_configured' | 'send_failed' | 'rate_limited' | 'invalid' | 'network' | 'forbidden' | 'too_large';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export default function RfqForm({
    topic,
    prefillSpecies,
    prefillCountry,
    speciesOptions,
    countries,
    idPrefix = 'rfq',
    headingAs: H = 'h2',
    className,
}: RfqFormProps) {
    const t = useTranslations('rfq_v2.form');
    const router = useRouter();
    const variant = variantForTopic(topic);
    const isShort = variant === 'short';
    const totalSteps = isShort ? 1 : 2;

    const knownSpecies = (s?: string) => (s && speciesOptions.some((o) => o.value === s) ? s : '');
    const knownCountry = (c?: string) => (c && countries.some((o) => o.code === c) ? c : '');

    const [data, setData] = useState<RfqData>(() => ({
        ...EMPTY_RFQ,
        topic,
        variant,
        species: knownSpecies(prefillSpecies),
        destination: knownCountry(prefillCountry),
        documents: topic === 'specifications' ? ['specification_sheet'] : [],
    }));
    const [step, setStep] = useState<1 | 2>(isShort ? 2 : 1);
    const [errors, setErrors] = useState<RfqErrors>({});
    const [status, setStatus] = useState<Status>('idle');
    const [serverError, setServerError] = useState<ServerError | null>(null);
    const [honeypot, setHoneypot] = useState('');

    const mountedAt = useRef<number>(Date.now());
    const started = useRef(false);
    const stepHeading = useRef<HTMLHeadingElement>(null);
    const errorBox = useRef<HTMLDivElement>(null);
    const focusHeading = useRef(false);

    // Keep topic/variant in sync when the parent switches route (contact page selector).
    useEffect(() => {
        setData((d) => ({ ...d, topic, variant: variantForTopic(topic) }));
        setErrors({});
        setServerError(null);
        setStatus('idle');
        setStep(variantForTopic(topic) === 'short' ? 2 : 1);
    }, [topic]);

    // Move focus to the step heading after Next/Back (not on route switches)
    useEffect(() => {
        if (!focusHeading.current) return;
        focusHeading.current = false;
        stepHeading.current?.focus();
        stepHeading.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, [step]);

    const id = (f: string) => `${idPrefix}-${f}`;
    const err = (f: RfqField) => (errors[f] ? t(`errors.${errors[f]}`) : undefined);

    function markStarted() {
        if (started.current) return;
        started.current = true;
        trackRfq('rfq_start', { form_type: topic, prefill_species: data.species || undefined, prefill_country: data.destination || undefined });
    }

    function update<K extends keyof RfqData>(key: K, value: RfqData[K]) {
        markStarted();
        setData((d) => {
            const next = { ...d, [key]: value };
            // Default the phone prefix to the company country
            if (key === 'country' && typeof value === 'string' && value !== 'OTHER' && (!d.phoneCountry || d.phoneCountry === d.country)) {
                next.phoneCountry = value;
            }
            return next;
        });
        if (errors[key as RfqField]) setErrors((e) => ({ ...e, [key]: undefined }));
    }

    const onText = (key: RfqField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        update(key, e.target.value as never);

    function toggleDoc(doc: string) {
        update('documents', data.documents.includes(doc) ? data.documents.filter((d) => d !== doc) : [...data.documents, doc]);
    }

    function focusFirstInvalid(errs: RfqErrors, order: RfqField[]) {
        const first = order.find((f) => errs[f]);
        if (!first) return;
        const el = document.getElementById(id(first === 'documents' ? `documents-${DOCUMENTS[0]}` : first));
        if (el) {
            // Open the optional "trade details" disclosure if the error is inside it
            const details = el.closest('details');
            if (details && !details.open) details.open = true;
            el.focus();
        }
    }

    function goNext() {
        const errs = validateStep1(data);
        setErrors(errs);
        if (Object.keys(errs).length) {
            focusFirstInvalid(errs, STEP1_FIELDS);
            return;
        }
        trackRfq('rfq_step_complete', { step: 1, form_type: topic, species: data.species, destination: data.destination });
        focusHeading.current = true;
        setStep(2);
    }

    function goBack() {
        setErrors({});
        setServerError(null);
        focusHeading.current = true;
        setStep(1);
    }

    function buildSummary(ref?: string): RfqSummary {
        const speciesLabel = speciesOptions.find((o) => o.value === data.species)?.label;
        const dest = data.destination === 'OTHER' ? data.destinationOther : countries.find((c) => c.code === data.destination)?.name;
        return {
            ref,
            variant,
            topic,
            species: isShort ? undefined : speciesLabel,
            volume: isShort ? undefined : `${data.volume} ${t(`units.${data.volumeUnit}`)}`,
            destination: isShort ? undefined : dest,
        };
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === 'submitting') return;
        if (!isShort && step === 1) {
            goNext();
            return;
        }
        const errs = { ...(isShort ? {} : validateStep1(data)), ...validateStep2(data) };
        setErrors(errs);
        if (Object.keys(errs).length) {
            // A step-1 error can only happen if data changed under us; send the user back there.
            if (!isShort && Object.keys(validateStep1(data)).length) {
                focusHeading.current = true;
                setStep(1);
                return;
            }
            focusFirstInvalid(errs, STEP2_FIELDS);
            return;
        }

        setStatus('submitting');
        setServerError(null);

        const utm: Record<string, string> = {};
        try {
            const qs = new URLSearchParams(window.location.search);
            for (const k of UTM_KEYS) {
                const v = qs.get(k);
                if (v) utm[k] = v;
            }
        } catch {
            /* ignore */
        }

        const payload = {
            ...data,
            topic,
            variant,
            utm,
            source: window.location.pathname,
            locale: document.documentElement.lang || undefined,
            [RFQ_HONEYPOT]: honeypot,
            elapsedMs: Date.now() - mountedAt.current,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: ServerError; ref?: string; fields?: RfqErrors };
            if (res.ok && body.ok) {
                const summary = buildSummary(body.ref);
                try {
                    sessionStorage.setItem(RFQ_SUMMARY_KEY, JSON.stringify(summary));
                } catch {
                    /* private mode: summary is optional */
                }
                if (topic === 'documents') trackRfq('document_request', { form_type: topic, documents: data.documents.join(',') });
                else if (topic === 'corporate') trackRfq('generate_lead', { form_type: topic, corporate_topic: data.corporateTopic });
                else
                    trackRfq('qualified_rfq_submit', {
                        form_type: topic,
                        species: data.species,
                        destination: data.destination,
                        volume_unit: data.volumeUnit,
                        buyer_type: data.buyerType,
                    });
                const q = new URLSearchParams();
                if (body.ref) q.set('ref', body.ref);
                q.set('type', topic);
                router.push(`${routes.rfqThankYou}?${q.toString()}`);
                return;
            }
            if (body.error === 'invalid' && body.fields && Object.keys(body.fields).length) {
                setErrors(body.fields);
                setStatus('idle');
                if (!isShort && Object.keys(body.fields).some((f) => STEP1_FIELDS.includes(f as RfqField) && f !== 'documents')) {
                    focusHeading.current = true;
                    setStep(1);
                }
                else focusFirstInvalid(body.fields, STEP2_FIELDS);
                return;
            }
            setServerError(body.error || 'send_failed');
            setStatus('error');
        } catch {
            setServerError('network');
            setStatus('error');
        }
    }

    // Announce + focus server errors
    useEffect(() => {
        if (serverError) errorBox.current?.focus();
    }, [serverError]);

    const errorCount = Object.values(errors).filter(Boolean).length;
    const opt = (list: readonly string[], ns: string): Option[] => list.map((v) => ({ value: v, label: t(`${ns}.${v}`) }));
    const countryOpts: Option[] = useMemo(() => [...countries.map((c) => ({ value: c.code, label: c.name })), { value: 'OTHER', label: t('other_country') }], [countries, t]);
    const dialOpts: Option[] = useMemo(() => [...countries.map((c) => ({ value: c.code, label: `+${c.dial} · ${c.name}` })), { value: 'OTHER', label: t('phone_prefix_other') }], [countries, t]);

    const mailtoHref = useMemo(() => {
        const lines = [
            `${t('topic_line')}: ${t(`topics.${topic}`)}`,
            !isShort && data.species ? `${t('species_label')}: ${speciesOptions.find((o) => o.value === data.species)?.label ?? data.species}` : '',
            !isShort && data.grade ? `${t('grade_label')}: ${data.grade}` : '',
            !isShort && data.volume ? `${t('volume_label')}: ${data.volume} ${t(`units.${data.volumeUnit}`)}` : '',
            !isShort && data.destination ? `${t('destination_label')}: ${data.destination === 'OTHER' ? data.destinationOther : countries.find((c) => c.code === data.destination)?.name ?? data.destination}` : '',
            !isShort && data.requiredDate ? `${t('date_label')}: ${data.requiredDate}` : '',
            data.company ? `${t('company_label')}: ${data.company}` : '',
            data.name ? `${t('name_label')}: ${data.name}` : '',
            data.phone ? `${t('phone_label')}: +${countries.find((c) => c.code === data.phoneCountry)?.dial ?? ''} ${data.phone}` : '',
            data.notes ? `\n${data.notes}` : '',
        ].filter(Boolean);
        return `mailto:${companyConfig.contact.email}?subject=${encodeURIComponent(t('mail_subject'))}&body=${encodeURIComponent(lines.join('\n'))}`;
    }, [data, topic, isShort, speciesOptions, countries, t]);

    const req = { requiredLabel: t('required'), optionalLabel: t('optional') };
    const stepTitle = isShort ? t(`short_title_${topic}`) : step === 1 ? t('step1_title') : t('step2_title');
    const tradeOpen = !!(data.incoterm || data.documents.length || errors.incoterm || errors.documents);

    return (
        <form
            noValidate
            onSubmit={onSubmit}
            aria-labelledby={id('title')}
            className={cn('relative rounded-card border border-line bg-white p-5 text-ink shadow-card sm:p-8', className)}
            data-surface="light"
        >
            {/* Progress */}
            {!isShort ? (
                <div className="mb-6">
                    <ol aria-label={t('steps_label')} className="flex items-center gap-3 text-caption font-semibold">
                        {[1, 2].map((n) => {
                            const current = step === n;
                            const done = step > n;
                            return (
                                <li key={n} className="flex items-center gap-3" aria-current={current ? 'step' : undefined}>
                                    <span
                                        className={cn(
                                            'inline-flex h-8 w-8 items-center justify-center rounded-full border text-caption',
                                            current ? 'border-navy bg-navy text-white' : done ? 'border-navy text-navy' : 'border-line-strong text-ink-muted',
                                        )}
                                        aria-hidden="true"
                                    >
                                        {done ? '✓' : n}
                                    </span>
                                    <span className={current ? 'text-ink' : 'text-ink-muted'}>
                                        <span className="sr-only">{t('step_of', { current: n, total: 2 })}: </span>
                                        {n === 1 ? t('step1_short') : t('step2_short')}
                                        {done ? <span className="sr-only"> ({t('step_done')})</span> : null}
                                    </span>
                                    {n === 1 ? <span aria-hidden="true" className="h-px w-6 bg-line-strong sm:w-10" /> : null}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            ) : null}

            <div className="mb-6">
                {!isShort ? <p className="text-overline uppercase text-gold-ink">{t('step_of', { current: step, total: totalSteps })}</p> : null}
                <H id={id('title')} ref={stepHeading} tabIndex={-1} className="mt-1 font-display text-heading-lg text-navy focus:outline-none">
                    {stepTitle}
                </H>
                <p className="mt-2 text-caption text-ink-muted">{t('required_note')}</p>
            </div>

            {/* Honeypot: visually hidden, skipped by keyboard and screen readers */}
            <div aria-hidden="true" className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap opacity-0 [clip:rect(0,0,0,0)]">
                <label htmlFor={id(RFQ_HONEYPOT)}>{t('honeypot_label')}</label>
                <input id={id(RFQ_HONEYPOT)} name={RFQ_HONEYPOT} type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            {/* ── Step 1: supply requirement ─────────────────────────────── */}
            {!isShort && step === 1 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FieldShell id={id('species')} label={t('species_label')} required error={err('species')} className="sm:col-span-2" {...req}>
                        <Select
                            id={id('species')}
                            name="species"
                            value={data.species}
                            onChange={onText('species')}
                            placeholder={t('species_placeholder')}
                            options={speciesOptions}
                            required
                            invalid={!!errors.species}
                            describedBy={describedBy(id('species'), undefined, err('species'))}
                        />
                    </FieldShell>

                    <FieldShell id={id('grade')} label={t('grade_label')} hint={t('grade_hint')} error={err('grade')} {...req}>
                        <input
                            id={id('grade')}
                            name="grade"
                            type="text"
                            value={data.grade}
                            onChange={onText('grade')}
                            className={controlClass(!!errors.grade)}
                            aria-invalid={!!errors.grade || undefined}
                            aria-describedby={describedBy(id('grade'), true, err('grade'))}
                        />
                    </FieldShell>

                    <FieldShell id={id('productForm')} label={t('form_label')} error={err('productForm')} {...req}>
                        <Select
                            id={id('productForm')}
                            name="productForm"
                            value={data.productForm}
                            onChange={onText('productForm')}
                            placeholder={t('select_placeholder')}
                            options={opt(PRODUCT_FORMS, 'form_options')}
                            invalid={!!errors.productForm}
                            describedBy={describedBy(id('productForm'), undefined, err('productForm'))}
                        />
                    </FieldShell>

                    <FieldShell id={id('packaging')} label={t('packaging_label')} error={err('packaging')} {...req}>
                        <Select
                            id={id('packaging')}
                            name="packaging"
                            value={data.packaging}
                            onChange={onText('packaging')}
                            placeholder={t('select_placeholder')}
                            options={opt(PACKAGING, 'packaging_options')}
                            invalid={!!errors.packaging}
                            describedBy={describedBy(id('packaging'), undefined, err('packaging'))}
                        />
                    </FieldShell>

                    <FieldShell id={id('frequency')} label={t('frequency_label')} error={err('frequency')} {...req}>
                        <Select
                            id={id('frequency')}
                            name="frequency"
                            value={data.frequency}
                            onChange={onText('frequency')}
                            placeholder={t('select_placeholder')}
                            options={opt(FREQUENCIES, 'frequencies')}
                            invalid={!!errors.frequency}
                            describedBy={describedBy(id('frequency'), undefined, err('frequency'))}
                        />
                    </FieldShell>

                    {/* Volume + unit: one fieldset, two controls */}
                    <fieldset className="sm:col-span-2" aria-describedby={describedBy(id('volume'), true, err('volume'))}>
                        <legend className="mb-2 text-body-sm font-semibold text-ink">
                            {t('volume_label')}
                            <span className="ms-1 text-ink-muted" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only"> ({t('required')})</span>
                        </legend>
                        <p id={`${id('volume')}-hint`} className="mb-2 text-caption text-ink-muted">
                            {t('volume_hint')}
                        </p>
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:max-w-md">
                            <div>
                                <label htmlFor={id('volume')} className="sr-only">
                                    {t('volume_amount_label')}
                                </label>
                                <input
                                    id={id('volume')}
                                    name="volume"
                                    type="text"
                                    inputMode="decimal"
                                    dir="ltr"
                                    value={data.volume}
                                    onChange={onText('volume')}
                                    aria-required="true"
                                    aria-invalid={!!errors.volume || undefined}
                                    aria-describedby={describedBy(id('volume'), true, err('volume'))}
                                    className={cn(controlClass(!!errors.volume), 'rtl:text-right')}
                                    placeholder="500"
                                />
                            </div>
                            <div>
                                <label htmlFor={id('volumeUnit')} className="sr-only">
                                    {t('unit_label')}
                                </label>
                                <Select
                                    id={id('volumeUnit')}
                                    name="volumeUnit"
                                    value={data.volumeUnit}
                                    onChange={onText('volumeUnit')}
                                    options={opt(VOLUME_UNITS, 'units')}
                                    invalid={!!errors.volumeUnit}
                                    className="min-w-[8rem]"
                                />
                            </div>
                        </div>
                        <FieldError id={id('volume')} error={err('volume')} />
                    </fieldset>

                    <FieldShell id={id('destination')} label={t('destination_label')} required error={err('destination')} {...req}>
                        <Select
                            id={id('destination')}
                            name="destination"
                            value={data.destination}
                            onChange={onText('destination')}
                            placeholder={t('country_placeholder')}
                            options={countryOpts}
                            required
                            autoComplete="off"
                            invalid={!!errors.destination}
                            describedBy={describedBy(id('destination'), undefined, err('destination'))}
                        />
                    </FieldShell>

                    <FieldShell id={id('requiredDate')} label={t('date_label')} hint={t('date_hint')} error={err('requiredDate')} {...req}>
                        <input
                            id={id('requiredDate')}
                            name="requiredDate"
                            type="date"
                            value={data.requiredDate}
                            onChange={onText('requiredDate')}
                            className={controlClass(!!errors.requiredDate)}
                            aria-invalid={!!errors.requiredDate || undefined}
                            aria-describedby={describedBy(id('requiredDate'), true, err('requiredDate'))}
                        />
                    </FieldShell>

                    {data.destination === 'OTHER' ? (
                        <FieldShell id={id('destinationOther')} label={t('destination_other_label')} required error={err('destinationOther')} className="sm:col-span-2" {...req}>
                            <input
                                id={id('destinationOther')}
                                name="destinationOther"
                                type="text"
                                autoComplete="country-name"
                                value={data.destinationOther}
                                onChange={onText('destinationOther')}
                                aria-required="true"
                                aria-invalid={!!errors.destinationOther || undefined}
                                aria-describedby={describedBy(id('destinationOther'), undefined, err('destinationOther'))}
                                className={controlClass(!!errors.destinationOther)}
                            />
                        </FieldShell>
                    ) : null}

                    {/* Optional trade details: progressive disclosure */}
                    <details className="group rounded-control border border-line bg-surface-offwhite sm:col-span-2" open={tradeOpen || undefined}>
                        <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 text-body-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
                            <span>{t('more_details')}</span>
                            <span aria-hidden="true" className="text-heading-md leading-none transition-transform duration-fast group-open:rotate-45 motion-reduce:transition-none">
                                +
                            </span>
                        </summary>
                        <div className="grid grid-cols-1 gap-5 border-t border-line px-4 pb-5 pt-4 sm:grid-cols-2">
                            <FieldShell id={id('incoterm')} label={t('incoterm_label')} hint={t('incoterm_hint')} error={err('incoterm')} {...req}>
                                <Select
                                    id={id('incoterm')}
                                    name="incoterm"
                                    value={data.incoterm}
                                    onChange={onText('incoterm')}
                                    placeholder={t('select_placeholder')}
                                    options={INCOTERMS.map((v) => ({ value: v, label: v === 'not_sure' ? t('incoterm_not_sure') : v }))}
                                    invalid={!!errors.incoterm}
                                    describedBy={describedBy(id('incoterm'), true, err('incoterm'))}
                                />
                            </FieldShell>
                            {documentsField()}
                        </div>
                    </details>
                </div>
            ) : null}

            {/* ── Step 2 / short form: business details ──────────────────── */}
            {step === 2 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {isShort && topic === 'corporate' ? (
                        <FieldShell id={id('corporateTopic')} label={t('corporate_topic_label')} required error={err('corporateTopic')} className="sm:col-span-2" {...req}>
                            <Select
                                id={id('corporateTopic')}
                                name="corporateTopic"
                                value={data.corporateTopic}
                                onChange={onText('corporateTopic')}
                                placeholder={t('select_placeholder')}
                                options={opt(CORPORATE_TOPICS, 'corporate_topics')}
                                required
                                invalid={!!errors.corporateTopic}
                                describedBy={describedBy(id('corporateTopic'), undefined, err('corporateTopic'))}
                            />
                        </FieldShell>
                    ) : null}
                    {isShort && topic === 'documents' ? (
                        <div className="sm:col-span-2">
                            {documentsField()}
                        </div>
                    ) : null}

                    <FieldShell id={id('company')} label={t('company_label')} required error={err('company')} {...req}>
                        <input
                            id={id('company')}
                            name="company"
                            type="text"
                            autoComplete="organization"
                            value={data.company}
                            onChange={onText('company')}
                            aria-required="true"
                            aria-invalid={!!errors.company || undefined}
                            aria-describedby={describedBy(id('company'), undefined, err('company'))}
                            className={controlClass(!!errors.company)}
                        />
                    </FieldShell>

                    <FieldShell id={id('name')} label={t('name_label')} required error={err('name')} {...req}>
                        <input
                            id={id('name')}
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={data.name}
                            onChange={onText('name')}
                            aria-required="true"
                            aria-invalid={!!errors.name || undefined}
                            aria-describedby={describedBy(id('name'), undefined, err('name'))}
                            className={controlClass(!!errors.name)}
                        />
                    </FieldShell>

                    <FieldShell id={id('jobTitle')} label={t('job_label')} error={err('jobTitle')} {...req}>
                        <input
                            id={id('jobTitle')}
                            name="jobTitle"
                            type="text"
                            autoComplete="organization-title"
                            value={data.jobTitle}
                            onChange={onText('jobTitle')}
                            aria-invalid={!!errors.jobTitle || undefined}
                            aria-describedby={describedBy(id('jobTitle'), undefined, err('jobTitle'))}
                            className={controlClass(!!errors.jobTitle)}
                        />
                    </FieldShell>

                    <FieldShell id={id('email')} label={t('email_label')} hint={t('email_hint')} required error={err('email')} {...req}>
                        <input
                            id={id('email')}
                            name="email"
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            spellCheck={false}
                            value={data.email}
                            onChange={onText('email')}
                            aria-required="true"
                            aria-invalid={!!errors.email || undefined}
                            aria-describedby={describedBy(id('email'), true, err('email'))}
                            className={cn(controlClass(!!errors.email), 'rtl:text-right')}
                        />
                    </FieldShell>

                    <FieldShell id={id('country')} label={t('country_label')} required error={err('country')} {...req}>
                        <Select
                            id={id('country')}
                            name="country"
                            value={data.country}
                            onChange={onText('country')}
                            placeholder={t('country_placeholder')}
                            options={countryOpts}
                            required
                            autoComplete="country"
                            invalid={!!errors.country}
                            describedBy={describedBy(id('country'), undefined, err('country'))}
                        />
                    </FieldShell>

                    {data.country === 'OTHER' ? (
                        <FieldShell id={id('countryOther')} label={t('country_other_label')} required error={err('countryOther')} {...req}>
                            <input
                                id={id('countryOther')}
                                name="countryOther"
                                type="text"
                                autoComplete="country-name"
                                value={data.countryOther}
                                onChange={onText('countryOther')}
                                aria-required="true"
                                aria-invalid={!!errors.countryOther || undefined}
                                aria-describedby={describedBy(id('countryOther'), undefined, err('countryOther'))}
                                className={controlClass(!!errors.countryOther)}
                            />
                        </FieldShell>
                    ) : null}

                    {/* Phone: prefix + number. Kept LTR in both locales (international number order). */}
                    <fieldset className="sm:col-span-2">
                        <legend className="mb-2 text-body-sm font-semibold text-ink">
                            {t('phone_label')}
                            <span className="ms-1 text-ink-muted" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only"> ({t('required')})</span>
                        </legend>
                        <p id={`${id('phone')}-hint`} className="mb-2 text-caption text-ink-muted">
                            {t('phone_hint')}
                        </p>
                        <div dir="ltr" className="grid grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                            <div>
                                <label htmlFor={id('phoneCountry')} className="sr-only">
                                    {t('phone_prefix_label')}
                                </label>
                                <Select
                                    id={id('phoneCountry')}
                                    name="phoneCountry"
                                    value={data.phoneCountry}
                                    onChange={onText('phoneCountry')}
                                    placeholder={t('phone_prefix_placeholder')}
                                    options={dialOpts}
                                    autoComplete="tel-country-code"
                                    invalid={!!errors.phoneCountry}
                                />
                            </div>
                            <div>
                                <label htmlFor={id('phone')} className="sr-only">
                                    {t('phone_number_label')}
                                </label>
                                <input
                                    id={id('phone')}
                                    name="phone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete={data.phoneCountry && data.phoneCountry !== 'OTHER' ? 'tel-national' : 'tel'}
                                    value={data.phone}
                                    onChange={onText('phone')}
                                    aria-required="true"
                                    aria-invalid={!!errors.phone || undefined}
                                    aria-describedby={describedBy(id('phone'), true, err('phone'))}
                                    className={controlClass(!!errors.phone)}
                                />
                            </div>
                        </div>
                        <FieldError id={id('phone')} error={err('phone')} />
                    </fieldset>

                    {!isShort ? (
                        <FieldShell id={id('buyerType')} label={t('buyer_type_label')} required error={err('buyerType')} {...req}>
                            <Select
                                id={id('buyerType')}
                                name="buyerType"
                                value={data.buyerType}
                                onChange={onText('buyerType')}
                                placeholder={t('select_placeholder')}
                                options={opt(BUYER_TYPES, 'buyer_types')}
                                required
                                invalid={!!errors.buyerType}
                                describedBy={describedBy(id('buyerType'), undefined, err('buyerType'))}
                            />
                        </FieldShell>
                    ) : null}

                    <FieldShell
                        id={id('notes')}
                        label={isShort ? t('notes_label_short') : t('notes_label')}
                        hint={t(isShort ? `notes_hint_${topic}` : 'notes_hint')}
                        required={isShort}
                        error={err('notes')}
                        className="sm:col-span-2"
                        {...req}
                    >
                        <textarea
                            id={id('notes')}
                            name="notes"
                            rows={4}
                            value={data.notes}
                            onChange={onText('notes')}
                            aria-required={isShort || undefined}
                            aria-invalid={!!errors.notes || undefined}
                            aria-describedby={describedBy(id('notes'), true, err('notes'))}
                            className={cn(controlClass(!!errors.notes), 'min-h-[120px]')}
                        />
                    </FieldShell>

                    <div className="sm:col-span-2">
                        <p className="mb-1 text-caption text-ink-muted">{t('privacy_note')}</p>
                        <Choice
                            id={id('consent')}
                            name="consent"
                            type="checkbox"
                            checked={data.consent}
                            onChange={(e) => update('consent', e.target.checked)}
                            invalid={!!errors.consent}
                            required
                            describedBy={describedBy(id('consent'), undefined, err('consent'))}
                            label={t.rich('consent_label', {
                                link: (chunks) => (
                                    <Link href={routes.privacy} className="font-semibold text-navy underline underline-offset-4" target="_blank" rel="noopener">
                                        {chunks}
                                        <span className="sr-only"> {t('opens_new_tab')}</span>
                                    </Link>
                                ),
                            })}
                        />
                        <FieldError id={id('consent')} error={err('consent')} />
                    </div>
                </div>
            ) : null}

            {/* Error summary (client validation) */}
            {errorCount > 0 && status !== 'error' ? (
                <p className={cn('mt-6 text-body-sm font-semibold', ERROR_TEXT)} role="status">
                    {t('error_summary', { count: errorCount })}
                </p>
            ) : null}

            {/* Server / network error: data stays, alternatives offered */}
            {status === 'error' && serverError ? (
                <div ref={errorBox} tabIndex={-1} role="alert" className="mt-6 rounded-control border-2 border-[#B42318] bg-[#FEF3F2] p-4 text-body-sm text-ink focus:outline-none">
                    <p className="font-semibold">{t('server.title')}</p>
                    <p className="mt-1">{t(`server.${serverError === 'network' || serverError === 'rate_limited' ? serverError : 'unavailable'}`)}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button type="submit" variant="secondary" size="sm">
                            {t('server.retry')}
                        </Button>
                        <Button href={mailtoHref} external variant="outline" size="sm" icon={<MailIcon size={18} />} dataAttrs={{ 'data-cta': 'rfq_fallback_email' }}>
                            {t('server.email_instead')}
                        </Button>
                        <Button href={companyConfig.contact.social.whatsapp} external variant="outline" size="sm" icon={<WhatsAppIcon size={18} />} dataAttrs={{ 'data-cta': 'rfq_fallback_whatsapp' }}>
                            {t('server.whatsapp_instead')}
                        </Button>
                    </div>
                </div>
            ) : null}

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {!isShort && step === 2 ? (
                    <Button variant="ghost" onClick={goBack} className="sm:-ms-5">
                        <span aria-hidden="true" className="inline-block rtl:rotate-180">
                            ←
                        </span>{' '}
                        {t('back')}
                    </Button>
                ) : (
                    <span className="hidden sm:block" />
                )}
                {!isShort && step === 1 ? (
                    <Button type="submit" size="lg" arrow fullWidth className="sm:w-auto" dataAttrs={{ 'data-cta': 'rfq_next' }}>
                        {t('next')}
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        size="lg"
                        arrow
                        fullWidth
                        className="sm:w-auto"
                        loading={status === 'submitting'}
                        loadingLabel={t('submitting')}
                        dataAttrs={{ 'data-cta': isShort ? `rfq_submit_${topic}` : 'rfq_submit' }}
                    >
                        {isShort ? t('submit_short') : t('submit')}
                    </Button>
                )}
            </div>
            <p className="sr-only" aria-live="polite">
                {status === 'submitting' ? t('submitting') : ''}
            </p>
        </form>
    );

    function documentsField() {
        return (
            <fieldset aria-describedby={describedBy(id('documents'), undefined, err('documents'))}>
                <legend className="mb-1 text-body-sm font-semibold text-ink">
                    {t('documents_label')}
                    <span className="ms-2 text-caption font-normal text-ink-subtle">({t('optional')})</span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4">
                    {DOCUMENTS.map((doc) => (
                        <Choice
                            key={doc}
                            id={id(`documents-${doc}`)}
                            name="documents"
                            type="checkbox"
                            value={doc}
                            checked={data.documents.includes(doc)}
                            onChange={() => toggleDoc(doc)}
                            invalid={!!errors.documents}
                            label={t(`documents.${doc}`)}
                        />
                    ))}
                </div>
                <FieldError id={id('documents')} error={err('documents')} />
            </fieldset>
        );
    }
}
