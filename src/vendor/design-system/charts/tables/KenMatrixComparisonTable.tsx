'use client';

/**
 * KenMatrixComparisonTable · 2-axis feature/property comparison grid · Ken DS table.
 *
 * WHY  · Research reports frequently compare N entities across M attributes.
 *        PropertyTable handles 1-axis (row labels + column values per player).
 *        MatrixComparisonTable handles 2-axis: both axes are labelled dimensions,
 *        cells carry accent signals (positive/negative/neutral/highlight) that
 *        communicate instant yes/no/partial status without forcing number parsing.
 *        McKinsey Insights and CB Insights both use this pattern for feature grids.
 *
 * WHAT · Full M-row × N-column matrix. Column headers + row headers. Cell values
 *        can be string, ReactNode, or icon-only (Check/X/Minus from Lucide).
 *        Accent colors per cell: positive → sage check · negative → red X ·
 *        neutral → em-dash · highlight → periwinkle tint.
 *        Row hover + alternating skip-shade (Bible § 2.4).
 *        All cell text wrapped in TruncatedText (Bible § 1.9 overflow doctrine).
 *
 * WHEN · Feature comparison grids · market coverage matrices · attribute scoring ·
 *        any 2-axis structured comparison in a research section.
 *
 * WHERE · `design-system/core-v2/src/charts/tables/KenMatrixComparisonTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenMatrixComparisonTable
 *          columns={[{ label: 'Player A' }, { label: 'Player B' }]}
 *          rows={[{
 *            rowLabel: 'Pan-AU Coverage',
 *            cells: [
 *              { value: '', accent: 'positive' },
 *              { value: '', accent: 'negative' },
 *            ],
 *          }]}
 *          variant="card"
 *          headerStyle="wash"
 *        />
 *        ```
 *
 * Color discipline (Bible § 1.7 v3 · opacity strategy):
 *   positive · sage green `#7da982` tint 0.18 bg + Check icon (sageGrowth semantic)
 *   negative · brand-red `rgba(176,31,36,0.10)` bg + X icon
 *   highlight · periwinkle `rgba(148,136,236,0.18)` bg (matches KEN_CHART_SERIES.primary)
 *   neutral  · em-dash · ink-muted · no bg
 *
 * A11y · `<caption>` visually hidden (sr-only) · `scope="col"` on th · `scope="row"` on
 *        row headers · `aria-label` on table wrapper · accent icons have aria-label.
 *
 * @module design-system/core-v2/src/charts/tables/KenMatrixComparisonTable
 * @relatedDoc design-system/core-v2/src/charts/primitives/TableShell.tsx
 * @relatedDoc design-system/core-v2/docs/CHARTS_TABLES_DATA_VIZ_BIBLE.md § 1.7 § 2.4
 */

