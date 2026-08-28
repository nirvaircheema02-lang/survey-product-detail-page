/**
 * OverheadText — Atom
 *
 * WHAT: Brand-red uppercase eyebrow span for "CHAPTER N - LABEL" pattern.
 *       Inline-flex with optional leading icon or sibling element.
 *
 * WHY: Recurring chapter eyebrow across all V0.2 chapter sections.
 *      Standalone atom lets molecules compose without re-implementing typography.
 *      Locks brand-red + uppercase + tracking-label-wide in one place.
 *
 * WHEN: First element in a section header block before h2.
 *       Direct use when SectionHeader composite is too heavy (e.g., molecule headers).
 *
 * WHEN NOT: Use SectionHeader when you need eyebrow + h2 + lede as a unit.
 *           Never use for non-chapter UI labels — use SectionLabel for those.
 *
 * WHERE: Chapter section tops · SectionHeader atom · ChapterSectionTemplate.
 *
 * HOW:
 * ```tsx
 * <OverheadText>CHAPTER 1 - MARKET OVERVIEW</OverheadText>
 * <OverheadText className="mb-2">KEY METRICS</OverheadText>
 * ```
 *
 * @promotedFrom projects/V0.2 -for design system/src/app/components/ui/overhead-text.tsx
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { ReactNode } from 'react';

export interface OverheadTextProps {
  /** Text content — typically "CHAPTER N - LABEL" or a short category label. */
  children: ReactNode;

  /** Tailwind utility overrides on the root span. */
  className?: string;
}

export function OverheadText({ children, className = '' }: OverheadTextProps) {
  return (
    <span
      data-component="OverheadText"
      className={`inline-flex items-center gap-2 ${className}`}
      style={{
        color: 'var(--brand-red)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: 'var(--tracking-label-wide)',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}
