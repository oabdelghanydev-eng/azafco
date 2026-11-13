import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { rfqHref, routes } from '@/lib/v2/routes';
import { cn } from '@/lib/v2/cn';
import { FOCUS_LIGHT, GArrow, GLinkButton, GPageHead, gBody, gCard, gH3, gSmall, gWrap } from '@/components/v2/contact/g';

/**
 * Localised 404 in design G: no dead end, routes back to the fish, the
 * requirements page, markets and contact. Server component; Next serves it
 * with a 404 status + noindex.
 */
export default function NotFound() {
    const t = useTranslations('not_found');
    const ar = useLocale() === 'ar';
    const links = t.raw('links') as { title: string; text: string }[];
    const hrefs = [routes.products, rfqHref(), routes.markets, routes.contact];

    return (
        <div className={cn('g-font bg-white text-[#0d1f3f]', gBody(ar))}>
            <GPageHead ar={ar} eyebrow={t('eyebrow')} title={t('title')} titleId="nf-title" intro={t('intro')}>
                <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                    <GLinkButton href={routes.home} ar={ar} variant="gold" arrow dark>
                        {t('home')}
                    </GLinkButton>
                    <GLinkButton href={routes.contact} ar={ar} variant="outline-light">
                        {links[3]?.title}
                    </GLinkButton>
                </div>
            </GPageHead>

            <section aria-labelledby="nf-links" className={cn(gWrap, 'py-16 lg:py-24')}>
                <h2 id="nf-links" className={cn(gH3(ar), 'text-[#0d1f3f]')}>
                    {t('links_title')}
                </h2>
                <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {links.map((l, i) => (
                        <li key={l.title} className="min-w-0">
                            <Link
                                href={hrefs[i]}
                                className={cn(gCard(i === 1), 'group flex h-full flex-col p-6 transition-colors hover:border-[#002d72]', FOCUS_LIGHT)}
                            >
                                <span className={cn(gH3(ar), 'block text-[#0d1f3f]')}>{l.title}</span>
                                <span className={cn('mb-5 mt-2 block flex-1 text-[#4a5a75]', gSmall(ar))}>{l.text}</span>
                                <span
                                    aria-hidden="true"
                                    className="grid h-11 w-11 place-items-center rounded-full border border-[#d5dde9] text-[#002d72] transition-colors group-hover:border-[#f7b500] group-hover:bg-[#f7b500] group-hover:text-[#001b47]"
                                >
                                    <GArrow ar={ar} />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
