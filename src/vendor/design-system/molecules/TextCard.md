# TextCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/text-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Card with optional icon container, title (h3), paragraph content, and optional bottom stats grid. Header area visually separated from content area. Children prop replaces paragraphs for chart/table embeds.

## WHY
RegionalComparison organism needs uniform card wrapper for both chart and table columns. Outlooks and Summaries sections also use this pattern. Without shared molecule border/radius/shadow are inconsistent across V0.2 organisms.

## WHEN
Chart or table wrapper inside RegionalComparison. Text-heavy summary cards in FutureOutlook and HistoricalPerformance sections. Any content block needing titled card with bottom stat row.

## WHEN NOT
Icon-led feature cards → use IconCard. Analysis numbered cards → use AnalysisCard. Pure stat tiles → use StatCard.

## WHERE
core-v2/src/molecules/TextCard.tsx · Consumed by: RegionalComparison · FutureOutlookSection organisms

## HOW

### API
- `title` string — Card heading (h3, DM Sans per V0.2 DS rule)
- `paragraphs` string[] — Array of paragraph text strings
- `icon` ReactNode — Optional icon in `--purple-100` container
- `stats` TextCardStat[] — Optional 2-col grid at bottom
- `children` ReactNode — Custom content (replaces paragraphs)
- `className` string — Additional root classes

### Token usage
`--radius-sm` · `--black-200` · `--white` · `--purple-100` · `--shadow-card-hover` · `--font-family-body` · `--text-sm` · `--font-weight-semibold` · `--black-900` · `--leading-tight` · `--black-600` · `--text-lg` · `--text-compact` · `--purple-500`

### A11y
Semantic h3 for title · h3 uses DM Sans (font-family-body, not Noto Serif per V0.2 rule) · tabular-nums on stats for numeric alignment

### Code example
```tsx
<TextCard
  title="Market Overview"
  paragraphs={["Text block 1", "Text block 2"]}
  icon={<SomeIcon />}
  stats={[{ value: "6.0%", label: "Growth", isPrimary: true }]}
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · Token gap mapping applied per TOKEN-GAP-REPORT §4
