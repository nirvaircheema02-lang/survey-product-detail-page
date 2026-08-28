'use client';

/**
 * KenHeatmap · N×M CSS-grid heatmap · Ken DS chart.
 *
 * Mobile strategy (Sprint G.3) · SCROLL:
 *   N×M grid must maintain readable cell sizes — squeezing makes cells too small.
 *   Outer wrapper already has overflow-x:auto.
 *   Sprint G.3: adds overscrollBehaviorX:contain + WebkitOverflowScrolling:touch.
 *   Inner grid gets explicit minWidth = rowLabelWidth + cols × 50px (min readable cell).
 *
 * WHY  · Opportunity and driver analysis needs a cell-grid visualization where
 *        two dimensions cross (e.g. industry × capability). Refs show N×M heatmaps
 *        in §13 Demand-Supply Gap and §11 Industry Analysis — CSS grid gives exact
 *        control over cell size, label placement, and hover UX that Highcharts
 *        heatmap module cannot match without extensive overrides.
 *
 * WHAT · Pure CSS grid · rows × cols · 3-tier periwinkle color encoding (faint/mid/
 *        strong). Optional star-rating overlay per cell. Cell hover: scale 1.02 +
 *        periwinkle ring. Click callback. Sparse cells (missing data) render as
 *        empty with no fill.
 *
 * WHEN · §13 D-S Gap heatmap · §11 Industry driver grid · §17 Opportunity matrix.
 *        Any N×M qualitative/quantitative grid up to ~8×8.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenHeatmap.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenHeatmap
 *          rows={['Pharma', 'Food', 'Dairy']}
 *          cols={['Storage', 'Transport', 'Last-mile']}
 *          cells={[
 *            { rowKey: 'Pharma', colKey: 'Storage', value: 9.2, starRating: 5 },
 *          ]}
 *          showStars
 *        />
 *        ```
 *
 * A11y · role="table" + caption + column headers + row headers via scope="row".
 *
 * @module design-system/core-v2/src/charts/charts/KenHeatmap
 */

