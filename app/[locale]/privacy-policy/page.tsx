import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { companyConfig } from '@/config/company.config';
import { GPageHead, gBody, gH3, gSmall, gWrap } from '@/components/v2/contact/g';
import { pageMetadata } from '@/components/v2/rfq/pageMetadata';
import { cn } from '@/lib/v2/cn';
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
    const ar = locale === 'ar';

    const t = await getTranslations({ locale, namespace: 'privacy' });
    const tc = await getTranslations({ locale, namespace: 'data.company' });
    const format = await getFormatter({ locale });
    const date = format.dateTime(new Date(`${LAST_UPDATED}T00:00:00Z`), { dateStyle: 'long', timeZone: 'UTC' });
    const email = companyConfig.contact.email;

    const mail = (chunks: ReactNode) => (
        <a href={`mailto:${email}`} dir="ltr" className="font-bold text-[#002d72] underline underline-offset-4 hover:no-underline">
            {chunks}
        </a>
    );
    const analytics = t.raw('sections.analytics.items') as { name: string; text: string }[];
    const contactItems = t.raw('sections.contact.items') as string[];

    const h2 = cn(
        'm-0 scroll-mt-28 text-[#0d1f3f]',
        ar ? 'text-[24px] font-bold leading-[1.45] lg:text-[28px]' : 'text-[24px] font-extrabold leading-[1.25] tracking-[-0.01em] lg:text-[28px]',
    );
    const p = 'mb-0 mt-3 text-[#4a5a75]';

    return (
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <GPageHead ar={ar} crumbs={[{ label: t('breadcrumb') }]} eyebrow={t('eyebrow')} title={t('title')} titleId="privacy-title" intro={t('intro')}>
                <p className={cn('mb-0 mt-5 text-white/[.7]', gSmall(ar))}>
                    <time dateTime={LAST_UPDATED}>{t('last_updated', { date })}</time>
                </p>
            </GPageHead>

            <div className={cn(gWrap, 'py-16 lg:py-24')}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-20">
                    {/* On-page navigation */}
                    <nav aria-labelledby="privacy-toc" className="min-w-0">
                        <div className="rounded border border-[#d5dde9] p-5 lg:sticky lg:top-28 lg:p-6">
                            <h2 id="privacy-toc" className={cn(gH3(ar), 'text-[#0d1f3f]')}>
                                {t('toc')}
                            </h2>
                            <ol className="m-0 mt-3 list-none p-0">
                                {SECTIONS.map((id, i) => (
                                    <li key={id}>
                                        <a
                                            href={`#${id}`}
                                            className={cn(
                                                'flex min-h-[44px] items-center gap-3 text-[#0d1f3f] hover:text-[#002d72] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]',
                                                gSmall(ar),
                                            )}
                                        >
                                            <span aria-hidden="true" className="w-6 shrink-0 font-bold text-[#002d72]">
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
                            <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-[#d5dde9] py-8 first:border-t-4 first:border-t-[#f7b500] first:pt-7">
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
                                    <ul className="m-0 mt-4 list-none space-y-3 p-0">
                                        {contactItems.map((item) => (
                                            <li key={item} className="flex gap-3 text-[#4a5a75]">
                                                <span aria-hidden="true" className="mt-[0.8em] h-0.5 w-4 shrink-0 bg-[#f7b500]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}

                                {id === 'analytics' ? (
                                    <>
                                        <dl className="m-0 mt-5 grid gap-3">
                                            {analytics.map((a) => (
                                                <div key={a.name} className="rounded bg-[#f2f5fa] p-5">
                                                    <dt dir="ltr" className="text-start font-bold text-[#0d1f3f] rtl:text-right">
                                                        {a.name}
                                                    </dt>
                                                    <dd className={cn('m-0 mt-1 text-[#4a5a75]', gSmall(ar))}>{a.text}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <p className={cn(p, gSmall(ar))}>{t('sections.analytics.note')}</p>
                                    </>
                                ) : null}
                            </section>
                        ))}

                        <section aria-labelledby="privacy-contact" className="mt-4 rounded bg-[#001b47] p-6 text-white lg:p-8">
                            <h2 id="privacy-contact" className={cn(gH3(ar), 'text-white')}>
                                {t('contact_title')}
                            </h2>
                            <p className="mb-0 mt-2 text-white/[.82]">
                                {t.rich('contact_text', {
                                    email,
                                    mail: (chunks) => (
                                        <a
                                            href={`mailto:${email}`}
                                            dir="ltr"
                                            className="font-bold text-white underline decoration-[#f7b500] decoration-2 underline-offset-4 hover:text-[#f7b500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]"
                                        >
                                            {chunks}
                                        </a>
                                    ),
                                })}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
