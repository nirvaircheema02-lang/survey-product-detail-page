# DatasetPreviewTable

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/` (V0.2 MarketDataTable preview-row pattern)
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Access-aware flat preview table for chart-card data blocks. Renders 2–5 preview rows fully, then shows a "ghost" locked row with paywall unlock CTA. Three access tiers: anonymous (1 row visible), lead (3 rows visible), paid (all rows visible, no paywall row).

## WHY
ChartCard and RegionalComparison organisms need a consistent way to hint at tabular data while gating full access. Without a shared molecule each section re-implements blur + overlay logic inline. This molecule encapsulates that pattern.

## WHEN
Inside ChartCard when `accessLevel !== 'paid'`. Inside RegionalComparison table column. Any section showing gated market data in tabular form.

## WHEN NOT
Full paid tables → use MarketDataTable organism directly. Non-tabular data → use SegmentationCard or AnalysisCard.

## WHERE
core-v2/src/molecules/DatasetPreviewTable.tsx · Consumed by: ChartCard · RegionalComparison · MarketDataTable (organism)

## HOW

### API
- `columns` DatasetColumn[] — Column definitions
- `rows` DatasetRow[] — All data rows (access tier controls visibility)
- `accessTier` 'anonymous' | 'lead' | 'paid' — default 'anonymous'
- `unlockLabel` string — default 'Unlock Full Data'
- `onUnlock` () => void — Callback on unlock CTA
- `source` string — Source attribution shown below table
- `className` string — Additional root classes

### Token usage
`--radius-sm` · `--black-200` · `--black-900` · `--black-400` · `--black-50` · `--black-500` · `--text-xs`

### A11y
`aria-label` on table · `aria-hidden` on ghost row content · `aria-label` on unlock button

### Code example
```tsx
<DatasetPreviewTable
  columns={[{ key: 'name', label: 'Name' }]}
  rows={[{ name: 'Item A' }]}
  accessTier="lead"
  onUnlock={() => {}}
/>
```

## Source provenance
V0.2 canonical · built from MarketDataTable preview-row pattern · v0.3 NEVER consulted