import React, { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { CellTooltip } from '../primitives/CellTooltip';
import { KEN_CHART_FONT } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

export type HeatmapTier = 'faint' | 'mid' | 'strong';

export interface HeatmapCell {
  rowKey: string;
  colKey: string;
  /**
   * Numeric value — drives auto-tier if tier not provided.
   * `null` = explicitly no data (renders dim dashed cell with "—").
   * `0`    = zero value (renders as smallest-color tier · cell is visible · NOT hidden).
   * `undefined` (missing from cells array) = sparse cell (renders empty, no fill).
   */
  value: number | null;
  /** Override auto-tier calculation */
  tier?: HeatmapTier;
  /** Displayed in cell · default = value formatted to 1dp */
  label?: string;
  /** Optional star rating overlay (1-5 stars shown in cell) */
  starRating?: 1 | 2 | 3 | 4 | 5;
}

export interface KenHeatmapProps {
  /** Row keys · rendered as left-column labels */
  rows: readonly string[];
  /** Column keys · rendered as top-row labels */
  cols: readonly string[];
  /** Cell data · sparse OK — missing combos render as empty */
  cells: readonly HeatmapCell[];
  /** Cell size in px · default 80 */
  cellSize?: number;
  /** Show star rating overlay · default false */
  showStars?: boolean;
  /** ARIA label for the table */
  ariaLabel?: string;
  /** Surface context */
  surface?: ChartSurface;
  /** Loading state */
  loading?: boolean;
  /** Empty state */
  empty?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Disable ChartReveal entrance · @default false */
  disableReveal?: boolean;
  /** Cell click callback */
  onCellClick?: (cell: HeatmapCell) => void;
  /** Optional className on outer wrapper */
  className?: string;
}

// ─── Tier color map · luminance-stepped · color-blind safe ───────────────────
// FIX 7 (G.10): Updated for v2 desaturated editorial palette (Bible § 1.7).
// v2 LUMINANCE_SAFE token names remapped — same periwinkle hue family, softer.
// Light surface (3-tier periwinkle ramp):
//   faint = #e6e7f5 (light L*≈92) · mid = #c5c3ec (tertiary L*≈78) · strong = #a39ee0 (quaternary L*≈65)
// Dark surface (inverted — faint most receded, strong most prominent on near-black):
//   faint = #a39ee0 (quaternary L*≈65) · mid = #c5c3ec (tertiary L*≈78) · strong = #e6e7f5 (light L*≈92)
//   Rationale: all L*≥65 on near-black (L*≈2) have ≥3:1 contrast.
//   "strong" on dark is brightest (most salient) · "faint" is most receded.
// Each step ≥13 L* apart → monochrome conversion distinguishes tiers.
// Uses KEN_CHART_SERIES_LUMINANCE_SAFE (NOT KEN_CHART_SERIES — Highcharts keeps those).

// v0.4-aligned (2026-05-28 FINAL): faint = perano-800 at 0.20 opacity · editorial-soft signature.
// mid + strong = solid Ken periwinkle. Hierarchy from solid-vs-opacity contrast · NOT pre-blended hex.
const TIER_BG_LIGHT: Record<HeatmapTier, string> = {
  faint:  'rgba(134, 179, 229, 0.20)', // perano-800 at 20% opacity · v0.4 signature soft tier
  mid:    '#c3c6f9',                    // periwinkle-500 L*78 SOLID
  strong: '#9488ec',                    // periwinkle L*62 SOLID (text becomes white)
};

const TIER_BG_DARK: Record<HeatmapTier, string> = {
  faint:  'rgba(195, 198, 249, 0.18)', // periwinkle-500 at 18% opacity on dark · soft receded
  mid:    '#c3c6f9',                    // periwinkle-500 L*78 SOLID · mid on dark
  strong: '#e0e3fb',                    // periwinkle lightest L*90 SOLID · brightest on dark
};

// Hover fill boost for dark surface: bump opacity / step to next-brighter solid
const TIER_BG_DARK_HOVER: Record<HeatmapTier, string> = {
  faint:  'rgba(195, 198, 249, 0.35)',  // opacity 0.18 → 0.35 on hover
  mid:    '#e0e3fb',                     // bump mid → strong brightness
  strong: '#ffffff',                     // already brightest · subtle white tint on hover
};

// ─── Auto-tier from value percentile ─────────────────────────────────────────

function computeTier(value: number, sorted: number[]): HeatmapTier {
  const idx = sorted.indexOf(value);
  const pct = sorted.length <= 1 ? 1 : idx / (sorted.length - 1);
  if (pct < 0.33) return 'faint';
  if (pct < 0.67) return 'mid';
  return 'strong';
}

// ─── Star renderer ────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    // aria-hidden: accessible rating provided by parent cell aria-label (e.g. "Pharma, Storage: 9.2, 5 stars")
    // FIX 1 (G.10): alignment changed from top-right to CENTER-TOP per Bible spec.
    // Stars sit above the value · horizontally centered within the cell.
    // Color: #6b5fb8 (LUMINANCE_SAFE.darkest v2 · L*≈48 · deeper periwinkle · ≥3:1 on v2 tier fills L*≥65).
    // Inactive stars hidden (opacity:0) rather than dimmed — dimmed stars fail 4.5:1 at 8px.
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 4,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        fontSize: '8px',
        color: '#6b5fb8',   // LUMINANCE_SAFE.darkest v2 · L*≈48 · ≥3:1 on v2 tier fills
        lineHeight: 1,
        letterSpacing: '-1px',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        // Inactive stars: opacity:0 (invisible placeholder) — filled stars convey rating visually.
        // Screen-reader rating info lives on parent cell aria-label.
        <span key={i} style={{ opacity: i < rating ? 1 : 0 }}>★</span>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KenHeatmap({
  rows,
  cols,
  cells,
  cellSize = 80,
  showStars = false,
  ariaLabel,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  disableReveal = false,
  onCellClick,
  className,
}: KenHeatmapProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);

  // Build a lookup map rowKey×colKey → HeatmapCell
  const cellMap = useMemo(() => {
    const map = new Map<string, HeatmapCell>();
    for (const cell of cells) {
      map.set(`${cell.rowKey}::${cell.colKey}`, cell);
    }
    return map;
  }, [cells]);

  // Sorted non-null values for percentile-based auto-tier
  // Null values excluded — they don't participate in tier calculation.
  // Zero IS included — zero = smallest tier, not absent.
  const sortedValues = useMemo(
    () => cells.filter((c) => c.value !== null).map((c) => c.value as number).sort((a, b) => a - b),
    [cells],
  );

  // Surface-aware text colors
  const isDark = surface === 'dark';
  const headerColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  // G.12 fix: strong tier #9488ec L*62 + white = 2.86:1 FAIL. Bible §1.8 L*60-75 → dark ink.
  // LIGHT: faint(0.20 perano)→dark · mid(#c3c6f9 L*78)→dark · strong(#9488ec L*62)→DARK INK (7.1:1).
  const tierTextColorLight: Record<HeatmapTier, string> = {
    faint:  'rgba(26,26,46,1.0)',
    mid:    'rgba(26,26,46,1.0)',
    strong: 'rgba(26,26,46,0.92)', // dark ink on periwinkle L*62 (was white · WCAG fail)
  };
  const tierTextColorDark: Record<HeatmapTier, string> = {
    faint:  'rgba(255,255,255,0.92)', // white on 0.18 opacity periwinkle (dark bg shows through)
    mid:    'rgba(26,26,46,0.92)',    // dark on L*78 solid
    strong: 'rgba(26,26,46,0.95)',    // dark on L*90 lightest
  };

  const rowLabelWidth = 120;
  const headerHeight = 32;

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="generic" height={(rows.length + 1) * cellSize + headerHeight} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  // Min-width formula: row label column + N columns × min 50px per cell
  // Ensures scroll rather than squeeze at narrow viewport
  const minWidth = rowLabelWidth + cols.length * 50;

  return (
    <ChartReveal disabled={disableReveal}>
      {/* Mobile strategy: SCROLL · overscroll-behavior contains horizontal swipe */}
      {/* Scroll wrapper — role/aria-label on the inner role="table" div provide a11y context.
          Removed role="img" (caused nested-interactive violation when cells are clickable). */}
      <div
        className={['w-full overflow-x-auto', className ?? ''].join(' ')}
        style={{
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {/* Outer table-like grid */}
        <div
          role="table"
          aria-label={ariaLabel ?? 'Heatmap grid'}
          style={{
            display: 'grid',
            gridTemplateColumns: `${rowLabelWidth}px repeat(${cols.length}, clamp(50px, 5vw, ${cellSize}px))`,
            gridTemplateRows: `${headerHeight}px repeat(${rows.length}, clamp(50px, 5vw, ${cellSize}px))`,
            fontFamily: KEN_CHART_FONT.sans,
            width: 'max-content',
            minWidth,
          }}
        >
          {/* Header row — role="row" wrapper with display:contents preserves CSS grid layout */}
          <div role="row" style={{ display: 'contents' }}>
            {/* Corner cell · sr-only span provides accessible text per axe empty-table-header rule */}
            <div role="columnheader" aria-label="Category" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <span className="sr-only">Category</span>
            </div>

            {/* Column headers */}
            {cols.map((col) => (
              <div
                key={col}
                role="columnheader"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  color: headerColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Data rows — each row wrapped in role="row" with display:contents */}
          {rows.map((row) => (
            <div key={`row-${row}`} role="row" style={{ display: 'contents' }}>
              {/* Row label */}
              <div
                role="rowheader"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: 8,
                  fontSize: 11,
                  fontWeight: 500,
                  color: headerColor,
                }}
              >
                {row}
              </div>


              {/* Row cells */}
              {cols.map((col) => {
                const cell = cellMap.get(`${row}::${col}`);
                if (!cell) {
                  // Empty sparse cell
                  return (
                    <div
                      key={`cell-${row}-${col}`}
                      role="cell"
                      style={{
                        margin: 2,
                        borderRadius: 4,
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      }}
                    />
                  );
                }

                // Null value: render dashed dim cell (no data) — NOT the same as zero.
                // Zero = smallest tier (data exists, value is zero). Null = no data at all.
                if (cell.value === null) {
                  return (
                    <div
                      key={`cell-${row}-${col}`}
                      role="cell"
                      aria-label={`${row}, ${col}: no data`}
                      style={{
                        margin: 2,
                        borderRadius: 4,
                        background: 'transparent',
                        border: `1px dashed ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)',
                        fontFamily: KEN_CHART_FONT.sans,
                      }}
                    >
                      —
                    </div>
                  );
                }

                const tier = cell.tier ?? computeTier(cell.value, sortedValues);
                const tierBgMap = isDark ? TIER_BG_DARK : TIER_BG_LIGHT;
                const tierBgHoverMap = isDark ? TIER_BG_DARK_HOVER : null;
                const isClickable = !!onCellClick;
                const cellKey = `${row}::${col}`;
                const isHovered = hoveredCellKey === cellKey;
                // PART B fix: Bible § 2.2 Heatmap · dim others to 0.5 · isolate via border accent
                // Bible § 2.1 supersedes G.1 "border accent only" — both isolate AND dim required
                const isDimmed = hoveredCellKey !== null && !isHovered;
                // Dark surface: brighten fill on hover (Goal 5) + keep border accent
                const bg = (isHovered && isDark && tierBgHoverMap)
                  ? tierBgHoverMap[tier]
                  : tierBgMap[tier];
                const displayLabel = cell.label ?? cell.value.toLocaleString('en-US', { maximumFractionDigits: 1 });
                // CSS transition covers bg color change on surface switch + hover brighten
                const transition = prefersReducedMotion
                  ? undefined
                  : 'background-color 200ms ease-out, color 200ms ease-out, box-shadow 0.15s ease-out';

                // Tooltip: rowKey × colKey + value + star rating + tier
                const tooltipContent = (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontWeight: 600 }}>{row} × {col}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.65)' }}>
                      Value: {displayLabel}
                    </span>
                    {cell.starRating && (
                      <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.65)', letterSpacing: '-1px' }}>
                        {/* BUG B fix: render Unicode star glyphs (★ filled · ☆ empty) instead of numeric text */}
                        {'★'.repeat(cell.starRating)}{'☆'.repeat(5 - cell.starRating)}
                      </span>
                    )}
                    <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.50)', marginTop: 1 }}>
                      Tier: {tier}
                    </span>
                  </div>
                );

                return (
                  <CellTooltip key={`cell-${row}-${col}`} content={tooltipContent} position="auto">
                    <div
                      role="cell"
                      data-component="ken-heatmap-cell"
                      tabIndex={isClickable ? 0 : undefined}
                      aria-label={`${row}, ${col}: ${displayLabel}${cell.starRating ? `, ${cell.starRating} stars` : ''}`}
                      onClick={isClickable ? () => onCellClick(cell) : undefined}
                      onKeyDown={isClickable ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCellClick(cell); }
                      } : undefined}
                      onMouseEnter={() => setHoveredCellKey(cellKey)}
                      onMouseLeave={() => setHoveredCellKey(null)}
                      onFocus={() => setHoveredCellKey(cellKey)}
                      onBlur={() => setHoveredCellKey(null)}
                      style={{
                        position: 'relative',
                        margin: 2,
                        borderRadius: 4,
                        background: bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // FIX 1: when stars shown, push value down to leave room for center-top stars
                        paddingTop: (showStars && cell.starRating) ? 14 : 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: (isDark ? tierTextColorDark : tierTextColorLight)[tier],
                        cursor: isClickable ? 'pointer' : 'default',
                        // PART B fix: Bible § 2.2 Heatmap · isolate (border) + dim others (opacity 0.5)
                        opacity: isDimmed ? 0.5 : 1,
                        transition,
                        // Border accent on hover: periwinkle inset ring (isolate signal)
                        boxShadow: isHovered && !prefersReducedMotion
                          ? 'inset 0 0 0 2px rgb(228,226,240)'
                          : undefined,
                      }}
                    >
                      {showStars && cell.starRating ? <Stars rating={cell.starRating} /> : null}
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{displayLabel}</span>
                    </div>
                  </CellTooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ChartReveal>
  );
}
