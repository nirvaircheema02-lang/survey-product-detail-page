# LabelHeadingPair

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx:70-83 · recurring 10 places
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
Canonical section-header composition block: SectionLabel (eyebrow) + SectionHeading (h2) + optional BodyText (lede).
Enforces SPACING-COMPOSITION-LAYOUT-CANON §1.4 inter-element spacing.

```
[CHAPTER 11 - OUR APPROACH]   ← SectionLabel (brand-red, uppercase, tracked)
Research Methodology           ← SectionHeading level=2 (Noto Serif, font-light)
Our multi-layered approach...  ← BodyText (optional, max-w-[50rem])
```

## WHY
V0_lite uses this exact block in 10+ places with the same spacing rhythm. Extracting prevents drift.
Law of Pragnanz — heading block as a single unit reduces cognitive overhead for consumers.

## WHEN
Any section needing eyebrow + h2 + optional lede. Chapter headers, section intros, FAQ headers, CTA headers.

## WHEN NOT
- No eyebrow needed → use `SectionHeading` directly.
- Card title → use native h3.
- Inside V0.2 `SectionHeader` atom context → they compose the same block already.

## WHERE
Every chapter section template · HeroSection left-column · FAQSection · KeyStatsStrip · MethodologySection.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Eyebrow text (e.g. "CHAPTER 11 - OUR APPROACH") |
| `heading` | `ReactNode` | — | Section heading content |
| `lede` | `string` | `undefined` | Optional lede paragraph |
| `ledeMaxWidth` | `string` | `'max-w-[50rem]'` | Tailwind max-w class for lede |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Alignment |
| `background` | `'light' \| 'dark'` | `'light'` | SectionLabel surface token pair |
| `labelVariant` | `'default' \| 'accent'` | `'accent'` | SectionLabel color variant |
| `headingLevel` | `1 \| 2 \| 3` | `2` | Semantic heading level |
| `className` | `string` | — | Root wrapper className |

### Tokens used
- `--pair-label-heading` (12px) · via mb-3 on label wrapper
- `--pair-heading-description` (16px) · via mb-4 on heading when lede follows
- SectionLabel: `--brand-red`, `--tracking-label-x-wide`, `--text-xs`
- SectionHeading: `--font-display`, `--font-weight-light`, `--tracking-display-tight`
- BodyText: `--text-sm`, `--black-500`, `--leading-relaxed`

### A11y
- SectionLabel renders as `<p>` (text style) or `<div>` (pill) — no heading role
- SectionHeading renders semantic `<h1|h2|h3>` — correct landmark order
- BodyText renders `<p>` — plain reading order

### Code example
```tsx
<LabelHeadingPair
  label="CHAPTER 11 - OUR APPROACH"
  heading="Research Methodology"
  lede="Our multi-layered approach combines rigorous desk research with primary data collection."
  ledeMaxWidth="max-w-[50rem]"
/>
```
