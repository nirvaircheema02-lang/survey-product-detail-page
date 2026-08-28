'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useScrollAnimation — IntersectionObserver-based scroll-into-view trigger.
 *
 * WHY: Section fade-in on first scroll · entrance animations need a ref +
 *      visibility flag · IO is cheaper than scroll listeners.
 * WHAT: Returns { ref, isVisible } — attach ref to target element.
 * WHEN: Use for section entrance animations · "fade in on first reveal".
 * WHEN NOT: Use Framer `useInView` if you also need scrub/parallax (this is
 *      visibility-only). Use `useScrollDirection` for direction-aware logic.
 * HOW: Defaults to `triggerOnce: true` (entrance feel · no re-trigger on scroll back).
 *      Pass `triggerOnce: false` for repeat triggers.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {},
) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
