# TableOfContentsSidebar

**Tier:** organism
**Canonical source:** projects/V0.2 -for design system/src/app/components/TableOfContentsSidebar.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b)
**Status:** ready

## WHAT

Sticky left sidebar for report PDP pages. Shows a list of sections with three status
states per item: upcoming (grey circle + number), active (black circle + number),
completed (black circle + Check icon). Toggle expand (255px) / collapse (80px).
Collapse button half-outside the sidebar at `-right-4`. Mobile: hidden; floating
`<List>` button shown at fixed `bottom-24 left-4` instead.

```
┌─────────────────────────────┐
│ TABLE OF CONTENTS       56m │
├─────────────────────────────┤
│ ● 1  Market Overview        │
│ ✓ 2  Segmentation           │ ← completed = black + Check
│ ○ 3  Regional Analysis      │ ← active/upcoming
│     ...                     │
└──────────────────────────[◁]┘  ← -right-4 collapse button
```

## WHY

Long-form reports (10-25 sections) exceed user working memory (Miller's Law 7±2).
A sticky TOC externalises the document map, reduces re-scanning, and increases
time-on-page. Neutral circles (not brand-red) per Anti-pattern §9: non-CTA elements
must not use brand-red.

## WHEN

- Report PDP pages inside `PDPLayoutTemplate` left aside column.
- Any long-form page with 5+ named sections and stable anchor IDs.

## WHEN NOT

- Pages with fewer than 5 sections (cognitive overhead > benefit).
- Mobile viewport — sidebar is `hidden lg:block`; use a floating MobileTOC button.
- Case-study pages — use `ReadingProgressBar` instead.

## WHERE

- V1 product page recipe — left column adjacent to main content.
- PDPLayoutTemplate `<aside>` slot.

## HOW

### API

```tsx
<TableOfContentsSidebar
  sections={[
    { id: 'market-overview', number: '1', title: 'Market Overview', time: '5m' },
    { id: 'segmentation',    number: '2', title: 'Segmentation',    time: '7m' },
    { id: 'regional',        number: '3', title: 'Regional',         time: '4m' },
  ]}
  totalTime="56m"
  scrollSpyOffset={200}
  scrollOffset={88}
  defaultExpanded={true}
/>
```

### Token usage

| Token | Where used |
|---|---|
| `--black-900` | Active + completed circle bg |
| `--black-100` | Upcoming circle bg · active nav item bg |
| `--black-200` | Sidebar border |
| `--black-600` | Chevron icon |
| `--black-500` | Inactive text |
| `--white` | Collapse button bg · frosted panel bg |
| `--radius-2xs` | Nav item border-radius (2.5px) |
| `--text-xs` | TOC header label |
| `--text-nav` | Nav item title |
| `--font-weight-bold` | TOC header + active item |
| `--tracking-label-wide` | TOC header tracking |
| `--shadow-md` | Collapse button shadow |
| `--duration-normal` | Width transition |
| `--ease-smooth` | Transition easing |

### A11y

- `<aside aria-label="Table of contents">` — landmark
- Each nav item: `<button aria-current="step">` when active
- Collapse button: `aria-label + aria-expanded`
- Mobile button: `aria-label="Open table of contents"`
- Check icon: `aria-hidden="true"` (decorative)
- Upcoming circles: `aria-hidden="true"` (number is visible to sighted users; SR users get title text)

### Motion

- Width transition: CSS `transition: width var(--duration-normal) var(--ease-smooth)` — respects DS global `@media (prefers-reduced-motion: reduce)`
- `useReducedMotion()` from framer-motion guards `scrollTo({ behavior: 'smooth' })` → `'auto'` when reduced

### Responsive

- `hidden lg:block` — sidebar only on large screens
- Collapsed state: 80px wide (dots only, labels hidden)
- Mobile: floating `<button>` at `fixed bottom-24 left-4 z-50 lg:hidden`

### Code example

```tsx
import { TableOfContentsSidebar } from '@kenresearch/design-system/organisms';
import { reportSections } from '@/lib/mock-data';
// TODO: replace w/ real API — derive from report chapter metadata

export default function ReportPDPPage() {
  return (
    <div className="flex">
      <TableOfContentsSidebar sections={reportSections} totalTime="56m" />
      <main className="flex-1">{/* chapter content */}</main>
    </div>
  );
}
```
