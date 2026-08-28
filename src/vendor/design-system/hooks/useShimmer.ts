'use client';

import { useState, useCallback } from 'react';

export interface UseShimmerReturn {
  isHovering: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

/**
 * Shimmer hover state — manages the brand-signature right-to-left sweep.
 *
 * BRAND-LOCKED: shimmer is part of the Ken brand CTA identity. Active on all
 * primary buttons + CTA links. Sweeps `--composition-gradient-brand-red-shimmer`
 * left→right on hover. Respects `prefers-reduced-motion` at the consumer.
 *
 * @example
 *   const { isHovering, handleMouseEnter, handleMouseLeave } = useShimmer();
 *   <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
 *     {isHovering && <span className="shimmer-overlay" />}
 *     Download Sample
 *   </button>
 *
 * @param duration ms — reserved for future per-instance customization (default 700)
 *
 * @promotedFrom V0_lite_report
 */
export function useShimmer(_duration: number = 700): UseShimmerReturn {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  return { isHovering, handleMouseEnter, handleMouseLeave };
}
