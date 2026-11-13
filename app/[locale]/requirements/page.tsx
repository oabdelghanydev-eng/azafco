import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import RfqRequestPanel from '@/components/v2/rfq/RfqRequestPanel';
import RfqAside from '@/components/v2/rfq/RfqAside';
import { isShortTopic, resolveRfqParams } from '@/components/v2/rfq/options';
import { pageMetadata, breadcrumbJsonLd } from '@/components/v2/rfq/pageMetadata';
import JsonLd from '@/components/v2/rfq/JsonLd';
import { GPageHead, gBody, gSectionY, gSmall, gWrap } from '@/components/v2/contact/g';
import { cn } from '@/lib/v2/cn';
import { Link } from '@/navigation';
import { rfqHref, routes } from '@/lib/v2/routes';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'rfq_v2.meta' });
    // Canonical is always the bare /rfq (prefilled ?product= / ?country= URLs fold into it)
    return pageMetadata({ locale, path: routes.rfq, title: t('title'), description: t('description') });
}

/**
 * /rfq: "Send your requirements" page. No web form (owner decision, 7 Nov 2026):
 * the buyer sends the prepared message from their own company email or WhatsApp.
 * The route name stays /rfq; the visible wording never says "quote" or "RFQ".
 */
export default async function RfqPage({ params, searchParams }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const ar = locale === 'ar';
    const { topic, product, country, form, grade } = resolveRfqParams(await searchParams);
    const short = isShortTopic(topic);

    const t = await getTranslations({ locale, namespace: 'rfq_v2' });
    const tv = await getTranslations({ locale, namespace: 'v2' });

    const title = short ? t(`short_hero.${topic}_title`) : t('hero.title');
    const intro = short ? t(`short_hero.${topic}_intro`) : t('hero.intro');

    return (
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <JsonLd data={breadcrumbJsonLd(locale, tv('breadcrumbs.home'), [{ name: t('breadcrumb'), path: routes.rfq }])} />

            <GPageHead ar={ar} crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('hero.eyebrow')} title={title} titleId="rfq-title" intro={intro}>
                <p className={cn('mb-0 mt-5 text-white/[.78]', gSmall(ar))}>
                    {t.rich(short ? 'switch.to_seafood' : 'switch.to_corporate', {
                        link: (chunks) => (
                            <Link
                                href={short ? rfqHref() : rfqHref({ type: 'corporate' })}
                                className="inline-flex min-h-[44px] items-center font-bold text-white underline decoration-[#f7b500] decoration-2 underline-offset-4 hover:text-[#f7b500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]"
                            >
                                {chunks}
                            </Link>
                        ),
                    })}
                </p>
            </GPageHead>

            <section aria-labelledby="rfq-send-title" className={cn(gWrap, gSectionY)}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
                    <div className="min-w-0 lg:order-2">
                        <RfqRequestPanel topic={topic} product={product} country={country} form={form} grade={grade} />
                    </div>
                    <RfqAside short={short} className="min-w-0 lg:order-1" />
                </div>
            </section>
        </div>
    );
}
