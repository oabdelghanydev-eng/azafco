import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { rfqHref, routes } from '@/lib/v2/routes';
import { ArrowIcon, Button, PageHead, Section, cardClass, cn, focusRing, typography } from '@/components/ui';

/**
 * Own metadata for the 404 (it would otherwise inherit the layout's home canonical
 * and hreflang): title "Page not found", noindex, no canonical, no alternates.
 * `alternates: {}` replaces the layout's alternates object as a whole.
 */
export async function generateMetadata({ params }: { params?: Promise<{ locale?: string }> }): Promise<Metadata> {
    const locale = (await params)?.locale ?? (await getLocale());
    const local = await getTranslations({ locale, namespace: 'not_found' });
    // es/ru/de/fr fall back to English until not_found.meta is translated
    const t = local.has('meta.title') ? local : await getTranslations({ locale: 'en', namespace: 'not_found' });
    return {
        title: t('meta.title'),
        description: local('intro'),
        robots: { index: false, follow: true },
        alternates: {},
    };
}

/**
 * Localised 404 in design G (components/ui primitives): no dead end, routes back
 * to the fish, the requirements page, markets and contact. Server component;
 * Next serves it with a 404 status + noindex.
 */
export default function NotFound() {
    const t = useTranslations('not_found');
    const links = t.raw('links') as { title: string; text: string }[];
    const hrefs = [routes.products, rfqHref(), routes.markets, routes.contact];

    return (
        <>
            <PageHead eyebrow={t('eyebrow')} title={t('title')} titleId="nf-title" intro={t('intro')}>
                <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    <Button href={routes.home} size="lg" stretch="phone" arrow>
                        {t('home')}
                    </Button>
                    <Button href={routes.contact} variant="outline" size="lg" stretch="phone">
                        {links[3]?.title}
                    </Button>
                </div>
            </PageHead>

            <Section variant="white" labelledBy="nf-links">
                <h2 id="nf-links" className={cn('m-0 text-ink', typography.h3)}>
                    {t('links_title')}
                </h2>
                <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {links.map((l, i) => (
                        <li key={l.title} className="min-w-0">
                            <Link
                                href={hrefs[i]}
                                className={cn(cardClass({ accent: i === 1, interactive: true, padding: 'sm' }), 'group flex h-full flex-col lg:p-6', focusRing)}
                            >
                                <span className={cn('block text-ink', typography.h3)}>{l.title}</span>
                                <span className={cn('mb-5 mt-2 block flex-1 text-ink-muted', typography.small)}>{l.text}</span>
                                <span
                                    aria-hidden="true"
                                    className="grid h-tap w-tap place-items-center rounded-full border border-solid border-line text-navy transition-colors duration-base group-hover:border-gold group-hover:bg-gold group-hover:text-navy-900 motion-reduce:transition-none"
                                >
                                    <ArrowIcon size={20} />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>
        </>
    );
}
