'use client';

/**
 * KenWaterfallChart · revenue bridge / contribution decomposition chart.
 *
 * WHY  · Shows "from A to B via X · Y · Z" narrative — how components
 *        build up or subtract to reach a total. Standard format for
 *        revenue bridges · cost breakdowns · variance analysis in
 *        management consulting and research publications.
 *
 * WHAT · Highcharts `waterfall` series (from highcharts-more module).
 *        Positive bars use periwinkle (#9488ec) · negative bars use
 *        quaternary (#7075c8 · darker periwinkle · "down" semantic) ·
 *        total/subtotal bars use sage neutral (#b8c4c0).
 *        Ken DS axis + gridline standards throughout.
 *
 * WHEN · §17 Revenue Bridge · §11 Cost Contribution · §14 Variance
 *        Decomposition · any "from → via → to" narrative chart.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenWaterfallChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenWaterfallChart
 *          data={[
 *            { name: 'Q4 2023', value: 8200, isTotal: true },
 *            { name: 'Volume', value: 1240 },
 *            { name: 'Price', value: -380 },
 *            { name: 'FX', value: -120 },
 *            { name: 'New Channels', value: 640 },
 *            { name: 'Q4 2024', value: 0, isTotal: true },
 *          ]}
 *          unit="AUD Mn"
 *        />
 *        ```
 *
 * A11y · `role="img"` on outer `<figure>` · `aria-label` required from consumer.
 *
 * Color discipline (Bible § 1.7 v3 · v0.4 aligned):
 *   Positive · `#9488ec` primary periwinkle (L*62)
 *   Negative · `#7075c8` quaternary periwinkle-800 (L*55) · still in-family · "down" semantic
 *   Total    · `#b8c4c0` sage neutral · "Other"/"Subtotal" semantic
 *   Connecting lines · `rgba(0,0,0,0.12)` dot-dash hairline
 *
 * @module design-system/core-v2/src/charts/charts/KenWaterfallChart
 */

import { useMemo, useRef, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { buildKenChartBase, surfaceOverrides } from '../theme/highcharts-base';
import type { ChartSurface } from '../theme/highcharts-base';
import { KEN_CHART_SERIES, KEN_CHART_FONT } from '../theme/tokens';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

// highcharts-more factory · registers waterfall series
// Bare side-effect import does NOT work in SSR Next.js builds —
// must call the factory function with the Highcharts instance.
import HighchartsMore from 'highcharts/highcharts-more';

if (typeof window !== 'undefined' && typeof HighchartsMore === 'function') {
  (HighchartsMore as (h: typeof Highcharts) => void)(Highcharts);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** A single point in a waterfall chart */
export interface WaterfallPoint {
  /** Category label for this bar */
  name: string;
  /**
   * Numeric value.
   * Positive = incremental up · negative = incremental down.
   * Ignored for total bars (Highcharts computes cumulative sum automatically).
   */
  value: number;
  /**
   * When true · renders as total/subtotal bar (neutral sage color).
   * Highcharts waterfall automatically sums preceding values.
   * @default false
   */
  isTotal?: boolean;
}

export interface KenWaterfallChartProps {
  /** Waterfall data points in left-to-right narrative order */
  data: WaterfallPoint[];
  /** Chart height in pixels · @default 360 */
  height?: number;
  /** Unit suffix shown in tooltip (e.g. "AUD Mn" · "%") */
  unit?: string;
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
   * Use for above-fold charts where entrance would be invisible.
   * @default false
   */
  disableReveal?: boolean;
}

// ─── Color constants ──────────────────────────────────────────────────────────

/** Positive contribution · periwinkle primary (L*62) */
const COLOR_POSITIVE = KEN_CHART_SERIES.primary;   // #9488ec
/** Negative contribution · quaternary darker periwinkle (L*55) · "down" semantic */
const COLOR_NEGATIVE = KEN_CHART_SERIES.quaternary; // #7075c8
/** Total / subtotal bar · sage neutral */
const COLOR_TOTAL    = KEN_CHART_SERIES.neutral;    // #b8c4c0

// ─── Deep merge utility (shared pattern across Ken chart wrappers) ────────────
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

export function KenWaterfallChart({
  data,
  height = 360,
  unit,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenWaterfallChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Surface-aware ink · tooltip bg canonical white · use dark ink for tooltip text
  const isDark = surface === 'dark';
  const inkMuted = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // Tooltip text always dark (white bg canonical · Bible § 9.14)
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  // Map WaterfallPoint[] → Highcharts point format
  const pointData = useMemo(() =>
    data.map((pt) => ({
      name:    pt.name,
      y:       pt.value,
      isSum:   pt.isTotal === true,
      color:   pt.isTotal ? COLOR_TOTAL : pt.value >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE,
    })),
    [data]
  );

  const categoryLabels = useMemo(() => data.map((pt) => pt.name), [data]);

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);
    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        type: 'waterfall',
        height,
      },
      xAxis: {
        categories: categoryLabels,
        crosshair: {
          color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          width: 1,
        },
      },
      yAxis: {
        labels: {
          style: {
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const pt = this.point as Highcharts.Point & { isSum?: boolean };
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          });
          const sign = (this.y as number) >= 0 ? '+' : '';
          const displayVal = pt.isSum ? v : `${sign}${v}`;
          const unitPart = unit
            ? ` <span style="color:${tooltipInkMuted};font-size:10px;">${unit}</span>`
            : '';
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${this.key}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${displayVal}${unitPart}</div>
            </div>
          `;
        },
      },
      plotOptions: {
        waterfall: {
          borderWidth: 0,
          borderRadius: 0,
          // Connecting lines between bars (upBar → connector → downBar)
          lineColor: 'rgba(0,0,0,0.20)',
          lineWidth: 1,
          dashStyle: 'ShortDash',
          // Hover: Bible § 2.2 column · inactive 0.4 + halo
          states: {
            hover: {
              brightness: 0,
              halo: { size: 8, opacity: 0.25 },
            },
            inactive: { opacity: 0.4 },
          },
          dataLabels: {
            enabled: true,
            style: {
              color: inkMuted,
              fontFamily: KEN_CHART_FONT.sans,
              fontSize: '10px',
              fontWeight: '400',
              textOutline: 'none',
            },
            formatter: function () {
              const pt = this.point as Highcharts.Point & { isSum?: boolean };
              const v = (this.y as number).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
              if (pt.isSum) return v;
              return (this.y as number) >= 0 ? `+${v}` : `${v}`;
            },
          },
        },
      },
      series: [
        {
          type: 'waterfall',
          name: 'Bridge',
          data: pointData,
          showInLegend: false,
        },
      ],
      // Mobile: rotate labels at true narrow · Bible § 4.1 threshold ≤360
      responsive: {
        rules: [
          {
            condition: { maxWidth: 360 },
            chartOptions: {
              xAxis: {
                labels: {
                  rotation: -45,
                  style: { fontSize: '9px' },
                },
              },
            },
          },
        ],
      },
    } as Partial<Highcharts.Options>);
  }, [height, categoryLabels, pointData, surface, inkMuted, isDark, unit]);

  // Reflow on resize
  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ResizeObserver for parent container resize
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => chartRef.current?.chart?.reflow());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="bar" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <figure
        ref={(el) => { containerRef.current = el; }}
        className={className}
        role="img"
        aria-label={ariaLabel ?? 'Revenue bridge waterfall chart'}
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
