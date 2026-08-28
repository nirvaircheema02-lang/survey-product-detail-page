/**
 * Card
 *
 * WHY · Content blocks need consistent surface/border/shadow/radius. Raw `<div>` = drift on every variant.
 *       Provides 3 fill variants with token-locked radius and optional interactive semantics.
 * WHAT · Renders `div|article|section` with variant (white · warm · outlined) · padding (none/sm/md/lg) ·
 *        shadow (none/sm/md/lg) · hover lift · optional `onClick` (auto adds role=button + keyboard) · `aria-label`.
 * WHEN · Report cards · stat panels · highlight blocks · feature surfaces · any bordered content container.
 * WHEN NOT · Page section wrapping → `SectionWrapper` · full molecule card layouts → `ReportCard` / `SurveyCard`.
 * WHERE · Used as base surface in report-store and case-study templates. Wrapped by `ReportCard` molecules.
 * HOW ·
 *   ```tsx
 *   // Static content card
 *   <Card variant="white" padding="md" shadow="sm">Content here</Card>
 *   // Interactive clickable card (auto gets role=button + keyboard)
 *   <Card variant="outlined" onClick={handleClick} aria-label="View report detail">...</Card>
 *   // Warm break card with no padding (nested layout)
 *   <Card variant="warm" padding="none">...</Card>
 *   ```
 *
 * @reusabilityScore 4
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report
 */
'use client';

import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import { cn } from '../lib/cn';

export type CardVariant = 'white' | 'warm' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardElement = 'div' | 'article' | 'section';

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
  hover?: boolean;
  className?: string;
  id?: string;
  /** HTML element (default: 'div') */
  as?: CardElement;
  /** Inline style override */
  style?: CSSProperties;
  /** Click handler — when set, card becomes button-like w/ pointer cursor */
  onClick?: (e: MouseEvent) => void;
  /** ARIA label (use when card is clickable / interactive) */
  'aria-label'?: string;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

const variantClass: Record<CardVariant, string> = {
  white:    'bg-[var(--color-foundation-white)] border border-[var(--border-soft)]',
  warm:     'bg-[var(--color-ramp-warm-300)] border border-[var(--color-ramp-warm-500)]',
  outlined: 'bg-transparent border border-[var(--border-default)]',
};

const paddingClass: Record<CardPadding, string> = {
  none: '',
  sm:   'p-[var(--spacing-4)]',  // 16px
  md:   'p-[var(--spacing-6)]',  // 24px
  lg:   'p-[var(--spacing-8)]',  // 32px
};

const shadowClass: Record<CardShadow, string> = {
  none: '',
  sm:   'shadow-[var(--shadow-sm)]',
  md:   'shadow-[var(--shadow-md)]',
  lg:   'shadow-[var(--shadow-lg)]',
};

/**
 * Card — surface primitive for content blocks.
 *
 * WHY: Content blocks need consistent surface · border · shadow · radius. Inline div = drift.
 * WHAT: Variants `white` (default) · `warm` (warm-300 break) · `outlined` (no fill). Radius locked to `--radius-card` (10px).
 *      Supports `padding="none"|"sm"|"md"|"lg"` · optional `onClick` (becomes button) · `as: div|article|section` · `aria-label`.
 * WHEN: Report cards · stat cards · highlight cards · feature blocks · any bordered content surface.
 * WHEN NOT: Section wrapping (use `SectionWrapper`) · listings (use molecules like `ReportCard`).
 * HOW: Composable · accepts children. `padding="none"` for nested layouts. Auto role=button + tabIndex + Enter/Space when `onClick` set.
 *
 * @promotedFrom V0_lite_report
 * @apiExtended 2026-05-13 — DS Port Batch 5 · added padding=none · onClick · style · as · aria-label
 */
export function Card({
  children,
  variant = 'white',
  padding = 'md',
  shadow = 'md',
  hover = false,
  className,
  id,
  as: Component = 'div',
  style,
  onClick,
  'aria-label': ariaLabel,
  ...dataProps
}: CardProps) {
  const isInteractive = typeof onClick === 'function';

  return (
    <Component
      data-component="Card"
      {...dataProps}
      id={id}
      className={cn(
        'rounded-[var(--radius-card)]',
        variantClass[variant],
        paddingClass[padding],
        shadowClass[shadow],
        hover && 'transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5',
        isInteractive && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-red)]',
        className,
      )}
      style={style}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as unknown as MouseEvent);
              }
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
}
