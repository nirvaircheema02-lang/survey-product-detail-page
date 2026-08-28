# SegmentationSection

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/SegmentationSection.tsx`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
7-card 2/3/2 staggered market segmentation grid with gradient takeaways footer card.
Row 1: `lg:grid-cols-2` (2 cards). Row 2: `md:grid-cols-2 lg:grid-cols-3` (3 cards).
Row 3: `md:grid-cols-2` (2 cards). Gradient takeaways card spans full width below.

## WHY
Market segmentation chapters require 7 dimensions (herb type, end-user, distribution
channel, packaging, geography, cultivation method, price range) rendered as visual cards
with share data and inline progress bars. A flat list fails hierarchy. The staggered
2/3/2 layout maintains visual rhythm. Gestalt proximity groups related dimensions.

## WHEN
- Report PDP "Market Segmentation" chapter section
- Any section with 6–8 categorical segments where each needs a breakdown card with share percentages

## WHEN NOT
- Fewer than 4 segments → use 2-col TextCard grid
- Non-percentage data → AnalysisCard or IconCard

## WHERE
- V0.2 report PDP Chapter 5 - Industrial Analysis
- Report PDP template organisms

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"segmentation"` | Section anchor id |
| `label` | `string` | required | Eyebrow overhead text |
| `heading` | `ReactNode` | required | Section h2 heading |
| `lede` | `string` | — | Optional paragraph below heading |
| `stats` | `SegmentationStat[]` | — | Header strip stats (max 3) |
| `cards` | `SegmentationCardData[]` | required | 7 segmentation card data items |
| `takeaways` | `{ heading, subheading, points }` | — | Gradient footer card |

### Token usage
- `--section-py-lg` → section vertical padding (`py-12 md:py-20`)
- `--section-header-mb` → header bottom margin (2.5rem)
- `--bg-card-takeaways` → gradient bg for takeaways card
- `--radius-sm` → card border radius (10px)
- `--black-200` → card border and divider
- `--text-24` → stat value size
- `--text-xs` → stat label and card body text
- `--tracking-display-tight` → stat value tracking

### A11y
- `<section aria-label>` landmarks
- SegmentationCard molecule provides `aria-label` on item list
- ProgressBar atom has `role="progressbar"` + `aria-valuenow` + `aria-label` per item
- No interactive elements — all read-only

### Motion
- No motion in organism — parent handles entrance (FadeInSection / SectionWrapper)
- ProgressBar atom has `transition-[width]` guarded by `useReducedMotion()`

### Responsive
- Mobile: single column (1-col)
- md: Row 2 → 2-col; Row 3 → 2-col
- lg: Row 1 → 2-col; Row 2 → 3-col

### Code example

```tsx
import { SegmentationSection } from '@ken-research/core-v2/organisms';
import { ChartBar } from 'lucide-react';

<SegmentationSection
  id="segmentation"
  label="CHAPTER 5 - Industrial Analysis"
  heading={<>Qatar Fresh Herbs<span className="block">Market Segmentation</span></>}
  lede="Comprehensive analysis across seven key dimensions."
  stats={[
    { value: '7', label: 'Segments Analyzed' },
    { value: '78%', label: 'Urban Concentration' },
    { value: '+15%', label: 'Online Channel CAGR' },
  ]}
  cards={[
    {
      icon: <ChartBar className="size-5" />,
      title: 'Product Type',
      description: 'Mint and Parsley dominate...',
      items: [
        { name: 'Mint', share: 25, cagr: '7.2%' },
        { name: 'Parsley', share: 20, cagr: '5.5%' },
      ],
    },
    // ... 6 more cards
  ]}
  takeaways={{
    heading: 'Key Segmentation Takeaways',
    subheading: 'Online retail and organic herbs represent the highest growth opportunities.',
    points: [
      { heading: 'Commercial Sector Demand', body: 'The commercial segment shows strong demand...' },
      { heading: 'Distribution Channel Dynamics', body: 'Distribution through supermarkets maintains dominance...' },
    ],
  }}
/>
```
