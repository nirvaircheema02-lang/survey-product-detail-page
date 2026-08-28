# StatBadge

**Tier:** atom
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/ReportHighlights.tsx:65 (badge pattern)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Mini pill badge for trend/change/count callouts inside highlight cards.
```
[trend]   ↑ +316%  Growth    ← green tint
[change]  ↓  -12%  Decline   ← rose tint
[neutral]    50+   Countries ← warm grey tint
[emphasis] ◆  32%  CAGR      ← purple tint
```

## WHY
ReportHighlights cards show a stat badge alongside the icon box. Without a central atom, each card invents its own badge colours/radius/spacing — drift risk. Locks `--radius-xs` (5px), `px-2.5 py-1` via `--space-1`, 4 semantic variants.

**Token refactor note:** V0.2 `stat-badge.tsx` used `--radius-md` for badge (10px in V0.2 = `--radius-sm` in core-v2). Canonical V0_lite badge uses `rounded-[5px]` = `--radius-xs` — this wins as the primary source.

## WHEN
Metric callout badges inside highlight cards, stat strips, or data summaries where secondary metadata context is needed (trend direction, category count).

## WHEN NOT
- Primary stat display → StatPair
- Status/category label → Badge atom
- Never use brand-red variant for non-CTA contexts (ANTI-PATTERNS C2.1)

## WHERE
ReportHighlights organism · KeyStatsStrip organism · DataChartTemplate.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'trend' \| 'change' \| 'neutral' \| 'emphasis'` | `'neutral'` | Semantic colour variant |
| `value` | `string` | **required** | Primary value (e.g. "+316%") |
| `label` | `string` | **required** | Secondary descriptor |
| `icon` | `LucideIcon` | — | Optional 14×14 leading icon |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--text-xs` | Badge font size 12.8px |
| `--radius-xs` | Badge corner radius 5px |
| `--space-1` | Vertical padding 4px |
| `--green-700` / `--green-600` | Trend variant icon + label |
| `--rose-600` | Change variant |
| `--black-900` / `--black-500` | Neutral variant |
| `--purple-600` / `--purple-500` | Emphasis variant |
| `--font-weight-semibold` | Value weight 600 |

### A11y
Inline span — context comes from surrounding heading/paragraph. When standalone, wrap in `<span aria-label="trend: +316% Growth">`.

### Code example
```tsx
import { TrendingUp } from 'lucide-react';

<StatBadge variant="trend" value="+316%" label="Growth" />
<StatBadge variant="change" value="-12%" label="Decline" />
<StatBadge variant="neutral" value="50+" label="Countries" />
<StatBadge variant="emphasis" value="32.5%" label="CAGR" icon={TrendingUp} />
```
