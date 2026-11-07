/**
 * RFQ form controls (no hooks; used by the client RfqForm).
 * Every control: visible <label>, hint + error linked with aria-describedby,
 * aria-invalid, min 48px height, 16px+ text (no iOS zoom), logical spacing only.
 *
 * Error colour #B42318 on white = 6.5:1 (kit has no error token yet; see report).
 */
import type { ChangeEvent, ReactNode } from 'react';
import { cn } from '@/lib/v2/cn';

export const ERROR_TEXT = 'text-[#B42318]';
const control =
    'block w-full min-h-[48px] rounded-control border bg-white px-3 py-2 text-body text-ink placeholder:text-ink-subtle ' +
    'transition-colors duration-fast motion-reduce:transition-none hover:border-navy disabled:opacity-60';

export function controlClass(invalid?: boolean) {
    return cn(control, invalid ? 'border-[#B42318] border-2' : 'border-line-strong');
}

interface FieldShellProps {
    id: string;
    label: ReactNode;
    required?: boolean;
    optionalLabel?: string;
    requiredLabel?: string;
    hint?: ReactNode;
    error?: string;
    children: ReactNode;
    className?: string;
}

export function describedBy(id: string, hint?: ReactNode, error?: string) {
    return [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}

export function FieldShell({ id, label, required, optionalLabel, requiredLabel, hint, error, children, className }: FieldShellProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label htmlFor={id} className="text-body-sm font-semibold text-ink">
                {label}
                {required ? (
                    <span className="ms-1 text-ink-muted" aria-hidden="true">
                        *
                    </span>
                ) : optionalLabel ? (
                    <span className="ms-2 text-caption font-normal text-ink-subtle">({optionalLabel})</span>
                ) : null}
                {required && requiredLabel ? <span className="sr-only"> ({requiredLabel})</span> : null}
            </label>
            {hint ? (
                <p id={`${id}-hint`} className="-mt-1 text-caption text-ink-muted">
                    {hint}
                </p>
            ) : null}
            {children}
            <FieldError id={id} error={error} />
        </div>
    );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
    if (!error) return null;
    return (
        <p id={`${id}-error`} className={cn('flex items-start gap-2 text-caption font-medium', ERROR_TEXT)}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
                <path d="M10 1.667a8.333 8.333 0 100 16.666 8.333 8.333 0 000-16.666zm.833 12.5H9.167V12.5h1.666v1.667zm0-3.334H9.167v-5h1.666v5z" />
            </svg>
            <span>{error}</span>
        </p>
    );
}

export interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    id: string;
    name: string;
    value: string;
    options: Option[];
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    autoComplete?: string;
    dir?: 'ltr' | 'rtl';
    className?: string;
    'aria-label'?: string;
}

export function Select({ id, name, value, options, placeholder, onChange, required, invalid, describedBy: db, autoComplete, dir, className, ...rest }: SelectProps) {
    return (
        <div className={cn('relative', className)}>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                aria-required={required || undefined}
                aria-invalid={invalid || undefined}
                aria-describedby={db}
                autoComplete={autoComplete}
                dir={dir}
                className={cn(controlClass(invalid), 'appearance-none pe-10')}
                {...rest}
            >
                {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

interface ChoiceProps {
    id: string;
    name: string;
    type: 'checkbox' | 'radio';
    checked: boolean;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: ReactNode;
    invalid?: boolean;
    describedBy?: string;
    required?: boolean;
}

/** Checkbox / radio with a 44px+ hit area (the whole row is the label). */
export function Choice({ id, name, type, checked, value, onChange, label, invalid, describedBy: db, required }: ChoiceProps) {
    return (
        <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-body-sm text-ink">
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                checked={checked}
                onChange={onChange}
                aria-invalid={invalid || undefined}
                aria-describedby={db}
                aria-required={required || undefined}
                className={cn('mt-0.5 h-5 w-5 shrink-0 accent-navy', invalid && 'outline outline-2 outline-[#B42318]')}
            />
            <span>{label}</span>
        </label>
    );
}
