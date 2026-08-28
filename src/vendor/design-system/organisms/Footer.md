# Footer

**Tier:** organism
**Canonical source:** report-store-legacy/src/app/components/Footer.tsx (L42-204)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Dark bg-black footer with 4 regions:
1. TrustBar (ISO + Award + client logo pills) — separated by border-b
2. 5-col content grid: Brand col (2-col span, logo + description + contact) + Industries + Services + Company
3. Bottom bar: copyright (dynamic year) + Privacy/Terms links + LinkedIn/Twitter SVG icons

## WHY
Dark footer anchors the page visually (weight at base = stable composition). TrustBar at entry converts hesitant buyers on scroll-end. 5-col grid gives institutional breadth without clutter — matches enterprise research firm norms (FT/McKinsey/Gartner footer pattern). Social icons = organic reach capture.

## WHEN
Bottom of every Ken Research page. One per page. Full-width.

## WHEN NOT
Embedded iframes, print views, Storybook isolated testing.

## WHERE
After `<main>`, before `</body>`. Pairs with Navbar organism at top.

## HOW

**API:**
```tsx
interface FooterProps {
  industries?: string[];
  services?: string[];
  company?: string[];
  clientLogos?: string[];
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
  hrefBuilder?: (label: string) => string; // default () => '#'
}
```

**Tokens:**
- `--brand-red` · `--radius-element` — logo mark
- `--text-nav` · `--text-xs` — typography
- `--black-500` — contact icons
- `--font-weight-heading` — column headings
- `--container-page` — max-width wrapper

**A11y:**
- `<footer role="contentinfo">` landmark
- `<nav aria-label="[Heading] links">` per column (Industries/Services/Company)
- Social icons: `aria-label="Ken Research on LinkedIn"` / Twitter
- External links: `target="_blank" rel="noopener noreferrer"`
- Copyright: dynamic `new Date().getFullYear()` — client-rendered in 'use client'
- Focus-visible rings on all interactive elements

**Motion:** none

**Responsive:**
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-5`
- Brand col: `md:col-span-2`
- Bottom bar: `flex-col sm:flex-row`
- Content: mobile-stacks throughout

**Composed of:**
- TrustBar molecule (top trust band)
- Container atom (page-width wrapper)
- FooterLinkColumn (internal component, not exported separately)
