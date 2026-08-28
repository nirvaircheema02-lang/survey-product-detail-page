/**
 * MarketOverview
 *
 * WHAT · Introduction chapter organism for market research PDPs. Left: multi-paragraph
 *        narrative text + 4-col stat grid + 2-col Future Outlook TextCard + 4-col
 *        timeline period grid. Dot-pattern bg texture. Full-width section within
 *        var(--content-max-width) / var(--container-page) container.
 *
 * WHY · Every market research report chapter 1 starts with a narrative overview — value
 *       statement, geography rationale, regulatory environment, technology context — then
 *       anchors it with key stats. The 4-col stat grid (market value, dominant city,
 *       organic growth, key players) establishes quantitative credibility immediately.
 *       The timeline grid (base year, historical, forecast, CAGR) sets methodology
 *       framing for all subsequent data charts.
 *
 * WHEN · Report PDP first chapter ("Market Overview" / Chapter 1).
 *        Any introductory section combining text + stats + timeline metadata.
 *
 * WHEN NOT · Do not use for chapter sections that lead with data charts (use MarketAnalysis).
 *            Do not use for segmentation data (use SegmentationSection).
 *
 * WHERE · core-v2/src/organisms/MarketOverview.tsx
 *         Consumer: V0.2 report PDP
 *
 * HOW · `paragraphs` array renders stacked BodyText paragraphs.
 *       `stats` array renders 4-col StatCard-equivalent grid (icon + label + value + subtitle).
 *       `futureOutlook` renders as a TextCard with bottom stats (CAGR + projection value).
 *       `timelineCards` renders as 4-col TimelineCard grid.
 *       OverheadText + SectionHeader for chapter heading (V0.2 canonical).
 *       `--content-max-width` aliased to `--container-page` (1200px) per TOKEN-GAP-REPORT §2.18.
 *       Dot-pattern via --pattern-* tokens.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/MarketOverview.tsx:18-30
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @token_refactor
 *   V0.2 `py-24 lg:py-32` → py-12 md:py-20 (--section-py-lg)
 *   V0.2 `max-w-[var(--content-max-width)] px-[84.375px]` → Container variant="page"
 *     NOTE: --content-max-width already aliased to --container-page per TOKEN-GAP-REPORT §2.18
 *   V0.2 `mb-2` after OverheadText → mb-3 (--pair-label-heading: 12px)
 *   V0.2 `grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-8` stat grid → kept
 *   V0.2 `grid-cols-1 lg:grid-cols-2 gap-8 mt-10` future outlook → kept
 *   V0.2 StatCard with icon (V0.2 compound atom) → StatCardGroup molecule OR inline StatPair
 *     NOTE: uses StatCardGroup molecule from Batch 3.2a-REDO (already ported)
 *   V0.2 TimelineCard (molecule already ported in Batch 3.2a-REDO)
 *   V0.2 `bg-[var(--color-bg-primary)]` → `var(--black-50)` (background)
 */

'use client';

import { type ReactNode } from 'react';
import { Container } from '../atoms/Container';
import { OverheadText } from '../atoms/OverheadText';
import { SectionHeader } from '../atoms/SectionHeader';
import { BodyText } from '../atoms/BodyText';
import { TextCard } from '../molecules/TextCard';
import { TimelineCard } from '../molecules/TimelineCard';

// ─── Types ───────────────────────────────────────────────────────────────────

/** A key market stat displayed in the 4-col stats grid */
export interface MarketOverviewStat {
  /** Icon element (Phosphor/Lucide) */
  icon: ReactNode;
  /** Stat label (e.g., "Market Value") */
  label: string;
  /** Stat value (e.g., "$150 Mn") */
  value: string;
  /** Subtitle below value (e.g., "2024 Estimate") */
  subtitle?: string;
}

/** Future outlook TextCard stat */
export interface OutlookStat {
  value: string;
  label: string;
  isPrimary?: boolean;
}

/** Timeline period card */
export interface TimelinePeriod {
  /** Label (e.g., "Base Year") */
  label: string;
  /** Value (e.g., "2024") */
  value: string;
}

