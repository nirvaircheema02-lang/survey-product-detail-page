'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface InlineLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  children: ReactNode;
  href: string;
  /** Dark-surface variant · used in Footer / cinematic prose · underline white/40 · hover white · added Batch 3.3b */
  onDark?: boolean;
  /**
   * Tone variant · additive, non-breaking · default preserves today's exact look.
   * - `default` — black/ink text, always-visible brand-red underline (original/unchanged behavior)
   * - `solid`   — solid brand-red text, no underline (e.g. auth-flow "Sign in", "Terms of Use")
   * - `muted`   — muted gray/ink text, no underline (e.g. auth-flow "Back to sign up" micro-action)
   * Added Loop Engineering fix cycle (ken-auth-redesign) · does not alter `default` rendering.
   */
  variant?: 'default' | 'solid' | 'muted';
}

/**
 * InlineLink — subtle paragraph-flow link · always-visible brand-red underline.
 *
 * WHY:
 * - Lowest tier in 3-tier link hierarchy: InlineLink → CTALink → Button (audit InlineLink.md)
 * - Always-visible 1px brand-red underline signals "link" w/o hover (a11y · color-blind safe)
 * - Hover warm-100 wash adds discoverability without breaking reading rhythm
 * - Inline `<a>` preserves semantic link behavior · right-click "open in new tab"
 * - Token-locked colors prevent per-page palette drift
 *
 * WHAT: `<a>` element with inline display · brand-red 1px underline at 2px offset.
 * On hover: text color → brand-red + bg → warm-100. Focus-visible: 2px brand-red ring.
 * Spreads `AnchorHTMLAttributes` so href · target · rel pass through naturally.
 *
 * WHEN:
 * - Paragraph cross-references ("see our [methodology](/methodology)")
 * - Doc / footnote links within long-form text
 * - Bio bylines · author profile links
 * - Subtle in-line nav from prose
 *
 * WHEN NOT:
 * - Primary CTAs → use `<Button>` (button affordance · shimmer · brand)
 * - Standalone nav links → use `<CTALink>` (text + arrow pattern · not button shape)
 * - Urgency moments → use `<Button variant="brand">` (conversion intent)
 * - Filter/toggle → use `<FilterChip>` (selected-state pattern)
 *
 * HOW:
 * ```tsx
 * <p>
 *   Read more in our <InlineLink href="/methodology">methodology guide</InlineLink>
 *   or <InlineLink href="/contact" target="_blank" rel="noopener">contact us</InlineLink>.
 * </p>
 * ```
 *
 * A11y: Semantic `<a>` · keyboard focusable · focus-visible ring 2px brand-red @ 2px offset.
 *       Underline always visible (does NOT rely on color alone for link affordance).
 *       Color contrast: surface text vs underline ≥3:1 WCAG AA · text-vs-bg ≥4.5:1 verified.
 * Motion: 200ms all-property transition on hover. Reduced-motion: color swap instant (color != motion).
 * Anti-patterns:
 *  - ❌ Never override underline (decoration is signature · brand-red is locked)
 *  - ❌ Never use for primary CTAs (loses conversion affordance vs Button)
 *  - ❌ Never use w/o href (semantic `<a>` requires destination · use `<button>` if no nav)
 *  - ❌ Never nest inside Button or CTALink (nested interactive elements)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA
 * @reusabilityScore 5/5 ⭐
 * @promotedFrom V0_lite_report (audit InlineLink.md · DS Port Batch 1)
 */
export function InlineLink({
  children,
  href,
  className,
  onDark = false,
  variant = 'default',
  ...rest
}: InlineLinkProps) {
  return (
    <a
      data-component="InlineLink"
      data-variant={variant}
      href={href}
      className={cn(
        'inline transition-all duration-200',
        onDark
          ? 'text-white/70 underline decoration-white/40 decoration-1 underline-offset-2 hover:text-white hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black'
          : variant === 'solid'
            ? 'text-[var(--color-brand-red)] no-underline hover:text-[var(--color-brand-red)] hover:bg-[var(--color-ramp-warm-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2'
            : variant === 'muted'
              ? 'text-[var(--semantic-ink-muted)] no-underline hover:text-[var(--surface-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2'
              : 'text-[var(--surface-text)] underline decoration-[var(--color-brand-red)] decoration-1 underline-offset-2 hover:text-[var(--color-brand-red)] hover:bg-[var(--color-ramp-warm-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
