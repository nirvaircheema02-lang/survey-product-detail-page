/**
 * SegmentationSection
 *
 * WHAT · 7-card 2/3/2 staggered segmentation grid with a gradient takeaways card footer.
 *        Row 1: lg:grid-cols-2 (2 cards). Row 2: md:grid-cols-2 lg:grid-cols-3 (3 cards).
 *        Row 3: md:grid-cols-2 (2 cards). Takeaways card spans full width below.
 *
 * WHY · Market segmentation chapters require 7 dimensions rendered as visual cards each
 *       with share data and inline progress bars. A flat list fails hierarchy. The staggered
 *       2/3/2 layout maintains visual rhythm and avoids an awkward 7-col single row.
 *       Law of Proximity — grouped rows = perceived dimensional groupings.
 *
 * WHEN · Report PDP "Market Segmentation" chapter section.
 *        Any section with 6–8 categorical segments where each needs a breakdown card.
 *
 * WHEN NOT · Do not use for fewer than 4 segments (use a 2-col grid or TextCard instead).
 *            Do not use for non-percentage data (use AnalysisCard or IconCard).
 *
 * WHERE · core-v2/src/organisms/SegmentationSection.tsx
 *         Consumer: V0.2 report PDP · report PDP template organisms barrel
 *
 * HOW · Accepts fully typed `SegmentationCardData[]` and `TakeawaysData`. Delegates card
 *       rendering to SegmentationCard molecule (handles icon, items, ProgressBar). Section
 *       header via LabelHeadingPair. Stats strip inline after header. Takeaways card via
 *       Card atom with `--bg-card-takeaways` gradient. No motion inside — parent handles
 *       entrance via FadeInSection or SectionWrapper entrance.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/SegmentationSection.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @token_refactor
 *   V0.2 `max-w-7xl mx-auto px-[84.375px]` → `Container variant="page"` + standard padding
 *   V0.2 `py-20 lg:py-24` → `--section-py-lg` (py-12 md:py-20) per SPACING-CANON §1.1
 *   V0.2 `mb-16` section-header-mb → `--section-header-mb` (40px) per SPACING-CANON §1.4
 *   V0.2 `rounded-[var(--radius-md)]` (V0.2 10px) → `var(--radius-sm)` (core-v2 10px)
 *   V0.2 inline style gradient bg → `--bg-card-takeaways` token
 *   V0.2 `text-lg text-[var(--black-900)]` → `var(--text-md)` + `var(--black-900)`
 *   V0.2 `text-sm text-[var(--black-500)]` → `var(--text-xs)` + `var(--black-500)`
 *   V0.2 `text-base` (V0.2 14px for takeaways h4) → `var(--text-sm)` (16px — close enough)
 */

'use client';

import { type ReactNode } from 'react';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { SegmentationCard, type SegmentationItem } from '../molecules/SegmentationCard';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Data for a single segmentation card */
export interface SegmentationCardData {
  /** Icon element (Lucide, Phosphor, or any ReactNode) */
  icon: ReactNode;
  /** Card title (segment dimension label) */
  title: string;
  /** Card subtitle / brief description of the dimension */
  description?: string;
  /** Segmentation items with share percentages */
  items: SegmentationItem[];
}

/** Inline stat displayed in the section header strip */
export interface SegmentationStat {
  /** Formatted stat value (e.g., "7", "78%") */
  value: string;
  /** Stat label below the value */
  label: string;
}

/** Data for the gradient takeaways footer card */
export interface TakeawayPoint {
  /** Takeaway heading (h4) */
  heading: string;
  /** Takeaway body text */
  body: string;
}

