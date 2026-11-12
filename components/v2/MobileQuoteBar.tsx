'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import { WhatsAppIcon } from './icons';

/** Routes that already list WhatsApp as a route, so the float would be redundant */
const HIDE_ON: string[] = [routes.rfq, routes.contact];

/**
 * Small round WhatsApp button in the G palette (navy #002d72, gold ring, gold on hover) (the only fixed layer; no quote bar, no pulse,
 * no popup). Bottom end corner (left in RTL), above the iOS home indicator via
 * env(safe-area-inset-bottom). 52px on mobile, 48px from md up.
 * On the home page it fades in once the hero (#top) is out of view (no fade with
 * reduced motion). The file keeps its old name to avoid churn in app/[locale]/layout.tsx.
 */
export default function MobileQuoteBar() {
    const t = useTranslations('g_footer_v2');
    const pathname = usePathname();
    const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const home = pathname === '/' || pathname === '';
    // Home: wait until the hero (#top) has left the viewport so the button does not
    // sit on the hero/stats tabs at rest. Other pages: shown from the start.
    const [pastHero, setPastHero] = useState(!home);

    useEffect(() => {
        if (!home) {
            setPastHero(true);
            return;
        }
        const hero = document.getElementById('top');
        if (!hero || typeof IntersectionObserver === 'undefined') {
            setPastHero(true);
            return;
        }
        setPastHero(false);
        const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 });
        io.observe(hero);
        return () => io.disconnect();
    }, [home]);

    if (hidden) return null;
    // The number is the owner's (management direct), not the export team: label says so
    const label = t('float_label');

    return (
        <a
            href={companyConfig.contact.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} ${t('new_tab')}`}
            title={label}
            data-cta="float_whatsapp"
            aria-hidden={pastHero ? undefined : true}
            tabIndex={pastHero ? undefined : -1}
            className={`${pastHero ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'} fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-4 z-bar flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#002d72] text-white shadow-[0_10px_24px_rgba(0,27,71,.28)] ring-2 ring-[#f7b500] transition-[color,background-color,opacity,visibility] duration-base hover:bg-[#f7b500] hover:text-[#001b47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#002d72] motion-reduce:transition-none md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:end-6 md:h-12 md:w-12`}
        >
            <WhatsAppIcon size={24} />
        </a>
    );
}
