/**
 * ListingToolbar — Organism (DS v4.3)
 *
 * WHAT: Toolbar above the card grid with back nav, count + industry context, view toggle, sort, and mobile filter trigger.
 * WHY:  Extracted from ReportStoreListingDemoContent inline header into a reusable organism.
 * WHEN: Top of the listing content area (above CardListing).
 * HOW:  Renders [back] [count in Industry] ... [mobile-filter-btn] [view-toggle] [sort-select]
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 * FONT TOKENS: var(--text-xs) for labels, var(--radius-element) for radius.
 */
import { ArrowLeft, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { ViewToggle, type ViewMode } from '../atoms/ViewToggle';
import type { SortKey, SortOption } from '../types';

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: 'Most recent', value: 'date' },
  { label: 'Title (A→Z)', value: 'title' },
  { label: 'Industry', value: 'industry' },
];

export interface ListingToolbarProps {
  resultCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
  /** Sort options · defaults to date · title · industry */
  sortOptions?: SortOption[];
  activeFilterCount?: number;
  onOpenMobileFilters?: () => void;
  onBack?: () => void;
  selectedIndustry?: string | null;
}

export function ListingToolbar({
  resultCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  activeFilterCount = 0,
  onOpenMobileFilters,
  onBack,
  selectedIndustry,
}: ListingToolbarProps) {
  return (
    <div data-component="ListingToolbar" className="flex items-center gap-3 mb-4 flex-wrap">
      {/* Back nav */}
      <button
        onClick={onBack}
        aria-label="Back to Report Store"
        className="inline-flex items-center gap-1.5 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm min-h-[44px]"
        style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline" aria-hidden="true">Back to Report Store</span>
      </button>

      <div className="h-5 w-px flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />

      <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}>
        <span className="tabular-nums" style={{ color: 'rgba(0,0,0,0.7)' }}>{resultCount}</span>
        {' '}reports
        {selectedIndustry && (
          <>
            {' '}in{' '}
            <span style={{ color: 'rgba(0,0,0,0.85)' }}>{selectedIndustry}</span>
          </>
        )}
      </p>

      <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
        {/* Mobile filter trigger — visible < lg */}
        {onOpenMobileFilters && (
          <button
            className="lg:hidden inline-flex items-center justify-center relative min-h-[44px] min-w-[44px] p-2 transition-colors hover:bg-black/[0.03] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
            aria-label="Open filters"
            style={{ borderRadius: 'var(--radius-element)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.1)' }}
            onClick={onOpenMobileFilters}
          >
            <SlidersHorizontal size={16} style={{ color: 'rgba(0,0,0,0.5)' }} />
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center"
                style={{ fontSize: '9px', backgroundColor: 'rgba(0,0,0,1)', color: 'rgba(255,255,255,1)' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* ViewToggle */}
        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          count={resultCount}
          countLabel="reports"
        />

        {/* Sort */}
        <div
          className="flex items-center gap-1.5 px-3 py-2"
          style={{
            borderRadius: 'var(--radius-element)',
            fontSize: 'var(--text-xs)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0,0,0,0.08)',
          }}
        >
          <ArrowUpDown size={12} style={{ color: 'rgba(0,0,0,0.5)' }} />
          <label htmlFor="listing-sort" className="sr-only">Sort reports by</label>
          <select
            id="listing-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="bg-transparent border-none outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
            style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.6)' }}
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
