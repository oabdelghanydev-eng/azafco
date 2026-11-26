import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import { routes } from '@/lib/v2/routes';
import { ChevronEndIcon } from '@/components/ui/icons';
import { focusRing } from '@/components/ui/tokens';

export interface Crumb {
    label: string;
    /** Locale-less href; omit for the current page (last item) */
    href?: string;
}

export interface BreadcrumbsProps {
    /** Items AFTER Home (Home is prepended automatically unless `includeHome={false}`) */
    items: Crumb[];
    includeHome?: boolean;
    /** aria-label of the <nav> (default v2.breadcrumbs.label) */
    label?: string;
    className?: string;
}

/**
 * Accessible breadcrumb trail (design-system primitive, re-exported by components/ui). Separators point to the reading direction.
 * Colours follow the surface (works on light and inside navy heroes).
 * Pair with BreadcrumbList JSON-LD from components/StructuredData if needed.
 *
 *   <Breadcrumbs items={[{ label: t('nav.products'), href: routes.products }, { label: 'Tilapia' }]} />
 */
export default function Breadcrumbs({ items, includeHome = true, label, className }: BreadcrumbsProps) {
    const t = useTranslations('v2.breadcrumbs');
    const all: Crumb[] = includeHome ? [{ label: t('home'), href: routes.home }, ...items] : items;
    return (
        <nav aria-label={label ?? t('label')} className={cn('text-caption', className)}>
            <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-fg-muted">
                {all.map((c, i) => {
                    const last = i === all.length - 1;
                    return (
                        <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                            {c.href && !last ? (
                                <Link href={c.href} className={cn('inline-flex min-h-tap items-center underline-offset-4 transition-colors hover:text-link-hover hover:underline', focusRing)}>
                                    {c.label}
                                </Link>
                            ) : (
                                <span aria-current={last ? 'page' : undefined} className={cn(last && 'font-semibold text-fg')}>
                                    {c.label}
                                </span>
                            )}
                            {!last ? <ChevronEndIcon size={16} className="text-gold" /> : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
