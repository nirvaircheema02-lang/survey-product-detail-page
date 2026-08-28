'use client';

import { useEffect, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | 'idle';

/**
 * useScrollDirection — Tracks scroll direction (up/down/idle).
 *
 * WHY: Nav auto-hide on scroll down · sticky CTA reveal on scroll up
 *      need bidirectional scroll awareness · not just position.
 * WHAT: Returns 'up' | 'down' | 'idle'. Idle = initial state · no scroll yet.
 * WHEN: Nav hide-on-scroll · sticky reveal · directional micro-interactions.
 * WHEN NOT: Don't use for scroll position (use `useScroll` from Framer instead).
 * HOW: rAF-throttled scroll listener · 10px threshold to ignore micro-scrolls.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useScrollDirection(): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('idle');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const threshold = 10;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDirection;
}
