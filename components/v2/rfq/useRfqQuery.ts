'use client';

import { useSearchParams } from 'next/navigation';
import { resolveRfqSearch, type RfqQuery } from './params';

/**
 * Enquiry topic + prefill from the URL query, in the browser. Lets /requirements
 * and /contact stay statically rendered; callers must sit inside <Suspense>.
 */
export function useRfqQuery(): RfqQuery {
    return resolveRfqSearch(useSearchParams());
}
