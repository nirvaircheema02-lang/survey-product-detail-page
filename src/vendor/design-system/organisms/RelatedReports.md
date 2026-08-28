# RelatedReports

**Tier:** organism
**Canonical source:** report-store-legacy RecommendedForYou / AnalystPicks / FeaturedResearch sections
**Ported:** 2026-05-19 by aura-builder · Batch 3.3d
**Status:** ready

## WHAT

Horizontal-scroll row of related/recommended reports. Section heading + optional "View all" CTALink above a snap-scroll card row using HorizontalScroll molecule.

```
Explore More
─────────────────────────────────────────
Recommended Reports             [View all →]

 ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
 │  rpt │  │  rpt │  │  rpt │  │  rpt │ ←→ scroll
 └──────┘  └──────┘  └──────┘  └──────┘
```

## WHY

Cross-sell and content discovery. Horizontal scroll allows browsing without leaving current page (Fitts's Law: stays in context). Same pattern as "Recommended for You", "Analyst Picks", "Featured Research".

## WHEN

Bottom-of-page or section-end cross-sell on report PDP or listing page.

## WHEN NOT

Mobile when reports need individual scanning — prefer vertical grid. Don't use featured variant in scroll row (too tall).

## WHERE

Report Store listing page (below results) · report PDP bottom section.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | — | Section heading (required) |
| `label` | `string?` | `'Related'` | Eyebrow label |
| `subheading` | `string?` | — | Lede below heading |
| `reports` | `ReportCardData[]` | — | Reports to display |
| `onView` | `(id: string) => void` | — | Navigate handler |
| `viewAllHref` | `string?` | — | "View all" link href |
| `viewAllLabel` | `string` | `'View all reports'` | Link label |
| `cardVariant` | `ReportCardVariant` | `'compact'` | Card variant |
| `cardWidth` | `string?` | `'300px'` | Card width in scroll row |
| `background` | `'white' \| 'warm' \| 'transparent'` | `'white'` | Section background |
| `className` | `string?` | — | Extra class |

### Tokens

| Token | Usage |
|---|---|
| `--warm-100` | Warm background variant |
| `--rc-radius-card` | Compact card border wrapper |
| `--warm-500` | Compact card border |

### Code example

```tsx
import { RelatedReports } from '@/organisms/RelatedReports';

<RelatedReports
  label="Explore More"
  heading="Recommended Reports"
  reports={relatedReports}
  onView={(id) => router.push(`/reports/${id}`)}
  viewAllHref="/reports"
/>
```
