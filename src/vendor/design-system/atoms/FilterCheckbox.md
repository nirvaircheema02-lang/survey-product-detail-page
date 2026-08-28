# FilterCheckbox

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/FilterCheckbox.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — REWRITTEN · previous core-v2 version missing custom checkbox box visual)
**Status:** ready

## WHAT
Custom 16×16 checkbox row for filter panel selections. Label + optional count. Visual states: default (white box / inset shadow) → checked (filled / white Check icon). Selected row gets 2px left-border accent and tinted bg.

```
[unchecked]: □ Healthcare           12
[checked]:   ■ Healthcare           12
             ↑ 2px left border      ↑ count pill bg when checked
```

## WHY
Native `<input type="checkbox">` cannot be styled consistently cross-browser without hacks. Custom 16×16 box gives pixel-perfect control: inset shadow at rest (depth cue), filled + Check icon when checked (Ken's canonical filter pattern). `div[role="checkbox"]` exposes correct ARIA semantics with full style control.

**Key difference from previous core-v2 `FilterCheckbox`:** Previous version was a plain button with no custom checkbox box rendering (just text + count). Canonical source has a visual 16×16 box with inset shadow and Check icon. Rewritten to match.

## WHEN
- Inside FilterPanel accordion groups (Industry / Format / Region / Tags / Years)
- Any multi-select list where individual option rows need clear checked/unchecked state

## WHEN NOT
- Pill/tag multi-select → `FilterChip` (toggle without checkbox anatomy)
- Settings toggles → native checkbox or shadcn Switch
- Single-select radio-style → native `<input type="radio">` or shadcn RadioGroup

## WHERE
FiltersPanel (desktop aside) · MobileFilterSheet (full-screen sheet).

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | Display text of the filter option |
| `checked` | `boolean` | required | Current checked state |
| `onToggle` | `() => void` | required | Fires on click or Enter/Space |
| `count` | `number|string` | — | Result count in muted micro-text; pill bg when checked |
| `indented` | `boolean` | `false` | 28px left-padding for sub-category rows |
| `disabled` | `boolean` | `false` | opacity-40, blocks interaction |
| `className` | `string` | — | Additional classes |

### Tokens used
| Token | Why |
|---|---|
| `--text-xs` | Label font size (12.8px) |
| `--text-2xs` | Count micro-text (11px) |
| `--radius-inner` | 2.5px corner on checkbox box (= --radius-2xs) |
| `--surface-text` | Filled checkbox bg + border when checked |
| `--color-brand-red` | Focus ring |

### A11y
`role="checkbox"` + `aria-checked={checked}` + `aria-disabled={disabled}` on outer div.
`tabIndex={disabled ? -1 : 0}` — keyboard accessible.
Enter/Space triggers `onToggle` (matches native checkbox convention).
Focus-visible: 2px brand-red ring at 1px offset.
Custom checkbox box: `aria-hidden="true"` (decorative within labeled row).
Check icon: `aria-hidden="true"` (state conveyed by aria-checked).
`count` gets `aria-label="${count} results"` for screen reader context.
Color + icon together convey checked state (not color alone — WCAG 1.4.1).

### Motion
`transition-all duration-150` on checkbox box. `transition-colors duration-100` on row.
mouseEnter/Leave updates row bg inline for hover state (avoids CSS class conflict with checked state).

### Responsive
Row is `w-full` by default — fills parent column width. Padding: 6px 16px (or 28px when indented).

### Code example
```tsx
const [checkedIds, setCheckedIds] = useState<string[]>([]);

const toggle = (id: string) =>
  setCheckedIds(prev =>
    prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
  );

// Main industry
<FilterCheckbox
  label="Healthcare"
  checked={checkedIds.includes('healthcare')}
  onToggle={() => toggle('healthcare')}
  count={142}
/>

// Sub-category (indented)
<FilterCheckbox
  label="Pharmaceuticals"
  checked={checkedIds.includes('pharma')}
  onToggle={() => toggle('pharma')}
  count={38}
  indented
/>
```
