'use client';

import { useEffect, useState } from 'react';

/**
 * useScrollSpy — Tracks which section ID is currently in the viewport.
 *
 * WHY: TOC sidebars need to highlight the active section as the user scrolls.
 *      IntersectionObserver with rootMargin offsetting is cheaper + more accurate
 *      than scroll listeners + getBoundingClientRect polling.
 *
 * WHAT: Returns the ID of the section currently "in view" based on rootMargin offset.
 *       rootMargin is typically set to a negative top value (e.g. `-200px`) so that
 *       a section is only considered "active" once it reaches 200px from top.
 *
 * WHEN: Use for sticky sidebar TOC (TableOfContentsSidebar) or any scroll-spy context
 *       where a list of nav items maps to section IDs on the page.
 *
 * WHEN NOT: Use Framer `useInView` when you need entrance animation triggers.
 *           Use `useScrollDirection` when you need up/down direction only.
 *
 * WHERE: `TableOfContentsSidebar` organism — tracks which chapter section is active.
 *
 * HOW:
 * ```ts
 * const sectionIds = ['market-overview', 'segmentation', 'regional'];
 * const activeId = useScrollSpy(sectionIds, 200);
 * // activeId = whichever section title is near top of viewport
 * ```
 *
 * @param sectionIds - Array of section element IDs to observe.
 * @param rootMarginTop - Pixels from top treated as "in view" trigger. Default 200.
 * @returns The ID of the currently active section, or `null` if none in range.
 *
 * @promotedFrom V0.2-for-design-system `src/app/hooks/useScrollSpy.ts`
 */
export function useScrollSpy(
  sectionIds: string[],
  rootMarginTop: number = 200,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds.length > 0 ? sectionIds[0] : null,
  );

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      // Negative top margin: section must be within `rootMarginTop` of viewport top
      rootMargin: `-${rootMarginTop}px 0px -60% 0px`,
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMarginTop]);

  return activeId;
}
