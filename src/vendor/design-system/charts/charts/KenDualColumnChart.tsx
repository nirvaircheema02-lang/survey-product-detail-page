'use client';

/**
 * KenDualColumnChart · grouped 2-series column chart · Ken DS chart wrapper.
 *
 * Mobile strategy (Sprint G.3) · SCROLL:
 *   2-series side-by-side must stay readable — squeezing loses bar distinctness.
 *   At <640px: outer wrapper overflow-x:auto · inner chart minWidth=600px.
 *   User horizontally scrolls instead of getting squashed bars.
 *
 * WHY  · §13 Demand-Supply Gap needs paired-bar visualization (demand vs supply
 *        per year). Plain KenColumnChart is single-series. This wrapper preserves
 *        full theme consistency · no library quirks.
 *
 * WHAT · Side-by-side bars per category (e.g. demand vs supply per year).
 *        2 series · 2 distinct colors from Ken DS data-viz palette · sharp
 *        corners · plain comma-thousands axis · shared tooltip.
 *
 * WHEN · Comparison of 2 metrics across categorical x-axis · §13 D-S Gap · §14
 *        Competitor revenue vs projected · any 2-series column.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenDualColumnChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenDualColumnChart
 *          labels={['2022', '2023', '2024', '2025']}
 *          series1={{ name: 'Demand', data: [100, 120, 140, 160] }}
 *          series2={{ name: 'Supply', data: [90, 105, 120, 135] }}
 *          unit="Mn pallets"
 *        />
 *        ```
 *
 * A11y · `role="img"` + `aria-label` on outer div.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/KenDualColumnChart.tsx
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

export interface DualSeries {
  name: string;
  data: readonly number[];
}

export interface KenDualColumnChartProps {
  labels: readonly string[];
  series1: DualSeries;
  series2: DualSeries;
  height?: number;
  unit?: string;
  /** Surface context (light=default · dark=cinematic section) */
  surface?: ChartSurface;
  /** Loading state · renders ChartSkeleton instead of chart */
  loading?: boolean;
  /** Empty state · renders EmptyState instead of chart */
  empty?: boolean;
  /** Error message · renders ErrorState with message */
  errorMessage?: string;
  ariaLabel?: string;
  className?: string;
  /**
   * Disable ChartReveal entrance animation.
   * @default false
   */
  disableReveal?: boolean;
  /**
   * Compare-mode flag · set true when rendered inside a `[data-compare-cell]` scope.
   * Reduces min-width from 600px → 480px so chart fits compare-mode panes (~370-380px viewport)
   * without triggering mobile scroll at desktop viewport. Bible § 4.2 KenDualColumnChart spec.
   * @default false
   */
  compareMode?: boolean;
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

export function KenDualColumnChart({
  labels,
  series1,
  series2,
  height = 360,
  unit = '',
  surface = 'light' as ChartSurface,
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
  compareMode = false,
}: KenDualColumnChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // PART A fix: resolve surface-aware ink colors at useMemo closure time
  // Prevents hardcoded light rgba strings from leaking into dark surface formatters
  const isDark = surface === 'dark';
  const inkStrong = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)';
  const inkMuted  = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  const inkBody   = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)';
  // BUG C fix: tooltip bg is WHITE on both surfaces — text must always be dark ink
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';
  const tooltipInkBody   = 'rgba(26,26,46,0.75)';

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);
    return deepMerge(deepMerge(base, surfOpts), {
      chart: { type: 'column', height },
      xAxis: { categories: [...labels] },
      tooltip: {
        useHTML: true,
        shared: true,
        // PART A fix: surface-aware tooltip text via closure (bg stays WHITE per Bible § 9.14)
        formatter: function () {
          const points = (this as Highcharts.TooltipFormatterContextObject).points ?? [];
          const cat = (this as Highcharts.TooltipFormatterContextObject).x;
          const rows = points
            .map((p) => {
              const v = (p.y ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
              // BUG C fix: tooltipInk* always dark — white tooltip bg on both surfaces
              return `<div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${p.color};"></span>
                <span style="font-size:10.5px;color:${tooltipInkBody};">${p.series.name}</span>
                <span style="font-size:11.5px;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;font-weight:500;margin-left:auto;">${v}${unit ? ' ' + unit : ''}</span>
              </div>`;
            })
            .join('');
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};min-width:150px;">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${cat}</div>
              ${rows}
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 0,
          borderWidth: 0,
          groupPadding: 0.12,
          pointPadding: 0.05,
          maxPointWidth: 42,
          // PART B fix: Bible § 2.2 Column · inactive 0.4 · hover halo per § 2.6
          states: {
            hover: {
              brightness: 0,
              halo: { size: 8, opacity: 0.25 },
            },
            inactive: { opacity: 0.4 },
          },
        },
      },
      // Internal Highcharts legend disabled · ChartFigure owns legend slot exclusively.
      // Bug 1 fix (2026-05-25): double-legend collision.
      legend: { enabled: false },
      series: [
        { type: 'column', name: series1.name, data: [...series1.data], color: KEN_CHART_SERIES_ARRAY[0] },
        { type: 'column', name: series2.name, data: [...series2.data], color: KEN_CHART_SERIES_ARRAY[1] },
      ],
    } as Partial<Highcharts.Options>);
  }, [labels, series1, series2, height, unit, surface, inkStrong, inkMuted, inkBody]);

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
      {/* Mobile strategy: SCROLL — overflow-x:auto wrapper maintains 2-series legibility.
          G.7 Phase 5 Task 1: compareMode reduces min-width 600→480 per Bible § 4.2.
          Compare cells are ~370-380px · 480px min still triggers horizontal scroll at compare
          but 480px gives more legible bars than 600px. 600 is standard single-col mobile.
          tabIndex={0} per axe scrollable-region-focusable rule (WCAG 2.1.1). */}
      <div
        tabIndex={0}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch' as unknown as undefined,
          overscrollBehaviorX: 'contain' as unknown as undefined,
        } as React.CSSProperties}
      >
        <div
          ref={(el) => { containerRef.current = el; }}
          className={[className ?? ''].join(' ')}
          role="img"
          aria-label={ariaLabel ?? 'Dual-series column chart'}
          style={{ minWidth: compareMode ? 480 : 600 }}
        >
          <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} containerProps={{ style: { width: '100%', minWidth: compareMode ? 480 : 600 } }} />
        </div>
      </div>
    </ChartReveal>
  );
}
