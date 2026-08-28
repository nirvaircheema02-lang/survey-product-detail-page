# MarketDataTable

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/MarketDataTable.tsx:202`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
Sortable data table organism for market performance datasets. Sticky caption. Period-colored
rows (Historical = white bg, Forecast = --black-50). Inline ProgressBar cell for share
column. Keyboard-accessible sortable headers. Optional paywall (`accessLevel="locked"`).
Footer: 3-col TextCard insight strip.

## WHY
Market research PDPs need a canonical interactive data table so analysts can explore
year-by-year data. V0.2 had plain `<th onClick>` with no keyboard support (WAI-ARIA
violation). This organism fixes that with `<button>` inside `<th>`, `aria-sort`, and
Enter/Space keyboard handlers per WAI-ARIA sortable table pattern (ANTI-PATTERNS rule 28).

## WHEN
- Report PDP "Market Data" chapter section (Chapter 4 in V0.2)
- Any sortable time-series data table in an editorial-light PDP

## WHEN NOT
- Non-sortable reference tables → Table atom directly
- Regional geographic data → RegionalComparison organism

## WHERE
- V0.2 report PDP Chapter 4 - Market Breakdown
- Report PDP template (data chapter slot)

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"data-table"` | Section anchor id |
| `label` | `string` | required | Eyebrow label |
| `heading` | `ReactNode` | required | Section heading |
| `lede` | `string` | — | Optional lede |
| `caption` | `string` | required | Table caption (shown above headers) |
| `captionSubtitle` | `string` | — | Caption subtitle |
| `columns` | `MarketDataColumn<T>[]` | required | Column definitions |
| `data` | `T[]` (T extends MarketDataRow) | required | Row data |
| `progressBarColumn` | `keyof T` | — | Column key to render as ProgressBar cell |
| `progressBarMax` | `number` | `100` | ProgressBar max value |
| `progressBarColor` | `string` | `var(--purple-500)` | ProgressBar fill color |
| `accessLevel` | `'public' \| 'locked'` | `'public'` | Paywall state |
| `unlockLabel` | `string` | `'Unlock Full Data'` | Paywall CTA label |
| `onUnlock` | `() => void` | — | Paywall CTA handler |
| `insights` | `TextCardInsight[]` | — | 3-col insight TextCards below table |

### Token usage
- `--black-50` → section bg + Forecast row bg
- `--radius-sm` → table wrapper radius (10px)
- `--shadow-card-hover` → hover shadow on table wrapper
- `--purple-500` → ProgressBar fill + sort icon color
- `--text-md` → caption font size (18px)
- `--text-xs` → table body cell text (12.8px)
- `--black-200` → table borders and dividers
- `--green-100` / `--green-700` → Forecast period badge

### A11y
- `<table aria-label>` — table accessibility label
- `<caption>` — programmatically associated description
- `<th scope="col">` — column header scope
- `<th scope="row">` — row header scope
- `aria-sort="ascending|descending|none"` — current sort state
- `<button>` inside `<th>` — keyboard-focusable sort trigger
- `focus-visible:ring-2 ring-[var(--brand-red)]` — visible focus ring
- `onKeyDown` Enter/Space → triggers sort (WAI-ARIA 28)
- ProgressBar has `role="progressbar"` + `aria-valuenow` + `aria-label`

### Motion
- `useReducedMotion()` — guards row transition class
- `noAnimation` on ProgressBar (static table cells don't animate)

### Responsive
- Horizontal scroll on overflow-x (`overflow-x-auto`)
- Stats strip: desktop flex / mobile 2-col grid

### Code example

```tsx
import { MarketDataTable, type MarketDataRow } from '@ken-research/core-v2/organisms';

interface MarketRow extends MarketDataRow {
  year: number;
  marketSize: number;
  yoyGrowth: number | null;
  organicShare: number;
}

<MarketDataTable<MarketRow>
  id="data-table"
  label="CHAPTER 4 - Market Breakdown"
  heading={<>Qatar Fresh Herbs<span className="block">Market Data (2019–2030)</span></>}
  caption="Market Performance Data"
  captionSubtitle="Click column headers to sort • Historical (2019–2024) • Projected (2025–2030)"
  columns={[
    { key: 'year', label: 'Year', sortable: true },
    { key: 'marketSize', label: 'Market Size ($ Mn)', sortable: true,
      render: (v) => `$${v} Mn` },
    { key: 'yoyGrowth', label: 'YoY Growth (%)', sortable: true,
      render: (v) => v === null ? 'Base Year' : `+${v}%` },
    { key: 'organicShare', label: 'Organic Share (%)', sortable: true },
    { key: 'period', label: 'Period' },
  ]}
  data={marketData}
  progressBarColumn="organicShare"
  progressBarMax={50}
  accessLevel="public"
  insights={[
    { title: 'Domestic Production Trend', text: 'Local production is expected to increase...' },
    { title: 'Import Dependency Reduction', text: 'Qatar aims to reduce herb imports...' },
    { title: 'Organic Market Expansion', text: 'The organic herbs segment is projected...' },
  ]}
/>
```
