# IconCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/icon-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Card with circular/square icon container, h3 title (DM Sans, weight 400), optional description text, and flexible children slot for nested content. Used in 3-column grids for Growth Drivers, Challenges, and Opportunities.

## WHY
GrowthDriversChallenges organism nests topic lists (h4 + p + ul) inside each column card. Without shared molecule icon-container pattern (size, color, radius, hover) drifts per-section. V0.2 used this for RegionalComparison icon headers too.

## WHEN
GrowthDriversChallenges 3-col grid. Any section needing icon-led card with arbitrary content body. Icon + title-only variant (no description, no children) also valid for compact feature rows.

## WHEN NOT
Pure text-only cards → TextCard. Numbered analysis cards → AnalysisCard. Stakeholder cards (horizontal icon + text) → StakeholderCard.

## WHERE
core-v2/src/molecules/IconCard.tsx · Consumed by: GrowthDriversChallenges organism

## HOW

### API
- `icon` ReactNode — Icon element (Phosphor or Lucide recommended)
- `title` string — Card heading (h3, DM Sans per V0.2 DS rule)
- `description` string — Optional single-paragraph description
- `children` ReactNode — Custom content (replaces description)
- `iconSize` 'sm' | 'md' | 'lg' — default 'md'
- `iconBgColor` string — CSS var for icon container bg, default 'var(--purple-100)'
- `iconColor` string — CSS var for icon color, default 'var(--purple-500)'
- `showIconBg` boolean — Show tinted background, default true
- `className` string — Additional root classes

### Token usage
`--radius-sm` · `--black-200` · `--white` · `--shadow-card-hover` · `--purple-100` · `--purple-500` · `--radius-xs` · `--font-family-body` · `--text-sm` · `--font-weight-normal` · `--black-900` · `--leading-tight` · `--black-500` · `--leading-relaxed`

### A11y
Semantic h3 for title · h3 uses DM Sans (body font, not Noto Serif) · 44px icon container for touch target when needed

### Code example
```tsx
<IconCard
  icon={<SomeIcon />}
  title="Growth Driver"
  description="Optional desc"
  iconSize="md"
  iconBgColor="var(--purple-100)"
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · Token gap mapping per TOKEN-GAP-REPORT §4
