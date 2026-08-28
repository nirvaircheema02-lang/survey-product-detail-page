# MethodologyCard

**Tier:** molecule
**Canonical source:** `projects/V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx:127-191`
**Ported:** 2026-05-19 by aura-builder · Batch 3.2a
**Status:** ready

## WHAT

Single research methodology card. Icon-box (purple tint) + title + subtitle row, then bullet list with ChevronRight decorative markers. Active state = `--shadow-card-active` dual elevation. Gradient bg = `--bg-card-methodology`. Whole card is keyboard-interactive (role=button).

```
┌─────────────────────────────────────────┐
│  [🔍]  Desk Research                    │  ← icon-box + title
│         Comprehensive secondary…        │  ← subtitle
│  > Market reports from healthcare…      │  ← bullets (ChevronRight)
│  > Government publications on FDA…      │
└─────────────────────────────────────────┘
 active: dual-shadow elevation via --shadow-card-active
```

## WHY

Methodology steps visualized as structured cards (icon + title + bullets) communicate research depth. Active elevation couples the card to the StepperHorizontal tab above (Miller's Law grouping). Purple-600 ChevronRight = decorative content-structure markers (NOT disclosure) — per explicit V0_lite design decision.

## WHEN

- ResearchMethodology 3-col grid (always rendered as a set of N steps)
- StepperPlusGridTemplate

## WHEN NOT

- Standalone card without stepper context → use DataHighlightCard
- Non-methodology content → use appropriate card atom
- Removing isActive → elevation is load-bearing for stepper coupling

## WHERE

- `core-v2/src/organisms/ResearchMethodology.tsx`
- `core-v2/src/templates/StepperPlusGridTemplate.tsx`

## HOW

### API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `stepId` | `number` | yes | — | Step identifier (data-step attr) |
| `icon` | `ComponentType` | yes | — | Lucide or SVG icon (h-4 w-4) |
| `title` | `string` | yes | — | Card title (e.g. "Desk Research") |
| `subtitle` | `string` | yes | — | 1-line descriptor |
| `bullets` | `string[]` | yes | — | Bullet list items (3-5 recommended) |
| `isActive` | `boolean` | no | `false` | Elevated shadow when true |
| `onClick` | `() => void` | no | — | Update active state in parent |
| `className` | `string` | no | — | Extra className on root |

### Tokens used

| Token | Value | Why |
|---|---|---|
| `--bg-card-methodology` | gradient(135deg, rgba(243,244,255,0.5), rgba(250,250,250,0.3)) | Card gradient bg |
| `--shadow-card-active` | 0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04) | Active dual-shadow elevation |
| `--radius-sm` | 10px | Card + icon-box border-radius |
| `--black-200` | #e5e5e5 | Card border |
| `--black-500` | #737373 | Subtitle + bullet text color |
| `--leading-snug` | 1.3 | Subtitle line-height |
| `--text-sm` | 1rem (16px) | Title font-size |
| `--text-nav-helper` | 0.813rem (13px) | Subtitle + bullet font-size |
| `--icon-content` | #806ce0 (= purple-600) | Icon + ChevronRight color |
| `--brand-red` | #b01f24 | Focus ring |

### A11y

- Root: `role="button"` + `tabIndex={0}` + `aria-pressed={isActive}`
- Keyboard: Enter/Space trigger onClick (onKeyDown handler)
- Icon-box div: `aria-hidden="true"`
- ChevronRight icons in bullets: `aria-hidden="true"`
- Touch target: card full-height (py-4 sm:py-5 + content) exceeds 44px

### Motion

CSS `transition-all duration-300` for shadow shift. DS global `@media (prefers-reduced-motion: reduce)` disables transitions. No Framer Motion (shadow-only visual, not layout animation).

### Responsive

- Mobile: `px-3 py-4` internal padding
- sm+: `sm:px-4 sm:py-5`
- Grid: parent owns `grid md:grid-cols-3 gap-4 lg:gap-5` (organism sets grid)

### Code example

```tsx
import { useState } from 'react';
import { Search, CircleCheckBig, FileCheck } from 'lucide-react';
import { StepperHorizontal } from '@ken-research/core-v2/molecules';
import { MethodologyCard } from '@ken-research/core-v2/molecules';

const STEPS = [
  {
    id: 1, label: 'Approach', icon: Search, title: 'Desk Research',
    subtitle: 'Comprehensive secondary research.',
    bullets: ['Market reports from healthcare associations', 'Government publications'],
  },
  // …
];

function ResearchMethodologyDemo() {
  const [active, setActive] = useState(1);
  return (
    <div>
      <StepperHorizontal steps={STEPS.map(s => ({ id: s.id, label: s.label }))} activeId={active} onStepChange={setActive} />
      <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mt-10">
        {STEPS.map(step => (
          <MethodologyCard
            key={step.id}
            stepId={step.id}
            icon={step.icon}
            title={step.title}
            subtitle={step.subtitle}
            bullets={step.bullets}
            isActive={active === step.id}
            onClick={() => setActive(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
```
