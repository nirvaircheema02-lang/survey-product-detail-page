'use client';

/**
 * KenDonutChart · pie/donut composition chart · Ken DS chart wrapper.
 *
 * Mobile strategy (Sprint G.3) · SIMPLIFY at <640px:
 *   Drop dataLabels (connector lines + labels) — they overlap at narrow.
 *   ChartFigure legend below the chart handles identification instead.
 *   Via Highcharts responsive.rules — ONE place.
 *
 * WHY  · `@ken-research/charts` PieChart has same library quirks as ColumnChart
 *        (hardcoded colors · framed card wrapper · concat label format).
 *        Building DS wrapper for full control · same theme tokens shared.
 *
 * WHAT · 2-6 slice donut · neutral palette (periwinkle/perano/purple) ·
 *        center label slot · DM Sans labels · plain percentages · refs canonical
 *        composition pattern. Uses Highcharts pie type w/ innerSize.
 *
 * WHEN · Composition snapshot · 2-6 categories at single point in time.
 *        Used in §10 Segmentation (Temperature · End-User) · future composition needs.
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenDonutChart.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenDonutChart
 *          data={[
 *            { name: 'Frozen', value: 45 },
 *            { name: 'Chiller', value: 40 },
 *            { name: 'Ambient', value: 15 },
 *          ]}
 *          height={280}
 *          centerLabel="100%"
 *          centerSubLabel="2022 share"
 *        />
 *        ```
 *
 * A11y · `role="img"` + `aria-label` on outer div.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/KenDonutChart.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 */

