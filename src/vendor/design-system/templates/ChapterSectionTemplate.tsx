/**
 * ChapterSectionTemplate
 *
 * WHAT · Composition shell for a standard chapter section on a report PDP.
 *        Composes SectionWrapper + Container + section-header block (LabelHeadingPair) +
 *        a named `content` slot + an optional `cta` slot.
 *
 * WHY · Every chapter section follows the same recipe (SPACING-COMPOSITION-LAYOUT-CANON §2.1):
 *       eyebrow → heading → lede → mb-10/12 → content → optional CTA.
 *       Centralising this removes per-section drift (Cat 4.2 / 4.3 / 4.4 anti-patterns).
 *
 * WHEN · Default template for ALL chapter sections in the V1 Product Page (sections 3-27).
 *        Also usable for any long-form section that follows the standard header+content pattern.
 *
 * WHEN NOT · Do NOT use for the Hero section (use HeroCinematicTemplate / HeroEditorialTemplate).
 *            Do NOT use for KeyStatsStrip (no header block needed there).
 *            Do NOT use when organism already owns its SectionWrapper (would double-wrap — Cat 4.5).
 *
 * WHERE · `core-v2/src/templates/ChapterSectionTemplate.tsx`
 *         Consumed by V1 Product Page sections 3–27 and case-study chapter organisms.
 *
 * HOW ·
 * ```tsx
 * <ChapterSectionTemplate
 *   id="market-overview"
 *   background="warm"
 *   label="CHAPTER 08 · MARKET OVERVIEW"
 *   heading="Understanding the Cold Chain Landscape"
 *   lede="An analysis of the market structure, regulatory context, and growth drivers."
 *   content={<MarketOverview data={data} />}
 *   cta={<CTALink href="/download">Download Full Section</CTALink>}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · Container · LabelHeadingPair · BodyText · CTALink (optional slot)
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.1
 */

import type { CSSProperties, ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { cn } from '../lib/cn';

/** Background variants matching SectionWrapper — exposed here for caller convenience */
export type ChapterBg = 'white' | 'warm' | 'black';

export interface ChapterSectionTemplateProps {
  /**
   * HTML id used as anchor target (TOC scroll target).
   * Will have `scroll-margin-top: calc(var(--navbar-height) + 8px)` applied.
   */
  id: string;

  /** Background alternation token. Defaults to 'white'. Alternate per recipe sequence. */
  background?: ChapterBg;

  /**
   * Eyebrow label string — e.g. "CHAPTER 08 · MARKET OVERVIEW".
   * Rendered via LabelHeadingPair → SectionLabel.
   */
  label: string;

  /** Section heading — h2 by default via LabelHeadingPair. */
  heading: string;

  /**
   * Optional heading id forwarded to LabelHeadingPair for aria-labelledby targets
   * (e.g. TOC sidebar links). Defaults to `${id}-heading`.
   */
  headingId?: string;

  /** Optional lede paragraph below the heading. */
  lede?: string;

  /** Main content slot — any organism, chart, card grid, or list. */
  content: ReactNode;

  /**
   * Optional CTA rendered below content — typically a CTALink.
   * Receives `mt-8 md:mt-10` top margin.
   */
  cta?: ReactNode;

  /** Extra className forwarded to the outermost SectionWrapper. */
  className?: string;
}

/**
 * ChapterSectionTemplate — default chapter section shell.
 *
 * Composition: SectionWrapper (spacing=lg) → maxWidth inner div →
 *   LabelHeadingPair (label + heading + optional lede) → mb-10/12 spacer →
 *   content slot → optional cta slot.
 *
 * Scroll anchor: section id receives `scroll-margin-top` inline style matching
 * `--scroll-margin-section` token (72px = navbar-height 64 + 8).
 */
export function ChapterSectionTemplate({
  id,
  background = 'white',
  label,
  heading,
  headingId,
  lede,
  content,
  cta,
  className,
}: ChapterSectionTemplateProps) {
  const resolvedHeadingId = headingId ?? `${id}-heading`;

  return (
    <SectionWrapper
      id={id}
      background={background}
      spacing="lg"
      maxWidth="wide"
      className={className}
      style={{ scrollMarginTop: 'var(--scroll-margin-section, 72px)' } as CSSProperties}
      data-template="ChapterSectionTemplate"
    >
      {/* SECTION HEADER BLOCK — mb-10 md:mb-12 (40–48px per CANON §1.4) */}
      <div className="mb-10 md:mb-12">
        <LabelHeadingPair
          label={label}
          heading={heading}
          headingId={resolvedHeadingId}
          headingLevel={2}
          labelVariant="accent"
          lede={lede}
        />
      </div>

      {/* CONTENT SLOT */}
      <div data-slot="content">{content}</div>

      {/* OPTIONAL CTA */}
      {cta && (
        <div className={cn('mt-8 md:mt-10')} data-slot="cta">
          {cta}
        </div>
      )}
    </SectionWrapper>
  );
}
