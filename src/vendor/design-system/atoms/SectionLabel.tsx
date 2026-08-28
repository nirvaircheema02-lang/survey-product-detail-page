/**
 * SectionLabel
 *
 * WHY · Section identifiers (CHAPTER · STEP · STATUS) need consistent micro-typography with 0.2em tracking +
 *       uppercase — prevents inline drift and contrast failures. Background prop enforces correct token pairs.
 * WHAT · `<p>` (text style) or `<div>` (pill style). All-caps + tracked. Pill variant has 2s Framer shimmer sweep.
 *        Optional pulse dot (live/new indicator) · icon prefix · accent variant (brand-red/coral).
 * WHEN · Section eyebrows · chapter markers in TOC · hero status labels ("NEW" · "LIVE") · step prefixes.
 * WHEN NOT · Count/category pills inside cards → `Badge` · form labels → `<Label>` · headings → `SectionHeading`.
 * WHERE · `SampleReportPreview` chapter prefixes · `HeroSection` status · `ResearchMethodology` step labels ·
 *         `ExtendedTOC` chapter markers.
 * HOW ·
 *   ```tsx
 *   // Eyebrow text above h2
 *   <SectionLabel style="text" background="light">Chapter 01</SectionLabel>
 *   // Live pill on dark hero
 *   <SectionLabel style="pill" background="dark" variant="accent" pulse>Live now</SectionLabel>
 *   // With icon prefix
 *   <SectionLabel icon={<Sparkles size={12} />}>What's new</SectionLabel>
 *   ```
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report
 */
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type SectionLabelStyle = 'text' | 'pill';
export type SectionLabelBackground = 'dark' | 'light';
export type SectionLabelVariant = 'default' | 'accent';

