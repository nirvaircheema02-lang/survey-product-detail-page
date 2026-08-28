# AssociationStrip

**Tier:** organism
**Canonical source:** projects/report-store-legacy/src/app/components/Footer.tsx:42-68 (trust bar pattern)
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b)
**Status:** ready

## WHAT

Compact horizontal trust strip. Left: certification/award badges (icon + label).
Right: "Trusted by:" label + client name pills. Both sides separated by top/bottom
borders. Lightweight — secondary supporting element, not a primary section.

```
┌────────────────────────────────────────────────────────────────────────┐
│  🛡 ISO 27001 Certified  |  🏆 Top 10 Global Research Firm    ·  Trusted by: [Fortune 500] [McKinsey] [Deloitte] ... │
└────────────────────────────────────────────────────────────────────────┘
```

## WHY

Social proof reduces high-ticket purchase anxiety. ISO certs signal data security
trust. Recognisable client names trigger authority and social-proof heuristics
(Cialdini). Lightweight pill treatment keeps trust signals visible without occupying
a full section.

## WHEN

- Below HeroSection on a report PDP, or just above the Footer.
- Any page needing compact trust signals.

## WHEN NOT

- Large logo-brand showcases (use a dedicated TrustBar/Testimonials section).
- When logos require custom SVGs (provide custom organism instead).

## WHERE

- Report PDP pages.
- Landing pages.

## HOW

### API

```tsx
import { AssociationStrip } from '@kenresearch/design-system/organisms';
import { Shield, Award } from 'lucide-react';

<AssociationStrip
  certifications={[
    { id: 'iso', icon: Shield, label: 'ISO 27001 Certified' },
    { id: 'top10', icon: Award, label: 'Top 10 Global Research Firm' },
  ]}
  trustedByLabel="Trusted by"
  logos={[
    { id: 'fortune', name: 'Fortune 500' },
    { id: 'mckinsey', name: 'McKinsey' },
    { id: 'deloitte', name: 'Deloitte' },
    { id: 'bcg', name: 'BCG' },
    { id: 'kpmg', name: 'KPMG' },
  ]}
  background="light"
/>
```

### Token usage

| Token | Where used |
|---|---|
| `--black-50` | Logo pill bg |
| `--black-100` | Border separator (hidden sm) |
| `--black-200` | Certifications separator |
| `--black-400` | Certification icon colour |
| `--black-500` | Certification label + logo text |
| `--text-xs` | All text |
| `--radius-element` | Logo pill radius (5px) |
| `--container-page` | Max-width |
| `--padding-mobile` | Horizontal padding |

### A11y

- Certifications: `<div aria-label="Certifications and awards">` — not a landmark (strip-level)
- Logos: `<div aria-label="Trusted by clients">`
- When logo has href: `<a rel="noopener noreferrer" target="_blank">` — external link
- Icon: `aria-hidden="true"` (label provides context)

### Motion

None — static strip.

### Responsive

- `flex-col sm:flex-row` — stacks mobile, row sm+
- Logo section: `justify-center sm:justify-end`
- Cert separator: `hidden sm:block` (visible sm+)
