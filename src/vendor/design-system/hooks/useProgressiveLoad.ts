'use client';

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

export interface ProgressiveLoadResult {
  sentinelRef: RefObject<HTMLDivElement | null>;
  visibleCount: number;
  hasMore: boolean;
  reset: () => void;
}

/**
 * useProgressiveLoad — IntersectionObserver-based progressive/infinite load.
 *
 * WHY: Long lists need "load more on scroll" without manual pagination buttons.
 *      Sentinel pattern avoids scroll-listener overhead.
 * WHAT: Returns { sentinelRef, visibleCount, hasMore, reset }.
 * WHEN: CardListing · long report grids · search results.
 * WHEN NOT: Don't use for fixed lists (<batchSize). Don't use for paginated
 *      API calls (use proper pagination — this is client-side slice only).
 * HOW: Attach sentinelRef to bottom element. Each viewport entry grows
 *      visibleCount by batchSize. Reset on filter change.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useProgressiveLoad(
  totalItems: number,
  batchSize: number = 6,
  rootMargin: string = '200px',
): ProgressiveLoadResult {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visibleCount < totalItems;

  const reset = useCallback(() => {
    setVisibleCount(batchSize);
  }, [batchSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + batchSize, totalItems));
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, batchSize, totalItems, rootMargin]);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [totalItems, batchSize]);

  return { sentinelRef, visibleCount, hasMore, reset };
}
