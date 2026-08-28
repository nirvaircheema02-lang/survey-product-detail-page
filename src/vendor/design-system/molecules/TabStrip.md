# TabStrip · Molecule

**Batch:** 3.3a · 2026-05-19  
**Tier:** Molecule  
**Source:** NEW research-driven (no canonical legacy)  
**Status:** PORTED

---

## Distinction from ViewToggle atom
`ViewToggle` (atom) = icon-only grid/list switch for listing surfaces.  
`TabStrip` (molecule) = text-label tablist with keyboard nav, animated underline, and tabpanel wiring. These are separate patterns.

## WHY
RegionalComparison organism needs a mobile tab strip to switch between Map and Table views.
Without a shared molecule, each section re-implements keyboard nav, focus management, and ARIA tablist/tabpanel wiring inconsistently.

## WHAT
- `role="tablist"` root with `aria-label`
- Each option: `role="tab"` · `aria-selected` · `aria-controls` wiring (scoped by `useId()` per instance)
- Animated underline: Framer Motion `layoutId` slides between active tabs (unique per instance)
- `TabStripPanel` companion: `role="tabpanel"` + `aria-labelledby` + AnimatePresence crossfade 150ms
- Two size variants: `sm` (~32px) · `md` (~40px, default)

## WHEN
- Any 2–5 option view-switching UI (Map/Table, Chart/Data, Grid/List text labels)
- Mobile layout of RegionalComparison organism

## WHEN NOT
- Grid/list icon switch → ViewToggle atom
- Sequential stepper → StepperHorizontal
- Filter selection → FilterChip

## WHERE
`core-v2/src/molecules/TabStrip.tsx`  
Consumed by: `RegionalComparison` organism

## Keyboard contract
| Key | Behaviour |
|---|---|
| `ArrowRight` | Activate next tab (wraps) |
| `ArrowLeft` | Activate previous tab (wraps) |
| `Home` | Activate first tab |
| `End` | Activate last tab |
| `Tab` | Exits tablist (tabIndex=-1 on inactive tabs) |

## A11y
- `role="tablist"` · `aria-label` · `role="tab"` per option · `aria-selected` · `aria-controls` · `id` linkage (scoped by useId)
- `role="tabpanel"` · `aria-labelledby` on panels
- `focus-visible` ring: 2px brand-red
- `useReducedMotion()` disables layoutId spring + crossfade

## Token usage
| Token | Usage |
|---|---|
| `--brand-red` | Active underline · focus ring |
| `--border-soft` | Bottom border of tablist |
| `--semantic-ink-strong` | Active tab text |
| `--semantic-ink-subtle` | Inactive tab text |
| `--font-sans` | Tab labels |
| `--tracking-button` | Tab letter-spacing |
| `--space-xs` / `--space-sm` | Vertical padding per size variant |

## Usage
```tsx
import { TabStrip, TabStripPanel } from '@kenresearch/design-system/molecules';

const [view, setView] = useState('map');

<TabStrip
  options={[
    { id: 'map', label: 'Map View' },
    { id: 'table', label: 'Table View' },
  ]}
  value={view}
  onChange={setView}
  ariaLabel="Regional data view"
/>
<TabStripPanel id="map" activeId={view}>
  <MapChart regions={data} geographyUrl="/maps/world-110m.json" />
</TabStripPanel>
<TabStripPanel id="table" activeId={view}>
  <DatasetPreviewTable columns={cols} rows={rows} />
</TabStripPanel>
```
