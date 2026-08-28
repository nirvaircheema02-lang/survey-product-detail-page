# ChapterSectionTemplate · sidecar

## WHAT
Composition shell for a standard chapter section on a report PDP or case-study page.
Renders SectionWrapper → inner header block (LabelHeadingPair + optional BodyText lede) → content slot → optional CTA slot.

## WHY
Every chapter section follows the same recipe (SPACING-COMPOSITION-LAYOUT-CANON §2.1):
eyebrow → heading → lede → mb-10/12 → content → optional CTA.
Centralising this removes per-section drift (Cat 4.2 / 4.3 / 4.4 anti-patterns).

## WHEN
- Default template for ALL chapter sections in the V1 Product Page (sections 3–27).
- Any long-form section following the standard header + content pattern.
- Case-study chapter organisms that need consistent vertical rhythm.

## WHEN NOT
- Do NOT use for Hero sections (use HeroCinematicTemplate or HeroEditorialTemplate).
- Do NOT use for KeyStatsStrip (no header block needed).
- Do NOT use when the organism already owns its SectionWrapper (would double-wrap — Cat 4.5).

## WHERE
`core-v2/src/templates/ChapterSectionTemplate.tsx`

Consumed by: V1 Product Page sections 3–27, case-study chapter templates.

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | — | yes | Anchor id + scroll-margin-top target for TOC |
| `background` | `'white' \| 'warm' \| 'black'` | `'white'` | no | Section bg, alternate per recipe |
| `label` | `string` | — | yes | Eyebrow label text (e.g. `"CHAPTER 08 · MARKET OVERVIEW"`) |
| `heading` | `string` | — | yes | h2 heading text |
| `headingId` | `string` | `${id}-heading` | no | id forwarded to heading for aria-labelledby |
| `lede` | `string` | — | no | Short descriptive paragraph below heading |
| `content` | `ReactNode` | — | yes | Main content slot — organism, chart, grid, etc. |
| `cta` | `ReactNode` | — | no | Optional CTA rendered below content (CTALink typical) |
| `className` | `string` | — | no | Extra className for SectionWrapper |

## Composition map

```
<SectionWrapper id background spacing="lg" maxWidth="wide">
  <div mb-10 md:mb-12>                          // SECTION HEADER BLOCK
    <LabelHeadingPair label heading headingId />
    <BodyText? spacing="follow" max-w-prose />
  </div>
  <div data-slot="content">                     // CONTENT SLOT
    {content}
  </div>
  <div? mt-8 md:mt-10 data-slot="cta">         // OPTIONAL CTA
    {cta}
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where used |
|---|---|
| `--scroll-margin-section` (72px) | `scroll-margin-top` on section element |
| `--section-header-mb` (40px) | `mb-10 md:mb-12` on header block |
| `--color-ramp-warm-300` | background="warm" via SectionWrapper |
| `--pair-label-heading` (12px) | gap between label and heading — internal to LabelHeadingPair |
| `--pair-heading-description` (16px) | gap between heading and lede — internal to LabelHeadingPair |

## A11y
- Section `id` enables anchor navigation from TOC sidebar (via `<a href="#${id}">`) and browser URL fragment.
- `scroll-margin-top: 72px` prevents content hiding under sticky navbar on anchor scroll.
- `headingId` links to section heading — allows aria-labelledby from TOC links for screen readers.
- Heading level always h2 (via LabelHeadingPair) — correct document outline in chapter context.
- Content slot inherits a11y from composed organism.

## Responsive
- Mobile: single column, full padding, spacing scaled down.
- Desktop: spacing "lg" = py-12 md:py-20. Header mb-10 → md:mb-12.
- `max-w-prose` lede constrained to ~65ch for readability.

## Bg alternation
Per v1-product-page recipe (§ Bg alternation):
- Odd sections: `background="white"`
- Even sections: `background="warm"`
- Cinematic (hero + optional FinalCTA): `background="mesh"` — NOT this template.

## Code example

```tsx
import { ChapterSectionTemplate } from '@kenresearch/design-system/templates';
import { MarketOverview } from '@kenresearch/design-system/organisms';
import { CTALink } from '@kenresearch/design-system/atoms';

<ChapterSectionTemplate
  id="market-overview"
  background="warm"
  label="CHAPTER 08 · MARKET OVERVIEW"
  heading="Understanding the Cold Chain Landscape"
  lede="An analysis of the market structure, regulatory context, and growth drivers."
  content={<MarketOverview data={mockMarketData} />}
  cta={<CTALink href="/download">Download Full Section</CTALink>}
/>
```
