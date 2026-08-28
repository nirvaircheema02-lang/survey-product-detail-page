/**
 * Pie chart preset — Ken Research editorial style (donut variant default).
 *
 * Donut innerSize 60%. Slice labels on hover/legend only — clean default state.
 * Use for: market-share splits, segment breakdowns. Slice count ≤ 7 (8th = "Other").
 *
 * @promotedFrom v2 (net new)
 */

import type { Options } from 'highcharts';

export const piePreset: Partial<Options> = {
  chart: { type: 'pie' },
  plotOptions: {
    pie: {
      innerSize: '60%',
      borderWidth: 2,
      borderColor: 'transparent',
      dataLabels: { enabled: false },
      showInLegend: true,
      states: { hover: { brightness: 0.05 } },
      cursor: 'default',
    },
  },
  legend: { enabled: true, align: 'right', verticalAlign: 'middle', layout: 'vertical' },
};
