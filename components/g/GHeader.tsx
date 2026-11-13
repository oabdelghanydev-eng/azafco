'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { locales, localeConfig, type Locale } from '@/i18n';
import { routes } from '@/lib/v2/routes';
import { companyConfig } from '@/config/company.config';
import { GNavLink, useGNav } from './GFooterNav';

/** "+20 100 773 6419" from the config number (201007736419), as in GFooter */
function phoneDisplay(n: string): string {
    return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}

function ChatIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.3 18.4z" strokeLinejoin="round" />
        </svg>
    );
}

// Same keys as components/v2/LanguageSwitch.tsx (remembers the explicit choice)
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


/** Board order: current locale first, Arabic second, then the rest in config order. */
function orderedLocales(current: Locale): Locale[] {
    const rest = locales.filter((c) => c !== current && c !== 'ar');
    return current === 'ar' ? ['ar', ...rest] : [current, 'ar', ...rest];
}

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]';

function GlobeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9" />
        </svg>
    );
}

/**
 * Design G site header (boards GroupAr / Group / *Mobile). Desktop (lg+): logo,
 * five nav items + Contact (board anchors on home, real routes elsewhere), language pill with a six-locale menu. Phone: logo,
 * language button and a Menu/Close toggle; both open full-width panels under the row.
 */
