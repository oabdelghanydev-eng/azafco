'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
// Client file: import the primitives from their files, not the '@/components/ui' barrel
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/icons';
import { cn, focusRing, typography } from '@/components/ui/tokens';

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
    // Fixed ids (one browser per page). useId() hydrated with different values on
    // the server and the client (the ancestor tree differs), flagged by the dev overlay.
    const searchId = 'catalogue-search';
    const hintId = 'catalogue-search-hint';

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
                    'inline-flex min-h-tap items-center rounded-full border border-solid px-4 font-medium transition-colors duration-fast motion-reduce:transition-none',
                    typography.small,
                    focusRing,
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
            <div role="search" className="rounded-card border border-solid border-line bg-surface-offwhite p-4 md:p-6">
                <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-5">
                        <label htmlFor={searchId} className={cn('mb-2 block font-semibold text-ink', typography.small)}>
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
                                className={cn(
                                    'min-h-12 w-full rounded-control border border-solid border-line-strong bg-white px-4 pe-12 text-ink placeholder:text-ink-subtle',
                                    typography.body,
                                    focusRing,
                                )}
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label={t('clear_search')}
                                    className={cn(
                                        'absolute end-0.5 top-1/2 inline-grid h-tap w-tap -translate-y-1/2 place-items-center rounded-control text-ink-muted hover:bg-surface-mist',
                                        focusRing,
                                    )}
                                >
                                    <CloseIcon size={20} />
                                </button>
                            ) : null}
                        </div>
                        <p id={hintId} className={cn('m-0 mt-2 text-ink-subtle', typography.caption)}>
                            {t('search_hint')}
                        </p>
                    </div>
                    <fieldset className="lg:col-span-7">
                        <legend className={cn('mb-2 font-semibold text-ink', typography.small)}>{t('water_type')}</legend>
                        <div className="flex flex-wrap gap-2">
                            {chip(null, t('all'))}
                            {categories.map((c) => chip(c.value, c.label))}
                        </div>
                    </fieldset>
                    {showForms ? (
                        <fieldset className="lg:col-span-12">
                            <legend className={cn('mb-2 font-semibold text-ink', typography.small)}>{t('form_type')}</legend>
                            <div className="flex flex-wrap gap-2">
                                {chip(null, t('all_forms'), form, setForm)}
                                {forms.map((f) => chip(f.value, f.label, form, setForm))}
                            </div>
                        </fieldset>
                    ) : null}
                </div>
            </div>

            <div className="mt-6 flex min-h-tap flex-wrap items-center justify-between gap-3">
                <p aria-live="polite" aria-atomic="true" className={cn('m-0 text-ink-muted', typography.small)}>
                    {t('result_count', { count: results.length, total: items.length })}
                    {activeLabel ? <span className="sr-only">{`, ${activeLabel}`}</span> : null}
                </p>
                {active ? (
                    <Button variant="ghost" size="sm" onClick={reset} icon={<CloseIcon size={16} />}>
                        {t('reset')}
                    </Button>
                ) : null}
            </div>

            {results.length > 0 ? (
                <ul className="m-0 mt-4 list-none divide-y divide-line border-0 border-y border-solid border-line p-0">
                    {results.map((it) => (
                        <li key={it.slug}>{it.card}</li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4 rounded-card border border-dashed border-line-strong bg-white px-6 py-12 text-center md:px-12">
                    <h3 className={cn('m-0 text-navy', typography.h3)}>{t('empty_title')}</h3>
                    <p className={cn('mx-auto mb-0 mt-3 max-w-prose-v2 text-ink-muted', typography.body)}>
                        {t('empty_text', { query: query.trim() || '—' })}
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Button variant="outline" onClick={reset}>
                            {t('reset')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
