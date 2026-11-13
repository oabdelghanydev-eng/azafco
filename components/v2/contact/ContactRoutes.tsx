/**
 * Contact page enquiry routes: fish supply, documents, corporate.
 * No web form (owner decision, 7 Nov 2026): each route opens the matching /rfq
 * variant, which prepares the email / WhatsApp message for the buyer to send
 * from their own company address or number.
 */
import { useLocale, useTranslations } from 'next-intl';
import { rfqHref } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import { GLinkButton, GSectionHead, gCard, gH3, gSmall } from './g';

export type ContactRoute = 'seafood' | 'documents' | 'corporate';

interface Props {
    /** Carried into the seafood route (?product= / ?country=) */
    prefillSpecies?: string;
    prefillCountry?: string;
}

export default function ContactRoutes({ prefillSpecies, prefillCountry }: Props) {
    const t = useTranslations('contact_v2.routes');
    const ar = useLocale() === 'ar';
    const list: { key: ContactRoute; href: string }[] = [
        { key: 'seafood', href: rfqHref({ product: prefillSpecies, country: prefillCountry, type: prefillSpecies ? 'product' : prefillCountry ? 'market' : undefined }) },
        { key: 'documents', href: rfqHref({ type: 'documents', product: prefillSpecies, country: prefillCountry }) },
        { key: 'corporate', href: rfqHref({ type: 'corporate' }) },
    ];

    return (
        <div>
            <GSectionHead ar={ar} id="contact-routes-title" eyebrow={t('eyebrow')} title={t('legend')} intro={t('intro')} />
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 lg:gap-5">
                {list.map(({ key, href }, i) => (
                    <li key={key} className={cn(gCard(key === 'seafood'), 'flex flex-col p-6 lg:p-8')}>
                        <span aria-hidden="true" className="text-[13px] font-bold text-[#4a5a75] lg:text-[14px]">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className={cn(gH3(ar), 'mt-2 text-[#0d1f3f]')}>{t(`${key}_title`)}</h3>
                        <p className={cn('mb-0 mt-2 flex-1 text-[#4a5a75]', gSmall(ar))}>{t(`${key}_text`)}</p>
                        <GLinkButton
                            href={href}
                            ar={ar}
                            variant={key === 'seafood' ? 'gold' : 'outline'}
                            arrow
                            className="mt-6 w-full"
                            dataAttrs={{ 'data-cta': `contact_route_${key}` }}
                        >
                            {t(`${key}_action`)}
                        </GLinkButton>
                    </li>
                ))}
            </ul>
        </div>
    );
}
