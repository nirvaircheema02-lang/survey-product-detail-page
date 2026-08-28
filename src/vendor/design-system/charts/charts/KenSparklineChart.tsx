'use client';

/**
 * KenSparklineChart · inline mini-trend visualization.
 *
 * WHY  · Dashboard tiles · KPI cards · and table cells need a micro-trend
 *        signal alongside a number. Highcharts overhead (20+ KB init cost)
 *        is disproportionate for a 80×24px element used 10-20× per page.
 *        Pure SVG `<path>` renders in ~1ms with zero library dependencies.
 *
 * WHAT · Lightweight SVG sparkline: single `<path>` line · optional area fill ·
 *        optional terminal circle on last data point.
 *        No axes · no labels · no tooltip · no hover interaction.
 *        Designed to be read with surrounding KPI context · not standalone.
 *
 * WHEN · Table column cells (SparklineColumn pattern) · KPI/MetricStrip cards ·
 *        Dashboard stat tiles · anywhere a micro-trend fits in 80×24px or less.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenSparklineChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        // In a KPI card
 *        <KenSparklineChart
 *          data={[4.2, 4.6, 5.0, 5.5, 5.9, 6.5]}
 *          width={80}
 *          height={24}
 *          ariaLabel="Revenue trend · 6 quarters · up 55%"
 *        />
 *
 *        // Wider with area fill suppressed
 *        <KenSparklineChart
 *          data={[100, 95, 102, 88, 97, 104]}
 *          width={120}
 *          height={32}
 *          showArea={false}
 *          ariaLabel="Volume index · 6 months"
 *        />
 *        ```
 *
 * Color discipline (Bible § 1.7 v3):
 *   Line stroke · `#9488ec` primary periwinkle (matches KEN_CHART_SERIES.primary)
 *   Area fill  · same color at 0.15 opacity (v0.4 opacity strategy · not pre-blended)
 *   Last point · same color solid fill · 2.5px radius circle
 *
 * NO hover · NO tooltip · NO keyboard navigation.
 * This is presentational · parent context (table row · card) owns interaction.
 * aria-label on the SVG element is the ONLY a11y requirement.
 *
 * @module design-system/core-v2/src/charts/charts/KenSparklineChart
 */

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { KEN_CHART_SERIES } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Public API ───────────────────────────────────────────────────────────────

export interface KenSparklineChartProps {
  /** Data values · minimum 2 points · order is left-to-right (oldest first) */
  data: number[];
  /** SVG viewport width in pixels · @default 80 */
  width?: number;
  /** SVG viewport height in pixels · @default 24 */
  height?: number;
  /**
   * Stroke color for the trend line.
   * On light surface: defaults to `#9488ec` periwinkle.
   * On dark surface: defaults to `rgba(255,255,255,0.75)` (Bible § 1.2 surface escape hatch).
   * Explicit `color` prop overrides both defaults.
   * @default derived from `surface`
   */
  color?: string;
  /**
   * Surface context — light = editorial-light · dark = cinematic section.
   * Drives default stroke color when `color` prop is not supplied.
   * @default 'light'
   */
  surface?: ChartSurface;
  /**
   * Show terminal circle on the last (most recent) data point.
   * @default true
   */
  showLastPoint?: boolean;
  /**
   * Show soft area fill below the trend line.
   * Fill is the same color at 0.15 opacity (v0.4 opacity strategy).
   * @default true
   */
  showArea?: boolean;
  /**
   * WCAG 1.1.1 required: accessible description of the trend.
   * Good format: "Revenue trend · 12 periods · ending up 8%"
   * Required — no fallback provided (caller has full data context).
   */
  ariaLabel: string;
  /** Optional CSS className on root SVG */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Vertical padding in px to keep stroke within viewBox on top/bottom edge */
const V_PAD = 2;

/**
 * Maps raw data values to SVG coordinates.
 * Returns `{ points, closedPath }` where:
 *   `points` is an array of [x, y] SVG coordinates
 *   `closedPath` is the area-fill d attribute (M ... L ... L bottom L bottom Z)
 */
function buildPaths(
  data: number[],
  width: number,
  height: number,
): { linePath: string; areaPath: string } {
  if (data.length < 2) {
    // Degenerate: single point → flat line at midpoint
    const y = height / 2;
    return {
      linePath: `M 0 ${y} L ${width} ${y}`,
      areaPath: `M 0 ${y} L ${width} ${y} L ${width} ${height} L 0 ${height} Z`,
    };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // prevent divide-by-zero for flat series

  const usableH = height - V_PAD * 2;
  const stepX = width / (data.length - 1);

  const pts = data.map((v, i) => {
    const x = i * stepX;
    // Invert Y: SVG y increases downward · min value should be at bottom
    const y = V_PAD + usableH - ((v - min) / range) * usableH;
    return [x, y] as [number, number];
  });

  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');

  // Close the area path: go right-bottom → left-bottom → back to start
  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  const areaPath = `${linePath} L ${lastPt[0].toFixed(2)} ${height} L ${firstPt[0].toFixed(2)} ${height} Z`;

  return { linePath, areaPath };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KenSparklineChart({
  data,
  width = 80,
  height = 24,
  color,
  surface = 'light',
  showLastPoint = true,
  showArea = true,
  ariaLabel,
  className,
}: KenSparklineChartProps) {
  // Surface-aware default color (Bible § 1.2: surface prop is escape hatch for CSS var unreachable context).
  // Light: Ken periwinkle primary · Dark: soft white at 75% opacity (4.5:1+ on #0a0a0c).
  const resolvedColor = color ?? (surface === 'dark' ? 'rgba(255,255,255,0.75)' : KEN_CHART_SERIES.primary);
  const prefersReducedMotion = useReducedMotion();

  const { linePath, areaPath } = useMemo(
    () => buildPaths(data, width, height),
    [data, width, height]
  );

  // Last point coordinates for terminal circle
  const lastPoint = useMemo(() => {
    if (data.length < 2) return { x: width, y: height / 2 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const usableH = height - V_PAD * 2;
    const lastVal = data[data.length - 1];
    return {
      x: width,
      y: V_PAD + usableH - ((lastVal - min) / range) * usableH,
    };
  }, [data, width, height]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={ariaLabel}
      role="img"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
    >
      {/* Area fill: resolvedColor at 0.15 opacity (Bible § 1.7 v3 opacity strategy) */}
      {showArea && (
        <path
          d={areaPath}
          fill={resolvedColor}
          fillOpacity={0.15}
          stroke="none"
          style={
            prefersReducedMotion
              ? undefined
              : { transition: 'fill-opacity 200ms ease-out' }
          }
        />
      )}

      {/* Trend line */}
      <path
        d={linePath}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal circle on last data point */}
      {showLastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={resolvedColor}
          stroke="none"
        />
      )}
    </svg>
  );
}
