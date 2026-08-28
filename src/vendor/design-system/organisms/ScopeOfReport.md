# ScopeOfReport · Organism · Sidecar

**WHAT:** Report PDP Chapter 2 section. Header (OverheadText + LabelHeadingPair) + 600px interactive MindMap preview card + hover overlay CTA + MindMapModal on click. White-on-black-50 bg with optional dot pattern.

**WHY:** V0.3 regressed this to a "2-col bullet grid · NO cards" flat list (ReportScopeSection.tsx:4). The canonical design is an interactive D3 hierarchy preview. This organism restores and locks the canonical pattern.

**WHEN:** Chapter 2 (or Scope/Coverage chapter) on any Report PDP. Pass `mindMapData` from mock-data.ts with `// TODO: replace w/ real API` markers.

**WHEN NOT:** Not for navigational trees (→ TableOfContentsSidebar). Not for coverage summaries with <5 concepts (use a simple grid instead). Do not double-wrap with another SectionWrapper.

**WHERE:** `core-v2/src/organisms/ScopeOfReport.tsx`  
**Canonical source:** `V0.2-for-ds/src/app/components/ScopeOfReport.tsx:240-313`

---

## Props API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `mindMapData` | `MindMapNode` | required | Root taxonomy node — recursive |
| `chapterLabel` | `string` | `'CHAPTER 2 · REPORT COVERAGE'` | OverheadText eyebrow |
| `heading` | `string` | `'Scope of the Report'` | Section h2 |
| `description` | `string` | `'Comprehensive analysis…'` | Paragraph below heading |
| `modalTitle` | `string` | `'Report Coverage Taxonomy'` | MindMapModal title |
| `showDotPattern` | `boolean` | `true` | Decorative dot-grid bg |
| `id` | `string` | `'scope-of-report'` | Section id for scroll-spy |

---

## Tokens used

| Token | Usage |
|---|---|
| `var(--black-50)` | Section bg |
| `var(--black-200)` | Card border |
| `var(--black-500)` | Description text colour |
| `var(--black-300)` | Dot pattern dots |
| `var(--radius-md)` | Card border-radius |
| `var(--shadow-brand-periwinkle)` | Card hover shadow |
| `var(--container-page)` | Section max-width |
| `var(--section-py-lg)` | Section vertical padding |
| `var(--space-4/8/16)` | Internal rhythm |
| `var(--text-lg)` | Description font-size |
| `var(--font-body)` | Description font-family |

---

## A11y

- `<section aria-labelledby="{id}-heading">` — landmark region
- Preview card: `role="button" tabIndex={0} aria-label="Open interactive mind map…"`
- Keyboard: Enter/Space opens modal
- Hover overlay: `aria-hidden="true"` (decorative)
- MindMapModal handles its own a11y (focus-trap + ESC + return-focus)

## Motion

- Framer `motion.div` with `whileHover="hover"` on card wrapper
- Overlay: `Variants` — rest=opacity:0, hover=opacity:1, 300ms
- `useReducedMotion()` → instant (no transition)
- MindMapModal: AnimatePresence fade + slide

## Composition

```
ScopeOfReport
├── OverheadText (chapter label)
├── LabelHeadingPair (heading)
├── <p> description
├── motion.div (card wrapper · whileHover)
│   ├── MindMap (interactionMode="preview")
│   └── motion.div (hover overlay · gradient + Maximize2 icon)
└── MindMapModal (isOpen controlled)
```

---

## Code example

```tsx
import { ScopeOfReport, type MindMapNode } from '@kenresearch/design-system/organisms';
// TODO: replace w/ real API call
import { scopeMindMapData } from '@/lib/mock-data';

<ScopeOfReport
  mindMapData={scopeMindMapData}
  chapterLabel="CHAPTER 2 · REPORT COVERAGE"
  heading="Scope of the Report"
  description="Comprehensive analysis across seven key market dimensions."
  id="scope-of-report"
/>
```

---

**Promoted from:** `V0.2-for-ds/src/app/components/ScopeOfReport.tsx:240-313`  
**Batch:** 3.2c · 2026-05-19  
**Status:** ✅ PORTED · `pnpm tsc --noEmit` green
