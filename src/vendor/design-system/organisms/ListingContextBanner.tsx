/**
 * ListingContextBanner — Unified context + filter banner
 *
 * WHY:   Report-store listing pages need a contextual bridge between the selected industry
 *        and any active filters. One component handles all 4 permutations so consumers
 *        don't branch on "which banner do I show".
 * WHAT:  Two visual zones inside one component:
 *          Zone A — Industry hero banner (dark cinematic, prominent, subcategory pills)
 *          Zone B — Compact filter chips strip (editorial light, below or standalone)
 * WHEN:  Rendered above the card grid whenever selectedIndustry OR any filter is active.
 *        Returns null when both are empty.
 * WHERE: report-store listing page — between ListingToolbar and CardListing grid.
 * HOW:
 *   ```tsx
 *   <ListingContextBanner
 *     industries={industries}
 *     selectedIndustry="Healthcare"
 *     selectedSubIndustries={["Pharma"]}
 *     selectedTags={[]}
 *     selectedRegions={[]}
 *     selectedYears={[]}
 *     searchQuery=""
 *     filteredCount={42}
 *     onRemoveIndustry={() => setIndustry(null)}
 *     onRemoveSubIndustry={(v) => removeSubIndustry(v)}
 *     onRemoveTag={(v) => removeTag(v)}
 *     onRemoveRegion={(v) => removeRegion(v)}
 *     onRemoveYear={(v) => removeYear(v)}
 *     onRemoveSearch={() => setSearch("")}
 *     onClearAll={() => clearAllFilters()}
 *     onSubcategoryClick={(sub) => addSubIndustry(sub)}
 *   />
 *   ```
 *
 * STATES:
 *   1. Empty (no industry, no filters)      → returns null
 *   2. Industry only                         → Zone A hero banner
 *   3. Filters only (no industry)            → Zone B compact chip strip (standalone, bordered)
 *   4. Industry + filters                    → Zone A above + Zone B below (joined, no border)
 *
 * TOKEN COVERAGE: Zero hardcoded hex. All colors via DS tokens + color-mix().
 * A11Y: focus-visible rings on all interactive · aria-label on dismiss/icon-only buttons
 *       · 44px touch target on hero dismiss · keyboard-accessible subcategory pills.
 *
 * @promotedFrom report-store-legacy/src/app/components/ListingContextBanner.tsx
 * @porterDate 2026-05-15
 * @lifecycle stable
 * @a11y_status pass — WCAG AA · focus-visible · aria-label · 44px dismiss target
 */
'use client';

import { X, ChevronRight, Sparkles } from 'lucide-react';
import { HorizontalScroll } from '../molecules/HorizontalScroll';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One filter pill rendered in Zone B */
interface FilterChipData {
  type: 'search' | 'subIndustry' | 'tag' | 'region' | 'year';
  label: string;
  value: string;
  onRemove: () => void;
}

/** Single industry entry from the consumer's industry catalogue */
export interface IndustryEntry {
  /** Display name — must match values passed as `selectedIndustry` */
  name: string;
  /** Total report count shown as secondary text */
  count: number;
  /** Flat list of subcategory names for the quick-link scroll row */
  subcategories: string[];
}

export interface ListingContextBannerProps {
  /**
   * Full industry catalogue. Component looks up `selectedIndustry` in this list.
   * Pass your app-level `industries` array; component never imports data internally.
   * Shape: `{ name: string; count: number; subcategories: string[] }[]`
   */
  industries: IndustryEntry[];

  /** Currently selected industry name, or null when none selected */
  selectedIndustry: string | null;

  /** Active sub-industry filter values */
  selectedSubIndustries: string[];

  /** Active tag filter values */
  selectedTags: string[];

  /** Active region filter values */
  selectedRegions: string[];

  /** Active year filter values */
  selectedYears: string[];

  /** Active full-text search query, or empty string */
  searchQuery: string;

  /** Total report count after filters applied — reserved for future use */
  filteredCount: number;

  // ---------- Callbacks ----------

  /** Fired when user clicks the dismiss X on the Zone A hero banner */
  onRemoveIndustry: () => void;

  /** Fired when user removes a specific sub-industry chip */
  onRemoveSubIndustry: (value: string) => void;

  /** Fired when user removes a specific tag chip */
  onRemoveTag: (value: string) => void;

