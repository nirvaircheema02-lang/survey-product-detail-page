'use client';

/**
 * ChartReveal · viewport-triggered fadeInUp entrance animation for chart blocks.
 *
 * WHY  · Ref 1 DOM probe confirmed: ALL chart containers animate with
 *        `fadeInUp 0.6s ease-out` triggered by IntersectionObserver.
 *        Every chart block earns an entrance. Section headings do NOT animate —
 *        only data visualization earns the reveal.
 *        Without ChartReveal, charts pop in at paint (jarring · breaks premium feel).
 *
 * WHAT · Framer Motion `motion.div` with `whileInView` trigger.
 *        Fades from opacity:0 + translateY(20px) → opacity:1 + translateY(0).
 *        Falls back to plain `<div>` when reduced motion preferred or `disabled` prop true.
 *
 * WHEN · Wrap EVERY chart, table, stat-strip, and stat-callout block.
 *        NOT for section headings or prose text — those are immediately visible.
 *        Use `delay` prop for staggered stat-strips (increment by 0.1s per item).
 *        Use `disabled` for hero-area charts (above fold · no entrance needed).
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/ChartReveal.tsx`
 *         Consumed by all Ken chart wrappers via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ChartReveal>
 *          <KenColumnChart labels={...} data={...} />
 *        </ChartReveal>
 *
 *        // Staggered stat-strip
 *        {stats.map((s, i) => (
 *          <ChartReveal key={s.id} delay={i * 0.1}>
 *            <StatCallout {...s} />
 *          </ChartReveal>
 *        ))}
 *
 *        // Hero chart (above fold · no entrance)
 *        <ChartReveal disabled>
 *          <HeroChart />
 *        </ChartReveal>
 *        ```
 *
 * A11y · Purely presentational wrapper · no role · no aria attributes.
 *        Children own their own a11y context.
 *        Reduced motion respected via Framer `useReducedMotion()` AND `disabled` prop.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4 (new · did not exist there)
 */

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { KEN_CHART_MOTION } from '../theme/tokens';

export interface ChartRevealProps {
  /** Chart or table or stat-strip to reveal */
  children: ReactNode;
  /** Additional class names on the wrapper div */
  className?: string;
  /**
   * Stagger delay in seconds · for animating sibling items sequentially.
   * Increment by ~0.1s per item in a strip.
   * @default 0
   */
  delay?: number;
  /**
   * Disable entrance animation entirely.
   * Use for above-fold charts where entrance would be invisible anyway.
   * @default false
   */
  disabled?: boolean;
}

/**
 * ChartReveal — viewport-triggered fadeInUp wrapper for chart + table blocks.
 *
 * Falls back to a plain div when `disabled` or when user prefers reduced motion.
 */
export function ChartReveal({
  children,
  className,
  delay = 0,
  disabled = false,
}: ChartRevealProps) {
  const reducedMotion = useReducedMotion();

  // Static wrapper — no animation
  if (disabled || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={KEN_CHART_MOTION.reveal.initial}
      whileInView={KEN_CHART_MOTION.reveal.enter}
      viewport={KEN_CHART_MOTION.reveal.viewport}
      transition={{
        duration: KEN_CHART_MOTION.reveal.duration,
        ease:     KEN_CHART_MOTION.reveal.ease,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
