# LogoButton

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/Header.tsx (logo region, lines 58-70)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED + focus ring updated to brand-red)
**Status:** ready

## WHAT
Clickable wrapper around the Ken logo. Accepts children (SVG logo or text+icon composition). Subtle hover: opacity-90 + scale 1.02. Focus-visible: 2px brand-red ring.

```
[ LogoButton ]
  [ children: KenLogo SVG or icon + text composition ]
   ↑ cursor-pointer, hover scale + opacity, brand-red focus ring
```

## WHY
Logo in nav must be tappable (returns to home) — semantic `<button>` not `<div>`. Logo SVG itself stays decorative; LogoButton owns the focus + click affordance. Composes children rather than hardcoding SVG → swap brand mark variants freely.

## WHEN
- First element of `<Navbar>` (every page header)
- Footer logo (returns to home from page bottom)
- Splash / login screens where logo doubles as home affordance

## WHEN NOT
- Decorative logo in marketing collateral → use raw SVG
- Embedded logo inside a Card → use plain SVG (nested click target)
- Email / static HTML contexts → button affordance is wrong

## WHERE
Navbar organism (primary nav bar, leftmost position).

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onClick` | `() => void` | required | Home navigation handler |
| `children` | `ReactNode` | required | Logo SVG or icon+text composition |
| `ariaLabel` | `string` | `'Ken Research Home'` | Text equivalent for logo graphic |

### Tokens used
| Token | Why |
|---|---|
| `--color-brand-red` | Focus ring color |

### A11y
`aria-label` (default "Ken Research Home") — logo is graphic, needs text equivalent.
Semantic `<button>` — Enter/Space activate.
Focus-visible: 2px brand-red ring with 2px offset.
Touch target: inherits Logo SVG size (consumer responsibility to ensure ≥44px on mobile via padding).

### Motion
200ms ease-out on opacity + transform. Reduced-motion handled at DS layer (global CSS).

### Code example
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// With SVG logo (preferred)
<LogoButton onClick={() => router.push('/')}>
  <KenResearchLogo width={120} height={28} />
</LogoButton>

// With icon + text composition (report-store-legacy pattern)
<LogoButton onClick={() => router.push('/')}>
  <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--color-brand-red)', borderRadius: 'var(--radius-element)' }}>
    <span className="text-white" style={{ fontSize: 'var(--text-sm)' }}>K</span>
  </div>
  <div className="flex flex-col ml-2.5">
    <span style={{ fontSize: 'var(--text-nav)' }}>Ken Research</span>
    <span className="uppercase tracking-[0.12em]" style={{ fontSize: '9px', color: 'rgba(0,0,0,0.4)' }}>Market Intelligence</span>
  </div>
</LogoButton>
```
