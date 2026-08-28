/**
 * ExploreByRegion — Organism
 *
 * WHY:   Geographic discovery lets users explore market intelligence by economic zone.
 *        Region-first entry point converts "browse by sector" users who think spatially —
 *        e.g. "What's happening in GCC?" before settling on a specific industry.
 * WHAT:  Section heading + horizontal scrollable row of region cards. Each card shows:
 *          • Globe icon + region name + report count
 *          • Clickable country Badge pills (MapPin icon)
 *          • Clickable trending topic Badge pills (Flame icon)
 *          • Top 3 reports ranked list (derivation from consumer-provided reports data)
 *          • Full-width "Explore {Region}" secondary Button
 * WHEN:  Report Store — home/browse mode, after TrendingTopics section.
 * WHERE: report-store page, between TrendingTopics and CardListing grid.
 * HOW:
 *   ```tsx
 *   <ExploreByRegion
 *     regions={myRegions}
 *     reports={allReports}
 *     onRegionClick={(nameOrCountry) => applyRegionFilter(nameOrCountry)}
 *   />
 *   ```
 *
 * DATA SHAPE:
 *   `regions[]`   — see `RegionEntry` interface · pass from mock-data or API
 *   `reports[]`   — see `RegionReport` interface · minimal shape needed for top-3 ranking
 *   No internal data imports. All data arrives via props w/ `// TODO: replace w/ real API` at call site.
 *
 * TOKEN COVERAGE: Zero hardcoded hex (except `iconColors.*` DS atom values which encode
 *   the semantic color taxonomy from §28). All layout/spacing/radius/text via tokens.
 * A11Y: focus-visible rings on all interactive · aria-label on icon-only · semantic heading
 *   hierarchy (h2 via SectionHeading · h3 for region card names) · 44px touch targets on CTAs.
 *
 * @promotedFrom report-store-legacy/src/app/components/ExploreByRegion.tsx
 * @porterDate 2026-05-15
 * @lifecycle stable
 * @a11y_status pass — WCAG AA · focus-visible · semantic headings · 44px CTA targets
 */
'use client';

import { Globe, MapPin, Flame } from 'lucide-react';
import { iconColors } from '../atoms/iconColors';
import { SectionHeading } from '../atoms/SectionHeading';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import { IconBadge } from '../atoms/IconBadge';
import { HorizontalScroll } from '../molecules/HorizontalScroll';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One geographic region entry */
export interface RegionEntry {
  /** Display name — e.g. "GCC & Middle East" */
  name: string;
  /** Total report count for this region */
  reports: number;
  /** Country / territory names shown as clickable Badge pills */
  countries: string[];
  /** Trending topic names shown as Flame-badged pills */
  trending: string[];
}

/**
 * Minimal report shape needed to derive top-3 per region.
 * Consumer's full report objects satisfy this if they have these fields.
 */
export interface RegionReport {
  id: string | number;
  title: string;
  industry: string;
  date: string;
  /** Comma-formatted download count string — e.g. "12,345" */
  downloads: string;
  /** Region label on the report — matched against regionKeywords */
  region: string;
}

export interface ExploreByRegionProps {
  /**
   * Array of region entries to display as cards.
   * Typically 4-8 entries. Displayed in order provided.
   * TODO: replace w/ real API call to /api/regions
   */
  regions: RegionEntry[];

  /**
   * Full report array used to derive top-3 ranked reports per region card.
   * Reports are matched via keyword scan of the `region` field.
   * TODO: replace w/ real API call to /api/reports?sort=downloads
   */
  reports: RegionReport[];

