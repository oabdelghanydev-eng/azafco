'use client';

/**
 * Client readers of the enquiry query (?type, ?product, ?country, ?form, ?grade)
 * for the statically rendered /requirements and /contact pages. Each must sit
 * inside <Suspense>; its fallback is the no-query (general) variant, which is
 * what the static HTML carries.
 */
import type { ReactNode } from 'react';
import { isShortTopic } from './params';
import { useRfqQuery } from './useRfqQuery';
import RfqRequestPanelView, { type RfqRequestPanelViewProps } from './RfqRequestPanelView';

/** Picks the server-rendered variant for the query's topic (general / corporate / documents). */
export function RfqByTopic({ general, corporate, documents }: { general: ReactNode; corporate: ReactNode; documents: ReactNode }) {
    const { topic } = useRfqQuery();
    return <>{topic === 'corporate' ? corporate : topic === 'documents' ? documents : general}</>;
}

/** Renders children only for the short topics (short) or only for the seafood topics (!short). */
export function RfqShowWhen({ short, children }: { short: boolean; children: ReactNode }) {
    const { topic } = useRfqQuery();
    return isShortTopic(topic) === short ? <>{children}</> : null;
}

/** The requirements panel with topic and prefill from the query. */
export function RfqPanelFromQuery(props: Omit<RfqRequestPanelViewProps, 'topic' | 'product' | 'country' | 'form' | 'grade'>) {
    const q = useRfqQuery();
    return <RfqRequestPanelView {...props} topic={q.topic} product={q.product} country={q.country} form={q.form} grade={q.grade} />;
}
