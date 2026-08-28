# MobileFilterBar

**Tier:** molecule
**Canonical source:** projects/report-store-legacy/src/app/components/MobileFilterBar.tsx:14-61
**Ported:** 2026-05-19 by aura-builder · Batch 3.3d
**Status:** ready

## WHAT

Fixed bottom pill bar that floats above page content on mobile. Shows a frosted-glass SlidersHorizontal button + optional filter-count badge. Triggers `MobileFilterSheet` on tap.

```
[fixed bottom center]
  ┌─────────────────────────┐
  │ ≡ Filters   [3]        │   ← frosted glass pill · z-1500
  └─────────────────────────┘
     safe-area-inset-bottom
```

## WHY

Persistent, thumb-reachable filter access on mobile. Frosted glass signals elevation above content (Fitts's Law: bottom-zone targets). Hides at `lg` breakpoint where desktop FiltersPanel sidebar is visible.

## WHEN

- Any Ken listing page with filters on mobile (`< lg` breakpoint).
- Pair with `MobileFilterSheet` for the sheet overlay.

## WHEN NOT

- `≥ lg` breakpoint — hidden by `lg:hidden`.
- Never inside a modal or sheet.
- Don't show if there are no available filters.

## WHERE

- Report Store listing page.
- Any future listing surface with sidebar filters.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `activeFilterCount` | `number` | — | Count of active filter dimensions; 0 = no badge |
| `onOpenFilters` | `() => void` | — | Opens MobileFilterSheet |

### Tokens used

| Token | Why |
|---|---|
| `var(--brand-red)` | Count badge background — canonical Ken red for active-state signaling |
| `var(--text-nav)` | Label font size |
| `var(--font-weight-medium)` | Count badge numeral weight |

### A11y

- `aria-label` updates to include active count ("Open filters, 3 active")
- `aria-haspopup="dialog"` — signals opens modal sheet
- `aria-live="polite"` on count badge — announces count change to SR
- 44px min-height touch target
- `active:scale-[0.97]` — tactile press feedback

### Motion

- `transition-transform active:scale-[0.97]` — native CSS, no JS animation.
- No Framer Motion — pill is always visible; animation lives in MobileFilterSheet slide-up.
- Reduced-motion: CSS transition only — no JS guard needed.

### Responsive

- `lg:hidden` — hidden at `≥lg`.
- `position: fixed` always — never reflows.
- `env(safe-area-inset-bottom)` — safe on iPhone notch.

### Code example

```tsx
import { MobileFilterBar } from '@/molecules/MobileFilterBar';
import { MobileFilterSheet } from '@/molecules/MobileFilterSheet';

const [sheetOpen, setSheetOpen] = useState(false);
const activeCount = selectedIndustries.length + selectedRegions.length;

<MobileFilterBar
  activeFilterCount={activeCount}
  onOpenFilters={() => setSheetOpen(true)}
/>
<MobileFilterSheet
  isOpen={sheetOpen}
  onClose={() => setSheetOpen(false)}
  activeCount={activeCount}
  resultCount={filteredReports.length}
  onClearAll={clearAllFilters}
>
  {/* Same FilterAccordion JSX as desktop sidebar */}
</MobileFilterSheet>
```
