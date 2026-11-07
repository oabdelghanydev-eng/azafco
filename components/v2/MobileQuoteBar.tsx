'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/navigation';
import { companyConfig } from '@/config/company.config';
import { routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import Button from './Button';
import { WhatsAppIcon } from './icons';

/** Routes where the fixed RFQ bar would be redundant */
const HIDE_ON: string[] = [routes.rfq];

/**
 * Quick actions (single fixed layer, no stacked bars):
 * - < md: bottom bar with "Request a Quote" (48px) + WhatsApp (48px square).
 * - md+: a single round WhatsApp button at the bottom end corner
 *   (the header already carries "Request a Quote").
 * Hidden on /rfq. The footer reserves space for the bar
 * (see SiteFooter), so it never covers content at the end of the page.
 */
export default function MobileQuoteBar() {
    const t = useTranslations('v2');
    const pathname = usePathname();
    const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (hidden) return null;
    const wa = companyConfig.contact.social.whatsapp;

    return (
        <>
            <div
                role="region"
                aria-label={t('mobile_bar.label')}
                data-surface="light"
                className="fixed inset-x-0 bottom-0 z-bar border-t border-line bg-white/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
            >
                <div className="flex items-center gap-2">
                    <Button href={routes.rfq} size="md" fullWidth className="min-h-[48px]" dataAttrs={{ 'data-cta': 'mobile_bar_rfq' }}>
                        {t('mobile_bar.request_quote')}
                    </Button>
                    <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t('mobile_bar.whatsapp')} ${t('cta.opens_new_tab')}`}
                        data-cta="mobile_bar_whatsapp"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control border-[1.5px] border-navy text-navy hover:bg-navy-50"
                    >
                        <WhatsAppIcon size={22} />
                    </a>
                </div>
            </div>

            <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('mobile_bar.whatsapp')} ${t('cta.opens_new_tab')}`}
                data-cta="float_whatsapp"
                className={cn(
                    'fixed bottom-6 end-6 z-bar hidden h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-raised md:flex',
                    'transition-colors duration-base hover:bg-navy-800 motion-reduce:transition-none',
                )}
            >
                <WhatsAppIcon size={26} />
            </a>
        </>
    );
}
