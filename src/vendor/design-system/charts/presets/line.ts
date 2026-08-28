/**
 * Line chart preset — Ken Research editorial style.
 *
 * Single-stroke series w/ spline smoothing, no markers, subtle gridlines.
 * Use for: forecast lines, side-by-side metric trends. Best w/ 1-3 series.
 *
 * @promotedFrom v2 (net new)
 */

import type { Options } from 'highcharts';

export const linePreset: Partial<Options> = {
  chart: { type: 'spline' },
  plotOptions: {
    spline: {
      lineWidth: 2,
      marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
      states: { hover: { lineWidth: 3 } },
    },
  },
  legend: { enabled: true, align: 'left', verticalAlign: 'bottom', layout: 'horizontal' },
};
