'use client';

import { useState, useEffect } from 'react';

/**
 * useActiveSection — IntersectionObserver-based active section tracker.
 *
 * WHY: Sticky nav · ReadingProgressBar need to know which page section
 *      is currently in viewport for active-state styling + scroll-spy.
 * WHAT: Returns active section ID (string) · empty when no match.
 * WHEN: Long-scroll page w/ named anchor sections (hero · methodology · impact etc.).
 * WHEN NOT: Single-section pages · static content · use plain `useInView` for one-off triggers.
 * HOW: Pass section IDs array. Hook observes each w/ rootMargin `-20% 0px -60% 0px`
 *      (triggers when section is 20% from top of viewport). Returns first matching ID.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useActiveSection(sectionIds: string[] = [
  'hero',
  'client-context',
  'challenges',
  'engagement',
  'methodology',
  'impact',
  'testimonial',
  'final-cta',
  'resources',
]) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sections = sectionIds
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((s) => s.element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      },
    );

    sections.forEach((s) => {
      if (s.element) observer.observe(s.element);
    });

    return () => {
      sections.forEach((s) => {
        if (s.element) observer.unobserve(s.element);
      });
    };
  }, [sectionIds]);

  return activeSection;
}
