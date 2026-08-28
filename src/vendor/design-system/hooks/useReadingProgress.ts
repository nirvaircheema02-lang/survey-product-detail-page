'use client';

import { useEffect, useState } from 'react';

/**
 * useReadingProgress — Returns total-document scroll progress (0-100).
 *
 * WHY: Top reading-progress bar shows full-page read state · differs from
 *      per-section progress (use `useSectionProgress` for that).
 * WHAT: Returns 0-100 representing % of document scrolled.
 * WHEN: Top reading-progress bar · case-study scroll indicator.
 * WHEN NOT: Don't use for section-bound progress (use `useSectionProgress`).
 * HOW: scrollTop / (scrollHeight - innerHeight) × 100.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
}
