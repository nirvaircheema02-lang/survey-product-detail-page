/**
 * FadeInSection — Atom (scroll-entrance wrapper)
 *
 * WHY: Provides a reusable, accessible scroll-driven entrance animation so
 * every section / card gets a consistent reveal without each component
 * hand-rolling its own IntersectionObserver or Framer Motion setup.
 *
 * WHAT: Wraps children in a Framer Motion `motion.div` that fades in (and
 * optionally slides up) when the element enters the viewport via `useInView`.
 * Respects `prefers-reduced-motion` — skips animation entirely when set.
 *
 * WHEN:
 * - Wrap any section, card grid, or standalone block you want revealed on scroll.
 * - Use `delay` to stagger sibling reveals (e.g., 0, 100, 200ms).
 *
 * WHEN NOT:
 * - Don't wrap every DOM node — only top-level section blocks or major cards.
 * - Don't use inside hero sections where content should be visible immediately.
 *
 * HOW:
 * ```tsx
 * <FadeInSection delay={0}>
 *   <p>Visible on scroll</p>
 * </FadeInSection>
 *
 * // Staggered children
 * {items.map((item, i) => (
 *   <FadeInSection key={item.id} delay={i * 80}>
 *     <Card>{item.title}</Card>
 *   </FadeInSection>
 * ))}
 * ```
 *
 * ANIMATION STACK: Framer Motion `useInView` + `motion.div` (no GSAP, no Lenis).
 * Smooth page scroll = native CSS `scroll-behavior: smooth` in DS base.css.
 * Reduced motion = `useReducedMotion()` bypasses all transform/opacity animation.
 *
 * @promotedFrom Design_system_vs_26/src/app/components/FadeInSection.tsx
 * @portedDate 2026-05-12 — DS Port Batch 1
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion';

export interface FadeInSectionProps {
  children: React.ReactNode;
  /** Delay in ms before animation starts once in-view. */
  delay?: number;
  /** Slide direction on reveal. `'up'` = translateY from 16px. `'none'` = fade only. */
  direction?: 'up' | 'none';
  /** Additional CSS classes applied to the wrapper div. */
  className?: string;
  /** IntersectionObserver threshold (0-1). Default 0.1 = triggers when 10% visible. */
  threshold?: number;
}

export function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className,
  threshold = 0.1,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const isInView = useInView(ref, {
    once: true,
    margin: '0px 0px -40px 0px',
    amount: threshold,
  });

  /*
   * ROOT-CAUSE HARDENING (2026-08-12): the browser throttles or fully
   * suspends rAF/WAAPI-driven tweens (how Framer Motion animates
   * `animate="visible"`) while `document.hidden` is true — backgrounded /
   * occluded tab, or a headless automation pane that never reports
   * visible+focused. `useInView`'s IntersectionObserver callback still
   * fires and flips `isInView` correctly in that state (IO delivery isn't
   * rAF-gated), so Motion issues the opacity/translateY tween on schedule —
   * but the browser never grants it paint frames to actually run, so it can
   * sit visually frozen at (or near) its starting `opacity: 0` indefinitely,
   * even though React/Motion's internal state already thinks it's "visible".
   * Re-rendering alone does not fix this: the `animate` prop value hasn't
   * changed, so Motion won't reissue the tween, and a fresh tween would
   * still be subject to the same paint-frame starvation anyway.
   *
   * Fix: on `visibilitychange` → visible, if the element has already
   * resolved in-view, snap it straight to the final "visible" values with
   * `controls.set()` (an instant style write, not a tween — doesn't need
   * animation frames to take effect). This guarantees a real user who
   * opens or returns to this tab always sees the resolved end state
   * instead of a frozen partial one, without changing the normal
   * IntersectionObserver + `once: true` trigger logic for anyone who
   * never backgrounds the tab.
   */
  const controls = useAnimationControls();
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    if (isInView) {
      hasResolvedRef.current = true;
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasResolvedRef.current) {
        controls.set('visible');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [controls]);

  /* Skip animation entirely when prefers-reduced-motion is set */
  if (prefersReduced) {
    return (
      <div data-component="FadeInSection" ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const translateY = direction === 'up' ? 16 : 0;

  const variants = {
    hidden:  { opacity: 0, y: translateY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: delay / 1000,
      },
    },
  };

  return (
    <motion.div
      data-component="FadeInSection"
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
