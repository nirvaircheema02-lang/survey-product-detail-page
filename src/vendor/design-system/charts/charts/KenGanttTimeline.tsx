'use client';

/**
 * KenGanttTimeline · CSS-grid pipeline timeline · Ken DS chart.
 *
 * Mobile strategy (Sprint G.3) · SCROLL:
 *   Already has overflow-x:auto + minWidth (120 + periods × 60px).
 *   Sprint G.3: adds overscrollBehaviorX:contain + WebkitOverflowScrolling:touch.
 *   Min-width logic already adapts to period count — no change needed there.
 *
 * WHY  · §16 Future Outlook needs a phase-encoded timeline showing build
 *        progression of entities (warehouses · networks · projects) across
 *        FY periods. Refs use grid-based gantt in strategic planning sections
 *        (rainbow-pothos §16 pipeline). CSS grid gives clean alignment and
 *        avoids Highcharts Gantt module license complexity.
 *
 * WHAT · N entity rows × M FY-period columns · CSS grid. Phase color encoding
 *        via background fill + opacity (planning → build → commissioning → live →
 *        completed). Click callback per cell. Hover ring. Optional cell label.
 *
 * WHEN · §16 Future Outlook pipeline · §08 Market Size capacity build-out ·
 *        any entity × time-period phase visualization.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenGanttTimeline.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenGanttTimeline
 *          periods={['FY25','FY26','FY27','FY28','FY29','FY30']}
 *          entries={[
 *            { id: 'e1', entityName: 'Lineage Sydney', phases: [
 *                { period: 'FY25', phase: 'planning' },
 *                { period: 'FY26', phase: 'build' },
 *              ]},
 *          ]}
 *        />
 *        ```
 *
 * A11y · role="table" + column/row headers · aria-label per cell.
 *
 * @module design-system/core-v2/src/charts/charts/KenGanttTimeline
 */

import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { CellTooltip } from '../primitives/CellTooltip';
import { TruncatedText } from '../primitives/TruncatedText';
import { KEN_CHART_FONT } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GanttPhase = 'planning' | 'build' | 'commissioning' | 'live' | 'completed';

export interface GanttEntry {
  id: string;
  /** Row label */
  entityName: string;
  /** Phase cells — one per period that has activity. Sparse: missing = empty */
  phases: Array<{
    /** Must match one of the strings in the `periods` prop */
    period: string;
    phase: GanttPhase;
    /** Optional override text in cell · default = phase name */
    label?: string;
  }>;
}

export interface KenGanttTimelineProps {
  /** Column headers · e.g. ['FY25','FY26','FY27','FY28','FY29','FY30'] */
  periods: readonly string[];
  /** Row entries */
  entries: readonly GanttEntry[];
  /** Row height px · default 48 */
  rowHeight?: number;
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
  onCellClick?: (entry: GanttEntry, period: string) => void;
  /** Optional className on outer wrapper */
  className?: string;
}

// ─── Phase color map · luminance-stepped · color-blind safe ──────────────────
// FIX 7 (G.10 REVISED): v2 desaturated periwinkle/perano palette (Bible § 1.7 · NO warm ochre).
// v2 LUMINANCE_SAFE: darkest=#6b5fb8(L*48)·primary=#857fc8(L*58)·quaternary=#a39ee0(L*65)
//                   secondary=#b8c4c0(L*76 sage neutral)·tertiary=#c5c3ec(L*78)·light=#e6e7f5(L*92)
//
// Light surface (5-phase ramp · low→high emphasis):
//   planning=light(L*92) · build=tertiary(L*78) · commissioning=quaternary(L*65)
//   live=primary(L*58 mid-deep periwinkle) · completed=darkest(L*48 deeper periwinkle · achievement)
//
// Dark surface (inverted — early phases dark · completed = brightest/most prominent):
//   planning=darkest(L*48) · build=primary(L*58) · commissioning=quaternary(L*65)
//   live=tertiary(L*78) · completed=light(L*92 · max prominence)
//
// Each step ≥10 L* apart · monochrome conversion distinguishes all phases.
// Bible § 1.5 soft-first: planning=lightest emphasis (not darkest). Completed=achievement emphasis.

