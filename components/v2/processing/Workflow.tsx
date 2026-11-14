import type { ReactNode } from 'react';
import Image from 'next/image';
import { Eyebrow, typography } from '@/components/ui';

export interface WorkflowStage {
    key: string;
    /** Visible stage label, e.g. "Stage 1" (from the locale JSON) */
    label: string;
    title: string;
    text: string;
    image: string;
    imageAlt: string;
    /** Optional content under the stage text (e.g. the plant map link) */
    extra?: ReactNode;
}

export interface WorkflowProps {
    stages: WorkflowStage[];
}

/**
 * The in-house value chain on /processing, in the design G imagery treatment
 * (gold block behind a 3:2 photo, as in the home "Who we are" section).
 * Phone/tablet: photo above text. Desktop: two columns, the photo side alternating.
 * Ordered list, so the stage order is conveyed to screen readers too.
 * Server component; Arabic/Latin type settings come from `lang` via the type tokens.
 */
export default function Workflow({ stages }: WorkflowProps) {
    return (
        <ol className="m-0 grid list-none gap-14 p-0 lg:gap-24">
            {stages.map((s, i) => {
                const flip = i % 2 === 1;
                return (
                    <li
                        key={s.key}
                        className="md:mx-auto md:max-w-[600px] lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-x-16 xl:gap-x-20"
                    >
                        <div className={`relative min-w-0 pb-4 ps-4 lg:pb-7 lg:ps-7 ${flip ? 'lg:order-2' : ''}`}>
                            <span aria-hidden="true" className="absolute bottom-0 start-0 h-[52%] w-[46%] rounded-card bg-gold" />
                            <div className="relative aspect-[3/2] overflow-hidden rounded-card">
                                <Image
                                    src={s.image}
                                    alt={s.imageAlt}
                                    fill
                                    sizes="(min-width: 1320px) 590px, (min-width: 1024px) 45vw, (min-width: 768px) 584px, calc(100vw - 56px)"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="mt-8 min-w-0 lg:mt-0">
                            <Eyebrow tone="light">{s.label}</Eyebrow>
                            <h3 className={`mb-0 mt-4 text-ink ${typography.h3}`}>{s.title}</h3>
                            <p className={`mb-0 mt-3 text-ink-muted ${typography.body}`}>{s.text}</p>
                            {s.extra ? <div className="mt-2">{s.extra}</div> : null}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