export interface MarketOverviewProps {
  /** Section id for scroll-spy. @default "market-overview" */
  id?: string;
  /** Chapter overhead label, e.g. "CHAPTER 1 - INDUSTRY ANALYSIS" */
  overheadLabel: string;
  /** Section heading string */
  heading: string;
  /**
   * Narrative paragraphs. Array of strings, rendered as stacked BodyText.
   * First paragraph uses spacing="first", remainder use spacing="follow".
   */
  paragraphs: string[];
  /** 4-col key market stat cards (icon + label + value + subtitle) */
  stats?: MarketOverviewStat[];
  /** Future outlook TextCard — title + paragraphs + bottom stats */
  futureOutlook?: {
    title: string;
    paragraphs: string[];
    stats?: OutlookStat[];
  };
  /** Timeline period grid — 4 cards (base year, historical, forecast, CAGR) */
  timelinePeriods?: TimelinePeriod[];
}

// ─── Sub-component: StatTile ─────────────────────────────────────────────────

/** Internal stat tile — matches V0.2 StatCard pattern (icon + label + value + subtitle) */
function StatTile({ stat }: { stat: MarketOverviewStat }) {
  return (
    <div
      className="border transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-5, 1.25rem)',
      }}
    >
      {/* Icon */}
      <div
        className="size-10 mb-3 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--purple-100)',
          borderRadius: 'var(--radius-xs)',
          color: 'var(--purple-500)',
        }}
        aria-hidden="true"
      >
        {stat.icon}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--black-500)',
          marginBottom: 'var(--space-1, 0.25rem)',
        }}
      >
        {stat.label}
      </p>

      {/* Value */}
      <p
        className="tabular-nums font-bold"
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--black-900)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {stat.value}
      </p>

      {/* Subtitle */}
      {stat.subtitle && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--black-500)',
            marginTop: 'var(--space-1, 0.25rem)',
          }}
        >
          {stat.subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * MarketOverview — introductory chapter organism.
 * Composes OverheadText + SectionHeader + BodyText paragraphs +
 * 4-col stat grid + Future Outlook TextCard + Timeline period grid.
 * Uses --content-max-width (aliased to --container-page 1200px).
 */
export function MarketOverview({
  id = 'market-overview',
  overheadLabel,
  heading,
  paragraphs,
  stats,
  futureOutlook,
  timelinePeriods,
}: MarketOverviewProps) {
  return (
    <section
      id={id}
      aria-label={heading}
      className="py-12 md:py-20 relative overflow-hidden"
      style={{ backgroundColor: 'var(--black-50)' }}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          opacity: 'var(--pattern-opacity)',
          backgroundImage: `radial-gradient(circle, var(--black-900) var(--pattern-dot-size), transparent 0)`,
          backgroundSize: `var(--pattern-grid-size) var(--pattern-grid-size)`,
        }}
      />

      {/* Container — uses --content-max-width alias = --container-page (1200px) */}
      <Container maxWidth="page" className="relative">
        {/* ── Chapter overhead + heading ── */}
        <div style={{ marginBottom: 'var(--space-2, 0.5rem)' }}>
          <OverheadText>{overheadLabel}</OverheadText>
        </div>
        <SectionHeader title={heading} />

        {/* ── Narrative paragraphs ── */}
        {paragraphs.map((para, i) => (
          <BodyText key={i} spacing={i === 0 ? 'first' : 'follow'}>
            {para}
          </BodyText>
        ))}

        {/* ── 4-col Key Stats grid ── */}
        {stats && stats.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
            style={{ marginTop: 'var(--space-8, 2rem)' }}
            aria-label="Key market statistics"
          >
            {stats.map((stat, i) => (
              <StatTile key={i} stat={stat} />
            ))}
          </div>
        )}

        {/* ── Future Outlook TextCard ── */}
        {futureOutlook && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            style={{ marginTop: 'var(--space-10, 2.5rem)' }}
          >
            <TextCard
              title={futureOutlook.title}
              paragraphs={futureOutlook.paragraphs}
              stats={futureOutlook.stats?.map((s) => ({
                value: s.value,
                label: s.label,
                isPrimary: s.isPrimary,
              }))}
              className="lg:col-span-2"
            />
          </div>
        )}

        {/* ── Timeline period grid ── */}
        {timelinePeriods && timelinePeriods.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
            style={{ marginTop: 'var(--space-10, 2.5rem)' }}
            aria-label="Research timeline"
          >
            {timelinePeriods.map((period, i) => (
              <TimelineCard key={i} label={period.label} value={period.value} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
