'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { type Locale } from '@/i18n';
import { cn } from '@/lib/v2/cn';

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
 * EN / AR toggle. Only the published locales (ar/en) are offered: es/ru/de/fr
 * have no translated v2 copy and redirect to English (next.config.js), so they
 * are not listed until translated. Keeps the equivalent page: links to the same
 * locale-less pathname.
 */
export default function LanguageSwitch({
    className,
}: {
    className?: string;
}) {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const t = useTranslations('v2.language');

    const pair: { code: Locale; short: string }[] = [
        { code: 'en', short: 'EN' },
        { code: 'ar', short: 'ع' },
    ];

    return (
        <div className={cn('relative flex items-center gap-1', className)}>
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
        </div>
    );
}
