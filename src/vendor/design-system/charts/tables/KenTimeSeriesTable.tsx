'use client';

/**
 * KenTimeSeriesTable · time-period rows with inline sparkline trend column · Ken DS.
 *
 * WHY  · Research PDPs present market size / revenue / volume across FY periods.
 *        Tabular numbers convey precision · sparklines convey momentum and direction.
 *        Combined, they serve both the skim-reader (sparkline) and the analyst
 *        (exact values). No v0.4 precedent — NEW pattern per Sprint G.11 brief.
 *
 * WHAT · Row labels + N period columns (e.g. FY20-FY24) + optional sparkline column
 *        + optional change % column. Values are numeric · right-aligned ·
 *        tabular-nums font feature. Sparkline uses KenSparklineChart (80×24 default).
 *        Change % renders sage ↑ (positive) · brand-red ↓ (negative) · em-dash (zero).
 *        Row hover + skip-shade per Bible § 2.4.
 *
 * WHEN · §11 Market Size / Revenue tables · any multi-period numerical series ·
 *        FY summary tables in executive section.
 *
 * WHERE · `design-system/core-v2/src/charts/tables/KenTimeSeriesTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenTimeSeriesTable
 *          periods={['FY20', 'FY21', 'FY22', 'FY23', 'FY24']}
 *          rows={[
 *            { label: 'Total Revenue', values: [4.2, 4.6, 5.0, 5.5, 5.9] },
 *            { label: 'Cold Chain', sublabel: 'AUD Bn', values: [1.1, 1.3, 1.5, 1.8, 2.1] },
 *          ]}
 *          unit="AUD Bn"
 *          showSparkline
 *          showChange
 *        />
 *        ```
 *
 * Change % auto-computation: when `changePct` is omitted, computed as
 *   `(lastValue - firstValue) / firstValue * 100` (absolute period-over-period: CAGR proxy).
 *   If consumer needs YoY last-period change, pass explicit `changePct`.
 *
 * Color discipline (Bible § 1.7 v3 · sageGrowth semantic):
 *   Sparkline stroke · #9488ec (KEN_CHART_SERIES.primary · periwinkle)
 *   Positive change  · #7da982 sage (KEN_CHART_SERIES.sageGrowth · growth-oriented data)
 *   Negative change  · #b01f24 brand-red (semantic loss · NOT chart series)
 *   Neutral (zero)   · em-dash · ink-muted
 *
 * A11y · `<caption>` via ariaLabel visually hidden · scope="col" on th ·
 *        scope="row" on row-label cells · change arrows have aria-hidden=true ·
 *        change % cells have aria-label for screen readers.
 *
 * @module design-system/core-v2/src/charts/tables/KenTimeSeriesTable
 * @relatedDoc design-system/core-v2/src/charts/charts/KenSparklineChart.tsx
 * @relatedDoc design-system/core-v2/docs/CHARTS_TABLES_DATA_VIZ_BIBLE.md § 1.7 § 2.4
 */

