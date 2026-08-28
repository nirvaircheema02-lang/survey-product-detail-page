'use client';

import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/cn';

export type AnimatedArrowColor = 'white' | 'black' | 'brand';

export interface AnimatedArrowProps {
  size?: number;
  color?: AnimatedArrowColor;
  isHovered?: boolean;
  /** Animation duration in ms. Default 300 (= --duration-normal). CTALink uses 250. */
  duration?: number;
}

const colorClass: Record<AnimatedArrowColor, string> = {
  white: 'text-[var(--color-foundation-white)]',
  black: 'text-[var(--color-foundation-black)]',
  brand: 'text-[var(--color-brand-red)]',
};

/**
 * AnimatedArrow — 2-arrow replacement system signaling forward momentum on urgency CTAs.
 *
 * WHY:
 * - Static arrows feel inert next to shimmer-CTAs — momentum mismatch (audit AnimatedArrow.md)
 * - 2-arrow swap creates "the arrow flies out · a new one arrives" — perceived urgency
 * - ↗ up-right direction = forward/upward progress visual metaphor (vs ↑ or →)
 * - Pure CSS transition (no Framer) keeps bundle weight off conversion-critical CTAs
 * - `motion-reduce:transition-none` respects reduced-motion at component level
 *
 * WHAT: Span container w/ 2 absolutely-positioned `ArrowUpRight` icons. When `isHovered`,
 * first arrow translates `+150% −150%` w/ opacity 0 (flies away ↗); second arrow translates
 * from `−150% +150%` to origin w/ opacity 1 (arrives from below-left). 300ms ease-out.
 *
 * WHEN:
 * - Urgency CTAs paired w/ shimmer (form submit · checkout · urgency redirects)
 * - Lead-form primary submit buttons
 * - Inline links in narrative copy where motion = "take action now"
 *
 * WHEN NOT:
 * - Standard `<Button>` icons → use Button's built-in `icon` prop (no replacement animation)
 * - Static nav links → use plain Lucide icon
 * - Decorative arrows in illustrations → use Lucide directly
 * - Pages w/ heavy motion budget already spent → omit to avoid visual noise
 *
 * HOW:
 * ```tsx
 * const [hovered, setHovered] = useState(false);
 * <button
 *   onMouseEnter={() => setHovered(true)}
 *   onMouseLeave={() => setHovered(false)}
 *   className="bg-[var(--color-brand-red)] text-white px-6 py-3"
 * >
 *   <span>Book a call</span>
 *   <AnimatedArrow size={20} color="white" isHovered={hovered} />
 * </button>
 * ```
 *
 * A11y: Decorative · `aria-hidden` implicit. Parent button must carry semantic label.
 *       Color tokens give ≥4.5:1 contrast on intended surfaces.
 * Motion: 300ms ease-out · 2-arrow opacity+translate swap · `motion-reduce:transition-none`
 *         opts out fully (no animation when user prefers reduced motion).
 * Anti-patterns:
 *  - ❌ Never use w/o a parent hover-state owner (`isHovered` must be controlled)
 *  - ❌ Never use inside Button (Button has its own icon system — double-stack)
 *  - ❌ Never animate via `:hover` CSS alone (touch devices have no hover)
 *  - ❌ Never set arbitrary colors via className (use `color` prop · brand-locked tokens)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom V0_lite_report (audit AnimatedArrow.md · DS Port Batch 1)
 */
export function AnimatedArrow({
  size = 20,
  color = 'white',
  isHovered = false,
  duration = 300,
}: AnimatedArrowProps) {
  /* Use CSS transition-duration inline when duration !== 300 (non-default).
     Default 300ms = Tailwind duration-300 class (no inline needed). */
  const durationStyle = duration !== 300 ? { transitionDuration: `${duration}ms` } : undefined;

  return (
    <span
      data-component="AnimatedArrow"
      className="relative inline-block overflow-visible align-middle"
      style={{ width: size, height: size }}
    >
      <ArrowUpRight
        size={size}
        strokeWidth={2}
        className={cn(
          'absolute top-0 left-0 block transition-all duration-300 ease-out motion-reduce:transition-none',
          colorClass[color],
          isHovered
            ? 'translate-x-[150%] -translate-y-[150%] opacity-0'
            : 'translate-x-0 translate-y-0 opacity-100',
        )}
        style={durationStyle}
      />
      <ArrowUpRight
        size={size}
        strokeWidth={2}
        className={cn(
          'absolute top-0 left-0 block transition-all duration-300 ease-out motion-reduce:transition-none',
          colorClass[color],
          isHovered
            ? 'translate-x-0 translate-y-0 opacity-100'
            : '-translate-x-[150%] translate-y-[150%] opacity-0',
        )}
        style={durationStyle}
      />
    </span>
  );
}
