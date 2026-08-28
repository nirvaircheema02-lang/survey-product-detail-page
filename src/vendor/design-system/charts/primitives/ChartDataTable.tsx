'use client';

/**
 * ChartDataTable · Visually-hidden data table for screen reader fallback on visual charts.
 *
 * WHY  · WCAG 2.1 SC 1.1.1 (Non-text content) and SC 1.3.1 (Info and Relationships) require
 *        that data conveyed visually (charts, graphs) is also available in text form.
 *        A sr-only table with a caption + scoped headers gives screen readers a complete
 *        structured representation of chart data without affecting visual layout.
 *
 * WHAT · `<table className="sr-only">` with caption, thead (scope="col"), and tbody.
 *        Hidden visually via .sr-only · revealed in print via @media print override.
 *        Accepts generic `(string | number)[][]` rows — caller formats values.
 *
 * WHEN · Pass `dataTable` prop to ChartFigure whenever the chart encodes quantitative data.
 *        Skip for purely decorative / label-only charts (e.g., keyword scatter word cloud).
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/ChartDataTable.tsx`
 *         Consumed via ChartFigure (single integration point) or directly.
 *         Exported from `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ChartFigure
 *          title="Market size · AUD Mn"
 *          dataTable={{
 *            caption: 'Australia cold chain market size 2017–2027F · AUD Mn',
 *            headers: ['Year', 'Market Size (AUD Mn)', 'YoY Growth %'],
 *            rows: [
 *              ['2017', 4200, '—'],
 *              ['2018', 4580, '9.0%'],
 *              ['2027F', 10800, '11.2%'],
 *            ],
 *          }}
 *        >
 *          <KenColumnChart ... />
 *        </ChartFigure>
 *        ```
 *
 * A11y · `role="table"` explicit · `<caption>` describes data · `scope="col"` on every th.
 *        Printed via @media print (utilities.css) — sr-only override reveals table in print.
 *        Reduced motion: static element, no motion considerations.
 *
 * @module design-system/core-v2/charts/primitives/ChartDataTable
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartDataTableProps {
  /**
   * Accessible caption describing what the table contains.
   * Should mirror the chart title + unit.
   * e.g. 'Australia cold chain market size 2017–2027F · AUD Mn'
   */
  caption: string;

  /**
   * Column header labels — must include a row-identifier column (e.g. 'Year', 'Category').
   * Rendered as `<th scope="col">` in `<thead>`.
   */
  headers: string[];

  /**
   * Data rows. Each row maps 1:1 to a `headers` column.
   * Values may be strings (pre-formatted) or numbers (rendered as-is).
   */
  rows: (string | number)[][];
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Visually-hidden data table — screen reader fallback for visual charts.
 * Hidden via `.sr-only` · revealed in `@media print` via print.css override.
 */
export function ChartDataTable({ caption, headers, rows }: ChartDataTableProps) {
  return (
    <table
      className="sr-only"
      role="table"
    >
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          // row index is stable positional key — no reordering at runtime
          <tr key={rowIdx}>
            {row.map((cell, cellIdx) => (
              // cell index stable — parallel to headers array
              <td key={cellIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