import { useState } from 'react';
import { TableShell, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import { KenSparklineChart } from '../charts/KenSparklineChart';
import { KEN_CHART_SERIES } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * TimeSeriesRow · one subject row across all time periods.
 * `values` must be same length as `periods` prop.
 */
export interface TimeSeriesRow {
  /** Row label — primary metric name. */
  label: string;
  /**
   * Optional sub-label · shown italic below label · typically the unit for this row
   * when rows have heterogeneous units (override `unit` prop per row).
   */
  sublabel?: string;
  /**
   * Values across periods · same-length as `periods` prop.
   * Must be numeric (NaN allowed for missing data · renders as `—`).
   */
  values: number[];
  /**
   * Optional pre-computed change percent (e.g. CAGR or latest-YoY).
   * When omitted, auto-computed as `(last - first) / first * 100`.
   * @default auto-computed
   */
  changePct?: number;
}

/**
 * KenTimeSeriesTableProps · time-period table with inline sparkline.
 */
export interface KenTimeSeriesTableProps {
  /** Period column headers · e.g. ['FY20', 'FY21', 'FY22', 'FY23', 'FY24']. */
  periods: string[];
  /** Row data. Each row.values.length MUST equal periods.length. */
  rows: TimeSeriesRow[];
  /**
   * Show inline sparkline column (rightmost before change %).
   * Sparkline is 80×24px, non-interactive, aria-labelled.
   * @default true
   */
  showSparkline?: boolean;
  /**
   * Show change % column (rightmost).
   * Auto-computed from first→last unless row.changePct is provided.
   * @default true
   */
  showChange?: boolean;
  /**
   * Unit suffix appended to each value (e.g. 'AUD Bn', '%', 'USD Mn').
   * Omit for raw numbers. Individual rows can override via `sublabel`.
   */
  unit?: string;
  /** Card: bordered rounded. Open: flush editorial. @default 'card' */
  variant?: TableVariant;
  /** wash / transparent / inverted. @default 'wash' */
  headerStyle?: TableHeaderStyle;
  /** Row density. @default 'comfortable' */
  density?: TableDensity;
  /** Light or dark surface. @default 'light' */
  surface?: ChartSurface;
  /** aria-label on the table element. */
  ariaLabel?: string;
  /** Additional className on the outer wrapper. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Compute period-over-period change %.
 * Returns (last - first) / first * 100 · or NaN if first === 0 or data is invalid.
 */
function computeChangePct(values: number[]): number {
  if (values.length < 2) return NaN;
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0 || isNaN(first) || isNaN(last)) return NaN;
  return ((last - first) / Math.abs(first)) * 100;
}

/** Format a number for display · 2 decimal places · tabular-nums. NaN → em-dash. */
function fmtValue(v: number, unit?: string): string {
  if (isNaN(v)) return '—';
  const num = Number.isInteger(v) ? v.toString() : v.toFixed(2);
  return unit ? `${num} ${unit}` : num;
}

// ─── Change indicator ─────────────────────────────────────────────────────────

interface ChangeIndicatorProps {
  pct: number;
  surface: ChartSurface;
}

function ChangeIndicator({ pct, surface }: ChangeIndicatorProps) {
  const onDark = surface === 'dark';

  if (isNaN(pct)) {
    return (
      <span
        aria-label="Change not available"
        style={{
          color: onDark
            ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.45))'
            : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
          fontFeatureSettings: '"tnum"',
        }}
      >
        —
      </span>
    );
  }

  const isPositive = pct > 0;
  const isZero = pct === 0;

  if (isZero) {
    return (
      <span
        aria-label="No change"
        style={{
          color: onDark
            ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.45))'
            : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
          fontFeatureSettings: '"tnum"',
        }}
      >
        —
      </span>
    );
  }

  // Sage growth for positive · brand-red for negative
  const color = isPositive
    ? KEN_CHART_SERIES.sageGrowth
    : 'var(--brand-red, #b01f24)';

  // Arrow chars — aria-hidden · screen reader gets aria-label on parent td
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span
      aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(pct).toFixed(1)}%`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        color,
        fontWeight: 600,
        fontSize: '0.9em',
        fontFeatureSettings: '"tnum"',
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '0.85em' }}>{arrow}</span>
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * KenTimeSeriesTable · multi-period numeric table with sparkline trend column.
 *
 * @see KenTimeSeriesTableProps for full API.
 */
export function KenTimeSeriesTable({
  periods,
  rows,
  showSparkline = true,
  showChange = true,
  unit,
  variant = 'card',
  headerStyle = 'wash',
  density = 'comfortable',
  surface = 'light',
  ariaLabel = 'Time series data table',
  className,
}: KenTimeSeriesTableProps) {
  // Row hover state — Bible § 2.4 skip-shade
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
          {/* Row label column */}
          <th scope="col" style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
            Metric
          </th>

          {/* Period columns — right-aligned numerics */}
          {periods.map((period, pi) => (
            <th
              key={pi}
              scope="col"
              style={{ textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
            >
              {period}
            </th>
          ))}

          {/* Sparkline column */}
          {showSparkline && (
            <th scope="col" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
              Trend
            </th>
          )}

          {/* Change % column */}
          {showChange && (
            <th scope="col" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              Change
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, ri) => {
          const isHovered = hoveredRow === ri;
          const rowBg = isHovered
            ? (onDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
            : undefined;

          // Compute change pct — explicit row override wins
          const changePct = row.changePct !== undefined
            ? row.changePct
            : computeChangePct(row.values);

          // Sparkline aria label — describe trend direction
          const sparkAriaLabel = (() => {
            if (!showSparkline) return '';
            const dir = changePct > 0 ? 'upward' : changePct < 0 ? 'downward' : 'flat';
            return `${row.label} trend ${dir} across ${periods.join(', ')}`;
          })();

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
              {/* Row label cell — scope="row" */}
              <th
                scope="row"
                style={{
                  textAlign: 'left',
                  fontWeight: 500,
                  color: onDark
                    ? 'var(--semantic-ink-on-dark-strong, rgba(255,255,255,0.92))'
                    : 'var(--semantic-ink-strong, rgba(0,0,0,0.87))',
                  whiteSpace: 'nowrap',
                }}
              >
                <TruncatedText>{row.label}</TruncatedText>
                {row.sublabel && (
                  <span
                    style={{
                      display: 'block',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: '0.82em',
                      color: onDark
                        ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.55))'
                        : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                      marginTop: '2px',
                    }}
                  >
                    {row.sublabel}
                  </span>
                )}
              </th>

              {/* Period value cells — right-aligned · tabular-nums */}
              {row.values.map((val, vi) => (
                <td
                  key={vi}
                  style={{
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    fontFeatureSettings: '"tnum"',
                    color: onDark
                      ? 'var(--semantic-ink-on-dark-body, rgba(255,255,255,0.82))'
                      : 'var(--semantic-ink-body, rgba(0,0,0,0.75))',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fmtValue(val, unit)}
                </td>
              ))}

              {/* Sparkline cell — non-interactive · presentational */}
              {showSparkline && (
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <KenSparklineChart
                      data={row.values.filter((v) => !isNaN(v))}
                      width={80}
                      height={24}
                      ariaLabel={sparkAriaLabel}
                    />
                  </span>
                </td>
              )}

              {/* Change % cell */}
              {showChange && (
                <td
                  style={{
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                  // Aria label delegated to ChangeIndicator span
                  aria-label={undefined}
                >
                  <ChangeIndicator pct={changePct} surface={surface} />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}
