'use client';

import { Link, usePathname } from '@/navigation';
import type { Locale } from '@/i18n';
import { orderLangs, rememberChoice, type LangOption } from './langs';

/**
 * Footer language pills (published locales only, from the server footer).
 * Every pill shows the language's native name, as in the header list (العربية,
 * English…), at every width and in one text node (no hidden duplicate label).
 * Desktop (lg+): one bordered capsule. Phone: separate outlined pills.
 */
export default function GFooterLangs({ label, locale, langs }: { label: string; locale: Locale; langs: LangOption[] }) {
    const pathname = usePathname();

    return (
        <nav
            aria-label={label}
            className="flex flex-wrap gap-x-1.5 gap-y-2.5 lg:flex-nowrap lg:gap-1 lg:rounded-full lg:border lg:border-white/20 lg:p-1"
        >
            {orderLangs(locale, langs).map(({ code, nativeName }) => {
                const cur = code === locale;
                return (
                    <Link
                        key={code}
                        href={pathname}
                        locale={code}
                        lang={code}
                        hrefLang={code}
                        aria-current={cur ? 'true' : undefined}
                        onClick={() => rememberChoice(code)}
                        className="group -my-[5px] inline-flex min-h-tap items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold lg:-my-1.5"
                    >
                        {/* 44px hit area on the link; the visual chip keeps the board size (34px phone, 32px desktop) */}
                        <span
                            className={`inline-flex h-[34px] items-center rounded-full px-3 text-micro leading-none transition-colors motion-reduce:transition-none lg:h-8 ${
                                cur
                                    ? 'bg-white font-bold text-navy-900'
                                    : 'border border-white/25 font-semibold group-hover:text-gold lg:border-0 lg:px-2.5'
                            }`}
                        >
                            {nativeName}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
