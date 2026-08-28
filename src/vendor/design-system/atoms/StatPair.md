# StatPair

**Tier:** atom
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx (StatItem pattern)
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Semantic label-value pair. Value is large, semibold, tabular-nums. Label is small, muted.
```
$45.2B        ← value (--text-base · semibold · tabular-nums)
Market Size   ← label (--text-xs · muted)
```

## WHY
Recurring across KeyStats strip, hero metadata, and chart callouts. Centralising locks:
- `tabular-nums` on value (prevents layout shift during counter animation)
- Correct weight/size ratio between value and label
- Semantic `<dl><dt><dd>` for assistive technology

## WHEN
Single metric callout with one value + one label. Compose 3 into StatPairRow molecule for the strip.

## WHEN NOT
- Multi-stat strips → StatPairRow molecule
- Trend badge → StatBadge atom
- Full icon+value+label unit → InlineStats atom

## WHERE
KeyStatsStrip organism · report hero metadata strip · chart summary callouts.

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | **required** | Metric value (e.g. "$45.2B") |
| `label` | `string` | **required** | Descriptor (e.g. "Market Size 2024") |
| `orientation` | `'vertical' \| 'vertical-label-first' \| 'horizontal'` | `'vertical'` | Layout variant |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--text-base` | Value font size (20px = 1.25rem) — large readable metric |
| `--font-weight-semibold` | Value weight 600 |
| `--leading-tight` | Value line-height 1.1 — compact on large sizes |
| `--tracking-tight` | Value letter-spacing for tabular numerics |
| `--black-900` | Value colour — maximum contrast |
| `--text-xs` | Label font size 12.8px — subordinate |
| `--font-weight-normal` | Label weight 400 |
| `--leading-stat-label` | Label line-height 1.5 |
| `--black-500` | Label muted colour |

### A11y
`<dl>` definition list — `<dt>` = label (term), `<dd>` = value (definition). Screen readers announce "Market Size 2024: $45.2B" semantically.

### Code example
```tsx
<StatPair value="$45.2B" label="Market Size 2024" />
<StatPair value="32.5%" label="CAGR 2024–2030" orientation="vertical-label-first" />
<StatPair value="50+" label="Countries Covered" orientation="horizontal" />
```
