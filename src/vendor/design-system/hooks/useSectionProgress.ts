'use client';

import { useEffect, useState } from 'react';

/**
 * useSectionProgress — Returns 0-100 progress through a section range.
 *
 * WHY: ReadingProgressBar segments need per-section progress, not total-page.
 *      Total page progress (`useReadingProgress`) misses milestone semantics.
 * WHAT: Returns clamped 0-100 progress between startId top and endId bottom.
 * WHEN: Multi-section reading bars · scroll-spy progress dots.
 * WHEN NOT: Don't use for total-doc progress (use `useReadingProgress`).
 * HOW: scrollY adjusted for navbar height (100px desktop · 60px mobile).
 *      Listens scroll + resize · recalculates each tick.
 *
 * 2026-08-13 investigation note (competition-benchmarking-2026 progress-bar
 * fix): considered adding an optional offset param here so that project could
 * pass its real ~47px stuck-chrome height instead of this hook's hardcoded
 * 100px. Measured live first: swapping the constant alone (100 → 47, same
 * `scrollY + offset` formula) does NOT fix that project's ~98%-cap bug — it
 * makes the achievable ceiling at absolute max scroll slightly *worse*
 * (measured 97.8% vs 98.2%), because a SMALLER additive offset only ever
 * lowers the numerator. That project's real issue is structural (its ~525px
 * post-Section-19 footer means `scrollY_max + anyReasonableOffset` can never
 * reach the raw end-anchor's bottom edge for realistic viewport heights — the
 * fix needed there is a reachable-max-rescale, not a different constant), so
 * it was fixed locally in that project's own `ReportProgressBar.tsx` instead
 * of here — this hook is unchanged, no new params, zero risk to
 * `ReadingProgressBar` or any other consumer.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useSectionProgress(startId: string, endId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const startEl = document.getElementById(startId);
      const endEl = document.getElementById(endId);
      if (!startEl || !endEl) return;

      const startTop = startEl.offsetTop;
      const endBottom = endEl.offsetTop + endEl.offsetHeight;
      const scrollableRange = endBottom - startTop;

      const navbarHeight = window.innerWidth >= 1024 ? 100 : 60;
      const scrollPos = window.scrollY + navbarHeight;

      const scrolledInRange = scrollPos - startTop;
      const progressPercent = (scrolledInRange / scrollableRange) * 100;

      setProgress(Math.max(0, Math.min(100, progressPercent)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [startId, endId]);

  return progress;
}
