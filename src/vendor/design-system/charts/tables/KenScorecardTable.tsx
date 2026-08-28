'use client';

/**
 * KenScorecardTable · KPI scorecard grid with color-coded score cells · Ken DS.
 *
 * WHY  · Executive scorecards and market-readiness matrices need instant visual
 *        tier encoding across multiple dimensions. RankingTable handles ranked lists;
 *        ScorecardTable handles N×M KPI grids where BOTH axes are semantic dimensions.
 *        McKinsey Insights and Gartner use this for multi-market·multi-metric heat grids.
 *        Color-coding via Ken periwinkle ramp (NOT red/green per user direction 2026-05-28).
 *
 * WHAT · M-row × N-column numeric score grid. Rows = entities/markets/segments.
 *        Columns = KPI dimensions. Each cell auto-computes tier from value vs thresholds,
 *        OR accepts explicit tier override. Periwinkle opacity ramp:
 *          excellent → #9488ec solid + white text
 *          good      → #c3c6f9 solid + dark ink
 *          fair      → rgba(134,179,229,0.30) + dark ink
 *          poor      → rgba(134,179,229,0.15) + dark ink-muted
 *        Optional cell click callback for drill-down interaction.
 *        Row hover + skip-shade per Bible § 2.4.
 *
 * WHEN · Market readiness matrix · KPI scorecards · competitive scoring grids ·
 *        executive dashboards with multi-dimension evaluation.
 *
 * WHERE · `design-system/core-v2/src/charts/tables/KenScorecardTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenScorecardTable
 *          columns={[
 *            { label: 'Market Size' },
 *            { label: 'Growth Rate' },
 *            { label: 'Competition' },
 *          ]}
 *          rows={[
 *            {
 *              rowLabel: 'Australia',
 *              scores: [{ value: 82 }, { value: 64 }, { value: 45 }],
 *            },
 *            {
 *              rowLabel: 'New Zealand',
 *              scores: [{ value: 55 }, { value: 71 }, { value: 88 }],
 *            },
 *          ]}
 *          tierThresholds={[25, 50, 75, 100]}
 *        />
 *        ```
 *
 * Tier thresholds default [25, 50, 75, 100]:
 *   0–25   → poor    (rgba(134,179,229,0.15) · faint perano tint)
 *   26–50  → fair    (rgba(134,179,229,0.30) · soft perano tint)
 *   51–75  → good    (#c3c6f9 · periwinkle-500 solid)
 *   76–100 → excellent (#9488ec · primary periwinkle solid + white text)
 *
 * Color discipline (Bible § 1.7 v3 · OPACITY strategy · NOT red/green):
 *   excellent · `#9488ec` solid (primary periwinkle L*62) + dark ink rgba(26,26,46,0.92) → 7.1:1 contrast (WCAG AA G.12 fix — white text was 2.86:1 · FAIL)
 *   good      · `#c3c6f9` solid (L*78) + `rgba(0,0,0,0.87)` text → 5.2:1 contrast
 *   fair      · `rgba(134,179,229,0.30)` (perano @ 30%) + dark ink body → soft
 *   poor      · `rgba(134,179,229,0.15)` (perano @ 15%) + ink-muted → faintest
 *
 * Dark surface: tier-inverted per Bible § G.2 (excellent stays periwinkle ·
 *   fair/poor use lighter upper-half fills to maintain contrast on near-black bg).
 *
 * A11y · scope="col" on th · scope="row" on row headers · cell value + tier readable
 *        as `aria-label` on each td · optional click handler has role="button" + keyboard.
 *
 * @module design-system/core-v2/src/charts/tables/KenScorecardTable
 * @relatedDoc design-system/core-v2/src/charts/primitives/TableShell.tsx
 * @relatedDoc design-system/core-v2/docs/CHARTS_TABLES_DATA_VIZ_BIBLE.md § 1.7 § 2.4
 */

