/**
 * /requirements link for each /contact enquiry route, carrying ?product= /
 * ?country= from the contact page's own query. Pure: used by the server
 * (static fallback) and by ContactRouteButton in the browser.
 */
import { rfqHref } from '@/lib/v2/routes';

export type ContactRoute = 'seafood' | 'documents' | 'corporate';

export function contactRouteHref(route: ContactRoute, product?: string, country?: string): string {
    if (route === 'corporate') return rfqHref({ type: 'corporate' });
    if (route === 'documents') return rfqHref({ type: 'documents', product, country });
    return rfqHref({ product, country, type: product ? 'product' : country ? 'market' : undefined });
}
