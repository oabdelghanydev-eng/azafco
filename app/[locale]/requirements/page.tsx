import { Suspense, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import RfqRequestPanel from '@/components/v2/rfq/RfqRequestPanel';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { RfqByTopic } from '@/components/v2/rfq/RfqQuery';
import { pageMetadata, breadcrumbJsonLd } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { PageHead, Section, cn, focusRing, typography } from '@/components/ui';
import { Link } from '@/navigation';
import { rfqHref, routes } from '@/lib/v2/routes';

// No searchParams here: the page is statically rendered (metadata in <head>).
// The query (?type, ?product, ?country, ?form, ?grade) is read in the browser by
// the client parts (RfqByTopic, RfqRequestPanel fromQuery, RfqAside short="query").
type Props = {
    params: Promise<{ locale: string }>;
};

/** Query-dependent text: the static HTML (Suspense fallback) carries the general variant. */
function ByTopic(v: { general: ReactNode; corporate: ReactNode; documents: ReactNode }) {
    return (
        <Suspense fallback={v.general}>
            <RfqByTopic {...v} />
        </Suspense>
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'rfq_v2.meta' });
    // Canonical is always the bare /requirements (prefilled ?product= / ?country= URLs fold into it)
    return pageMetadata({ locale, path: routes.rfq, title: t('title'), description: t('description') });
}

/**
 * /requirements: "Send your requirements" page. No web form (owner decision, 7 Nov 2026):
 * the buyer sends the prepared message from their own company email or WhatsApp.
 * Visible wording never says "quote" or "RFQ" (internal names keep rfq_*).
 */
export default async function RequirementsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'rfq_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });

    const title = <ByTopic general={t('hero.title')} corporate={t('short_hero.corporate_title')} documents={t('short_hero.documents_title')} />;
    const intro = <ByTopic general={t('hero.intro')} corporate={t('short_hero.corporate_intro')} documents={t('short_hero.documents_intro')} />;
    const switchLink = (short: boolean) =>
        t.rich(short ? 'switch.to_seafood' : 'switch.to_corporate', {
            link: (chunks) => (
                <Link
                    href={short ? rfqHref() : rfqHref({ type: 'corporate' })}
                    className={cn(
                        'inline-flex min-h-tap items-center font-semibold text-link underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-link-hover',
                        focusRing,
                    )}
                >
                    {chunks}
                </Link>
            ),
        });
    const toSeafood = switchLink(true);

    return (
        <div className={typography.body}>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.rfq }])} />

            <PageHead crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={title} titleId="rfq-title" intro={intro}>
                <p className={cn('mb-0 mt-5 text-fg-muted', typography.small)}>
                    <ByTopic general={switchLink(false)} corporate={toSeafood} documents={toSeafood} />
                </p>
            </PageHead>

            {/* Plain wrapper: the panel and the aside are their own labelled regions */}
            <Section variant="white" as="div">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
                    <div className="min-w-0 lg:order-2">
                        <RfqRequestPanel fromQuery />
                    </div>
                    <RfqAside short="query" className="min-w-0 lg:order-1" />
                </div>
            </Section>
        </div>
    );
}
