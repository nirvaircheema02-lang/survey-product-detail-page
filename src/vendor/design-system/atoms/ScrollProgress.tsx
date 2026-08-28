'use client';

import { useState, useEffect } from 'react';

/**
 * ScrollProgress — 3px fixed-top progress bar tracking total page scroll depth.
 *
 * WHY:
 * - Engagement signal — readers see how much remains, encourages completion (audit ScrollProgress.md:21)
 * - Brand red explicitly chosen — "engagement surface, not pure utility" (5% tier rule · OG JSDoc:11)
 * - 3px height tested vs 2px (invisible on some monitors) and 4px (intrusive) — sweet spot (audit:121)
 * - z-index ensures visibility above sticky navbars + cinematic dark heroes (audit:24)
 * - Pairs w/ case-study-specific `ReadingProgressBar` — split keeps each focused (audit:25)
 *
 * WHAT: Zero-prop atom. Fixed 3px bar at top of viewport, fills L→R via
 * `window.scrollY / (scrollHeight − innerHeight)`. Brand red bg, passive scroll listener,
 * 150ms width transition for smooth fill. Clamps to 100% to avoid iOS bounce overflow.
 *
 * WHEN:
 * - Long-scroll content pages (reports, blog posts, listing pages > 3 viewports)
 * - Documentation catalog browse
 * - Any landing page where reader benefits from "how deep am I" signal
 *
 * WHEN NOT:
 * - Pages w/ a hero above-the-fold → use `<ReadingProgressBar>` (hides during hero, scoped to body)
 * - Modal/dialog scroll → progress inside modal, not viewport-level
 * - Short pages (< 2 viewports) → bar feels redundant
 * - Multi-column dashboards → viewport scroll != reading progress
 *
 * HOW:
 * ```tsx
 * // Drop-in at root of any page — zero props
 * export default function Page() {
 *   return (
 *     <>
 *       <ScrollProgress />
 *       <Navbar />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 * ```
 *
 * A11y: GAP — missing `role="progressbar"` + `aria-valuenow/min/max` (audit:90). Visually decorative.
 * Motion: 150ms ease-out width transition (audit:97). GAP — `prefers-reduced-motion` not respected.
 * Anti-patterns:
 *  - ❌ Never mount both `<ScrollProgress>` AND `<ReadingProgressBar>` on same page (double bar)
 *  - ❌ Never style bar > 4px tall (intrusive)
 *  - ❌ Never change to non-brand color (engagement-signal intent is intentional)
 *  - ❌ Never mount inside a scroll container (listener is on `window`)
 *
 * @lifecycle stable
 * @a11y_status known-issue (missing progressbar ARIA · missing reduced-motion)
 * @reusabilityScore 3/5 ⭐
 * @promotedFrom Design_system_vs_26/src/app/components/ScrollProgress.tsx · V0_lite_report (audit:3)
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div data-component="ScrollProgress" className="fixed top-0 left-0 right-0 h-[3px] z-[var(--z-index-sticky)] pointer-events-none">
      <div
        className="h-full bg-[var(--color-brand-red)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
