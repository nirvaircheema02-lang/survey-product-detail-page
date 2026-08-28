# TimelineCard

**Tier:** molecule
**Canonical source:** `projects/V0.2 -for design system/src/app/components/ui/timeline-card.tsx`
**Ported:** 2026-05-19 · aura-builder · Batch 3.2a-REDO
**Status:** ready

## WHAT
Centered card for displaying timeline / period data. Off-white background, muted label text above, bold prominent value below. Hover darkens background. Used in horizontal timeline rows (Base Year / Historical Period / Forecast Period).

## WHY
MarketOverview and SampleReportPreview both render horizontal strip of period cards (2019–2024 historical · 2024 base · 2024–2030 forecast). Without shared molecule V0.2 cards use hardcoded hex across every instance.

## WHEN
Horizontal timeline strips showing date ranges and base years. MarketOverview period selector. SampleReportPreview sidebar metadata.

## WHEN NOT
Full stat tiles with icons → StatCard. Analysis numbered cards → AnalysisCard. Progress data → SegmentationCard.

## WHERE
core-v2/src/molecules/TimelineCard.tsx · Consumed by: MarketOverview · SampleReportPreview organisms

## HOW

### API
- `label` string — Label text (e.g., "Base Year", "Historical Period", "Forecast Period")
- `value` string | number — Prominent value (e.g., "2024", "2019–2024", "6.0%")
- `className` string — Additional root classes

### Token usage
`--radius-sm` · `--black-100` (border + hover bg) · `--black-50` (default bg) · `--text-compact` · `--black-500` · `--text-lg` · `--black-900`

### A11y
Semantic layout · `tabular-nums` on value for numeric alignment · No interactive elements beyond hover display (pure presentation)

### Code example
```tsx
<TimelineCard
  label="Base Year"
  value="2024"
/>
```

## Source provenance
V0.2 canonical · v0.3 NEVER consulted · Token gap mapping per TOKEN-GAP-REPORT §4
