# CTARowResponsive

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/HeroSection.tsx:285-345
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
3-tier responsive CTA pair — button size and layout change at 3 breakpoints.
- Mobile (<sm): stacked column, size="sm", full-width
- Tablet (sm–md): horizontal row, size="md"
- Desktop (md+): horizontal row, size="lg"

```
[Mobile]    [Download Sample]
            [Request Custom ]

[Tablet]    [Download Sample] [Request Custom]

[Desktop]   [Download Sample     ] [Request Custom   ]  ← larger
```

## WHY
V0_lite HeroSection.tsx L285-345 uses three visibility-class div blocks for this pattern.
Three blocks of boilerplate clutters hero code. Molecule encapsulates the 3-tier pattern.
Fitts' Law — button touch targets grow on desktop where imprecision is lower.

## WHEN
Any primary + secondary CTA pair that needs responsive sizing. Hero sections, FinalCTA blocks.

## WHEN NOT
- Single CTA → Button atom directly.
- Nav link pairs → CTALink atoms.
- Card-footer CTAs → CardFooterRow molecule.

## WHERE
HeroSection left-column CTA area · FinalCTASection · chapter-level CTA rows.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `primary` | `CTAButtonSpec` | — | Primary CTA (brand variant) |
| `secondary` | `CTAButtonSpec` | — | Secondary CTA (secondary or ghost) |
| `background` | `'light' \| 'dark'` | `'light'` | Controls secondary variant (light→secondary, dark→ghost) |
| `className` | `string` | — | Root wrapper className |

`CTAButtonSpec`: `{ label, href?, onClick?, animatedArrow?, icon?, className? }`

### Tokens used
- gap-2 (mobile) → `--space-2`
- gap-3 (tablet) → `--space-3`
- gap-4 (desktop) → `--space-4`
- Button tokens: see Button.md

### A11y
- Each Button has correct role="button" from Button atom
- Links wrapped in `<a>` with href when provided
- Focus rings inherited from Button atom

### Code example
```tsx
import { FileText } from 'lucide-react';

<CTARowResponsive
  primary={{ label: 'Download Sample Report', animatedArrow: true }}
  secondary={{ label: 'Request Custom Report', icon: <FileText /> }}
/>
```
