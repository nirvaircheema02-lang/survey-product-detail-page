# HeroCinematicTemplate · sidecar

## WHAT
Cinematic-dark hero section shell. SectionWrapper (mesh/cinematic-dark) + Breadcrumb + 5-col 3/2 grid (left: eyebrow + h1 + lede + CTARowResponsive + MetadataStrip; right: PreviewCard or custom slot) + optional floating orbs.

## WHY
The cinematic dark hero is the brand-defining surface of any report PDP. Centralising this shell prevents variant drift between sections sharing the cinematic chrome (CANON §2.2).

## WHEN
- Report PDP hero (section 1).
- Any full-bleed cinematic hero with 3/2 grid layout.
- `data-variant-section="cinematic"` activates the deep dark background CSS layer.

## WHEN NOT
- Editorial light pages → HeroEditorialTemplate.
- Case-study hero (unless cinematic override requested).

## WHERE
`core-v2/src/templates/HeroCinematicTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | `'hero'` | no | Section anchor id |
| `breadcrumbItems` | `BreadcrumbNavItem[]` | — | no | Breadcrumb items (omit to hide) |
| `eyebrow` | `string` | — | no | Eyebrow / chapter label |
| `headline` | `string` | — | yes | h1 first line |
| `headlineAccent` | `string` | — | no | h1 second line (block wrap) |
| `lede` | `string` | — | no | Lede paragraph |
| `primaryCTA` | `CTAButtonSpec` | — | yes | Primary CTA |
| `secondaryCTA` | `CTAButtonSpec` | — | no | Secondary CTA |
| `metadataItems` | `MetadataItem[]` | — | no | Below-CTA metadata strip |
| `rightSlot` | `ReactNode` | — | no | Right col content (PreviewCard typical) |
| `showOrbs` | `boolean` | `true` | no | Floating cinematic orbs (reduced-motion guarded) |
| `className` | `string` | — | no | Extra className for SectionWrapper |

## Composition map

```
<SectionWrapper background="mesh" spacing="xl" maxWidth="full"
  data-variant-section="cinematic">
  <div orbs aria-hidden?/>          // animated blur orbs (reduced-motion guarded)
  <div max-w-page container>
    <Breadcrumb? mb-6 sm:mb-8 />
    <div grid lg:grid-cols-5 gap-12 lg:gap-16>
      <div lg:col-span-3 space-y-6>
        <SectionLabel? eyebrow />
        <h1 serif font-light 30-48px />
        <p? lede glass-text />
        <CTARowResponsive surface="dark" />
        <MetadataStrip? onDark />
      </div>
      <div? lg:col-span-2>          // right slot
        {rightSlot}
      </div>
    </div>
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--glass-text` | lede + eyebrow text on dark |
| `--tracking-display-tight` | h1 letter-spacing |
| `--text-30` / `--text-48` | h1 clamp font-size |
| `--container-page` (75rem) | inner container max-width |
| `--brand-red` | orb 1 color |
| `--color-ramp-periwinkle-400` | orb 2 color |

## A11y
- `data-variant-section="cinematic"` activates CSS layer — no aria impact.
- Orbs: `aria-hidden="true"` + `pointer-events-none`.
- `useReducedMotion()` disables orb animation when reduced-motion preferred.
- CTARowResponsive surface="dark" → ghost secondary button (sufficient contrast on dark bg).
- MetadataStrip `onDark` prop adjusts token usage for contrast.
- h1 heading level — correct document outline as page title.

## Responsive
- 5-col grid collapses to single col at < lg (1024px).
- Orbs: `overflow-hidden` on parent prevents horizontal scroll.
- MetadataStrip: 5-col → 2-col at < sm (640px).

## Interactive
- `'use client'` required — uses `useReducedMotion()` + Framer Motion.
- Orbs: Framer `motion.div` + `animate` x/y infinite loop.

## Code example

```tsx
import { HeroCinematicTemplate } from '@kenresearch/design-system/templates';
import { PreviewCard } from '@kenresearch/design-system/molecules';

<HeroCinematicTemplate
  id="hero"
  breadcrumbItems={[
    { label: 'Reports', href: '/reports' },
    { label: 'Cold Chain', href: '/cold-chain' },
    { label: 'Australia Cold Chain Logistics', href: '#' },
  ]}
  eyebrow="CHAPTER 0 · AUSTRALIA COLD CHAIN LOGISTICS"
  headline="Australia Cold Chain"
  headlineAccent="Logistics Market 2024"
  lede="Comprehensive analysis of the USD 14.2Bn cold chain logistics market."
  primaryCTA={{ label: 'Download Report', href: '/buy', animatedArrow: true }}
  secondaryCTA={{ label: 'View Table of Contents', href: '#toc' }}
  metadataItems={[
    { label: 'Author', value: 'Ken Research' },
    { label: 'Pages', value: '280' },
    { label: 'Published', value: 'May 2024' },
    { label: 'Code', value: 'KR-AU-CCL-2024' },
    { label: 'Base Year', value: '2023' },
  ]}
  rightSlot={<PreviewCard chapterLabel="Chapter 2" title="Market Size & Forecast" />}
/>
```
