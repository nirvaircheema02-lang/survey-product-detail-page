# MarketOverview

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/MarketOverview.tsx:18-30`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
Introduction chapter organism. OverheadText + SectionHeader chapter heading. Multi-paragraph
narrative text (BodyText stacked). 4-col key market stat grid (icon + label + value + subtitle).
2-col Future Outlook TextCard. 4-col timeline period grid. Dot-pattern background texture.
Uses `--content-max-width` alias (aliased to `--container-page` = 1200px per TOKEN-GAP-REPORT §2.18).

## WHY
Every market research report Chapter 1 starts with a narrative overview anchored with
quantitative stats and timeline metadata. The 4-col stat grid (market value, dominant city,
organic growth, key players) establishes credibility immediately. The timeline grid (base
year, historical period, forecast period, historical CAGR) sets methodology framing for
all subsequent data charts and prevents ambiguity about data sources.

## WHEN
- Report PDP first chapter ("Market Overview" / Chapter 1)
- Any introductory section combining narrative text + key stats + methodology timeline

## WHEN NOT
- Chapters that lead with data charts → MarketAnalysis
- Segmentation data → SegmentationSection
- Short overview without stats → plain BodyText + LabelHeadingPair

## WHERE
- V0.2 report PDP Chapter 1 - Industry Analysis
- Report PDP template (intro chapter slot)

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"market-overview"` | Section anchor id |
| `overheadLabel` | `string` | required | OverheadText chapter label |
| `heading` | `string` | required | SectionHeader title prop |
| `paragraphs` | `string[]` | required | Narrative body paragraphs |
| `stats` | `MarketOverviewStat[]` | — | 4-col key market stat cards |
| `futureOutlook` | `{ title, paragraphs, stats? }` | — | Future Outlook TextCard |
| `timelinePeriods` | `TimelinePeriod[]` | — | 4-col timeline period grid |

### MarketOverviewStat

| Field | Type | Description |
|---|---|---|
| `icon` | `ReactNode` | Icon element (Phosphor/Lucide) |
| `label` | `string` | Stat label (e.g., "Market Value") |
| `value` | `string` | Stat value (e.g., "$150 Mn") |
| `subtitle` | `string` | Subtitle below value (e.g., "2024 Estimate") |

### Token usage
- `--black-50` → section bg
- `--pattern-opacity` / `--pattern-dot-size` / `--pattern-grid-size` → dot texture
- `--radius-sm` → StatTile border radius
- `--purple-100` → stat icon container bg
- `--purple-500` → stat icon color
- `--space-8` → stat grid top margin
- `--space-10` → future outlook + timeline top margin
- `--content-max-width` → aliased to `--container-page` (1200px)

### A11y
- `<section aria-label={heading}>` — landmark
- `<aside>` and `aria-label` on nested regions
- `aria-label="Key market statistics"` on stat grid
- `aria-label="Research timeline"` on timeline grid
- Stat icons: `aria-hidden="true"`
- Dot-pattern: `aria-hidden="true"`

### Motion
- No motion in organism — parent handles
- Hover shadows on StatTile are CSS-only transitions

### Responsive
- Stat grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`
- Timeline grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`
- Future Outlook TextCard: `lg:col-span-2` full-width in its 2-col grid
- All grids stack to 1-col on mobile

### Code example

```tsx
import { MarketOverview } from '@ken-research/core-v2/organisms';
import { TrendUp, MapPin, Leaf, Buildings } from '@phosphor-icons/react';

<MarketOverview
  id="market-overview"
  overheadLabel="CHAPTER 1 - INDUSTRY ANALYSIS"
  heading="Qatar Fresh Herbs Market Overview"
  paragraphs={[
    'The Qatar Fresh Herbs Market is valued at $150 million, based on a five-year historical analysis...',
    'Doha is the dominant city in the Qatar Fresh Herbs Market...',
    'In 2023, the Qatari government implemented regulations to promote sustainable agriculture practices...',
  ]}
  stats={[
    { icon: <TrendUp weight="regular" />, label: 'Market Value', value: '$150 Mn', subtitle: '2024 Estimate' },
    { icon: <MapPin weight="regular" />, label: 'Dominant City', value: 'Doha', subtitle: '78% Market Share' },
    { icon: <Leaf weight="regular" />, label: 'Organic Growth', value: '15% YoY', subtitle: 'Fastest Segment' },
    { icon: <Buildings weight="regular" />, label: 'Key Players', value: '15+', subtitle: 'Active Companies' },
  ]}
  futureOutlook={{
    title: 'Future Outlook',
    paragraphs: [
      'The future of the Qatar fresh herbs market appears promising...',
      'Advancements in agricultural technology will enhance local production capabilities.',
    ],
    stats: [
      { value: '6.0%', label: 'Forecast CAGR', isPrimary: true },
      { value: '$213 Mn', label: '2030 Projection' },
    ],
  }}
  timelinePeriods={[
    { label: 'Base Year', value: '2024' },
    { label: 'Historical Period', value: '2019–2024' },
    { label: 'Forecast Period', value: '2025–2030' },
    { label: 'Historical CAGR', value: '4.6%' },
  ]}
/>
```
