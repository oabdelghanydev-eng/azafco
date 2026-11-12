'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { locales, localeConfig, type Locale } from '@/i18n';

const LOCALE_STORAGE_KEY = 'azafco-preferred-locale';
const SESSION_CHOICE_KEY = 'azafco-locale-choice-made';

function rememberChoice(code: Locale) {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, code);
        sessionStorage.setItem(SESSION_CHOICE_KEY, 'true');
    } catch {
        /* storage disabled */
    }
}

/**
 * Footer language pills, all six locales as on the G boards.
 * Desktop (lg+): one bordered capsule, short labels (ع / EN / ES ...).
 * Phone: separate outlined pills; the active locale and Arabic show their native name.
 */
/** Board order: current locale first, Arabic second, then the rest in config order. */
function orderedLocales(current: Locale): Locale[] {
    const rest = locales.filter((c) => c !== current && c !== 'ar');
    return current === 'ar' ? ['ar', ...rest] : [current, 'ar', ...rest];
}

export default function GFooterLangs({ label }: { label: string }) {
    const locale = useLocale() as Locale;
    const pathname = usePathname();

    return (
        <nav
            aria-label={label}
            className="flex flex-wrap gap-x-1.5 gap-y-2.5 lg:flex-nowrap lg:gap-1 lg:rounded-full lg:border lg:border-white/20 lg:p-1"
        >
            {orderedLocales(locale).map((code) => {
                const cur = code === locale;
                const short = code === 'ar' ? 'ع' : code.toUpperCase();
                const phone = cur || code === 'ar' ? localeConfig[code].nativeName : code.toUpperCase();
                return (
                    <Link
                        key={code}
                        href={pathname}
                        locale={code}
                        lang={code}
                        hrefLang={code}
                        aria-current={cur ? 'true' : undefined}
                        aria-label={localeConfig[code].nativeName}
                        onClick={() => rememberChoice(code)}
                        className={`group -my-[5px] inline-flex min-h-11 items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#f7b500] lg:-my-1.5`}
                    >
                        {/* 44px hit area on the link; the visual chip keeps the board size (34px phone, 32px desktop) */}
                        <span
                            className={`inline-flex h-[34px] items-center rounded-full px-3 text-[13px] leading-none transition-colors lg:h-8 ${
                                cur
                                    ? 'bg-white font-bold text-[#001b47]'
                                    : 'border border-white/25 font-semibold group-hover:text-[#f7b500] lg:border-0 lg:px-2.5'
                            }`}
                        >
                            <span className="lg:hidden">{phone}</span>
                            <span className="hidden lg:inline">{short}</span>
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
