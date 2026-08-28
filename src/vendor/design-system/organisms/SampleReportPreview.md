# SampleReportPreview

**Tier:** organism
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/SampleReportPreview.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b)
**Status:** ready

## WHAT

Full-bleed report preview section with a 3-state sticky left sidebar TOC (open 280px /
compressed 200px / minimal 60px) and main content with multiple chapter previews
separated by `border-t rgba(0,0,0,0.05)` dividers. IntersectionObserver tracks active
chapter. Mobile: sidebar hidden; floating "Contents" button at `fixed bottom-6 right-4`.

```
┌──────────────┬──────────────────────────────────────────────────────────┐
│ TOC (280px)  │  CHAPTER CONTENT (max-w-1200, py-8 sm:py-12 md:py-16)    │
│              │                                                            │
│ ● 1 Exec     │  <ChapterExecutiveSummary />                              │
│ ○ 2 Market   │  ──────────────────────────────  ← border-t black/5       │
│ 🔒 3 AI Tech │  <ChapterMarketOverview />                                │
│ ...          │                                                            │
└──────────────┴──────────────────────────────────────────────────────────┘
  [◁] at -right-4
```

## WHY

Buyers need to evaluate quality before $3000+ purchase. A visible partial report with
a real sidebar/chapter structure signals professionalism and lets buyers judge data
quality directly. Paywall overlays on locked chapters convert curiosity to intent.

## WHEN

- Report PDP pages — "Sample Report" / "Preview" section.
- Contexts needing navigable partial-content preview.

## WHEN NOT

- Full report reader — use LongFormReader organism.
- Pages without chapter structure.

## WHERE

- V1 product page PDP after ResearchMethodology section.

## HOW

### API

```tsx
import { SampleReportPreview } from '@kenresearch/design-system/organisms';

// TODO: replace w/ real API — GET /api/reports/{slug}/sample-chapters
<SampleReportPreview
  tocItems={[
    { id: 'ch-1', number: 1, title: 'Executive Summary',  unlocked: true,  time: '4m' },
    { id: 'ch-2', number: 2, title: 'Market Overview',    unlocked: true,  time: '8m' },
    { id: 'ch-3', number: 3, title: 'AI Technology',      unlocked: false, time: '12m' },
  ]}
  chapters={[
    { id: 'ch-1', content: <ChapterExecutiveSummary /> },
    { id: 'ch-2', content: <ChapterMarketOverview /> },
  ]}
  totalTime="56m"
  defaultTOCState="open"
/>
```

### Token usage

| Token | Where used |
|---|---|
| `--black-900` | Active/completed circle bg |
| `--black-100` | Upcoming circle bg · active item bg |
| `--black-200` | Collapse button border |
| `--black-300` | Locked item text |
| `--black-600` | Chevron icon |
| `--white` | Panel bg · collapse button bg |
| `--duration-normal` | Width transition |
| `--ease-smooth` | Easing |
| `--text-nav` | TOC item title |
| `--text-xs` | TOC header label |
| `--font-weight-bold` | TOC header + active |
| `--tracking-label-wide` | TOC header tracking |

### A11y

- `<aside role="navigation" aria-label="Sample report table of contents">`
- `<main id="sample-report-content">` — main landmark
- Locked items: `aria-disabled="true" aria-label="${title} (locked)"`
- Active item: `<button aria-current="step">`
- Collapse: `<button aria-label="Collapse sidebar">`
- Chapter dividers: `aria-hidden="true"`
- Mobile button: `<button aria-label="Open table of contents">`

### Motion

- Sidebar width: CSS `transition: width var(--duration-normal) var(--ease-smooth)`
- Scroll navigation: `scrollIntoView({ behavior: 'smooth' })` — falls back to `'auto'` when `useReducedMotion()` returns true
- IntersectionObserver: `rootMargin: '-20% 0px -60% 0px'` for active chapter tracking

### Responsive

- `hidden lg:block` for desktop sidebar
- Mobile: floating fixed button at `bottom-6 right-4`
- Main content: `px-4 sm:px-6 md:px-10 lg:px-12`
