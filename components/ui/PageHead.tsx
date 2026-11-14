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
    className?: string;
}

export function PageHead({ crumbs, eyebrow, title, titleId, intro, children, className }: PageHeadProps) {
    return (
        <section
            data-page-hero=""
            data-surface="dark"
            aria-labelledby={titleId}
            className={cn('g-font relative overflow-hidden bg-navy-900 text-white', className)}
        >
            <span aria-hidden="true" className="pointer-events-none absolute -end-40 -top-40 hidden h-[520px] w-[520px] rounded-full border border-solid border-white/[.08] lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -end-20 -top-20 hidden h-[360px] w-[360px] rounded-full border border-solid border-gold/20 lg:block" />
            <div className={cn(containerClass, 'relative pb-14 pt-8 lg:pb-24 lg:pt-12')}>
                {crumbs ? <Breadcrumbs items={crumbs} /> : null}
                <Eyebrow className="mt-10 lg:mt-14">{eyebrow}</Eyebrow>
                <h1 id={titleId} className={cn('mb-0 mt-3 max-w-[900px] text-white lg:mt-4', type.h1)}>
                    {title}
                </h1>
                {intro ? <p className="mb-0 mt-4 max-w-[680px] text-body-lg text-fg-muted lg:mt-6">{intro}</p> : null}
                {children}
            </div>
        </section>
    );
}

export default PageHead;
