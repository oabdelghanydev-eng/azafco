'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { locales, localeConfig, type Locale } from '@/i18n';
import { cn } from '@/lib/v2/cn';
import { GlobeIcon } from './icons';

// Same keys as components/LanguageSwitcher.tsx + LocaleInitializer.tsx: an explicit
// choice must be remembered, or LocaleInitializer redirects back to the browser language.
const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';
const SESSION_CHOICE_KEY = 'azafco-locale-choice-made';

function rememberChoice(code: Locale) {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, code);
        sessionStorage.setItem(SESSION_CHOICE_KEY, 'true');
    } catch {
        /* storage disabled: navigation still works */
    }
}

/**
 * EN / AR toggle (primary pair) + small globe menu with all 6 locales.
 * Keeps the equivalent page: links to the same locale-less pathname.
 * Pages that don't exist in a locale fall back to that locale's 404 (graceful).
 */
export default function LanguageSwitch({
    className,
    compact = false,
    menuUp = false,
}: {
    className?: string;
    /** EN/AR pair only, no globe menu (tight mobile header) */
    compact?: boolean;
    /** Open the globe menu upwards (drawer footer) */
    menuUp?: boolean;
}) {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const t = useTranslations('v2.language');
    const [open, setOpen] = useState(false);
    const wrap = useRef<HTMLDivElement>(null);
    const btn = useRef<HTMLButtonElement>(null);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    const pair: { code: Locale; short: string }[] = [
        { code: 'en', short: 'EN' },
        { code: 'ar', short: 'ع' },
    ];

    return (
        <div ref={wrap} className={cn('relative flex items-center gap-1', className)}>
            <ul className="flex items-center rounded-control border border-rule p-0.5" aria-label={t('label')}>
                {pair.map(({ code, short }) => {
                    const current = code === locale;
                    return (
                        <li key={code}>
                            <Link
                                href={pathname}
                                locale={code}
                                lang={code}
                                hrefLang={code}
                                aria-current={current ? 'true' : undefined}
                                aria-label={code === 'ar' ? t('switch_to_ar') : t('switch_to_en')}
                                onClick={() => rememberChoice(code)}
                                className={cn(
                                    'flex h-9 min-w-[40px] items-center justify-center rounded-[4px] px-2.5 text-caption font-semibold transition-colors duration-fast',
                                    current ? 'bg-navy text-white' : 'text-fg hover:bg-tint',
                                )}
                            >
                                {short}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {!compact ? (
                <>
                    <button
                        ref={btn}
                        type="button"
                        aria-expanded={open}
                        aria-controls={menuId}
                        aria-label={t('more')}
                        onClick={() => setOpen((o) => !o)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') setOpen(false);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-control text-fg hover:bg-tint"
                    >
                        <GlobeIcon size={18} />
                    </button>
                    <ul
                        id={menuId}
                        hidden={!open}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setOpen(false);
                                btn.current?.focus();
                            }
                        }}
                        className={cn('absolute end-0 z-drawer min-w-[180px]', menuUp ? 'bottom-full mb-2' : 'top-full mt-2', ' rounded-card border border-line bg-white py-2 text-ink shadow-raised')}
                    >
                        {locales.map((code) => (
                            <li key={code}>
                                <Link
                                    href={pathname}
                                    locale={code}
                                    lang={code}
                                    hrefLang={code}
                                    aria-current={code === locale ? 'true' : undefined}
                                    onClick={() => {
                                        rememberChoice(code);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        'flex min-h-[44px] items-center justify-between gap-4 px-4 text-body-sm hover:bg-navy-50',
                                        code === locale && 'font-semibold text-navy',
                                    )}
                                >
                                    <span>{localeConfig[code].nativeName}</span>
                                    <span className="text-caption uppercase text-ink-subtle">{code}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            ) : null}
        </div>
    );
}
