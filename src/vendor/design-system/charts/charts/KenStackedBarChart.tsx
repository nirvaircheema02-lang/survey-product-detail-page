'use client';

/**
 * KenStackedBarChart · horizontal stacked bar chart · composition + comparison.
 *
 * WHY  · Shows part-to-whole composition across multiple categories. Standard
 *        format for market share analysis · segment mix · regional breakdown ·
 *        and domestic vs international split. Horizontal orientation gives
 *        category labels room to breathe (vs vertical column which squishes labels).
 *
 * WHAT · Highcharts `bar` series with `stacking: 'normal'` OR `'percent'`.
 *        2-5 series · each assigned a color from KEN_CHART_SERIES_ARRAY in order.
 *        Series 1 = primary #9488ec · Series 2 = secondary #c3c6f9 · etc.
 *        100% mode normalizes bars to equal length for composition-purity read.
 *        Inline legend (HTML) since Highcharts legend is disabled in base.
 *
 * WHEN · §10 Segment Intelligence · §11 Industry Analysis · §12 Product Mix ·
 *        any side-by-side composition across multiple categories.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenStackedBarChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenStackedBarChart
 *          labels={['Domestic', 'Export', 'Retail']}
 *          series={[
 *            { name: 'Refrigerated', data: [62, 48, 71] },
 *            { name: 'Ambient',      data: [38, 52, 29] },
 *          ]}
 *          unit="%"
 *          stackType="percent"
 *        />
 *        ```
 *
 * Color discipline (Bible § 1.7 v3 · v0.4 confirmed):
 *   Series 1 · `#9488ec` · periwinkle primary (L*62)
 *   Series 2 · `#c3c6f9` · periwinkle secondary (L*78)
 *   Series 3 · `#86b3e5` · perano tertiary (L*70)
 *   Series 4 · `#7075c8` · periwinkle quaternary (L*55)
 *   Series 5 · `#a7c9ed` · perano light (L*78)
 *   Colors from KEN_CHART_SERIES_ARRAY — never override manually.
 *
 * A11y · `role="img"` on outer `<figure>` · `aria-label` required from consumer.
 *
 * @module design-system/core-v2/src/charts/charts/KenStackedBarChart
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

// ─── Public API ───────────────────────────────────────────────────────────────

/** A single series in a stacked bar chart */
export interface StackedSeries {
  /** Series label · appears in legend and tooltip */
  name: string;
  /** Numeric values · one per label category */
  data: number[];
}

export interface KenStackedBarChartProps {
  /** Category labels · one per stacked bar (displayed on y-axis for horizontal bars) */
  labels: string[];
  /** 2-5 series to stack · assigned colors from KEN_CHART_SERIES_ARRAY in order */
  series: StackedSeries[];
  /** Chart height in pixels · @default 300 */
  height?: number;
  /** Unit suffix shown in tooltip (e.g. "%" · "AUD Mn") */
  unit?: string;
  /**
   * Stacking mode.
   * - `'normal'` · absolute values · bars grow proportional to data
   * - `'percent'` · 100% normalized · bars all equal length · composition-purity
   * @default 'normal'
   */
  stackType?: 'normal' | 'percent';
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

export function KenStackedBarChart({
  labels,
  series,
  height = 300,
  unit,
  stackType = 'normal',
  surface = 'light',
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenStackedBarChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const isDark = surface === 'dark';
  const inkMuted = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // Tooltip bg is always white · use dark ink for tooltip text (Bible § 9.14)
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  // Assign series colors from KEN_CHART_SERIES_ARRAY in order
  const seriesData = useMemo(() =>
    series.slice(0, 5).map((s, idx) => ({
      type: 'bar' as const,
      name: s.name,
      data: s.data,
      color: KEN_CHART_SERIES_ARRAY[idx],
      showInLegend: true,
    })),
    [series]
  );

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);

    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        type: 'bar',
        height,
        marginLeft: 80,  // room for category labels on y-axis (bar chart horizontal)
        marginRight: 16,
        marginBottom: 40, // standard bottom margin — x-axis labels only (legend moved to top)
      },
      xAxis: {
        categories: labels,
        labels: {
          style: {
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
        },
      },
      yAxis: {
        labels: {
          style: {
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
          // In percent mode show "%" suffix
          formatter: stackType === 'percent'
            ? function () { return `${this.value}%`; }
            : undefined,
        },
        reversedStacks: false,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const pct = stackType === 'percent'
            ? ` <span style="color:${tooltipInkMuted}">(${(this.percentage as number).toFixed(1)}%)</span>`
            : '';
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          const unitPart = unit
            ? ` <span style="color:${tooltipInkMuted};font-size:10px;">${unit}</span>`
            : '';
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${this.key} · ${this.series.name}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${v}${unitPart}${pct}</div>
            </div>
          `;
        },
      },
      legend: {
        // BUG-FIX G.12: legend moved to TOP to avoid x-axis label collision.
        // Horizontal bar chart: x-axis (percentage labels) sits at bottom.
        // Legend-at-bottom caused "0% 25% 50% 75% 100%" to render ON TOP of legend items.
        // Moving legend to top keeps both readable. marginTop compensates for legend height.
        enabled: series.length > 1,
        align: 'left',
        verticalAlign: 'top',
        layout: 'horizontal',
        margin: 12,
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
        bar: {
          stacking: stackType,
          borderWidth: 0,
          borderRadius: 0,
          groupPadding: 0.05,
          pointPadding: 0.04,
          // Hover: Bible § 2.2 stacked bar · hovered segment full + stroke
          states: {
            hover: {
              brightness: 0,
              halo: { size: 4, opacity: 0.20 },
            },
            inactive: { opacity: 0.4 },
          },
          dataLabels: {
            enabled: false, // tooltip sufficient · labels clutter narrow bars
          },
        },
      },
      series: seriesData,
      // Mobile: labels wrap at narrow viewport
      responsive: {
        rules: [
          {
            condition: { maxWidth: 360 },
            chartOptions: {
              xAxis: {
                labels: {
                  style: { fontSize: '9px' },
                },
              },
              legend: { itemDistance: 8 },
            },
          },
        ],
      },
    } as Partial<Highcharts.Options>);
  }, [labels, seriesData, height, stackType, surface, inkMuted, unit, series.length]);

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
  if (loading)      return <ChartSkeleton type="bar" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <figure
        ref={(el) => { containerRef.current = el; }}
        className={className}
        role="img"
        aria-label={ariaLabel ?? 'Stacked bar composition chart'}
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
