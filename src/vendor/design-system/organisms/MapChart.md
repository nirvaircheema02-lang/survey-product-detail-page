# MapChart · Organism

**Batch:** 3.3a · 2026-05-19  
**Tier:** Organism  
**Source:** NEW research-driven (react-simple-maps · MIT)  
**Status:** PORTED

---

## WHY
`@ken-research/charts` provides time-series + bar charts but no choropleth map. Regional market data (GCC, APAC, etc.) has geographic distribution that a flat bar chart cannot communicate. `react-simple-maps` is MIT-licensed, SVG-based, and accessible — lower footprint than Highcharts Maps.

## WHAT
- Choropleth SVG map via `react-simple-maps` `ComposableMap` + `Geographies` + `Geography`
- Color scale: linear interpolation across 6-step brand ramp (purple / periwinkle / coral)
- Tooltip: floating card on hover (position: fixed, near cursor)
- Legend: 5-step gradient strip below map with min/max value labels
- Hover highlight: region darkens + stroke widens
- Keyboard: each region is `role="button"` + `tabIndex=0` (interactive regions only) · Enter/Space fires `onRegionClick`
- Screen reader: SVG `<title>` + `<desc>` with full region data · per-region `aria-label`
- `useReducedMotion()` disables fill transition

## WHEN
- RegionalComparison left ChartCard slot
- MarketOverview geographic breakdowns
- Any section needing color-coded geographic distribution

## WHEN NOT
- Time-series → AreaChart / LineChart (Ken Charts)
- Non-geographic comparisons → BarChart
- Org hierarchies → MindMap / TaxonomyTree

## WHERE
`core-v2/src/organisms/MapChart.tsx`  
Consumed by: `RegionalComparison` organism

## TopoJSON setup

Consumer places TopoJSON files in `/public/maps/` and passes the path via `geographyUrl`.

**Free TopoJSON sources:**
- **World atlas (110m/50m):** https://github.com/topojson/world-atlas — `world/countries-110m.json` (ISO 3166-1 alpha-3 ids, e.g. `'QAT'`, `'AUS'`)
- **US states:** https://github.com/topojson/us-atlas
- **Country-specific states/provinces:** https://github.com/highcharts/map-collection (MIT) — search by country ISO code
- **Natural Earth:** https://www.naturalearthdata.com/downloads/ (convert GeoJSON → TopoJSON with `geo2topo`)

**Region id matching:**  
`MapRegion.id` must match the TopoJSON feature's `.id` or `.properties.iso_a3` / `.properties.name`.  
Inspect with: `console.log(geographies.map(g => g.id))` inside a `Geographies` callback.

## Token usage
| Token | Usage |
|---|---|
| `--purple-100` → `--purple-600` | Choropleth color ramp (resolved to hex fallbacks in SVG) |
| `--black-200` / `--black-300` | Non-data regions fill / hover |
| `--bg-pure-white` | Map stroke color, tooltip background |
| `--border-soft` | Tooltip border |
| `--shadow-md` | Tooltip shadow |
| `--radius-xs` | Tooltip corner radius |
| `--font-sans` | Tooltip + legend typography |
| `--text-nav` / `--text-xs` | Tooltip text sizes |
| `--semantic-ink-strong` / `--semantic-ink-subtle` | Tooltip + legend text |
| `--space-2xs` → `--space-md` | Spacing throughout |

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `regions` | `MapRegion[]` | required | Dataset with id/name/value/share |
| `geographyUrl` | `string` | `'/maps/world-110m.json'` | Path to TopoJSON in /public |
| `projection` | `'geoMercator' \| 'geoEqualEarth' \| 'geoNaturalEarth1'` | `'geoMercator'` | D3 projection name |
| `colorScale` | `'purple' \| 'periwinkle' \| 'coral'` | `'purple'` | Brand token ramp |
| `height` | `number` | `400` | SVG container height in px |
| `highlightRegionId` | `string` | — | Pre-selected region on mount |
| `onRegionClick` | `(region: MapRegion) => void` | — | Click / Enter callback |
| `showLegend` | `boolean` | `true` | Show gradient legend strip |
| `showTooltip` | `boolean` | `true` | Show floating tooltip on hover |
| `ariaLabel` | `string` | Auto-generated | SVG accessible name |

## Peer warning note
`react-simple-maps@3.0.0` declares peers `react@^16.8.0||17.x||18.x`. This is a declared peer warning only — the library works fine with React 19. Pin `@types/react-simple-maps` and monitor for v4 release which will update peers.
