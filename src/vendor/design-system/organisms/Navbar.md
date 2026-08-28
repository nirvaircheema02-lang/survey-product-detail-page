# Navbar

**Tier:** organism
**Canonical source:** report-store-legacy/src/app/components/Header.tsx (L30-195)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Two-band sticky header organism:
1. Utility bar (h-8, bg-black, lg+ only) — trust tagline left, phone + email right
2. Glass header (h-56px, backdrop-blur, sticky top-0) — logo, 4 nav links, Industries DropdownPanel, CmdKSearchTrigger, Sign In, Demo CTA, HamburgerIcon, MobileMenu slide-down

## WHY
Dual-band pattern matches report-store canonical. Utility bar handles trust/contact at minimal cost. Glass header maintains content visibility through scroll. Active nav underline uses neutral black — ANTI-PATTERNS rule 19: brand-red on nav active states banned, use only for CTAs.

## WHEN
Top of every Ken Research page. One per page. Always sticky.

## WHEN NOT
Embedded iframes, print views, pages that already use CaseStudyNavbar.

## WHERE
Above `<main>` content. Below SkipLink.

## HOW

**API:**
```tsx
interface NavbarProps {
  activeHref?: string;            // default "/" — used to mark active nav link
  navLinks?: MobileNavLink[];     // default: Report Store / Insights / Survey / Consulting
  industries?: string[];          // default: 8 industries
  onSearchOpen?: () => void;      // wire to command palette
  onSignIn?: () => void;
  onDemoRequest?: () => void;
  demoLabel?: string;             // default "Request a Demo"
  industryHref?: (industry: string) => string; // default () => '#'
  phone?: string;
  email?: string;
  tagline?: string;
  className?: string;
}
```

**Tokens:**
- `--glass-header-bg` · `--glass-header-blur` — sticky header background
- `--z-sticky` (20) — header z-index
- `--text-nav` · `--text-2xs` — nav and utility bar font sizes
- `--warm-500` — dividers
- `--brand-red` — Demo CTA (CTA-only, rule 19)
- `--radius-element` — rounded elements

**A11y:**
- `<header>` landmark (implicit role="banner")
- `<nav aria-label="Primary navigation">` on desktop nav
- `aria-current="page"` on active link
- `aria-haspopup="menu" aria-expanded` on Industries trigger
- `aria-label` on hamburger button (changes with state)
- MobileMenu: `role="dialog" aria-modal="true"`
- All touch targets ≥ 44px

**Motion:**
- DropdownPanel: Framer AnimatePresence (see DropdownPanel.md)
- MobileMenu: Framer AnimatePresence slide-down (see MobileMenu.md)
- Reduced-motion handled in child molecules

**Responsive:**
- Utility bar: `hidden lg:block`
- Desktop nav: `hidden lg:flex`
- Search trigger: `hidden lg:flex`
- Sign In button: `hidden sm:flex`
- Demo CTA: `hidden md:inline-flex`
- Hamburger: `lg:hidden`
