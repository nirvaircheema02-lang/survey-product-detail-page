/**
 * Table (primitive)
 *
 * WHAT · shadcn-style composable table primitives. Exports:
 *        Table · TableHeader · TableBody · TableFooter · TableRow ·
 *        TableHead · TableCell · TableCaption
 *        All components accept className + native HTML props (spread pattern).
 *
 * WHY · DatasetPreviewTable, MarketDataTable, and ComparisonParameterCard all render
 *       tabular data. Without a shared primitive each organism re-implements <table>
 *       markup with inconsistent token usage. This atom establishes the canonical
 *       table chrome (overflow container, row hover, border tokens) so organisms only
 *       focus on data-specific layout.
 *
 * WHEN · Any tabular data presentation: market data, preview tables, comparison grids.
 *        Prefer over raw <table> when consumer is inside core-v2 DS.
 *
 * WHEN NOT · Not for layout purposes (use CSS Grid/Flex). Not for non-tabular lists.
 *
 * WHERE · core-v2/src/atoms/Table.tsx
 *         Consumed by: DatasetPreviewTable · MarketDataTable (organism)
 *
 * HOW · 'use client' directive present (shadcn pattern — React.ComponentProps spread
 *        requires client component in Next 15 RSC context).
 *        TableHead supports sortable pattern: pass `onClick` + `role="columnheader"` +
 *        `tabIndex` + `onKeyDown` from the organism layer.
 *        Token-aligned: border via `--black-200`, hover via `--black-50`, text via `--text-xs`.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/table.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor Replaced Tailwind `text-sm` (V0.2 theme 13px) → var(--text-xs) (12.8px).
 *                 Replaced `text-foreground` → var(--black-900).
 *                 Replaced `text-muted-foreground` → var(--black-500).
 *                 Replaced `hover:bg-muted/50` → bg token via class.
 *                 Replaced `bg-muted/50` footer → var(--black-50).
 */

'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

/** Outer scroll container + <table> wrapper */
function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          'w-full caption-bottom border-collapse',
          className,
        )}
        style={{ fontSize: 'var(--text-xs)' }}
        {...props}
      />
    </div>
  );
}

/** <thead> — applies bottom border on each row inside */
function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b [&_tr]:border-[var(--black-200)]', className)}
      {...props}
    />
  );
}

/** <tbody> — removes border from last row */
function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

/** <tfoot> */
function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t border-[var(--black-200)] font-medium [&>tr]:last:border-b-0',
        className,
      )}
      style={{ backgroundColor: 'var(--black-50)' }}
      {...props}
    />
  );
}

/** <tr> — row with border + hover state */
function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-[var(--black-200)] transition-colors',
        'hover:bg-[var(--black-50)] data-[state=selected]:bg-[var(--purple-50)]',
        className,
      )}
      {...props}
    />
  );
}

/**
 * <th> — column header cell.
 * For sortable columns pass `role="columnheader"`, `aria-sort`, `tabIndex={0}`,
 * `onClick`, and `onKeyDown` from the organism layer.
 */
function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-3 text-left align-middle font-medium whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      style={{ color: 'var(--black-600)' }}
      {...props}
    />
  );
}

/** <td> — data cell */
function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-2 align-middle whitespace-nowrap',
        '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

/** <caption> — table caption text (rendered below table per CSS spec) */
function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-left', className)}
      style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
