# ProgressBar

**Tier:** atom
**Canonical source:** projects/V0.2 -for design system/src/app/components/ui/progress-bar.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.2a-REDO · V0.2 canonical · v0.3 REJECTED)
**Status:** ready

## WHAT
Linear progress bar: full-width track with proportional fill. Optional label below.
Three height sizes (sm/default/lg). Color and track accept CSS var token strings.

```
[████████████░░░░░░░░] 62%   ← size="default" with showLabel
```

## WHY
SegmentationCard, MarketDataTable cells, and CompetitiveLandscape inline bars all encode
percentages visually. Without one atom each re-implements with hardcoded hex and
inconsistent animation timing. Law of similarity: uniform bar appearance across all contexts.

## WHEN
- Inside SegmentationCard items (market share %)
- MarketDataTable inline cell bars (market contribution)
- Any section visualising a numeric proportion inline

## WHEN NOT
- Loading states → use Skeleton
- Range input → use Slider primitive
- Radial/arc charts → use Highcharts

## WHERE
`core-v2/src/atoms/ProgressBar.tsx`
Consumed by: SegmentationCard · MarketDataTable organism

## HOW

### Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| value | number | required | Current value |
| max | number | 100 | Denominator |
| showLabel | boolean | false | Label below bar |
| label | string | `{pct}%` | Custom label |
| size | 'sm' \| 'default' \| 'lg' | 'default' | Track height |
| color | string | 'var(--purple-300)' | Fill CSS var |
| backgroundColor | string | 'var(--black-100)' | Track CSS var |
| noAnimation | boolean | false | Skip CSS transition |
| className | string | — | Outer wrapper |
| ariaLabel | string | `{pct}%` | ARIA progressbar label |

### Token usage
- `--purple-300` default fill
- `--black-100` default track
- `--text-xs` label text size
- `--black-600` label text color

### A11y
- `role="progressbar"` on track element
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` set from computed percentage
- `aria-label` from `ariaLabel` prop or derived label
- `useReducedMotion()` disables CSS transition

### Motion
CSS `transition-[width] duration-700 ease-out` on fill. Disabled when `noAnimation` or `useReducedMotion()`.

### Responsive
Full width of parent container. No breakpoint changes.

### Code example
```tsx
// Basic
<ProgressBar value={75} />

// Inside SegmentationCard item row
<ProgressBar
  value={item.share}
  max={maxPercentage}
  color="var(--purple-300)"
  ariaLabel={`${item.name}: ${item.share}%`}
/>

// Compact label variant
<ProgressBar value={45} showLabel size="sm" />
```
