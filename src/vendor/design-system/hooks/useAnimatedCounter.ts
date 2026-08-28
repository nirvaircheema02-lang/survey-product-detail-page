'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * useAnimatedCounter — count from 0 → target on scroll-into-view.
 *
 * Returns `{ count, ref }`. Attach `ref` to the element that triggers animation.
 * Triggers once when 50% of element enters viewport (`amount: 0.5, once: true`).
 * Easing: easeOutCubic (`1 - (1-t)^3`).
 *
 * Use for: hero stat counters, in-context metric reveals, scroll-triggered numbers.
 *
 * @example
 *   const { count, ref } = useAnimatedCounter(450, 1800);
 *   <div ref={ref}>${(count/10).toFixed(1)}B</div>
 *
 * @promotedFrom V0_lite_report (HeroSection.tsx + KeyStats.tsx — was inlined in both, now shared)
 */
export function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return { count, ref };
}
