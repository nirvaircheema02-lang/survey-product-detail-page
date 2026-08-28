/**
 * MultiCardGridTemplate
 *
 * WHAT · Composition shell for the 2/3/2 staggered segmentation card grid.
 *        Accepts a cards array split into 3 rows (2 + 3 + 2) plus optional footer
 *        takeaways card. LabelHeadingPair header above the grid.
 *
 * WHY · The 2/3/2 stagger grid (CANON §2.8) is the canonical Segmentation section layout.
 *       Centralising the row-split logic prevents each consumer re-implementing the
 *       `slice()` arithmetic and responsive grid class set.
 *
 * WHEN · Report PDP Segment Intelligence section (section 13).
 *        Any section with 7 categorised cards in a staggered-grid presentation.
 *
 * WHEN NOT · Fewer than 5 or more than 7 cards → use a uniform 3-col grid.
 *            Cards with heterogeneous types → custom grid.
 *
 * WHERE · `core-v2/src/templates/MultiCardGridTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <MultiCardGridTemplate
 *   id="segment-intelligence"
 *   background="white"
 *   label="CHAPTER 13 · SEGMENT INTELLIGENCE"
 *   heading="Cold Chain Market Segments"
 *   cards={segmentCards}         // 7 items
 *   takeaways={takeawayItems}    // optional 2-col footer
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · LabelHeadingPair · SegmentationCard · SegmentationSection
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.8
 */

import type { CSSProperties } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { SegmentationCard, type SegmentationCardProps } from '../molecules/SegmentationCard';

export type MultiCardBg = 'white' | 'warm';

export interface TakeawayItem {
  /** Short takeaway label */
  label: string;
  /** Short description or metric */
  value: string;
}

export interface MultiCardGridTemplateProps {
  /** HTML id for anchor scroll */
  id: string;

  /** Background variant. Defaults to 'white'. */
  background?: MultiCardBg;

  /** Eyebrow label */
  label: string;

  /** Section h2 heading */
  heading: string;

  /** Optional lede paragraph */
  lede?: string;

  /**
   * Array of card props — exactly 7 items for canonical 2/3/2 pattern.
   * Also works with 5 items (2/3 rows) or 6 items (3/3 rows).
   * Fewer than 5 → consider a uniform 3-col grid instead.
   */
  cards: SegmentationCardProps[];

  /**
   * Optional footer takeaways — rendered as a 2-col gradient card below the grid.
   * Per CANON §2.8 TakeawaysCard pattern.
   */
  takeaways?: TakeawayItem[];

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * MultiCardGridTemplate — 2/3/2 staggered segmentation grid shell.
 *
 * Splits cards array into rows:
 *   - 7 items → rows [2, 3, 2]
 *   - 6 items → rows [3, 3]
 *   - 5 items → rows [2, 3]
 *   - other   → single uniform grid (md:grid-cols-3)
 *
 * Optional footer takeaways rendered as a gradient callout card per CANON §2.8.
 */
export function MultiCardGridTemplate({
  id,
  background = 'white',
  label,
  heading,
  lede,
  cards,
  takeaways,
  className,
}: MultiCardGridTemplateProps) {
  // Row split logic — canonical 2/3/2
  const rows = splitIntoRows(cards);

  return (
    <SectionWrapper
      id={id}
      background={background}
      spacing="lg"
      maxWidth="wide"
      className={className}
      style={{ scrollMarginTop: 'var(--scroll-margin-section, 72px)' } as CSSProperties}
      data-template="MultiCardGridTemplate"
    >
      {/* SECTION HEADER BLOCK */}
      <div className="mb-10 md:mb-12">
        <LabelHeadingPair
          label={label}
          heading={heading}
          headingId={`${id}-heading`}
          headingLevel={2}
          labelVariant="accent"
          lede={lede}
        />
      </div>

      {/* STAGGERED GRID — space-y-6 between rows */}
      <div className="space-y-6" data-slot="card-grid">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className={rowGridClass(row.length)}
          >
            {row.map((card, cardIdx) => (
              <SegmentationCard key={cardIdx} {...card} />
            ))}
          </div>
        ))}
      </div>

      {/* OPTIONAL FOOTER TAKEAWAYS CARD */}
      {takeaways && takeaways.length > 0 && (
        <div
          className="mt-6 rounded-[var(--radius-sm,10px)] p-6 md:p-8"
          style={{ background: 'var(--bg-card-takeaways, linear-gradient(135deg, var(--color-ramp-warm-300), var(--color-ramp-warm-200)))' }}
          data-slot="takeaways"
          aria-label="Key takeaways"
        >
          <p
            className="text-xs uppercase tracking-[var(--tracking-label-x-wide,0.15em)] text-[var(--color-ramp-coral-600,var(--brand-red))] font-semibold mb-4"
          >
            Key Takeaways
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {takeaways.map((t, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--brand-red)]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--color-foundation-black)]">{t.label}</p>
                  <p className="text-xs text-[var(--black-500,var(--color-secondary))] mt-0.5">{t.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Split cards array into rows per canonical 2/3/2 pattern.
 * 7 → [2,3,2] · 6 → [3,3] · 5 → [2,3] · other → single array
 */
function splitIntoRows<T>(cards: T[]): T[][] {
  const n = cards.length;
  if (n === 7) return [cards.slice(0, 2), cards.slice(2, 5), cards.slice(5, 7)];
  if (n === 6) return [cards.slice(0, 3), cards.slice(3, 6)];
  if (n === 5) return [cards.slice(0, 2), cards.slice(2, 5)];
  return [cards];
}

/**
 * Tailwind grid class per row length.
 * 2 items → lg:2-col · 3 items → md:2-col lg:3-col · other → 3-col
 */
function rowGridClass(count: number): string {
  if (count === 2) return 'grid lg:grid-cols-2 gap-6';
  if (count === 3) return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
  return 'grid md:grid-cols-3 gap-6';
}

// Type guard prevents ReactNode slot — TakeawayItem[] is data only
export type { TakeawayItem as MultiCardTakeawayItem };

// Re-export for consumers that want to type their card data without importing molecule
export type { SegmentationCardProps as MultiCardItem };
