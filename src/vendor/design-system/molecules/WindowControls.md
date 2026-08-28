# WindowControls

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/HeroSection.tsx:462-477
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
macOS-style three-dot window chrome row + optional right-aligned label. Static — no functional close/min/max.

```
[●] [●] [●]                        Sample Preview
```

## WHY
V0_lite HeroSection uses this pattern at the top of the report preview card to simulate a browser frame.
Signals "this is a preview of real software". Contextual skeuomorphism — familiar to all users.

## WHEN
Inside any preview card, sample report chapter card, or demo screenshot frame.

## WHEN NOT
- Do NOT use as functional window controls.
- Do NOT use standalone outside a card context.

## WHERE
PreviewCard molecule · SampleReportPreview organism · HeroSection right-column preview card.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `undefined` | Right-side label (e.g. "Sample Preview") |
| `colorScheme` | `'light' \| 'dark'` | `'dark'` | Dot + label color adaptation |
| `className` | `string` | — | Root wrapper className |

### Tokens used
- `--text-xs` (12.8px) for label
- Dot colours: `rgba(255,255,255,0.2)` dark / `rgba(0,0,0,0.2)` light
- Label colours: `rgba(255,255,255,0.4)` dark / `rgba(0,0,0,0.4)` light

### A11y
- `aria-hidden="true"` on root — entirely decorative

### Code example
```tsx
<WindowControls label="Sample Preview" colorScheme="dark" />
```
