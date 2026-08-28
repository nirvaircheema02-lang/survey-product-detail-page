# GrowthDriversChallenges

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/GrowthDriversChallenges.tsx:4-22`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
3-column IconCard organism presenting Growth Drivers, Challenges, and Opportunities.
Each column contains nested topic entries (h4 + paragraph + bullet list).
Grid: `md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8`.
Color-coded: drivers → green-600, challenges → rose-600 (NOT brand-red), opportunities → amber-400.

## WHY
Market research PDPs require a dense, scannable view of the three core competitive forces.
Flat bullet lists lose hierarchy. Three icon-led columns with nested topics apply Gestalt
proximity + similarity. Each column uses a distinct semantic color for rapid scanning.
`--rose-600` used for challenges (not `--red-600`) per ANTI-PATTERNS rule 19 (brand-red = CTA only).

## WHEN
- Report PDP "Growth Drivers, Challenges & Opportunities" chapter
- Any 3-force competitive analysis section

## WHEN NOT
- More than 3 categories → SegmentationSection
- Non-comparative content → FAQSection or IconCard list

## WHERE
- V0.2 report PDP Chapter 7 - Growth Drivers, Challenges & Opportunities

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"drivers"` | Section anchor id |
| `label` | `string` | required | Eyebrow label |
| `heading` | `ReactNode` | required | Section h2 heading |
| `lede` | `string` | — | Optional lede paragraph |
| `stats` | `GDCStatItem[]` | — | Header strip stats (max 3) |
| `columns` | `ColumnData[]` | required | 3 column items (drivers/challenges/opportunities) |

### ColumnData

| Field | Type | Description |
|---|---|---|
| `category` | `'drivers' \| 'challenges' \| 'opportunities'` | Controls icon + bullet color |
| `icon` | `ReactNode` | Column icon (Lucide/Phosphor, size-5) |
| `title` | `string` | Column card heading |
| `topics` | `TopicItem[]` | Nested topic entries |

### Token usage
- `--green-600` → Growth Drivers icon + bullets
- `--rose-600` → Challenges icon + bullets (NEVER --red-600 per ANTI-PATTERNS 19)
- `--amber-400` → Opportunities icon + bullets
- `--text-24` → stat values
- `--tracking-display-tight` → heading tracking
- `--leading-relaxed` → body text line height
- `--radius-sm` → card border radius

### A11y
- `<section aria-label>` landmark
- h4 headings inside topics — semantic hierarchy
- Bullet icons are `aria-hidden="true"`
- Stats strip: desktop hidden from screen at mobile (visual only), mobile grid visible

### Motion
- No motion in organism — parent handles entrance
- Consumer may wrap in `FadeInSection`

### Responsive
- Mobile: 1-col
- md: 2-col (Challenges + Opportunities wrap)
- xl: 3-col (all three visible)

### Code example

```tsx
import { GrowthDriversChallenges } from '@ken-research/core-v2/organisms';
import { TrendingUp, TriangleAlert, Lightbulb } from 'lucide-react';

<GrowthDriversChallenges
  id="drivers"
  label="CHAPTER 7 - Growth Drivers, Challenges & Opportunities"
  heading={<>Growth Drivers, Challenges<span className="block">& Opportunities</span></>}
  lede="Comprehensive analysis of key factors shaping the Qatar fresh herbs market."
  stats={[
    { value: '10%', label: 'Health Market Growth' },
    { value: '15%', label: 'Organic Preference' },
    { value: 'QAR 500M', label: 'Hydroponic Investment' },
  ]}
  columns={[
    {
      category: 'drivers',
      icon: <TrendingUp className="size-5" />,
      title: 'Growth Drivers',
      topics: [
        {
          heading: 'Increasing Health Consciousness',
          description: 'The growing awareness of health benefits...',
          bullets: ['65% of consumers seeking fresh herbs for nutritional value'],
        },
      ],
    },
    {
      category: 'challenges',
      icon: <TriangleAlert className="size-5" />,
      title: 'Market Challenges',
      topics: [{ heading: 'Climate Limitations', description: '...' }],
    },
    {
      category: 'opportunities',
      icon: <Lightbulb className="size-5" />,
      title: 'Market Opportunities',
      topics: [{ heading: 'E-commerce Growth', description: '...' }],
    },
  ]}
/>
```
