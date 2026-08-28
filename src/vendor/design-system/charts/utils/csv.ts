/**
 * CSV export utilities · chart data download helpers.
 *
 * WHY  · B2B research consumers need to extract chart data for their own analysis.
 *        CSV is the universal interchange format — Excel / Google Sheets compatible.
 *        PNG export deferred (CSS-grid charts require html-to-image dependency).
 *
 * WHAT · Two pure functions:
 *        1. `dataTableToCSV` — converts headers + rows matrix to RFC 4180 CSV string.
 *           Handles commas · quotes · newlines in values via double-quote escaping.
 *        2. `downloadCSV` — triggers browser download of a CSV blob without libs.
 *           Uses createObjectURL + programmatic click + immediate revoke.
 *
 * WHEN · Called from ExportMenu when user clicks "Download CSV".
 *        DataTable source = ChartFigure `dataTable` prop (WCAG table fallback).
 *
 * WHERE · `design-system/core-v2/src/charts/utils/csv.ts`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```ts
 *        const csv = dataTableToCSV(['Year', 'Revenue'], [['2023', 1200], ['2024', 1400]]);
 *        downloadCSV('cold-chain-revenue', csv);
 *        ```
 *
 * @module design-system/core-v2/src/charts/utils/csv
 */

// ─── dataTableToCSV ───────────────────────────────────────────────────────────

/**
 * Convert a headers + rows matrix to an RFC 4180 CSV string.
 *
 * Escaping rules:
 * - Values containing commas, double quotes, or newlines are wrapped in double quotes.
 * - Double quotes inside values are escaped as `""`.
 *
 * @param headers  Column header strings
 * @param rows     Data rows — each value is string or number
 * @returns        CSV-formatted string (LF line endings)
 */
export function dataTableToCSV(
  headers: string[],
  rows: (string | number)[][],
): string {
  const escape = (val: string | number): string => {
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines: string[] = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ];

  return lines.join('\n');
}

// ─── downloadCSV ─────────────────────────────────────────────────────────────

/**
 * Trigger a browser download for a CSV string.
 *
 * Creates a Blob URL, clicks a programmatic anchor, then immediately revokes.
 * No dependencies — pure browser API. Works in all modern browsers.
 *
 * @param filename  Download filename. `.csv` extension appended if missing.
 * @param csv       CSV string (from `dataTableToCSV`)
 */
export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
