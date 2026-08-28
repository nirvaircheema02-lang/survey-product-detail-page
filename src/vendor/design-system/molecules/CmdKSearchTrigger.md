# CmdKSearchTrigger

**Tier:** molecule
**Canonical source:** report-store-legacy/src/app/components/Header.tsx search button (L134-139)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Button-shaped trigger: Search icon + placeholder text + ⌘K keyboard hint. Clicking calls `onOpen`. This component is TRIGGER ONLY — it does not implement the command palette.

## WHY
Separating trigger from command palette means DS ships the chrome piece without mandating a specific cmdk library. Consumer can wire shadcn/cmdk, kbar, or custom. The `aria-keyshortcuts` attribute surfaces the shortcut to assistive technologies.

## WHEN
Inside Navbar right-action cluster · lg+ (hidden on mobile via `hidden lg:flex`).

## WHEN NOT
Mobile (minimal affordance — global search goes in mobile menu as full-width input). Outside Navbar without careful layout consideration.

## WHERE
Navbar organism right cluster.

## HOW

**API:**
```tsx
interface CmdKSearchTriggerProps {
  onOpen: () => void;           // called when trigger clicked
  placeholder?: string;         // default "Search reports…"
  showKbdHint?: boolean;        // default true — shows ⌘K kbd element
  className?: string;
}
```

**Tokens:**
- `--text-nav` — button font size
- `--warm-500` / `--warm-300` — kbd hint border/bg
- `--text-2xs` / `--text-xs` — kbd sizes
- `--brand-red` — focus ring

**A11y:**
- `aria-label="Open search (Command K)"`
- `aria-keyshortcuts="Meta+k"` — surfaces shortcut to AT
- `<kbd>` element with `aria-hidden="true"` (decorative hint)
- focus-visible ring 2px brand-red
- Touch target h-8 (32px) — consumer must ensure keyboard open is 44px in parent

**Motion:** none — trigger only

**Responsive:**
- `hidden lg:flex` — not rendered on mobile/tablet
- Placeholder text hidden below xl via `hidden xl:inline`
