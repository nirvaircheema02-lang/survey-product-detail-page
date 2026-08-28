# StepperPlusGridTemplate · sidecar

## WHAT
Research Methodology section shell. StepperHorizontal (top, sm-centered) + 3-col MethodologyCard grid with active-state synced to stepper. Manages `activeStep` state internally.

## WHY
Methodology section needs step-picker + card grid coupling. Template centralises the `activeStep ↔ stepper ↔ card grid` sync to prevent each consumer duplicating the pattern (CANON §2.7).

## WHEN
- Report PDP Research Methodology section (section 24).
- Any multi-step methodology or process breakdown with card grid.

## WHEN NOT
- Linear wizards / checkout flows — use form steps instead.
- More than 7 steps — stepper becomes unreadable on mobile.

## WHERE
`core-v2/src/templates/StepperPlusGridTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | — | yes | Section anchor id |
| `background` | `'white' \| 'warm'` | `'white'` | no | Bg alternation |
| `label` | `string` | — | yes | Eyebrow label |
| `heading` | `string` | — | yes | h2 heading |
| `lede` | `string` | — | no | Optional lede paragraph |
| `steps` | `MethodologyStep[]` | — | yes | Step data array |
| `className` | `string` | — | no | Extra className |

### MethodologyStep shape
```ts
{
  id: number;         // unique step id (1-based)
  label: string;      // stepper pill label
  icon: LucideIcon;   // card icon-box icon
  title: string;      // card title
  subtitle: string;   // card subtitle
  bullets: string[];  // card bullet points
}
```

## Composition map

```
<SectionWrapper id background spacing="lg">       // 'use client' — activeStep state
  <div mb-10 md:mb-12>
    <LabelHeadingPair label heading lede? />
  </div>
  <StepperHorizontal
    steps activeId onStepChange
    className="mb-10 md:mb-12 sm:justify-center overflow-x-auto"
  />
  <div grid md:grid-cols-3 gap-4 lg:gap-5>
    {steps.map → <MethodologyCard isActive=(id===activeId) />}
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--scroll-margin-section` (72px) | scroll-margin-top on section |
| `--bg-card-methodology` | MethodologyCard card bg |
| `--shadow-card-active` | active MethodologyCard elevation |
| `--icon-content` (purple-600) | MethodologyCard icon color |

## A11y
- StepperHorizontal: `role="tablist"` pattern — each step is `role="tab"` + `aria-selected`.
- MethodologyCard: `role="button"` + `aria-pressed={isActive}` + keyboard Enter/Space.
- `scroll-margin-top: 72px` prevents navbar cover on anchor scroll.
- LabelHeadingPair heading level h2 — correct document outline.

## Responsive
- Stepper: `overflow-x-auto` on mobile, `sm:justify-center` on tablet+.
- Card grid: single col mobile → 3 col md+.
- Gap: `gap-4 lg:gap-5` (16px → 20px).

## Interactive
- `'use client'` required — manages `activeStep` with `useState`.
- Stepper step click + MethodologyCard click both call `setActiveId`.

## Code example

```tsx
import { StepperPlusGridTemplate } from '@kenresearch/design-system/templates';
import { Search, Database, BarChart3 } from 'lucide-react';

<StepperPlusGridTemplate
  id="methodology"
  background="white"
  label="CHAPTER 24 · RESEARCH METHODOLOGY"
  heading="How We Gather and Validate Data"
  steps={[
    {
      id: 1,
      label: 'Desk Research',
      icon: Search,
      title: 'Secondary Research',
      subtitle: 'Comprehensive research from authoritative sources.',
      bullets: ['Industry reports', 'Government databases', 'Patent filings'],
    },
    {
      id: 2,
      label: 'Primary Data',
      icon: Database,
      title: 'Field Research',
      subtitle: 'Direct interviews and surveys with market participants.',
      bullets: ['Executive interviews', 'Operator surveys', 'Expert panels'],
    },
    {
      id: 3,
      label: 'Analysis',
      icon: BarChart3,
      title: 'Data Validation',
      subtitle: 'Triangulation and expert review of all data.',
      bullets: ['Bottom-up modelling', 'Cross-validation', 'Peer review'],
    },
  ]}
/>
```
