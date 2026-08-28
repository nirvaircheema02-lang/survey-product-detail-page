'use client';

/**
 * PageProgressBar — top 2px brand-red bar tracking document scroll %.
 *
 * @what  Fixed top bar · 2px height · brand-red fill · uses DS useReadingProgress hook.
 * @why   DS ReadingProgressBar organism uses hardcoded section IDs (case-study: client-context → final-cta) ·
 *        wrong fit for 25-section PDP. Project-local · same hook · cleaner.
 * @when  v0.4 chrome L9 · always visible (hides over hero · appears after scroll).
 * @how   useReadingProgress returns 0-100 · transform scaleX driven by % · GPU-accelerated.
 */

import { useReadingProgress } from '@kenresearch/design-system/hooks';

export function PageProgressBar() {
  const progress = useReadingProgress();

  return (
    <div
      data-component="PageProgressBar"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
    >
      <div
        className="absolute inset-0 bg-[var(--color-brand-red)] origin-left transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  );
}
