'use client';

import { useEffect, useState } from 'react';

/**
 * Debounce a value — delays state propagation until input settles.
 *
 * Use for: search inputs, scroll-driven state, resize-tracking.
 *
 * @example
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *   useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 *
 * @promotedFrom V0_lite_report
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