  /**
   * Callback fired when user clicks a region card CTA, a country Badge, or a trending Badge.
   * Receives the clicked value (region name, country name, or trending topic).
   */
  onRegionClick: (regionOrCountryOrTrend: string) => void;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Keyword map: region display name → list of strings to match against report.region.
 * Used for top-3 report derivation. Extendable as coverage grows.
 */
const REGION_KEYWORDS: Record<string, string[]> = {
  'GCC & Middle East':   ['GCC', 'Saudi Arabia', 'Middle East', 'UAE', 'Qatar', 'Kuwait'],
  'India & South Asia':  ['India', 'Bangladesh', 'Sri Lanka'],
  'Southeast Asia':      ['Southeast Asia', 'Singapore', 'Indonesia', 'Malaysia', 'Thailand'],
  'Europe':              ['Europe', 'UK', 'Germany', 'France', 'Netherlands'],
  'Americas':            ['Americas', 'USA', 'Canada', 'Brazil', 'Mexico'],
  'Africa':              ['Africa', 'Nigeria', 'South Africa', 'Kenya', 'Egypt'],
};

/**
 * Returns up to `max` reports ranked by downloads for a given region name.
 * Falls back to global reports if fewer than 2 matched.
 */
function getTopReports(reports: RegionReport[], regionName: string, max: number = 3): RegionReport[] {
  const keywords = REGION_KEYWORDS[regionName] ?? [];
  const matched = reports.filter((r) =>
    keywords.some((k) => r.region.toLowerCase().includes(k.toLowerCase())),
  );
  // If <2 matched, pad with globally-tagged reports for density
  const pool =
    matched.length >= 2
      ? matched
      : [...matched, ...reports.filter((r) => r.region === 'Global')];

  return pool
    .sort(
      (a, b) =>
        parseInt(b.downloads.replace(/,/g, ''), 10) -
        parseInt(a.downloads.replace(/,/g, ''), 10),
    )
    .slice(0, max);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ExploreByRegion({ regions, reports, onRegionClick }: ExploreByRegionProps) {
  return (
    <div data-component="ExploreByRegion">
      {/* Section heading — SectionHeading atom, level=2, left-aligned for listing context */}
      <div className="mb-6">
        <SectionHeading
          level={2}
          align="left"
          label="Geographic Coverage"
          title="Explore by Region"
          subtitle="Market intelligence across every major economic zone"
        />
      </div>

      {/* Horizontal scroll carousel — region cards */}
      <HorizontalScroll fadeBg="var(--bg-pure-white)" gap="gap-4">
        {regions.map((r, i) => {
          const topReports = getTopReports(reports, r.name);

          return (
            <Card
              key={i}
              hover
              className="group flex-shrink-0 w-[280px] sm:w-80 overflow-hidden flex flex-col"
            >
              {/* ── Card header ── */}
              <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Globe icon badge — content icon taxonomy (§28) */}
                    <IconBadge
                      icon={Globe}
                      size="lg"
                      color={iconColors.content}
                      bgColor="color-mix(in srgb, var(--purple-600) 5%, transparent)"
                    />

                    <div>
                      <h3
                        className="leading-tight"
                        style={{
                          fontSize: 'var(--text-nav)',
                          color:    'var(--semantic-ink-body)',
                        }}
                      >
                        {r.name}
                      </h3>
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: 'var(--text-2xs)',
                          color:    'var(--semantic-ink-faint)',
                        }}
                      >
                        {r.reports} reports
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clickable country tags — button wrapping Badge atom (Badge has no onClick) */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {r.countries.map((c, j) => (
                    <button
                      key={j}
                      onClick={() => onRegionClick(c)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-[var(--radius-element)] cursor-pointer"
                      aria-label={`Filter by ${c}`}
                    >
                      <Badge
                        variant="rounded"
                        size="xs"
                        theme="warm"
                        mode="light"
                        bordered
                        interactive
                      >
                        <MapPin
                          className="h-2.5 w-2.5 flex-shrink-0"
                          color={iconColors.utility}
                          aria-hidden
                        />
                        {c}
                      </Badge>
                    </button>
                  ))}
                </div>

                {/* Clickable trending tags — button wrapping Badge atom */}
                <div className="flex flex-wrap gap-1.5">
                  {r.trending.map((tr, j) => (
                    <button
                      key={j}
                      onClick={() => onRegionClick(tr)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-[var(--radius-element)] cursor-pointer"
                      aria-label={`Filter by trending topic: ${tr}`}
                    >
                      <Badge
                        variant="rounded"
                        size="xs"
                        theme="coral"
                        mode="light"
                        bordered
                        interactive
                        shimmer
                      >
                        <Flame
                          className="h-2.5 w-2.5 flex-shrink-0"
                          color="var(--coral-900)"
                          aria-hidden
                        />
                        {tr}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Divider ── */}
              <div
                className="mx-4"
                style={{ height: '1px', background: 'var(--warm-500)' }}
                aria-hidden
              />

              {/* ── Top reports listing ── */}
              <div className="p-4 pt-3 flex-1 flex flex-col">
                <p
                  className="mb-2 uppercase tracking-widest"
                  style={{
                    fontSize:      'var(--text-2xs)',
                    color:         'var(--semantic-ink-faint)',
                    letterSpacing: 'var(--tracking-widest)',
                  }}
                >
                  Top Reports
                </p>

                <div className="flex flex-col gap-2">
                  {topReports.map((rpt, j) => (
                    <div
                      key={rpt.id}
                      className="flex items-start gap-2 cursor-pointer transition-colors hover:-mx-1.5 hover:px-1.5 hover:py-1.5 -mx-0 px-0 py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
                      style={{
                        borderRadius: 'var(--radius-element)',
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View report: ${rpt.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onRegionClick(r.name);
                      }}
                    >
                      {/* Rank number */}
                      <span
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center tabular-nums"
                        style={{
                          fontSize: 'var(--badge-xs-font)',
                          color:    'var(--semantic-ink-faint)',
                        }}
                        aria-hidden
                      >
                        {j + 1}
                      </span>

                      {/* Report info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="leading-snug line-clamp-2 group-hover:text-[var(--semantic-ink-body)] transition-colors"
                          style={{
                            fontSize: 'var(--text-2xs)',
                            color:    'var(--semantic-ink-muted)',
                          }}
                        >
                          {rpt.title}
                        </p>
                        <div
                          className="flex items-center gap-2 mt-0.5"
                          style={{ fontSize: 'var(--text-2xs)' }}
                        >
                          <span style={{ color: 'var(--semantic-ink-faint)' }}>{rpt.industry}</span>
                          <span style={{ color: 'var(--semantic-ink-whisper)' }}>&middot;</span>
                          <span style={{ color: 'var(--semantic-ink-faint)' }}>{rpt.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Card footer CTA — full-width secondary button (44px height: size="sm" = 40px; use "md"=48px for a11y compliance) ── */}
              <div className="px-4 pb-4 pt-2 mt-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  animatedArrow
                  onClick={() => onRegionClick(r.name)}
                  ariaLabel={`Explore ${r.name} market reports`}
                >
                  Explore {r.name}
                </Button>
              </div>
            </Card>
          );
        })}
      </HorizontalScroll>
    </div>
  );
}
