'use client';

import { useEffect, useState } from 'react';

/**
 * useHeroVisibility — Tracks whether hero section is visible in viewport.
 *
 * WHY: Sticky CTA + condensed nav should appear only AFTER hero scrolls out.
 *      Avoids competing CTAs while hero CTA is still on-screen.
 * WHAT: Returns true while hero >10% in viewport · false after scroll past.
 * WHEN: StickyCTA reveal logic · condensed-nav swap · scroll-triggered overlays.
 * WHEN NOT: Don't use for non-hero sections (use `useScrollAnimation` instead).
 * HOW: IntersectionObserver on `selector` (default: first `<section>` on page).
 *      Threshold [0, 0.1, 0.5, 1] for granular intersectionRatio tracking.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useHeroVisibility(selector: string = 'section'): boolean {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const heroSection = document.querySelector(selector);
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.intersectionRatio > 0.1);
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '0px',
      },
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, [selector]);

  return isHeroVisible;
}
