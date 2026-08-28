'use client';

/**
 * KenBubbleChart · scatter w/ sized bubbles · Highcharts bubble type.
 *
 * Mobile strategy (Sprint G.3 · REVISED G.7 Phase 4) · SIMPLIFY at ≤480px viewport:
 *   Only top-3 bubbles by Z-value show dataLabels — prevents label collision.
 *   Bubble minSize reduced 8% → 4% at narrow (via responsive.rules ≤360px container).
 *   Tooltip becomes primary disclosure (already wired via Highcharts built-in).
 *   Label suppression via viewport matchMedia (NOT responsive.rules) — compare-safe.
 *   Bible § 4.1: responsive.rules fires on container width · catches compare mode (~370px).
 *   Fix: isMobile state = window.matchMedia('(max-width: 480px)') · viewport only.
 *
 * WHY  · `@ken-research/charts` v0.1.5 has NO bubble chart (KEN-CHARTS-PLAN.md
 *        gap). Builds via Highcharts bubble series directly. Refs canonical
 *        pattern (rainbow-pothos ADR×Occupancy positioning chart · McKinsey
 *        PwC tech-trends Impact×Time-to-impact).
 *
 * WHAT · Bubble chart · X axis × Y axis × bubble size (3 dimensions).
 *        Labels rendered ABOVE bubbles via dataLabels (y: -8 gap · no textOutline).
 *        Sharp purple bubbles at 0.5 default opacity · hover brightens.
 *        NO card frame · uses shared DS theme tokens.
 *
 * WHEN · §07 Ecosystem (player pallet × share) · §11 Trends (Impact × Time) ·
 *        §14 Competitor (revenue × growth × capacity). Any 3-dim positioning.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenBubbleChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenBubbleChart
 *          data={[
 *            { name: 'IoT', x: 1.5, y: 7, z: 30 },
 *            { name: 'Automation', x: 3.2, y: 9, z: 60 },
 *          ]}
 *          xAxisTitle="Years to mainstream"
 *          yAxisTitle="Business impact"
 *          height={420}
 *        />
 *        ```
 *
 * Bug fix applied during DS port (2026-05-25):
 *   - Removed `textOutline: '2px white'` — caused ghosting / duplicate visual rendering
 *     ("LinfoxLinfox" duplicate label seen in DOM probe on v0.4).
 *   - Changed label position to `verticalAlign: 'top'`, `y: -8`, `align: 'center'`
 *     so label floats ABOVE bubble · no overlap with bubble fill.
 *   - Changed `inside: false` explicitly.
 *   - Changed `allowOverlap: true` — small bubbles now show labels (was false · hid labels).
 *   - Removed duplicate `format` + `formatter` (had both → kept `format` only, dropped formatter).
 *
 * A11y · `role="img"` + `aria-label` on outer div.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/KenBubbleChart.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 * @relatedDoc projects/v1-project/v1-product-page-ver0.4/docs/_internal/CURRENT-STATE-CHARTS-TABLES-2026-05-25.md §14
 */

