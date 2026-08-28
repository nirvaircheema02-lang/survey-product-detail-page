'use client';

/**
 * KenRadarChart · multi-dimension comparison (spider / polar chart).
 *
 * WHY  · Shows capability scoring across 4-8 axes simultaneously — the canonical
 *        format for competitor capability matrices · market readiness assessments ·
 *        and technology stack evaluations in management research. Lets readers
 *        compare area-shapes instead of reading individual bar values.
 *
 * WHAT · Highcharts `polar` chart with `line` series type · highcharts-more module.
 *        Each series renders as an areaspline polygon across all axes.
 *        Fill at 0.25 opacity (Bible § 1.7 v3 opacity strategy · same hex family soft).
 *        1-3 series overlay supported · more than 3 creates visual clutter.
 *        Legend enabled when >1 series.
 *
 * WHEN · §14 Competitor Comparison · §15 Capability Matrix · any radar-grid
 *        scoring across 4-8 named dimensions.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenRadarChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenRadarChart
 *          axes={['Supply Chain', 'Cold Storage', 'Fleet Size', 'Tech Stack', 'Compliance']}
 *          series={[
 *            { name: 'Ken Research Coverage', data: [80, 65, 90, 72, 88] },
 *            { name: 'Competitor A',           data: [70, 82, 60, 85, 75] },
 *          ]}
 *          max={100}
 *        />
 *        ```
 *
 * Color discipline (Bible § 1.7 v3 · v0.4 aligned):
 *   Series 1 · `#9488ec` stroke solid + fill @ 0.25 opacity (primary periwinkle L*62)
 *   Series 2 · `#c3c6f9` stroke solid + fill @ 0.25 opacity (secondary L*78)
 *   Series 3 · `#86b3e5` stroke solid + fill @ 0.25 opacity (tertiary perano L*70)
 *   Gridlines · #e6e6e6 1px polygon (Bible § 11.2)
 *   Axis labels · rgba(0,0,0,0.6) 11px DM Sans (v0.4 confirmed)
 *
 * A11y · `role="img"` on outer `<figure>` · `aria-label` required from consumer.
 *
 * @module design-system/core-v2/src/charts/charts/KenRadarChart
 */

