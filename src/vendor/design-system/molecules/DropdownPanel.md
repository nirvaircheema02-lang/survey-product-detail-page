# DropdownPanel

**Tier:** molecule
**Canonical source:** report-store-legacy/src/app/components/Header.tsx Industries dropdown
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Positioned panel that renders below a trigger. Contains a 2-column grid of industry links. Glass background (`--glass-header-bg`) with backdrop blur. Closes on ESC, outside-click, or blur.

## WHY
Industries taxonomy is Ken Research's primary navigation dimension. A mega-menu grid gives scannable discovery without deep nesting (Miller's Law — 7±2 items per column). Outside-click + ESC follows ARIA APG disclosure-button pattern.

## WHEN
Inside Navbar · attached to Industries trigger button · lg+ viewports.

## WHEN NOT
Mobile nav (use MobileMenu stacked list). Single-item dropdowns (use plain `<select>`).

## WHERE
Navbar organism. Industries trigger only.

## HOW

**API:**
```tsx
interface DropdownPanelProps {
  items: string[];           // Industry labels
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: RefObject<HTMLElement | null>; // trigger ref for focus-return on ESC
  hrefBuilder?: (item: string) => string;   // default () => '#'
  className?: string;
}
```

**Tokens:**
- `--glass-header-bg` · `--glass-header-blur` — glass panel background
- `--rc-radius-card` / `--radius-element` — panel border radius
- `--text-nav` — item font size
- `--brand-red` — focus ring
- `--z-popover` — z-index (60)

**A11y:**
- `role="menu"` on panel · `role="menuitem"` on each link
- `aria-label="Industries navigation"` on panel
- ESC closes + returns focus to trigger via `anchorRef`
- Outside-click via `mousedown` listener
- Focus-trap: blur handler closes when focus leaves panel + trigger
- All items keyboard-focusable (native `<a>`)

**Motion:**
- Framer AnimatePresence · `opacity + y` on enter/exit
- `useReducedMotion()` guard: opacity-only when reduced

**Responsive:**
- lg+ only · consumer hides trigger on mobile (Navbar does this)
- Panel min-width: 320px (fits 7 items in 2 cols)
