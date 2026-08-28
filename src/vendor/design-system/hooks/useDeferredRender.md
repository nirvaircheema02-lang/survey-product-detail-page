# useDeferredRender

**Location:** `design-system/core-v2/src/hooks/useDeferredRender.ts`
**Export path:** `@kenresearch/design-system/hooks`
**Added:** 2026-05-19 · P1 Highcharts LCP perf fix

---

## Purpose

Returns `ready: boolean` — `false` until the browser signals it's safe to mount expensive UI (Highcharts charts, heavy dynamic imports) without blocking LCP.

**Problem solved:** Hero charts (HeroChartCard · HeroCockpit · HeroRightRail) all used `dynamic({ ssr: false })` which still evaluates the Highcharts bundle (~117KB, 3.7s eval) before LCP fires. Deferring until idle/intersect lets h1 + CTA paint first, improving LCP from 5.0s → target 2.5-3.0s.

---

## Strategies

| Strategy | When to use | Mechanism |
|---|---|---|
| `'idle'` (default) | Above-fold heavy components | `requestIdleCallback({ timeout: 2000 })` → Safari <16 falls back to `setTimeout(delayMs)` |
| `'intersect'` | Below-fold components | `IntersectionObserver` on provided `ref`, `rootMargin: '200px'` |

---

## Usage

```tsx
// Above-fold chart (hero) — idle strategy
import { useDeferredRender } from '@kenresearch/design-system/hooks';

function HeroChartCard() {
  const chartReady = useDeferredRender({ strategy: 'idle' });
  return (
    <div style={{ minHeight: 150 }}>
      {chartReady ? <ActualChart /> : <ChartSkeleton height={150} />}
    </div>
  );
}
```

```tsx
// Below-fold chart — intersect strategy
import { useRef } from 'react';
import { useDeferredRender } from '@kenresearch/design-system/hooks';

function BelowFoldSection() {
  const ref = useRef<HTMLDivElement>(null);
  const chartReady = useDeferredRender({ strategy: 'intersect', ref });
  return (
    <div ref={ref} style={{ minHeight: 300 }}>
      {chartReady ? <HeavyChart /> : <ChartSkeleton height={300} />}
    </div>
  );
}
```

---

## Skeleton contract (CLS = 0)

Skeleton wrapper MUST have `minHeight` matching the final chart's rendered height.
Never set `height: 0` or omit a dimension — causes CLS.

| Component | Chart height | Skeleton minHeight |
|---|---|---|
| HeroChartCard | 150px | 150px |
| HeroCockpit (per tab) | 140px (inside ChartCardMini) | 140px |
| HeroRightRail L2 | 160px | 160px |

---

## Reduced motion

The skeleton pulse animation (CSS `animate-pulse`) must be gated behind `useReducedMotion()`.
When reduced motion is preferred, render a static placeholder with no animation.

---

## Browser support

- `requestIdleCallback`: Chrome 47+ · Firefox 55+ · Edge 79+ (not Safari <16)
- Safari <16 fallback: `setTimeout(100ms)` — acceptable, charts appear quickly after paint
- `IntersectionObserver`: all modern browsers
