'use client';

/**
 * DataFreshness · italic caption for chart data currency.
 *
 * WHY  · B2B research standard: data timestamp matters to readers.
 *        McKinsey · Gartner · IBISWorld all show data-as-of dates near charts.
 *        Without it, readers question the currency of forecasts and projections.
 *
 * WHAT · Compact italic span rendering "Data as of: <formatted date>".
 *        Prefix is configurable. Date can be string (passthrough) or Date object
 *        (formatted to "Jan 2025" US short locale). Rendered below source citation
 *        in ChartFigure footer area.
 *
 * WHEN · Add `dataAsOf` to ChartFigure when chart data has a meaningful cutoff date.
 *        Always provide for forecast charts · market sizing · economic indicators.
 *        Omit for decorative or always-current data.
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/DataFreshness.tsx`
 *         Used internally by ChartFigure only.
 *
 * HOW  · ```tsx
 *        <DataFreshness asOf={new Date('2025-06-01')} />
 *        // → "Data as of: Jun 1, 2025"
 *
 *        <DataFreshness asOf="Q2 2025" prefix="Data current as of" />
 *        // → "Data current as of: Q2 2025"
 *        ```
 *
 * A11y · Rendered as `<p>` with DM Sans italic · 10px · muted ink.
 *        Not interactive — purely informational.
 *
 * @module design-system/core-v2/src/charts/primitives/DataFreshness
 */

import { KEN_CHART_FONT, KEN_INK } from '../theme/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataFreshnessProps {
  /**
   * Data cutoff date.
   * - Date object: formatted via Intl (e.g. "Jun 1, 2025")
   * - String: rendered verbatim (e.g. "Q2 2025", "2025-H1")
   */
  asOf: string | Date;
  /**
   * Text prefix before the colon and date.
   * @default 'Data as of'
   */
  prefix?: string;
  /**
   * Surface context — drives text color for contrast.
   * 'light' (default): KEN_INK.muted ~5.4:1 on white.
   * 'dark': rgba(255,255,255,0.62) ~7.7:1 on #0a0a0c — WCAG AA for 10px italic bold.
   * @default 'light'
   */
  surface?: 'light' | 'dark';
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataFreshness({ asOf, prefix = 'Data as of', surface = 'light' }: DataFreshnessProps) {
  const formatted =
    asOf instanceof Date
      ? asOf.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : asOf;

  const color = surface === 'dark' ? 'rgba(255,255,255,0.62)' : KEN_INK.muted;

  return (
    <p
      style={{
        fontFamily: KEN_CHART_FONT.sans,
        fontSize: '10px',
        fontStyle: 'italic',
        color,
        lineHeight: 1.5,
        marginTop: '4px',
      }}
    >
      {prefix}: {formatted}
    </p>
  );
}
