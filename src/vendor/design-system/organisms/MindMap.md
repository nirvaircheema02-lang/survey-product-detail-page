# MindMap · Organism · Sidecar

**WHAT:** Interactive D3 hierarchy tree. Renders an SVG mind map with collapsible/expandable nodes, animated enter/update/exit transitions, zoom+pan, and search-term highlight. The canonical organism for report PDP Scope and Taxonomy chapters.

**WHY:** V0.3 regressed Scope and Taxonomy to flat bullet lists because this organism was missing. Restoring the D3 engine prevents future AI regression to "NO cards / indentation only" substitutes.

**WHEN:** Inside `ScopeOfReport` (mode=preview) or `MindMapModal` (mode=full). Also used by `TaxonomyTree` organism.

**WHEN NOT:** Avoid for <5 nodes (plain list is clearer), or inside narrow modals (<80vw).

**WHERE:** `core-v2/src/organisms/MindMap.tsx`

**HOW:** d3-hierarchy computes tree layout. d3-zoom wires pan+zoom in `full` mode. Nodes are SVG `<g>` elements with a pill `<rect>`, label `<text>`, and badge `<g>`. Bezier `<path>` links connect parent→child. All transitions honour `useReducedMotion()`.

---

## Props API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `MindMapNode` | required | Root node with recursive `children` |
| `searchTerm` | `string` | required | Highlights matching nodes; pass `""` to disable |
| `onNodeClick` | `(name: string) => void` | required | Fires on any node click or Enter/Space keydown |
| `interactionMode` | `'full' \| 'preview'` | `'full'` | preview = no pan/zoom; full = d3-zoom enabled |
| `ariaLabel` | `string` | `'Interactive mind map'` | `aria-label` + `<title>` on `<svg>` |
| `ariaDescription` | `string` | — | `<desc>` inside `<svg>` for screen readers |

---

## MindMapNode type

```ts
interface MindMapNode {
  name: string;
  children?: MindMapNode[];
  _children?: MindMapNode[]; // collapsed state (internal — D3 pattern)
}
```

---

## Tokens used

| Token | Usage |
|---|---|
| `var(--black-900)` | Root node fill + active node stroke |
| `var(--black-100)` | Search-match node fill |
| `var(--black-200)` | Default node stroke + link colour |
| `var(--black-300)` | Link path stroke |
| `var(--black-500)` | Badge text (inactive) |
| `var(--black-600)` | Expanded node stroke |
| `var(--font-body)` | Node label font-family |

---

## A11y

- `<svg role="img" aria-label={ariaLabel}>`
- `<title>` + `<desc id="mindmap-desc">` children
- Each node `<g>`: `role="button"` + `tabindex="0"` + `aria-label="NodeName, N subcategories"`
- Keyboard: **Enter/Space** triggers click (expand/collapse + onNodeClick callback)
- D3 transitions: 800ms → 0ms when `useReducedMotion()` returns true

---

## Motion

- D3 `transition().duration(DURATION).ease(easeCubicInOut)` on node enter/update/exit
- D3 zoom `transition()` for focus-on-click camera shift (full mode only)
- `useReducedMotion()` sets DURATION=0 — all transitions instant

---

## D3 dependencies

Installed in `core-v2/package.json` (Batch 3.2c · 2026-05-19):
- `d3-hierarchy` · `d3-zoom` · `d3-selection` · `d3-transition` · `d3-ease`
- `@types/d3-hierarchy` · `@types/d3-zoom` · `@types/d3-selection` · `@types/d3-transition` · `@types/d3-ease`

---

## Code example

```tsx
import { MindMap, type MindMapNode } from '@kenresearch/design-system/organisms';

const data: MindMapNode = {
  name: "Market Report Coverage",
  children: [
    { name: "Market Size", children: [{ name: "Historical" }, { name: "Forecast" }] },
    { name: "Segmentation", children: [{ name: "By Product" }, { name: "By Region" }] },
  ]
};

// Preview card (inside ScopeOfReport — no pan/zoom, click fires modal open)
<div style={{ height: '600px' }}>
  <MindMap
    data={data}
    searchTerm=""
    onNodeClick={(name) => setModalOpen(true)}
    interactionMode="preview"
    ariaLabel="Market coverage preview"
  />
</div>

// Full canvas (inside MindMapModal — pan/zoom/search enabled)
<div style={{ height: 'calc(90vh - 72px)' }}>
  <MindMap
    data={data}
    searchTerm={searchTerm}
    onNodeClick={(name) => console.log(name)}
    interactionMode="full"
    ariaLabel="Market coverage interactive tree"
    ariaDescription="Click nodes to expand. Drag to pan. Scroll to zoom."
  />
</div>
```

---

**Promoted from:** `V0.2-for-ds/src/app/components/MindMap.tsx:1-386`
**Batch:** 3.2c · 2026-05-19
**Status:** ✅ PORTED · `pnpm tsc --noEmit` green
