/**
 * Area chart preset — Ken Research editorial style.
 *
 * Spline smoothing, soft gradient fill (18% opacity), no markers, subtle gridlines.
 * Use for: market-size trends, growth projections, time-series fills.
 *
 * USAGE:
 *   const options = mergePreset(buildKenHighchartsTheme(), areaPreset, {
 *     xAxis: { categories: ['2019', '2020', ...] },
 *     series: [{ name: 'KSA Coldchain', data: [1.2, 1.5, ...] }]
 *   });
 *
 * @promotedFrom v2 (net new — v1 had no chart standard)
 */

import type { Options } from 'highcharts';

export const areaPreset: Partial<Options> = {
  chart: { type: 'areaspline' },
  plotOptions: {
    areaspline: {
      fillOpacity: 0.18,
      lineWidth: 2,
      marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
      states: { hover: { lineWidth: 2 } },
    },
  },
  legend: { enabled: true, align: 'left', verticalAlign: 'bottom', layout: 'horizontal' },
};
