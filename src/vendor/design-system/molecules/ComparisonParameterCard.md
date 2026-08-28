# ComparisonParameterCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/comparison-parameter-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Compact parameter card: square purple-tinted icon/number container, h4 title, and short description. Hover changes border. Used in comparison parameter grids in CompetitiveLandscape.

## WHY
CompetitiveLandscape organism displays 6–8 comparison parameters (Revenue Growth, Market Penetration, Customer Retention, etc.) in grid. Each card has same chrome as AnalysisCard but semantically represents comparison dimension rather than analysis point. Separate component preserves semantic clarity (AnalysisCard: analysis of findings · ComparisonParameterCard: dimension of comparison).

## WHEN
CompetitiveLandscape comparison parameter grid. Any section listing evaluation criteria or comparison dimensions with short descriptions.

## WHEN NOT
Analysis findings → AnalysisCard. Feature cards → IconCard. Stakeholder types → StakeholderCard.

## WHERE
core-v2/src/molecules/ComparisonParameterCard.tsx · Consumed by: CompetitiveLandscape organism

## HOW

### API
- `icon` ReactNode — Icon element (Lucide/Phosphor, takes precedence over number)
- `number` number — Number badge alternative to icon (e.g., 1, 2, 3)
- `title` string — Parameter title (h4)
- `description` string — Short description of parameter
- `className` string — Additional root classes

### Token usage
`--black-300` (hover) · `--white` · `--black-200` · `--radius-sm` · `--purple-100` · `--radius-xs` · `--purple-500` · `--text-compact` · `--black-900` · `--leading-tight` · `--text-xs` · `--black-500` · `--leading-relaxed`

### A11y
Semantic h4 for title · Badge uses `tabular-nums` for numeric alignment · Icon `color: var(--purple-500)` inherited via wrapper

### Code example
```tsx
<ComparisonParameterCard
  number={1}
  title="Revenue Growth"
  description="YoY growth rate comparison across competitors"
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · Token gap mapping per TOKEN-GAP-REPORT §4
