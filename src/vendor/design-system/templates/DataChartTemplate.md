# DataChartTemplate · sidecar

## WHAT
2-col data visualisation section shell. Left ChartCard (chart slot) + right ChartCard (table/data slot). Paywalls handled internally by ChartCard `accessLevel` prop.

## WHY
Chart + table pair is the canonical data-viz pattern across report PDP. Centralising avoids per-section re-invention of the 2-col responsive grid (CANON §2.5 + §1.7 gap-6).

## WHEN
- Report PDP: section 11 (Market Size), section 18 (DS Gap), section 20 (Macro Indicators).
- Any 2-up chart + table combination.

## WHEN NOT
- Single chart without paired table → use ChartCard directly.
- 3+ chart panels → custom grid layout.

## WHERE
`core-v2/src/templates/DataChartTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | — | yes | Section anchor id |
| `background` | `'white' \| 'warm'` | `'white'` | no | Bg alternation |
| `label` | `string` | — | yes | Eyebrow label |
| `heading` | `string` | — | yes | h2 heading |
| `lede` | `string` | — | no | Optional lede |
| `chartCard` | `ChartSlotProps` | — | yes | Left ChartCard props (chart visualisation) |
| `tableCard` | `ChartSlotProps` | — | yes | Right ChartCard props (table / secondary) |
| `className` | `string` | — | no | Extra className |

### ChartSlotProps
All `ChartCardProps` except `className`. Key props:
- `eyebrow?: string` — section label above title
- `title: string` — card h3 heading
- `insight?: string` — analyst insight line
- `accessLevel?: 'public' | 'metered' | 'lead' | 'paid'` — paywall state
- `children: ReactNode` — chart/table body slot

## Composition map

```
<SectionWrapper id background spacing="lg">
  <div mb-10 md:mb-12>
    <LabelHeadingPair label heading lede? />
  </div>
  <div grid lg:grid-cols-2 gap-6 lg:gap-8>
    <ChartCard {...chartCard} />   // left — chart
    <ChartCard {...tableCard} />   // right — table
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--scroll-margin-section` | scroll-margin-top |
| `--section-header-mb` | mb-10 md:mb-12 |
| `--shadow-md / --shadow-lg` | ChartCard card shadow (internal) |

## A11y
- ChartCard renders `<figure>` with `<figcaption>` for chart + title.
- `accessLevel` paywall overlay handled by ChartCard — PREMIUM badge + Unlock button.
- `scroll-margin-top: 72px` prevents anchor hiding.

## Responsive
- Mobile: single-col stack.
- Desktop (lg+): 2-col grid.
- Gap: `gap-6 lg:gap-8`.

## Code example

```tsx
import { DataChartTemplate } from '@kenresearch/design-system/templates';

<DataChartTemplate
  id="market-size"
  background="white"
  label="CHAPTER 11 · MARKET SIZE"
  heading="Australia Cold Chain Market Size & Forecast"
  chartCard={{
    eyebrow: 'MARKET SIZE',
    title: 'Total Market Size, 2018–2030E (USD Bn)',
    insight: 'CAGR of 8.4% expected through 2030.',
    accessLevel: 'public',
    children: <BarChartKen data={chartData} />,
  }}
  tableCard={{
    eyebrow: 'DATA TABLE',
    title: 'Annual Market Size by Segment',
    accessLevel: 'lead',
    children: <DatasetPreviewTable rows={tableRows} accessTier="lead" />,
  }}
/>
```
