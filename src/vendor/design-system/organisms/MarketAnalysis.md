# MarketAnalysis

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/MarketAnalysis.tsx`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
Chart-driven market analysis organism. Main full-width chart card (Historical + Projected
market size area chart). Optional 2-col row (YoY growth column + value/volume line chart).
Optional 2-col TextCard insight strip. Uses @ken-research/charts via ChartBlock sub-component.

## WHY
Market research PDPs show historical vs projected size as the centrepiece data story.
Three charts tell the market narrative sequentially: size trend → growth velocity →
value vs volume divergence. TextCards below translate data to analyst-voice text —
removing cognitive load for buyers. Progressive disclosure: one full-width story chart
before detail sub-charts.

## WHEN
- Report PDP "Market Analysis / Market Size & Forecast" chapter (Chapter 3 in V0.2)
- Any chapter presenting market size trajectory with historical + forecast segments

## WHEN NOT
- Single-dimension data → ChartCard molecule directly
- Categorical breakdown → SegmentationSection
- Competitor data → CompetitiveLandscape

## WHERE
- V0.2 report PDP Chapter 3 - Market Trajectory & Growth Analysis
- Report PDP template (market data slot)

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"market-analysis"` | Section anchor id |
| `label` | `string` | required | Eyebrow label |
| `heading` | `ReactNode` | required | Section heading |
| `lede` | `string` | — | Optional lede |
| `mainChart` | `ChartSlotItem` | required | Main full-width chart |
| `twoColCharts` | `[ChartSlotItem, ChartSlotItem]` | — | 2-col chart row |
| `insights` | `MarketInsight[]` | — | 2-col TextCard insight strip |

### ChartSlotItem

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Chart card heading |
| `insight` | `string` | Optional analyst insight (italic) |
| `chart` | `ReactNode` | Chart component (from @ken-research/charts) |
| `chartHeight` | `number` | Chart height in px |

### Token usage
- `--text-md` → chart title size
- `--radius-sm` → chart block border radius
- `--shadow-card-hover` → hover shadow
- `--text-xs` → insight italic text
- `--leading-relaxed` → insight text

### A11y
- `<section aria-label>` landmark
- Chart block has `role="img" aria-label={title}` — accessible chart container
- Caller MUST set `accessibility.enabled: true` in Highcharts options
- Caller SHOULD add `series[i].accessibility.description` for screen-reader series text

### Motion
- No motion in organism — parent handles
- Highcharts: callers must not override accessibility settings

### Responsive
- Main chart: full-width at all breakpoints
- 2-col charts: stacked mobile / lg side-by-side
- Insights: stacked mobile / md 2-col

### Code example

```tsx
import { MarketAnalysis } from '@ken-research/core-v2/organisms';
import { buildKenHighchartsTheme, mergePreset, areaPreset } from '@ken-research/core-v2/charts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const theme = buildKenHighchartsTheme();

const areaOptions = mergePreset(theme, areaPreset, {
  xAxis: { categories: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'] },
  series: [
    {
      type: 'area', name: 'Historical',
      data: [120, 125, 130, 138, 142, 150],
      accessibility: { description: 'Historical market size data from 2019 to 2024' },
    },
  ],
  accessibility: { enabled: true }, // REQUIRED
});

<MarketAnalysis
  id="market-analysis"
  label="CHAPTER 3 - Market Trajectory & Growth Analysis"
  heading={<>Market Size, Growth Forecast<span className="block">& Trends</span></>}
  lede="Comprehensive analysis covering historical performance (2019-2024) and projected growth (2025-2030)."
  mainChart={{
    title: 'Historical & Projected Market Size ($ Million)',
    chartHeight: 380,
    chart: <HighchartsReact highcharts={Highcharts} options={areaOptions} />,
  }}
  insights={[
    { title: 'Historical Performance', text: 'The market demonstrated steady growth...' },
    { title: 'Future Outlook', text: 'The market is projected to reach $213 million by 2030...' },
  ]}
/>
```
