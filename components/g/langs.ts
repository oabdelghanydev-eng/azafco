/**
 * Shared language-switcher helpers for the G header and footer. Plain module:
 * no next-intl/server or company-config import, so it is safe in client files.
 * The server wrappers (GHeader, GFooter) build the list from `publishedLocales`
 * (i18n.ts): es/ru/de/fr redirect to English until translated, so they are not
 * offered in the switcher yet (RELEASE-DECISIONS §7 keeps all six as the target).
 */
import type { MouseEvent } from 'react';
import type { Locale } from '@/i18n';

export interface LangOption {
    code: Locale;
    /** Native name, e.g. "العربية", "English" */
    nativeName: string;
}

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';
const SESSION_CHOICE_KEY = 'azafco-locale-choice-made';

/** Remember an explicit language choice (read by the locale redirect). */
export function rememberChoice(code: Locale) {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, code);
        sessionStorage.setItem(SESSION_CHOICE_KEY, 'true');
    } catch {
        /* storage disabled: navigation still works */
    }
}

/**
 * Language links keep the query string (e.g. /requirements?product=tilapia&type=product).
 * The search is read from window.location at click time: useSearchParams would make the
 * static pages dynamic. Without a query the next-intl Link navigates as usual; with one,
 * this takes over the plain left click and loads the same URL in the new language.
 */
export function keepQueryOnSwitch(e: MouseEvent<HTMLAnchorElement>) {
    const { search } = window.location;
    if (!search || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const url = new URL(e.currentTarget.href, window.location.href);
    url.search = search;
    window.location.assign(url.toString());
}

/** Board order: current locale first, Arabic second, then the rest in config order. */
export function orderLangs(current: Locale, langs: readonly LangOption[]): LangOption[] {
    const cur = langs.find((l) => l.code === current);
    const ar = current === 'ar' ? undefined : langs.find((l) => l.code === 'ar');
    const rest = langs.filter((l) => l.code !== current && l.code !== 'ar');
    return [cur, ar, ...rest].filter((l): l is LangOption => Boolean(l));
}
