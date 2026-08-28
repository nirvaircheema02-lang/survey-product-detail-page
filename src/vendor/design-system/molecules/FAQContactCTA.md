# FAQContactCTA

**Tier:** molecule
**Canonical source:** `projects/V0_lite_report-legacy/src/app/components/FAQSection.tsx:127-139`
**Ported:** 2026-05-19 by aura-builder · Batch 3.2a
**Status:** ready

## WHAT

"Still have questions?" gradient card placed after a FAQ accordion list. Flex row on sm+, stacked mobile. Gradient bg via `--bg-card-takeaways`. Headline + sub-copy left, CTALink right.

```
┌────────────────────────────────────────────────────────┐
│  Still have questions?                  [Contact →]    │
│  Our research team is here to help you                 │
└────────────────────────────────────────────────────────┘
```

## WHY

After FAQ list, users who still have questions need a clear human escape hatch (Hick's Law — one obvious CTA). Gradient bg differentiates from accordion cards above (Gestalt figure-ground). Placed last = exit-intent capture.

## WHEN

- After any FAQ accordion list (FAQSection organism)
- After help-center Q&A lists
- After pricing page FAQs

## WHEN NOT

- Section-level CTA → use FinalCTASection organism
- At the TOP of a FAQ list — always after
- Inside an AccordionItem panel

## WHERE

- `core-v2/src/organisms/FAQSection.tsx`
- `core-v2/src/templates/AccordionListTemplate.tsx`

## HOW

### API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `headline` | `string` | no | `"Still have questions?"` | Main headline text |
| `subCopy` | `string` | no | `"Our research team is here to help you find the right solution"` | Supporting copy |
| `ctaLabel` | `string` | no | `"Contact Research Team"` | CTA link label |
| `ctaHref` | `string` | no | `"/contact"` | CTA destination |
| `className` | `string` | no | — | Extra className on root card |

### Tokens used

| Token | Value | Why |
|---|---|---|
| `--bg-card-takeaways` | gradient(135deg, rgba(243,244,255,0.5), rgba(250,250,250,0.3)) | Gradient bg per canon — differentiates from FAQ cards |
| `--radius-sm` | 10px | Card border-radius |
| `--text-sm` | 1rem (16px) | Headline font-size |
| `--text-compact` | 0.875rem (14px) | Sub-copy font-size |
| `--black-500` | #737373 | Sub-copy text color |

### A11y

- `<p>` for headline (not `<h3>` — card-level text, not page hierarchy)
- CTALink atom handles own a11y (focus ring, animated arrow aria-hidden)
- No role needed — static informational card

### Motion

None. CTALink arrow animation handled by CTALink atom (Framer, useReducedMotion-guarded).

### Responsive

- Mobile: flex-col, p-5
- sm+: flex-row, items-center, justify-between, p-8
- CTALink: flex-shrink-0 to prevent label wrap compression

### Code example

```tsx
import { FAQContactCTA } from '@ken-research/core-v2/molecules';

// After accordion list — canonical mt-10 sm:mt-12 spacing:
<div className="space-y-4">
  {faqs.map(faq => (
    <AccordionItem key={faq.id} id={`faq-${faq.id}`} question={faq.question} answer={faq.answer} />
  ))}
</div>
<div className="mt-10 sm:mt-12">
  <FAQContactCTA
    headline="Still have questions?"
    subCopy="Our research team is here to help"
    ctaLabel="Contact Research Team"
    ctaHref="/contact"
  />
</div>
```
