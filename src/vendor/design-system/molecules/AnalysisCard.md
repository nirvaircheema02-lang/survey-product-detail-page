# AnalysisCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/analysis-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Compact numbered or icon-led analysis card. Square icon container with purple tint holds either formatted number badge (e.g., "01") or icon element. Below: h4 title + small description paragraph.

## WHY
CompetitiveLandscape organism grids numbered analysis points (fragmentation, pricing pressure, etc.). Each point needs consistent chrome: number in purple-tinted box, bold title, muted description. Without shared molecule V0.2 hardcoded hex across every landscape card.

## WHEN
CompetitiveLandscape numbered analysis grids. Any multi-card grid needing sequential numbered items with short descriptions.

## WHEN NOT
Large icon-led feature cards → IconCard. Stakeholder rows → StakeholderCard. Timeline data → TimelineCard.

## WHERE
core-v2/src/molecules/AnalysisCard.tsx · Consumed by: CompetitiveLandscape organism

## HOW

### API
- `number` string — Formatted number badge (e.g., "01", "02")
- `icon` ReactNode — Icon element (Lucide/Phosphor, takes precedence over number)
- `title` string — Card heading (h4)
- `description` string — Short descriptive text
- `className` string — Additional root classes

### Token usage
`--purple-300` (hover) · `--white` · `--black-200` · `--radius-sm` · `--purple-100` · `--radius-xs` · `--purple-500` · `--text-xs` · `--text-compact` · `--black-900` · `--leading-tight` · `--black-500` · `--leading-relaxed`

### A11y
Semantic h4 for title · Badge uses `tabular-nums` for numeric alignment · Badge background accessible contrast with purple tokens

### Code example
```tsx
<AnalysisCard
  number="01"
  title="Fragmentation"
  description="Market heavily fragmented across players"
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · All hex replaced with core-v2 token vars per TOKEN-GAP-REPORT §4