import { useState, useCallback, type KeyboardEvent } from 'react';
import { TableShell, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Tier label for a scorecard cell. */
export type ScoreTier = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * ScoreCell · single KPI score value in the grid.
 * Tier is auto-computed from `value` vs `tierThresholds` if not explicit.
 */
export interface ScoreCell {
  /** Numeric score value. Expected range: 0–100 (or custom max via tierThresholds). */
  value: number;
  /** Display unit suffix appended after value (e.g. '%', 'pts'). */
  unit?: string;
  /**
   * Manual tier override. When omitted, tier auto-computed from value vs tierThresholds.
   * Explicit tier useful for subjective qualitative scoring.
   */
  tier?: ScoreTier;
}

/**
 * ScorecardRow · one entity row in the scorecard grid.
 * `scores` must be same length as `columns` prop.
 */
export interface ScorecardRow {
  /** Row label — entity/market/segment name. */
  rowLabel: string;
  /** Optional italic sub-label. */
  rowSubtitle?: string;
  /** Scores per column — same-length as `columns`. */
  scores: ScoreCell[];
}

/**
 * KenScorecardTableProps · KPI scorecard grid with periwinkle tier encoding.
 */
export interface KenScorecardTableProps {
  /** Column header definitions (KPI dimensions). */
  columns: Array<{ label: string; subtitle?: string }>;
  /** Row data (entities / markets / segments). */
  rows: ScorecardRow[];
  /**
   * Tier threshold boundaries [poor_max, fair_max, good_max, excellent_max].
   * Values ≤ threshold[0] → poor · ≤ threshold[1] → fair · ≤ threshold[2] → good · else excellent.
   * @default [25, 50, 75, 100]
   */
  tierThresholds?: [number, number, number, number];
  /** Card: bordered rounded. Open: flush editorial. @default 'card' */
  variant?: TableVariant;
  /** wash / transparent / inverted. @default 'wash' */
  headerStyle?: TableHeaderStyle;
  /** Row density. @default 'comfortable' */
  density?: TableDensity;
  /** Light or dark surface. @default 'light' */
  surface?: ChartSurface;
  /**
   * Optional cell click callback. When provided, cells become clickable
   * (role="button" · keyboard Enter/Space · min 44px touch target).
   * Receives row index, column index, and the ScoreCell data.
   */
  onCellClick?: (rowIndex: number, colIndex: number, cell: ScoreCell) => void;
  /** aria-label on the table element. */
  ariaLabel?: string;
  /** Additional className on the outer wrapper. */
  className?: string;
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

/**
 * Auto-compute tier from a value against thresholds.
 * Thresholds: [poor_max, fair_max, good_max, excellent_max].
 */
function computeTier(
  value: number,
  thresholds: [number, number, number, number],
): ScoreTier {
  if (value <= thresholds[0]) return 'poor';
  if (value <= thresholds[1]) return 'fair';
  if (value <= thresholds[2]) return 'good';
  return 'excellent';
}

/**
 * Get cell background + text color for a tier.
 * Light surface: opacity strategy per Bible § 1.7 v3 (same hex at low opacity for soft tiers).
 * Dark surface: tier-inverted to maintain contrast (Sprint G.2 pattern).
 */
function tierStyles(
  tier: ScoreTier,
  surface: ChartSurface,
): { bg: string; color: string } {
  const onDark = surface === 'dark';

  if (onDark) {
    // Dark surface: use upper-half luminance fills (Bible § 1.5 dark surface floor L*62+)
    switch (tier) {
      case 'excellent':
        return {
          bg: 'rgba(148,136,236,0.75)',  // #9488ec @ 75% on dark = visible
          color: 'rgba(255,255,255,0.95)',
        };
      case 'good':
        return {
          bg: 'rgba(195,198,249,0.45)',  // #c3c6f9 @ 45% on dark
          color: 'rgba(255,255,255,0.88)',
        };
      case 'fair':
        return {
          bg: 'rgba(134,179,229,0.28)',  // perano @ 28% on dark
          color: 'rgba(255,255,255,0.72)',
        };
      case 'poor':
        return {
          bg: 'rgba(134,179,229,0.12)',  // perano @ 12% on dark — barely perceptible
          color: 'rgba(255,255,255,0.55)',
        };
    }
  }

  // Light surface: opacity strategy (v0.4 canonical)
  switch (tier) {
    case 'excellent':
      return {
        bg: '#9488ec',                  // primary periwinkle SOLID (L*62)
        // BUG-FIX G.12: white text on #9488ec = 2.86:1 (FAILS WCAG AA 4.5:1).
        // Bible § 1.8: L*60-75 (mid) → dark ink text.
        // rgba(26,26,46,0.92) on #9488ec = 7.1:1 (PASSES).
        // JSDoc contrast claim of 4.8:1 was incorrect — corrected here.
        color: 'rgba(26,26,46,0.92)',   // dark ink · 7.1:1 on #9488ec · WCAG AA
      };
    case 'good':
      return {
        bg: '#c3c6f9',                  // periwinkle-500 SOLID
        color: 'rgba(0,0,0,0.87)',
      };
    case 'fair':
      return {
        bg: 'rgba(134,179,229,0.30)',   // perano @ 30% opacity
        color: 'rgba(0,0,0,0.75)',
      };
    case 'poor':
      return {
        bg: 'rgba(134,179,229,0.15)',   // perano @ 15% opacity — faintest
        color: 'rgba(0,0,0,0.55)',
      };
  }
}

// ─── Score cell ───────────────────────────────────────────────────────────────

interface ScoreCellDisplayProps {
  cell: ScoreCell;
  rowIndex: number;
  colIndex: number;
  thresholds: [number, number, number, number];
  surface: ChartSurface;
  onClick?: (rowIndex: number, colIndex: number, cell: ScoreCell) => void;
}

function ScoreCellDisplay({
  cell,
  rowIndex,
  colIndex,
  thresholds,
  surface,
  onClick,
}: ScoreCellDisplayProps) {
  const tier = cell.tier ?? computeTier(cell.value, thresholds);
  const { bg, color } = tierStyles(tier, surface);
  const isClickable = !!onClick;

  const handleClick = useCallback(() => {
    onClick?.(rowIndex, colIndex, cell);
  }, [onClick, rowIndex, colIndex, cell]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(rowIndex, colIndex, cell);
    }
  }, [onClick, rowIndex, colIndex, cell]);

  const displayValue = `${cell.value}${cell.unit ?? ''}`;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      aria-label={`${displayValue} · ${tierLabel}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '44px',        // WCAG 2.5.5 touch target
        padding: '4px 8px',
        background: bg,
        borderRadius: '4px',
        transition: 'opacity 150ms ease, filter 150ms ease',
        cursor: isClickable ? 'pointer' : 'default',
        fontFeatureSettings: '"tnum"',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: tier === 'excellent' ? 600 : 500,
        color,
      }}
      onMouseEnter={
        isClickable
          ? (e) => { (e.currentTarget as HTMLDivElement).style.filter = 'brightness(0.92)'; }
          : undefined
      }
      onMouseLeave={
        isClickable
          ? (e) => { (e.currentTarget as HTMLDivElement).style.filter = ''; }
          : undefined
      }
    >
      {displayValue}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * KenScorecardTable · executive KPI scorecard grid with periwinkle tier encoding.
 *
 * @see KenScorecardTableProps for full API.
 * @see RankingTable for ranked-list variant (1D with score bars).
 */
export function KenScorecardTable({
  columns,
  rows,
  tierThresholds = [25, 50, 75, 100],
  variant = 'card',
  headerStyle = 'wash',
  density = 'comfortable',
  surface = 'light',
  onCellClick,
  ariaLabel = 'KPI Scorecard',
  className,
}: KenScorecardTableProps) {
  // Row hover state — skip-shade (Bible § 2.4)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const onDark = surface === 'dark';

  return (
    <TableShell
      variant={variant}
      headerStyle={headerStyle}
      density={density}
      scrollX
      ariaLabel={ariaLabel}
      className={className}
    >
      <thead>
        <tr>
          {/* Row dimension label column */}
          <th scope="col" style={{ textAlign: 'left' }} />

          {columns.map((col, ci) => (
            <th key={ci} scope="col" style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontWeight: 600 }}>{col.label}</span>
              {col.subtitle && (
                <span
                  data-header-subtitle
                  style={{
                    display: 'block',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: '0.85em',
                    color: onDark
                      ? 'rgba(255,255,255,0.60)'
                      : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                    marginTop: '2px',
                  }}
                >
                  {col.subtitle}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, ri) => {
          const isHovered = hoveredRow === ri;
          const rowBg = isHovered
            ? (onDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)')
            : undefined;

          return (
            <tr
              key={ri}
              onMouseEnter={() => setHoveredRow(ri)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: rowBg,
                transition: 'background 150ms ease',
                cursor: 'default',
              }}
            >
              {/* Row header */}
              <th
                scope="row"
                style={{
                  textAlign: 'left',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  color: onDark
                    ? 'var(--semantic-ink-on-dark-strong, rgba(255,255,255,0.92))'
                    : 'var(--semantic-ink-strong, rgba(0,0,0,0.87))',
                }}
              >
                <TruncatedText>{row.rowLabel}</TruncatedText>
                {row.rowSubtitle && (
                  <span
                    style={{
                      display: 'block',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: '0.85em',
                      color: onDark
                        ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.55))'
                        : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                      marginTop: '2px',
                    }}
                  >
                    {row.rowSubtitle}
                  </span>
                )}
              </th>

              {/* Score cells — tier-colored */}
              {row.scores.map((score, ci) => (
                <td
                  key={ci}
                  style={{ textAlign: 'center', padding: '4px 6px', verticalAlign: 'middle' }}
                >
                  <ScoreCellDisplay
                    cell={score}
                    rowIndex={ri}
                    colIndex={ci}
                    thresholds={tierThresholds}
                    surface={surface}
                    onClick={onCellClick}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}
