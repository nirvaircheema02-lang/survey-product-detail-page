'use client';

/**
 * KenColumnChart · vertical-bar chart · Ken DS chart wrapper.
 *
 * Mobile strategy (Sprint G.3) · SIMPLIFY at <640px:
 *   x-axis labels rotate -45° when >6 bars · 10px font size.
 *   Via Highcharts `responsive.rules` — ONE place · no JS resize listener.
 *
 * WHY  · `@ken-research/charts` ColumnChart hardcodes `column.borderRadius:4` ·
 *        wraps every chart in 16px-radius padded card · concatenates AUD0Mn labels
 *        · uses violet `#7c3aed` bars. Local wrapper owns Highcharts directly ·
 *        zero library fight. Ref-aligned look (rainbow-pothos · merged-report).
 *
 * WHAT · Bare ColumnChart · uses Highcharts directly via highcharts-react-official.
 *        Sharp bars · Ken DS purple-500 default · hairline gridlines · plain
 *        comma-thousands tick labels · horizontal x-axis labels · NO card frame ·
 *        NO Y-axis title fallback.
 *
 * WHEN · Use in §08 Market Size · §11 Industry Analysis · §18 Macro Indicators ·
 *        any single-metric column chart needing ref-quality look.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenColumnChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenColumnChart
 *          labels={['2017', '2018', '2019', '2020', '2021', '2022']}
 *          data={[4231.1, 4616.1, 5036.2, 5494.6, 5994.9, 6547.8]}
 *          height={360}
 *          unit="AUD Mn"
 *          projectionStartIndex={5}  // optional · index from which bars dim/dash
 *        />
 *        ```
 *
 * A11y · `role="img"` on outer `<figure>` · `aria-label` required from consumer.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/KenColumnChart.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 */

