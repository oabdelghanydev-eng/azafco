import type { ReactNode } from 'react';

export interface WorkflowStep {
    key: string;
    title: ReactNode;
    description?: ReactNode;
    /** Marks the step as a quality checkpoint (text label, not colour only) */
    checkpoint?: boolean;
}

export interface WorkflowProps {
    steps: WorkflowStep[];
    /** Visible label for checkpoint steps, e.g. "Checkpoint" */
    checkpointLabel: string;
}

/**
 * Six-step processing workflow (receiving → dispatch) as a semantic <ol>,
 * 1 / 2 / 3 columns. Surface-aware: works on light and navy sections.
 * Numbers stay Latin (01…06) in every locale, like ProcessSteps.
 */
export default function Workflow({ steps, checkpointLabel }: WorkflowProps) {
    return (
        <ol className="grid gap-px overflow-hidden rounded-card border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => {
                const n = String(i + 1).padStart(2, '0');
                return (
                    <li key={s.key} className="relative flex flex-col bg-panel p-6 md:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <span aria-hidden="true" className="font-display text-display-lg font-semibold tabular-nums text-eyebrow">
                                {n}
                            </span>
                            {s.checkpoint ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 text-caption font-semibold text-fg">
                                    <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-gold" />
                                    {checkpointLabel}
                                </span>
                            ) : null}
                        </div>
                        <h3 className="mt-4 text-heading-md text-fg">
                            <span className="sr-only">{n}. </span>
                            {s.title}
                        </h3>
                        {s.description ? <p className="mt-2 text-body-sm text-fg-muted">{s.description}</p> : null}
                    </li>
                );
            })}
        </ol>
    );
}