  /** Fired when user removes a specific region chip */
  onRemoveRegion: (value: string) => void;

  /** Fired when user removes a specific year chip */
  onRemoveYear: (value: string) => void;

  /** Fired when user removes the search query chip */
  onRemoveSearch: () => void;

  /** Fired when user clicks "Clear all" — clears every active filter including industry */
  onClearAll: () => void;

  /** Fired when user clicks a subcategory quick-link pill in Zone A */
  onSubcategoryClick: (sub: string) => void;
}

// ---------------------------------------------------------------------------
// Chip type metadata
// ---------------------------------------------------------------------------

// Human-readable prefix shown inside each chip (uppercase, muted)
const CHIP_LABELS: Record<FilterChipData['type'], string> = {
  search:      'Search',
  subIndustry: 'Sub-Industry',
  tag:         'Tag',
  region:      'Region',
  year:        'Year',
};

/**
 * Per-type chip color pair (bg + border) using CSS color-mix() against DS tokens.
 * color-mix is Baseline 2023 — supported in all evergreen browsers.
 * Chip bg opacity: 6% tint. Border opacity: 14% tint.
 * Neutral (search) uses semantic tint tokens directly.
 */
const CHIP_BG: Record<FilterChipData['type'], string> = {
  search:      'var(--tint-default)',                                             // rgba(0,0,0,0.04) — search neutral
  subIndustry: 'color-mix(in srgb, var(--purple-600) 6%, transparent)',           // purple tint
  tag:         'color-mix(in srgb, var(--green-500) 6%, transparent)',            // green success tint
  region:      'color-mix(in srgb, var(--periwinkle-500) 6%, transparent)',       // trust/blue tint
  year:        'color-mix(in srgb, var(--amber-500) 6%, transparent)',            // amber warning tint
};

const CHIP_BORDER: Record<FilterChipData['type'], string> = {
  search:      'var(--border-card)',                                              // rgba(0,0,0,0.08)
  subIndustry: 'color-mix(in srgb, var(--purple-600) 14%, transparent)',
  tag:         'color-mix(in srgb, var(--green-500) 14%, transparent)',
  region:      'color-mix(in srgb, var(--periwinkle-500) 14%, transparent)',
  year:        'color-mix(in srgb, var(--amber-500) 14%, transparent)',
};

// ---------------------------------------------------------------------------
// FilterChip sub-component (Zone B pill)
// ---------------------------------------------------------------------------

