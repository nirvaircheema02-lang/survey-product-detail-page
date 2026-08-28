'use client';

import { useState, useEffect } from 'react';

export interface MountTransitionResult {
  shouldRender: boolean;
  isTransitioning: boolean;
}

/**
 * useMountTransition — Mount/unmount w/ CSS transition support (DS v4.3).
 *
 * WHY: Overlays (sheet · modal · drawer) need to stay in DOM during exit
 *      animation · React unmount yanks them mid-transition.
 * WHAT: Returns { shouldRender (DOM presence) · isTransitioning (CSS class) }.
 * WHEN: MobileFilterSheet · ContactModal · any fade/slide overlay.
 * WHEN NOT: Use Framer `AnimatePresence` if you already have motion installed
 *      and need spring physics. This is the lighter CSS-only path.
 * HOW: shouldRender=true → next frame → isTransitioning=true. On close:
 *      isTransitioning=false → wait duration → shouldRender=false.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useMountTransition(isOpen: boolean, duration: number = 300): MountTransitionResult {
  const [shouldRender, setShouldRender] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const enterFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(enterFrame);
    } else {
      setIsTransitioning(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  return { shouldRender, isTransitioning };
}
