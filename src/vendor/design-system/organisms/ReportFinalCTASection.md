# ReportFinalCTASection

**Layer:** Organism · Tier 3
**Promoted from:** `projects/V0_lite_report-legacy/src/app/components/CTASection.tsx` (email-capture pattern)
**Ported:** 2026-05-20 · Stage 4d · aura-builder

---

## WHY

Report PDPs close with a red-gradient surface + inline email-capture form — a distinct conversion pattern from `FinalCTASection` (case-study · light surface · ContactModal trigger). Sharing one organism would require so many `if (isReport)` forks that the component loses contract clarity. Distinct organism is the correct split per `report-pdp-anatomy.md L144–150` + `CTABanner.md L37`.

Red-gradient inversion (brand-red → red-700 diagonal) signals premium urgency at scroll terminus — no other section in the PDP uses this background, making it unambiguous as the "last chance" CTA zone.

## WHAT

- Three `background` variants:
  - `red-gradient` (DEFAULT) — brand-red → red-700 diagonal · white text · floating Framer orbs
  - `cinematic-dark` — bg-pure-black · white text · brand-red-tinted orbs
  - `white` — warm-300 editorial bg · black text · no orbs
- Content stack: SectionLabel eyebrow → h2 serif heading → lede p → form (email input + primary CTA + optional secondary CTA) → trust line p
- Button on dark/red: variant="ghost" background="dark" (white outline · white text) — Option B per R4.1.14
- Button on white: variant="brand" + variant="secondary"
- Orbs: motion.div scale/opacity pulse · suppressed by useReducedMotion()
- Email state: controlled → onSubmit → success confirmation replaces form

## WHEN

- Bottom of every /reports/<slug> PDP — final conversion section
- Any page needing inline email-capture form with premium visual closure

## WHEN NOT

- Case-study finale → FinalCTASection (light surface + ContactModal)
- Mid-page banner → CTABanner
- Floating/sticky bar → StickyCTA

## WHERE

- projects/v1-project/v1-product-page-ver0.3/src/components/sections/FinalCTABlock.tsx (consumer, Stage 4d)
- Future: all projects/*/src/app/reports/[slug]/page.tsx pages

## HOW

```tsx
<ReportFinalCTASection
  heading="Unlock the Full Australia Cold Chain Logistics Report"
  lede="186 pages · 47 data tables · analyst-verified forecasts to 2030."
  background="red-gradient"
  onSubmit={(email) => console.log('[lead]', email)}
  secondaryLabel="Talk to an Analyst"
  onSecondaryClick={() => window.open('/contact', '_blank')}
/>
```

## A11y

- form with noValidate; type="email" required signals type to AT
- Email input: sr-only label + aria-label + aria-describedby pointing to trust line
- Submit button: ariaLabel="Submit email to download sample report"
- Success p role="status" announces confirmation to screen readers
- Orbs: aria-hidden="true" — decorative

## Motion

- Orbs: motion.div scale+opacity animate (8s/10s loop) · useReducedMotion() suppresses
- No page-entrance animation (consuming page's scroll-driven layer owns that)

## Token exceptions

- background: linear-gradient(135deg, var(--brand-red) 0%, var(--red-700) 100%) — deliberate R1.2 exception.
  red-gradient is the highest-urgency CTA slot on the report PDP; red is functional conversion urgency,
  not decorative (report-pdp-anatomy.md L144–150).

## Anti-patterns

- Do NOT use FinalCTASection for report PDP — wrong surface + modal trigger mismatch
- Do NOT add variant="primary" on red-gradient/cinematic — red button on red bg fails contrast
- Do NOT suppress orbs via className — use background="white" instead