function ActiveFilterChipItem({ chip }: { chip: FilterChipData }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 transition-all flex-shrink-0"
      style={{
        fontSize:     'var(--text-2xs)',
        background:   CHIP_BG[chip.type],
        border:       `1px solid ${CHIP_BORDER[chip.type]}`,
        borderRadius: 'var(--radius-element)',
        color:        'var(--semantic-ink-body)',
      }}
    >
      {/* Category prefix — micro uppercase */}
      <span
        className="uppercase flex-shrink-0"
        style={{
          fontSize:      'var(--badge-xs-font)',
          color:         'var(--semantic-ink-faint)',
          letterSpacing: 'var(--tracking-wider)',
        }}
      >
        {CHIP_LABELS[chip.type]}
      </span>

      {/* Value label */}
      <span className="truncate" style={{ maxWidth: '180px' }}>
        {chip.label}
      </span>

      {/* Remove button — 16×16 inline, aria-label for a11y */}
      <button
        className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full transition-colors ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 cursor-pointer"
        style={{ background: 'var(--tint-strong)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--border-card)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--tint-strong)'; }}
        onClick={(e) => { e.stopPropagation(); chip.onRemove(); }}
        aria-label={`Remove ${CHIP_LABELS[chip.type].toLowerCase()} filter: ${chip.label}`}
      >
        <X className="h-2.5 w-2.5" style={{ color: 'var(--semantic-ink-subtle)' }} />
      </button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ListingContextBanner({
  industries,
  selectedIndustry,
  selectedSubIndustries,
  selectedTags,
  selectedRegions,
  selectedYears,
  searchQuery,
  filteredCount: _filteredCount,
  onRemoveIndustry,
  onRemoveSubIndustry,
  onRemoveTag,
  onRemoveRegion,
  onRemoveYear,
  onRemoveSearch,
  onClearAll,
  onSubcategoryClick,
}: ListingContextBannerProps) {
  // Resolve full industry object from the prop-injected catalogue
  const industry = industries.find((i) => i.name === selectedIndustry) ?? null;

  // Build Zone B chips (excludes industry itself — shown as Zone A header)
  const chips: FilterChipData[] = [];

  if (searchQuery) {
    chips.push({
      type: 'search',
      label: `"${searchQuery}"`,
      value: searchQuery,
      onRemove: onRemoveSearch,
    });
  }
  selectedSubIndustries.forEach((s) =>
    chips.push({ type: 'subIndustry', label: s, value: s, onRemove: () => onRemoveSubIndustry(s) }),
  );
  selectedTags.forEach((t) =>
    chips.push({ type: 'tag', label: t, value: t, onRemove: () => onRemoveTag(t) }),
  );
  selectedRegions.forEach((r) =>
    chips.push({ type: 'region', label: r, value: r, onRemove: () => onRemoveRegion(r) }),
  );
  selectedYears.forEach((y) =>
    chips.push({ type: 'year', label: y, value: y, onRemove: () => onRemoveYear(y) }),
  );

  const hasIndustry = !!industry;
  const hasChips    = chips.length > 0;
  const totalActive = (hasIndustry ? 1 : 0) + chips.length;

  // State 1: nothing active → render nothing
  if (!hasIndustry && !hasChips) return null;

  return (
    <div data-component="ListingContextBanner" style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>

      {/* ════════════════════════════════════════════════
          ZONE A — Industry Hero Banner
          Variant: cinematic-dark (always, regardless of page variant)
          ════════════════════════════════════════════════ */}
      {hasIndustry && industry && (
        <div
          className="relative overflow-hidden"
          style={{
            // Dark cinematic gradient — uses canonical variant tokens
            background: `linear-gradient(135deg, var(--variant-cinematic-bg-deep) 0%, var(--variant-cinematic-bg-surface) 50%, var(--variant-cinematic-bg-secondary) 100%)`,
          }}
        >
          {/* Decorative dot grid — subtle texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border-on-dark-hairline) 1px, transparent 0)',
              backgroundSize:  '32px 32px',
            }}
            aria-hidden
          />

          {/* Decorative glow — top right (purple) */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full"
            style={{
              // Decorative purple glow blob — uses color-mix against purple-600 at 6%
              background:  'color-mix(in srgb, var(--purple-600) 6%, transparent)',
              filter:      'blur(80px)',
            }}
            aria-hidden
          />

          {/* Decorative glow — bottom left (warm white) */}
          <div
            className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full"
            style={{
              background: 'color-mix(in srgb, var(--white) 2%, transparent)',
              filter:     'blur(60px)',
            }}
            aria-hidden
          />

          <div className="relative z-10 px-5 py-5 sm:px-6">
            {/* Top row: badge + dismiss (44px touch target on dismiss) */}
            <div className="flex items-center justify-between mb-3">
              {/* "Industry Focus" eyebrow badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1"
                style={{
                  fontSize:      'var(--text-2xs)',
                  color:         'var(--semantic-ink-on-dark-strong)',
                  background:    'var(--border-on-dark-soft)',
                  borderRadius:  'var(--radius-element)',
                  letterSpacing: 'var(--tracking-wide)',
                  border:        '1px solid var(--border-on-dark-section)',
                }}
              >
                <Sparkles className="h-3 w-3" aria-hidden />
                Industry Focus
              </span>

              {/* Dismiss button — 44px touch target (min-w + min-h per a11y §13) */}
              <button
                className="flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--variant-cinematic-bg-deep)] cursor-pointer"
                style={{
                  minWidth:   '44px',
                  minHeight:  '44px',
                  background: 'var(--border-on-dark-hairline)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--border-on-dark-section)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--border-on-dark-hairline)'; }}
                onClick={onRemoveIndustry}
                aria-label="Remove industry filter"
              >
                <X className="h-3.5 w-3.5" style={{ color: 'var(--semantic-ink-on-dark-faint)' }} />
              </button>
            </div>

            {/* Heading row: industry name + report count */}
            <div className="flex items-baseline gap-3 mb-1.5">
              <h2
                style={{
                  fontFamily:  'var(--font-serif)',
                  fontWeight:  'var(--typography-weight-light)',
                  fontSize:    'clamp(var(--text-base), 3vw, var(--text-lg))',
                  lineHeight:  'var(--leading-tight)',
                  color:       'var(--variant-cinematic-text-primary)',
                }}
              >
                {industry.name}
              </h2>
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 'var(--text-2xs)',
                  color:    'var(--semantic-ink-on-dark-faint)',
                }}
              >
                {industry.count} research reports
              </span>
            </div>

            {/* Description line */}
            <p
              className="mb-4"
              style={{
                fontSize:  'var(--text-2xs)',
                maxWidth:  '480px',
                lineHeight: 'var(--leading-relaxed)',
                color:     'var(--semantic-ink-on-dark-subtle)',
              }}
            >
              Explore comprehensive market research across all{' '}
              {industry.name.toLowerCase()} sectors and sub-categories.
            </p>

            {/* Subcategory quick-links — horizontal scroll row */}
            <HorizontalScroll
              fadeBg="var(--variant-cinematic-bg-secondary)"
              gap="gap-2"
            >
              {industry.subcategories.map((sub) => {
                const isActive = selectedSubIndustries.includes(sub);
                return (
                  <button
                    key={sub}
                    className="inline-flex items-center gap-1 px-3 py-1.5 transition-all flex-shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--variant-cinematic-bg-deep)] cursor-pointer"
                    style={{
                      fontSize:     'var(--text-2xs)',
                      color:        isActive ? 'var(--semantic-ink-on-dark-strong)' : 'var(--semantic-ink-on-dark-muted)',
                      background:   isActive ? 'var(--border-on-dark-input)'        : 'var(--border-on-dark-hairline)',
                      border:       `1px solid ${isActive ? 'var(--border-on-dark-active)' : 'var(--border-on-dark-hairline)'}`,
                      borderRadius: 'var(--radius-element)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background    = 'var(--border-on-dark-card)';
                        el.style.borderColor   = 'var(--border-on-dark-section)';
                        el.style.color         = 'var(--semantic-ink-on-dark-body)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background    = 'var(--border-on-dark-hairline)';
                        el.style.borderColor   = 'var(--border-on-dark-hairline)';
                        el.style.color         = 'var(--semantic-ink-on-dark-muted)';
                      }
                    }}
                    onClick={() => onSubcategoryClick(sub)}
                    aria-pressed={isActive}
                  >
                    {sub}
                    <ChevronRight className="h-3 w-3" style={{ opacity: 0.4 }} aria-hidden />
                  </button>
                );
              })}
            </HorizontalScroll>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          ZONE B — Active Filter Chips Strip
          Variant: editorial-light (always)
          ════════════════════════════════════════════════ */}
      {hasChips && (
        <div
          className="flex items-center gap-2 px-5 py-3 flex-wrap"
          style={{
            background:   hasIndustry ? 'var(--tint-soft)' : 'var(--tint-soft)',
            borderTop:    hasIndustry ? 'none' : undefined,
            border:       hasIndustry ? undefined : `1px solid var(--border-card)`,
            borderRadius: hasIndustry ? undefined : 'var(--radius-sm)',
          }}
        >
          {/* Filter count label */}
          <span
            className="uppercase flex-shrink-0"
            style={{
              fontSize:      'var(--badge-xs-font)',
              color:         'var(--semantic-ink-faint)',
              letterSpacing: 'var(--tracking-widest)',
            }}
          >
            {chips.length} filter{chips.length > 1 ? 's' : ''}
          </span>

          {/* Divider */}
          <div
            className="w-px h-4 flex-shrink-0"
            style={{ background: 'var(--border-soft)' }}
            aria-hidden
          />

          {/* Active filter chips */}
          {chips.map((chip, i) => (
            <ActiveFilterChipItem key={`${chip.type}-${chip.value}-${i}`} chip={chip} />
          ))}

          {/* "Clear all" — only when >1 total active (industry + chips) */}
          {totalActive > 1 && (
            <>
              <div className="flex-1" aria-hidden />
              <button
                className="flex items-center gap-1 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-sm cursor-pointer"
                style={{
                  fontSize: 'var(--text-2xs)',
                  color:    'var(--semantic-ink-faint)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--semantic-ink-body)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--semantic-ink-faint)'; }}
                onClick={onClearAll}
                aria-label="Clear all active filters"
              >
                <X className="h-3 w-3" aria-hidden />
                Clear all
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
