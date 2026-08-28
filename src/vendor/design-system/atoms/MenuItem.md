# MenuItem

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/Header.tsx (nav dropdown items, lines 115-128)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED · more advanced than canonical · danger/iconBg/subtitle added)
**Status:** ready

## WHAT
Popover/dropdown menu row. `<button role="menuitem">` with flex row: icon slot + label (+ optional subtitle). Two variants: default (neutral hover) and danger (red text + red hover bg for destructive actions).

```
[default]:  [ icon ] Label text
[danger]:   [ icon ] Label text    ← brand-red text + error bg hover
[iconBg]:   [■icon■] Label text    ← 32px tinted square wraps icon
[subtitle]: [ icon ] Label text
                     Subtitle muted
```

## WHY
Popovers need consistent row anatomy across AuthPopover, settings, context menus. Danger variant centralizes destructive-action styling (Sign out, Delete) — no per-menu overrides. `iconBg` adds visual hierarchy for primary vs tertiary rows. `role="menuitem"` is correct ARIA role inside `role="menu"` parent.

## WHEN
- AuthPopover rows (Sign in · Profile · Sign out)
- Settings dropdown options
- Context menus (Edit · Duplicate · Delete)
- Industries dropdown items in Navbar

## WHEN NOT
- Navigation list items in sidebar → `CategoryListItem` (count + chevron anatomy)
- Form select options → native `<select>`
- Multi-select filter rows → `FilterCheckboxItem`
- Inline button rows in a card → `Button variant="ghost"`

## WHERE
Navbar Industries dropdown · AuthPopover · any popover/dropdown menu.

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | required | Lucide icon or SVG (14px slot) |
| `label` | `string` | required | Primary row text |
| `subtitle` | `string` | — | Muted 10px text below label |
| `onClick` | `() => void` | required | Action handler |
| `danger` | `boolean` | `false` | Red text + error bg hover (destructive) |
| `iconBg` | `boolean` | `false` | Wraps icon in 32px tinted square |
| `minHeight` | `number` | `40` | Minimum tap target height in px (set 44 on mobile) |

### Tokens used
| Token | Why |
|---|---|
| `--semantic-status-error-bg` | Danger variant hover bg |
| `--color-ramp-black-50` | Default hover bg |
| `--color-ramp-black-100` | Default active bg + iconBg fill |
| `--color-brand-red` | Danger text + icon color + focus ring |
| `--surface-text` | Default text color |
| `--surface-text-muted` | Default icon color |
| `--surface-text-subtle` | Subtitle muted text |
| `--typography-family-body` | Font family on text |

### A11y
`role="menuitem"` + semantic `<button>`. Keyboard activatable.
Parent MUST wrap in `role="menu"` with roving tabindex for arrow-key navigation.
Touch target: `minHeight` prop (40 default; set 44 on mobile via prop).
Danger variant: brand-red ≥4.5:1 contrast on light bg — verified.
Focus-visible: 2px brand-red ring.

### Motion
`transition-colors` only. No transform. Reduced-motion neutral (color change is not motion).

### Code example
```tsx
// Wrap in role="menu" container
<div role="menu" aria-label="Account menu" className="bg-white shadow-lg rounded-[10px] p-1">
  <MenuItem icon={<User size={14} />} label="Profile" onClick={openProfile} />
  <MenuItem
    icon={<Settings size={14} />}
    label="Settings"
    subtitle="Preferences & billing"
    onClick={openSettings}
    iconBg
  />
  <Divider variant="subtle" />
  <MenuItem icon={<LogOut size={14} />} label="Sign out" danger onClick={signOut} />
</div>

// Industries dropdown (no icon, no iconBg — simpler flat pattern)
<MenuItem icon={<ArrowRight size={12} />} label="Healthcare" onClick={() => navigate('/industries/healthcare')} />
```