export interface SegmentationSectionProps {
  /** Section id for scroll-spy and anchor links. @default "segmentation" */
  id?: string;
  /** Eyebrow / overhead label, e.g. "CHAPTER 5 - Industrial Analysis" */
  label: string;
  /** Section heading — accepts ReactNode for inline block spans */
  heading: ReactNode;
  /** Optional lede paragraph below heading */
  lede?: string;
  /** Optional stats shown in header strip (border-top row) — max 3 recommended */
  stats?: SegmentationStat[];
  /**
   * Array of 7 segmentation card data items.
   * Laid out as rows: [2 cards] / [3 cards] / [2 cards].
   * Fewer or more items are tolerated but visual layout is optimised for 7.
   */
  cards: SegmentationCardData[];
  /** Two-column takeaways card at footer. If omitted, footer card is hidden. */
  takeaways?: {
    heading: string;
    subheading: string;
    points: TakeawayPoint[];
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * SegmentationSection — 7-card 2/3/2 market segmentation organism.
 * Composes LabelHeadingPair + SegmentationCard(×7) + gradient takeaways card.
 */
export function SegmentationSection({
  id = 'segmentation',
  label,
  heading,
  lede,
  stats,
  cards,
  takeaways,
}: SegmentationSectionProps) {
  // Split cards into rows: [0,1] / [2,3,4] / [5,6]
  const row1 = cards.slice(0, 2);
  const row2 = cards.slice(2, 5);
  const row3 = cards.slice(5, 7);

  return (
    <section
      id={id}
      aria-label={typeof heading === 'string' ? heading : label}
      className="py-12 md:py-20 bg-white"
    >
      <Container maxWidth="page">
        {/* ── Section header ── */}
        <div style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}>
          <LabelHeadingPair
            label={label}
            heading={heading}
            lede={lede}
            ledeMaxWidth="max-w-3xl"
          />

          {/* Stats strip */}
          {stats && stats.length > 0 && (
            <div
              className="grid grid-cols-2 md:flex md:items-baseline gap-6 md:gap-10 lg:gap-14"
              style={{
                paddingTop: 'var(--space-10, 2.5rem)',
                marginTop: 'var(--space-10, 2.5rem)',
                borderTop: '1px solid var(--black-200)',
              }}
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <p
                    className="tabular-nums font-bold"
                    style={{
                      fontSize: 'var(--text-24, 1.5rem)',
                      color: 'var(--black-900)',
                      letterSpacing: 'var(--tracking-display-tight)',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
                      marginTop: 'var(--space-1, 0.25rem)',
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Row 1: 2 cards ── */}
        {row1.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {row1.map((card, i) => (
              <SegmentationCard
                key={i}
                icon={card.icon}
                title={card.title}
                description={card.description}
                items={card.items}
              />
            ))}
          </div>
        )}

        {/* ── Row 2: 3 cards ── */}
        {row2.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {row2.map((card, i) => (
              <SegmentationCard
                key={i}
                icon={card.icon}
                title={card.title}
                description={card.description}
                items={card.items}
              />
            ))}
          </div>
        )}

        {/* ── Row 3: 2 cards ── */}
        {row3.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {row3.map((card, i) => (
              <SegmentationCard
                key={i}
                icon={card.icon}
                title={card.title}
                description={card.description}
                items={card.items}
              />
            ))}
          </div>
        )}

        {/* ── Takeaways card ── */}
        {takeaways && (
          <div
            className="mt-12 border"
            style={{
              background: 'var(--bg-card-takeaways)',
              borderColor: 'rgba(226, 228, 253, 0.5)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-6, 1.5rem)',
            }}
          >
            {/* Header row */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ marginBottom: 'var(--space-6, 1.5rem)' }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--black-900)',
                    marginBottom: 'var(--space-1, 0.25rem)',
                  }}
                >
                  {takeaways.heading}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--black-500)',
                  }}
                >
                  {takeaways.subheading}
                </p>
              </div>
            </div>

            {/* Two-column points */}
            <div className="grid md:grid-cols-2 gap-6">
              {takeaways.points.map((point, i) => (
                <div
                  key={i}
                  className="border"
                  style={{
                    backgroundColor: 'var(--white)',
                    borderColor: 'var(--black-200)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-4, 1rem)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--black-900)',
                      marginBottom: 'var(--space-2, 0.5rem)',
                    }}
                  >
                    {point.heading}
                  </h4>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--black-500)',
                    }}
                  >
                    {point.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
