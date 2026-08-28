'use client';

import { useEffect, useState } from 'react';

export interface UseCounterOptions {
  end: number;
  duration?: number;
  startOnView?: boolean;
}

/**
 * useCounter — Animated number counter w/ easing (DS v4.3).
 *
 * WHY: Stat cards · impact numbers feel inert as static digits · easing
 *      from 0→target creates "earned" reveal on scroll.
 * WHAT: Returns { count, startCounting() }.
 * WHEN: StatCard · ImpactSection metrics · ROI displays.
 * WHEN NOT: Don't use for live counters that change frequently (re-trigger
 *      thrashes). Use plain state for those.
 * HOW: rAF-driven · easeOutQuart easing · duration in ms (default 2000).
 *      Pass `startOnView: false` to start immediately on mount.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 * @note Distinct from `useAnimatedCounter` which uses Framer Motion useMotionValue.
 */
export function useCounter({ end, duration = 2000, startOnView = true }: UseCounterOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, startCounting: () => setHasStarted(true) };
}