import { useMemo, useRef, useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { buildKenChartBase, surfaceOverrides } from '../theme/highcharts-base';
import type { ChartSurface } from '../theme/highcharts-base';
import { KEN_CHART_SERIES_ARRAY, KEN_INK, KEN_CHART_FONT } from '../theme/tokens';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

export interface DonutSlice {
  name: string;
  value: number;
}

export interface KenDonutChartProps {
  /** 2-6 slices · value in any unit (% · count · revenue) */
  data: DonutSlice[];
  /** Chart height in pixels · default 280 */
  height?: number;
  /** Optional center label · large display (e.g. "100%" · total · headline) */
  centerLabel?: string;
  /** Optional center subtitle · small DM Sans below center label */
  centerSubLabel?: string;
  /** Show slice % labels around donut · default true */
  showLabels?: boolean;
  /** Optional unit suffix for tooltip (e.g. "%" · "Mn") */
  unit?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Optional className */
  className?: string;
  /** Surface context (light=default · dark=cinematic section) */
  surface?: ChartSurface;
  /** Loading state · renders ChartSkeleton instead of chart */
  loading?: boolean;
  /** Empty state · renders EmptyState instead of chart */
  empty?: boolean;
  /** Error message · renders ErrorState with message */
  errorMessage?: string;
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

export function KenDonutChart({
  data,
  height = 280,
  centerLabel,
  centerSubLabel,
  showLabels = true,
  unit = '%',
  surface = 'light' as ChartSurface,
  loading,
  empty,
  errorMessage,
  ariaLabel,
  className,
  disableReveal = false,
}: KenDonutChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // G.7 Phase 5 Task 1 fix: viewport matchMedia for ≤320 compress rule.
  // Bible § 4.1: responsive.rules fires on CONTAINER width — catches compare mode (~370px cells).
  // matchMedia('(max-width: 320px)') fires only on true narrow viewport · compare-safe.
  // At ≤320: drop name label · keep percentage only (connector + pct) per Bible § 4.2 KenDonutChart spec.
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 320px)').matches
      : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 320px)');
    setIsNarrowViewport(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrowViewport(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // PART A fix: resolve surface-aware ink colors at useMemo closure time (tooltip text)
  const inkStrong = surface === 'dark' ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.92)';
  const inkMuted  = surface === 'dark' ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.62)';
  // BUG C fix: tooltip bg is WHITE on both surfaces — text must always be dark ink
  const tooltipInkStrong = 'rgba(26,26,46,0.92)';
  const tooltipInkMuted  = 'rgba(26,26,46,0.62)';

  const options = useMemo<Highcharts.Options>(() => {
    const base = buildKenChartBase();
    const surfOpts = surfaceOverrides(surface);
    // At ≤320px viewport: formatter drops name · shows pct+connector only (per Bible § 4.2).
    // Controlled via isNarrowViewport (matchMedia · viewport) NOT responsive.rules (container-width).
    const narrowFormatter = isNarrowViewport
      ? function (this: Highcharts.PointLabelObject) {
          const pct = this.percentage ?? 0;
          const valueColor = surface === 'dark' ? 'rgba(255,255,255,0.92)' : KEN_INK.strong;
          return `<span style="font-variant-numeric:tabular-nums;color:${valueColor};font-weight:500;">${pct.toFixed(pct < 10 ? 1 : 0)}%</span>`;
        }
      : undefined;
    return deepMerge(deepMerge(base, surfOpts), {
      chart: {
        type: 'pie',
        height,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 8,
        marginBottom: 8,
        spacing: [0, 0, 0, 0],
      },
      xAxis: { lineColor: 'transparent', tickColor: 'transparent', labels: { enabled: false } },
      yAxis: { gridLineWidth: 0, lineColor: 'transparent', labels: { enabled: false } },
      tooltip: {
        useHTML: true,
        // PART A fix: surface-aware tooltip text via closure (bg stays WHITE per Bible § 9.14)
        formatter: function () {
          const v = (this.y as number).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
          const name = this.point?.name ?? this.key;
          // BUG C fix: tooltipInk* always dark — white tooltip bg on both surfaces
          return `
            <div style="font-family:${KEN_CHART_FONT.sans};">
              <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.08em;color:${tooltipInkMuted};margin-bottom:2px;">${name}</div>
              <div style="font-size:12px;font-weight:500;color:${tooltipInkStrong};font-variant-numeric:tabular-nums;">${v}${unit ? ` ${unit}` : ''}</div>
            </div>
          `;
        },
      },
      plotOptions: {
        pie: {
          innerSize: '62%',
          // Bug 3 fix (2026-05-25): donut was right-shifted · empty left half.
          // Force center explicitly — do NOT rely on Highcharts default (can drift).
          center: ['50%', '50%'],
          // Consistent sizing relative to chart area (was auto-shrinking on narrow containers)
          size: '85%',
          borderWidth: 1,
          // BUG 2 fix (Sprint G.7): was hardcoded '#ffffff' — bright white on dark surface.
          // Surface-aware: subtle separator on both surfaces.
          borderColor: surface === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          colors: [...KEN_CHART_SERIES_ARRAY],
          dataLabels: {
            enabled: showLabels,
            distance: 20,  // slightly more clearance than 14 · prevents label overlap with outer border
            style: {
              // BUG 1 fix (Sprint G.7): was KEN_INK.strong (hardcoded light constant).
              // Surface-aware inline colors for Highcharts dataLabels (not CSS cascade).
              color: surface === 'dark' ? 'rgba(255,255,255,0.92)' : KEN_INK.strong,
              fontFamily: KEN_CHART_FONT.sans,
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none',
            },
            // G.7 Phase 5 Task 1: narrowFormatter active at ≤320 viewport (matchMedia-driven).
            // Drops name label · keeps pct connector only per Bible § 4.2 KenDonutChart spec.
            // Fallback = full name+pct formatter.
            formatter: narrowFormatter ?? function () {
              const pct = this.percentage ?? 0;
              // BUG 1 fix: surface-aware label colors — KEN_INK constants are light-only TS values.
              const nameColor  = surface === 'dark' ? 'rgba(255,255,255,0.62)' : KEN_INK.muted;
              const valueColor = surface === 'dark' ? 'rgba(255,255,255,0.92)' : KEN_INK.strong;
              return `<span style="color:${nameColor};">${this.point?.name}</span><br/><span style="font-variant-numeric:tabular-nums;color:${valueColor};font-weight:500;">${pct.toFixed(pct < 10 ? 1 : 0)}%</span>`;
            },
            useHTML: true,
          },
          states: {
            // PART B fix: Bible § 2.2 Donut · inactive 0.5 · slicedOffset 6px translate-out
            // brightness 0 to avoid built-in brightness mutation (only opacity matters)
            hover: {
              brightness: 0,
              halo: { size: 8, opacity: 0.25 },
            },
            inactive: { opacity: 0.5 },
          },
          slicedOffset: 6,
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Share',
          data: data.map((d) => ({ name: d.name, y: d.value })),
        },
      ],
      // G.7 Phase 5 Task 1: responsive.rules REMOVED for Donut.
      // Bible § 4.1: responsive.rules fires on CONTAINER width — catches compare mode (~370px cells).
      // Label compression at ≤320 viewport is now viewport-matchMedia driven (isNarrowViewport state
      // above). No container-width responsive rules needed — compare-safe, viewport-accurate.
      // Full label drop (dataLabels: false) ALSO removed per Bible § 4.2: "compress · not drop".
      // At ≤320: formatter switches to pct-only (no name). At >320: full name+pct shown.
    } as Partial<Highcharts.Options>);
  }, [data, height, showLabels, unit, surface, inkStrong, inkMuted, isNarrowViewport]);

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
  if (loading)      return <ChartSkeleton type="pie" height={height} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <div
        ref={(el) => { containerRef.current = el; }}
        className={['relative w-full', className ?? ''].join(' ')}
        role="img"
        aria-label={ariaLabel ?? 'Composition donut chart'}
      >
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { width: '100%' } }}
        />
        {/* Center label · overlays donut hole */}
        {(centerLabel || centerSubLabel) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            {centerLabel && (
              <p
                className="font-display font-light text-[var(--semantic-ink-strong)] leading-none"
                style={{
                  fontSize: 'clamp(24px, 3vw, 34px)',
                  fontFamily: KEN_CHART_FONT.serif,
                  fontVariantNumeric: 'tabular-nums lining-nums',
                  letterSpacing: '-0.02em',
                }}
              >
                {centerLabel}
              </p>
            )}
            {centerSubLabel && (
              <p
                className="font-body uppercase tracking-[0.12em] text-[var(--semantic-ink-muted)] mt-1.5"
                style={{ fontSize: '10px', fontWeight: 600 }}
              >
                {centerSubLabel}
              </p>
            )}
          </div>
        )}
      </div>
    </ChartReveal>
  );
}
