'use client';

/**
 * RankingTable · ranked opportunity/leaderboard table · Ken DS table component.
 *
 * WHY  · McKinsey/CB Insights ranking tables establish prioritization frame ·
 *        score bars communicate relative magnitude instantly (no need to parse
 *        numbers) · gating of lower rows creates lead-gen hook without hiding
 *        the top signal (top N = free value · analyst credibility established).
 *
 * WHAT · Ranked list of N rows · cols: Rank · Name+detail · Metric1 · ScoreBar ·
 *        ScoreBar · Chip · WeightedScore. Top `gatedFrom` rows highlighted bg ·
 *        remaining rows optionally gated via `GatedContent` slot.
 *        ONE single `<table>` element for all rows (no split-table pattern).
 *
 * WHEN · §17 Opportunities · below MetricStrip · above SourceCluster.
 *        Reusable for any ranked dataset (competitorranking · driver ranking etc).
 *
 * WHERE · `design-system/core-v2/src/charts/tables/RankingTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <RankingTable
 *          rows={OPPORTUNITIES}
 *          columns={COLUMN_DEFS}
 *          topHighlightCount={3}
 *        />
 *        ```
 *
 * Bug fixes applied during DS port (2026-05-25):
 *   - §17 had TWO `<table>` elements (top 3 + bottom 4) with width mismatch
 *     (864px vs 830px) and density mismatch (45px vs 62px row heights).
 *     FIX: ONE table · all rows · uniform `density="standard"` (40px).
 *   - Header opacity was 0.45 → WCAG AA fail at small text.
 *     FIX: raised to 0.60 (`KEN_INK.muted` = rgba(0,0,0,0.60)).
 *   - Header bg transparent → FIX: TableShell `headerWash` applies periwinkle wash.
 *   - Score bar color hardcoded hex → FIX: uses KEN_CHART_SERIES.primary from tokens.
 *
 * Consumer note: gating of bottom rows is handled via the `gatedContent` prop.
 * Pass a `<GatedBlock>` with `<PremiumLockCard>` containing the bottom rows.
 * This keeps the DS component free of project-specific gating atoms.
 *
 * A11y · `aria-label` on `<table>` via TableShell `ariaLabel`.
 *        `scope="col"` on `<th>` · sticky header via `stickyHeader` prop.
 *        Score bars have `role="img"` + `aria-label` for assistive tech.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/atoms/OpportunityRankingTable.tsx
 * @relatedDoc design-system/core-v2/src/charts/primitives/TableShell.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 */

