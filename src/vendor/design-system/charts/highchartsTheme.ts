/**
 * @deprecated Use `buildKenChartBase` from './theme/highcharts-base' instead.
 *
 * This file reads CSS custom properties at runtime (ANTI_PATTERNS.md Cat 1.1)
 * which is incompatible with Highcharts (resolves before CSS cascade).
 * It is kept for backward compatibility with v1 DS consumers only.
 * DO NOT use in new chart wrappers — use '../theme/highcharts-base' directly.
 *
 * Migration: replace `buildKenHighchartsTheme()` / `mergePreset` with:
 *   import { buildKenChartBase } from '../theme/highcharts-base';
 *   const base = buildKenChartBase();
 *   const options = deepMerge(base, instanceOptions);
 *
 * Ken Research Highcharts theme — DS-token-only (DEPRECATED).
 *
 * READS CSS custom properties at runtime (ANTI_PATTERNS.md Cat 1.1):
 *   --chart-palette-1..8     series colors
 *   --chart-axis-label       axis labels
 *   --chart-axis-title       axis titles
 *   --chart-gridline-color   gridlines
 *   --chart-tooltip-bg       tooltip backdrop
 *   --chart-tooltip-text     tooltip text
 *   --typography-family-body DM Sans
 *   --typography-family-display Noto Serif
 *
 * USAGE:
 *   import { kenHighchartsTheme } from '@kenresearch/design-system/charts';
 *   import { areaPreset } from '@kenresearch/design-system/charts';
 *   const options = mergePreset(kenHighchartsTheme, areaPreset, { series: [...] });
 *   <HighchartsReact highcharts={Highcharts} options={options} />
 *
 * SSR (Next 15):
 *   Wrap consumer with next/dynamic({ ssr: false }) — Highcharts is browser-only.
 *
 * @promotedFrom v2 (net new — v1 had no chart standard, recharts ad-hoc)
 */

import type { Options } from 'highcharts';

/** Read CSS variable from :root or fall back to literal default. Browser-only. */
export function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** Build the canonical theme. Call inside the consumer (not at module load) so CSS vars resolved post-paint. */
export function buildKenHighchartsTheme(): Options {
  return {
    credits: { enabled: false },
    accessibility: { enabled: true },
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
      },
      spacing: [16, 16, 16, 16],
      animation: {
        duration: Number(readToken('--motion-duration-slow', '500')),
      },
    },
    colors: [
      readToken('--chart-palette-1', '#b01f24'),
      readToken('--chart-palette-2', '#262626'),
      readToken('--chart-palette-3', '#806ce0'),
      readToken('--chart-palette-4', '#a6968e'),
      readToken('--chart-palette-5', '#c3c6f9'),
      readToken('--chart-palette-6', '#d96548'),
      readToken('--chart-palette-7', '#737373'),
      readToken('--chart-palette-8', '#dfeafa'),
    ],
    title: {
      style: {
        fontFamily: readToken('--typography-family-display', "'Noto Serif', serif"),
        fontSize: readToken('--typography-size-xl', '1.953rem'),
        fontWeight: '500',
        color: readToken('--chart-axis-title', 'rgba(0,0,0,0.80)'),
      },
    },
    subtitle: {
      style: {
        fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
        fontSize: readToken('--typography-size-sm', '1rem'),
        color: readToken('--chart-axis-label', 'rgba(0,0,0,0.60)'),
      },
    },
    xAxis: {
      labels: {
        style: {
          fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
          fontSize: readToken('--typography-size-xs', '0.8rem'),
          color: readToken('--chart-axis-label', 'rgba(0,0,0,0.60)'),
        },
      },
      title: {
        style: {
          fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
          fontSize: readToken('--typography-size-compact', '0.875rem'),
          color: readToken('--chart-axis-title', 'rgba(0,0,0,0.80)'),
        },
      },
      lineColor: readToken('--chart-gridline-color', 'rgba(0,0,0,0.08)'),
      tickColor: readToken('--chart-gridline-color', 'rgba(0,0,0,0.08)'),
      gridLineColor: 'transparent',
    },
    yAxis: {
      labels: {
        style: {
          fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
          fontSize: readToken('--typography-size-xs', '0.8rem'),
          color: readToken('--chart-axis-label', 'rgba(0,0,0,0.60)'),
        },
      },
      title: {
        style: {
          fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
          fontSize: readToken('--typography-size-compact', '0.875rem'),
          color: readToken('--chart-axis-title', 'rgba(0,0,0,0.80)'),
        },
      },
      gridLineColor: readToken('--chart-gridline-color', 'rgba(0,0,0,0.08)'),
      gridLineWidth: 1,
    },
    legend: {
      itemStyle: {
        fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
        fontSize: readToken('--typography-size-xs', '0.8rem'),
        fontWeight: '400',
        color: readToken('--chart-axis-label', 'rgba(0,0,0,0.60)'),
      },
      itemHoverStyle: {
        color: readToken('--surface-text', '#000000'),
      },
    },
    tooltip: {
      backgroundColor: readToken('--chart-tooltip-bg', '#000000'),
      borderColor: 'transparent',
      borderRadius: Number(readToken('--radius-button', '5').replace('px', '')),
      shadow: false,
      style: {
        fontFamily: readToken('--typography-family-body', "'DM Sans', sans-serif"),
        fontSize: readToken('--typography-size-xs', '0.8rem'),
        color: readToken('--chart-tooltip-text', '#ffffff'),
      },
    },
    plotOptions: {
      series: {
        animation: {
          duration: Number(readToken('--motion-duration-slow', '500')),
        },
        marker: {
          enabled: false,
          states: { hover: { enabled: true, radius: 4 } },
        },
        lineWidth: Number(readToken('--chart-line-width', '2').replace('px', '')),
      },
    },
  };
}

/** Eager-resolved theme (uses fallbacks if pre-paint). Prefer buildKenHighchartsTheme() inside components. */
export const kenHighchartsTheme: Options = buildKenHighchartsTheme();

/** Deep-merge a preset over the theme. Series + xAxis.categories etc. supplied per-call. */
export function mergePreset(theme: Options, preset: Partial<Options>, overrides: Partial<Options> = {}): Options {
  return {
    ...theme,
    ...preset,
    ...overrides,
    chart:        { ...theme.chart, ...preset.chart, ...overrides.chart },
    xAxis:        { ...theme.xAxis, ...preset.xAxis, ...overrides.xAxis },
    yAxis:        { ...theme.yAxis, ...preset.yAxis, ...overrides.yAxis },
    plotOptions:  { ...theme.plotOptions, ...preset.plotOptions, ...overrides.plotOptions },
    tooltip:      { ...theme.tooltip, ...preset.tooltip, ...overrides.tooltip },
    legend:       { ...theme.legend, ...preset.legend, ...overrides.legend },
    title:        { ...theme.title, ...preset.title, ...overrides.title },
  };
}