import { useMemo, useRef, useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
// highcharts-more factory · MUST be called w/ Highcharts to register bubble series.
// Bare side-effect import `import 'highcharts/highcharts-more'` does NOT work in
// Next 16 Turbopack · module exports factory function · must invoke explicitly.
import HighchartsMore from 'highcharts/highcharts-more';

if (typeof window !== 'undefined' && typeof HighchartsMore === 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (HighchartsMore as any)(Highcharts);
}

import { buildKenChartBase } from '../theme/highcharts-base';
export type { ChartSurface } from '../theme/highcharts-base';
import type { ChartSurface } from '../theme/highcharts-base';
import { KEN_CHART_SERIES_ARRAY, KEN_CHART_FONT } from '../theme/tokens';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

export interface BubblePoint {
  name: string;
  /** X-axis position */
  x: number;
  /** Y-axis position */
  y: number;
  /** Bubble size (relative · auto-scaled by Highcharts to chart area) */
  z: number;
  /** Optional override color · default uses palette */
  color?: string;
}

export interface KenBubbleChartProps {
  data: readonly BubblePoint[];
  height?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  /** Optional X axis tick categories (e.g. ['<1yr', '2-3yr', '5+yr']) · pass numeric x values 0/1/2 to align */
  xCategories?: readonly string[];
  /** Show bubble name as inline label · default true */
  showLabels?: boolean;
  /** Bubble fill opacity · default 0.55 (v0.4 editorial canonical · G.11 P2 confirmed) */
  bubbleOpacity?: number;
  /**
   * Surface context.
   * dark: cinematic section → bump spacing to 36px · axis labels rgba(255,255,255,0.6) · tooltip text inverts.
   * Tooltip bg stays white (canonical — refs keep white tooltip even on dark charts).
   * @default 'light'
   */
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

export function KenBubbleChart({
  data,
  height = 420,
  xAxisTitle,
  yAxisTitle,
  xCategories,
  showLabels = true,
  bubbleOpacity = 0.55,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenBubbleChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // TRUE mobile detection via viewport width — NOT container width.
  // Bible § 4.1: Highcharts responsive.rules fires on CONTAINER width, not viewport.
  // In compare mode each pane is ~370-380px — a container-width rule at maxWidth:640
  // would incorrectly suppress labels when viewport is desktop (compare mode).
  // matchMedia('(max-width: 480px)') fires only on true mobile viewport · safe in compare.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 480px)').matches
      : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 480px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Dark surface: axis labels invert · tooltip text also inverts (bg stays white — ref canonical)
  const isDark = surface === 'dark';
  // PART A fix: resolve surface-aware ink colors at useMemo closure time
  // Prevents KEN_INK.* constants (hardcoded light values) from leaking into dark surface
  const axisLabelColor = isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.62)';
  const inkStrong = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)';
  const inkMuted  = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // BUG C fix: tooltip bg is WHITE on both surfaces — text must always be dark ink
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  // Mobile simplify: top-3 by z-value get labels · others suppressed on true mobile (≤480 viewport)
  // Computed once per data change — stable across re-renders
  const top3ZIds = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.z - a.z);
    return new Set(sorted.slice(0, 3).map((d) => d.name));
  }, [data]);

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    return deepMerge(base, {
      chart: {
        type: 'bubble',
        height,
        marginLeft: 56,
        marginRight: 24,
        // Bug 4 fix (2026-05-25): labels clip through section boundary on cinematic dark.
        // spacingTop bumped from 16 to 24 (light) / 36 (dark) to clear top labels.
        marginTop: isDark ? 36 : 24,
        marginBottom: 48,
      },
      xAxis: {
        categories: xCategories ? [...xCategories] : undefined,
        labels: {
          style: {
            color: axisLabelColor,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
        },
        title: xAxisTitle
          ? {
              text: xAxisTitle,
              style: {
                color: axisLabelColor,
                fontFamily: KEN_CHART_FONT.sans,
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              },
            }
          : undefined,
        gridLineWidth: 0,
      },
      yAxis: {
        labels: {
          style: {
            color: axisLabelColor,
            fontFamily: KEN_CHART_FONT.sans,
            fontSize: '11px',
          },
        },
        title: yAxisTitle
          ? {
              text: yAxisTitle,
              style: {
                color: axisLabelColor,
                fontFamily: KEN_CHART_FONT.sans,
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              },
            }
          : undefined,
      },
      tooltip: {
        useHTML: true,
        // PART A fix: surface-aware colors via closure (inkStrong/inkMuted resolved at useMemo time)
        // Tooltip bg stays WHITE per Bible § 9.14 · only text colors adapt
        formatter: function () {
          const point = this.point as Highcharts.Point & { z?: number };
          const xVal = xCategories && typeof this.x === 'number'
            ? xCategories[this.x]
            : String(this.x);
          // BUG C fix: tooltipInk* always dark — white tooltip bg on both surfaces
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};max-width:200px;">
              <div style="font-size:12px;font-weight:600;color:${tooltipInkStrong};margin-bottom:4px;">${point.name}</div>
              <div style="font-size:10.5px;color:${tooltipInkMuted};font-variant-numeric:tabular-nums;">
                ${xAxisTitle ?? 'X'}: ${xVal}<br/>
                ${yAxisTitle ?? 'Y'}: ${this.y}<br/>
                Magnitude: ${point.z ?? '—'}
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        bubble: {
          minSize: '8%',
          maxSize: '22%',
          fillOpacity: bubbleOpacity,
          color: KEN_CHART_SERIES_ARRAY[0],
          marker: {
            lineColor: KEN_CHART_SERIES_ARRAY[0],
            lineWidth: 1,
            fillOpacity: bubbleOpacity,
          },
          dataLabels: {
            enabled: showLabels,
            // FIX (Bug 1 · 2026-05-25): label ABOVE bubble · no overlap with fill
            // Previous: textOutline '2px white' caused ghosting · "LinfoxLinfox" duplicate
            // Fix: removed textOutline · positioned y:-8 above bubble · allowOverlap:true
            format: '{point.name}',
            align: 'center',
            verticalAlign: 'top',
            inside: false,
            y: -8,
            allowOverlap: true,
            crop: false,
            overflow: 'allow',
            style: {
              // PART A fix: inkStrong resolved at useMemo time · surface-aware
              color: inkStrong,
              fontFamily: KEN_CHART_FONT.sans,
              fontSize: '11px',
              fontWeight: '500',
              // NO textOutline — refs don't use it · causes ghosting double-render
            },
          },
          states: {
            // PART B fix: Bible § 2.2 Bubble · hover = full opacity + halo + z×1.0
            // inactive opacity 0.35 per Bible § 2.3 medium-density matrix
            hover: {
              halo: { size: 8, opacity: 0.25 },
              brightness: 0,
            },
            inactive: { opacity: 0.35 },
          },
        },
      },
      series: [
        {
          type: 'bubble',
          name: 'Items',
          // Per-point dataLabels: mobile simplify via viewport matchMedia (NOT responsive.rules).
          // Bible § 4.1: responsive.rules fires on CONTAINER width · triggers in compare mode (~370px).
          // isMobile = true only when viewport ≤480px (matchMedia · see state above).
          // At mobile: show only top-3 by z · at desktop/tablet: show all (if showLabels=true).
          data: data.map((d) => ({
            name: d.name,
            x: d.x,
            y: d.y,
            z: d.z,
            color: d.color,
            // Label enabled: showLabels AND (not mobile OR top-3 on mobile)
            dataLabels: {
              enabled: showLabels && (!isMobile || top3ZIds.has(d.name)),
              format: '{point.name}',
              align: 'center' as const,
              verticalAlign: 'top' as const,
              inside: false,
              y: -8,
              allowOverlap: true,
              crop: false,
              overflow: 'allow' as const,
              style: {
                color: inkStrong,
                fontFamily: KEN_CHART_FONT.sans,
                fontSize: '11px',
                fontWeight: '500',
              },
            },
          })),
          showInLegend: false,
        },
      ],
      // Mobile strategy (container-width rules): ONLY adjust sizes + axis font at ≤360px.
      // BUG FIX (Sprint G.7 Phase 4): was maxWidth:640 which fired in compare mode (~370px).
      // Label suppression MOVED to per-point isMobile check above (viewport-based · compare-safe).
      // Bible § 4.2: keep all labels in compare mode · threshold 360 prevents firing on compare cells.
      responsive: {
        rules: [
          {
            condition: { maxWidth: 360 },
            chartOptions: {
              plotOptions: {
                bubble: {
                  minSize: '4%',
                  maxSize: '16%',
                  // NOTE: label enabled/disabled controlled at point-level (isMobile state)
                  // NOT here — responsive.rules would also fire in compare mode at 360px
                },
              },
              xAxis: {
                labels: { style: { fontSize: '10px' } },
              },
              yAxis: {
                labels: { style: { fontSize: '10px' } },
              },
            },
          },
        ],
      },
    } as Partial<Highcharts.Options>);
  }, [data, height, xAxisTitle, yAxisTitle, xCategories, showLabels, bubbleOpacity, isDark, axisLabelColor, inkStrong, inkMuted, top3ZIds, isMobile]);

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
  if (loading)      return <ChartSkeleton type="bubble" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <div
        ref={(el) => { containerRef.current = el; }}
        className={['w-full', className ?? ''].join(' ')}
        role="img"
        aria-label={ariaLabel ?? 'Bubble chart · 3-dimensional positioning'}
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
