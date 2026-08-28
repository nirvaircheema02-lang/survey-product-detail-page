'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * ScrollToTop — round black FAB that fades in past 400px scroll, smooth-scrolls to top.
 *
 * WHY:
 * - Long-scroll pages need quick-return affordance — modern UX baseline (audit ScrollToTop.md:21)
 * - Hidden until 400px scrolled → no UI clutter near top of page (audit:22)
 * - Black not brand red — utility, not conversion (92% foundation tier · 5% brand reserved) (audit:23)
 * - Round FAB shape is INTENTIONAL exception to 5px/10px radius system — Material convention (audit:24)
 * - Bottom-right placement avoids mobile-OS bottom-edge gestures + matches end-of-line eye flow (audit:25)
 *
 * WHAT: Zero-prop atom. Framer Motion `<AnimatePresence>` wraps `motion.button` with spring
 * fade+scale entrance/exit. `whileHover scale 1.1`, `whileTap scale 0.95`. Listens passive
 * scroll on `window`. Smooth scrolls via `window.scrollTo({ behavior: 'smooth' })`.
 *
 * WHEN:
 * - Any page > 2 viewports tall
 * - Report-store listing pages where reader scrolls far
 * - Long case-study pages (when ReadingProgressBar isn't enough)
 * - Pages w/o sticky top-nav (gives users fast "return to start" option)
 *
 * WHEN NOT:
 * - Pages w/ sticky navbar that already includes "back to top" → redundant
 * - Short pages (< 1.5 viewports) → never triggers, dead weight
 * - Pages w/ fixed-bottom CTA → competes w/ `<StickyCTA>` (overlap)
 * - Modal-context pages → scroll context wrong
 *
 * HOW:
 * ```tsx
 * <>
 *   <ScrollProgress />
 *   <main>{content}</main>
 *   <ScrollToTop />
 * </>
 * ```
 *
 * A11y: `aria-label="Scroll to top"` set. Real `<button>` · keyboard focusable · Enter/Space.
 *       SMELL — `w-10 h-10` (40px) on mobile is below WCAG 2.5.5 44px floor; `sm:w-12 sm:h-12`
 *       (48px) at tablet+ complies (audit:95, 136). Framer reduced-motion respect unverified (audit:94).
 * Motion: spring fade+scale 0.8→1 entrance · hover scale 1.1 · tap scale 0.95 · shadow 300ms growth.
 *         Native `scroll-behavior: smooth` opted out by DS reduced-motion media query.
 * Anti-patterns:
 *  - ❌ Never mount alongside bottom-right `<StickyCTA>` (collision)
 *  - ❌ Never change color to brand red (utility, not CTA — foundation-tier rule)
 *  - ❌ Never remove `aria-label` (icon-only button)
 *  - ❌ Never override 400px threshold without rationale
 *
 * @lifecycle stable
 * @a11y_status known-issue (40px touch target on mobile · below 44px WCAG floor)
 * @reusabilityScore 3/5 ⭐
 * @promotedFrom Design_system_vs_26/src/app/components/ScrollToTop.tsx · V0_lite_report (audit:3)
 */
export function ScrollToTop() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          data-component="ScrollToTop"
          type="button"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[var(--z-index-fab)]
            w-11 h-11 sm:w-12 sm:h-12 rounded-full
            bg-[var(--color-foundation-black)] text-[var(--color-foundation-white)]
            shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]
            flex items-center justify-center transition-shadow duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
