# InlineStats

**Tier:** atom
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx:69 (StatItem pattern)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Single self-contained inline stat unit: IconBox + StatPair. Does NOT render a grid — that is the StatPairRow molecule's job.
```
[vertical — default]         [horizontal]
  ┌────┐                     ┌────┐  $45.2B
  │ 📊 │                     │ 📊 │  Market Size
  └────┘
 $45.2B
 Market Size
```

## WHY
V0_lite `StatItem` (KeyStats.tsx:69-118) is a 3-part composition: icon-box + tabular-nums value + muted label. Extracting as an atom lets StatPairRow molecule compose 3 of these in a grid without duplicating internal layout. Also used standalone in hero metadata and chart summary callouts.

## WHEN
- Single stat callout anywhere
- Compose 3 in StatPairRow molecule for the KeyStats strip

## WHEN NOT
- Value + label without icon → StatPair atom
- Badge-style trend → StatBadge atom
- 3-col stat strip → StatPairRow molecule

## WHERE
KeyStatsStrip organism · HeroSection metadata · chapter summary callouts.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | **required** | Icon for the IconBox |
| `value` | `string` | **required** | Metric value string |
| `label` | `string` | **required** | Descriptor label |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Stacked vs side-by-side |
| `iconColor` | `IconBoxColor` | `'purple'` | Colour palette for icon box |
| `iconSize` | `'sm' \| 'md'` | `'md'` | 44px (sm) or 48px (md) |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used
Inherited from composed atoms — see IconBox.md and StatPair.md.

### A11y
IconBox label prop available via `icon` + surrounding context. StatPair uses `<dl>` semantic pairing.

### Motion
Counter animation is consumer-driven (V0_lite wraps StatItem in `motion.div`). This atom is static — animation applied at StatPairRow molecule or KeyStatsStrip organism level.

### Code example
```tsx
import { BarChart3, TrendingUp, Globe } from 'lucide-react';

<InlineStats icon={BarChart3} value="$45.2B" label="Market Size 2024" />
<InlineStats icon={TrendingUp} value="32.5%" label="CAGR 2024–2030" iconColor="coral" />
<InlineStats icon={Globe} value="50+" label="Countries" orientation="horizontal" />
```
