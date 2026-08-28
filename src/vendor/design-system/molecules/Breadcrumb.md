# Breadcrumb

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/Breadcrumb.tsx
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
Accessible breadcrumb navigation: `<nav aria-label="Breadcrumb"> <ol>`.
ChevronRight separators between levels. Last item gets `aria-current="page"`.
Optional dropdown on last item shows sibling + child columns (AnimatePresence panel).

```
Home  >  Healthcare  >  AI in Healthcare  >  Market Analysis [v]
                                                              └─ siblings dropdown
```

## WHY
V0_lite uses breadcrumb on every report PDP hero. The dropdown lets users jump to
sibling categories without going back — reduces navigation friction.
Nielsen #6 Recognition over recall — breadcrumb makes current position visible.

## WHEN
Any page with 2+ levels of hierarchy: report PDP, case-study, category listing, search result.

## WHEN NOT
- Tab navigation → StepperHorizontal.
- Sidebar TOC → TableOfContentsSidebar organism.
- Step indicators → StepperHorizontal.

## WHERE
HeroSection top (above h1) · listing page header · case-study page header.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `levels` | `BreadcrumbLevel[]` | — | Ordered nav levels |
| `colorScheme` | `'light' \| 'dark'` | `'dark'` | Text colour adaptation |
| `className` | `string` | — | Root nav className |

`BreadcrumbLevel`: `{ label, href, dropdownLabel?, siblings?: BreadcrumbItem[], children?: { dropdownLabel, items } }`

### Tokens used
- `--text-nav-helper` (13px) for crumb text
- `--tracking-nav` (0.62px) letter-spacing
- `--radius-xs` (5px) for dropdown items + caret button
- `--radius-md` (15px) for dropdown panel
- `--brand-red` for active dropdown items + caret icon fill
- `--z-dropdown` for panel z-index
- `--black-200` for panel border + column divider

### A11y
- `<nav aria-label="Breadcrumb">` landmark
- `<ol><li>` ordered list
- Last item: `aria-current="page"`
- Dropdown button: `aria-expanded`, `aria-haspopup="listbox"`, `aria-label`
- Dropdown closes: Escape key + click-outside
- All interactive: keyboard-reachable (tab + enter)
- Focus rings: `focus-visible:outline` on all links + buttons

### Motion
- Framer AnimatePresence dropdown: opacity + y(-4→0) + scale(0.98→1)
- `useReducedMotion()` guard: instant appear/disappear when reduced

### Code example
```tsx
<Breadcrumb
  levels={[
    { label: 'Home', href: '/' },
    {
      label: 'Healthcare',
      href: '/industries/healthcare',
      dropdownLabel: 'Browse industries',
      siblings: [
        { label: 'Technology', href: '/industries/technology' },
        { label: 'Healthcare', href: '/industries/healthcare', active: true },
      ],
    },
    { label: 'AI in Healthcare Market Analysis', href: '/report/ai-healthcare' },
  ]}
  colorScheme="dark"
/>
```
