import type { ReactNode } from 'react';
import Breadcrumbs, { type Crumb } from '@/components/v2/Breadcrumbs';
import { Eyebrow } from './Layout';
import { cn, containerClass, typography as type } from './tokens';

/**
 * Inner-page opening without a photo: navy band (#001B47, like the G footer and
 * markets section), breadcrumbs, gold-rule eyebrow, white h1 one step under the
 * home hero, optional intro and an actions/meta slot. For a page with a real
 * photo use <PageHero> (components/v2/PageHero). One h1 per page: it lives here.
 */
export interface PageHeadProps {
    /** Breadcrumb items after Home */
    crumbs?: Crumb[];
    eyebrow: ReactNode;
    title: ReactNode;
    titleId: string;
    intro?: ReactNode;
    /** Extra content under the intro (buttons, meta) */
    children?: ReactNode;
    /** Less space under the head, for a page whose first section continues on the same navy */
    compact?: boolean;
    className?: string;
}

export function PageHead({ crumbs, eyebrow, title, titleId, intro, children, compact, className }: PageHeadProps) {
    return (
        <section
            data-page-hero=""
            data-surface="dark"
            aria-labelledby={titleId}
            className={cn('g-font relative overflow-hidden bg-navy-900 text-white', className)}
        >
            <span aria-hidden="true" className="pointer-events-none absolute -end-40 -top-40 hidden h-[520px] w-[520px] rounded-full border border-solid border-white/[.08] lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -end-20 -top-20 hidden h-[360px] w-[360px] rounded-full border border-solid border-gold/20 lg:block" />
            <div className={cn(containerClass, 'relative', compact ? 'pb-7 pt-6 lg:pb-9 lg:pt-8' : 'pb-14 pt-8 lg:pb-24 lg:pt-12')}>
                {crumbs ? <Breadcrumbs items={crumbs} /> : null}
                <Eyebrow className={compact ? 'mt-6 lg:mt-8' : 'mt-10 lg:mt-14'}>{eyebrow}</Eyebrow>
                {/* compact: from lg the intro sits beside the title, so the first section starts higher */}
                <div className={compact ? 'lg:flex lg:items-end lg:justify-between lg:gap-12' : undefined}>
                    <h1 id={titleId} className={cn('mb-0 mt-3 text-white lg:mt-4', compact ? 'max-w-[780px]' : 'max-w-[900px]', type.h1)}>
                        {title}
                    </h1>
                    {intro ? (
                        <p className={cn('mb-0 mt-4 text-body-lg text-fg-muted', compact ? 'max-w-[680px] lg:mt-0 lg:max-w-[440px] lg:pb-2' : 'max-w-[680px] lg:mt-6')}>
                            {intro}
                        </p>
                    ) : null}
                </div>
                {children}
            </div>
        </section>
    );
}

export default PageHead;