export interface SectionLabelProps {
  children: ReactNode;
  style?: SectionLabelStyle;
  background?: SectionLabelBackground;
  variant?: SectionLabelVariant;
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

const textColor: Record<SectionLabelBackground, Record<SectionLabelVariant, string>> = {
  dark: {
    default: 'text-[var(--semantic-ink-on-dark-body)]',
    accent:  'text-[var(--color-ramp-coral-500)]',
  },
  light: {
    default: 'text-[var(--surface-text-muted)]',
    accent:  'text-[var(--color-brand-red)]',
  },
};

const borderColor: Record<SectionLabelBackground, Record<SectionLabelVariant, string>> = {
  dark: {
    default: 'border-[var(--semantic-hairline-on-dark-default)]',
    accent:  'border-[var(--color-ramp-coral-500)]/30',
  },
  light: {
    default: 'border-[var(--border-default)]',
    accent:  'border-[var(--color-brand-red)]/30',
  },
};

const pulseDotColor: Record<SectionLabelBackground, string> = {
  dark:  'var(--color-ramp-coral-500)',
  light: 'var(--color-brand-red)',
};

const shimmerGradient: Record<SectionLabelBackground, string> = {
  dark:  'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
  light: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
};

/**
 * SectionLabel — all-caps tracked section identifier · text or pill style · light/dark aware.
 *
 * WHY:
 * - Section identifiers (CHAPTER · STEP · STATUS) need consistent micro-typography
 * - All-caps + 0.2em tracking = recognized editorial "label" pattern (vs body text)
 * - Pill variant w/ shimmer sweep adds premium feel for hero/status moments
 * - Background prop forces correct text+border color pairs — prevents low-contrast drift
 * - Pulse dot variant signals "live"/"new" without claiming a Badge slot
 *
 * WHAT: `<span>` (text style) or `<div>` (pill style). Text style: 0.2em tracking,
 * uppercase, optional pulse dot or icon prefix. Pill style: outlined rounded-full
 * w/ 2s shimmer gradient sweep animation (Framer Motion). Light/dark surface aware
 * via background prop. Default text gray · accent variant → brand-red (light) or coral (dark).
 *
 * WHEN:
 * - SampleReportPreview "CHAPTER 01" prefixes
 * - ExtendedTOC chapter markers
 * - HeroSection status labels ("NEW" · "LIVE")
 * - ResearchMethodology "STEP 02" indicators
 * - Section-eyebrow text above SectionHeading
 *
 * WHEN NOT:
 * - Count/category pills inside cards → use `<Badge>` (count anatomy)
 * - Form labels → use `<Label>` (htmlFor semantics)
 * - Page H1/H2 → use `<SectionHeading>` (display typography)
 * - Status with icon AND number → use `<Badge variant="status">`
 *
 * HOW:
 * ```tsx
 * // Eyebrow text above a hero h2
 * <SectionLabel style="text" background="light">Chapter 01</SectionLabel>
 * <SectionHeading level="h2">Methodology</SectionHeading>
 *
 * // Live status pill on dark hero
 * <SectionLabel style="pill" background="dark" variant="accent" pulse>
 *   Live now
 * </SectionLabel>
 *
 * // With icon prefix
 * <SectionLabel icon={<Sparkles size={12} />}>What's new</SectionLabel>
 * ```
 *
 * A11y: Semantic `<span>` / `<div>` · not announced as heading. Use as eyebrow text
 *       PAIRED w/ a real heading. Color contrast: text vs surface bg ≥4.5:1 verified
 *       per surface variant. Pulse dot decorative (color-blind safe via tracking + caps).
 * Motion: Pill variant runs 2s linear infinite shimmer sweep (Framer Motion).
 *         Reduced-motion: Framer respects `useReducedMotion` at DS layer.
 * Anti-patterns:
 *  - ❌ Never use as a heading replacement (visual eyebrow ≠ semantic heading)
 *  - ❌ Never set arbitrary colors via className (background prop owns variant tokens)
 *  - ❌ Never use pill variant for high-density listings (shimmer becomes noise)
 *  - ❌ Never use `pulse` for non-live signals (dilutes "live" meaning)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA
 * @reusabilityScore 5/5 ⭐
 * @promotedFrom V0_lite_report
 */
export function SectionLabel({
  children,
  style = 'text',
  background = 'light',
  variant = 'default',
  icon,
  pulse = false,
  className,
}: SectionLabelProps) {
  const shouldReduceMotion = useReducedMotion();

  if (style === 'pill') {
    return (
      <div data-component="SectionLabel" className={cn('relative inline-block overflow-hidden rounded-full', className)}>
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 -translate-x-full pointer-events-none"
            animate={{ translateX: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            style={{ background: shimmerGradient[background] }}
          />
        )}
        <span
          className={cn(
            'relative inline-flex items-center justify-center',
            'font-[var(--typography-family-body)] font-semibold tracking-[0.2em] uppercase',
            'px-4 py-1.5 rounded-full bg-transparent border',
            textColor[background][variant],
            borderColor[background][variant],
          )}
          // font-size set via inline style, not a `text-[...]` class: tailwind-merge
          // cannot tell a font-size arbitrary value from a color one and silently
          // drops whichever comes first when both start with `text-` (verified against
          // the installed tailwind-merge — this size class was being dropped in favor
          // of the color class every time). Inline style has no such ambiguity.
          style={{ fontSize: 'var(--typography-size-xs)' }}
        >
          {children}
        </span>
      </div>
    );
  }

  return (
    <p
      data-component="SectionLabel"
      className={cn(
        'font-[var(--typography-family-body)] font-semibold tracking-[0.2em] uppercase',
        'flex items-center gap-2',
        textColor[background][variant],
        className,
      )}
      // font-size set via inline style, not a `text-[...]` class — see pill-branch
      // comment above for why (tailwind-merge drops one of two `text-[...]` classes
      // when it can't distinguish a font-size arbitrary value from a color one).
      style={{ fontSize: 'var(--typography-size-xs)' }}
    >
      {pulse && (
        <motion.span
          className="relative flex h-2.5 w-2.5"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: pulseDotColor[background] }}
            animate={shouldReduceMotion ? { scale: 1, opacity: 0.75 } : { scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: pulseDotColor[background] }}
          />
        </motion.span>
      )}
      {icon && !pulse && <span className="inline-flex h-3.5 w-3.5">{icon}</span>}
      <span>{children}</span>
    </p>
  );
}