import { useState, type ReactNode } from 'react';
import { Check, X, Minus } from 'lucide-react';
import { TableShell, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Accent signal for a matrix cell · drives bg tint + icon rendering. */
export type MatrixCellAccent = 'positive' | 'negative' | 'neutral' | 'highlight';

/**
 * MatrixCell · a single cell in the comparison matrix.
 *
 * When `accent` is set and `value` is empty string / undefined, the cell renders
 * icon-only (Check · X · Minus) — preferred for editorial aesthetic.
 * When `value` is provided alongside `accent`, value renders with tinted bg.
 */
export interface MatrixCell {
  /** Display value · string OR React node. Empty string + accent → icon-only mode. */
  value?: string | ReactNode;
  /**
   * Optional accent signal.
   * positive  → sage tint bg + Check icon (if no value)
   * negative  → red tint bg + X icon (if no value)
   * neutral   → em-dash · no bg
   * highlight → periwinkle tint bg
   */
  accent?: MatrixCellAccent;
  /** Tooltip text shown on hover via CellTooltip via TruncatedText. */
  tooltip?: string;
}

/**
 * MatrixRow · one row in the comparison grid.
 * `cells` array MUST be same length as `columns` prop.
 */
export interface MatrixRow {
  /** Row header label — left-most th with scope="row". */
  rowLabel: string;
  /** Optional italic sub-label below the row label. */
  rowSubtitle?: string;
  /** One cell per column · indices align to `columns` prop. */
  cells: MatrixCell[];
}

/**
 * KenMatrixComparisonTableProps · full 2-axis comparison grid.
 */
export interface KenMatrixComparisonTableProps {
  /** Column header definitions. `subtitle` renders smaller below the label. */
  columns: Array<{ label: string; subtitle?: string }>;
  /** Row data. Each row.cells length MUST equal columns.length. */
  rows: MatrixRow[];
  /** Card: bordered rounded. Open: flush editorial. @default 'card' */
  variant?: TableVariant;
  /** wash: periwinkle tint. transparent: border-only. inverted: dark. @default 'wash' */
  headerStyle?: TableHeaderStyle;
  /** Row density. @default 'comfortable' */
  density?: TableDensity;
  /** Light or dark surface — drives icon/text contrast. @default 'light' */
  surface?: ChartSurface;
  /** aria-label on the table element. */
  ariaLabel?: string;
  /** Additional className on the outer wrapper. */
  className?: string;
}

// ─── Accent styling helpers ───────────────────────────────────────────────────

/** Cell background by accent (v0.4 opacity strategy — same hex at low opacity). */
function accentBg(accent: MatrixCellAccent | undefined): string | undefined {
  switch (accent) {
    case 'positive':  return 'rgba(125,169,130,0.18)';   // sageGrowth tint
    case 'negative':  return 'rgba(176,31,36,0.10)';     // brand-red soft
    case 'highlight': return 'rgba(148,136,236,0.18)';   // KEN_CHART_SERIES.primary tint
    case 'neutral':
    default:          return undefined;
  }
}

/**
 * AccentIcon · renders Lucide icon when cell is icon-only mode (no value).
 * Icon size 16px to fit within table cell padding.
 */
function AccentIcon({ accent }: { accent: MatrixCellAccent }) {
  switch (accent) {
    case 'positive':
      return (
        <Check
          size={16}
          aria-label="Yes / Present"
          style={{ color: 'var(--sage-growth, #7da982)', flexShrink: 0 }}
        />
      );
    case 'negative':
      return (
        <X
          size={16}
          aria-label="No / Absent"
          style={{ color: 'var(--brand-red, #b01f24)', flexShrink: 0 }}
        />
      );
    case 'neutral':
      return (
        <Minus
          size={16}
          aria-label="N/A"
          style={{ color: 'var(--semantic-ink-muted, rgba(0,0,0,0.45))', flexShrink: 0 }}
        />
      );
    default:
      return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * KenMatrixComparisonTable · 2-axis feature/property comparison matrix.
 *
 * @see KenMatrixComparisonTableProps for full API.
 * @see PropertyTable for 1-axis variant (row labels + player column values).
 */
export function KenMatrixComparisonTable({
  columns,
  rows,
  variant = 'card',
  headerStyle = 'wash',
  density = 'comfortable',
  surface = 'light',
  ariaLabel = 'Comparison matrix',
  className,
}: KenMatrixComparisonTableProps) {
  // Row hover state — skip-shade pattern (Bible § 2.4)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Dark surface text color for icon fallback
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
          {/* Top-left corner cell — row axis label placeholder */}
          <th scope="col" />

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
            ? (onDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
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
              {/* Row header — left column with scope="row" */}
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

              {/* Data cells */}
              {row.cells.map((cell, ci) => {
                const bg = accentBg(cell.accent);
                const isIconOnly =
                  cell.accent != null &&
                  (cell.value === undefined || cell.value === '');

                return (
                  <td
                    key={ci}
                    style={{
                      textAlign: 'center',
                      background: bg,
                      transition: 'background 150ms ease',
                      color: onDark
                        ? 'var(--semantic-ink-on-dark-body, rgba(255,255,255,0.82))'
                        : 'var(--semantic-ink-body, rgba(0,0,0,0.75))',
                    }}
                  >
                    {isIconOnly ? (
                      // Icon-only mode — preferred for editorial grids
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '44px',
                        }}
                      >
                        <AccentIcon accent={cell.accent!} />
                      </span>
                    ) : cell.accent === 'neutral' && !cell.value ? (
                      // Neutral with no value → em-dash
                      <span
                        aria-label="N/A"
                        style={{
                          color: onDark
                            ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.45))'
                            : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                        }}
                      >
                        —
                      </span>
                    ) : typeof cell.value === 'string' ? (
                      <TruncatedText
                        alwaysShowTooltip={!!cell.tooltip}
                        tooltipMeta={cell.tooltip}
                      >
                        {cell.value}
                      </TruncatedText>
                    ) : (
                      // ReactNode — render as-is
                      cell.value
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}
