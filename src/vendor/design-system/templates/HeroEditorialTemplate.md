# HeroEditorialTemplate · sidecar

## WHAT
Editorial-light hero section shell (white bg). Composes Breadcrumb + LabelHeadingPair + CTARowResponsive + MetadataStrip + optional 2-col right slot.

## WHY
Editorial-light hero is the DEFAULT for case-study and listing pages. Centralising prevents per-page re-invention of the white-surface layout. Variant LOCK enforcement (Cat 13.10): ALWAYS editorial-light, NEVER cinematic-dark.

## WHEN
- Case-study hero (editorial-light default).
- Report store listing page hero.
- Any editorial landing hero without cinematic chrome.

## WHEN NOT
- Cinematic dark hero → HeroCinematicTemplate.
- Report PDP primary hero (section 1) → HeroCinematicTemplate.

## WHERE
`core-v2/src/templates/HeroEditorialTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | `'hero'` | no | Section anchor id |
| `breadcrumbItems` | `BreadcrumbNavItem[]` | — | no | Breadcrumb items |
| `eyebrow` | `string` | — | no | Eyebrow label |
| `headline` | `string` | — | yes | h1 headline |
| `headlineAccent` | `string` | — | no | Optional second line |
| `lede` | `string` | — | no | Lede paragraph |
| `primaryCTA` | `CTAButtonSpec` | — | yes | Primary CTA |
| `secondaryCTA` | `CTAButtonSpec` | — | no | Secondary CTA |
| `metadataItems` | `MetadataItem[]` | — | no | Metadata strip items |
| `rightSlot` | `ReactNode` | — | no | Right col content (triggers 2-col layout) |
| `className` | `string` | — | no | Extra className |

## Variant LOCK
**ALWAYS** `background="white"`. NEVER pass `background="mesh"` or cinematic tokens. Cat 13.10 anti-pattern.

## Composition map

```
<SectionWrapper background="white" spacing="lg">   // editorial-light ONLY
  <Breadcrumb? mb-6 sm:mb-8 />
  // with rightSlot:
  <div grid lg:grid-cols-2 gap-10 lg:gap-16>
    <div space-y-6>                                // left text
      <LabelHeadingPair headingLevel={1} />
      <CTARowResponsive background="light" />
      <MetadataStrip? colorScheme="light" />
    </div>
    <div> {rightSlot} </div>                       // right slot
  </div>
  // without rightSlot:
  <div space-y-6 max-w-content>
    <LabelHeadingPair headingLevel={1} />
    <CTARowResponsive background="light" />
    <MetadataStrip? colorScheme="light" />
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--container-content` (62.5rem) | single-col max-width |
| `--color-foundation-white` | background via SectionWrapper |
| `--pair-label-heading` | eyebrow→heading gap (LabelHeadingPair) |

## A11y
- Heading level 1 (h1) — correct as page primary heading.
- Breadcrumb: `nav aria-label="Breadcrumb"` + `aria-current="page"` on last item.
- CTARowResponsive: both CTAs have visible focus rings.
- `scroll-margin-top` not needed on hero (page top — no navbar overlap at load).

## Responsive
- 2-col: collapses to single col at < lg (1024px).
- Single-col: `max-w-content` constrains text for readability.
- MetadataStrip: 5-col → 2-col at < sm.

## Code example

```tsx
import { HeroEditorialTemplate } from '@kenresearch/design-system/templates';

<HeroEditorialTemplate
  id="hero"
  breadcrumbItems={[
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'APAC Cold Chain', href: '#' },
  ]}
  eyebrow="CASE STUDY"
  headline="How APAC Logistics Optimised Cold Chain"
  lede="A comprehensive engagement delivering 23% cost reduction across 14 distribution nodes."
  primaryCTA={{ label: 'Read Full Study', href: '/case-study/apac', animatedArrow: true }}
  secondaryCTA={{ label: 'Talk to Analyst', href: '/contact' }}
  metadataItems={[
    { label: 'Industry', value: 'Logistics' },
    { label: 'Region', value: 'APAC' },
    { label: 'Duration', value: '6 months' },
  ]}
/>
```
