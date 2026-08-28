# KeyStatsStrip

**Tier:** organism
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx:132-156
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b)
**Status:** ready

## WHAT

Full-width section strip showing 1–4 key market metrics. Each stat has an optional
icon box, an animated counter value (0 → target on scroll-into-view), and a label.
Background = `--bg-section-stats-tinted` gradient separating it from surrounding white.

```
┌────────────────────────────────────────────────────────────────────────┐
│  [📊]         [📈]          [🌍]                                        │
│  $45.0B       32.0%         50+                                         │
│  Market Size  CAGR 2024-30  Countries Covered                           │
└────────────────────────────────────────────────────────────────────────┘
```

## WHY

Converts abstract "why buy?" into concrete quantitative proof. Serial-position effect:
numbers near the top are remembered best. Counter animation draws attention on first
reveal — motion as signal, not decoration.

## WHEN

- Directly below HeroSection on a report PDP — primary stats row.
- Market-sizing section opener.

## WHEN NOT

- Inside a card (use InlineStats molecule).
- More than 4 stats (visual overload — split or use a table).

## WHERE

- V1 product page PDP — directly below HeroSection.

## HOW

### API

```tsx
import { KeyStatsStrip, type KeyStatItem } from '@kenresearch/design-system/organisms';
import { BarChart3, TrendingUp, Globe } from 'lucide-react';

const stats: KeyStatItem[] = [
  { id: 'market-size', label: 'Market Size 2024',  value: 450, suffix: 'B', prefix: '$', divisor: 10, icon: BarChart3 },
  { id: 'cagr',        label: 'CAGR 2024–2030',    value: 320, suffix: '%', divisor: 10, icon: TrendingUp },
  { id: 'countries',   label: 'Countries Covered', value: 50,  suffix: '+', icon: Globe },
];

<KeyStatsStrip stats={stats} />
```

### Token usage

| Token | Where used |
|---|---|
| `--bg-section-stats-tinted` | Section gradient bg |
| `--text-xl` (1.953rem) | Stat value size |
| `--text-sm` | Stat label size |
| `--font-weight-semibold` | Value weight |
| `--icon-utility` | Label text colour |
| `--black-900` | Value text colour |
| `--radius-sm` | Icon box radius |
| `--container-page` | Max-width |

### A11y

- `<section data-component="KeyStatsStrip">` landmark
- `<dl aria-label="Key market statistics">` — definition list for stats
- Each stat: `aria-label="label: value"` on the cell div
- Icon: `aria-hidden="true"` (decorative)
- Counter animation: `useAnimatedCounter` wraps `requestAnimationFrame` — skip when reduced motion (returns target immediately)

### Motion

- `useAnimatedCounter(target, duration)` — easeOutCubic RAF loop
- `useReducedMotion()` — when true, counter skips to final value immediately (no animation)
- `useInView` from framer-motion — `once: true, amount: 0.5` trigger

### Responsive

- `grid-cols-1 sm:grid-cols-3` — stacks on mobile, 3-col on sm+
- `gap-8 sm:gap-12 md:gap-16` — scaling grid gap

### Code example

```tsx
// TODO: replace w/ real API — GET /api/reports/{slug}/key-stats
import { keyStatsData } from '@/lib/mock-data';
<KeyStatsStrip stats={keyStatsData} />
```
