'use client';

import { useState, useCallback, useRef } from 'react';

export interface CrossfadeResult {
  opacity: number;
  isFading: boolean;
  triggerCrossfade: (onChange: () => void) => void;
}

/**
 * useCrossfade — Opacity crossfade for content swaps (DS v4.3).
 *
 * WHY: View-mode swaps (grid↔list) · filter results · pagination cause jarring
 *      layout shifts without easing. Crossfade smooths the transition.
 * WHAT: Returns { opacity (0|1), isFading, triggerCrossfade(onChange) }.
 * WHEN: CardListing view-mode toggles · paginated content swaps.
 * WHEN NOT: Don't use for mount/unmount (use `useMountTransition`). Don't use
 *      for scroll-driven motion (Framer `useScroll` instead).
 * HOW: Call `triggerCrossfade(() => setX(...))` — fades to 0 · calls onChange
 *      at midpoint · fades back to 1.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useCrossfade(halfDuration: number = 200): CrossfadeResult {
  const [opacity, setOpacity] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerCrossfade = useCallback(
    (onChange: () => void) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setIsFading(true);
      setOpacity(0);

      timerRef.current = setTimeout(() => {
        onChange();
        requestAnimationFrame(() => {
          setOpacity(1);
          timerRef.current = setTimeout(() => {
            setIsFading(false);
          }, halfDuration);
        });
      }, halfDuration);
    },
    [halfDuration],
  );

  return { opacity, isFading, triggerCrossfade };
}
