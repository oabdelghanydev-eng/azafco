'use client';

import { useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '@/navigation';
import type { Locale } from '@/i18n';
import { routes } from '@/lib/v2/routes';
import { ChevronDownIcon, CloseIcon, GlobeIcon, MenuIcon, WhatsAppIcon } from '@/components/ui/icons';
import { cn, focusRingLight as FOCUS, typography } from '@/components/ui/tokens';
import { GNavLink, useGNav } from './GFooterNav';
import { G_NAV_KEYS_BAR, G_NAV_KEYS_MENU, type GNavKey } from './nav';
import { keepQueryOnSwitch, orderLangs, rememberChoice, type LangOption } from './langs';

export interface GHeaderCopy {
    homeLabel: string;
    logoAlt: string;
    navLabel: string;
    nav: Record<GNavKey, string>;
    /** Accessible name of the language button, already filled with the current language */
    langAria: string;
    langListLabel: string;
    menuOpen: string;
    menuClose: string;
    whatsappCta: string;
    whatsappAria: string;
}

export interface GHeaderClientProps {
    locale: Locale;
    copy: GHeaderCopy;
    /** Published locales only (es/ru/de/fr redirect to English until translated) */
    langs: LangOption[];
    /** Native name of the current locale (button label) */
    langName: string;
    whatsappHref: string;
    /** "+20 100 773 6419", shown in the WhatsApp pill from 1440px */
    phone: string;
}

/**
 * Interactive part of the design G header. All copy, the WhatsApp link and the
 * language list come in as props from the server wrapper (GHeader), so this file
 * ships no translation messages and no company config to the browser.
 *
 * Desktop (xl+): logo, one line of nav (seven items, Contact last),
 * WhatsApp, language pill with a dropdown. Below xl: logo, (from lg) the WhatsApp
 * circle and language pill, and a Menu/Close toggle whose panel lists every
 * section including "About us". The seven labels cannot share one line at 1024px
 * in de/fr/ru without smaller type, so the bar starts at xl (lead ruling R2 in
 * docs/team/web/g/ROUND1-SPEC.md: short "Packing" label, About us stays).
 * There is one language list: a full-width panel under the header on phones,
 * a dropdown from lg.
 */
export default function GHeaderClient({ locale, copy, langs, langName, whatsappHref, phone }: GHeaderClientProps) {
    const pathname = usePathname();
    const [lang, setLang] = useState(false);
    const [menu, setMenu] = useState(false);
    const rootRef = useRef<HTMLElement>(null);
    // Real routes (with aria-current) on every page; Contact last
    const bar = useGNav(G_NAV_KEYS_BAR);
    const menuNav = useGNav(G_NAV_KEYS_MENU);

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

    const navLinkBase = `transition-colors hover:text-navy hover:underline hover:decoration-gold hover:decoration-2 hover:underline-offset-[10px] aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[10px] ${FOCUS}`;

    return (
        <header ref={rootRef} className="g-font relative z-header border-b border-line-soft bg-white text-ink">
            <div className="mx-auto box-border flex max-w-v2 items-center justify-between gap-3 py-2.5 pe-3 ps-5 lg:flex-wrap lg:gap-x-8 lg:gap-y-3 lg:px-8 lg:py-3.5">
                <Link href={routes.home} aria-label={copy.homeLabel} className={`shrink-0 rounded-card ${FOCUS}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/g/logo-primary.svg"
                        alt={copy.logoAlt}
                        width={89}
                        height={60}
                        className="block h-11 w-auto lg:h-[60px]"
                    />
                </Link>

                {/* Desktop nav (xl+): tighter gap until 1440 so the seven labels stay on one line */}
                <nav aria-label={copy.navLabel} className={cn('hidden flex-wrap gap-x-6 gap-y-1 font-semibold xl:flex', typography.body)}>
                    {bar.map((n) => (
                        <GNavLink key={n.key} item={n} className={`py-3 text-ink ${navLinkBase}`}>
                            {copy.nav[n.key]}
                        </GNavLink>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center lg:relative lg:gap-2.5">
                    {/* WhatsApp to management (lg+): icon-only circle at lg, label from xl, and from 1440px the
                        number instead of the label (label plus number wraps the row in de and es) */}
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="header_whatsapp"
                        aria-label={copy.whatsappAria}
                        className={cn(
                            'hidden h-tap min-w-tap items-center justify-center gap-2 rounded-full border-[1.5px] border-solid border-navy bg-white px-0 font-bold leading-none text-navy transition-colors hover:bg-navy hover:text-white lg:inline-flex xl:h-[46px] xl:px-[18px]',
                            typography.small,
                            FOCUS,
                        )}
                    >
                        <WhatsAppIcon size={20} />
                        <span className="hidden xl:inline min-[1440px]:hidden">{copy.whatsappCta}</span>
                        <span dir="ltr" className={cn('hidden font-semibold min-[1440px]:inline', typography.caption)}>
                            {phone}
                        </span>
                    </a>
                    <button
                        type="button"
                        aria-expanded={lang}
                        aria-controls={lang ? 'g-lang' : undefined}
                        aria-label={copy.langAria}
                        onClick={() => {
                            setLang((v) => !v);
                            setMenu(false);
                        }}
                        className={cn(
                            'inline-flex h-12 cursor-pointer items-center gap-[7px] rounded-full border-0 bg-transparent px-2.5 font-bold leading-none text-navy transition-colors hover:bg-surface-offwhite lg:h-[46px] lg:gap-[9px] lg:border-[1.5px] lg:border-solid lg:border-line lg:bg-white lg:px-[18px] lg:hover:border-navy lg:hover:bg-white',
                            typography.small,
                            FOCUS,
                        )}
                    >
                        <GlobeIcon size={20} />
                        {langName}
                        <span aria-hidden="true" className={`hidden transition-transform motion-reduce:transition-none lg:inline-flex ${lang ? 'rotate-180' : ''}`}>
                            <ChevronDownIcon size={16} />
                        </span>
                    </button>

                    <button
                        type="button"
                        aria-expanded={menu}
                        aria-controls={menu ? 'g-nav-m' : undefined}
                        onClick={() => {
                            setMenu((v) => !v);
                            setLang(false);
                        }}
                        className={cn(
                            'inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-control border-0 bg-transparent px-3 font-bold leading-none text-navy xl:hidden',
                            typography.small,
                            FOCUS,
                        )}
                    >
                        {menu ? copy.menuClose : copy.menuOpen}
                        {menu ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
                    </button>

                    {/* One language list: full-width panel under the header on phones (the header is the
                        positioning box there), dropdown under the pill from lg (this box is relative there) */}
                    <ul
                        id="g-lang"
                        hidden={!lang}
                        aria-label={copy.langListLabel}
                        className="absolute inset-x-0 top-full z-drawer m-0 list-none border-b border-t border-line-soft bg-white px-3 pb-3.5 pt-2 shadow-raised lg:inset-x-auto lg:end-0 lg:top-[54px] lg:min-w-[220px] lg:rounded-control lg:border lg:p-2"
                    >
                        {orderLangs(locale, langs).map(({ code, nativeName }) => {
                            const cur = code === locale;
                            return (
                                <li key={code}>
                                    <Link
                                        href={pathname}
                                        locale={code}
                                        lang={code}
                                        hrefLang={code}
                                        aria-current={cur ? 'true' : undefined}
                                        onClick={(e) => {
                                            rememberChoice(code);
                                            setLang(false);
                                            keepQueryOnSwitch(e);
                                        }}
                                        className={cn(
                                            'flex min-h-tap items-center justify-between gap-4 rounded-control px-3.5 py-2.5 leading-snug text-ink transition-colors hover:bg-surface-offwhite hover:text-navy',
                                            typography.small,
                                            FOCUS,
                                            cur ? 'bg-surface-offwhite font-bold' : 'font-medium',
                                        )}
                                    >
                                        <span>{nativeName}</span>
                                        <span dir="ltr" className="text-micro font-semibold text-ink-muted">
                                            {code.toUpperCase()}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Phone menu: rendered only while open, so there is never a second hidden "Main" nav landmark */}
            {menu && (
                <nav
                    id="g-nav-m"
                    aria-label={copy.navLabel}
                    className={cn('border-t border-line-soft px-5 pb-5 pt-1 lg:px-8 xl:hidden', typography.h4)}
                >
                    {menuNav.map((n, i) => (
                        <GNavLink
                            key={n.key}
                            item={n}
                            onClick={() => setMenu(false)}
                            className={`block py-3 text-ink transition-colors hover:text-navy aria-[current=page]:text-navy ${i < menuNav.length - 1 ? 'border-b border-line-soft' : ''} ${FOCUS}`}
                        >
                            {copy.nav[n.key]}
                        </GNavLink>
                    ))}
                </nav>
            )}
        </header>
    );
}
