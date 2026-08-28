/**
 * SectionHeader — Atom
 *
 * WHAT: 4-prop composite block: brand-red chapter eyebrow + serif h2 + lede paragraph.
 *       Packages the recurring section-header pattern into a single import.
 *
 * WHY: V0.2 every chapter section opens with chapter label + h2 + description.
 *      Without this atom consumers import OverheadText + SectionHeading + BodyText
 *      separately and often drift from the canonical spacing sequence.
 *      Single atom locks spacing, hierarchy, and token usage in one place.
 *
 * WHEN: Top of any chapter section (Scope · Methodology · Drivers · FAQ · CTA).
 *       Use when you need eyebrow + heading + optional body in the standard rhythm.
 *
 * WHEN NOT: If you need the eyebrow alone → OverheadText.
 *           If you need the heading alone → SectionHeading.
 *           If you need a full section wrapper → compose inside SectionWrapper organism.
 *
 * WHERE: Report PDP chapter sections · Case-study section tops · editorial-light variant.
 *
 * HOW:
 * ```tsx
 * <SectionHeader
 *   chapter="Chapter 2"
 *   title="Market Overview"
 *   heading="The Cold Chain Opportunity in Australia"
 *   description="The Australian cold chain market reached AUD 4.5B in 2024 …"
 * />
 * ```
 *
 * @promotedFrom projects/V0.2 -for design system/src/app/components/SectionHeader.tsx
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  /**
   * Chapter label prefix (e.g. "Chapter 2"). Combined with `title` as "Chapter 2: Market Overview".
   * When omitted, `title` is rendered alone.
   */
  chapter?: string;

  /**
   * Required section label text (e.g. "Market Overview"). Rendered uppercase in brand-red.
   */
  title: string;

  /**
   * Optional JSX heading for rich/multi-line h2 content. Takes precedence over `subtitle`.
   */
  heading?: ReactNode;

  /**
   * Optional plain-text heading. Supports newline (`\n`) for line-break on mobile.
   * Ignored when `heading` is provided.
   */
  subtitle?: string;

  /**
   * Optional lede paragraph below the heading.
   * Rendered in `--text-sm` / `--color-black-500` / `--leading-relaxed`.
   */
  description?: string;

  /** Tailwind utility overrides on the root wrapper. */
  className?: string;
}

export function SectionHeader({
  chapter,
  title,
  heading,
  subtitle,
  description,
  className = '',
}: SectionHeaderProps) {
  const eyebrow = chapter ? `${chapter}: ${title}` : title;

  return (
    <div
      data-component="SectionHeader"
      className={`mb-10 ${className}`}
      style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}
    >
      {/* Eyebrow — brand-red uppercase chapter label */}
      <div className="mb-3">
        <span
          style={{
            color: 'var(--brand-red)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: 'var(--tracking-label-wide)',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Heading — serif h2 */}
      {heading ? (
        <h2
          className="font-serif font-light"
          style={{
            fontSize: 'var(--text-30)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--tracking-display-tight)',
            color: 'var(--black-900)',
          }}
        >
          {heading}
        </h2>
      ) : subtitle ? (
        <h2
          className="font-serif font-light"
          style={{
            fontSize: 'var(--text-30)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--tracking-display-tight)',
            color: 'var(--black-900)',
          }}
        >
          {subtitle.split('\n')[0]}
          {subtitle.includes('\n') && (
            <span className="block">{subtitle.split('\n')[1]}</span>
          )}
        </h2>
      ) : null}

      {/* Description — lede paragraph */}
      {description && (
        <p
          className="max-w-3xl"
          style={{
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--black-500)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
