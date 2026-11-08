import type { ReactNode } from 'react';
import ProcessSteps from '@/components/v2/ProcessSteps';

export interface WorkflowStep {
    key: string;
    title: ReactNode;
    description?: ReactNode;
    /** Marks the step as a quality checkpoint (text label, not colour only) */
    checkpoint?: boolean;
    /** 24px line icon for the timeline marker */
    icon?: ReactNode;
}

export interface WorkflowProps {
    steps: WorkflowStep[];
    /** Visible label for checkpoint steps, e.g. "Checkpoint" */
    checkpointLabel: string;
}

/**
 * Six-step processing workflow (receiving → dispatch) as a connected timeline
 * (ProcessSteps): one row from xl, a vertical line below. Surface-aware.
 * Checkpoint steps carry a text label (not colour only).
 */
export default function Workflow({ steps, checkpointLabel }: WorkflowProps) {
    return (
        <ProcessSteps
            steps={steps.map((s) => ({
                title: s.title,
                description: s.description,
                icon: s.icon,
                extra: s.checkpoint ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 text-caption font-semibold text-fg">
                        <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-gold" />
                        {checkpointLabel}
                    </span>
                ) : undefined,
            }))}
        />
    );
}
