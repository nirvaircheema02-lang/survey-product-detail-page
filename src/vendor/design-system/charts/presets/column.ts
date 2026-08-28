/**
 * Column chart preset — Ken Research editorial style (vertical bars).
 *
 * Use for: time-series totals, year-over-year comparisons, segment volumes.
 * For horizontal categorical rankings, use barPreset.
 *
 * @promotedFrom v2 (net new)
 */

import type { Options } from 'highcharts';

export const columnPreset: Partial<Options> = {
  chart: { type: 'column' },
  plotOptions: {
    column: {
      borderWidth: 0,
      pointPadding: 0.1,
      groupPadding: 0.05,
      states: { hover: { brightness: 0.05 } },
    },
  },
  legend: { enabled: true, align: 'left', verticalAlign: 'bottom', layout: 'horizontal' },
};
