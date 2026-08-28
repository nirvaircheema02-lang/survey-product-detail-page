/**
 * BodyText — Atom
 *
 * WHAT: Standardised paragraph wrapper for report/editorial body copy.
 *       Two spacing variants: `first` (mt-6 · after a heading) and `follow` (mt-4 · subsequent paragraphs).
 *
 * WHY: V0.2 chapter sections repeat the same paragraph typography + margin pattern across 20+ sections.
 *      Centralising in a single atom prevents font-size drift, colour drift, and spacing drift.
 *      body text = DM Sans · 16px · --leading-relaxed · --black-500.
 *
 * WHEN: Any running prose paragraph inside a section (description · lede · supporting copy).
 *
 * WHEN NOT: Never for headings, labels, badges, stat values, or navigation.
 *           Never for blockquote/pull-quote — use a dedicated molecule.
 *
 * WHERE: SectionHeader description · ChapterSectionTemplate body · case-study paragraphs.
 *
 * HOW:
 * ```tsx
 * // First paragraph after heading — larger top gap
 * <BodyText spacing="first">The Qatar Fresh Herbs Market is valued at $150M…</BodyText>
 *
 * // Subsequent paragraph — standard gap
 * <BodyText>Doha is the dominant city in the market…</BodyText>
 *
 * // Narrow prose column
 * <BodyText className="max-w-prose">…</BodyText>
 * ```
 *
 * A11y: Plain <p> element · inherits document reading order.
 *
 * @promotedFrom projects/V0.2 -for design system/src/app/components/ui/body-text.tsx
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { ReactNode } from 'react';

export interface BodyTextProps {
  /** Paragraph content. */
  children: ReactNode;

  /**
   * Spacing variant.
   * - `'first'` — larger gap above (mt-6) for first paragraph after a heading.
   * - `'follow'` — standard gap above (mt-4) for subsequent paragraphs.
   * @default 'follow'
   */
  spacing?: 'first' | 'follow';

  /** Tailwind utility overrides on the root <p>. */
  className?: string;
}

export function BodyText({
  children,
  spacing = 'follow',
  className = '',
}: BodyTextProps) {
  return (
    <p
      data-component="BodyText"
      className={className}
      style={{
        marginTop: spacing === 'first' ? 'var(--space-6)' : 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)',
        color: 'var(--black-500)',
      }}
    >
      {children}
    </p>
  );
}
