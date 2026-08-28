# SegmentationCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/segmentation-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Card for displaying market segmentation data: icon header, title, description, and list of items each with name, share percentage, optional CAGR, optional sub-description, and inline ProgressBar. Used in 2/3/2 staggered grid.

## WHY
SegmentationSection organism shows 7 segmentation dimensions (herb type, customer type, distribution channel, packaging, geography, cultivation method, etc.). Each card follows same layout contract. Without shared molecule progress-bar colors, icon sizing, and spacing drift.

## WHEN
SegmentationSection 7-card grid. Any section presenting categorical breakdown data with share percentages.

## WHEN NOT
Non-percentage data → AnalysisCard. Icon feature cards → IconCard. Timeline rows → TimelineCard.

## WHERE
core-v2/src/molecules/SegmentationCard.tsx · Consumed by: SegmentationSection organism

## HOW

### API
- `icon` ReactNode — Icon element (Lucide, Phosphor, or SVG)
- `title` string — Card heading
- `description` string — Card subtitle / segmentation dimension label
- `items` SegmentationItem[] — Items with name, share, optional cagr, optional description
- `maxPercentage` number — Denominator for progress bar scaling, default 100
- `className` string — Additional root classes

### Token usage
`--white` · `--black-200` · `--radius-sm` · `--shadow-card-hover` · `--purple-100` · `--radius-xs` · `--purple-500` · `--text-sm` · `--font-weight-medium` · `--black-900` · `--leading-tight` · `--text-xs` · `--black-500` · `--purple-300` (progress bar)

### A11y
Icon has `aria-hidden="true"` · Segmentation items wrapped in `<ul>` with `aria-label` · ProgressBar has `ariaLabel` per item · 44px min touch target on icon

### Code example
```tsx
<SegmentationCard
  icon={<SomeIcon />}
  title="Distribution Channel"
  items={[{ name: "Retail", share: 65, cagr: "7.2%" }]}
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · ProgressBar atom composed per recipe
