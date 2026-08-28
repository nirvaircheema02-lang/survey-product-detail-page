# MetadataStrip

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/HeroSection.tsx (below-CTA metadata strip)
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
Horizontal strip of label-value pairs with vertical dividers. 2-col grid on mobile, flex row with divide-x on desktop.
Semantic `<dl>/<dt>/<dd>` markup.

```
AUTHOR              | PAGES  | PUBLISHED    | CODE          | BASE YEAR
Ken Research Teams  | 165+   | Jan 2024     | KR-HC-24-001  | 2024
```

## WHY
B2B report buyers scan metadata before committing to purchase — Author, base year, page count
establish credibility. Centralising prevents font/colour/spacing drift.
Hick's Law — pre-scan metadata reduces decision time.

## WHEN
Below CTA buttons in HeroSection. Any scan-level metadata summary row.

## WHEN NOT
- Navigation links → Breadcrumb.
- Stat values with icons → StatPairRow.
- Card meta (projection/region/date) → CardMetaRow.

## WHERE
HeroSection below-CTA area · report PDP metadata block · case-study meta row.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MetadataItem[]` | — | Array of `{ label, value }`. 3–5 recommended. |
| `colorScheme` | `'light' \| 'dark'` | `'light'` | Label/value color adaptation |
| `className` | `string` | — | Root dl className |

### Tokens used
- `--text-xs` labels (uppercase)
- `--tracking-label-wide` label tracking
- `--text-nav` values
- `--font-weight-medium` both
- `--space-1` label-value gap
- `--space-4` mobile grid gap
- `--space-8` desktop border-left padding

### A11y
- `<dl>` / `<dt>` / `<dd>` semantic definition list
- Labels are `<dt>`, values are `<dd>`

### Code example
```tsx
<MetadataStrip
  colorScheme="dark"
  items={[
    { label: 'Author', value: 'Ken Research Analysts' },
    { label: 'Pages', value: '165+' },
    { label: 'Published', value: 'January 2024' },
    { label: 'Report Code', value: 'KR-HC-24-001' },
    { label: 'Base Year', value: '2024' },
  ]}
/>
```
