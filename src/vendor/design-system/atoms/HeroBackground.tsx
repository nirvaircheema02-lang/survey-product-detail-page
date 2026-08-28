'use client';

/**
 * @component HeroBackground
 *
 * WHO   Ken Research Design System · core-v2 · atoms
 * WHAT  Renders the canonical multi-layer glow blob composition background
 *       for Hero sections. Accepts a variant key and outputs: base bg gradient +
 *       animated glow blob orbs (Framer Motion pulse loops) + noise texture.
 * WHY   Hero section backgrounds are NOT solid colors or simple gradients.
 *       They are multi-layer glow blob compositions per the canonical pattern
 *       established in V0_lite_report-legacy and confirmed as the DS standard
 *       (2026-05-15). Encapsulating render here keeps HeroSection organisms
 *       lean and ensures every consumer pulls the same composition.
 * WHEN  Used inside HeroSection organisms (or any page section that reuses the
 *       hero composition). Renders only decorative layers — caller provides
 *       content z-index above.
 * HOW   1. Pulls HeroTheme from heroThemes[variant].
 *       2. Applies base bg via baseClasses on wrapper div.
 *       3. Renders each glows[] entry as a <motion.div> with the stored
 *          animate + transition objects. Static blobs (empty animation) render
 *          as plain divs for performance.
 *       4. useReducedMotion() disables all animation when OS prefers reduced motion.
 *       5. All layers are pointer-events-none + aria-hidden (decorative only).
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/HeroSection.tsx
 *               (blob compositor pattern, L74-90 + variant config)
 * @promotedDate 2026-05-15
 */

import { motion, useReducedMotion } from 'framer-motion';
import { type HeroVariant, getHeroTheme } from '../lib/heroThemes';
import { cn } from '../lib/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface HeroBackgroundProps {
  /**
   * Which hero composition variant to render.
   * Drives base bg gradient + blob palette + animation timings.
   */
  variant: HeroVariant;

  /**
   * Additional Tailwind/CSS classes applied to the outermost wrapper div.
   * Use for sizing constraints (e.g. "absolute inset-0") when embedding
   * inside a relatively-positioned section.
   */
  className?: string;

  /**
   * Whether to animate the glow blobs with Framer Motion pulse loops.
   * Defaults to true. Automatically disabled when useReducedMotion() is true.
   */
  animate?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Decorative multi-layer glow blob background for Hero sections.
 * All child elements are pointer-events-none + aria-hidden.
 *
 * @example
 * // Inside a HeroSection organism:
 * <section className="relative overflow-hidden">
 *   <HeroBackground variant="darkPremium" className="absolute inset-0" />
 *   <div className="relative z-10">…content…</div>
 * </section>
 */
export function HeroBackground({
  variant,
  className,
  animate = true,
}: HeroBackgroundProps) {
  // Respect OS-level reduced motion preference
  const prefersReduced = useReducedMotion();
  // Effective animation flag: caller opt-out OR OS preference → no animation
  const shouldAnimate = animate && !prefersReduced;

  const theme = getHeroTheme(variant);

  return (
    <div
      data-component="HeroBackground"
      aria-hidden="true"
      className={cn(theme.background, 'pointer-events-none', className)}
    >
      {theme.glows.map((blob, index) => {
        // Determine whether this blob has a meaningful animation
        const hasAnimation =
          shouldAnimate &&
          blob.animation &&
          Object.keys(blob.animation).length > 0;

        if (hasAnimation) {
          return (
            <motion.div
              key={index}
              className={blob.className}
              animate={blob.animation}
              transition={blob.transition}
              style={blob.style}
            />
          );
        }

        // Static blob — render as plain div for performance (no Framer overhead)
        return (
          <div
            key={index}
            className={blob.className}
            style={blob.style}
          />
        );
      })}
    </div>
  );
}
