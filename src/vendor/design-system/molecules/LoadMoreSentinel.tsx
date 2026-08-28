/**
 * LoadMoreSentinel
 *
 * WHY · Progressive-load listing pages need a single element that simultaneously acts
 *        as the IntersectionObserver target AND displays loading/completion feedback.
 *        Without this, the observer target and UI indicator are scattered across the
 *        page and drift out of sync.
 * WHAT · Renders an invisible sentinel `<div>` (the IO target) + an animated dots
 *        loading indicator when more items are available. Shows "Showing all N results"
 *        footer when loading is complete. Props: sentinelRef, hasMore, loading, visibleCount,
 *        totalCount, className.
 * WHEN · Placed after the last card row in any progressively-loaded list or grid. Pair
 *        with the useProgressiveLoad hook which provides the sentinelRef.
 * WHEN NOT · Don't use when pagination is explicit (numbered pages / prev-next buttons) —
 *             the sentinel pattern conflicts with paginated URL state.
 * WHERE · report-store-legacy App.tsx + ReportStorePage.tsx ·
 *          competition-benchmarking-listing-v02 App.tsx + ReportStorePage.tsx
 * HOW ·
 *   ```tsx
 *   const { sentinelRef, hasMore, loading, visibleCount } = useProgressiveLoad(items);
 *
 *   <LoadMoreSentinel
 *     sentinelRef={sentinelRef}
 *     hasMore={hasMore}
 *     loading={loading}
 *     visibleCount={visibleCount}
 *     totalCount={items.length}
 *   />
 *   ```
 *
 * @reusabilityScore 3     // all infinite-scroll listing pages
 * @a11y_status reviewed-AA  // sentinel has aria-hidden="true"
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */

interface LoadMoreSentinelProps {
  /** Ref from useProgressiveLoad — attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether items are currently loading */
  loading?: boolean;
  /** Total items count for the "showing X of Y" label */
  visibleCount?: number;
  totalCount?: number;
  /** Additional className */
  className?: string;
}

export function LoadMoreSentinel({
  sentinelRef,
  hasMore,
  loading = false,
  visibleCount,
  totalCount,
  className = '',
}: LoadMoreSentinelProps) {
  if (!hasMore && !loading) {
    // All items loaded — optional footer
    if (visibleCount && totalCount && visibleCount >= totalCount) {
      return (
        <div data-component="LoadMoreSentinel" className={`text-center py-6 ${className}`}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}>
            Showing all {totalCount.toLocaleString()} results
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div data-component="LoadMoreSentinel" className={className}>
      {/* Invisible sentinel — IntersectionObserver target */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />

      {/* Loading indicator */}
      {(hasMore || loading) && (
        <div className="flex items-center justify-center gap-3 py-8">
          {/* Animated dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  animation: `skeleton-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          {visibleCount && totalCount && (
            <span
              className="tabular-nums"
              style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}
            >
              {visibleCount.toLocaleString()} of {totalCount.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
