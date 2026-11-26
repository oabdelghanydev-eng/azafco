'use client';

/**
 * One block of the secondary information on /contact (addresses, registration).
 * On phones it is a row that opens on tap, so the page stays about one screen
 * long; from lg it is always open, as a column. The content is always in the
 * HTML (display:none while closed), so it is there without JavaScript.
 */
import { useId, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '@/components/ui/icons';
import { cn, focusRing, typography } from '@/components/ui/tokens';

export default function InfoBlock({ title, defaultOpen = false, id, children }: { title: string; defaultOpen?: boolean; id?: string; children: ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    const panelId = useId();

    return (
        <section id={id} className="scroll-mt-24 border-0 border-t border-solid border-white/25">
            <h2 className="m-0">
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpen((v) => !v)}
                    className={cn(
                        'flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-start font-bold lg:pointer-events-none lg:min-h-0 lg:cursor-default lg:pb-2.5 lg:pt-[18px] lg:text-gold',
                        open ? 'text-gold-400' : 'text-white',
                        'text-[17px] lg:text-body-sm',
                        focusRing,
                    )}
                >
                    {title}
                    <span aria-hidden="true" className={cn('text-gold transition-transform motion-reduce:transition-none lg:hidden', open && 'rotate-180')}>
                        <ChevronDownIcon size={18} />
                    </span>
                </button>
            </h2>
            <div id={panelId} className={cn('pb-5 lg:block lg:pb-0', open ? 'block' : 'hidden', typography.small)}>
                {children}
            </div>
        </section>
    );
}
