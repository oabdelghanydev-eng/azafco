'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FaCheckCircle, FaEnvelope, FaExclamationTriangle, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import { products } from '@/data/products';
import { companyInfo } from '@/data/company';
import {
    EMPTY_ENQUIRY,
    HONEYPOT_FIELD,
    LIMITS,
    VOLUME_OPTIONS,
    validateEnquiry,
    normalizeEnquiry,
    type FieldErrors,
    type FieldName,
    type PartnershipEnquiry,
} from '@/lib/partnershipForm';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type ServerError = 'not_configured' | 'send_failed' | 'rate_limited' | 'network' | 'unknown';

const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

export default function PartnershipForm() {
    const t = useTranslations('contact_page.partnership_form');
    const tRoot = useTranslations();
    const locale = useLocale();

    const [values, setValues] = useState<PartnershipEnquiry>(EMPTY_ENQUIRY);
    const [honeypot, setHoneypot] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [status, setStatus] = useState<Status>('idle');
    const [serverError, setServerError] = useState<ServerError | null>(null);
    const startedAt = useRef<number>(0);
    const statusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startedAt.current = Date.now();
    }, []);

    useEffect(() => {
        if (status === 'success' || status === 'error') statusRef.current?.focus();
    }, [status]);

    const set = <K extends FieldName>(field: K, value: PartnershipEnquiry[K]) => {
        setValues(v => ({ ...v, [field]: value }));
        if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
    };

    const toggleSpecies = (slug: string) => {
        set('species', values.species.includes(slug) ? values.species.filter(s => s !== slug) : [...values.species, slug]);
    };

    const errorText = (field: FieldName) => {
        const code = errors[field];
        if (!code) return null;
        const max = (LIMITS as Record<string, number>)[field];
        return t(`errors.${code}`, { max: max ?? 0 });
    };

    const focusFirstError = (errs: FieldErrors) => {
        const first = (['company', 'name', 'email', 'phone', 'country', 'species', 'volume', 'message'] as FieldName[]).find(f => errs[f]);
        if (first) document.getElementById(`pf-${first}`)?.focus();
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === 'submitting') return;

        const enquiry = normalizeEnquiry(values);
        const clientErrors = validateEnquiry(enquiry);
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            focusFirstError(clientErrors);
            return;
        }

        setStatus('submitting');
        setServerError(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...enquiry,
                    locale,
                    [HONEYPOT_FIELD]: honeypot,
                    elapsedMs: Date.now() - startedAt.current,
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors };

            if (res.ok && data.ok) {
                setStatus('success');
                setValues(EMPTY_ENQUIRY);
                return;
            }
            if (data.error === 'invalid' && data.fields && Object.keys(data.fields).length > 0) {
                setErrors(data.fields);
                setStatus('idle');
                focusFirstError(data.fields);
                return;
            }
            const known: ServerError[] = ['not_configured', 'send_failed', 'rate_limited'];
            setServerError(known.includes(data.error as ServerError) ? (data.error as ServerError) : 'unknown');
            setStatus('error');
        } catch {
            setServerError('network');
            setStatus('error');
        }
    };

    const fieldProps = (field: FieldName) => ({
        id: `pf-${field}`,
        name: field,
        'aria-invalid': errors[field] ? true : undefined,
        'aria-describedby': errors[field] ? `pf-${field}-error` : undefined,
    });

    const borderFor = (field: FieldName) => (errors[field] ? 'border-red-400' : 'border-gray-200');

    const fieldError = (field: FieldName) =>
        errors[field] ? (
            <p id={`pf-${field}-error`} className="mt-1.5 text-sm text-red-600">
                {errorText(field)}
            </p>
        ) : null;

    const label = (field: FieldName, required = false) => (
        <label htmlFor={`pf-${field}`} className="mb-1.5 block text-sm font-semibold text-gray-700">
            {t(`labels.${field}`)}
            {required && (
                <span className="ms-1 text-red-500" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    );

    const fallbackLinks = (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
                href={companyInfo.contact.email.link}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
                <FaEnvelope aria-hidden="true" />
                <span dir="ltr">{companyInfo.contact.email.display}</span>
            </a>
            <a
                href={companyInfo.contact.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-green-700"
            >
                <FaWhatsapp aria-hidden="true" />
                {t('fallback_whatsapp')}
            </a>
        </div>
    );

    if (status === 'success') {
        return (
            <div
                ref={statusRef}
                tabIndex={-1}
                role="status"
                className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center focus:outline-none md:p-12"
            >
                <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-500" aria-hidden="true" />
                <h3 className="mb-2 text-2xl font-bold text-gray-800">{t('success_title')}</h3>
                <p className="mx-auto max-w-xl text-gray-600">{t('success_body')}</p>
                <button
                    type="button"
                    onClick={() => {
                        setStatus('idle');
                        startedAt.current = Date.now();
                    }}
                    className="mt-6 font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800"
                >
                    {t('send_another')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:p-10">
            <p className="mb-6 text-sm text-gray-500">{t('required_hint')}</p>

            {status === 'error' && serverError && (
                <div
                    ref={statusRef}
                    tabIndex={-1}
                    role="alert"
                    className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 focus:outline-none"
                >
                    <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="mt-1 flex-shrink-0 text-amber-500" aria-hidden="true" />
                        <div className="flex-1">
                            <p className="font-bold text-gray-800">{t('error_title')}</p>
                            <p className="mt-1 text-gray-700">
                                {serverError === 'rate_limited' ? t('error_rate_limited') : t('error_body')}
                            </p>
                            {fallbackLinks}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    {label('company', true)}
                    <input
                        {...fieldProps('company')}
                        type="text"
                        autoComplete="organization"
                        maxLength={LIMITS.company}
                        value={values.company}
                        onChange={e => set('company', e.target.value)}
                        className={`${inputBase} ${borderFor('company')}`}
                    />
                    {fieldError('company')}
                </div>

                <div>
                    {label('name', true)}
                    <input
                        {...fieldProps('name')}
                        type="text"
                        autoComplete="name"
                        maxLength={LIMITS.name}
                        value={values.name}
                        onChange={e => set('name', e.target.value)}
                        className={`${inputBase} ${borderFor('name')}`}
                    />
                    {fieldError('name')}
                </div>

                <div>
                    {label('email', true)}
                    <input
                        {...fieldProps('email')}
                        type="email"
                        dir="ltr"
                        inputMode="email"
                        autoComplete="email"
                        maxLength={LIMITS.email}
                        value={values.email}
                        onChange={e => set('email', e.target.value)}
                        className={`${inputBase} ${borderFor('email')} text-start`}
                    />
                    {fieldError('email')}
                </div>

                <div>
                    {label('phone', true)}
                    <input
                        {...fieldProps('phone')}
                        type="tel"
                        dir="ltr"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={LIMITS.phone}
                        placeholder="+44 20 7946 0000"
                        value={values.phone}
                        onChange={e => set('phone', e.target.value)}
                        className={`${inputBase} ${borderFor('phone')} text-start`}
                    />
                    {errors.phone ? fieldError('phone') : <p className="mt-1.5 text-xs text-gray-500">{t('phone_hint')}</p>}
                </div>

                <div>
                    {label('country', true)}
                    <input
                        {...fieldProps('country')}
                        type="text"
                        autoComplete="country-name"
                        maxLength={LIMITS.country}
                        value={values.country}
                        onChange={e => set('country', e.target.value)}
                        className={`${inputBase} ${borderFor('country')}`}
                    />
                    {fieldError('country')}
                </div>

                <div>
                    {label('volume')}
                    <select
                        {...fieldProps('volume')}
                        value={values.volume}
                        onChange={e => set('volume', e.target.value as PartnershipEnquiry['volume'])}
                        className={`${inputBase} ${borderFor('volume')}`}
                    >
                        <option value="">{t('volume_placeholder')}</option>
                        {VOLUME_OPTIONS.map(option => (
                            <option key={option} value={option}>
                                {t(`volume_options.${option}`)}
                            </option>
                        ))}
                    </select>
                    {fieldError('volume')}
                </div>

                <fieldset
                    className="md:col-span-2"
                    aria-invalid={errors.species ? true : undefined}
                    aria-describedby={errors.species ? 'pf-species-error' : undefined}
                >
                    <legend className="mb-1.5 block text-sm font-semibold text-gray-700">{t('labels.species')}</legend>
                    <p className="mb-3 text-xs text-gray-500">{t('species_hint')}</p>
                    <div id="pf-species" tabIndex={-1} className="flex flex-wrap gap-2 focus:outline-none">
                        {products.map(product => {
                            const checked = values.species.includes(product.slug);
                            return (
                                <label
                                    key={product.slug}
                                    className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-primary-500 ${
                                        checked
                                            ? 'border-primary-600 bg-primary-600 text-white'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        name="species"
                                        value={product.slug}
                                        checked={checked}
                                        onChange={() => toggleSpecies(product.slug)}
                                        className="sr-only"
                                    />
                                    {tRoot(`data.products.${product.translationKey}.name`)}
                                </label>
                            );
                        })}
                    </div>
                    {fieldError('species')}
                </fieldset>

                <div className="md:col-span-2">
                    {label('message')}
                    <textarea
                        {...fieldProps('message')}
                        rows={5}
                        maxLength={LIMITS.message}
                        placeholder={t('message_placeholder')}
                        value={values.message}
                        onChange={e => set('message', e.target.value)}
                        className={`${inputBase} ${borderFor('message')} resize-y`}
                    />
                    {fieldError('message')}
                </div>

                {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field */}
                <div aria-hidden="true" className="sr-only">
                    <label htmlFor={`pf-${HONEYPOT_FIELD}`}>{t('honeypot_label')}</label>
                    <input
                        id={`pf-${HONEYPOT_FIELD}`}
                        type="text"
                        name={HONEYPOT_FIELD}
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={e => setHoneypot(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">{t('privacy_note')}</p>
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex flex-shrink-0 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-wait disabled:opacity-70"
                >
                    {status === 'submitting' ? t('submitting') : t('submit')}
                    <FaPaperPlane className="text-sm rtl:-scale-x-100" aria-hidden="true" />
                </button>
            </div>
        </form>
    );
}
