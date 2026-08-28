/**
 * GrowthDriversChallenges
 *
 * WHAT · 3-column IconCard organism presenting Growth Drivers, Challenges, and
 *        Opportunities for a market chapter. Each column is an IconCard with nested
 *        topic entries (h4 + paragraph + bullet list). Grid: md:grid-cols-2 xl:grid-cols-3.
 *
 * WHY · Market research PDPs require a dense, scannable view of the three core competitive
 *       forces. Flat bullet lists lose hierarchy. Three icon-led columns with nested topics
 *       apply Gestalt proximity + similarity to group related items visually. Each column
 *       has a distinct semantic color (green/rose/amber) per category.
 *
 * WHEN · Report PDP "Growth Drivers, Challenges & Opportunities" chapter.
 *        Any 3-force competitive analysis section.
 *
 * WHEN NOT · Do not use for more than 3 categories (add a 4th → use SegmentationSection).
 *            Do not use for non-comparative content (use FAQSection or IconCard list).
 *
 * WHERE · core-v2/src/organisms/GrowthDriversChallenges.tsx
 *         Consumer: V0.2 report PDP · report PDP template
 *
 * HOW · Three `ColumnData` items with `category` controlling semantic color. Each column
 *       renders `topics` as nested h4+p+ul blocks inside IconCard children slot.
 *       Color mapping: "drivers" → green-600 icon; "challenges" → rose-600 (NOT brand-red
 *       per ANTI-PATTERNS rule 19 + TOKEN-GAP-REPORT §4 rule 13); "opportunities" → amber-400.
 *       Stats strip after header (border-top). No card-level animation — parent handles.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/GrowthDriversChallenges.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @token_refactor
 *   V0.2 `py-24 lg:py-32` → `py-12 md:py-20` per SPACING-CANON §1.1 (--section-py-lg)
 *   V0.2 `max-w-7xl px-[84.375px]` → Container variant="page"
 *   V0.2 `mb-16` → --section-header-mb (2.5rem)
 *   V0.2 `font-bold tracking-widest uppercase style={{ fontSize:'13px' }}` eyebrow → LabelHeadingPair
 *   V0.2 `text-[48px] tracking-tight` → var(--text-3xl) (48.8px · closest) + --tracking-display-tight
 *   V0.2 `text-[16px] leading-relaxed` → var(--text-sm) + var(--leading-relaxed)
 *   V0.2 `text-2xl lg:text-3xl font-bold tracking-tight` stat value → var(--text-24) / var(--text-30)
 *   V0.2 `text-sm mt-1.5` stat label → var(--text-xs) + mt-1.5
 *   V0.2 `var(--red-600)` for challenge icons → `var(--rose-600)` (rule 19 anti-pattern · brand-red CTA only)
 *   V0.2 `text-[#171717]` h4 → var(--black-900)
 *   V0.2 `text-[#737373]` body → var(--black-500)
 *   V0.2 hardcoded inline style pt-10 → var(--space-10)
 *   V0.2 `border-[#e5e5e5]` → var(--black-200)
 *   V0.2 `text-sm text-[#737373]` bullets → var(--text-xs) + var(--black-500)
 */

'use client';

import { type ReactNode } from 'react';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { IconCard } from '../molecules/IconCard';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Category determines the semantic icon color for the column */
export type ColumnCategory = 'drivers' | 'challenges' | 'opportunities';

/** A single topic block nested inside a column */
export interface TopicItem {
  /** Topic heading (h4) */
  heading: string;
  /** Short topic description paragraph */
  description: string;
  /** Bullet list items below the description */
  bullets?: string[];
}

/** Data for one column (one of the three forces) */
export interface ColumnData {
  /**
   * Category — controls semantic icon and bullet color.
   * drivers → green-600 · challenges → rose-600 (NOT brand-red) · opportunities → amber-400
   */
  category: ColumnCategory;
  /** Icon element (Lucide/Phosphor — sized at size-5 in V0.2 canonical) */
  icon: ReactNode;
  /** Column heading (card title) */
  title: string;
  /** Nested topic entries */
  topics: TopicItem[];
}

/** Inline stat for the header strip */
export interface GDCStatItem {
  value: string;
  label: string;
}

export interface GrowthDriversChallengesProps {
  /** Section id for scroll-spy. @default "drivers" */
  id?: string;
  /** Eyebrow label, e.g. "CHAPTER 7 - Growth Drivers, Challenges & Opportunities" */
  label: string;
  /** Section heading — ReactNode for inline block spans */
  heading: ReactNode;
  /** Optional lede paragraph */
  lede?: string;
  /** Optional stats for header strip — max 3 */
  stats?: GDCStatItem[];
  /**
   * Exactly 3 column data items: [drivers, challenges, opportunities].
   * Order matches the xl:grid-cols-3 layout.
   */
  columns: ColumnData[];
}

// ─── Color map ───────────────────────────────────────────────────────────────

const categoryIconColor: Record<ColumnCategory, string> = {
  drivers:       'var(--green-600)',
  challenges:    'var(--rose-600)',   // ANTI-PATTERN 19: never brand-red for non-CTA
  opportunities: 'var(--amber-400)',
};

const categoryBulletColor: Record<ColumnCategory, string> = {
  drivers:       'var(--green-600)',
  challenges:    'var(--rose-600)',
  opportunities: 'var(--amber-400)',
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * GrowthDriversChallenges — 3-column IconCard organism for market force analysis.
 * Composes LabelHeadingPair + IconCard(×3) with nested topic blocks.
 * Challenge icon uses --rose-600 (not brand-red) per rule 19.
 */
export function GrowthDriversChallenges({
  id = 'drivers',
  label,
  heading,
  lede,
  stats,
  columns,
}: GrowthDriversChallengesProps) {
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
              style={{
                paddingTop: 'var(--space-10, 2.5rem)',
                marginTop: 'var(--space-10, 2.5rem)',
                borderTop: '1px solid var(--black-200)',
              }}
            >
              {/* Desktop */}
              <div className="hidden md:flex items-baseline gap-10 lg:gap-14">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-10 lg:gap-14">
                    <div>
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
                          marginTop: '0.375rem',
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                    {i < stats.length - 1 && (
                      <div
                        className="w-px h-8 self-center"
                        style={{ backgroundColor: 'var(--black-300)' }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:hidden">
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
            </div>
          )}
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {columns.map((col, i) => {
            const iconColor = categoryIconColor[col.category];
            const bulletColor = categoryBulletColor[col.category];

            return (
              <IconCard
                key={i}
                icon={col.icon}
                title={col.title}
                iconColor={iconColor}
                showIconBg={false}
              >
                <div className="space-y-6">
                  {col.topics.map((topic, j) => (
                    <div key={j}>
                      <h4
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--black-900)',
                          marginBottom: 'var(--space-2, 0.5rem)',
                        }}
                      >
                        {topic.heading}
                      </h4>
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          lineHeight: 'var(--leading-relaxed)',
                          color: 'var(--black-500)',
                          marginBottom: topic.bullets && topic.bullets.length ? 'var(--space-3, 0.75rem)' : 0,
                        }}
                      >
                        {topic.description}
                      </p>
                      {topic.bullets && topic.bullets.length > 0 && (
                        <ul
                          className="space-y-1 list-none p-0"
                          style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}
                        >
                          {topic.bullets.map((bullet, k) => (
                            <li key={k} className="flex items-start gap-2">
                              {/* Bullet icon — cloned from parent column icon */}
                              <span
                                className="shrink-0 mt-0.5 size-4"
                                style={{ color: bulletColor }}
                                aria-hidden="true"
                              >
                                {col.icon}
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </IconCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
