import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { Container, PageHead, cardClass, cn, focusRing, typography } from '@/components/ui';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { routes } from '@/lib/v2/routes';

type Props = {
    params: Promise<{ locale: string }>;
};

/** Date of the last content change of this policy (update it with every change of privacy.json). */
const LAST_UPDATED = '2026-11-14';

const SECTIONS = ['who', 'contact', 'analytics', 'hosting', 'maps', 'cookies', 'sharing', 'rights', 'changes'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'privacy.meta' });
    // Legal page: kept out of the index, links still followed
    return pageMetadata({ locale, path: routes.privacy, title: t('title'), description: t('description'), noindex: true });
}

export default async function PrivacyPolicyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'privacy' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const format = await getFormatter({ locale });
    const date = format.dateTime(new Date(`${LAST_UPDATED}T00:00:00Z`), { dateStyle: 'long', timeZone: 'UTC' });
    const email = companyConfig.contact.email;

    const mail = (chunks: ReactNode) => (
        <a href={`mailto:${email}`} dir="ltr" className={cn('font-bold text-link underline underline-offset-4 hover:decoration-2', focusRing)}>
            {chunks}
        </a>
    );
    const analytics = t.raw('sections.analytics.items') as { name: string; text: string }[];
    const contactItems = t.raw('sections.contact.items') as string[];

    const h2 = cn('m-0 scroll-mt-28 text-ink', typography.h2Sm);
    const p = cn('mb-0 mt-3 text-ink-muted', typography.body);

    return (
        <>
            <PageHead crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('eyebrow')} title={t('title')} titleId="privacy-title" intro={t('intro')}>
                <p className={cn('mb-0 mt-5 text-fg-muted', typography.small)}>
                    <time dateTime={LAST_UPDATED}>{t('last_updated', { date })}</time>
                </p>
            </PageHead>

            <Container className="py-section-sm md:py-20 lg:py-24">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-20">
                    {/* On-page navigation */}
                    <nav aria-labelledby="privacy-toc" className="min-w-0">
                        <div className={cn(cardClass({ padding: 'sm' }), 'lg:sticky lg:top-28 lg:p-6')}>
                            <h2 id="privacy-toc" className={cn('m-0 text-ink', typography.h3)}>
                                {t('toc')}
                            </h2>
                            <ol className="m-0 mt-3 list-none p-0">
                                {SECTIONS.map((id, i) => (
                                    <li key={id}>
                                        <a
                                            href={`#${id}`}
                                            className={cn('flex min-h-tap items-center gap-3 text-ink hover:text-navy hover:underline', typography.small, focusRing)}
                                        >
                                            <span aria-hidden="true" dir="ltr" className="w-6 shrink-0 font-bold text-navy">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            {t(`sections.${id}.title`)}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </nav>

                    <div className="min-w-0 max-w-[760px]">
                        {SECTIONS.map((id) => (
                            <section
                                key={id}
                                id={id}
                                aria-labelledby={`${id}-title`}
                                className="scroll-mt-28 border-t border-solid border-line py-8 first:border-t-4 first:border-t-gold first:pt-7"
                            >
                                <h2 id={`${id}-title`} className={h2}>
                                    {t(`sections.${id}.title`)}
                                </h2>
                                {id === 'who' ? (
                                    <p className={p}>
                                        {t('sections.who.text', {
                                            legalName: tc('fullName'),
                                            register: companyConfig.registration.commercialRegister,
                                            address: tc('addresses.main.address'),
                                        })}
                                    </p>
                                ) : id === 'rights' ? (
                                    <p className={p}>{t.rich('sections.rights.text', { email, mail })}</p>
                                ) : (
                                    <p className={p}>{t(`sections.${id}.text`)}</p>
                                )}

                                {id === 'contact' ? (
                                    <ul className={cn('m-0 mt-4 list-none space-y-3 p-0 text-ink-muted', typography.body)}>
                                        {contactItems.map((item) => (
                                            <li key={item} className="flex gap-3">
                                                <span aria-hidden="true" className="mt-[0.8em] h-0.5 w-4 shrink-0 bg-gold" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}

                                {id === 'analytics' ? (
                                    <>
                                        <dl className="m-0 mt-5 grid gap-3">
                                            {analytics.map((a) => (
                                                <div key={a.name} className="rounded-card bg-surface-offwhite p-5">
                                                    <dt dir="ltr" className="text-start font-bold text-ink rtl:text-right">
                                                        {a.name}
                                                    </dt>
                                                    <dd className={cn('m-0 mt-1 text-ink-muted', typography.small)}>{a.text}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <p className={cn('mb-0 mt-3 text-ink-muted', typography.small)}>{t('sections.analytics.note')}</p>
                                    </>
                                ) : null}
                            </section>
                        ))}

                        {/* Closing: one accent card, same as the other pages' closings */}
                        <section aria-labelledby="privacy-contact" className={cardClass({ accent: true, padding: 'md', className: 'mt-4' })}>
                            <h2 id="privacy-contact" className={cn('m-0 text-fg', typography.h3)}>
                                {t('contact_title')}
                            </h2>
                            <p className={cn('mb-0 mt-2 text-fg-muted', typography.body)}>{t.rich('contact_text', { email, mail })}</p>
                        </section>
                    </div>
                </div>
            </Container>
        </>
    );
}
