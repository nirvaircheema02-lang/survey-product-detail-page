/**
 * LabelHeadingPair — Molecule
 *
 * WHAT: Canonical section-header composition: SectionLabel (eyebrow) + SectionHeading (h2)
 *       + optional BodyText (lede). Enforces correct inter-element spacing from
 *       SPACING-COMPOSITION-LAYOUT-CANON §1.4.
 *
 * WHY: V0_lite uses this exact three-element block in 10+ places (HeroSection, ChapterMethodology,
 *      KeyStats, FAQSection, CTASection, ReportHighlights…). Every instance has the same
 *      spacing rhythm: mb-3 label → mb-4 heading → lede. Centralising prevents drift and
 *      enforces CANON token spacing.
 *      Law of Pragnanz — reduce cognitive load by making the heading-block a single unit.
 *
 * WHEN: Any section that needs eyebrow + h2 + optional lede (chapter header, section intro,
 *       FAQ header, CTA header).
 *
 * WHEN NOT: Do not use for inline headings without an eyebrow. Do not use as a card title row
 *           (use CardTitleRow or native h3). Do not nest inside an organism that already composes
 *           SectionHeader atom (V0.2 four-prop combo).
 *
 * WHERE: Every chapter section template · HeroSection left-column header · FAQSection header ·
 *        KeyStatsStrip header · MethodologySection header.
 *
 * HOW:
 * ```tsx
 * // Minimal — eyebrow + heading only
 * <LabelHeadingPair
 *   label="CHAPTER 11 - OUR APPROACH"
 *   heading="Research Methodology"
 * />
 *
 * // Full — with lede and custom max-width
 * <LabelHeadingPair
 *   label="FREQUENTLY ASKED"
 *   heading="Frequently Asked Questions"
 *   lede="Everything you need to know about our market research reports."
 *   ledeMaxWidth="max-w-2xl"
 *   align="left"
 * />
 *
 * // Centered (for CTA / cinematic sections)
 * <LabelHeadingPair
 *   label="GET STARTED"
 *   heading="Unlock Full Market Intelligence"
 *   lede="Comprehensive coverage for data-driven decisions."
 *   align="center"
 * />
 * ```
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · recurring 10 places (ChapterMethodology:70-83, FAQSection:65-79, CTASection, HeroSection…)
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */

import type { ReactNode } from 'react';
import { SectionLabel } from '../atoms/SectionLabel';
import { SectionHeading } from '../atoms/SectionHeading';
import { BodyText } from '../atoms/BodyText';
import { cn } from '../lib/cn';

export type LabelHeadingAlign = 'left' | 'center' | 'right';
export type LabelHeadingBackground = 'light' | 'dark';

export interface LabelHeadingPairProps {
  /**
   * Eyebrow text rendered in SectionLabel — uppercase, tracked.
   * Example: "CHAPTER 11 - OUR APPROACH"
   */
  label: string;

  /**
   * Section heading text rendered in SectionHeading (level 2 by default).
   * May contain ReactNode for inline styled spans.
   */
  heading: ReactNode;

  /**
   * Optional lede/description paragraph below the heading.
   * Rendered via BodyText atom with spacing="first".
   */
  lede?: string;

  /**
   * Tailwind class controlling max-width of the lede paragraph.
   * Defaults to "max-w-[50rem]" — canonical V0_lite lede max-width.
   */
  ledeMaxWidth?: string;

  /** Text + element alignment. Defaults to "left". */
  align?: LabelHeadingAlign;

  /**
   * Controls SectionLabel background token pair — "light" for editorial,
   * "dark" for cinematic hero surfaces. Defaults to "light".
   */
  background?: LabelHeadingBackground;

  /**
   * SectionLabel variant. "accent" renders brand-red label.
   * Defaults to "accent" (most common in V0_lite).
   */
  labelVariant?: 'default' | 'accent';

  /** Heading level. Defaults to 2 (section heading). */
  headingLevel?: 1 | 2 | 3;

  /**
   * Optional id forwarded to the heading element · enables organism-level
   * `aria-labelledby` references without wrapper div. Added Batch 3.2c.
   */
  headingId?: string;

  /** Additional className on the root wrapper div. */
  className?: string;
}

/**
 * LabelHeadingPair
 *
 * Composes SectionLabel → SectionHeading → optional BodyText with
 * canonical SPACING-COMPOSITION-LAYOUT-CANON §1.4 inter-element spacing.
 */
export function LabelHeadingPair({
  label,
  heading,
  lede,
  ledeMaxWidth = 'max-w-[50rem]',
  align = 'left',
  background = 'light',
  labelVariant = 'accent',
  headingLevel = 2,
  headingId,
  className,
}: LabelHeadingPairProps) {
  const alignClass =
    align === 'center'
      ? 'text-center items-center'
      : align === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  return (
    <div
      data-component="LabelHeadingPair"
      className={cn('flex flex-col', alignClass, className)}
    >
      {/* Eyebrow label — mb: --pair-label-heading 12px */}
      <div className="inline-flex mb-3">
        <SectionLabel
          background={background}
          variant={labelVariant}
        >
          {label}
        </SectionLabel>
      </div>

      {/* Section heading — mb: --pair-heading-description 16px (when lede follows) */}
      <SectionHeading
        level={headingLevel}
        align={align}
        id={headingId}
        className={lede ? 'mb-4' : undefined}
      >
        {heading}
      </SectionHeading>

      {/* Optional lede paragraph */}
      {lede && (
        <BodyText
          spacing="first"
          className={cn(ledeMaxWidth, align === 'center' && 'mx-auto')}
        >
          {lede}
        </BodyText>
      )}
    </div>
  );
}
