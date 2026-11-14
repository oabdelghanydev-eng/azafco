/**
 * Contact page enquiry routes: fish supply, documents, corporate.
 * No web form (owner decision, 7 Nov 2026): each route opens the matching
 * /requirements variant, which prepares the email / WhatsApp message for the
 * buyer to send from their own company address or number.
 *
 * The page's ?product= / ?country= are carried into the seafood and documents
 * routes in the browser (ContactRouteButton, useSearchParams in <Suspense>), so
 * /contact is statically rendered; the static HTML links to the bare routes.
 */
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/Layout';
import { cn, typography } from '@/components/ui/tokens';
import ContactRouteButton from './ContactRouteButton';
import { contactRouteHref, type ContactRoute } from './routeHref';

export type { ContactRoute } from './routeHref';

export default function ContactRoutes() {
    const t = useTranslations('contact_v2.routes');
    const list: { key: ContactRoute }[] = [{ key: 'seafood' }, { key: 'documents' }, { key: 'corporate' }];

    return (
        <>
            <SectionHeading id="contact-routes-title" layout="split" eyebrow={t('eyebrow')} title={t('legend')} intro={t('intro')} />
            {/* Three columns only from xl: at 1024 a third of the row is too narrow for the action labels
                (they wrapped inside the pill), so lg shows full-width rows with the action beside the text.
                At xl each card is a subgrid over four shared rows (number, title, text, action), so a title
                that wraps to two lines in one card keeps the texts and actions of all three aligned. */}
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:gap-5 xl:grid-cols-3 xl:grid-rows-[auto_auto_1fr_auto]">
                {list.map(({ key }, i) => {
                    const button = {
                        variant: key === 'seafood' ? ('primary' as const) : ('outline' as const),
                        arrow: true,
                        className: 'mt-6 w-full sm:w-auto sm:self-start lg:mt-0 lg:shrink-0 lg:self-center xl:mt-6 xl:w-full xl:self-stretch',
                        dataAttrs: { 'data-cta': `contact_route_${key}` } as Record<`data-${string}`, string>,
                        children: t(`${key}_action`),
                    };
                    return (
                        <li
                            key={key}
                            className={cardClass({
                                accent: key === 'seafood',
                                padding: 'md',
                                className:
                                    'flex min-w-0 flex-col lg:flex-row lg:items-center lg:gap-10 xl:row-span-4 xl:grid xl:grid-rows-[subgrid] xl:items-stretch xl:gap-0',
                            })}
                        >
                            <div className="flex min-w-0 flex-1 flex-col xl:contents">
                                <span aria-hidden="true" className={cn('text-ink-muted', typography.overline)}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className={cn('m-0 mt-2 text-ink', typography.h3)}>{t(`${key}_title`)}</h3>
                                <p className={cn('mb-0 mt-2 max-w-[640px] flex-1 text-ink-muted', typography.small)}>{t(`${key}_text`)}</p>
                            </div>
                            {key === 'corporate' ? (
                                <Button {...button} href={contactRouteHref(key)} />
                            ) : (
                                <Suspense fallback={<Button {...button} href={contactRouteHref(key)} />}>
                                    <ContactRouteButton {...button} route={key} />
                                </Suspense>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
