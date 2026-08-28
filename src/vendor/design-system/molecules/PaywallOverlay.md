# PaywallOverlay

**Tier:** molecule
**Canonical source:** V0_lite_report-legacy/src/app/components/HeroSection.tsx premium overlay (L526-573)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
A position:relative container. Renders `children` with CSS blur + pointer-events-none. An absolute overlay shows a PREMIUM Badge + CTA Button centered. Reusable across any locked-content region.

## WHY
Paywall UI is a recurring pattern across report PDP (charts, tables, sections). A single molecule ensures consistent lock-state visual language: blur amount, badge variant, CTA size, and positioning are all standardized. Separating blur-children from overlay avoids re-implementing in every organism.

## WHEN
Any locked/premium content block — chart cards, data tables, section previews, PreviewCard lower region.

## WHEN NOT
Full-page auth gates (use a modal/page). When content is actually unlocked. When blur would cause accessibility issues (ensure screen-reader content is still accessible via aria-hidden on blurred region).

## WHERE
PreviewCard · ChartCard (locked variant) · DatasetPreviewTable paywall row · RegionalComparison locked view.

## HOW

**API:**
```tsx
interface PaywallOverlayProps {
  children: React.ReactNode;     // content to blur (gets aria-hidden)
  onCTA?: () => void;            // CTA button click
  ctaLabel?: string;             // default "Unlock Full Report"
  badgeLabel?: string;           // default "PREMIUM"
  surface?: 'dark' | 'light';   // default 'dark'
  blurPx?: number;               // default 4
  showCTA?: boolean;             // default true
  className?: string;
}
```

**Tokens:**
- Overlays via rgba — no specific token (glass values appropriate but not mandated)
- Badge: `theme="neutral" mode="dark|light"` per surface

**A11y:**
- Blurred children: `aria-hidden="true"` via `pointer-events-none` (AT users still see DOM — add `aria-hidden` on children in consumer if content is purely visual)
- Overlay: `role="status" aria-label="PREMIUM content — Unlock Full Report to access"`
- CTA Button: accessible via normal Button atom a11y
- Crown icon: `aria-hidden="true"`

**Motion:** none (static overlay)

**Responsive:**
- Inherits border-radius from parent via `borderRadius: inherit`
- Overlay: `absolute inset-0` — covers full parent bounds
