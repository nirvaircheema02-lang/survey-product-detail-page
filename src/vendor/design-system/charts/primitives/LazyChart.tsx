'use client';

/**
 * LazyChart · IntersectionObserver-driven lazy render gate for below-fold charts.
 *
 * WHY  · Chart library (Highcharts + D3) is heavy. Rendering all charts on page
 *        load — even below the fold — blocks main thread and wastes memory.
 *        IntersectionObserver defers render until chart is near viewport.
 *
 * WHAT · Wraps any chart child in a sentinel div. Observes via IO with configurable
 *        rootMargin (pre-load distance). Until visible: renders ChartSkeleton placeholder
 *        at the same height (prevents CLS). Once visible: renders children, disconnects IO.
 *        One-shot: never re-hides once shown (stable after intersection).
 *
 * WHEN · Wrap any chart that appears below the fold. Especially effective for
 *        long showcase/PDP pages with 10+ charts stacked.
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/LazyChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <LazyChart height={320} rootMargin="200px">
 *          <KenColumnChart {...props} />
 *        </LazyChart>
 *        ```
 *
 * A11y · Skeleton wrapper is aria-hidden — decorative loading placeholder.
 *        Children mount with full a11y semantics when visible.
 *
 * @module design-system/core-v2/src/charts/primitives/LazyChart
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChartSkeleton } from '../states/ChartSkeleton';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LazyChartProps {
  /** Chart content to render when visible */
  children: ReactNode;
  /**
   * Placeholder + min-height in px while waiting for IO trigger.
   * Should match the expected chart height to prevent CLS.
   * @default 300
   */
  height?: number;
  /**
   * rootMargin passed to IntersectionObserver.
   * Positive value pre-loads before chart enters viewport.
   * @default '200px'
   */
  rootMargin?: string;
  /**
   * Intersection threshold (0–1). 0.01 = trigger as soon as 1% is visible.
   * @default 0.01
   */
  threshold?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LazyChart({
  children,
  height = 300,
  rootMargin = '200px',
  threshold = 0.01,
}: LazyChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // SSR guard — IntersectionObserver not available in Node
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    if (visible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [visible, rootMargin, threshold]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {visible ? (
        children
      ) : (
        <div aria-hidden="true">
          <ChartSkeleton height={height} />
        </div>
      )}
    </div>
  );
}
