'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import { WhatsAppIcon } from './icons';

/** Routes that already list WhatsApp as a route, so the float would be redundant */
const HIDE_ON: string[] = [routes.rfq, routes.contact];

/**
 * Small round WhatsApp button (the only fixed layer; no quote bar, no pulse,
 * no popup). Bottom end corner (left in RTL), above the iOS home indicator via
 * env(safe-area-inset-bottom). 52px on mobile, 48px from md up.
 * The file keeps its old name to avoid churn in app/[locale]/layout.tsx.
 */
export default function MobileQuoteBar() {
    const t = useTranslations('v2');
    const pathname = usePathname();
    const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (hidden) return null;
    const label = t('whatsapp_float.label');

    return (
        <a
            href={companyConfig.contact.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} ${t('cta.opens_new_tab')}`}
            title={label}
            data-cta="float_whatsapp"
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-4 z-bar flex h-[52px] w-[52px] items-center justify-center rounded-full bg-navy text-white shadow-raised transition-colors duration-base hover:bg-navy-800 motion-reduce:transition-none md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:end-6 md:h-12 md:w-12"
        >
            <WhatsAppIcon size={24} />
        </a>
    );
}
