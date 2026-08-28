# TaxonomyTree · Organism · Sidecar

**WHAT:** Industry taxonomy chapter section using the same D3 MindMap engine as ScopeOfReport. Two variants: `preview` (600px card + hover overlay → MindMapModal) or `inline` (700px full-mode canvas + search bar + usage instructions, directly in section). Supports `bgVariant` for white/warm/subtle backgrounds. Chapter label + heading header via OverheadText + LabelHeadingPair.

**WHY:** V0.3 regressed the Taxonomy chapter to a "tree-style parent→children list · NO cards · indentation + chevrons" flat list (TaxonomySection.tsx:4). The canonical design is the same D3 engine used for Scope — same component, different data. This organism prevents re-invention.

**WHEN:** Taxonomy chapter on any Report PDP. Use `variant="preview"` when section height is constrained and modal exploration is preferred. Use `variant="inline"` when a tall full-mode canvas fits the page flow.

**WHEN NOT:** Not for competitor comparison trees (→ CompetitiveLandscape). Not for navigational outlines (→ TableOfContentsSidebar). Not for <5 node taxonomies (plain list). Do not double-wrap.

**WHERE:** `core-v2/src/organisms/TaxonomyTree.tsx`  
**Canonical source:** `V0.2-for-ds/src/app/pages/MindMapDemo.tsx` (MindMap engine · "Logistics Industry Taxonomy" · same component, different data/context)

---

## Props API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `taxonomyData` | `MindMapNode` | required | Root taxonomy node |
| `chapterLabel` | `string` | `'CHAPTER 3 · MARKET TAXONOMY'` | OverheadText eyebrow |
| `heading` | `string` | `'Industry Taxonomy'` | Section h2 |
| `description` | `string` | — | Optional paragraph below heading |
| `modalTitle` | `string` | `taxonomyData.name` | MindMapModal title (preview only) |
| `variant` | `'preview' \| 'inline'` | `'preview'` | preview=card+modal · inline=full canvas |
| `bgVariant` | `'white' \| 'warm' \| 'subtle'` | `'white'` | Section background token |
| `id` | `string` | `'taxonomy-tree'` | Section id for scroll-spy |

---

## bgVariant → token map

| Value | Token / Value |
|---|---|
| `white` | `#ffffff` |
| `warm` | `var(--warm-300)` |
| `subtle` | `var(--black-50)` |

---

## Tokens used

| Token | Usage |
|---|---|
| `var(--warm-300)` | Warm section bg |
| `var(--black-50)` | Subtle section bg |
| `var(--black-200)` | Card/canvas border + search border |
| `var(--black-500)` | Description text |
| `var(--black-600)` | Hint text (inline variant) |
| `var(--radius-md)` | Card border-radius |
| `var(--radius-sm)` | Search input + hint card radius |
| `var(--shadow-md)` | Inline canvas shadow |
| `var(--shadow-brand-periwinkle)` | Preview card hover shadow |
| `var(--container-page)` | Max-width |
| `var(--section-py-lg)` | Section vertical padding |
| `var(--purple-500)` | Search focus ring |
| `var(--purple-100)` | Search focus shadow |
| `var(--text-base/lg)` | Description + search font-size |
| `var(--font-body)` | Font-family everywhere |

---

## A11y

- `<section aria-labelledby="{id}-heading">` landmark
- `variant="inline"`: search input has `aria-label` + canvas has `role="img" aria-label` + `<desc>` with keyboard nav instructions
- `variant="preview"`: card `role="button" tabIndex={0}` + Enter/Space opens modal · MindMapModal handles focus-trap

## Motion

- `variant="preview"`: Framer `whileHover` overlay (opacity 0→1, 300ms) · `useReducedMotion()` → instant
- `variant="inline"`: no hover animation — full canvas is always visible
- MindMapModal: AnimatePresence fade + slide

## Composition (preview)

```
TaxonomyTree (variant="preview")
├── OverheadText
├── LabelHeadingPair
├── motion.div (card wrapper)
│   ├── MindMap (interactionMode="preview")
│   └── motion.div (hover overlay)
└── MindMapModal
```

## Composition (inline)

```
TaxonomyTree (variant="inline")
├── OverheadText
├── LabelHeadingPair
├── <input type="search"> (live searchTerm)
├── <div> canvas wrapper
│   └── MindMap (interactionMode="full")
└── <div> hint text block
```

---

## Code example

```tsx
import { TaxonomyTree, type MindMapNode } from '@kenresearch/design-system/organisms';
// TODO: replace w/ real API
import { taxonomyData } from '@/lib/mock-data';

// Preview variant (card → modal)
<TaxonomyTree
  taxonomyData={taxonomyData}
  chapterLabel="CHAPTER 3 · MARKET TAXONOMY"
  heading="Australia Cold Chain Logistics Taxonomy"
  variant="preview"
  bgVariant="white"
  id="taxonomy-tree"
/>

// Inline variant (full canvas in section)
<TaxonomyTree
  taxonomyData={taxonomyData}
  heading="Industry Taxonomy"
  variant="inline"
  bgVariant="subtle"
/>
```

---

**Promoted from:** `V0.2-for-ds/src/app/pages/MindMapDemo.tsx` (same MindMap engine · different data/context)  
**Batch:** 3.2c · 2026-05-19  
**Status:** ✅ PORTED · `pnpm tsc --noEmit` green
