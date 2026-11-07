import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button, CheckIcon, Container, Eyebrow, GeoArcs } from '@/components/v2';
import RfqSummaryView from '@/components/v2/rfq/RfqSummaryView';
import { RFQ_REF_RE } from '@/components/v2/rfq/schema';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { routes } from '@/lib/v2/routes';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'rfq_v2.thanks' });
    return pageMetadata({ locale, path: routes.rfqThankYou, title: t('meta_title'), description: t('meta_description'), noindex: true });
}

export default async function RfqThankYouPage({ params, searchParams }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const sp = await searchParams;
    const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
    const refRaw = one(sp.ref);
    const ref = refRaw && RFQ_REF_RE.test(refRaw) ? refRaw : undefined;
    const type = one(sp.type);

    const t = await getTranslations({ locale, namespace: 'rfq_v2.thanks' });
    const title = type === 'corporate' ? t('title_corporate') : type === 'documents' ? t('title_documents') : t('title');
    const steps = t.raw('next_steps') as string[];

    return (
        <section data-surface="light" aria-labelledby="thanks-title" className="relative overflow-hidden bg-surface-offwhite py-16 text-fg md:py-24">
            <GeoArcs className="absolute -end-48 -top-48 hidden w-[560px] opacity-60 lg:block" />
            <Container narrow>
                <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold">
                    <CheckIcon size={28} />
                </span>
                <Eyebrow className="mt-8">{t('eyebrow')}</Eyebrow>
                <h1 id="thanks-title" className="v2-heading mt-4 font-display text-display-lg" tabIndex={-1}>
                    {title}
                </h1>
                <p className="mt-4 max-w-prose-v2 text-body-lg text-fg-muted">{t('intro')}</p>

                {ref ? (
                    <div className="mt-8 inline-flex flex-col rounded-card border border-line bg-white px-6 py-4">
                        <span className="text-caption text-ink-muted">{t('ref_label')}</span>
                        <span dir="ltr" className="font-display text-heading-lg tracking-wide text-navy">
                            {ref}
                        </span>
                        <span className="mt-1 text-caption text-ink-muted">{t('ref_hint')}</span>
                    </div>
                ) : null}

                <RfqSummaryView />

                <section aria-labelledby="thanks-next" className="mt-10">
                    <h2 id="thanks-next" className="font-display text-heading-md text-navy">
                        {t('next_title')}
                    </h2>
                    <ol className="mt-4 space-y-3">
                        {steps.map((s, i) => (
                            <li key={s} className="flex gap-4">
                                <span aria-hidden="true" className="font-display text-heading-sm text-gold-ink">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-body text-ink-muted">{s}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-4 border-s-2 border-gold ps-4 text-caption text-ink-muted">{t('no_promise')}</p>
                </section>

                <section aria-labelledby="thanks-continue" className="mt-10">
                    <h2 id="thanks-continue" className="font-display text-heading-sm text-navy">
                        {t('continue_title')}
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button href={routes.products} variant="secondary" arrow>
                            {t('browse_products')}
                        </Button>
                        <Button href={routes.insights} variant="outline">
                            {t('read_guides')}
                        </Button>
                        <Button href={routes.home} variant="ghost">
                            {t('back_home')}
                        </Button>
                    </div>
                </section>
            </Container>
        </section>
    );
}
