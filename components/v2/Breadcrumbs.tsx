import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import { routes } from '@/lib/v2/routes';
import { ChevronEndIcon } from './icons';

export interface Crumb {
    label: string;
    /** Locale-less href; omit for the current page (last item) */
    href?: string;
}

export interface BreadcrumbsProps {
    /** Items AFTER Home (Home is prepended automatically unless `includeHome={false}`) */
    items: Crumb[];
    includeHome?: boolean;
    className?: string;
}

/**
 * Accessible breadcrumb trail. Separators point to the reading direction.
 * Colours follow the surface (works on light and inside navy heroes).
 * Pair with BreadcrumbList JSON-LD from components/StructuredData if needed.
 *
 *   <Breadcrumbs items={[{ label: t('nav.products'), href: routes.products }, { label: 'Tilapia' }]} />
 */
export default function Breadcrumbs({ items, includeHome = true, className }: BreadcrumbsProps) {
    const t = useTranslations('v2.breadcrumbs');
    const all: Crumb[] = includeHome ? [{ label: t('home'), href: routes.home }, ...items] : items;
    return (
        <nav aria-label={t('label')} className={cn('text-caption', className)}>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fg-muted">
                {all.map((c, i) => {
                    const last = i === all.length - 1;
                    return (
                        <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                            {c.href && !last ? (
                                <Link href={c.href} className="underline-offset-4 hover:text-fg hover:underline">
                                    {c.label}
                                </Link>
                            ) : (
                                <span aria-current={last ? 'page' : undefined} className={cn(last && 'text-fg font-medium')}>
                                    {c.label}
                                </span>
                            )}
                            {!last ? <ChevronEndIcon size={14} className="opacity-60" /> : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
