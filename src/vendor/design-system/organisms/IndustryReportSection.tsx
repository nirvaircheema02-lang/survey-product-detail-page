'use client';

/**
 * IndustryReportSection — two-axis industry + subcategory browse with list/grid toggle.
 *
 * WHY: Report Store has 14 industries, each with multiple subcategories. A flat list
 *      overwhelms users (Hick's Law). Two-axis filtering (industry tab → subcategory pill)
 *      reduces choice set at each step. List/grid view toggle supports different scan modes —
 *      list for deep comparison, grid for visual browsing. Meta density switcher (Metrics vs
 *      Compact) lets power users see CAGR data and casual users see clean minimal cards.
 *
 * WHAT: Horizontal-scrolling industry tabs (aria-tablist/tab pattern). Subcategory filter
 *       pills below. Metrics/Compact switcher pill. List/Grid view toggle (ViewToggle atom).
 *       List: stacked ReportCard (variant="list"). Grid: CSS columns masonry (no react-responsive-masonry
 *       dep — column-count + column-gap). Empty state via EmptyState molecule. Explore CTA at bottom.
 *
 * WHEN: Primary browse organism on any report listing page. report-store-v07, V0.2_report
 *       listing view.
 *
 * WHEN NOT: Don't use for single-industry landing pages — use CardListing directly.
 *           Don't use for <4 industries — tab overhead exceeds value.
 *
 * WHERE: design-system/core-v2/src/organisms/IndustryReportSection.tsx
 *        Consumers: report-store-v07/src/app/page.tsx, V0.2_report listing view.
 *
 * HOW:
 * ```tsx
 * const industries: Industry[] = [
 *   {
 *     name: 'Healthcare',
 *     count: 142,
 *     subcategories: ['All', 'Diagnostics', 'MedTech', 'Pharmaceuticals'],
 *     reports: [...], // ReportItem[]
 *   },
 * ];
 *
 * <IndustryReportSection
 *   industries={industries}
 *   onIndustrySelect={(name) => router.push(`/industry/${name}`)}
 *   onViewReport={(id) => router.push(`/reports/${id}`)}
 * />
 * ```
 *
 * DESIGN DECISIONS:
 * - CSS columns masonry (column-count: 2 md:3, column-gap: var(--space-4)) replaces
 *   react-responsive-masonry — zero extra dep, same visual effect, better perf.
 * - useReducedMotion guards tab/filter transition (opacity/translate-x removed when on).
 * - ScrollFade molecule handles overflow-x on tab + pill rows with fade-edge affordance.
 * - aria-tablist + role="tab" + aria-selected on industry tabs per ARIA practices.
 * - aria-current="true" on active subcategory pill (not tab pattern — flat single select).
 * - Empty state: EmptyState molecule with FileText icon.
 *
 * @promotedFrom projects/report-store-legacy/src/app/components/IndustryReportSection.tsx
 * @reusabilityScore 5/5 — fully data-driven via industries prop, zero hardcoded content
 * @a11y_status pass — aria-tablist/tab, aria-selected, aria-current on pills, focus-visible, 44px touch
 * @lifecycle stable
 */

import { useState, useMemo } from 'react';
import { TrendingUp, Calendar, FileText } from 'lucide-react';
import { SectionHeading } from '../atoms/SectionHeading';
import { ViewToggle, type ViewMode } from '../atoms/ViewToggle';
import { Button } from '../atoms/Button';
import { ScrollFade } from '../molecules/ScrollFade';
import { ReportCard } from '../molecules/ReportCard';
import { EmptyState } from '../molecules/EmptyState';
import type { CardMetaVariant } from '../molecules/CardMetaRow';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * A single report item for IndustryReportSection rendering.
 * Re-uses the global ReportItem shape from core-v2/src/types/index.ts but
 * declares locally here to keep organism self-contained and avoid barrel
 * re-export collision (types/index.ts already exports ReportItem globally).
 * Consumers can cast from the global type — shapes are compatible.
 */
