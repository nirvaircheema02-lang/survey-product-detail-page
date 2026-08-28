# StakeholderCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/stakeholder-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Horizontal card: Phosphor icon in `--purple-100` rounded container on the left, title (h4) and description paragraph on the right. Used in audience grids.

## WHY
TargetAudience organism lists 6–8 stakeholder types (Investors, Food Service, Government, etc.). Each card follows same icon-left layout. Without shared molecule icon sizing, gap, radius, and hover state drift per-card or per-section.

## WHEN
TargetAudience stakeholder grids. Any section needing compact icon-left role/description rows (partner types, audience segments, team roles).

## WHEN NOT
Vertical icon-above layouts → IconCard. Numbered analysis → AnalysisCard. Photo/avatar + bio cards → use Avatar atom + custom layout.

## WHERE
core-v2/src/molecules/StakeholderCard.tsx · Consumed by: TargetAudience organism

## HOW

### API
- `icon` ReactNode — Icon element (Lucide, Phosphor, or ReactNode)
- `title` string — Stakeholder type heading (h4)
- `description` string — Description of stakeholder's relevance / what they gain
- `className` string — Additional root classes

### Token usage
`--white` · `--black-200` · `--radius-sm` · `--purple-100` · `--purple-500` · `--radius-md` · `--text-compact` · `--font-weight-bold` · `--black-900` · `--leading-tight` · `--text-xs` · `--leading-relaxed` · `--black-500`

### A11y
Icon has `aria-hidden="true"` · Semantic h4 for title · 44px min touch target (size-11 = 2.75rem) · `group` class for optional parent hover states · keyboard accessible flex layout

### Code example
```tsx
<StakeholderCard
  icon={<InvestorIcon />}
  title="Investors"
  description="Access to financial data and market insights"
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · Token gap mapping per TOKEN-GAP-REPORT §4
