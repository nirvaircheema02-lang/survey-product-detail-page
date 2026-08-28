# MindMapModal · Organism · Sidecar

**WHAT:** Full-screen fixed modal wrapping `MindMap` in `interactionMode="full"`. Header bar with title, subtitle, search input, and close button. Focus-trap (Tab cycles inside). ESC + backdrop-click close. Body scroll locked while open. Focus returns to opener on close.

**WHY:** `ScopeOfReport` shows a preview-mode MindMap at 600px. Users need a full-canvas experience to explore deep taxonomies. The modal provides 95vw × 90vh with zoom/pan/search without page navigation.

**WHEN:** Triggered by `ScopeOfReport` or `TaxonomyTree` (preview variant) hover-overlay click.

**WHEN NOT:** Don't use for non-MindMap content. For general modal patterns, use Radix `@radix-ui/react-dialog` (already in core-v2 deps).

**WHERE:** `core-v2/src/organisms/MindMapModal.tsx`

---

## Props API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | required | Controls visibility |
| `onClose` | `() => void` | required | ESC / backdrop / close button all call this |
| `data` | `MindMapNode` | required | Passed directly to `MindMap` |
| `title` | `string` | `'Report Coverage Taxonomy'` | Modal heading text |
| `subtitle` | `string` | `'Click to expand categories…'` | Instruction sub-heading |
| `searchPlaceholder` | `string` | `'Search taxonomy…'` | Search input placeholder |
| `openerRef` | `RefObject<HTMLElement>` | — | Focus returns here on close |

---

## Tokens used

| Token | Usage |
|---|---|
| `var(--radius-md)` | Panel border-radius |
| `var(--shadow-xl)` | Panel drop shadow |
| `var(--text-xl)` | Modal title font-size |
| `var(--text-sm)` | Subtitle + search font-size |
| `var(--black-200)` | Header border + search border |
| `var(--black-100)` | Close button hover bg |
| `var(--black-500)` | Close icon + subtitle colour |
| `var(--black-900)` | Title colour |
| `var(--purple-500)` | Search focus ring colour |
| `var(--font-body)` | Title + subtitle + search font-family |
| `var(--space-*)` | Header + search padding |

---

## A11y

- `role="dialog" aria-modal="true" aria-labelledby={modalId}` on panel
- `<h2 id={modalId}>` for labelling
- Focus trap: Tab cycles between search input + close button (+ MindMap node tabindex elements)
- ESC keydown → `onClose()`
- Backdrop click → `onClose()` (via `aria-hidden="true"` overlay — panel stops propagation)
- Body `overflow: hidden` while open — prevents scroll beneath modal
- Focus returns to `openerRef.current` on close

## Motion

- `AnimatePresence` controls mount/unmount
- Overlay: opacity 0→1 (200ms) + exit 150ms
- Panel: opacity 0→1 + translateY 16px→0 (250ms cubic-bezier) + exit 150ms
- `useReducedMotion()`: instant show/hide (no opacity/transform animation)

---

## Code example

```tsx
import { MindMapModal, type MindMapNode } from '@kenresearch/design-system/organisms';

const triggerRef = useRef<HTMLButtonElement>(null);
const [open, setOpen] = useState(false);

<button ref={triggerRef} onClick={() => setOpen(true)}>
  Explore taxonomy
</button>

<MindMapModal
  isOpen={open}
  onClose={() => setOpen(false)}
  data={myTaxonomyData}
  title="Australia Cold Chain Logistics Taxonomy"
  openerRef={triggerRef}
/>
```

---

**Promoted from:** `V0.2-for-ds/src/app/components/MindMapModal.tsx`
**Batch:** 3.2c · 2026-05-19
**Status:** ✅ PORTED · `pnpm tsc --noEmit` green
