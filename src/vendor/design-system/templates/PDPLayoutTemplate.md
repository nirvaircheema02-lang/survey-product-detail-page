# PDPLayoutTemplate · sidecar

## WHAT
Full page-shell for a Report PDP. Composes Navbar (sticky z-1000) + SkipLink + TOC sidebar (sticky 88px top, lg+) + `<main id="main">` content slot + FinalCTASection + Footer.

## WHY
The PDP layout is a fixed composition pattern (CANON §3.1). Centralising Navbar + SkipLink + TOC + landmarks prevents per-page re-invention and ensures correct z-ladder, sticky offsets, and ARIA landmark roles across all PDPs.

## WHEN
- Every Report PDP page (V1 Product Page, report detail).
- Any long-form page with sticky TOC sidebar + content column.

## WHEN NOT
- Listing page → ListingPageTemplate.
- Single-column landing page (no TOC needed).

## WHERE
`core-v2/src/templates/PDPLayoutTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `tocSections` | `TOCSectionItem[]` | — | no | TOC items. Omit = no sidebar (single col). |
| `mainContent` | `ReactNode` | — | yes | All chapter sections |
| `showFinalCTA` | `boolean` | `true` | no | Show FinalCTASection before Footer |
| `finalCTAProps` | `Partial<FinalCTASectionProps>` | `{}` | no | FinalCTASection props overrides |
| `navbarProps` | `Partial<NavbarProps>` | `{}` | no | Navbar props overrides |
| `footerProps` | `Partial<FooterProps>` | `{}` | no | Footer props overrides |

### TOCSectionItem shape
```ts
{ id: string; label: string; level?: 1 | 2 }
```

## Composition map

```
<SkipLink href="#main" />                         // a11y skip link
<header role="banner">
  <Navbar sticky z-1000 />
</header>
<div flex>
  <aside? lg:block sticky top-88px z-100 w-255px> // TOC sidebar (lg+)
    <TableOfContentsSidebar sections={...} />
  </aside>
  <main id="main" flex-1>                         // CONTENT SLOT
    {mainContent}
  </main>
</div>
<FinalCTASection? singleCTA />                    // optional
<footer role="contentinfo">
  <Footer />
</footer>
```

## Token usage

| Token | Where |
|---|---|
| `--toc-width` (255px) | TOC sidebar width |
| `--sticky-toc-top` (88px) | TOC sticky offset |
| `--z-sticky` (100) | TOC sidebar z-index |
| `--z-navbar` (1000) | Navbar z-index (internal to Navbar) |

## A11y
- `<SkipLink href="#main">` → `<main id="main">` — keyboard skip-nav pattern.
- `<header role="banner">` — correct landmark for Navbar wrapper.
- `<aside aria-label="Table of contents" role="navigation">` — named landmark.
- `<main id="main" tabIndex={-1}>` — programmatic focus target for skip-link.
- `<footer role="contentinfo">` — correct landmark.

## Z-ladder
Per CANON §3.2:
- Navbar: z-1000
- TOC sidebar: z-100
- Modal backdrop: z-9990
- Modal: z-9999

## Responsive
- TOC sidebar: `hidden lg:block` — disappears below lg (1024px).
- TableOfContentsSidebar includes its own mobile floating TOC button.
- Main content: `flex-1 min-w-0` — takes remaining width.

## Code example

```tsx
import { PDPLayoutTemplate } from '@kenresearch/design-system/templates';

<PDPLayoutTemplate
  tocSections={[
    { id: 'hero', label: 'Overview' },
    { id: 'market-size', label: 'Market Size' },
    { id: 'segments', label: 'Segments' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'faq', label: 'FAQ' },
  ]}
  mainContent={<ReportPDPSections data={reportData} />}
  showFinalCTA
  finalCTAProps={{ headline: 'Get Full Access', singleCTA: true }}
/>
```
