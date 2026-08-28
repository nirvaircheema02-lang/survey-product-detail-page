'use client';

/**
 * useDeferredRender
 *
 * @what  Hook that returns `ready: boolean` — false until browser signals it's safe
 *        to render expensive components without blocking LCP.
 * @why   Highcharts (117KB) and other heavy UI chunks evaluated synchronously at
 *        first paint cause LCP 5.0s. Deferring chart render until idle or
 *        intersection-triggered lets h1 + CTA paint first → LCP target <2.5s.
 * @where Use in any component that wraps a heavy dynamic import (Highcharts, D3, etc.)
 *        placed above-fold (use 'idle' strategy) or below-fold (use 'intersect').
 * @when  Hero charts → strategy='idle' (above-fold, not scroll-triggered).
 *        Below-fold charts → strategy='intersect' (save rIC budget for critical path).
 * @how   'idle': requestIdleCallback (rIC) w/ 2000ms timeout → calls setReady(true).
 *               Falls back to setTimeout(delayMs) in envs without rIC (Safari <16).
 *        'intersect': IntersectionObserver on provided ref → fires on 200px pre-enter.
 *        Cleanup: cancels rIC or disconnects observer on unmount.
 */

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseDeferredRenderOptions {
  /**
   * Deferral strategy.
   * - 'idle': requestIdleCallback — best for above-fold heavy components (hero charts).
   *           Falls back to setTimeout(delayMs) when rIC unavailable (Safari <16).
   * - 'intersect': IntersectionObserver — best for below-fold components.
   *                Requires `ref` to be provided.
   * @default 'idle'
   */
  strategy?: 'idle' | 'intersect';
  /**
   * Element ref to observe. Required when strategy='intersect'.
   * The observer watches this element + fires when it enters viewport ±200px.
   */
  ref?: RefObject<HTMLElement | null>;
  /**
   * Fallback delay in ms for 'idle' strategy when requestIdleCallback unavailable.
   * @default 100
   */
  delayMs?: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns `true` once the browser is ready to render expensive UI without
 * impacting LCP. Uses `requestIdleCallback` (above-fold) or
 * `IntersectionObserver` (below-fold) depending on strategy.
 *
 * @example
 * // Hero chart — above-fold, defer until idle
 * const chartReady = useDeferredRender({ strategy: 'idle' });
 *
 * @example
 * // Below-fold chart — defer until near viewport
 * const containerRef = useRef<HTMLDivElement>(null);
 * const chartReady = useDeferredRender({ strategy: 'intersect', ref: containerRef });
 */
export function useDeferredRender(options: UseDeferredRenderOptions = {}): boolean {
  const { strategy = 'idle', ref, delayMs = 100 } = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (strategy === 'idle') {
      // requestIdleCallback path (Chrome/FF/Edge)
      const ric = (window as Window & { requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number }).requestIdleCallback;
      if (ric) {
        const id = ric(() => setReady(true), { timeout: 2000 });
        return () => {
          (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
        };
      }
      // Safari <16 fallback
      const t = setTimeout(() => setReady(true), delayMs);
      return () => clearTimeout(t);
    }

    if (strategy === 'intersect') {
      const target = ref?.current;
      if (!target) return;

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setReady(true);
            obs.disconnect();
          }
        },
        { rootMargin: '200px' },
      );
      obs.observe(target);
      return () => obs.disconnect();
    }
  }, [strategy, ref, delayMs]);

  return ready;
}
