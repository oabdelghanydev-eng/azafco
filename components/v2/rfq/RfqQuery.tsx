'use client';

/**
 * Client readers of the enquiry query (?type, ?product, ?country, ?form, ?grade)
 * for the statically rendered /requirements and /contact pages. Each must sit
 * inside <Suspense>; its fallback is the no-query (general) variant, which is
 * what the static HTML carries.
 */
import { useRfqQuery } from './useRfqQuery';
import RfqRequestPanelView, { type RfqRequestPanelViewProps } from './RfqRequestPanelView';

/** The requirements panel with topic and prefill from the query. */
export function RfqPanelFromQuery(props: Omit<RfqRequestPanelViewProps, 'topic' | 'product' | 'country' | 'form' | 'grade'>) {
    const q = useRfqQuery();
    return <RfqRequestPanelView {...props} topic={q.topic} product={q.product} country={q.country} form={q.form} grade={q.grade} />;
}
