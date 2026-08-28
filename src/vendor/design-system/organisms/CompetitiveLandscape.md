# CompetitiveLandscape

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/CompetitiveLandscape.tsx`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
Full competitive landscape organism. Three summary cards (chart slot + top players + market
dynamics bars). Sortable companies table with paywall overlay (blur-sm on sensitive columns).
Cross-comparison parameter grid (ComparisonParameterCard × N). Analysis inclusions footer
card (AnalysisCard × N, gradient bg). Dot-pattern background texture.

## WHY
Competitive analysis is the highest-value section of a market report. Blurring company
share data drives lead capture via loss aversion (buyer sees data is there but can't read it).
The 3-card summary + table + parameters pattern mirrors Bloomberg/Euromonitor structure —
familiar to analyst buyers who immediately understand the upgrade value.

## WHEN
- Report PDP "Competitive Landscape" chapter
- Any chapter comparing named entities with market share, founding date, type, focus area

## WHEN NOT
- Unnamed/generic segments → SegmentationSection
- No paywall needed → Table atom is simpler

## WHERE
- V0.2 report PDP Chapter 8 - Competitive Landscape

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"key-players"` | Section anchor id |
| `label` | `string` | required | Eyebrow label |
| `heading` | `ReactNode` | required | Section heading |
| `lede` | `string` | — | Optional lede |
| `stats` | `GDCStat[]` | — | Header strip stats |
| `chartSlot` | `ReactNode` | — | Market share chart node |
| `chartLegend` | `{ name, color }[]` | — | Chart legend items |
| `topPlayers` | `TopPlayer[]` | — | Ranked player list |
| `combinedShare` | `string` | — | Combined share footer label |
| `dynamicsBars` | `MarketDynamicsBar[]` | — | Market dynamics bars |
| `dynamicsNote` | `string` | — | Dynamics footnote |
| `companies` | `CompetitorEntry[]` | required | Full competitor list for table |
| `unlockLabel` | `string` | `'Unlock Company Profiles'` | Paywall CTA |
| `onUnlock` | `() => void` | — | Paywall CTA handler |
| `comparisonParams` | `ComparisonParam[]` | — | Cross-comparison parameter cards |
| `analysisItems` | `AnalysisItem[]` | — | Footer analysis inclusion cards |
| `analysisHeading` | `string` | `'Analysis Included in Report'` | Footer card heading |

### Token usage
- `--black-50` → section bg
- `--pattern-opacity` / `--pattern-dot-size` / `--pattern-grid-size` → dot texture
- `--radius-sm` → all card radii (10px)
- `--purple-100` → icon containers
- `--purple-500` → sort icons + icon foreground
- `--bg-card-takeaways` → footer gradient card
- `--shadow-card-hover` → card hover shadow

### A11y
- `<section aria-label>` landmark
- `<table aria-label>` — table accessibility
- `aria-sort` on sortable th elements
- `<button>` inside `<th>` for keyboard sort
- Chart slot: caller must ensure `accessibility.enabled: true` in Highcharts options
- `aria-hidden="true"` on decorative dot-pattern div
- `aria-hidden="true"` on icon elements inside table

### Motion
- `useReducedMotion()` guards row hover transition
- No entrance animation — parent handles

### Responsive
- Summary cards: mobile stack / lg 3-col
- Table: horizontal scroll on overflow-x
- Stats strip: desktop flex / mobile 2-col grid
- Comparison params: md 2-col / lg 3-col

### Code example

```tsx
import { CompetitiveLandscape } from '@ken-research/core-v2/organisms';
import { PieChart, Grid3x3, Shield } from 'lucide-react';

<CompetitiveLandscape
  id="key-players"
  label="CHAPTER 8 - Competitive Landscape"
  heading={<>Qatar Fresh Herbs Market<span className="block">Competitive Landscape</span></>}
  stats={[
    { value: '15+', label: 'Key Players' },
    { value: '45%', label: 'Top 5 Share' },
    { value: '8', label: 'New Entrants (5yr)' },
  ]}
  chartSlot={/* <PieChart from @ken-research/charts> */}
  companies={companies}
  unlockLabel="Unlock Company Profiles"
  comparisonParams={[
    { number: 1, title: 'Revenue Growth Rate', description: 'Year-over-year revenue growth trajectory' },
    { number: 2, title: 'Market Penetration Rate', description: 'Percentage of addressable market captured' },
  ]}
  analysisItems={[
    { icon: <PieChart className="size-5" />, title: 'Market Share Analysis', description: 'Detailed breakdown...' },
    { icon: <Grid3x3 className="size-5" />, title: 'Cross Comparison Matrix', description: 'Side-by-side comparison...' },
    { icon: <Shield className="size-5" />, title: 'SWOT Analysis', description: 'Individual strengths...' },
  ]}
/>
```
