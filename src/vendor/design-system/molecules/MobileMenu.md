# MobileMenu

**Tier:** molecule
**Canonical source:** report-store-legacy/src/app/components/Header.tsx (L163-191)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Full-screen slide-down overlay panel for mobile navigation. Contains stacked nav links (active state highlighted), Sign In button, and full-width brand Demo CTA. Closes on ESC or backdrop click. Body scroll locked while open.

## WHY
Mobile users need full-screen drawer — small targets in collapsed nav violate Fitts's Law. Slide-from-top motion is intuitive (matches source: the nav bar above). Framer AnimatePresence handles mount/unmount with reduced-motion guard.

## WHEN
Navbar mobile hamburger activates this. `lg:hidden` in Navbar chrome.

## WHEN NOT
Desktop lg+. Never nest inside another overlay or sheet.

## WHERE
Navbar organism · positioned below the sticky header band.

## HOW

**API:**
```tsx
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: MobileNavLink[];    // { label, href, active? }
  onSignIn?: () => void;
  onDemoRequest?: () => void;
  demoLabel?: string;           // default "Request a Demo"
}
```

**Tokens:**
- `--warm-500` — divider + border-top between nav + auth
- `--warm-300` — active link background
- `--text-nav` — nav link font size
- `--container-page` — inner max-width
- `--z-sticky` — z-index (20)
- `--brand-red` — focus ring on links

**A11y:**
- `role="dialog" aria-modal="true"` on panel
- `aria-label="Mobile navigation"` on panel
- First nav link ref-focused on open (50ms delay for animation settle)
- ESC closes menu
- Backdrop click closes menu
- Body scroll locked while open (restored on close / unmount)
- `aria-current="page"` on active nav link
- All touch targets ≥ 44px (py-2.5 on 16px line = ~40px + py padding)

**Motion:**
- Framer AnimatePresence
- Entry: `opacity 0→1 + y -16→0` · exit: `opacity 1→0 + y 0→-8`
- `useReducedMotion()` guard: opacity-only when reduced
- Backdrop: separate `opacity 0→1` with 200ms duration
