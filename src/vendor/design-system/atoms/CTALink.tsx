'use client';

import {
  forwardRef,
  type ReactNode,
  type MouseEvent,
  type Ref,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { AnimatedArrow } from './AnimatedArrow';
import { useShimmer } from '../hooks/useShimmer';
import { cn } from '../lib/cn';

export type CTALinkVariant = 'default' | 'brand';
export type CTALinkSize = 'sm' | 'md' | 'lg';

export interface CTALinkProps {
  children: ReactNode;
  /** Target href · optional · falls back to button-role if absent + onClick provided */
  href?: string;
  variant?: CTALinkVariant;
  size?: CTALinkSize;
  /** Render against dark surface · inverts text (white/70 → white hover) · arrow stays brand-red on default · per RS-legacy onDark pattern */
  onDark?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

/** Extra DOM/aria attributes forwarded straight to the underlying element —
 *  needed so this stays usable as a Radix `asChild` trigger (DialogTrigger,
 *  PopoverTrigger, TooltipTrigger, etc.), which clones aria-haspopup/
 *  aria-expanded/aria-controls/data-state onto whatever it wraps AND attaches a
 *  ref for focus-return on close. Without forwarding these through, a
 *  CTALink-as-trigger silently loses that wiring. Mirrors the same fix already
 *  applied to `TextLink`. Purely additive — every existing prop keeps its
 *  current behaviour and defaults. */
type CTALinkRestProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  keyof CTALinkProps
>;

const sizeClass: Record<CTALinkSize, string> = {
  sm: 'text-[var(--typography-size-sm)]',
  md: 'text-[var(--typography-size-base)]',
  lg: 'text-[var(--typography-size-lg)]',
};

const arrowSize: Record<CTALinkSize, number> = { sm: 16, md: 18, lg: 20 };

/**
 * CTALink — middle-tier link (between InlineLink and Button).
 *
 * WHY: Forms · page redirects · high-priority lightweight actions need text+arrow
 *      unified-hover affordance · lighter than Button · stronger than InlineLink.
 * WHAT: Text + animated arrow w/ unified hover zone · 2 variants (default black · brand red).
 * WHEN: Exploratory navigation ("Learn more →" · "View methodology →") · form/redirect CTAs.
 * WHEN NOT: Paragraph cross-references (use InlineLink) · primary conversion CTAs (use Button variant="brand") · low-priority nav.
 * HOW: Unified hover state — text gradient + AnimatedArrow trigger together · respects reduced-motion.
 *
 * @promotedFrom V0_lite_report
 */
export const CTALink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  CTALinkProps & CTALinkRestProps
>(function CTALink(
  {
    children,
    href,
    variant = 'default',
    size = 'md',
    onDark = false,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const { isHovering, handleMouseEnter, handleMouseLeave } = useShimmer();

  /* Color resolution · canonical per RS-legacy CTALink (corrected 2026-05-15 · NO underline · underline reserved for InlineLink in-paragraph only):
     - onDark · text white/70 → white hover · arrow white/70 → white hover
     - light default · text black/60 → brand-red hover · arrow black → brand-red hover
     - light brand · text/arrow always brand-red */
  const textColorStyle: React.CSSProperties = onDark
    ? { color: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)' }
    : variant === 'brand'
      ? { color: 'var(--brand-red)' }
      : { color: isHovering ? 'var(--brand-red)' : 'rgba(0,0,0,0.6)' };

  const resolvedArrowColor: 'white' | 'black' | 'brand' = onDark
    ? 'white'
    : variant === 'brand' || isHovering
      ? 'brand'
      : 'black';

  const commonClass = cn(
    'group inline-flex items-center gap-2 font-medium tracking-[0.0875px]',
    'transition-all duration-300 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 rounded-sm',
    sizeClass[size],
    className,
  );

  const inner = (
    <>
      <span
        className="transition-colors duration-200"
        style={textColorStyle}
      >
        {children}
      </span>
      <AnimatedArrow size={arrowSize[size]} color={resolvedArrowColor} isHovered={isHovering} />
    </>
  );

  if (href) {
    return (
      <a
        data-component="CTALink"
        /* rest spread FIRST so the atom keeps ownership of its own hover
           handlers / className / href — consumers can only add attributes,
           never hijack the shimmer-hover contract. */
        {...rest}
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={commonClass}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      data-component="CTALink"
      {...rest}
      type="button"
      ref={ref as Ref<HTMLButtonElement>}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={commonClass}
    >
      {inner}
    </button>
  );
});
