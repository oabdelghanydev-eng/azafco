/**
 * Contact page enquiry routes: seafood quote, documents, corporate.
 * No form (owner decision, 7 Nov 2026): each route opens the matching /rfq
 * variant, which prepares the email / WhatsApp message for the buyer to send
 * from their own company address or number.
 */
import { useTranslations } from 'next-intl';
import Button from '@/components/v2/Button';
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
        <section aria-labelledby="contact-routes-title">
            <h2 id="contact-routes-title" className="font-display text-heading-md text-navy">
                {t('legend')}
            </h2>
            <p className="mt-2 max-w-prose-v2 text-body text-ink-muted">{t('intro')}</p>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {list.map(({ key, href }) => (
                    <li key={key} className="flex flex-col rounded-card border border-line bg-white p-5 shadow-card">
                        <h3 className="font-display text-heading-sm text-ink">{t(`${key}_title`)}</h3>
                        <p className="mt-1 flex-1 text-body-sm text-ink-muted">{t(`${key}_text`)}</p>
                        <Button href={href} variant={key === 'seafood' ? 'primary' : 'outline'} className="mt-4" arrow dataAttrs={{ 'data-cta': `contact_route_${key}` }}>
                            {t(`${key}_action`)}
                        </Button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