import { useMemo, useRef, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { buildKenChartBase, surfaceOverrides } from '../theme/highcharts-base';
import type { ChartSurface } from '../theme/highcharts-base';
import { KEN_CHART_SERIES_ARRAY, KEN_CHART_FONT } from '../theme/tokens';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

// highcharts-more factory · registers polar chart type + areaspline series
// MUST call factory with Highcharts instance · bare side-effect import fails in SSR.
import HighchartsMore from 'highcharts/highcharts-more';

if (typeof window !== 'undefined' && typeof HighchartsMore === 'function') {
  (HighchartsMore as (h: typeof Highcharts) => void)(Highcharts);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** A single dimension series in a radar chart */
export interface RadarSeries {
  /** Series name · appears in legend and tooltip */
  name: string;
  /**
   * One value per axis · must match `axes` array length.
   * Values should be in range [0, max] (auto-scaled if max not provided).
   */
  data: number[];
}

export interface KenRadarChartProps {
  /** Axis labels · 4-8 dimensions. Fewer = too simple for radar · more = too dense. */
  axes: string[];
  /** 1-3 series to overlay on the radar grid */
  series: RadarSeries[];
  /** Chart height in pixels · @default 380 */
  height?: number;
  /**
   * Y-axis maximum value (all axes share the same scale).
   * @default auto-computed from max of all series data
   */
  max?: number;
  /** Surface context · light = editorial-light · dark = cinematic section · @default 'light' */
  surface?: ChartSurface;
  /** Loading state → ChartSkeleton */
  loading?: boolean;
  /** Empty state → ChartEmptyState */
  empty?: boolean;
  /** Error message → ErrorState */
  errorMessage?: string;
  /** aria-label for screen readers */
  ariaLabel?: string;
  /** Optional className for outer container */
  className?: string;
  /**
   * Disable ChartReveal entrance animation.
   * @default false
   */
  disableReveal?: boolean;
}

// ─── Deep merge utility ───────────────────────────────────────────────────────
function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!source) return target;
  const out: Record<string, unknown> = { ...(target as Record<string, unknown>) };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const srcVal = source[key];
    const tgtVal = (target as Record<string, unknown>)[key as string];
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      out[key as string] = deepMerge(tgtVal, srcVal as Partial<typeof tgtVal>);
    } else {
      out[key as string] = srcVal;
    }
  }
  return out as T;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KenRadarChart({
  axes,
  series,
  height = 380,
  max,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenRadarChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const isDark = surface === 'dark';
  const inkMuted = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // Gridlines on dark: use white-alpha
  const gridLineColor = isDark ? 'rgba(255,255,255,0.12)' : '#e6e6e6';
  // Tooltip bg canonical white · dark ink for tooltip text (Bible § 9.14)
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  // Auto-compute max from data if not provided
  const axisMax = useMemo(() => {
    if (max !== undefined) return max;
    const allVals = series.flatMap((s) => s.data);
    return allVals.length > 0 ? Math.ceil(Math.max(...allVals) * 1.1) : 100;
  }, [max, series]);

  // Map series to Highcharts format · assign colors + fill opacity
  const seriesData = useMemo(() =>
    series.slice(0, 3).map((s, idx) => ({
      type: 'area' as const,
      name: s.name,
      data: s.data,
      color: KEN_CHART_SERIES_ARRAY[idx],
      fillOpacity: 0.25, // Bible § 1.7 v3: same hex family at low opacity for editorial-soft
      lineWidth: 2,
      pointPlacement: 'on' as const,
      marker: {
        enabled: true,
        symbol: 'circle' as const,
        radius: 3,
        fillColor: KEN_CHART_SERIES_ARRAY[idx],
        lineWidth: 0,
      },
      showInLegend: true,
      states: {
        hover: {
          lineWidth: 3,
          halo: { size: 6, opacity: 0.20 },
        },
        inactive: { opacity: 0.35 },
      },
    })),
    [series]
  );

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    // Surface overrides: keep tooltip white · invert axis/gridline colors
    const surfOpts = surfaceOverrides(surface);

    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        polar: true,
        type: 'line',
        height,
        // Polar charts need less left/right margin (symmetric)
        marginLeft: undefined,
        marginRight: undefined,
        spacing: [16, 16, 16, 16],
      },
      xAxis: {
        categories: axes,
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineWidth: 1,
        gridLineColor,
        labels: {
          style: {
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
        },
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        max: axisMax,
        gridLineColor,
        gridLineWidth: 1,
        labels: {
          style: {
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '9px',
          },
          // Only show a few ticks to avoid clutter
          step: Math.ceil(axisMax / 4),
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${this.key} · ${this.series.name}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${v}</div>
            </div>
          `;
        },
      },
      legend: {
        enabled: series.length > 1,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          color: inkMuted,
          fontFamily: KEN_CHART_FONT.sans,
          fontSize: '11px',
          fontWeight: '400',
        },
        symbolRadius: 2,
        symbolHeight: 8,
        symbolWidth: 8,
      },
      plotOptions: {
        series: {
          // polar charts: pointPlacement must be 'on' for vertices to align with axes
          pointPlacement: 'on',
          states: {
            hover: {
              lineWidth: 3,
              halo: { size: 8, opacity: 0.20 },
            },
            inactive: { opacity: 0.35 },
          },
        },
      },
      series: seriesData,
    } as Partial<Highcharts.Options>);
  }, [axes, seriesData, height, axisMax, surface, gridLineColor, inkMuted, series.length]);

  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => chartRef.current?.chart?.reflow());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="line" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <figure
        ref={(el) => { containerRef.current = el; }}
        className={className}
        role="img"
        aria-label={ariaLabel ?? 'Multi-dimension radar comparison chart'}
        style={{ width: '100%' }}
      >
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%' } }}
        />
      </figure>
    </ChartReveal>
  );
}
