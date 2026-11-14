'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/navigation';
import { listsContactChannels } from '@/components/g/nav';
import { WhatsAppIcon } from '@/components/ui/icons';
import { cn } from '@/components/ui/tokens';

/**
 * Find the hero the float must not cover: the G home hero (#top), a kit PageHero
 * ([data-page-hero]) or, for any other page template, the section holding the
 * page's h1 inside <main>.
 */
function findHero(): Element | null {
    return (
        document.getElementById('top') ??
        document.querySelector('[data-page-hero]') ??
        document.querySelector('#main-content h1')?.closest('section, header') ??
        null
    );
}

export interface WhatsAppFloatProps {
    href: string;
    /** Visible tooltip and the start of the accessible name */
    label: string;
    /** Screen-reader new-tab hint, appended to the accessible name */
    newTab: string;
}

/**
 * Interactive part of the floating WhatsApp button (see MobileQuoteBar for the
 * rules). Link and copy come in as props, so no messages or config ship here.
 */
export default function WhatsAppFloat({ href, label, newTab }: WhatsAppFloatProps) {
    const pathname = usePathname();
    const hidden = listsContactChannels(pathname);
    // Hidden until the effect has located the hero (no flash on top of it after hydration)
    const [pastHero, setPastHero] = useState(false);

    useEffect(() => {
        if (hidden) return;
        const hero = findHero();
        // The footer opens with the WhatsApp row and ends with back-to-top in the same
        // corner, so the float also steps aside while the footer is on screen.
        const footer = document.querySelector('footer#contact');
        if (typeof IntersectionObserver === 'undefined') {
            setPastHero(true);
            return;
        }
        const inView = new Map<Element, boolean>();
        const update = () => setPastHero(!Array.from(inView.values()).some(Boolean));
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => inView.set(e.target, e.isIntersecting));
                update();
            },
            { threshold: 0 },
        );
        [hero, footer].forEach((el) => {
            if (!el) return;
            inView.set(el, true);
            io.observe(el);
        });
        update();
        return () => io.disconnect();
    }, [pathname, hidden]);

    if (hidden) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} ${newTab}`}
            title={label}
            data-cta="float_whatsapp"
            aria-hidden={pastHero ? undefined : true}
            tabIndex={pastHero ? undefined : -1}
            className={cn(
                pastHero ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
                'fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-4 z-bar grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-float',
                'transition-[background-color,box-shadow,opacity,visibility] duration-base ease-out hover:bg-whatsapp-hover hover:shadow-raised motion-reduce:transition-none',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-navy',
                'md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:end-6',
            )}
        >
            <WhatsAppIcon size={28} />
        </a>
    );
}
