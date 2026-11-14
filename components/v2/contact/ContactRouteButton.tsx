'use client';

/**
 * Route button on /contact whose link keeps the page's ?product= / ?country=
 * (read in the browser so /contact stays statically rendered). Must sit inside
 * <Suspense>; the fallback is the same button without the query.
 */
import { Button, type ButtonProps } from '@/components/ui/Button';
import { useRfqQuery } from '@/components/v2/rfq/useRfqQuery';
import { contactRouteHref, type ContactRoute } from './routeHref';

export default function ContactRouteButton({ route, ...props }: Omit<ButtonProps, 'href'> & { route: ContactRoute }) {
    const { product, country } = useRfqQuery();
    return <Button {...props} href={contactRouteHref(route, product, country)} />;
}
