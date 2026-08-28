# FilterChip

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/FilterChip.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — REWRITTEN · previous core-v2 version was display-only removal chip, not toggle chip)
**Status:** ready

## WHAT
Toggle pill for multi-select filter UI. Active/inactive states with optional result count. Pill-shaped with 44px touch target. Check icon + bold weight when active.

```
[inactive]: ○ Healthcare  (12)      ← white bg, muted text, no icon
[active]:   ✓ Healthcare  (12)      ← tinted bg, dark text, Check icon, bold
```

## WHY
Filter UIs need a distinct "selected" visual signal without full button weight. Inline toggle (active/inactive) is cleaner than add/remove pairs (fewer clicks, less cognitive load — Hick's Law). Centralized atom prevents per-feature reimplementation.

**Key distinction from previous core-v2 `FilterChip`:** Previous was a "dismiss chip" (display-only, had X button). Canonical source is a toggle chip (no X, has active/inactive state). These are different components. This is the toggle variant.

## WHEN
- Mobile filter sheets (MobileFilterSheet)
- Tag clouds and category quick-select bars
- Any multi-select context with visible option set

## WHEN NOT
- Active-filter "dismiss" display (showing current selections with X button) → use Badge or custom dismiss component
- Single-select radio-style → use FilterCheckbox in a group
- Navigation tabs → use a Tab component

## WHERE
FiltersPanel sidebar (desktop) · MobileFilterSheet (mobile) · ReportStoreHero tag cloud.

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | required | Display text of the option |
| `active` | `boolean` | required | Current selected state |
| `onToggle` | `() => void` | required | Fires on click or Enter/Space |
| `count` | `number|string` | — | Result count in muted micro-text |
| `disabled` | `boolean` | `false` | opacity-40, blocks interaction |
| `wrap` | `boolean` | `false` | Long phrase labels wrap to multiple lines (left-aligned) instead of truncating with an ellipsis. Leave off for short filter labels. |
| `className` | `string` | — | Additional classes |

### Tokens used
| Token | Why |
|---|---|
| `--text-xs` | Label font size (12.8px) |
| `--text-2xs` | Count micro-text (11px) |
| `--radius-element` | 5px corner radius for pill |
| `--font-weight-semibold` | 600 weight when active |
| `--font-weight-normal` | 400 weight when inactive |
| `--color-brand-red` | Focus ring |
| `--surface-text` | Active text color |

### A11y
`role="checkbox"` + `aria-checked={active}` — correct ARIA for a toggle without native checkbox.
`tabIndex={disabled ? -1 : 0}` — keyboard accessible.
Enter/Space triggers `onToggle` (matches native checkbox convention).
Focus-visible: 2px brand-red ring with 2px offset.
Check icon + font-weight change accompany color (not color alone — WCAG 1.4.1).
`count` gets `aria-label="${count} results"` for screen reader context.

### Motion
`transition-all duration-100` on bg/border/color. No transform. Color change is not motion.

### Responsive
`min-h-[40px]` on component. Parent responsible for 44px on mobile (padding or min-height on container).
Labels are single-line + ellipsis-truncated by default. When the label is a full phrase that must stay
readable at 390px (e.g. a survey option), pass `wrap` so it reflows to 2–3 lines instead of clipping.

### Code example
```tsx
const [selected, setSelected] = useState<string[]>([]);

const toggle = (val: string) =>
  setSelected(prev =>
    prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
  );

{industries.map(ind => (
  <FilterChip
    key={ind.id}
    label={ind.name}
    active={selected.includes(ind.id)}
    onToggle={() => toggle(ind.id)}
    count={ind.reportCount}
  />
))}
```
