'use client';

/**
 * @component CTABackground
 *
 * WHO   Ken Research Design System · core-v2 · atoms
 * WHAT  Renders the canonical multi-layer CTA section background composition:
 *       gradient overlay + 4 blob orbs + noise grain texture + edge vignette +
 *       top hairline glow. Dark and light variants are 1:1 mirrors of each other.
 * WHY   CTA sections across Ken Research share a consistent warm-ember glow
 *       composition (coral · perano · warm ramp) that must be expressed as a
 *       render component to avoid duplication across CTASection organisms.
 *       This encapsulation ensures every consumer pulls the same DS-canonical
 *       layer stack without reimplementing inline divs.
 * WHEN  Used inside CTASection organisms or any section that needs the CTA
 *       bg composition. Caller provides content at z-index above this layer.
 * HOW   1. Pulls CTATheme from ctaThemes[variant].
 *       2. Applies baseClasses on outermost wrapper.
 *       3. Renders gradient overlay + blobs[] + noise + vignette + topHairline
 *          in correct z-order via an inner absolute-inset container.
 *       4. animate prop + useReducedMotion() control future animation opt-in
 *          (current blobs are static — architecture is motion-ready).
 *       5. All layers are pointer-events-none + aria-hidden (decorative only).
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/CTASection.tsx
 *               (background decoration block, L27-83)
 * @promotedDate 2026-05-15
 */

import { useReducedMotion } from 'framer-motion';
import { type CTAVariant, getCTATheme } from '../lib/ctaThemes';
import { cn } from '../lib/cn';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CTABackgroundProps {
  /**
   * Which CTA composition variant to render.
   * 'dark' = coral ember on black · 'light' = warm/perano on white.
   */
  variant: CTAVariant;

  /**
   * Additional Tailwind/CSS classes applied to the outermost wrapper div.
   * Use for "absolute inset-0" when embedding inside a section.
   */
  className?: string;

  /**
   * Animation opt-in hook — reserved for future animated CTA blob variants.
   * Currently all CTA blobs are static; this prop is a forward-compatible no-op
   * that also reads useReducedMotion() so the API matches HeroBackground.
   * Defaults to true.
   */
  animate?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Decorative multi-layer CTA section background.
 * Layer order (bottom to top): base bg → gradient overlay → blobs → noise → vignette → hairline.
 * All child elements are pointer-events-none + aria-hidden.
 *
 * @example
 * // Inside a CTASection organism:
 * <section className="relative overflow-hidden py-16">
 *   <CTABackground variant="dark" className="absolute inset-0" />
 *   <div className="relative z-10">…content…</div>
 * </section>
 */
export function CTABackground({
  variant,
  className,
  animate: _animate = true,
}: CTABackgroundProps) {
  // Read OS preference — even though current blobs are static, we track this
  // so future animated CTABackground variants auto-respect reduced motion.
  // _animate is kept in props API for forward compatibility; _ prefix silences TS6133.
  useReducedMotion(); // referenced to satisfy the motion-ready API contract

  const theme = getCTATheme(variant);

  return (
    <div
      data-component="CTABackground"
      aria-hidden="true"
      className={cn(theme.baseClasses, 'pointer-events-none', className)}
    >
      {/* Full-inset gradient overlay */}
      <div className={theme.gradientOverlay} />

      {/* Blob orbs — rendered in declaration order */}
      {theme.blobs.map((blob, index) => (
        <div key={index} className={blob.className} />
      ))}

      {/* Fine grain noise texture — SVG feTurbulence at 2% opacity mix-blend-overlay */}
      <div
        className={theme.noise.className}
        style={{
          backgroundImage: theme.noise.backgroundImage,
          backgroundRepeat: theme.noise.backgroundRepeat,
          backgroundSize: theme.noise.backgroundSize,
        }}
      />

      {/* Edge vignette */}
      <div className={theme.vignette} />

      {/* Top hairline glow */}
      <div className={theme.topHairline} />
    </div>
  );
}