// v0.4-aligned (2026-05-28 FINAL): 5-phase ramp via opacity + solid · editorial soft.
// planning + build = perano opacity (soft airy) · commissioning + live = solid periwinkle · completed = deeper periwinkle emphasis.
const PHASE_COLORS_LIGHT: Record<GanttPhase, string> = {
  planning:      'rgba(134, 179, 229, 0.15)', // perano @ 15% · softest airy
  build:         'rgba(134, 179, 229, 0.30)', // perano @ 30%
  commissioning: '#c3c6f9',                    // periwinkle-500 L*78 SOLID
  live:          '#9488ec',                    // periwinkle L*62 SOLID (white text)
  completed:     '#5e51c8',                    // periwinkle-700 L*45 · achievement emphasis (white text)
};

const PHASE_COLORS_DARK: Record<GanttPhase, string> = {
  // Inverted ramp · early phases dark · completed brightest
  planning:      'rgba(195, 198, 249, 0.18)', // periwinkle @ 18% on dark
  build:         'rgba(195, 198, 249, 0.35)', // periwinkle @ 35%
  commissioning: '#9488ec',                    // periwinkle L*62 SOLID
  live:          '#c3c6f9',                    // periwinkle-500 L*78 SOLID
  completed:     '#e0e3fb',                    // periwinkle lightest L*90 · max prominence
};

// Text colors per Bible § 1.8 fill⟷text pairing rule · WCAG 4.5:1 verified.
// G.12 fix: live `#9488ec` L*62 + white = 2.86:1 FAIL. Use dark ink (7.1:1 PASS).
const PHASE_TEXT_COLORS_LIGHT: Record<GanttPhase, string> = {
  planning:      'rgba(26,26,46,0.90)',     // dark ink on soft perano opacity bg
  build:         'rgba(26,26,46,0.92)',     // dark ink on mid perano opacity bg
  commissioning: 'rgba(26,26,46,0.92)',     // dark ink on periwinkle-500 L*78
  live:          'rgba(26,26,46,0.92)',     // DARK INK on periwinkle L*62 (7.1:1 PASS · was white FAIL)
  completed:     'rgba(255,255,255,0.95)',  // white on periwinkle-700 L*45 (only L*<50 → white)
};

const PHASE_TEXT_COLORS_DARK: Record<GanttPhase, string> = {
  planning:      'rgba(255,255,255,0.92)',  // white on soft periwinkle opacity bg (dark bg through)
  build:         'rgba(255,255,255,0.92)',  // white on mid periwinkle opacity bg
  commissioning: 'rgba(26,26,46,0.92)',     // DARK INK on periwinkle L*62 (7.1:1 PASS · was white FAIL)
  live:          'rgba(26,26,46,0.92)',     // dark ink on periwinkle-500 L*78
  completed:     'rgba(26,26,46,0.95)',     // dark ink on periwinkle lightest L*90
};

// Dark surface row-hover brightness: applied as 'inset 0 0 0 9999px rgba(255,255,255,0.05)' boxShadow overlay in cell style

