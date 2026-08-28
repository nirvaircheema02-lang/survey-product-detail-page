# StatPairRow

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/HeroSection.tsx:349-379
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
3-column stat strip composing three InlineStats atoms in a responsive grid.
`grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8` — matches V0_lite HeroSection canonical spacing.

```
[IconBox] [IconBox] [IconBox]
 $45.2B    32.5%     50+
 Market    CAGR      Countries
```

## WHY
V0_lite HeroSection.tsx L349-379 repeats 3×StatCard in a grid. Centralising the grid
removes layout responsibility from consumers. Serial position effect — L→R flow for 3 stats is natural.

## WHEN
Exactly 3 stats in a row: hero sub-CTA area, chapter summary callout, preview card stats block.

## WHEN NOT
- 1 or 2 stats → use InlineStats directly.
- Full section with gradient bg → use KeyStatsStrip organism.

## WHERE
HeroSection below-CTA · PreviewCard stats row · chapter summary blocks.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `stats` | `[StatPairRowItem, StatPairRowItem, StatPairRowItem]` | — | Exactly 3 items |
| `className` | `string` | — | Override root grid className |

`StatPairRowItem` fields: `icon`, `value`, `label`, `iconColor?` (default `'periwinkle'`), `iconSize?`, `orientation?`.

### Tokens used
- `gap-3 sm:gap-6` → `--space-3 / --space-6`
- `pt-6 sm:pt-8` → `--space-6 / --space-8`
- Inner InlineStats tokens: see InlineStats.md

### Code example
```tsx
import { BarChart3, TrendingUp, Globe } from 'lucide-react';

<StatPairRow
  stats={[
    { icon: BarChart3, value: '$45.2B', label: 'Market Size 2024' },
    { icon: TrendingUp, value: '32.5%', label: 'CAGR 2024–2030' },
    { icon: Globe, value: '50+', label: 'Countries Covered' },
  ]}
/>
```
