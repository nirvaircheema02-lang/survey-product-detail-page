'use client';

import { useEffect, useRef, useState } from 'react';

export interface MagneticEffectOptions {
  strength?: number;
  disabled?: boolean;
}

/**
 * useMagneticEffect — Cursor-magnetic translate effect for premium CTAs.
 *
 * WHY: FinalCTASection signature button needs subtle "pulled toward cursor"
 *      micro-interaction to telegraph importance · Ken signature flourish.
 * WHAT: Returns { ref, position: {x, y} } — apply via style transform.
 * WHEN: Use sparingly · 1-2 buttons per page max (loses meaning at scale).
 * WHEN NOT: Skip on touch devices · disable for prefers-reduced-motion.
 * HOW: Listens mousemove on element · calculates delta from center × strength.
 *      Resets to {0,0} on mouseleave.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
 */
export function useMagneticEffect<T extends HTMLElement = HTMLButtonElement>({
  strength = 0.3,
  disabled = false,
}: MagneticEffectOptions = {}) {
  const ref = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  return { ref, position };
}
