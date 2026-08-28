# StepperHorizontal

**Tier:** molecule
**Canonical source:** `projects/V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx:86-123`
**Ported:** 2026-05-19 by aura-builder · Batch 3.2a
**Status:** ready

## WHAT

Horizontally scrollable step-picker row. 3 visual zones: step-number badge (circle) · step label (hidden mobile) · ChevronRight separator. Active step = black fill + white text. Inactive = white card + warm-500 border + coral hover.

```
[①  Approach] > [②  Data Collection] > [③  Validation]
 ^^^ active          inactive               inactive
```

## WHY

Methodology sections need a non-linear tab-like chooser for 2-7 steps. Horizontal orientation keeps all steps scannable at once (Miller's Law — chunking). Active state drives elevated shadow on the 3-col MethodologyCard grid below — visual coupling without scroll.

## WHEN

- Research Methodology section (ResearchMethodology organism)
- Any 2-7 step chooser where steps have labels and user can jump freely
- StepperPlusGridTemplate

## WHEN NOT

- Sequential wizard forms (require validation before advancing) — use `<form>` steps
- More than 7 steps — use a `<select>` or paginated tabs instead
- Navigation links — use Navbar or Breadcrumb

## WHERE

- `core-v2/src/organisms/ResearchMethodology.tsx` (Batch 3.2 organism)
- `core-v2/src/templates/StepperPlusGridTemplate.tsx` (Tier 4 · greenfield)

## HOW

### API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `steps` | `StepperStep[]` | yes | — | Array of `{id: number, label: string}` |
| `activeId` | `number` | yes | — | ID of active step (controlled) |
| `onStepChange` | `(id: number) => void` | yes | — | Called on step button click |
| `className` | `string` | no | — | Extra className on scroll container |

### Tokens used

| Token | Value | Why |
|---|---|---|
| `--warm-500` | #eae5e3 | Inactive button border — warm neutral |
| `--black-100` | #f5f5f5 | Inactive step-number badge bg |
| `--black-300` | #d4d4d4 | ChevronRight separator color |
| `--black-500` | #737373 | Inactive step-number badge text |
| `--black-900` | #171717 | Active button background |
| `--coral-50` | #fffbf9 | Inactive hover bg |
| `--coral-100` | #fff5f1 | Inactive active/pressed bg |
| `--radius-sm` | 10px | Button border-radius |
| `--text-nav-helper` | 0.813rem (13px) | Button label + step badge font-size |
| `--brand-red` | #b01f24 | Focus ring color |

### A11y

- Root: `role="group"` + `aria-label="Methodology steps"`
- Each button: `aria-pressed={isActive}` · `aria-label="Step N: Label"`
- Step number badge: `aria-hidden="true"` (number already in button aria-label)
- ChevronRight separators: `aria-hidden="true"`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-[--brand-red] focus-visible:ring-offset-2`
- Touch target: `h-12` = 48px (exceeds 44px minimum)

### Motion

No Framer Motion — pure CSS `transition-all duration-200`. DS global layer `@media (prefers-reduced-motion: reduce)` disables transitions automatically.

### Responsive

- Mobile: `-mx-4 px-4` negative margin bleed for full-width scroll · `pb-2` scroll gutter · `scrollbarWidth: none` hidden scrollbar
- sm+: `sm:mx-0 sm:px-0 sm:justify-center` — centered, no scroll bleed
- Label: `hidden sm:inline` — number only on mobile, full label sm+

### Code example

```tsx
import { useState } from 'react';
import { StepperHorizontal } from '@ken-research/core-v2/molecules';

const STEPS = [
  { id: 1, label: 'Approach' },
  { id: 2, label: 'Data Collection' },
  { id: 3, label: 'Validation' },
];

function ResearchMethodologyDemo() {
  const [activeStep, setActiveStep] = useState(1);
  return (
    <div>
      <StepperHorizontal
        steps={STEPS}
        activeId={activeStep}
        onStepChange={setActiveStep}
      />
      {/* MethodologyCard grid below — receives activeStep for elevated shadow */}
    </div>
  );
}
```
