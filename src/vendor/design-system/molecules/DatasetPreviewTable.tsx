/**
 * DatasetPreviewTable
 *
 * WHAT · Access-aware flat preview table for chart-card data blocks.
 *        Renders 2–5 preview rows fully, then shows a "ghost" locked row with a
 *        paywall unlock CTA. Three access tiers: anonymous (1 row visible),
 *        lead (3 rows visible), paid (all rows visible, no paywall row).
 *
 * WHY · ChartCard and RegionalComparison organisms need a consistent way to hint at
 *       tabular data while gating full access. Without a shared molecule each section
 *       re-implements blur + overlay logic inline. This molecule encapsulates that
 *       pattern (identified in V0.2 MarketDataTable preview-row usage).
 *
 * WHEN · Inside ChartCard when `accessLevel !== 'paid'`. Inside RegionalComparison
 *        table column. Any section showing gated market data in tabular form.
 *
 * WHEN NOT · Full paid tables → use MarketDataTable organism directly.
 *            Non-tabular data → use SegmentationCard or AnalysisCard.
 *
 * WHERE · core-v2/src/molecules/DatasetPreviewTable.tsx
 *         Consumed by: ChartCard · RegionalComparison · MarketDataTable (organism)
 *
 * HOW · Composes Table atom primitives. Ghost row uses `blur-sm pointer-events-none`.
 *       Unlock CTA is a Button atom (brand-red). Framer Motion not used (table rows
 *       don't need entrance animation per DS motion rules). Token-only styling.
 *       ARIA: `aria-label` on table, `aria-hidden` on ghost row content.
 *
 * @canonical_source Built from V0.2 MarketDataTable preview-row pattern (no direct
 *                   DatasetPreviewTable file found in V0.2 · grep confirmed absent).
 *                   V0.3 version DELETED (v0.3 design rejected). New canonical from V0.2 pattern.
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical pattern)
 */

import { Lock } from 'lucide-react';
import { Button } from '../atoms/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../atoms/Table';
import { cn } from '../lib/cn';

/** Access tier controlling how many rows are visible before paywall row */
export type DatasetAccessTier = 'anonymous' | 'lead' | 'paid';

export interface DatasetColumn {
  /** Column key — used to pull value from DatasetRow */
  key: string;
  /** Display header label */
  label: string;
  /** Optional text alignment. @default 'left' */
  align?: 'left' | 'right' | 'center';
}

export interface DatasetRow {
  /** Matches DatasetColumn.key */
  [key: string]: string | number;
}

export interface DatasetPreviewTableProps {
  /** Column definitions */
  columns: DatasetColumn[];
  /** All data rows. Access tier controls how many are shown. */
  rows: DatasetRow[];
  /**
   * Access tier.
   * anonymous = 1 visible row · lead = 3 visible rows · paid = all rows, no paywall.
   * @default 'anonymous'
   */
  accessTier?: DatasetAccessTier;
  /** Label shown in unlock CTA. @default 'Unlock Full Data' */
  unlockLabel?: string;
  /** Called when unlock CTA is clicked. */
  onUnlock?: () => void;
  /** Source attribution shown below table. */
  source?: string;
  /** Additional classes for the root wrapper. */
  className?: string;
}

const visibleRowsByTier: Record<DatasetAccessTier, number> = {
  anonymous: 1,
  lead: 3,
  paid: Infinity,
};

const alignClass: Record<NonNullable<DatasetColumn['align']>, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function DatasetPreviewTable({
  columns,
  rows,
  accessTier = 'anonymous',
  unlockLabel = 'Unlock Full Data',
  onUnlock,
  source,
  className,
}: DatasetPreviewTableProps) {
  const visibleCount = visibleRowsByTier[accessTier];
  const visibleRows = rows.slice(0, visibleCount);
  const hasPaywall = accessTier !== 'paid' && rows.length > visibleCount;

  return (
    <div className={cn('w-full rounded-[var(--radius-sm)] overflow-hidden border border-[var(--black-200)]', className)}>
      <Table aria-label="Dataset preview table">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={alignClass[col.align ?? 'left']}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Visible rows */}
          {visibleRows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={alignClass[col.align ?? 'left']}
                  style={{ color: 'var(--black-900)' }}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Ghost paywall row */}
          {hasPaywall && (
            <TableRow
              aria-hidden="true"
              className="relative"
              style={{ backgroundColor: 'var(--black-50)' }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn('blur-sm pointer-events-none select-none', alignClass[col.align ?? 'left'])}
                  style={{ color: 'var(--black-400)' }}
                >
                  {'— — —'}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paywall unlock CTA */}
      {hasPaywall && (
        <div
          className="flex items-center justify-between gap-4 px-4 py-3 border-t border-[var(--black-200)]"
          style={{ backgroundColor: 'var(--black-50)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--black-500)', fontSize: 'var(--text-xs)' }}>
            <Lock
              size={12}
              aria-hidden="true"
              style={{ color: 'var(--black-400)' }}
            />
            <span>
              {rows.length - visibleCount} more rows locked
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onUnlock}
            aria-label={unlockLabel}
          >
            {unlockLabel}
          </Button>
        </div>
      )}

      {/* Source attribution */}
      {source && (
        <div
          className="px-4 py-2 border-t border-[var(--black-200)]"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--black-400)',
            backgroundColor: 'var(--black-50)',
          }}
        >
          Source: {source}
        </div>
      )}
    </div>
  );
}
