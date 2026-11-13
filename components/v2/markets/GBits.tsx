import type { CSSProperties, ReactNode } from 'react';
import { Link } from '@/navigation';
import { ArrowIcon } from '@/components/v2/icons';

/**
 * Small design-G building blocks for the markets and importer pages
 * (same tokens as components/g/home/*: navy #002d72, ink #0d1f3f, muted #4a5a75,
 * rule #e3e8f0 / #d5dde9, gold #f7b500, Manrope + IBM Plex Sans Arabic).
 */

const G_STACK = 'var(--font-manrope), var(--font-plex-arabic), system-ui, sans-serif';

/**
 * Page wrapper: white G surface and the G type stack. The v2 kit reads its fonts
 * from --v2-font-body / --v2-font-display, so those are pointed at the G stack here.
 */
export function GPageScope({ children }: { children: ReactNode }) {
    return (
        <div className="g-scope g-font" style={{ '--v2-font-body': G_STACK, '--v2-font-display': G_STACK } as CSSProperties}>
            {children}
        </div>
    );
}

/** Stats strip as under the G home hero: big navy numbers, muted labels, 2x2 on phone, one row from lg. */
export function GStats({ items, ar = false, label }: { items: { value: string; label: string }[]; ar?: boolean; label?: string }) {
    return (
        <section aria-label={label} className="bg-white text-[#0d1f3f]">
            <div className="mx-auto box-border max-w-[1320px] lg:px-8">
                <dl className="m-0 grid grid-cols-2 border-0 border-b border-solid border-[#e3e8f0] px-5 lg:grid-cols-4 lg:px-0">
                    {items.map((s, k) => {
                        const cell = [
                            k < 2 ? 'pt-[26px] pb-[22px] border-0 border-b border-solid border-[#e3e8f0]' : 'pt-[22px] pb-[26px]',
                            k % 2 === 0 ? 'pe-3' : 'ps-4 border-0 border-s border-solid border-[#e3e8f0]',
                            'lg:border-0 lg:py-9 lg:ps-0',
                            k === items.length - 1 ? 'lg:pe-0' : 'lg:pe-6',
                        ].join(' ');
                        return (
                            <div key={s.label} className={`flex flex-col-reverse ${cell}`}>
                                <dt
                                    className={`font-semibold text-[#4a5a75] ${
                                        ar ? 'mt-2 text-[15px] leading-[1.6] lg:mt-2.5 lg:text-[17px]' : 'mt-1.5 text-[14px] lg:mt-2 lg:text-[16px]'
                                    }`}
                                >
                                    {s.label}
                                </dt>
                                <dd className={`m-0 text-[40px] font-extrabold leading-none text-[#002d72] lg:text-[52px] ${ar ? '' : 'tracking-[-0.02em]'}`}>
                                    {s.value}
                                </dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
        </section>
    );
}

/** Optional link under a fact value: external (new tab) or an internal route (locale-prefixed). */
export interface GFactLink {
    href: string;
    label: string;
    external?: boolean;
    /** Screen-reader suffix for external links, e.g. "(opens in a new tab)" */
    newTabLabel?: string;
}

const factLinkClass =
    'mt-2 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[#002d72] underline decoration-[#f7b500] decoration-2 underline-offset-[6px] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

/** Fact cards with the gold top rule of the G quality cards. */
export function GFactCards({
    items,
    ar = false,
    className = '',
}: {
    items: { label: string; value: string; link?: GFactLink }[];
    ar?: boolean;
    className?: string;
}) {
    return (
        <dl className={`m-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 ${className}`}>
            {items.map((f) => (
                <div key={f.label} className="rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-white px-5 pb-5 pt-[18px] text-start">
                    <dt className={`text-[#4a5a75] ${ar ? 'text-[15px]' : 'text-[14px]'}`}>{f.label}</dt>
                    <dd className={`m-0 mt-1 font-extrabold text-[#002d72] ${ar ? 'text-[20px] leading-[1.5]' : 'text-[20px] leading-[1.3]'}`}>{f.value}</dd>
                    {f.link ? (
                        <dd className="m-0">
                            {f.link.external ? (
                                <a href={f.link.href} target="_blank" rel="noopener noreferrer" className={factLinkClass}>
                                    {f.link.label}
                                    <ArrowIcon size={16} />
                                    {f.link.newTabLabel ? <span className="sr-only">{f.link.newTabLabel}</span> : null}
                                </a>
                            ) : (
                                <Link href={f.link.href} className={factLinkClass}>
                                    {f.link.label}
                                    <ArrowIcon size={16} />
                                </Link>
                            )}
                        </dd>
                    ) : null}
                </div>
            ))}
        </dl>
    );
}
