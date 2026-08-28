# RegionalComparison · Organism

**Batch:** 3.3a · 2026-05-19  
**Tier:** Organism  
**Source:** V0.2-for-ds `src/app/components/RegionalComparison.tsx` (port + enhancement)  
**Status:** PORTED

---

## WHY
V0.2 had a 2-col chart+table layout for GCC regional market data (Highcharts bar + inline Table with blur). Without a shared organism, every chapter section needing geographic + tabular side-by-side re-implements paywall blur, mobile collapse, and header framing independently.

## WHAT
- **Desktop (lg+):** 2-col grid — MapChart inside ChartCard (left) + DatasetPreviewTable inside ChartCard (right)
- **Mobile (< lg):** Single-col with ViewToggle tab strip switching between Map and Table panels (Framer crossfade)
- **Header:** LabelHeadingPair (eyebrow + h2 + optional lede)
- **Paywall:** Delegated to DatasetPreviewTable via `accessTier` prop (anonymous/lead/paid)
- **Container:** SectionWrapper (white bg, lg spacing, wide maxWidth)

## Changes from V0.2 source
| V0.2 | core-v2 |
|---|---|
| Highcharts bar chart | MapChart organism (react-simple-maps choropleth) |
| Inline Table + `blur-sm` rows | DatasetPreviewTable molecule (access-tier aware) |
| Always 2-col (no mobile toggle) | ViewToggle on mobile |
| Hardcoded `px-[84.375px]` padding | SectionWrapper maxWidth token |
| `text-[48px]` hardcoded heading | LabelHeadingPair molecule (token-based) |
| Highcharts `var(--purple-*)` color data | MapChart choropleth ramp (same token names) |

## WHEN
- Chapter sections comparing regional market sizes/shares geographically
- v1-product-page RegionalAnalysis section

## WHEN NOT
- Time-series → ChartCard with AreaChart
- Non-geographic comparisons → ComparisonParameterCard
- Full sortable table → MarketDataTable organism

## WHERE
`core-v2/src/organisms/RegionalComparison.tsx`

## Composes
- `SectionWrapper` (atom)
- `LabelHeadingPair` (molecule)
- `ChartCard` (molecule)
- `DatasetPreviewTable` (molecule)
- `ViewToggle` + `ViewTogglePanel` (molecule)
- `MapChart` (organism)

## A11y
- Desktop: both panels visible simultaneously (no tab trap)
- Mobile: `role="tablist"` ViewToggle · `role="tabpanel"` panels · Arrow key nav
- MapChart: SVG `<title>` + `<desc>` · per-region `aria-label`
- Locked table rows: `aria-hidden` on ghost content (delegated to DatasetPreviewTable)
- `useReducedMotion()` propagated via ViewTogglePanel crossfade

## Props
| Prop | Type | Default |
|---|---|---|
| `eyebrow` | `string` | `'REGIONAL ANALYSIS'` |
| `title` | `string` | `'Regional Market Comparison'` |
| `lede` | `string` | — |
| `regions` | `MapRegion[]` | required |
| `geographyUrl` | `string` | `'/maps/world-110m.json'` |
| `colorScale` | `'purple' \| 'periwinkle' \| 'coral'` | `'purple'` |
| `tableColumns` | `DatasetColumn[]` | required |
| `tableRows` | `DatasetRow[]` | required |
| `accessTier` | `'anonymous' \| 'lead' \| 'paid'` | `'anonymous'` |
| `source` | `string` | — |
| `lastUpdated` | `string` | — |
| `paywall` | `boolean` | `false` (legacy alias for `accessTier='anonymous'`) |
| `onUnlockClick` | `() => void` | — |

## Mock data shape
```ts
// src/lib/mock-data.ts — TODO: replace w/ real API
export const MOCK_REGIONS: MapRegion[] = [
  { id: 'AU-NSW', name: 'New South Wales', value: 4200, share: 32 },
  { id: 'AU-VIC', name: 'Victoria', value: 3100, share: 24 },
  // ... 
];
// TODO: replace w/ real /api/regional-comparison endpoint
export const MOCK_TABLE_COLS: DatasetColumn[] = [
  { key: 'state', label: 'State' },
  { key: 'marketSize', label: 'Market Size (USD Mn)', align: 'right' },
  { key: 'cagr', label: 'CAGR', align: 'center' },
];
export const MOCK_TABLE_ROWS: DatasetRow[] = [
  { state: 'New South Wales', marketSize: '4,200', cagr: '8.1%' },
  { state: 'Victoria', marketSize: '3,100', cagr: '7.8%' },
];
```
