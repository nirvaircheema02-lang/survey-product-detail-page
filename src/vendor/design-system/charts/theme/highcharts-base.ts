/**
 * Ken Highcharts Base · shared Highcharts options for ALL Ken chart primitives.
 *
 * WHY  · Single canonical Highcharts config merged into every Ken chart wrapper.
 *        Prevents visual drift across chart instances (grid weight, tooltip,
 *        color palette, font stack, animation timing).
 *        Supersedes v0.4 local `_theme.ts` and DS v1 `highchartsTheme.ts` legacy.
 *
 * WHAT · Exports `buildKenChartBase()` → returns `Options` for deepMerge into
 *        per-chart instance options. Exports `prefersReducedMotion()` helper.
 *
 * WHEN · Imported by each Ken chart component (KenColumnChart, KenBarChart etc.)
 *        and merged at construction. Call `buildKenChartBase()` inside the
 *        component (not at module load) so reduced-motion is evaluated per render.
 *
 * WHERE · `design-system/core-v2/src/charts/theme/highcharts-base.ts`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```ts
 *        import { buildKenChartBase } from '../theme/highcharts-base';
 *        const base = buildKenChartBase();
 *        const options: Options = deepMerge(base, instanceOptions);
 *        ```
 *
 * Delta from v0.4 `_theme.ts`:
 *  - Tooltip background:   dark rgba(20,20,20,0.96) → WHITE rgb(255,255,255)  [REF ALIGNED]
 *  - Tooltip border:       transparent              → rgb(228,226,240)        [REF ALIGNED]
 *  - Tooltip borderRadius: 6                        → 4                       [REF ALIGNED]
 *  - Tooltip borderWidth:  0                        → 1                       [REF ALIGNED]
 *  - Tooltip text color:   #ffffff                  → rgb(26,26,46)           [REF ALIGNED]
 *  - All other config (grid · axes · plot · animation · colors): identical to v0.4 · already ref-correct.
 *  - accessibility.enabled: false (wrappers own a11y · chart primitives are presentational)
 *
 * Token values inline (not var()) because Highcharts resolves at construction
 * before CSS cascade. Update tokens.ts when brand values change.
 *
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 * @relatedDoc projects/v1-project/v1-product-page-ver0.4/docs/_internal/REF-DEEP-MINE-2026-05-25.md §P3
 */

import type { Options } from 'highcharts';
import {
  KEN_CHART_SERIES_ARRAY,
  KEN_INK,
  KEN_CHART_BORDERS,
  KEN_TOOLTIP,
  KEN_CHART_MOTION,
  KEN_CHART_FONT,
  KEN_CHART_SERIES,
} from './tokens';

/**
 * Chart surface context.
 * 'light' = editorial-light pages (default).
 * 'dark'  = cinematic-dark sections (e.g. ResourcesSection, hero panels).
 */
export type ChartSurface = 'light' | 'dark';

/**
 * Returns Highcharts partial Options for the given surface.
 * 'light' → empty (base theme is already light-optimised).
 * 'dark'  → inverts axis label colors + grid lines.
 *           Tooltip stays white (canonical — refs keep white tooltip on dark surfaces).
 */
export function surfaceOverrides(surface: ChartSurface): Partial<Options> {
  if (surface === 'light') return {};
  return {
    xAxis: {
      labels: { style: { color: 'rgba(255,255,255,0.6)' } },
      lineColor: 'rgba(255,255,255,0.15)',
    },
    yAxis: {
      labels: { style: { color: 'rgba(255,255,255,0.6)' } },
      gridLineColor: 'rgba(255,255,255,0.08)',
    },
    tooltip: {
      // White tooltip canonical — refs keep white bg even on dark chart surfaces.
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: 'rgb(228, 226, 240)',
      style: { color: 'rgb(26, 26, 46)' },
    },
  };
}

/**
 * Returns true if the user has requested reduced motion.
 * Evaluated at render time (not module load) for accuracy.
 * SSR-safe — returns false on server.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Build the canonical Ken Highcharts base options.
 *
 * Call inside the chart component (not at module top level) so:
 * 1. `prefersReducedMotion()` is evaluated fresh per render
 * 2. Tree-shaking works correctly in SSR builds
 *
 * @returns Highcharts `Options` object — deepMerge instance options on top.
 */
