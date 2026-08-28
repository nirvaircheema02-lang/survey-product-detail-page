# StatCardGroup

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/stat-card-group.tsx` + StatCard pattern
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Responsive stat display group: desktop shows inline divider-separated stats; mobile shows 2-column grid. Pure display — no icons, no animation. Value prominent, label muted below.

## WHY
MarketOverview and SummarySection organisms need responsive stat strip (e.g., "8.5% GCC Market Share · 6.0% Qatar CAGR · 4th Regional Ranking"). V0.2 StatCardGroup composed V0.2's StatCard which has incompatible API with core-v2's cinematic StatCard. This molecule provides same responsive layout contract without depending on cinema variant.

## WHEN
Market-overview stat strips. Report PDP summary stats (non-animated). Any section needing 2–4 stats displayed inline with responsive fallback.

## WHEN NOT
Animated count-up stats → use core-v2 StatCard molecule. Icon-led tiles → use StatCard (cinema) or IconBox + StatPair combo. Single stat → use StatPair.

## WHERE
core-v2/src/molecules/StatCardGroup.tsx · Consumed by: MarketOverview · SummarySection organisms

## HOW

### API
- `stats` StatCardGroupItem[] — 2–6 stat items (value + label)
- `className` string — Additional classes for both desktop and mobile wrappers

### Token usage
`--text-lg` · `--text-xs` (desktop) · `--text-base` (mobile) · `--black-900` · `--leading-tight` · `--black-500` · `--text-compact` · `--black-300` (divider)

### A11y
Desktop: `role="list"` / `role="listitem"` wrapper · Divider `aria-hidden="true"` · Mobile: same semantic structure · `tabular-nums` on values for numeric alignment

### Code example
```tsx
<StatCardGroup
  stats={[
    { value: "8.5%", label: "GCC Market Share" },
    { value: "6.0%", label: "Qatar CAGR" },
  ]}
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · V0.2 StatCard API not ported (cinema variant incompatible)