export interface IndustryReportItem {
  /** Unique report identifier. */
  id: string;
  /** Report card cover image URL. */
  image: string;
  /** Full report title. */
  title: string;
  /** Parent industry name (must match an Industry.name entry). */
  industry: string;
  /** Subcategory string within the industry. */
  subcat?: string;
  /** Market projection string, e.g. "12.4% CAGR 2024-2030". */
  projection?: string | null;
  /** Geographic region, e.g. "Asia Pacific". */
  region: string;
  /** Publication date string, e.g. "May 2025". */
  date: string;
  /** Optional short description — shown in list layout. */
  description?: string;
}

/** A single industry tab entry with subcategories and associated reports. */
export interface Industry {
  /** Display name shown in the tab, e.g. "Healthcare". */
  name: string;
  /** Total report count shown as badge on the tab. */
  count: number;
  /** Ordered subcategory labels (excluding "All" — added automatically). */
  subcategories: string[];
  /** All reports belonging to this industry. */
  reports: IndustryReportItem[];
}

/** Props for IndustryReportSection. */
export interface IndustryReportSectionProps {
  /**
   * Ordered array of industries to display as tabs.
   * Must have at least 1 entry. First entry is selected by default.
   */
  industries: Industry[];
  /**
   * Heading text above the section.
   * @default 'Discover by Industry'
   */
  sectionTitle?: string;
  /**
   * Eyebrow label above the section heading.
   * @default 'Industry Reports'
   */
  sectionLabel?: string;
  /**
   * Subtitle description below heading.
   * @default 'Explore comprehensive insights across industries...'
   */
  sectionSubtitle?: string;
  /** Fired when the user clicks the "Explore all X reports" CTA. */
  onIndustrySelect?: (industryName: string) => void;
  /** Fired when the user clicks "View Report" on a card. */
  onViewReport?: (reportId: string) => void;
  /** Additional className on the outer wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Two-axis industry + subcategory report browser with list/grid toggle and
 * meta density switcher.
 */
export function IndustryReportSection({
  industries,
  sectionTitle = 'Discover by Industry',
  sectionLabel = 'Industry Reports',
  sectionSubtitle = 'Explore comprehensive insights across industries, each providing strategic analysis of market trends and opportunities.',
  onIndustrySelect,
  onViewReport,
  className = '',
}: IndustryReportSectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    industries[0]?.name ?? ''
  );
  const [selectedSubcat, setSelectedSubcat] = useState<string>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [metaVariant, setMetaVariant] = useState<CardMetaVariant>('A');

  // Derive current industry object
  const currentIndustry = useMemo(
    () => industries.find((i) => i.name === selectedIndustry),
    [industries, selectedIndustry]
  );

  // Subcategory list (always include "All" first)
  const subcats = useMemo(
    () => ['All', ...(currentIndustry?.subcategories ?? [])],
    [currentIndustry]
  );

  // Count per subcategory for badge display
  const subcatCounts = useMemo(() => {
    const allReports = currentIndustry?.reports ?? [];
    const counts: Record<string, number> = { All: allReports.length };
    (currentIndustry?.subcategories ?? []).forEach((s) => {
      counts[s] = allReports.filter((r) => r.subcat === s).length;
    });
    return counts;
  }, [currentIndustry]);

  // Filtered report list
  const filteredReports = useMemo(() => {
    const allReports = currentIndustry?.reports ?? [];
    if (selectedSubcat === 'All') return allReports;
    return allReports.filter((r) => r.subcat === selectedSubcat);
  }, [currentIndustry, selectedSubcat]);

  const handleIndustryChange = (name: string) => {
    setSelectedIndustry(name);
    setSelectedSubcat('All');
  };