export function buildKenChartBase(): Options {
  const reducedMotion = prefersReducedMotion();
  const animDuration = KEN_CHART_MOTION.highchartsAnim.duration;

  return {
    chart: {
      backgroundColor: 'transparent',
      plotBackgroundColor: 'transparent',
      plotBorderWidth: 0,
      style: { fontFamily: KEN_CHART_FONT.sans },
      spacing: [4, 4, 4, 4],
      marginLeft: 48,   // room for 5-digit tick labels (e.g. "12,500")
      marginRight: 12,  // last bar breathing room
      marginTop: 8,
      marginBottom: 32, // x-axis year labels
      animation: reducedMotion ? false : { duration: animDuration },
      events: {
        // WCAG 1.1.1 · svg-img-alt fix: hide Highcharts SVG from AT.
        // Wrapper (figure + aria-label / ChartFigure + figcaption + ChartDataTable)
        // provides all accessible context. The raw SVG is redundant to AT and
        // generates svg-img-alt axe violations when not hidden.
        load: function (this: { renderer: { box: SVGElement | null } }) {
          const svg = this.renderer?.box;
          if (svg) {
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
          }
        },
      },
    },
    title:    { text: undefined },
    subtitle: { text: undefined },
    credits:  { enabled: false },
    legend:   { enabled: false }, // chart wrappers opt-in per chart type

    xAxis: {
      lineColor:  KEN_CHART_BORDERS.default,
      lineWidth:  1,
      tickColor:  'transparent',
      tickLength: 0,
      labels: {
        rotation: 0, // horizontal labels · refs never use 45° rotation
        style: {
          color:      KEN_INK.muted,
          fontFamily: KEN_CHART_FONT.sans,
          fontSize:   '11px',
        },
      },
      title: { text: undefined },
    },

    yAxis: {
      gridLineColor:     KEN_CHART_BORDERS.gridLine,   // hairline ~5% black · ref-aligned
      gridLineWidth:     KEN_CHART_BORDERS.gridLineWeight, // 0.5px hairline
      gridLineDashStyle: 'Solid',
      lineColor:         'transparent',
      tickColor:         'transparent',
      labels: {
        style: {
          color:      KEN_INK.muted,
          fontFamily: KEN_CHART_FONT.sans,
          fontSize:   '11px',
        },
        // Plain comma-thousands · no currency/figure concat
        formatter: function () {
          const v = this.value as number;
          return v.toLocaleString('en-US');
        },
      },
      title: { text: undefined }, // suppress Highcharts "VALUES" fallback
    },

    tooltip: {
      // REF ALIGNED 2026-05-25 · white tooltip + periwinkle border
      // Previous: dark rgba(20,20,20,0.96) — contradicts both refs (Ref 2 probe = white bg)
      backgroundColor: KEN_TOOLTIP.background,
      borderColor:     KEN_TOOLTIP.border,
      borderRadius:    KEN_TOOLTIP.borderRadius,
      borderWidth:     KEN_TOOLTIP.borderWidth,
      shadow:          KEN_TOOLTIP.shadow,
      useHTML:         true,
      padding:         KEN_TOOLTIP.padding,
      style: {
        color:      KEN_TOOLTIP.color,
        fontFamily: KEN_CHART_FONT.sans,
        fontSize:   KEN_TOOLTIP.fontSize,
      },
    },

    plotOptions: {
      column: {
        borderRadius:  0,     // sharp · refs use 0
        borderWidth:   0,
        groupPadding:  0.05,
        pointPadding:  0.02,
        maxPointWidth: 80,
        color:         KEN_CHART_SERIES.primary,
        animation:     reducedMotion ? false : { duration: animDuration },
        states: {
          hover: {
            brightness: -0.1,
            halo: { size: 4, opacity: 0.2 },
          },
        },
      },
      bar: {
        borderRadius: 0,
        borderWidth:  0,
        groupPadding: 0.05,
        pointPadding: 0.02,
        color:        KEN_CHART_SERIES.primary,
      },
      line: {
        lineWidth: 2,
        color:     KEN_CHART_SERIES.primary,
        marker: {
          enabled:   false,
          symbol:    'circle',
          radius:    3,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: KEN_CHART_SERIES.primary,
        },
      },
      area: {
        lineWidth:   2,
        fillOpacity: 0.18,
        color:       KEN_CHART_SERIES.primary,
      },
      series: {
        animation: reducedMotion ? false : { duration: animDuration },
      },
    },

    colors: [...KEN_CHART_SERIES_ARRAY],

    // Chart primitives own a11y at wrapper level · Highcharts module disabled
    // to prevent duplicate ARIA on nested chart SVG.
    accessibility: { enabled: false },
  };
}
