# CheckboxFilterSection

**Tier:** molecule
**Canonical source:** projects/report-store-legacy/src/app/components/FiltersPanel.tsx:48-154 (embedded CheckboxFilterSection)
**Ported:** 2026-05-19 by aura-builder · Batch 3.3d
**Status:** ready

## WHAT

Collapsible accordion filter section. Title + active-count badge + chevron toggle + optional search input + checkbox item list with count.

```
▼ INDUSTRY (3)
  □ Healthcare                    1,970
  ■ Technology & Telecom          1,270  ← checked: black fill + white check
  □ Banking & Financial Services  1,090
  □ Energy & Utilities            1,090
  ■ Consumer & Retail               870  ← checked
```

## WHY

Avoids duplicating the 80-line accordion+checkbox pattern for each filter category (Industry, Geography, Tags, Year). Miller's Law: grouping by category reduces cognitive load on dense filter panels.

## WHEN

Inside FiltersPanel organism (desktop sidebar) or MobileFilterSheet children for each filter category.

## WHEN NOT

- `FilterAccordion` molecule (full FilterChip row) for pill-style selections.
- Radio single-select → use FilterChip group.
- Full-screen sheet content (use FilterAccordion variant="sheet").

## WHERE

FiltersPanel organism · MobileFilterSheet children slot.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Section heading |
| `items` | `FilterItem[]` | — | `{name: string, count: number}[]` |
| `selected` | `string[]` | — | Currently selected item names |
| `onChange` | `(selected: string[]) => void` | — | Selection change handler |
| `searchable` | `boolean` | `false` | Show search input |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed |
| `showMoreThreshold` | `number` | `0` | 0 = no limit; N = show N items then "Show N more" |

### Tokens used

| Token | Usage |
|---|---|
| `--warm-500` | Section bottom border |
| `--warm-300` | Search input background |
| `--warm-700` | Unchecked checkbox border |
| `--text-primary` | Checked checkbox fill + active count badge bg |
| `--text-xs` | Label, count, search input font size |
| `--radius-element` | Item hover bg radius + search input radius |
| `--radius-inner` | Checkbox border-radius |
| `--font-weight-heading` | Section title weight |
| `--font-weight-medium` | Active count badge numeral |

### A11y

- Section header button: `aria-expanded` + `aria-controls`.
- Each item uses native `<input type="checkbox" className="sr-only">` for full a11y.
- Visual checkbox (`div`) is `aria-hidden`.
- Search input: `aria-label="Search {title}"`.

### Code example

```tsx
import { CheckboxFilterSection } from '@/molecules/CheckboxFilterSection';

<CheckboxFilterSection
  title="Industry"
  items={industryFilters}
  selected={selectedIndustries}
  onChange={setSelectedIndustries}
/>

<CheckboxFilterSection
  title="Tags"
  items={tagFilters}
  selected={selectedTags}
  onChange={setSelectedTags}
  searchable
  showMoreThreshold={8}
/>
```
