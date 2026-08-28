# Table (primitive)

**Tier:** atom (composite — 7 sub-exports)
**Canonical source:** projects/V0.2 -for design system/src/app/components/ui/table.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.2a-REDO · V0.2 canonical)
**Status:** ready

## WHAT
shadcn-style composable table primitives. Seven named exports:
`Table` · `TableHeader` · `TableBody` · `TableFooter` · `TableRow` · `TableHead` · `TableCell` · `TableCaption`

## WHY
DatasetPreviewTable, MarketDataTable, and ComparisonParameterCard all render tabular data.
Without a shared primitive each organism re-implements `<table>` markup with inconsistent
token usage, border colors, and hover states. This atom establishes the canonical chrome.

## WHEN
Any tabular data presentation: market data, preview tables, comparison grids.

## WHEN NOT
- Layout grids → use CSS Grid/Flex
- Non-tabular list data → use list atoms

## WHERE
`core-v2/src/atoms/Table.tsx`
Consumed by: DatasetPreviewTable · MarketDataTable organism · CompetitiveLandscape organism

## HOW

### Token usage
- `--black-200` row borders
- `--black-50` row hover + footer bg
- `--black-600` header text
- `--black-900` cell text
- `--purple-50` selected row bg
- `--text-xs` base font size on `<table>`
- `--brand-red` focus ring on `TableHead`

### A11y
- `TableHead` has `focus-visible` ring for sortable column interaction
- For sortable columns pass `role="columnheader"`, `aria-sort`, `tabIndex={0}`, `onClick`, `onKeyDown` from organism layer
- `TableCaption` renders source attribution accessibly

### Code example
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@ken-research/core-v2/atoms';

<Table aria-label="Market data preview">
  <TableHeader>
    <TableRow>
      <TableHead>Year</TableHead>
      <TableHead className="text-right">Value ($M)</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2024</TableCell>
      <TableCell className="text-right tabular-nums">150.2</TableCell>
    </TableRow>
  </TableBody>
  <TableCaption>Source: Ken Research Analysis, 2024</TableCaption>
</Table>
```