import { useMemo, useRef, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { buildKenChartBase, surfaceOverrides } from '../theme/highcharts-base';
import type { ChartSurface } from '../theme/highcharts-base';
import { KEN_CHART_SERIES_ARRAY, KEN_CHART_FONT, KEN_INK } from '../theme/tokens';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

export interface KenColumnChartProps {
  /** X-axis category labels · one per data point */
  labels: string[];
  /** Data values · same length as labels */
  data: number[];
  /** Chart height in pixels · default 360 */
  height?: number;
  /**
   * 2026-08-17 refinement pass (cross-batch convergent fix — same pattern
   * independently landed by sibling batches on 04-05/06-07's sections):
   * `height` alone is a flat constant regardless of how wide the chart's
   * OWN container actually renders — width already tracks the container
   * fluidly (ResizeObserver + reflow below), height didn't, so a chart
   * sized for a narrow column read disproportionately short-and-squat once
   * dropped into a much wider one (or vice versa). Optional taller height
   * applied via Highcharts `responsive.rules` (container width, same
   * mechanism as the existing mobile label-rotation rule below — NOT a
   * viewport media query, so it stays correct inside narrower layout
   * variants/compare-mode cells at any viewport size) once the chart's
   * container is >= `wideBreakpoint` px. Omit both to keep today's exact
   * flat-height behavior — fully opt-in, no change for existing consumers.
   */
  heightWide?: number;
  /** Container px width at which `heightWide` replaces `height`. @default 700 */
  wideBreakpoint?: number;
  /**
   * 2026-08-18 (Section08 Figma-fidelity pass): the base theme's
   * `chart.marginBottom` (32px, sized for short single-line labels like
   * "2020") is a hard vertical budget for the whole x-axis label area —
   * with `xAxis.labels.rotation` also fixed at 0 (see base theme, "refs
   * never use 45° rotation"), Highcharts has no auto-rotation fallback
   * either, so a multi-word category label that needs 2 wrapped lines to
   * read in full (e.g. "Ras Al Khaimah") gets silently ellipsis-truncated
   * to fit inside that 32px instead of wrapping — confirmed live (labels
   * rendered as "Ras A…" with the full name only reachable via the SVG
   * title/hover, not visible in the DOM). Optional override so a consumer
   * with known long multi-word categories can give the axis enough room to
   * wrap instead of truncate. Omit to keep the existing 32px default —
   * every other current consumer (short year/numeric labels) is unaffected.
   */
  xAxisMarginBottom?: number;
  /**
   * Optional unit suffix shown in tooltip (e.g. "AUD Mn" · "%"). Does NOT
   * appear on axis labels (axis stays clean · figcaption + SourceCluster cite unit).
   */
  unit?: string;
  /**
   * If set · bars from this index onward render with reduced opacity + dashed
   * border to signal projection/forecast. Index is zero-based. Pass -1 or omit
   * for fully-actual series.
   */
  projectionStartIndex?: number;
  /** Surface context (light=default · dark=cinematic section) */
  surface?: ChartSurface;
  /** Loading state · renders ChartSkeleton instead of chart */
  loading?: boolean;
  /** Empty state · renders EmptyState instead of chart */
  empty?: boolean;
  /** Error message · renders ErrorState with message */
  errorMessage?: string;
  /** Optional aria-label for screen readers */
  ariaLabel?: string;
  /** Optional className for outer container */
  className?: string;
  /**
   * Disable ChartReveal entrance animation.
   * Use for above-fold charts where entrance would be invisible anyway.
   * @default false
   */
  disableReveal?: boolean;
  /**
   * Show the value above each bar (Highcharts column dataLabels). Formats as
   * `{y}%` when `unit === '%'`, else `{y}` fixed to 2 decimals. Opt-in —
   * default false preserves the bare-chart look for existing consumers.
   * @default false
   */
  showDataLabels?: boolean;
  /**
   * Explicit y-axis max (e.g. give a bar chart headroom above its tallest bar
   * so labels/values don't crowd the plot ceiling). Omit to let Highcharts
   * auto-scale (existing default behaviour).
   */
  yAxisMax?: number;
}

/**
 * Deep merge utility (Object.assign would shallow-clobber Highcharts nested options)
 */
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

export function KenColumnChart({
  labels,
  data,
  height = 360,
  heightWide,
  wideBreakpoint = 700,
  xAxisMarginBottom,
  unit,
  projectionStartIndex,
  surface = 'light' as ChartSurface,
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
  showDataLabels = false,
  yAxisMax,
}: KenColumnChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // PART A fix: resolve surface-aware ink colors at useMemo closure time
  // Prevents hardcoded light rgba strings from leaking into dark surface formatters
  const isDark = surface === 'dark';
  const inkStrong = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)';
  const inkMuted  = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // BUG C fix: tooltip bg is always WHITE (canonical). Tooltip text must always be dark ink.
  // inkStrong/inkMuted flip to white on dark → white-on-white in tooltip. Use fixed dark values.
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  // Mark projected points w/ dashed border + reduced opacity (built into pointWise data array)
  const pointWiseData = useMemo(() => {
    if (projectionStartIndex === undefined || projectionStartIndex < 0) {
      return data.map((y) => ({ y }));
    }
    return data.map((y, i) => ({
      y,
      color:
        i >= projectionStartIndex
          ? `${KEN_CHART_SERIES_ARRAY[0]}99` // ~60% alpha for projected
          : KEN_CHART_SERIES_ARRAY[0],
      borderColor: i >= projectionStartIndex ? KEN_CHART_SERIES_ARRAY[0] : undefined,
      borderWidth: i >= projectionStartIndex ? 1 : 0,
      dashStyle: i >= projectionStartIndex ? 'Dash' : undefined,
    }));
  }, [data, projectionStartIndex]);

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);
    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        type: 'column',
        height,
        ...(xAxisMarginBottom !== undefined ? { marginBottom: xAxisMarginBottom } : {}),
      },
      xAxis: {
        categories: labels,
        crosshair: {
          color: 'rgba(0,0,0,0.04)',
          width: 1,
        },
      },
      yAxis: {
        max: yAxisMax,
      },
      tooltip: {
        useHTML: true,
        // PART A fix: surface-aware tooltip text via closure (bg stays WHITE per Bible § 9.14)
        formatter: function () {
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          });
          const cat = this.x;
          // BUG C fix: use tooltipInk* (always dark) — tooltip bg is white on both surfaces
          const unitPart = unit ? ` <span style="color:${tooltipInkMuted}">${unit}</span>` : '';
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${cat}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${v}${unitPart}</div>
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          // PART B fix: Bible § 2.2 Column · inactive 0.4 · hover halo per § 2.6
          states: {
            hover: {
              brightness: 0,
              halo: { size: 8, opacity: 0.25 },
            },
            inactive: { opacity: 0.4 },
          },
          dataLabels: {
            enabled: showDataLabels,
            crop: false,
            overflow: 'allow',
            y: -6,
            style: {
              fontFamily: KEN_CHART_FONT.sans,
              fontSize: '11px',
              fontWeight: '600',
              color: KEN_INK.strong,
              textOutline: 'none',
            },
            formatter: function () {
              const v = this.y as number;
              return unit === '%' ? `${v}%` : v.toFixed(2);
            },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Series',
          data: pointWiseData,
          showInLegend: false,
        },
      ],
      // Mobile strategy: SIMPLIFY · rotate x-axis labels at ≤360px container width
      // BUG FIX (Sprint G.7 Phase 4): was maxWidth:640 — fired in compare mode (~370px container)
      // which incorrectly rotated labels when viewport is desktop. 360px = true narrow single-col.
      // Bible § 4.1: Highcharts responsive.rules fires on container width NOT viewport · threshold
      // must be ≤360 to avoid triggering inside compare mode cells (~370-380px each).
      responsive: {
        rules: [
          {
            condition: { maxWidth: 360 },
            chartOptions: {
              xAxis: {
                labels: {
                  rotation: labels.length > 6 ? -45 : 0,
                  style: { fontSize: '10px' },
                },
              },
              legend: { itemDistance: 8 },
            },
          },
          // 2026-08-17 refinement pass: opt-in wide-container height bump —
          // additive rule, independent of the maxWidth rule above (Highcharts
          // merges every matching rule's chartOptions; a minWidth condition
          // and a maxWidth condition can never both match the same width, so
          // there's no ordering/precedence concern between the two). No-op
          // (empty array) unless a consumer passes `heightWide`.
          ...(heightWide !== undefined
            ? [
                {
                  condition: { minWidth: wideBreakpoint },
                  chartOptions: { chart: { height: heightWide } },
                },
              ]
            : []),
        ],
      },
    } as Partial<Highcharts.Options>);
  }, [labels, height, heightWide, wideBreakpoint, xAxisMarginBottom, unit, pointWiseData, surface, inkStrong, inkMuted, showDataLabels, yAxisMax]);

  // Reflow on window resize · Highcharts doesn't always catch container resize w/o it
  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ResizeObserver · fires when parent container resizes (more reliable than window resize)
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => chartRef.current?.chart?.reflow());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // State guards AFTER all hooks (Rules of Hooks: no conditional hook calls)
  if (loading)      return <ChartSkeleton type="bar" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <figure
        ref={(el) => { containerRef.current = el; }}
        className={className}
        role="img"
        aria-label={ariaLabel ?? 'Market data column chart'}
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
