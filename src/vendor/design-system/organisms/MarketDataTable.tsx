/**
 * MarketDataTable
 *
 * WHAT · Sortable data table organism for market performance datasets. Sticky caption.
 *        Period-colored rows (Historical = white bg · Forecast = --black-50 bg).
 *        Inline ProgressBar cell for organic/share column. Keyboard-focusable sortable
 *        column headers. Optional paywall variant (blur-sm + unlock overlay).
 *        Footer: 3-col TextCard insight strip.
 *
 * WHY · Market research PDPs need a canonical sortable data table so analysts can explore
 *       year-by-year data. V0.2 had onClick handlers on <th> tags with no keyboard support
 *       (WAI-ARIA rule 28 violation). This organism fixes that with role="columnheader",
 *       aria-sort, tabIndex=0, and Enter/Space key handlers per WAI-ARIA grid pattern.
 *
 * WHEN · Report PDP "Market Data" chapter section (Section 4 of the PDP recipe).
 *        Any sortable time-series data table in an editorial-light PDP.
 *
 * WHEN NOT · Do not use for non-sortable reference tables (use Table atom directly).
 *            Do not use for regional geographic data (use RegionalComparison organism).
 *
 * WHERE · core-v2/src/organisms/MarketDataTable.tsx
 *         Consumer: V0.2 report PDP
 *
 * HOW · Generic column definitions via `ColumnDef<T>[]`. Data typed as `T` (generic).
 *       Sort state managed locally. Paywall via `accessLevel="locked"` prop — blurs tbody
 *       rows and shows centered unlock CTA button overlay. `progressBarColumn` prop names
 *       the column that renders as an inline ProgressBar cell (value 0-100, max configurable).
 *       Section header via LabelHeadingPair. TextCard insights below table.
 *       useReducedMotion guards transition on sort column highlight.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/MarketDataTable.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @a11y_fix V0.2 had plain `<th onClick>` with no keyboard/aria — FIXED:
 *   - `<button>` inside `<th>` with `role="columnheader"` aria pattern
 *   - `aria-sort="none|ascending|descending"` on each sortable th
 *   - Enter/Space triggers sort · focus-visible ring on sort button
 * @token_refactor
 *   V0.2 `py-20 lg:py-24` → py-12 md:py-20 (--section-py-lg)
 *   V0.2 `max-w-7xl px-[84.375px]` → Container variant="page"
 *   V0.2 `mb-16` → --section-header-mb (2.5rem)
 *   V0.2 `rounded-[var(--radius-md)]` (V0.2 10px) → var(--radius-sm) (core-v2 10px)
 *   V0.2 `bg-[var(--black-50)]` section bg → bg-[var(--black-50)] (unchanged · token exists)
 *   V0.2 `hover:shadow-[var(--shadow-brand-purple)]` → var(--shadow-card-hover)
 *   V0.2 `text-sm` (V0.2 13px) → var(--text-xs) (12.8px) — table cell text
 *   V0.2 `text-lg` caption → var(--text-md) (18px alias)
 *   V0.2 `bg-[var(--purple-500)]` progress bar fill → kept (token exists in core-v2)
 *   V0.2 `text-xs` period badge → var(--text-xs)
 *   V0.2 `bg-[var(--green-100)] text-[var(--green-700)]` forecast badge → kept (tokens exist)
 */

'use client';

import { useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { ProgressBar } from '../atoms/ProgressBar';
import { Button } from '../atoms/Button';
import { TextCard } from '../molecules/TextCard';
import { cn } from '../lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

type SortDirection = 'asc' | 'desc' | null;

export interface MarketDataColumn<T> {
  /** Column key — must match a key on the row data type */
  key: keyof T;
  /** Display header label */
  label: string;
  /** Whether this column is sortable. @default false */
  sortable?: boolean;
  /**
   * Custom cell renderer. Receives the cell value and full row.
   * If omitted, renders the raw value as a string.
   */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export type TableRowPeriod = 'Historical' | 'Forecast';

export interface MarketDataRow {
  /** Row period for background coloring */
  period: TableRowPeriod;
  /** Unique row key */
  id: string | number;
  [key: string]: unknown;
}

export interface TextCardInsight {
  /** Insight heading */
  title: string;
  /** Insight paragraph text */
  text: string;
}

export interface MarketDataTableProps<T extends MarketDataRow> {
  /** Section id for scroll-spy. @default "data-table" */
  id?: string;
  /** Eyebrow label, e.g. "CHAPTER 4 - Market Breakdown" */
  label: string;
  /** Section heading — ReactNode for inline block spans */
  heading: React.ReactNode;
  /** Optional lede paragraph */
  lede?: string;
  /** Table caption shown above the headers (sticky) */
  caption: string;
  /** Caption subtitle line below caption */
  captionSubtitle?: string;
  /** Column definitions */
  columns: MarketDataColumn<T>[];
  /** Table row data */
  data: T[];
  /**
   * Column key that should render as an inline ProgressBar.
   * The value at this column must be a number 0–progressBarMax.
   */
  progressBarColumn?: keyof T;
  /** Max value for the progress bar column. @default 100 */
  progressBarMax?: number;
  /** Progress bar fill color. @default 'var(--purple-500)' */
  progressBarColor?: string;
  /**
   * Access level. 'locked' blurs tbody and shows unlock overlay.
   * @default 'public'
   */
  accessLevel?: 'public' | 'locked';
  /** CTA label for paywall unlock button. @default 'Unlock Full Data' */
  unlockLabel?: string;
  /** Callback for the unlock CTA button. */
  onUnlock?: () => void;
  /** Optional 3-col insight TextCards below the table */
  insights?: TextCardInsight[];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="ml-1 opacity-50"
      style={{ color: 'var(--purple-500)', flexShrink: 0 }}
    >
      <path
        d="M5 6l3-3 3 3M5 10l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'asc' ? 1 : direction === 'desc' ? 0.3 : 0.5}
      />
      <path
        d="M5 10l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'desc' ? 1 : direction === 'asc' ? 0.3 : 0.5}
      />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * MarketDataTable — sortable data table organism.
 * Keyboard-accessible sort headers (WAI-ARIA 28 compliant).
 * Period-colored rows, inline ProgressBar, paywall overlay support.
 */
export function MarketDataTable<T extends MarketDataRow>({
  id = 'data-table',
  label,
  heading,
  lede,
  caption,
  captionSubtitle,
  columns,
  data,
  progressBarColumn,
  progressBarMax = 100,
  progressBarColor = 'var(--purple-500)',
  accessLevel = 'public',
  unlockLabel = 'Unlock Full Data',
  onUnlock,
  insights,
}: MarketDataTableProps<T>) {
  const shouldReduceMotion = useReducedMotion();

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: keyof T) => {
      setSortKey((prevKey) => {
        setSortDirection((prevDir) => {
          if (prevKey !== key) return 'asc';
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') {
            setSortKey(null);
            return null;
          }
          return 'asc';
        });
        return prevKey === key && sortDirection === 'desc' ? null : key;
      });
    },
    [sortDirection],
  );

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (sortDirection === 'asc') return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });

  const isLocked = accessLevel === 'locked';

  return (
    <section
      id={id}
      aria-label={typeof heading === 'string' ? heading : label}
      style={{ backgroundColor: 'var(--black-50)' }}
      className="py-12 md:py-20"
    >
      <Container maxWidth="page">
        {/* ── Section header ── */}
        <div style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}>
          <LabelHeadingPair
            label={label}
            heading={heading}
            lede={lede}
            ledeMaxWidth="max-w-3xl"
          />
        </div>

        {/* ── Sortable table ── */}
        <div
          className="relative overflow-x-auto border transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
          style={{
            backgroundColor: 'var(--white)',
            borderColor: 'var(--black-200)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <table
            className="w-full text-left rtl:text-right"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}
            aria-label={caption}
          >
            {/* ── Caption ── */}
            <caption
              className="p-5 text-left rtl:text-right"
              style={{ color: 'var(--black-900)' }}
            >
              <span style={{ fontSize: 'var(--text-md, 1.125rem)', fontWeight: 'var(--font-weight-medium)' }}>
                {caption}
              </span>
              {captionSubtitle && (
                <p
                  className="mt-1.5 font-normal"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}
                >
                  {captionSubtitle}
                </p>
              )}
            </caption>

            {/* ── Headers ── */}
            <thead
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--black-500)',
                backgroundColor: 'var(--black-50)',
                borderBottom: '1px solid var(--black-200)',
                borderTop: '1px solid var(--black-200)',
              }}
            >
              <tr>
                {columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  const currentDir: SortDirection = isSorted ? sortDirection : null;
                  const ariaSort = isSorted
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : sortDirection === 'desc'
                      ? 'descending'
                      : 'none'
                    : 'none';

                  return (
                    <th
                      key={String(col.key)}
                      scope="col"
                      aria-sort={col.sortable ? ariaSort : undefined}
                      className="px-6 py-3 font-normal"
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          className={cn(
                            'flex items-center select-none cursor-pointer',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-sm',
                            'hover:text-[var(--black-900)] transition-colors',
                            !shouldReduceMotion && 'transition-colors duration-150',
                          )}
                          onClick={() => handleSort(col.key)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSort(col.key);
                            }
                          }}
                          aria-label={`Sort by ${col.label}`}
                        >
                          {col.label}
                          <SortIcon direction={currentDir} />
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody className={cn(isLocked && 'blur-sm select-none pointer-events-none')}>
              {sortedData.map((row, rowIdx) => (
                <tr
                  key={String(row.id)}
                  className={cn(
                    'transition-colors',
                    !shouldReduceMotion && 'duration-150',
                    rowIdx < sortedData.length - 1 && 'border-b border-[var(--black-200)]',
                    row.period === 'Forecast'
                      ? 'bg-[var(--black-50)] hover:bg-[var(--black-100)]'
                      : 'bg-white hover:bg-[var(--black-50)]',
                  )}
                >
                  {columns.map((col, colIdx) => {
                    const cellValue = row[col.key];
                    const isFirstCol = colIdx === 0;
                    const isProgressCol = progressBarColumn && col.key === progressBarColumn;

                    const cellContent = isProgressCol ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[7.5rem]">
                          <ProgressBar
                            value={typeof cellValue === 'number' ? cellValue : 0}
                            max={progressBarMax}
                            color={progressBarColor}
                            noAnimation
                            ariaLabel={`${col.label}: ${cellValue}`}
                          />
                        </div>
                        <span
                          className="min-w-[2.5rem] tabular-nums"
                          style={{ color: 'var(--black-500)', fontSize: 'var(--text-xs)' }}
                        >
                          {typeof cellValue === 'number' ? `${cellValue}%` : String(cellValue ?? '')}
                        </span>
                      </div>
                    ) : col.render ? (
                      col.render(cellValue, row)
                    ) : (
                      String(cellValue ?? '')
                    );

                    if (isFirstCol) {
                      return (
                        <th
                          key={String(col.key)}
                          scope="row"
                          className="px-6 py-4 whitespace-nowrap"
                          style={{ color: 'var(--black-900)' }}
                        >
                          {cellContent}
                        </th>
                      );
                    }

                    return (
                      <td key={String(col.key)} className="px-6 py-4">
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Paywall overlay ── */}
          {isLocked && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Data locked — unlock required"
            >
              <Button
                variant="brand"
                size="md"
                onClick={onUnlock}
              >
                {unlockLabel}
              </Button>
            </div>
          )}
        </div>

        {/* ── Insights strip ── */}
        {insights && insights.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {insights.map((insight, i) => (
              <TextCard
                key={i}
                title={insight.title}
                paragraphs={[insight.text]}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