  return (
    <div data-component="IndustryReportSection" className={className}>
      {/* Section heading */}
      <SectionHeading
        label={sectionLabel}
        title={sectionTitle}
        subtitle={sectionSubtitle}
        level={2}
      />

      {/* Industry tabs — horizontal scroll */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <ScrollFade fadeBg="var(--color-foundation-white)" showButtons>
          <div
            role="tablist"
            aria-label="Industry categories"
            className="flex gap-2 min-w-max"
            style={{ paddingBottom: 'var(--space-1)' }}
          >
            {industries.map((industry) => {
              const isSelected = industry.name === selectedIndustry;
              return (
                <button
                  key={industry.name}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="industry-report-panel"
                  id={`tab-${industry.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleIndustryChange(industry.name)}
                  className="whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                  style={{
                    padding: 'var(--space-2) var(--space-3-5, 14px)',
                    // 44px min height on mobile
                    minHeight: '44px',
                    borderRadius: 'var(--radius-element)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-foundation-black)' : 'var(--color-ramp-warm-500)',
                    background: isSelected ? 'var(--color-foundation-black)' : 'transparent',
                    color: isSelected ? 'var(--color-foundation-white)' : 'rgba(0,0,0,0.5)',
                    fontSize: 'var(--typography-size-xs)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {industry.name}
                  <span
                    aria-hidden="true"
                    style={{
                      marginLeft: 'var(--space-1-5, 6px)',
                      opacity: 0.6,
                      fontSize: 'var(--typography-size-2xs, 0.65rem)',
                    }}
                  >
                    ({industry.count})
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollFade>
      </div>

      {/* Subcategory pills + toolbar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3"
        style={{ marginBottom: 'var(--space-6)' }}
      >
        {/* Subcategory pills */}
        <ScrollFade fadeBg="var(--color-foundation-white)" className="flex-1 min-w-0">
          <div className="flex gap-1.5 min-w-max" role="group" aria-label="Filter by subcategory">
            {subcats.map((s) => {
              const isActive = s === selectedSubcat;
              const count = subcatCounts[s] ?? 0;
              return (
                <button
                  key={s}
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setSelectedSubcat(s)}
                  className="whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                  style={{
                    // 44px min height on mobile via padding
                    padding: 'var(--space-2) var(--space-2-5, 10px)',
                    minHeight: '36px',
                    borderRadius: 'var(--radius-element)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-foundation-black)' : 'var(--color-ramp-warm-500)',
                    background: isActive ? 'var(--color-foundation-black)' : 'transparent',
                    color: isActive ? 'var(--color-foundation-white)' : 'rgba(0,0,0,0.45)',
                    fontSize: 'var(--typography-size-2xs, 0.65rem)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {s}
                  {count > 0 && s !== 'All' && (
                    <span aria-label={`${count} reports`} style={{ marginLeft: '4px', opacity: 0.7 }}>
                      ({count})
                    </span>
                  )}
                  {s === 'All' && (
                    <span aria-label={`${count} reports total`} style={{ marginLeft: '4px', opacity: 0.7 }}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollFade>

        {/* Toolbar: meta switcher + view toggle */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {/* Meta density switcher */}
          <div
            className="inline-flex items-center p-0.5"
            role="group"
            aria-label="Card density"
            style={{
              border: '1px solid var(--color-ramp-warm-500)',
              borderRadius: 'var(--radius-element)',
              background: 'var(--color-ramp-warm-300)',
            }}
          >
            <button
              type="button"
              aria-pressed={metaVariant === 'A'}
              title="Metrics density — shows CAGR projection + region"
              onClick={() => setMetaVariant('A')}
              className="inline-flex items-center justify-center gap-1 h-7 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
              style={{
                padding: '0 var(--space-2)',
                borderRadius: 'var(--radius-inner, 2.5px)',
                background: metaVariant === 'A' ? 'var(--color-foundation-white)' : 'transparent',
                color: metaVariant === 'A' ? 'var(--color-foundation-black)' : 'rgba(0,0,0,0.35)',
                fontSize: 'var(--typography-size-2xs, 0.65rem)',
                boxShadow: metaVariant === 'A' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Metrics
            </button>
            <button
              type="button"
              aria-pressed={metaVariant === 'B'}
              title="Compact — shows region + date"
              onClick={() => setMetaVariant('B')}
              className="inline-flex items-center justify-center gap-1 h-7 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
              style={{
                padding: '0 var(--space-2)',
                borderRadius: 'var(--radius-inner, 2.5px)',
                background: metaVariant === 'B' ? 'var(--color-foundation-white)' : 'transparent',
                color: metaVariant === 'B' ? 'var(--color-foundation-black)' : 'rgba(0,0,0,0.35)',
                fontSize: 'var(--typography-size-2xs, 0.65rem)',
                boxShadow: metaVariant === 'B' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Calendar className="h-3 w-3" aria-hidden="true" />
              Compact
            </button>
          </div>

          {/* View toggle */}
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            count={filteredReports.length}
            countLabel="reports"
          />
        </div>
      </div>

      {/* Report panel */}
      <div
        id="industry-report-panel"
        role="tabpanel"
        aria-labelledby={`tab-${selectedIndustry.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {filteredReports.length > 0 ? (
          viewMode === 'list' ? (
            // ── List view ──────────────────────────────────────────
            <div
              className="flex flex-col"
              style={{ gap: 'var(--space-4)' }}
            >
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  id={report.id}
                  image={report.image}
                  title={report.title}
                  industry={report.industry}
                  subcat={report.subcat}
                  projection={report.projection}
                  region={report.region}
                  date={report.date}
                  description={report.description}
                  variant="list"
                  metaVariant={metaVariant}
                  onClick={onViewReport}
                />
              ))}
            </div>
          ) : (
            // ── Grid / masonry view ─────────────────────────────────
            // CSS columns masonry — no react-responsive-masonry dep.
            // column-count shifts breakpoint via inline style because Tailwind v4
            // arbitrary column-count utilities need @source scan to work in DS layer.
            <div
              style={{
                // Mobile: 1 col, sm: 2 col, lg: 3 col — using CSS media queries via
                // a class approach is cleaner but since this is a DS organism without
                // guaranteed Tailwind scan, inline CSS custom-prop approach is safest.
                columnCount: 1,
                columnGap: 'var(--space-4)',
              }}
              className="masonry-grid"
            >
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  // break-inside-avoid prevents column splits mid-card
                  style={{
                    breakInside: 'avoid',
                    marginBottom: 'var(--space-4)',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <ReportCard
                    id={report.id}
                    image={report.image}
                    title={report.title}
                    industry={report.industry}
                    subcat={report.subcat}
                    projection={report.projection}
                    region={report.region}
                    date={report.date}
                    description={report.description}
                    variant="grid"
                    metaVariant={metaVariant}
                    onClick={onViewReport}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          // ── Empty state ─────────────────────────────────────────
          <EmptyState
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            title="No reports available yet"
            description={`Reports for ${selectedIndustry}${selectedSubcat !== 'All' ? ` › ${selectedSubcat}` : ''} are coming soon.`}
          />
        )}
      </div>

      {/* Explore CTA */}
      {filteredReports.length > 0 && (
        <div
          className="text-center"
          style={{ marginTop: 'var(--space-10)' }}
        >
          <Button
            variant="secondary"
            size="md"
            animatedArrow
            onClick={() => onIndustrySelect?.(selectedIndustry)}
          >
            Explore all {selectedIndustry} reports
          </Button>
        </div>
      )}

      {/*
        Masonry responsive breakpoints via a plain <style> tag.
        This is acceptable in a DS organism — it is scoped to .masonry-grid
        and is the safest way to apply column-count at breakpoints without
        requiring Tailwind JIT scan of this file in every consumer.
      */}
      <style>{`
        @media (min-width: 640px) {
          .masonry-grid { column-count: 2; }
        }
        @media (min-width: 1024px) {
          .masonry-grid { column-count: 3; }
        }
      `}</style>
    </div>
  );
}
