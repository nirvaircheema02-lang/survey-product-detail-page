'use client';

import { useState, useEffect } from 'react';

/**
 * useResponsiveGutter — Returns responsive gutter (px) for Masonry/grids.
 *
 * WHY: Masonry grids need pixel-based gutters (not CSS classes) · mobile
 *      needs tighter spacing than desktop for content density.
 * WHAT: Mobile (<640px) → 24px · Desktop (≥640px) → 32px.
 * WHEN: Use in Masonry/grid layouts needing px gutters (react-responsive-masonry).
 * WHEN NOT: Don't use for standard Tailwind gap classes (already responsive).
 * HOW: window.innerWidth check w/ SSR-safe fallback (32px).
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useResponsiveGutter(): number {
  const [gutter, setGutter] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640 ? 32 : 24;
    }
    return 32;
  });

  useEffect(() => {
    const handleResize = () => {
      setGutter(window.innerWidth >= 640 ? 32 : 24);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return gutter;
}
