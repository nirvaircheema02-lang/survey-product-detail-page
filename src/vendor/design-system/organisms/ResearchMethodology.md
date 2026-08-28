# ResearchMethodology

**Tier:** organism
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b — REWROTE simplified placeholder)
**Status:** ready

## WHAT

Research methodology section. Horizontal stepper (StepperHorizontal) above a
3-column grid of MethodologyCards. Clicking a stepper tab or card sets `activeStep` —
active card gets dual-shadow elevation. Preceded by section header (label + h2 + lede).

```
        [1 Approach] → [2 Data Collection] → [3 Validation]

┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ [icon] Desk       │  │ [icon] Primary     │  │ [icon] Validation │ ← active = dual shadow
│       Research    │  │       Research     │  │                   │
│ ─────             │  │ ─────              │  │ ─────             │
│ • bullet          │  │ • bullet           │  │ • bullet          │
│ • bullet          │  │ • bullet           │  │ • bullet          │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## WHY

Methodology sections remove the "how do they know this?" objection. StepperHorizontal
lets users self-select which phase to review (reduces scroll to find, Miller's Law).
Dual-shadow elevation on active card visually couples card to stepper tab above.

## WHEN

- Report PDP "Research Methodology" chapter section.
- Any section needing a 2–7-step process with visual card-per-step detail.

## WHEN NOT

- Checkout/wizard flows requiring sequential validation.
- More than 7 steps (stepper breaks on mobile).
- FAQ/help content (use FAQSection).

## WHERE

- Chapter 11 in V1 product page PDP recipe.
- Any report PDP methodology section.

## HOW

### API

```tsx
import { ResearchMethodology } from '@kenresearch/design-system/organisms';
import { Search, CircleCheckBig, FileCheck } from 'lucide-react';

// TODO: replace w/ real API — GET /api/reports/{slug}/methodology
<ResearchMethodology
  sectionId="methodology"
  sectionLabel="CHAPTER 11 - OUR APPROACH"
  heading="Research Methodology"
  description="Our multi-layered approach combines rigorous desk research..."
  steps={[
    {
      id: 1,
      tabLabel: 'Approach',
      icon: Search,
      title: 'Desk Research',
      subtitle: 'Comprehensive secondary research.',
      bullets: ['Market reports from 50+ authoritative sources', '...'],
    },
    {
      id: 2,
      tabLabel: 'Data Collection',
      icon: CircleCheckBig,
      title: 'Primary Research',
      subtitle: 'Direct engagement with industry participants.',
      bullets: ['200+ expert interviews', '...'],
    },
    {
      id: 3,
      tabLabel: 'Validation',
      icon: FileCheck,
      title: 'Validation',
      subtitle: 'Multi-source verification.',
      bullets: ['Cross-validation via 500+ sources', '...'],
    },
  ]}
  background="warm"
/>
```

### Token usage

| Token | Where used |
|---|---|
| `--warm-300` | Section bg (background="warm") |
| `--container-content` | Max-width |
| `--container-prose` | Header block max-width |
| `--section-header-mb` | Header block bottom margin |
| `--text-sm` | Description + card title |
| `--text-nav-helper` | Card subtitle + bullets (13px) |
| `--black-500` | Description + subtitle colour |
| `--pair-heading-description` | h2 → lede spacing |

### A11y

- `<section id={sectionId} className="scroll-mt-[72px]">` — section landmark with scroll margin
- SectionLabel, SectionHeading: existing atom a11y
- StepperHorizontal: `role="group" aria-label="Methodology steps"` — each button `aria-pressed`
- MethodologyCard: `role="button" tabIndex={0} aria-pressed` — Enter/Space keyboard support

### Motion

- CSS `transition-all duration-300` on card shadow — DS global prefers-reduced-motion handles it
- No Framer motion (shadow-only visual state, not layout/entrance)

### Responsive

- `sm:justify-center` stepper — centered desktop, left-aligned mobile
- `md:grid-cols-3` card grid — stacks mobile/tablet, 3-col md+
- Stepper: mobile scroll, desktop justify-center
