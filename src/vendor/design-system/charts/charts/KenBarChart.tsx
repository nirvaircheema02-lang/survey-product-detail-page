'use client';

/**
 * KenBarChart · horizontal bar chart · Ken DS chart wrapper.
 *
 * Mobile strategy (Sprint G.3) · REFLOW:
 *   Already horizontal — handles narrow viewports well.
 *   At <640px: reduce left margin (from 96 to 72px) via responsive.rules.
 *
 * WHY  · Horizontal bars handle long category names cleanly · vertical ColumnChart
 *        rotates labels 45° (rejected per refs). 3-8 categories · % share OR
 *        absolute value · ranked OR ordered.
 *
 * WHAT · Horizontal bars · ranked top-to-bottom · sharp corners · purple-500 ·
 *        DM Sans category labels (left) + value labels (right of bar).
 *        Plain comma-thousands · no axis title · refs canonical horizontal
 *        composition pattern (rainbow-pothos zone tables).
 *
 * WHEN · 3-8 categories · % share OR absolute value · ranked OR ordered.
 *        Used in §10 (Region · Reefer Truck Type) · §11 Industry · §13 D-S Gap.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenBarChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenBarChart
 *          labels={['Sydney', 'Melbourne', 'Brisbane', 'Other']}
 *          data={[35.0, 27.5, 15.5, 22.0]}
 *          unit="%"
 *          height={240}
 *        />
 *        ```
 *
 * A11y · `role="img"` on outer div · `aria-label` required from consumer.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/KenBarChart.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
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

export interface KenBarChartProps {
  /** Category labels · one per bar · top-to-bottom render order */
  labels: string[];
  /** Values · same length as labels */
  data: number[];
  /** Chart height · default 240 (~40px per bar) */
  height?: number;
  /** Unit suffix in tooltip + value labels (e.g. "%" · "Mn") */
  unit?: string;
  /** Show value at end of each bar · default true */
  showValueLabels?: boolean;
  /** Surface context (light=default · dark=cinematic section) */
  surface?: ChartSurface;
  /** Loading state · renders ChartSkeleton instead of chart */
  loading?: boolean;
  /** Empty state · renders EmptyState instead of chart */
  empty?: boolean;
  /** Error message · renders ErrorState with message */
  errorMessage?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Optional className */
  className?: string;
  /**
   * Disable ChartReveal entrance animation.
   * @default false
   */
  disableReveal?: boolean;
}

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

export function KenBarChart({
  labels,
  data,
  height = 240,
  unit = '',
  showValueLabels = true,
  surface = 'light' as ChartSurface,
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenBarChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // PART A fix: resolve surface-aware ink colors at useMemo closure time
  // Prevents KEN_INK.* constants (hardcoded light values) from leaking into dark surface
  const isDark = surface === 'dark';
  const inkStrong = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)';
  const inkMuted  = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // BUG C fix: tooltip bg is always WHITE. Text must always be dark — never flip to white.
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);
    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        type: 'bar',
        height,
        marginLeft: 96, // room for category labels
        marginRight: 56, // room for value labels at end
        marginTop: 8,
        marginBottom: 24,
      },
      xAxis: {
        categories: labels,
        labels: {
          style: {
            // PART A fix: inkStrong resolved at useMemo time · surface-aware
            color: inkStrong,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '12px',
            fontWeight: '500',
          },
        },
        lineColor: 'transparent',
        tickColor: 'transparent',
      },
      yAxis: {
        // PART A fix: surface-aware grid color
        gridLineColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        gridLineWidth: 1,
        labels: {
          style: {
            // PART A fix: inkMuted resolved at useMemo time · surface-aware
            color: inkMuted,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '10px',
          },
          formatter: function () {
            const v = this.value as number;
            return `${v.toLocaleString('en-US')}${unit ? unit : ''}`;
          },
        },
        title: { text: undefined },
      },
      tooltip: {
        useHTML: true,
        // PART A fix: surface-aware tooltip text via closure (bg stays WHITE per Bible § 9.14)
        formatter: function () {
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          // BUG C fix: use tooltipInk* (always dark) — white tooltip on both surfaces
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${this.key}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${v}${unit ? ` ${unit}` : ''}</div>
            </div>
          `;
        },
      },
      plotOptions: {
        bar: {
          color: KEN_CHART_SERIES_ARRAY[0],
          borderRadius: 0,
          borderWidth: 0,
          pointPadding: 0.15,
          groupPadding: 0.1,
          // PART B fix: Bible § 2.2 Bar · inactive 0.4 · hover halo per § 2.6
          states: {
            hover: {
              brightness: 0,
              halo: { size: 8, opacity: 0.25 },
            },
            inactive: { opacity: 0.4 },
          },
          dataLabels: {
            enabled: showValueLabels,
            inside: false,
            align: 'left',
            style: {
              // PART A fix: inkStrong resolved at useMemo time · surface-aware
              color: inkStrong,
              fontFamily: KEN_CHART_FONT.sans,
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none',
            },
            formatter: function () {
              const v = (this.y as number).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              });
              return `${v}${unit ? unit : ''}`;
            },
          },
        },
      },
      series: [
        {
          type: 'bar',
          name: 'Share',
          data,
          showInLegend: false,
        },
      ],
      // Mobile strategy: REFLOW · reduce left margin at narrow to reclaim horizontal space
      // BUG FIX (Sprint G.7 Phase 4): was maxWidth:640 — fired in compare mode (~370px container).
      // Bible § 4.1: threshold ≤360 prevents firing on compare mode cells (~370-380px each).
      responsive: {
        rules: [
          {
            condition: { maxWidth: 360 },
            chartOptions: {
              chart: { marginLeft: 72 },
              legend: { itemDistance: 8 },
            },
          },
        ],
      },
    } as Partial<Highcharts.Options>);
  }, [labels, data, height, unit, showValueLabels, surface, isDark, inkStrong, inkMuted]);

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

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="bar" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <div
        ref={(el) => { containerRef.current = el; }}
        className={['w-full', className ?? ''].join(' ')}
        role="img"
        aria-label={ariaLabel ?? 'Horizontal bar chart'}
      >
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%' } }}
        />
      </div>
    </ChartReveal>
  );
}
