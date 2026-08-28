# useScrollSpy

**Tier:** hook
**Canonical source:** projects/V0.2 -for design system/src/app/hooks/useScrollSpy.ts
**Ported:** 2026-05-19 by aura-builder (Batch 3.2b)
**Status:** ready

## WHAT

IntersectionObserver-based scroll-spy. Tracks which section ID from an array is
currently "active" in the viewport. Returns the active section ID as state.

## WHY

TOC sidebars need to highlight the current section while users scroll. IO with
negative rootMargin is cheaper than scroll listeners + getBoundingClientRect polling
and more semantically correct: a section is "active" when it enters the trigger zone.

## WHEN

- `TableOfContentsSidebar` organism — highlights active section as user scrolls.
- Any scroll-spy context where a list of nav items maps to page section IDs.

## WHEN NOT

- For entrance animations — use Framer `useInView`.
- For direction detection — use `useScrollDirection`.
- For reading progress percentage — use `useReadingProgress`.

## WHERE

- `TableOfContentsSidebar` organism.
- Any future sidebar TOC implementations.

## HOW

### API

```ts
import { useScrollSpy } from '@kenresearch/design-system/hooks';

const sectionIds = ['market-overview', 'segmentation', 'regional'];
const activeId = useScrollSpy(sectionIds, 200);
// activeId = 'market-overview' (whichever is near top of viewport)
```

**Parameters:**
- `sectionIds: string[]` — array of section `id` attributes in DOM order
- `rootMarginTop: number` — pixels from top treated as trigger zone (default 200)

**Returns:** `string | null` — active section ID, or first ID as initial value

### Motion

Purely IntersectionObserver-based — no requestAnimationFrame, no scroll listener.
Automatically cleaned up on unmount via `observer.disconnect()`.