export default function GHeader() {
    const t = useTranslations('g_header_v2');
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const [lang, setLang] = useState(false);
    const [menu, setMenu] = useState(false);
    const rootRef = useRef<HTMLElement>(null);
    // Board anchors on home, real routes (with aria-current) elsewhere; Contact last
    const nav = useGNav(true);

    // Close everything on navigation
    useEffect(() => {
        setLang(false);
        setMenu(false);
    }, [pathname]);

    // Escape and outside click close the open panel
    useEffect(() => {
        if (!lang && !menu) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLang(false);
                setMenu(false);
            }
        };
        const onClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setLang(false);
                setMenu(false);
            }
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onClick);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClick);
        };
    }, [lang, menu]);

    const langName = localeConfig[locale].nativeName;

    const langItems = (
        <>
            {orderedLocales(locale).map((code) => {
                const cur = code === locale;
                return (
                    <li key={code}>
                        <Link
                            href={pathname}
                            locale={code}
                            lang={code}
                            hrefLang={code}
                            aria-current={cur ? 'true' : undefined}
                            onClick={() => {
                                rememberChoice(code);
                                setLang(false);
                            }}
                            className={`flex min-h-11 items-center justify-between gap-4 rounded-[6px] px-3.5 py-2.5 text-[15px] leading-[1.4] text-[#0d1f3f] transition-colors hover:bg-[#f2f5fa] hover:text-[#002d72] ${FOCUS} ${cur ? 'bg-[#f2f5fa] font-bold' : 'font-medium'}`}
                        >
                            <span>{localeConfig[code].nativeName}</span>
                            <span dir="ltr" className="text-[12px] font-semibold text-[#4a5a75]">
                                {code.toUpperCase()}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </>
    );

    const navLinkBase = `transition-colors hover:text-[#002d72] hover:underline hover:decoration-[#f7b500] hover:decoration-2 hover:underline-offset-[10px] aria-[current=page]:underline aria-[current=page]:decoration-[#f7b500] aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[10px] ${FOCUS}`;

    return (
        <header ref={rootRef} className="g-font relative z-header border-b border-[#e3e8f0] bg-white text-[#0d1f3f]">
            <div className="mx-auto box-border flex max-w-[1320px] items-center justify-between gap-3 py-2.5 pe-3 ps-5 lg:flex-wrap lg:gap-x-8 lg:gap-y-3 lg:px-8 lg:py-3.5">
                <Link href={routes.home} aria-label={t('home_label')} className={`shrink-0 rounded-[4px] ${FOCUS}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/g/logo-primary.svg"
                        alt={t('logo_alt')}
                        width={89}
                        height={60}
                        className="block h-11 w-auto lg:h-[60px]"
                    />
                </Link>

                {/* Desktop nav */}
                <nav
                    aria-label={t('nav_label')}
                    className={`hidden flex-wrap gap-x-[34px] gap-y-1 font-semibold lg:flex ${locale === 'ar' ? 'text-[17px]' : 'text-[16px]'}`}
                >
                    {nav.map((n) => (
                        <GNavLink key={n.key} item={n} className={`py-3 text-[#0d1f3f] ${navLinkBase}`}>
                            {t(`nav.${n.key}`)}
                        </GNavLink>
                    ))}
                </nav>

                <div className="relative flex shrink-0 items-center lg:gap-2.5">
                    {/* WhatsApp to management (lg+): icon-only circle at lg, label from xl, number from 1360px so the row never wraps */}
                    <a
                        href={companyConfig.contact.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="header_whatsapp"
                        aria-label={t('whatsapp_aria')}
                        className={`hidden h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] border-solid border-[#002d72] bg-white px-0 font-bold leading-none text-[#002d72] transition-colors hover:bg-[#002d72] hover:text-white lg:inline-flex xl:h-[46px] xl:px-[18px] ${locale === 'ar' ? 'text-[16px]' : 'text-[15px]'} ${FOCUS}`}
                    >
                        <ChatIcon />
                        <span className="hidden xl:inline">{t('whatsapp_cta')}</span>
                        <span dir="ltr" className="hidden text-[14px] font-semibold min-[1360px]:inline">
                            {phoneDisplay(companyConfig.contact.whatsappNumber)}
                        </span>
                    </a>
                    <button
                        type="button"
                        aria-expanded={lang}
                        aria-controls={lang ? 'g-lang-d g-lang-m' : undefined}
                        aria-label={t('lang_aria', { name: langName })}
                        onClick={() => {
                            setLang((v) => !v);
                            setMenu(false);
                        }}
                        className={`inline-flex h-12 cursor-pointer items-center gap-[7px] rounded-full border-0 bg-transparent px-2.5 font-bold leading-none text-[#002d72] transition-colors hover:bg-[#f2f5fa] lg:h-[46px] lg:gap-[9px] lg:border-[1.5px] lg:border-solid lg:border-[#d5dde9] lg:bg-white lg:px-[18px] lg:hover:border-[#002d72] lg:hover:bg-white ${locale === 'ar' ? 'text-[16px]' : 'text-[15px]'} ${FOCUS}`}
                    >
                        <GlobeIcon />
                        {langName}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            aria-hidden="true"
                            className={`hidden transition-transform motion-reduce:transition-none lg:block ${lang ? 'rotate-180' : ''}`}
                        >
                            <path d="M2.5 4.5 6 8l3.5-3.5" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        aria-expanded={menu}
                        aria-controls="g-nav-m"
                        onClick={() => {
                            setMenu((v) => !v);
                            setLang(false);
                        }}
                        className={`inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-[6px] border-0 bg-transparent px-3 font-bold leading-none text-[#002d72] lg:hidden ${locale === 'ar' ? 'text-[16px]' : 'text-[15px]'} ${FOCUS}`}
                    >
                        {menu ? t('menu_close') : t('menu_open')}
                        <span aria-hidden="true" className="grid w-[22px] gap-[5px]">
                            <span className="h-0.5 bg-[#002d72]" />
                            <span className="h-0.5 bg-[#002d72]" />
                            <span className="h-0.5 bg-[#002d72]" />
                        </span>
                    </button>

                    {/* Language dropdown (lg+) */}
                    <ul
                        id="g-lang-d"
                        hidden={!lang}
                        aria-label={t('lang_list_label')}
                        className={`absolute end-0 top-[54px] z-drawer m-0 hidden min-w-[220px] list-none rounded-[10px] border border-[#e3e8f0] bg-white p-2 shadow-[0_18px_40px_rgba(0,27,71,.16)] ${lang ? 'lg:block' : ''}`}
                    >
                        {langItems}
                    </ul>
                </div>
            </div>

            {/* Phone language panel (in flow under the row, as on the Mobile boards) */}
            <ul
                id="g-lang-m"
                hidden={!lang}
                aria-label={t('lang_list_label')}
                className="m-0 list-none border-t border-[#e3e8f0] px-3 pb-3.5 pt-2 lg:hidden"
            >
                {langItems}
            </ul>

            {/* Phone menu */}
            <nav
                id="g-nav-m"
                hidden={!menu}
                aria-label={t('nav_label')}
                className="border-t border-[#e3e8f0] px-5 pb-5 pt-1 text-[18px] font-bold lg:hidden"
            >
                {nav.map((n, i) => (
                    <GNavLink
                        key={n.key}
                        item={n}
                        onClick={() => setMenu(false)}
                        className={`block text-[#0d1f3f] transition-colors hover:text-[#002d72] aria-[current=page]:text-[#002d72] ${i < nav.length - 1 ? 'border-b border-[#e3e8f0]' : ''} ${locale === 'ar' ? 'py-3' : 'py-3.5'} ${FOCUS}`}
                    >
                        {t(`nav.${n.key}`)}
                    </GNavLink>
                ))}
            </nav>
        </header>
    );
}
