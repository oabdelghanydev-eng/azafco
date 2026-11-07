'use client';

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { mainNav, type NavGroup } from '@/lib/v2/nav';
import { isActivePath, routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import Button from './Button';
import LanguageSwitch from './LanguageSwitch';
import Logo from './Logo';
import { ChevronDownIcon, CloseIcon, MenuIcon } from './icons';

/**
 * Global header (client: dropdowns, drawer, scroll state).
 * Desktop (xl+): logo → 4 nav items (3 dropdowns) → EN/AR + globe → Contact → Request a Quote.
 * md–xl: logo, language, Request a Quote, menu button. <md: logo, language, menu button
 * (the RFQ lives in the fixed bottom bar, see MobileQuoteBar).
 * Arabic mirrors via logical properties (start/end) and dir="rtl" on <html>.
 */
export default function SiteHeader() {
    const t = useTranslations('v2');
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const [drawer, setDrawer] = useState(false);
    const menuBtn = useRef<HTMLButtonElement>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Compact state after a short scroll (hysteresis avoids flicker at the threshold)
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled((s) => (s ? y > 8 : y > 48));
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setOpenIdx(null);
        setDrawer(false);
    }, [pathname]);

    // Click outside closes a dropdown
    useEffect(() => {
        if (openIdx === null) return;
        const onDown = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenIdx(null);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [openIdx]);

    const closeDrawer = useCallback(() => {
        setDrawer(false);
        menuBtn.current?.focus();
    }, []);

    return (
        <>
        <header
            className={cn(
                'sticky top-0 z-header border-b bg-white/95 text-fg backdrop-blur supports-[backdrop-filter]:bg-white/90',
                'transition-shadow duration-base motion-reduce:transition-none',
                scrolled ? 'border-transparent shadow-header' : 'border-line',
            )}
            data-surface="light"
        >
            <div className={cn('mx-auto flex max-w-v2 items-center gap-4 px-4 sm:px-6 lg:px-10', scrolled ? 'h-16' : 'h-24')}>
                <Link href={routes.home} aria-label={t('nav.home_link_label')} className="shrink-0">
                    <span className={cn(scrolled && 'hidden')}>
                        <Logo kind="primary" width={120} alt="" />
                    </span>
                    <span className={cn(!scrolled && 'hidden')}>
                        <Logo kind="symbol" width={64} alt="" />
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav ref={navRef} aria-label={t('nav.main_label')} className="ms-6 hidden flex-1 xl:block">
                    <ul className="flex items-center gap-1">
                        {mainNav.map((g, i) => (
                            <li key={g.labelKey} className="relative">
                                {g.children ? (
                                    <NavDropdown
                                        group={g}
                                        open={openIdx === i}
                                        onToggle={() => setOpenIdx((o) => (o === i ? null : i))}
                                        onClose={() => setOpenIdx(null)}
                                        pathname={pathname}
                                    />
                                ) : (
                                    <Link
                                        href={g.href!}
                                        aria-current={isActivePath(pathname, g.href!) ? 'page' : undefined}
                                        className={navItemCls(isActivePath(pathname, g.href!))}
                                    >
                                        {t(`nav.${g.labelKey}`)}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="ms-auto flex items-center gap-2 xl:ms-0">
                    <LanguageSwitch className="hidden sm:flex" />
                    <LanguageSwitch className="sm:hidden" compact />
                    <Button href={routes.contact} variant="outline" size="sm" className="hidden xl:inline-flex">
                        {t('nav.contact')}
                    </Button>
                    <Button href={routes.rfq} size="sm" className="hidden md:inline-flex" dataAttrs={{ 'data-cta': 'header_rfq' }}>
                        {t('cta.request_quote')}
                    </Button>
                    <button
                        ref={menuBtn}
                        type="button"
                        onClick={() => setDrawer(true)}
                        aria-expanded={drawer}
                        aria-controls="v2-mobile-drawer"
                        aria-label={t('nav.open_menu')}
                        className="flex h-11 w-11 items-center justify-center rounded-control text-fg hover:bg-tint xl:hidden"
                    >
                        <MenuIcon size={24} />
                    </button>
                </div>
            </div>

        </header>
        {/* Outside <header>: its backdrop-filter would trap position:fixed children */}
        {drawer ? <MobileDrawer pathname={pathname} onClose={closeDrawer} /> : null}
        </>
    );
}

function navItemCls(active: boolean) {
    return cn(
        'relative inline-flex min-h-[44px] items-center gap-1 rounded-control px-3 text-body-sm font-medium text-ink',
        'transition-colors duration-fast hover:bg-navy-50 hover:text-navy',
        'after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-gold after:transition-opacity after:duration-fast',
        active ? 'text-navy after:opacity-100' : 'after:opacity-0',
    );
}

function NavDropdown({
    group,
    open,
    onToggle,
    onClose,
    pathname,
}: {
    group: NavGroup;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    pathname: string;
}) {
    const t = useTranslations('v2.nav');
    const id = useId();
    const btn = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLUListElement>(null);
    const active = group.children!.some((c) => isActivePath(pathname, c.href));

    const focusItem = (dir: 1 | -1 | 'first' | 'last') => {
        const items = Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
        if (!items.length) return;
        const idx = items.indexOf(document.activeElement as HTMLAnchorElement);
        const next =
            dir === 'first' ? 0 : dir === 'last' ? items.length - 1 : (idx + dir + items.length) % items.length;
        items[next]?.focus();
    };

    const onBtnKey = (e: ReactKeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open) onToggle();
            requestAnimationFrame(() => focusItem('first'));
        } else if (e.key === 'Escape' && open) {
            onClose();
        }
    };

    const onPanelKey = (e: ReactKeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
            btn.current?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusItem(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusItem(-1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            focusItem('first');
        } else if (e.key === 'End') {
            e.preventDefault();
            focusItem('last');
        }
    };

    return (
        <div
            onBlur={(e) => {
                if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
            }}
        >
            <button
                ref={btn}
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={onToggle}
                onKeyDown={onBtnKey}
                className={navItemCls(active)}
            >
                {t(group.labelKey)}
                <ChevronDownIcon
                    size={16}
                    className={cn('transition-transform duration-fast motion-reduce:transition-none', open && 'rotate-180')}
                />
            </button>
            <ul
                ref={panel}
                id={id}
                hidden={!open}
                onKeyDown={onPanelKey}
                className="absolute start-0 top-full z-drawer mt-2 min-w-[240px] rounded-card border border-line bg-white py-2 shadow-raised"
            >
                {group.children!.map((c) => {
                    const cur = isActivePath(pathname, c.href);
                    return (
                        <li key={c.href}>
                            <Link
                                href={c.href}
                                aria-current={cur ? 'page' : undefined}
                                className={cn(
                                    'flex min-h-[44px] items-center border-s-2 px-4 text-body-sm text-ink hover:bg-navy-50 hover:text-navy',
                                    cur ? 'border-gold font-semibold text-navy' : 'border-transparent',
                                )}
                            >
                                {t(c.labelKey)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function MobileDrawer({ pathname, onClose }: { pathname: string; onClose: () => void }) {
    const t = useTranslations('v2');
    const ref = useRef<HTMLDivElement>(null);
    const titleId = useId();

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        ref.current?.querySelector<HTMLElement>('button, a')?.focus();
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const onKey = (e: ReactKeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
            return;
        }
        if (e.key !== 'Tab' || !ref.current) return;
        // Focus trap
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    return (
        <div className="fixed inset-0 z-drawer xl:hidden" onKeyDown={onKey}>
            <div aria-hidden="true" className="absolute inset-0 bg-navy-950/50" onClick={onClose} />
            <div
                ref={ref}
                id="v2-mobile-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                data-surface="light"
                className="v2-drawer absolute inset-y-0 end-0 flex w-full max-w-sm flex-col bg-white text-fg shadow-raised"
            >
                <div className="flex h-16 items-center justify-between border-b border-line px-4">
                    <p id={titleId} className="text-heading-sm text-navy">
                        {t('nav.menu')}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('nav.close_menu')}
                        className="flex h-11 w-11 items-center justify-center rounded-control hover:bg-tint"
                    >
                        <CloseIcon size={24} />
                    </button>
                </div>
                <nav aria-label={t('nav.main_label')} className="flex-1 overflow-y-auto px-4 py-4">
                    <ul className="space-y-6">
                        <li>
                            <DrawerLink href={routes.home} label={t('nav.home')} pathname={pathname} />
                        </li>
                        {mainNav.map((g) => (
                            <li key={g.labelKey}>
                                {g.children ? (
                                    <>
                                        <p className="mb-1 px-3 text-overline uppercase text-ink-subtle">{t(`nav.${g.labelKey}`)}</p>
                                        <ul>
                                            {g.children.map((c) => (
                                                <li key={c.href}>
                                                    <DrawerLink href={c.href} label={t(`nav.${c.labelKey}`)} pathname={pathname} />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <DrawerLink href={g.href!} label={t(`nav.${g.labelKey}`)} pathname={pathname} />
                                )}
                            </li>
                        ))}
                        <li>
                            <DrawerLink href={routes.contact} label={t('nav.contact')} pathname={pathname} />
                        </li>
                    </ul>
                </nav>
                <div className="space-y-4 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <LanguageSwitch menuUp />
                    <Button href={routes.rfq} fullWidth size="lg" dataAttrs={{ 'data-cta': 'drawer_rfq' }}>
                        {t('cta.request_quote')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DrawerLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
    const cur = isActivePath(pathname, href);
    return (
        <Link
            href={href}
            aria-current={cur ? 'page' : undefined}
            className={cn(
                'flex min-h-[48px] items-center rounded-control border-s-2 px-3 text-body font-medium',
                cur ? 'border-gold bg-navy-50 text-navy' : 'border-transparent text-ink hover:bg-navy-50',
            )}
        >
            {label}
        </Link>
    );
}