import type { ReactNode } from 'react';
import { TableShell, useTableDensity, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import { KEN_CHART_SERIES } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Score bar ────────────────────────────────────────────────────────────────

interface ScoreBarProps {
  score: number;
  max?: number;
}

/**
 * ScoreBar · inline 1–10 bar with periwinkle gradient.
 * Color: KEN_CHART_SERIES.primary (not hardcoded hex).
 */
function ScoreBar({ score, max = 10 }: ScoreBarProps) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-2 min-w-[80px] max-w-[120px]">
      <div
        className="relative flex-1 h-[6px] rounded-full overflow-hidden"
        // Track: 15% opacity of primary token
        style={{ background: `${KEN_CHART_SERIES.primary}26` }}
        role="img"
        aria-label={`Score ${score} of ${max}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            // Gradient: secondary → primary → quaternary (periwinkle ramp)
            background: `linear-gradient(90deg, ${KEN_CHART_SERIES.secondary} 0%, ${KEN_CHART_SERIES.primary} 60%, ${KEN_CHART_SERIES.quaternary} 100%)`,
          }}
        />
      </div>
      <span
        className="font-body tabular-nums text-[var(--semantic-ink-body)] flex-none"
        style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums', minWidth: '24px' }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Types · generic row interface ────────────────────────────────────────────

/** One ranked opportunity row */
export interface RankingRow {
  rank: number;
  name: string;
  detail: string;
  /** Primary metric · e.g. TAM in AUD Mn */
  primaryMetric: number;
  /** Primary metric label prefix (e.g. "AUD") */
  primaryMetricPrefix?: string;
  /** Primary metric unit suffix (e.g. "Mn") */
  primaryMetricUnit?: string;
  /** First score (e.g. Impact) · 1–10 · renders as score bar */
  score1: number;
  /** Second score (e.g. Feasibility) · 1–10 · renders as score bar */
  score2: number;
  /** Chip label · e.g. "14mo" */
  chipLabel: string;
  /** Chip urgency · fast=dark-neutral · medium=mid-neutral · slow=light-neutral */
  chipUrgency?: 'fast' | 'medium' | 'slow';
  /** Weighted/composite score · right-aligned */
  weightedScore: number;
}

/** Column header labels */
export interface RankingTableColumns {
  primaryMetric: string;
  score1: string;
  score2: string;
  chip: string;
  weightedScore: string;
}

export interface RankingTableProps {
  /** All rows · sorted by rank (caller is responsible for ordering) */
  rows: readonly RankingRow[];
  /** Column header labels */
  columns: RankingTableColumns;
  /**
   * Number of top rows highlighted with a subtle neutral bg tint.
   * Typically 3 (top-3 signal). Set 0 to disable.
   * @default 3
   */
  topHighlightCount?: number;
  /**
   * Row density · controls row height via TableShell context.
   * @default 'standard' (40px per ref)
   */
  density?: TableDensity;
  /**
   * Sticky header for long tables (>12 rows recommended).
   * @default true
   */
  stickyHeader?: boolean;
  /**
   * Optional: content to render BELOW the visible rows (e.g. GatedBlock with remaining rows).
   * Pass a GatedBlock containing a second <table> with rows.
   * The gated table MUST omit <thead> and use the same column order.
   */
  gatedContent?: ReactNode;
  /** Legend / footnote text below the table */
  footnote?: string;
  /** ARIA label for the table */
  ariaLabel?: string;
  /** Optional className passthrough */
  className?: string;
  /**
   * Card: bordered rounded card (Ref 1). Open: flush editorial (Ref 2).
   * @default 'card'
   */
  variant?: TableVariant;
  /**
   * Surface context · light (default) or dark.
   * Controls row hover bg per Bible § 2.4 skip-shade doctrine.
   * @default 'light'
   */
  surface?: ChartSurface;
  /**
   * Header background style passthrough to TableShell.
   * wash: periwinkle wash · transparent: border-bottom only · inverted: neutral dark + white text.
   * @default 'wash'
   */
  headerStyle?: TableHeaderStyle;
  /**
   * Max height when stickyHeader=true. Creates v-scroll context inside wrapper.
   * @default '400px'
   */
  maxHeight?: string | number;
}

// ─── Chip component ───────────────────────────────────────────────────────────

const CHIP_STYLES = {
  fast:   { bg: 'rgba(0,0,0,0.08)',  text: 'var(--semantic-ink-strong)' },  // strongest neutral · fast urgency
  medium: { bg: 'rgba(0,0,0,0.05)',  text: 'var(--semantic-ink-body)' },    // mid
  slow:   { bg: 'rgba(0,0,0,0.03)',  text: 'var(--semantic-ink-muted)' },   // lightest
} as const;

function Chip({ label, urgency = 'slow' }: { label: string; urgency?: 'fast' | 'medium' | 'slow' }) {
  const style = CHIP_STYLES[urgency];
  return (
    // FIX 4 (G.10): min-w-[44px] + min-h-[24px] for visual breathing room.
    // Chip is non-interactive · WCAG 2.5.5 44px applies only to interactive targets.
    // px-2.5 py-1 replaces tight px-1.5 py-0.5 · more generous readable chip.
    <span
      className="inline-flex items-center justify-center rounded-[3px] px-2.5 py-1 font-body tabular-nums"
      style={{
        fontSize: '11px',
        fontWeight: 500,
        background: style.bg,
        color: style.text,
        minWidth: '44px',
        minHeight: '24px',
      }}
    >
      {label}
    </span>
  );
}

// ─── Row inner ────────────────────────────────────────────────────────────────

function RankingRowInner({ row, isTop, surface = 'light' }: { row: RankingRow; isTop: boolean; surface?: ChartSurface }) {
  const rowHeightPx = useTableDensity();
  const isDark = surface === 'dark';
  // Bible § 2.4 skip-shade: surface-aware hover · light skip dark skip
  const rowHoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const rowTopBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  return (
    <tr
      className="group border-b border-[rgba(0,0,0,0.08)] last:border-0 transition-colors"
      style={{
        height: `${rowHeightPx}px`,
        background: isTop ? rowTopBg : undefined,
      }}
      // Bible § 2.4 skip-shade: shift hovered row · keep siblings legible · surface-aware
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = rowHoverBg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = isTop ? rowTopBg : ''; }}
    >
      {/* Rank */}
      <td className="py-2.5 pr-4 align-middle">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full font-body font-semibold"
          style={{
            fontSize: '11px',
            background: isTop ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)',
            color: isTop ? 'var(--semantic-ink-strong)' : 'var(--semantic-ink-muted)',
          }}
        >
          {row.rank}
        </span>
      </td>

      {/* Name + detail · TruncatedText for long opportunity names */}
      <td className="py-2.5 pr-5 align-middle min-w-[160px] max-w-[240px]">
        <TruncatedText
          className="font-body font-medium text-[var(--semantic-ink-strong)] leading-snug mb-0.5"
          style={{ fontSize: '13px' }}
          tooltipMeta={`${row.primaryMetricPrefix ?? ''}${row.primaryMetric.toLocaleString('en-US')}${row.primaryMetricUnit ? ` ${row.primaryMetricUnit}` : ''} · Score: ${row.weightedScore.toFixed(1)}`}
        >
          {row.name}
        </TruncatedText>
        <TruncatedText
          className="font-body text-[var(--semantic-ink-muted)] leading-snug"
          style={{ fontSize: '11px' }}
          tooltipMeta={`Rank #${row.rank}`}
        >
          {row.detail}
        </TruncatedText>
      </td>

      {/* Primary metric */}
      <td className="py-2.5 pr-5 align-middle text-right whitespace-nowrap">
        <span
          className="font-body tabular-nums text-[var(--semantic-ink-body)]"
          style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}
        >
          {row.primaryMetricPrefix ? `${row.primaryMetricPrefix} ` : ''}
          {row.primaryMetric.toLocaleString('en-US')}
          {row.primaryMetricUnit ? ` ${row.primaryMetricUnit}` : ''}
        </span>
      </td>

      {/* Score 1 bar */}
      <td className="py-2.5 pr-5 align-middle">
        <ScoreBar score={row.score1} />
      </td>

      {/* Score 2 bar */}
      <td className="py-2.5 pr-5 align-middle">
        <ScoreBar score={row.score2} />
      </td>

      {/* Chip */}
      <td className="py-2.5 pr-5 align-middle">
        <Chip label={row.chipLabel} urgency={row.chipUrgency} />
      </td>

      {/* Weighted score */}
      <td className="py-2.5 align-middle text-right">
        <span
          className="font-body font-medium tabular-nums"
          style={{
            fontSize: '13px',
            color: isTop ? 'var(--semantic-ink-strong)' : 'var(--semantic-ink-body)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {row.weightedScore.toFixed(1)}
        </span>
      </td>
    </tr>
  );
}

// ─── Header row inner ─────────────────────────────────────────────────────────

function HeaderRow({ columns }: { columns: RankingTableColumns }) {
  // 2026-05-26 Sprint D.1 · removed inline `color` · let TableShell injected <style>
  // own header text color (dark on wash/transparent · WHITE on inverted).
  // Inline color was winning over TableShell scoped style · broke inverted variant.
  const headerStyle = { fontSize: '10px', fontWeight: 600 };

  return (
    <thead>
      <tr className="border-b border-[rgba(0,0,0,0.08)]">
        <th
          scope="col"
          className="pb-3 pr-4 text-left font-body uppercase tracking-[0.1em]"
          style={headerStyle}
        >
          #
        </th>
        <th
          scope="col"
          className="pb-3 pr-5 text-left font-body uppercase tracking-[0.1em]"
          style={headerStyle}
        >
          Opportunity
        </th>
        <th
          scope="col"
          className="pb-3 pr-5 text-right font-body uppercase tracking-[0.1em] whitespace-nowrap"
          style={headerStyle}
        >
          {columns.primaryMetric}
        </th>
        <th
          scope="col"
          className="pb-3 pr-5 text-left font-body uppercase tracking-[0.1em] min-w-[110px]"
          style={headerStyle}
        >
          {columns.score1}
        </th>
        <th
          scope="col"
          className="pb-3 pr-5 text-left font-body uppercase tracking-[0.1em] min-w-[110px]"
          style={headerStyle}
        >
          {columns.score2}
        </th>
        <th
          scope="col"
          className="pb-3 pr-5 text-left font-body uppercase tracking-[0.1em] whitespace-nowrap"
          style={headerStyle}
        >
          {columns.chip}
        </th>
        <th
          scope="col"
          className="pb-3 text-right font-body uppercase tracking-[0.1em] whitespace-nowrap"
          style={headerStyle}
        >
          {columns.weightedScore}
        </th>
      </tr>
    </thead>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RankingTable({
  rows,
  columns,
  topHighlightCount = 3,
  density = 'standard',
  stickyHeader = true,
  gatedContent,
  footnote,
  ariaLabel,
  className,
  variant = 'card',
  headerStyle = 'wash',
  maxHeight,
  surface = 'light',
}: RankingTableProps) {
  return (
    <div className={['w-full', className ?? ''].join(' ')}>
      <TableShell
        variant={variant}
        density={density}
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        headerStyle={headerStyle}
        ariaLabel={ariaLabel ?? 'Ranked table'}
        caption="Ranked opportunity table"
      >
        <HeaderRow columns={columns} />
        <tbody>
          {rows.map((row) => (
            <RankingRowInner
              key={row.rank}
              row={row}
              isTop={row.rank <= topHighlightCount}
              surface={surface}
            />
          ))}
        </tbody>
      </TableShell>

      {/* Gated rows slot · consumer provides GatedBlock with remaining rows */}
      {gatedContent}

      {/* Footnote / legend */}
      {footnote && (
        <p
          className="font-body italic text-[var(--semantic-ink-muted)] mt-3"
          style={{ fontSize: '10.5px', lineHeight: 1.5 }}
        >
          {footnote}
        </p>
      )}
    </div>
  );
}
