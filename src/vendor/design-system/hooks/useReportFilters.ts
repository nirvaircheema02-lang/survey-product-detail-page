/**
 * useReportFilters — composable filter/sort/pagination state for report listing pages.
 *
 * WHY: The OG DS v26 hook coupled filter state to data constants (ALL_REPORTS,
 *      FULL_INDUSTRIES, TAGS_BY_INDUSTRY, PAGE_SIZE) living in the same repo.
 *      When ported to DS core-v2, those constants must live in the consumer
 *      (report-store-v07, V0.2_report, etc.) — DS is component-library, not data.
 *      This parameterized version accepts data as arguments, making it truly
 *      reusable across any report listing consumer.
 *
 * WHAT: Manages 7 filter dimensions (industry · sub-industries · tags · regions ·
 *       year · format · search) + sort key + pagination. Returns state, setters,
 *       derived values (filtered/sorted/paginated results, active chip descriptors,
 *       active filter count) and action helpers (clearAll, applyFilter, toggles).
 *
 * WHEN: Report Store listing page, any page with multi-facet filter + pagination.
 *
 * WHEN NOT: Single-filter or single-dimension search — overkill. Simple search
 *           → `useState` + `useMemo` inline instead.
 *
 * WHERE: `design-system/core-v2/src/hooks/useReportFilters.ts`
 *        Consumer: `projects/report-store-v07/`, `projects/V0.2_report/`.
 *
 * HOW:
 * ```tsx
 * // Consumer passes data constants as args — DS hook is data-agnostic:
 * const filters = useReportFilters({
 *   allReports: ALL_REPORTS,          // ReportItem[]
 *   fullIndustries: FULL_INDUSTRIES,  // IndustryData[]
 *   tagsByIndustry: TAGS_BY_INDUSTRY, // Record<string, string[]>
 *   pageSize: PAGE_SIZE,              // number (default: 12)
 * });
 *
 * // Destructure what you need:
 * const { paginated, activeFilterCount, clearAllFilters } = filters;
 * // Pass full filters object to FiltersPanel / ListingToolbar organisms:
 * <FiltersPanel filters={filters} />
 * ```
 *
 * FILTER DIMENSIONS:
 *   1. Industry (single-select with nested sub-industries)
 *   2. Sub-Industries (multi-select, dependent on industry)
 *   3. Tags (multi-select, dependent on industry)
 *   4. Regions (multi-select)
 *   5. Publish Year (multi-select)
 *   6. Format (multi-select)
 *   7. Search query (text)
 *   + Sort key (date | title | industry)
 *
 * @promotedFrom Design_system_vs_26 OG src/app/hooks/useReportFilters.ts
 *               Parameterized on port to remove data-coupling anti-pattern.
 * @reusabilityScore 5/5 — fully data-agnostic via constructor args
 * @lifecycle stable · v2 addition 2026-05-15
 */

import { useState, useMemo, useCallback } from 'react';
import type { ReportItem, IndustryData, SortKey, ActiveChip, ReportFilters } from '../types';

// ─── Constructor Args ─────────────────────────────────────────────────────────

