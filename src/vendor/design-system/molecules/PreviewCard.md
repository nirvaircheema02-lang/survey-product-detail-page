# PreviewCard

**Tier:** molecule
**Canonical source:** V0_lite_report-legacy/src/app/components/HeroSection.tsx right preview region (L426-577)
**Ported:** 2026-05-19 by aura-builder (Batch 3.3b)
**Status:** ready

## WHAT
Glass card (rounded-[10px], backdrop-blur, border) showing a report preview: WindowControls + chapter label + section title + body excerpt + mini bar-chart + PaywallOverlay on the lower region. Consumer controls `onExpand` to open a full preview modal.

## WHY
The preview card converts abstract "market report" into tangible content at a glance. The paywall overlay creates desire-loop (Fogg motivation) — show enough to create wanting, lock the rest. 10px radius is Ken DS card standard (ANTI-PATTERNS rule 32).

## WHEN
Inside ReportHeroSection right column · desktop lg+ only.

## WHEN NOT
Light editorial surfaces without `surface="light"`. Full-page PDF renders. On mobile (ReportHeroSection hides right col on mobile).

## WHERE
ReportHeroSection organism right side.

## HOW

**API:**
```tsx
interface PreviewCardProps {
  chapterLabel?: string;     // default "Chapter 2"
  sectionTitle?: string;     // default "Market Overview & Definition"
  bodyExcerpt?: string;      // default excerpt text
  surface?: 'dark' | 'light'; // default 'dark'
  onExpand?: () => void;     // expand button click
  paywallLabel?: string;     // default "Unlock Full Report"
  onPaywallCTA?: () => void; // paywall CTA click
  className?: string;
}
```

**Tokens:**
- `--card-padding-lg` (1.5rem) — card padding
- `--radius-element` — inner rounded elements (5px)
- `--text-xs` — label/body font size
- `--text-sm` — section title font size
- `--brand-red` — focus ring on expand button

**A11y:**
- Mini chart: `role="img" aria-label="Mini bar chart placeholder"`
- Expand button: `aria-label="Expand report preview"`
- PaywallOverlay wraps locked content with `role="status"` + aria-label
- `aria-hidden="true"` on all decorative chart elements

**Motion:**
- Card: `whileHover scale(1.015) + box-shadow` — 250ms ease-out-expo
- Expand button: `whileHover scale(1.1) whileTap scale(0.95)`
- Internal content: Framer animate on mount (excerpt + chart lines)

**Responsive:**
- ReportHeroSection hides right col on mobile (`hidden lg:block`)
- Card itself has no internal responsive logic (fixed width within parent)
