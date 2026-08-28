# IconBox

**Tier:** atom
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx (size-12 icon-box pattern)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Square tinted icon container. 6 colour palettes × 2 sizes × `--radius-sm` (10px) corners.
```
┌──────────┐
│    🔵    │  ← icon centred
└──────────┘
  44px/48px
```

## WHY
V0_lite `KeyStats` and `ReportHighlights` both use `size-11/12 rounded-[10px] flex items-center justify-center bg-content-icon/10`.

**Token collision resolved:** V0.2 used `--radius-md` for 10px (but core-v2 `--radius-md` = 15px). Correct token is `--radius-sm` (10px in core-v2). Without the atom, every consumer must know this mapping.

## WHEN
- Icon callout in stat rows, highlight cards, feature cards
- Any context where a Lucide icon needs a branded tinted square container

## WHEN NOT
- Navigation icons → MenuItem's built-in iconBg prop
- Badge with icon → IconBadge atom
- Never brand-red icon colour (ANTI-PATTERNS C2.9 — content purple only)

## WHERE
KeyStatsStrip organism · ReportHighlights organism · InlineStats atom · GrowthDriversChallenges.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | **required** | Lucide icon component |
| `color` | `'purple' \| 'coral' \| 'periwinkle' \| 'perano' \| 'warm' \| 'brand'` | `'purple'` | Colour palette for bg tint + icon |
| `size` | `'sm' \| 'md'` | `'sm'` | sm=44px · md=48px |
| `label` | `string` | — | Accessible label (aria-label on wrapper) when icon has semantic meaning |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--radius-sm` | 10px corner radius — canonical icon-box radius (V0.2 called it --radius-md but that's 15px in core-v2) |
| `iconColors.content` | Purple icon stroke for purple/default variant |
| `iconColors.utility` | Grey icon stroke for warm variant |
| `--purple-600` | Brand content icon colour |
| `--coral-500` | Coral accent variant |

### A11y
- Icon is `aria-hidden="true"` (decorative by default)
- Pass `label` prop to expose meaning via `role="img"` + `aria-label` on wrapper
- `size="sm"` = 44px — meets WCAG 2.5.5 minimum touch target when interactive

### Responsive
Fixed square — does not resize responsively. Parent grid controls density.

### Code example
```tsx
import { BarChart3, Globe } from 'lucide-react';

<IconBox icon={BarChart3} />
<IconBox icon={Globe} color="coral" size="md" />
<IconBox icon={TrendingUp} label="CAGR trending up" size="md" />
```
