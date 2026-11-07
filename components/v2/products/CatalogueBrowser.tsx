'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/v2/Button';
import { CloseIcon } from '@/components/v2/icons';
import { cn } from '@/lib/v2/cn';
import { rfqHref } from '@/lib/v2/routes';

export interface BrowserItem {
    slug: string;
    category: string;
    /** Product form codes offered for this species (data/specs.ts) */
    forms?: string[];
    /** Names (AR + EN), alternate names, verified scientific name */
    terms: string[];
    /** Server-rendered <ProductCard> */
    card: ReactNode;
}

export interface CatalogueBrowserProps {
    items: BrowserItem[];
    /** Water-type filter options present in the data */
    categories: { value: string; label: string }[];
    /** Product-form filter options; the filter only shows with more than one */
    forms?: { value: string; label: string }[];
}

/** Case/diacritic-insensitive; folds Arabic letter variants (أ إ آ → ا, ة → ه, ى → ي). */
function normalise(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[ً-ٰٟـ]/g, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
}

/**
 * Species search + water-type filter for the catalogue. Filtering is client-side
 * (no reload); cards are rendered on the server and passed in.
 */
export default function CatalogueBrowser({ items, categories, forms = [] }: CatalogueBrowserProps) {
    const t = useTranslations('catalogue_v2.browser');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<string | null>(null);
    const [form, setForm] = useState<string | null>(null);
    const showForms = forms.length > 1;
    const searchId = useId();
    const hintId = useId();

    const indexed = useMemo(() => items.map((it) => ({ ...it, haystack: normalise(it.terms.join(' ')) })), [items]);
    const q = normalise(query);
    const results = indexed.filter(
        (it) =>
            (!category || it.category === category) &&
            (!form || (it.forms ?? []).includes(form)) &&
            (!q || q.split(' ').every((w) => it.haystack.includes(w))),
    );
    const active = q !== '' || category !== null || form !== null;
    const reset = () => {
        setQuery('');
        setCategory(null);
        setForm(null);
    };
    const activeLabel = [categories.find((c) => c.value === category)?.label, forms.find((f) => f.value === form)?.label]
        .filter(Boolean)
        .join(', ');

    const chip = (value: string | null, label: string, current: string | null = category, set: (v: string | null) => void = setCategory) => {
        const pressed = current === value;
        return (
            <button
                key={value ?? 'all'}
                type="button"
                aria-pressed={pressed}
                onClick={() => set(value)}
                className={cn(
                    'inline-flex min-h-11 items-center rounded-full border px-4 text-body-sm font-medium transition-colors duration-fast',
                    pressed
                        ? 'border-navy bg-navy text-white'
                        : 'border-line-strong bg-white text-ink hover:border-navy hover:bg-navy-50',
                )}
            >
                {label}
            </button>
        );
    };

    return (
        <div>
            <div role="search" className="rounded-card border border-line bg-surface-offwhite p-4 md:p-6">
                <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-5">
                        <label htmlFor={searchId} className="mb-2 block text-body-sm font-semibold text-ink">
                            {t('search_label')}
                        </label>
                        <div className="relative">
                            <input
                                id={searchId}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                aria-describedby={hintId}
                                autoComplete="off"
                                enterKeyHint="search"
                                className="min-h-12 w-full rounded-control border border-line-strong bg-white px-4 pe-12 text-body text-ink placeholder:text-ink-subtle"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="absolute end-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-control text-ink-muted hover:bg-surface-mist"
                                >
                                    <CloseIcon size={18} />
                                    <span className="sr-only">{t('clear_search')}</span>
                                </button>
                            ) : null}
                        </div>
                        <p id={hintId} className="mt-2 text-caption text-ink-subtle">
                            {t('search_hint')}
                        </p>
                    </div>
                    <fieldset className="lg:col-span-7">
                        <legend className="mb-2 text-body-sm font-semibold text-ink">{t('water_type')}</legend>
                        <div className="flex flex-wrap gap-2">
                            {chip(null, t('all'))}
                            {categories.map((c) => chip(c.value, c.label))}
                        </div>
                    </fieldset>
                    {showForms ? (
                        <fieldset className="lg:col-span-12">
                            <legend className="mb-2 text-body-sm font-semibold text-ink">{t('form_type')}</legend>
                            <div className="flex flex-wrap gap-2">
                                {chip(null, t('all_forms'), form, setForm)}
                                {forms.map((f) => chip(f.value, f.label, form, setForm))}
                            </div>
                        </fieldset>
                    ) : null}
                </div>
            </div>

            <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
                <p aria-live="polite" aria-atomic="true" className="text-body-sm text-ink-muted">
                    {t('result_count', { count: results.length, total: items.length })}
                    {activeLabel ? <span className="sr-only">{`, ${activeLabel}`}</span> : null}
                </p>
                {active ? (
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-body-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-[6px] hover:bg-navy-50"
                    >
                        <CloseIcon size={16} />
                        {t('reset')}
                    </button>
                ) : null}
            </div>

            {results.length > 0 ? (
                <ul className="mt-4 divide-y divide-line border-y border-line">
                    {results.map((it) => (
                        <li key={it.slug}>{it.card}</li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4 rounded-card border border-dashed border-line-strong bg-white px-6 py-12 text-center md:px-12">
                    <h3 className="text-heading-lg text-navy">{t('empty_title')}</h3>
                    <p className="mx-auto mt-3 max-w-prose-v2 text-body text-ink-muted">
                        {t('empty_text', { query: query.trim() || '—' })}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button variant="outline" onClick={reset}>
                            {t('reset')}
                        </Button>
                        <Button href={rfqHref({ type: 'specifications' })} arrow>
                            {t('empty_cta')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
