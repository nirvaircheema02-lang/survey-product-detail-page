/**
 * Bar chart preset — Ken Research editorial style (horizontal bars).
 *
 * Use for: category rankings, regional comparisons, top-N lists.
 * For vertical bars (time series), use columnPreset instead.
 *
 * @promotedFrom v2 (net new)
 */

import type { Options } from 'highcharts';

export const barPreset: Partial<Options> = {
  chart: { type: 'bar' },
  plotOptions: {
    bar: {
      borderWidth: 0,
      pointPadding: 0.1,
      groupPadding: 0.05,
      states: { hover: { brightness: 0.05 } },
    },
  },
  legend: { enabled: false },
};