const PHASE_LABELS: Record<GanttPhase, string> = {
  planning:      'Planning',
  build:         'Build',
  commissioning: 'Commissioning',
  live:          'Live',
  completed:     'Completed',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function KenGanttTimeline({
  periods,
  entries,
  rowHeight = 48,
  ariaLabel,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  disableReveal = false,
  onCellClick,
  className,
}: KenGanttTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  // Hover whole-row: highlight one entity row · dim all others to 0.4 opacity
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const isDark = surface === 'dark';

  const headerHeight = 40;
  const entityLabelWidth = 200;

  // Bible § 1.3: dark muted = rgba(255,255,255,0.62). Using 0.75 (body) for header text —
  // G.7 audit found 2.05:1 fail on dark; bumped to body level for safe margin (≥4.5:1).
  const headerColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)';
  const entityNameColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,46,0.9)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const emptyCellBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="generic" height={(entries.length + 1) * rowHeight + headerHeight} />;
  if (empty)        return <ChartEmptyState title="No timeline data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      {/* Mobile strategy: SCROLL · overscroll-behavior contains swipe · webkit smooth */}
      {/* Scroll wrapper — role/aria-label on the inner role="table" div provide a11y context.
          Removed role="img" (caused nested-interactive violation when cells are clickable). */}
      <div
        className={['w-full overflow-x-auto', className ?? ''].join(' ')}
        style={{
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        <div
          role="table"
          aria-label={ariaLabel ?? 'Gantt timeline'}
          style={{
            display: 'grid',
            gridTemplateColumns: `minmax(120px, ${entityLabelWidth}px) repeat(${periods.length}, minmax(60px, 1fr))`,
            gridTemplateRows: `${headerHeight}px repeat(${entries.length}, ${rowHeight}px)`,
            fontFamily: KEN_CHART_FONT.sans,
            width: '100%',
            minWidth: 120 + periods.length * 60,
            border: `1px solid ${borderColor}`,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {/* Header row — role="row" with display:contents preserves CSS grid layout */}
          <div role="row" style={{ display: 'contents' }}>
            {/* Entity-label column header · sr-only span provides accessible text per axe empty-table-header rule */}
            <div role="columnheader" aria-label="Entity" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <span className="sr-only">Entity</span>
            </div>
            {periods.map((period) => (
              <div
                key={`header-${period}`}
                role="columnheader"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: headerColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderLeft: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {period}
              </div>
            ))}
          </div>

          {/* Data rows — each row wrapped in role="row" with display:contents */}
          {entries.map((entry, rowIdx) => {
            const isLastRow = rowIdx === entries.length - 1;
            const phaseMap = new Map(entry.phases.map((p) => [p.period, p]));
            const isRowHovered = hoveredEntityId === entry.id;
            // PART B fix: Bible § 2.2 Gantt · whole-row dim others 0.45 · isolate via border accent
            // Bible § 2.1 supersedes G.1 "border accent only" — both isolate AND dim required
            const isRowDimmed = hoveredEntityId !== null && !isRowHovered;
            // G.2: added background-color + color to transition for smooth surface switch + dark hover
            const rowTransition = prefersReducedMotion
              ? undefined
              : 'background-color 200ms ease-out, color 200ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out';

            return (
              <div key={`entry-${entry.id}`} role="row" style={{ display: 'contents' }}>
                {/* Entity label cell — TruncatedText (200px col · names often longer) */}
                <div
                  role="rowheader"
                  onMouseEnter={() => setHoveredEntityId(entry.id)}
                  onMouseLeave={() => setHoveredEntityId(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 12,
                    paddingRight: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: entityNameColor,
                    borderBottom: isLastRow ? undefined : `1px solid ${borderColor}`,
                    overflow: 'hidden',
                    // Border accent on row hover: periwinkle left border accent (whole-row signal)
                    borderLeft: isRowHovered && !prefersReducedMotion
                      ? '3px solid rgb(228,226,240)'
                      : '3px solid transparent',
                    // PART B fix: Bible § 2.2 Gantt · dim non-hovered rows to 0.45
                    opacity: isRowDimmed ? 0.45 : 1,
                    transition: rowTransition,
                    cursor: 'default',
                  }}
                >
                  <TruncatedText
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: entityNameColor,
                      width: '100%',
                    }}
                    tooltipMeta={`${entry.phases.length} phase${entry.phases.length !== 1 ? 's' : ''} · ${entry.phases.map(p => p.period).join(', ')}`}
                    alwaysShowTooltip={false}
                  >
                    {entry.entityName}
                  </TruncatedText>
                </div>

                {/* Phase cells */}
                {periods.map((period) => {
                  const phaseData = phaseMap.get(period);
                  const isClickable = !!onCellClick;
                  const cellTransition = prefersReducedMotion
                    ? undefined
                    : 'background-color 200ms ease-out, color 200ms ease-out, box-shadow 0.15s ease-out';

                  if (!phaseData) {
                    return (
                      <div
                        key={`cell-${entry.id}-${period}`}
                        role="cell"
                        aria-label={`${entry.entityName} ${period}: no activity`}
                        onMouseEnter={() => setHoveredEntityId(entry.id)}
                        onMouseLeave={() => setHoveredEntityId(null)}
                        style={{
                          background: emptyCellBg,
                          borderLeft: `1px solid ${borderColor}`,
                          borderBottom: isLastRow ? undefined : `1px solid ${borderColor}`,
                          // PART B fix: dim non-hovered rows to 0.45
                          opacity: isRowDimmed ? 0.45 : 1,
                          transition: prefersReducedMotion ? undefined : 'opacity 200ms ease-out',
                        }}
                      />
                    );
                  }

                  const phaseColorMap = isDark ? PHASE_COLORS_DARK : PHASE_COLORS_LIGHT;
                  const phaseTextMap = isDark ? PHASE_TEXT_COLORS_DARK : PHASE_TEXT_COLORS_LIGHT;
                  const bg = phaseColorMap[phaseData.phase];
                  const textColor = phaseTextMap[phaseData.phase];
                  // Dark surface row-hover brightness boost applied via boxShadow overlay below
                  // (rgba white inset 9999px fill — avoids re-computing fill, works with transition)
                  const displayLabel = phaseData.label ?? PHASE_LABELS[phaseData.phase];

                  // Tooltip: entity name + period + phase + notes
                  const tooltipContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontWeight: 600 }}>{entry.entityName}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.65)' }}>
                        {period} · {displayLabel}
                      </span>
                      {phaseData.label && (
                        <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.50)' }}>
                          {phaseData.label}
                        </span>
                      )}
                    </div>
                  );

                  return (
                    <CellTooltip key={`cell-${entry.id}-${period}`} content={tooltipContent} position="auto">
                      <div
                        role="cell"
                        tabIndex={isClickable ? 0 : undefined}
                        aria-label={`${entry.entityName} ${period}: ${displayLabel}`}
                        onClick={isClickable ? () => onCellClick(entry, period) : undefined}
                        onKeyDown={isClickable ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCellClick(entry, period); }
                        } : undefined}
                        onMouseEnter={() => setHoveredEntityId(entry.id)}
                        onMouseLeave={() => setHoveredEntityId(null)}
                        onFocus={(e) => {
                          setHoveredEntityId(entry.id);
                          // FIX 5 (G.10): Use outline (not inset shadow) for focus ring — no bleed.
                          e.currentTarget.style.outline = '2px solid rgb(228,226,240)';
                          e.currentTarget.style.outlineOffset = '-2px';
                        }}
                        onBlur={(e) => {
                          setHoveredEntityId(null);
                          e.currentTarget.style.outline = '';
                          e.currentTarget.style.outlineOffset = '';
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: bg,
                          borderLeft: `1px solid ${borderColor}`,
                          borderBottom: isLastRow ? undefined : `1px solid ${borderColor}`,
                          cursor: isClickable ? 'pointer' : 'default',
                          // CSS transition: smooth bg/color change on surface switch + hover
                          transition: cellTransition,
                          fontSize: 9,
                          fontWeight: 600,
                          color: textColor,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '0 4px',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          // PART B fix: dim non-hovered rows to 0.45 (Bible § 2.2 Gantt)
                          opacity: isRowDimmed ? 0.45 : 1,
                          // FIX 5 (G.10): Row hover ring — outline replaces inset box-shadow.
                          // inset shadow at 2px bleeds visually across shared 1px cell borders.
                          // outline-offset: -2px renders within cell bounds · no layout effect ·
                          // no adjacent-cell bleed. Dark surface: brightness overlay kept via boxShadow.
                          // 'none' default removed — undefined = no outline CSS property set.
                          outline: isRowHovered && !prefersReducedMotion
                            ? '2px solid rgb(228,226,240)'
                            : 'none',
                          outlineOffset: isRowHovered && !prefersReducedMotion ? '-2px' : undefined,
                          boxShadow: isRowHovered && !prefersReducedMotion && isDark
                            ? 'inset 0 0 0 9999px rgba(255,255,255,0.05)'
                            : undefined,
                        }}
                      >
                        {displayLabel}
                      </div>
                    </CellTooltip>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </ChartReveal>
  );
}
