# TargetAudience

**Tier:** organism
**Canonical source:** `projects/V0.2 -for design system/src/app/components/TargetAudience.tsx:62`
**Ported:** 2026-05-19 by aura-builder · Batch 3.3c
**Status:** ready

## WHAT
Multi-card audience organism. Left: `lg:col-span-2` — 2-col StakeholderCard grid (6–8 cards).
Right: `lg:col-span-1` — aside callout card with benefit checklist + stat + secondary CTA.
Full-width fallback when no callout provided. Dot-pattern bg texture.

## WHY
Report PDPs need a "Who Is This For" section mapping stakeholder types to report value.
The aside callout aggregates the cross-cutting benefit (pages of insights + "Talk to Expert"
CTA). This separates audience identification (grid) from value summary (callout) — applying
Law of Similarity (grid cards) and Law of Figure-Ground (aside breaks the grid to draw eye
to primary CTA).

## WHEN
- Report PDP "Target Audience / Key Stakeholders" chapter
- Any section listing 6–8 audience types with a summary callout panel

## WHEN NOT
- Fewer than 4 audience types → simple list or AnalysisCard grid
- No aside callout → plain 2-col StakeholderCard grid

## WHERE
- V0.2 report PDP Chapter 10 - Key Stakeholders

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `"target-audience"` | Section anchor id |
| `label` | `string` | required | Eyebrow label |
| `heading` | `ReactNode` | required | Section h2 heading |
| `lede` | `string` | — | Optional lede |
| `stakeholders` | `StakeholderEntry[]` | required | 6–8 audience cards |
| `callout` | `AudienceCallout` | — | Right-side callout panel |

### AudienceCallout

| Field | Type | Description |
|---|---|---|
| `heading` | `string` | Callout heading (h3) |
| `benefits` | `string[]` | Benefit checklist items |
| `stat` | `{ value, label }` | Bottom stat (e.g., "82+ Pages") |
| `ctaLabel` | `string` | CTA button label |
| `onCtaClick` | `() => void` | CTA click handler |

### Token usage
- `--black-50` → section bg
- `--pattern-opacity` / `--pattern-dot-size` / `--pattern-grid-size` → dot texture
- `--radius-sm` → callout card radius (10px)
- `--purple-500` → check icons + sparkles icon
- `--space-8` → callout card padding (p-8 canonical per V0.2)
- `--text-base` → callout heading size (20px)
- `--text-xs` → benefit text size
- `--black-100` → callout footer divider

### A11y
- `<section aria-label>` landmark
- `<aside aria-label="What you'll gain from this report">` — landmark for callout
- Checklist items are `<ul>` with `aria-label="Report benefits"`
- CircleCheckBig and Sparkles icons are `aria-hidden="true"`
- Dot-pattern div is `aria-hidden="true"`
- Focus ring on CTA button (Button atom's default)

### Motion
- No motion in organism — parent handles entrance
- Hover states on StakeholderCard and callout card are CSS-only

### Responsive
- Mobile: stacked (stakeholder grid full-width, callout below)
- lg: 3-col layout (`col-span-2` stakeholders + `col-span-1` callout)
- Stakeholder grid: `sm:grid-cols-2` at all viewport sizes

### Code example

```tsx
import { TargetAudience } from '@ken-research/core-v2/organisms';
import { Users, Utensils, Building } from 'lucide-react';

<TargetAudience
  id="target-audience"
  label="CHAPTER 10 - Key Stakeholders"
  heading="Who This Report Is For"
  lede="Designed for diverse stakeholders across the fresh herbs value chain."
  stakeholders={[
    { icon: <Users className="size-5" />, title: 'Investors & VCs', description: 'Market entry opportunities and ROI analysis' },
    { icon: <Utensils className="size-5" />, title: 'Food Service Providers', description: 'Restaurants, hotels, and catering' },
    { icon: <Building className="size-5" />, title: 'Government Bodies', description: 'Regulatory and policy stakeholders' },
    // ... more
  ]}
  callout={{
    heading: "What You'll Gain",
    benefits: [
      'Strategic market entry guidance',
      'Competitive intelligence insights',
      'Investment opportunity identification',
    ],
    stat: { value: '82+', label: 'Pages of insights' },
    ctaLabel: 'Talk to an Expert',
    onCtaClick: () => {},
  }}
/>
```
