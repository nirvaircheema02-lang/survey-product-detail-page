'use client';

import { forwardRef, type ReactNode, type Ref, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type TextLinkSize = 'sm' | 'md';

export interface TextLinkProps {
  children: ReactNode;
  /** Renders as <a> when provided */
  href?: string;
  /** Renders as <button> when no href */
  onClick?: () => void;
  /** sm = 13px helper text, md = 14px primary text */
  size?: TextLinkSize;
  /** Optional leading icon element */
  icon?: ReactNode;
  /** Active state — text stays brand red */
  active?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Extra DOM/aria attributes forwarded straight to the underlying element —
 *  needed so this stays usable as a Radix `asChild` trigger (DialogTrigger,
 *  PopoverTrigger, etc.), which clones aria-haspopup/aria-expanded/
 *  aria-controls/data-state onto whatever it wraps. Without spreading these
 *  through, a TextLink-as-trigger would silently lose that wiring. */
type TextLinkRestProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>, keyof TextLinkProps>;

const sizeClass: Record<TextLinkSize, string> = {
  sm: 'text-[var(--typography-size-nav-helper)] leading-[var(--typography-line-height-nav-helper)]',
  md: 'text-[var(--typography-size-nav-primary)] leading-[var(--typography-line-height-nav-primary)]',
};

/**
 * TextLink — inline text link w/ hover color transition.
 *
 * WHY: Navbar links · footer links · breadcrumbs · helper text links need lightweight affordance.
 *      Stronger than InlineLink (which is for body-copy hyperlinks) · weaker than CTALink (which has arrow).
 * WHAT: Renders as `<a>` (w/ `href`) or `<button>` (w/ `onClick`) · 2 sizes (sm 13px helper · md 14px primary).
 * WHEN: Nav links · footer · breadcrumb crumbs · "View report" mini-links · helper-text inline.
 * WHEN NOT: Body-paragraph cross-references (use InlineLink) · primary CTAs (use Button or CTALink).
 * HOW: Color: secondary grey → brand red on hover · active state stays brand red.
 *
 * @promotedFrom topnav-v32/src/design-system/components/TextLink.tsx
 */
export const TextLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, TextLinkProps & TextLinkRestProps>(
  function TextLink(
    { children, href, onClick, size = 'sm', icon, active = false, className, ...rest },
    ref,
  ) {
    const baseCls = cn(
      'inline-flex items-center gap-1 font-[var(--typography-family-body)] font-normal transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2 rounded-[3px]',
      sizeClass[size],
      active
        ? 'text-[var(--color-brand-red)]'
        : 'text-[var(--surface-text-muted)] hover:text-[var(--color-brand-red)]',
      className,
    );

    if (href) {
      return (
        <a
          data-component="TextLink"
          href={href}
          ref={ref as Ref<HTMLAnchorElement>}
          className={baseCls}
          {...rest}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </a>
      );
    }

    return (
      <button
        data-component="TextLink"
        type="button"
        onClick={onClick}
        ref={ref as Ref<HTMLButtonElement>}
        className={cn(baseCls, 'bg-transparent border-none cursor-pointer')}
        {...rest}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  },
);
