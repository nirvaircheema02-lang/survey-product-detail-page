# HamburgerIcon

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/Header.tsx (hamburger toggle, lines 148-159)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED · matches canonical · no changes needed)
**Status:** ready

## WHAT
Animated 3-bar hamburger ↔ X morph for mobile nav toggle. `isOpen=false` → 3 horizontal bars. `isOpen=true` → bar1 rotates 45°, bar2 fades out, bar3 rotates -45°, forming X.

```
[closed]: ———         [open]:  \
           ———                  ✕
           ———                 /
```

## WHY
Universal mobile menu affordance. Bars→X morph signals state change without text label. In-component animation prevents each consumer rebuilding the 3-bar transform math. Pure CSS transforms keep the icon lightweight.

## WHEN
- Mobile hamburger button inside `<Navbar>` (default usage)
- Off-canvas drawer toggle
- Any sm/md viewport menu trigger that swaps to a panel

## WHEN NOT
- Desktop nav (full menu visible, no need)
- Tab triggers → `DropdownChevron`
- "More options" overflow menu → Lucide `MoreHorizontal`
- Close-only icons → Lucide `X` (no morph needed)

## WHERE
Navbar organism, mobile breakpoint (`lg:hidden`).

## HOW

### API

| Prop | Type | Notes |
|---|---|---|
| `isOpen` | `boolean` | Controls bar morphing state |

### Tokens used
| Token | Why |
|---|---|
| `--color-foundation-black` | Bar fill color |

### A11y
`aria-hidden="true"` on root div — decorative icon.
Parent button MUST provide:
- `aria-label` that swaps: "Open menu" / "Close menu"
- `aria-expanded={isOpen}`
- `aria-controls="mobile-menu"` pointing to the menu element
Touch target: parent button's padding (min 44×44px on mobile).

### Motion
300ms ease-out on each bar's transform + opacity + scale. CSS class toggle (no JS animation library). Reduced-motion handled at DS layer.

### Code example
```tsx
const [open, setOpen] = useState(false);

<button
  onClick={() => setOpen(!open)}
  aria-expanded={open}
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-controls="mobile-menu"
  className="lg:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-black/[0.03]"
>
  <HamburgerIcon isOpen={open} />
</button>

<div id="mobile-menu" className={open ? 'block' : 'hidden'}>
  {/* mobile nav content */}
</div>
```
