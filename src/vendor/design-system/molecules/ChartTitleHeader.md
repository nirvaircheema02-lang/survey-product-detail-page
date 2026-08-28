# ChartTitleHeader

**Tier:** molecule
**Canonical source:** projects/V0.2 -for design system/src/app/components/ui/chart-title-header.tsx
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
Chart block header row: title + optional subtitle + optional legend items + optional info button.
Renders above chart body inside a Card.

```
AI in Healthcare Market Size                         [i]
Revenue by Segment 2020–2030 (USD Billion)
● North America   ● Asia Pacific   ● Europe
```

## WHY
V0.2 chart-title-header.tsx uses CardTitle + legend items. Port decouples from shadcn Card
internals and applies token typography. Every data chart in V1 PDP uses the same title+subtitle+legend
pattern — centralising prevents drift.

## WHEN
Top of any chart block (MarketAnalysis, RegionalComparison, MarketOverview). Inside Card with padding="lg".

## WHEN NOT
- Page/section heading → LabelHeadingPair.
- Non-chart cards → use native heading + BodyText.

## WHERE
MarketAnalysis organism · RegionalComparison organism · MarketOverview organism · any chart card in report PDP.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Chart title |
| `subtitle` | `string` | `undefined` | Optional data description |
| `legendItems` | `ChartLegendItem[]` | `undefined` | Colour dot + label pairs |
| `info` | `string` | `undefined` | Info tooltip content — shows Info icon button |
| `className` | `string` | — | Root wrapper className |

`ChartLegendItem`: `{ color: string, label: string }` — color is a CSS token name without `var()` (e.g. `'purple-500'`).

### Tokens used
- `--text-sm` (16px) title
- `--text-xs` (12.8px) subtitle + legend labels
- `--black-900` title color
- `--black-500` subtitle/legend color
- `--font-body` font-family
- `--font-weight-medium` title weight
- `--duration-fast` (200ms) legend hover transitions
- `--radius-xs` info button border-radius

### A11y
- Title: `<p role="heading" aria-level={3}>` — avoids heading level conflict inside card
- Info button: `aria-label` + `title` attribute
- Legend dots: `aria-hidden` — labels carry meaning

### Code example
```tsx
<ChartTitleHeader
  title="AI in Healthcare Market Size"
  subtitle="Revenue by Segment 2020–2030 (USD Billion)"
  legendItems={[
    { color: 'purple-500', label: 'North America' },
    { color: 'periwinkle-400', label: 'Asia Pacific' },
    { color: 'coral-400', label: 'Europe' },
  ]}
  info="Data from Q4 2023 company filings"
/>
```
