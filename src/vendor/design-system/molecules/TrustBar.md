# TrustBar

**Tier:** molecule
**Canonical source:** report-store-legacy/src/app/components/Footer.tsx (L42-68)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Horizontal strip with two trust badges (Shield ISO + Award rating) on the left, and a horizontally-scrollable set of client name pills on the right. Purely presentational.

## WHY
Social proof at the fold-line reduces bounce. ISO 27001 + "Top 10 Global Research Firm" credentialize enterprise buyers (Cialdini authority + social-proof heuristics). Horizontal scroll on mobile avoids wrap that makes the strip look sparse.

## WHEN
Top of Footer organism. Optionally reusable inside AssociationStrip or trust-signal sections.

## WHEN NOT
Above-the-fold hero (too many trust signals dilute hierarchy). Any position where it would compete with the primary CTA.

## WHERE
Footer organism top trust band. Optionally AssociationStrip.

## HOW

**API:**
```tsx
interface TrustBarProps {
  clientLogos?: string[];     // default: ['Fortune 500', 'McKinsey', 'Deloitte', 'BCG', 'KPMG']
  onDark?: boolean;           // dark surface color adjustments
  isoLabel?: string;          // default "ISO 27001 Certified"
  awardLabel?: string;        // default "Top 10 Global Research Firm"
  trustedByLabel?: string;    // default "Trusted by:"
  className?: string;
}
```

**Tokens:**
- `--radius-element` — pill border radius
- `--text-xs` — all text sizes
- `--black-400` / rgba(255,255,255,0.30) — icon color (light/dark)
- `--black-200` / rgba(255,255,255,0.10) — divider
- `--black-500` / rgba(255,255,255,0.40) — text

**A11y:**
- Decorative icons: `aria-hidden="true"` on Shield + Award
- Client logos: rendered as `<span>` (not interactive — presentational)
- `role` not needed (no interactive elements)

**Motion:** none

**Responsive:**
- `flex-col sm:flex-row` — stacks on mobile, row on sm+
- Client pills: `overflow-x-auto sm:overflow-visible` — scroll on mobile, wrap on sm+
- `scrollbarWidth: none` — hides scrollbar on pill row (Webkit scrollbar hidden via Tailwind `[scrollbar:hidden]` equivalent)
