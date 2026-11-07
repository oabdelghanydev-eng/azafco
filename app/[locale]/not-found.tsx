import { useTranslations } from 'next-intl';
import { Button, Container, Eyebrow, FeatureGrid, GeoArcs } from '@/components/v2';
import { rfqHref, routes } from '@/lib/v2/routes';

/**
 * Localised 404 (site v2): no dead end, routes back to products, RFQ, markets
 * and contact. Server component; Next serves it with a 404 status + noindex.
 */
export default function NotFound() {
    const t = useTranslations('contact_v2.not_found');
    const tv = useTranslations('v2');
    const links = t.raw('links') as { title: string; text: string }[];
    const hrefs = [routes.products, rfqHref(), routes.markets, routes.contact];

    return (
        <section data-surface="light" aria-labelledby="nf-title" className="relative overflow-hidden bg-surface-offwhite py-16 text-fg md:py-24">
            <GeoArcs className="absolute -end-48 -top-48 hidden w-[560px] opacity-60 lg:block" />
            <Container>
                <Eyebrow>{t('eyebrow')}</Eyebrow>
                <h1 id="nf-title" className="v2-heading mt-4 max-w-3xl font-display text-display-lg">
                    {t('title')}
                </h1>
                <p className="mt-4 max-w-prose-v2 text-body-lg text-fg-muted">{t('intro')}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={routes.products} arrow>
                        {links[0]?.title}
                    </Button>
                    <Button href={routes.home} variant="outline">
                        {t('home')}
                    </Button>
                </div>
                <FeatureGrid
                    className="mt-14"
                    columns={4}
                    style="card"
                    items={links.map((l, i) => ({ title: l.title, description: l.text, href: hrefs[i], linkLabel: tv('cta.learn_more') }))}
                />
            </Container>
        </section>
    );
}
