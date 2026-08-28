# AccordionListTemplate · sidecar

## WHAT
FAQ / accordion list section shell. Composes LabelHeadingPair + `space-y-4` AccordionItem list + FAQContactCTA + optional JSON-LD FAQPage structured data.

## WHY
FAQ sections across report PDP chapters follow the same composition (CANON §2.3). Centralises spacing, contact-CTA placement, and JSON-LD boilerplate to prevent per-section drift.

## WHEN
- Report PDP FAQ section (section 26).
- Definitions section (section 7) — `showContactCTA={false}`.
- TOC reference section (section 25) — expandable chapter list.
- Any accordion-list context with optional "Still have questions?" footer.

## WHEN NOT
- Stepped methodology → use StepperPlusGridTemplate.
- Items need full-page modal expansion → custom organism.

## WHERE
`core-v2/src/templates/AccordionListTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | — | yes | Section anchor id |
| `background` | `'white' \| 'warm'` | `'white'` | no | Bg alternation |
| `label` | `string` | — | yes | Eyebrow label |
| `heading` | `string` | — | yes | h2 heading |
| `lede` | `string` | — | no | Optional lede paragraph |
| `items` | `AccordionListItem[]` | — | yes | Array of `{id, question, answer}` |
| `showContactCTA` | `boolean` | `true` | no | Show FAQContactCTA below list |
| `includeFaqJsonLd` | `boolean` | `false` | no | Inject JSON-LD FAQPage script inline |
| `className` | `string` | — | no | Extra className for SectionWrapper |

### AccordionListItem shape
```ts
{
  id: string;
  question: string;
  answer: ReactNode;
}
```

## Composition map

```
<SectionWrapper id background spacing="lg">
  <script? type="application/ld+json" />     // JSON-LD FAQPage (optional)
  <div mb-10 md:mb-12>
    <LabelHeadingPair label heading />
    <BodyText? />
  </div>
  <div role="list" space-y-4>               // ACCORDION LIST
    {items.map → <AccordionItem />}
  </div>
  <FAQContactCTA? mt-10 sm:mt-12 />         // CONTACT CTA (optional)
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--scroll-margin-section` (72px) | scroll-margin-top on section |
| `--section-header-mb` (40px) | mb-10 md:mb-12 |
| `--card-padding-md` (16px) | AccordionItem internal padding |
| `--border-default` | AccordionItem card border |

## A11y
- `role="list"` + `aria-labelledby` on accordion container.
- Each AccordionItem renders a `<button>` trigger + `aria-expanded` + `aria-controls` per WAI-ARIA Accordion pattern.
- JSON-LD adds structured FAQ data for search engines (screen reader neutral).
- `scroll-margin-top: 72px` prevents anchor hiding under navbar.

## Responsive
- `space-y-4` stack on all viewports.
- AccordionItem full-width, tap-friendly on mobile.

## Code example

```tsx
import { AccordionListTemplate } from '@kenresearch/design-system/templates';

<AccordionListTemplate
  id="faq"
  background="white"
  label="CHAPTER 26 · FAQ"
  heading="Frequently Asked Questions"
  lede="Common questions about this report."
  items={[
    { id: 'q1', question: 'What is the market size?', answer: 'USD 14.2B in 2023.' },
  ]}
  showContactCTA
  includeFaqJsonLd
/>
```
