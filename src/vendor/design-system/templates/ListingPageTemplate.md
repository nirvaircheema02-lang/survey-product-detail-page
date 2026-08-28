# ListingPageTemplate · sidecar

## WHAT
Full page-shell for the Report Store listing page. Composes Navbar + SkipLink + ReportStoreHero + flex sidebar (FiltersPanel) + main (ListingToolbar + CardListing) + MobileFilterBar (fixed bottom) + Footer.

## WHY
The listing layout is a fixed composition pattern (CANON §3.1 + §2.10). Centralising it prevents per-page re-invention of the sidebar flex pattern, mobile filter bar positioning, and sticky offset management.

## WHEN
- Report Store listing page.
- Any filterable grid listing (industry listings, regional listings).

## WHEN NOT
- Report PDP → PDPLayoutTemplate.
- Single-column content page without filterable listing.

## WHERE
`core-v2/src/templates/ListingPageTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `heroProps` | `Partial<ReportStoreHeroProps>` | — | no | Hero section props. Omit to skip hero. |
| `filtersPanelProps` | `FiltersPanelProps` | — | yes | FiltersPanel props |
| `listingToolbarProps` | `ListingToolbarProps` | — | yes | Toolbar props |
| `cardListingProps` | `CardListingProps` | — | yes | CardListing props |
| `mobileFilterCount` | `number` | `0` | no | Active filter count for mobile badge |
| `onOpenMobileFilters` | `() => void` | — | yes | Opens mobile filter sheet |
| `loadMoreSlot` | `ReactNode` | — | no | Load-more sentinel or button |
| `navbarProps` | `Partial<NavbarProps>` | `{}` | no | Navbar overrides |
| `footerProps` | `Partial<FooterProps>` | `{}` | no | Footer overrides |

## Composition map

```
<SkipLink href="#main" />
<header role="banner"> <Navbar /> </header>
<ReportStoreHero? />
<div max-w-page py-10 lg:py-12>
  <div flex gap-0 lg:gap-10>
    <aside w-56 hidden xl:block sticky top-20>   // FiltersPanel (xl+)
      <FiltersPanel />
    </aside>
    <main id="main" flex-1>
      <ListingToolbar />
      <CardListing />
      {loadMoreSlot}
    </main>
  </div>
</div>
<div xl:hidden>
  <MobileFilterBar />                           // fixed bottom (< xl)
</div>
<footer role="contentinfo"> <Footer /> </footer>
```

## Token usage

| Token | Where |
|---|---|
| `--container-page` (75rem) | listing container max-width |
| `--z-floating` (1500) | MobileFilterBar z-index (internal) |
| `--z-navbar` (1000) | Navbar z-index (internal) |

## A11y
- `<SkipLink href="#main">` → `<main id="main">` skip-nav.
- `<header role="banner">` — landmark.
- `<aside aria-label="Filters" role="complementary">` — named landmark.
- `<main id="main" tabIndex={-1}>` — skip-link focus target.
- `<footer role="contentinfo">` — landmark.
- MobileFilterBar: `aria-label` with count + `aria-haspopup="dialog"` (internal).

## Responsive
- Filters sidebar: `hidden xl:block` — only visible at xl (1280px+).
- MobileFilterBar: `xl:hidden` — only visible below xl.
- Gap between sidebar + content: `gap-0 lg:gap-10`.

## Interactive
- `'use client'` because `onOpenMobileFilters` is a callback.
- MobileFilterBar triggers external sheet (caller manages state).

## Code example

```tsx
import { ListingPageTemplate } from '@kenresearch/design-system/templates';
import { LoadMoreSentinel } from '@kenresearch/design-system/molecules';

const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

<ListingPageTemplate
  heroProps={{ initialQuery: searchQuery }}
  filtersPanelProps={{ filters: activeFilters }}
  listingToolbarProps={{
    viewMode,
    onViewChange: setViewMode,
    count: totalResults,
    onSortChange: handleSort,
  }}
  cardListingProps={{ items: reportItems, viewMode, loading: isLoading }}
  mobileFilterCount={activeFilterCount}
  onOpenMobileFilters={() => setMobileSheetOpen(true)}
  loadMoreSlot={<LoadMoreSentinel onLoadMore={fetchMore} />}
/>
```
