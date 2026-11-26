import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import RfqRequestPanel from '@/components/v2/rfq/RfqRequestPanel';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { pageMetadata, breadcrumbJsonLd } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { PageHead, Section, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';

// No searchParams here: the page is statically rendered (metadata in <head>).
// The query (?product, ?country, ?form, ?grade) is read in the browser by the
// requirements panel (RfqRequestPanel fromQuery).
type Props = {
    params: Promise<{ locale: string }>;
};

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

    return (
        <div className={typography.body}>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.rfq }])} />

            <PageHead crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={t('hero.title')} titleId="rfq-title" intro={t('hero.intro')} />

            <Section variant="white" as="div">
                <div className="flex max-w-[760px] flex-col gap-8">
                    <RfqRequestPanel fromQuery />
                    <RfqAside />
                </div>
            </Section>
        </div>
    );
}