/** Data arguments passed to `useReportFilters` — all consumer-owned constants. */
export interface UseReportFiltersArgs {
  /**
   * Full array of report items to filter/sort/paginate.
   * Consumer provides from their mock-data or API response.
   * @example import { ALL_REPORTS } from '@/lib/mock-data';
   */
  allReports: ReportItem[];
  /**
   * Full industry taxonomy with sub-industries for sidebar navigation.
   * @example import { FULL_INDUSTRIES } from '@/lib/mock-data';
   */
  fullIndustries: IndustryData[];
  /**
   * Map of industry label → available tags (dependent filter).
   * @example import { TAGS_BY_INDUSTRY } from '@/lib/mock-data';
   */
  tagsByIndustry: Record<string, string[]>;
  /**
   * Number of items per page for pagination.
   * @default 12
   */
  pageSize?: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages all filter + pagination state for a report listing page.
 * Returns the full `ReportFilters` contract (types/index.ts) consumed by
 * FiltersPanel, ListingToolbar, CardListing, and IndustrySidebar organisms.
 */
export function useReportFilters({
  allReports,
  fullIndustries,
  tagsByIndustry,
  pageSize = 12,
}: UseReportFiltersArgs): ReportFilters {
  // ── Core state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // ── Filter selections ──────────────────────────────────────────
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSubIndustries, setSelectedSubIndustries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  // ── Section open/close toggles ─────────────────────────────────
  const [industriesOpen, setIndustriesOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [regionsOpen, setRegionsOpen] = useState(true);
  const [publishYearOpen, setPublishYearOpen] = useState(true);

  // ── Derived: sidebar industry search ──────────────────────────
  const filteredSidebarIndustries = useMemo<IndustryData[]>(() => {
    if (!sidebarSearch) return fullIndustries;
    const q = sidebarSearch.toLowerCase();
    return fullIndustries.filter(
      (ind) =>
        ind.label.toLowerCase().includes(q) ||
        ind.subs.some((s) => s.toLowerCase().includes(q))
    );
  }, [sidebarSearch, fullIndustries]);

  // ── Derived: available tags (dependent on selected industry) ──
  const availableTags: string[] = selectedIndustry
    ? (tagsByIndustry[selectedIndustry] ?? [])
    : [];

  // ── Derived: active filter count ──────────────────────────────
  const activeFilterCount = [
    selectedIndustry !== null,
    selectedSubIndustries.length > 0,
    selectedTags.length > 0,
    selectedRegions.length > 0,
    selectedYears.length > 0,
    selectedFormats.length > 0,
    searchQuery !== '',
  ].filter(Boolean).length;

  // ── Actions ───────────────────────────────────────────────────
  const applyFilter = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedIndustry(null);
    setSelectedSubIndustries([]);
    setSelectedTags([]);
    setSelectedRegions([]);
    setSelectedYears([]);
    setSelectedFormats([]);
    setSearchQuery('');
    setSortBy('date');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const selectIndustry = useCallback(
    (label: string) => {
      setSelectedIndustry((prev) => {
        const next = prev === label ? null : label;
        setSelectedSubIndustries([]);
        setSelectedTags([]);
        return next;
      });
      applyFilter();
    },
    [applyFilter]
  );

  const toggleSubIndustry = useCallback(
    (sub: string) => {
      setSelectedSubIndustries((prev) =>
        prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
      );
      applyFilter();
    },
    [applyFilter]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
      applyFilter();
    },
    [applyFilter]
  );

  const toggleRegion = useCallback(
    (region: string) => {
      setSelectedRegions((prev) =>
        prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
      );
      applyFilter();
    },
    [applyFilter]
  );

  const toggleYear = useCallback(
    (year: string) => {
      setSelectedYears((prev) =>
        prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
      );
      applyFilter();
    },
    [applyFilter]
  );

  const toggleFormat = useCallback(
    (format: string) => {
      setSelectedFormats((prev) =>
        prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
      );
      applyFilter();
    },
    [applyFilter]
  );

  // ── Derived: filtered + sorted results ────────────────────────
  const filtered = useMemo<ReportItem[]>(() => {
    let results = allReports.filter((r) => {
      if (selectedIndustry && r.industry !== selectedIndustry) return false;
      if (
        selectedSubIndustries.length > 0 &&
        !selectedSubIndustries.includes(r.subcat)
      )
        return false;
      if (selectedRegions.length > 0 && !selectedRegions.includes(r.region))
        return false;
      if (
        selectedYears.length > 0 &&
        !selectedYears.some((y) => r.date.includes(y))
      )
        return false;
      if (
        selectedFormats.length > 0 &&
        r.format &&
        !selectedFormats.includes(r.format)
      )
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.industry.toLowerCase().includes(q) &&
          !r.subcat.toLowerCase().includes(q) &&
          !(r.description ?? '').toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    results = [...results].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'industry') return a.industry.localeCompare(b.industry);
      return 0; // 'date' — default order from array
    });

    return results;
  }, [
    allReports,
    selectedIndustry,
    selectedSubIndustries,
    selectedRegions,
    selectedYears,
    selectedFormats,
    searchQuery,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ── Derived: active chip descriptors (for filter chip strip) ──
  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];

    selectedSubIndustries.forEach((s) =>
      chips.push({
        label: s,
        category: 'SUB-INDUSTRY',
        onRemove: () => {
          setSelectedSubIndustries((prev) => prev.filter((x) => x !== s));
          applyFilter();
        },
      })
    );
    selectedTags.forEach((t) =>
      chips.push({
        label: t,
        category: 'TAG',
        onRemove: () => {
          setSelectedTags((prev) => prev.filter((x) => x !== t));
          applyFilter();
        },
      })
    );
    selectedRegions.forEach((r) =>
      chips.push({
        label: r,
        category: 'REGION',
        onRemove: () => {
          setSelectedRegions((prev) => prev.filter((x) => x !== r));
          applyFilter();
        },
      })
    );
    selectedYears.forEach((y) =>
      chips.push({
        label: y,
        category: 'YEAR',
        onRemove: () => {
          setSelectedYears((prev) => prev.filter((x) => x !== y));
          applyFilter();
        },
      })
    );
    selectedFormats.forEach((f) =>
      chips.push({
        label: f,
        category: 'FORMAT',
        onRemove: () => {
          setSelectedFormats((prev) => prev.filter((x) => x !== f));
          applyFilter();
        },
      })
    );
    if (searchQuery) {
      chips.push({
        label: `“${searchQuery}”`,
        category: 'SEARCH',
        onRemove: () => {
          setSearchQuery('');
          applyFilter();
        },
      });
    }

    return chips;
  }, [
    selectedSubIndustries,
    selectedTags,
    selectedRegions,
    selectedYears,
    selectedFormats,
    searchQuery,
    applyFilter,
  ]);

  // ── Return full ReportFilters contract ────────────────────────
  return {
    // State
    searchQuery, sortBy, currentPage, sidebarSearch,
    selectedIndustry, selectedSubIndustries, selectedTags,
    selectedRegions, selectedYears, selectedFormats,
    // Section toggles
    industriesOpen, tagsOpen, regionsOpen, publishYearOpen,
    // Setters
    setSearchQuery, setSortBy, setCurrentPage, setSidebarSearch,
    setSelectedIndustry, setSelectedSubIndustries, setSelectedTags,
    setSelectedRegions, setSelectedYears, setSelectedFormats,
    setIndustriesOpen, setTagsOpen, setRegionsOpen, setPublishYearOpen,
    // Derived
    filteredSidebarIndustries, availableTags, activeFilterCount,
    filtered, totalPages, paginated, activeChips,
    // Actions
    clearAllFilters, applyFilter, handlePageChange,
    selectIndustry, toggleSubIndustry, toggleTag, toggleRegion, toggleYear, toggleFormat,
  };
}
