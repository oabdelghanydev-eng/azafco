'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Gentle reveal for page sections: fade up 12px once, ~450ms.
 * Mounted once in the shell. Content is visible without JS: only sections that
 * are below the fold when this effect runs get `v2-reveal-pending` (hidden),
 * removed again as they scroll into view. Disabled under
 * prefers-reduced-motion. Targets `[data-reveal]` (set by <Section> and the
 * CTA bands; never the hero, header or footer).
 */
export default function RevealSections() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Only sections still below the fold are hidden (class added here, after
        // hydration); everything else, and every section without JS, stays visible.
        const vh = window.innerHeight;
        const els = Array.from(document.querySelectorAll<HTMLElement>('main [data-reveal]:not(.is-revealed)')).filter(
            (el) => el.getBoundingClientRect().top > vh * 0.92,
        );
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-revealed');
                        e.target.classList.remove('v2-reveal-pending');
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
        );
        els.forEach((el) => {
            el.classList.add('v2-reveal-pending');
            io.observe(el);
        });
        return () => {
            io.disconnect();
            // Never leave anything hidden behind (route change / unmount)
            els.forEach((el) => el.classList.remove('v2-reveal-pending'));
        };
    }, [pathname]);

    return null;
}
