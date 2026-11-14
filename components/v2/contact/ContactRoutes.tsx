/**
 * Contact page enquiry routes: fish supply, documents, corporate.
 * No web form (owner decision, 7 Nov 2026): each route opens the matching
 * /requirements variant, which prepares the email / WhatsApp message for the
 * buyer to send from their own company address or number.
 */
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/Layout';
import { cn, typography } from '@/components/ui/tokens';
import { rfqHref } from '@/lib/v2/routes';

export type ContactRoute = 'seafood' | 'documents' | 'corporate';

interface Props {
    /** Carried into the seafood route (?product= / ?country=) */
    prefillSpecies?: string;
    prefillCountry?: string;
}

export default function ContactRoutes({ prefillSpecies, prefillCountry }: Props) {
    const t = useTranslations('contact_v2.routes');
    const list: { key: ContactRoute; href: string }[] = [
        { key: 'seafood', href: rfqHref({ product: prefillSpecies, country: prefillCountry, type: prefillSpecies ? 'product' : prefillCountry ? 'market' : undefined }) },
        { key: 'documents', href: rfqHref({ type: 'documents', product: prefillSpecies, country: prefillCountry }) },
        { key: 'corporate', href: rfqHref({ type: 'corporate' }) },
    ];

    return (
        <>
            <SectionHeading id="contact-routes-title" layout="split" eyebrow={t('eyebrow')} title={t('legend')} intro={t('intro')} />
            {/* Three columns only from xl: at 1024 a third of the row is too narrow for the action labels
                (they wrapped inside the pill), so lg shows full-width rows with the action beside the text. */}
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:gap-5 xl:grid-cols-3">
                {list.map(({ key, href }, i) => (
                    <li
                        key={key}
                        className={cardClass({
                            accent: key === 'seafood',
                            padding: 'md',
                            className: 'flex min-w-0 flex-col lg:flex-row lg:items-center lg:gap-10 xl:flex-col xl:items-stretch xl:gap-0',
                        })}
                    >
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span aria-hidden="true" className={cn('text-ink-muted', typography.overline)}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className={cn('m-0 mt-2 text-ink', typography.h3)}>{t(`${key}_title`)}</h3>
                            <p className={cn('mb-0 mt-2 max-w-[640px] flex-1 text-ink-muted', typography.small)}>{t(`${key}_text`)}</p>
                        </div>
                        <Button
                            href={href}
                            variant={key === 'seafood' ? 'primary' : 'outline'}
                            arrow
                            className="mt-6 w-full sm:w-auto sm:self-start lg:mt-0 lg:shrink-0 lg:self-center xl:mt-6 xl:w-full xl:self-stretch"
                            dataAttrs={{ 'data-cta': `contact_route_${key}` }}
                        >
                            {t(`${key}_action`)}
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    );
}
