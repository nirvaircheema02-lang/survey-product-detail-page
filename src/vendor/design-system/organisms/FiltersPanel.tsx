/**
 * FiltersPanel — Organism (DS v4.4)
 *
 * WHAT: Complete sidebar filter content composed from DS atoms. Renders search,
 *       Industries tree, Tags, Regions, and Publish Year accordion sections.
 * WHY:  Extracted from ReportStoreListingDemoContent as a shared reusable organism.
 *       Shared between desktop SidebarPanel and MobileFilterSheet.
 * WHEN: Inside SidebarPanel (desktop) and MobileFilterSheet (mobile).
 * WHEN NOT: Don't use for single-dimension search — overkill.
 * HOW:  Passes `filters` state object (ReportFilters contract from useReportFilters).
 *       Sections auto-open when sidebarSearch produces matches.
 *       Show-all/collapse controls visible when industries.length > SHOW_ALL_THRESHOLD.
 *       Active sub-industry scrolls into view on auto-expand (useReducedMotion-guarded).
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS: var(--text-xs) for labels/items/empty states, var(--text-card-micro) for counts only.
 *
 * @parity-merged legacy IndustrySidebar.tsx features on 2026-05-15:
 *   ✓ Search auto-opens matching sections
 *   ✓ Auto-scroll to active sub (useReducedMotion guarded)
 *   ✓ Show-all/collapse for 8+ industries
 *   ✓ Per-section empty states (tags / regions / years)
 *   ✓ Tags disabled until industry selected
 *   ✓ Per-section count badges (already in FilterSectionHeader)
 */
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronRight, ChevronDown, Layers, Tag, MapPin, Calendar, Lock } from 'lucide-react';
import { FilterSearchInput } from '../atoms/FilterSearchInput';
import { FilterSectionHeader } from '../atoms/FilterSectionHeader';
import { FilterCheckboxItem } from '../atoms/FilterCheckboxItem';
import type { ReportFilters, RegionData } from '../types';

/** Industries are truncated to this count until user clicks "Show all". */
const SHOW_ALL_THRESHOLD = 8;

/** Section keys for search-match auto-open override. */
type SectionKey = 'industries' | 'tags' | 'regions' | 'years';

export interface FiltersPanelProps {
  filters: ReportFilters;
  /** Available regions w/ counts · consumer owns canonical list */
  regions: RegionData[];
  /** Available publish years · consumer owns canonical list */
  publishYears: string[];
}

export function FiltersPanel({ filters, regions, publishYears }: FiltersPanelProps) {
  const {
    sidebarSearch, setSidebarSearch,
    filteredSidebarIndustries,
    selectedIndustry, selectIndustry,
    selectedSubIndustries, toggleSubIndustry,
    industriesOpen, setIndustriesOpen,
    selectedTags, toggleTag,
    availableTags, tagsOpen, setTagsOpen,
    selectedRegions, toggleRegion,
    regionsOpen, setRegionsOpen,
    selectedYears, toggleYear,
    publishYearOpen, setPublishYearOpen,
  } = filters;

  /* ── Show-all local state ──────────────────────────────────────── */
  const [showAllIndustries, setShowAllIndustries] = useState(false);

  /* ── Reduced-motion ────────────────────────────────────────────── */
  const shouldReduceMotion = useReducedMotion();

  /* ── Scroll container ref for auto-scroll-to-active-sub ────────── */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ── Auto-scroll to active sub when selectedSubIndustries changes ─ */
  useEffect(() => {
    if (selectedSubIndustries.length === 0) return;
    // Wait for DOM paint + any accordion animation
    const raf = requestAnimationFrame(() => {
      const delay = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const activeEl = container.querySelector<HTMLElement>('[data-sub-active="true"]');
        if (activeEl) {
          activeEl.scrollIntoView({
            behavior: shouldReduceMotion ? 'instant' : 'smooth',
            block: 'nearest',
          });
        }
      }, 220);
      return () => clearTimeout(delay);
    });
    return () => cancelAnimationFrame(raf);
  }, [selectedSubIndustries, shouldReduceMotion]);

  /* ── Search-derived filter data ────────────────────────────────── */
  const q = sidebarSearch.toLowerCase().trim();

  const filteredTags = useMemo(
    () => (q ? availableTags.filter((t) => t.toLowerCase().includes(q)) : availableTags),
    [q, availableTags]
  );

  const filteredRegions = useMemo(
    () => (q ? regions.filter((r) => r.label.toLowerCase().includes(q)) : regions),
    [q, regions]
  );

  const filteredYears = useMemo(
    () => (q ? publishYears.filter((y) => y.includes(q)) : publishYears),
    [q, publishYears]
  );

  /* ── Industries slice: respect show-all threshold ──────────────── */
  const visibleIndustries = useMemo(() => {
    if (q || showAllIndustries) return filteredSidebarIndustries;
    return filteredSidebarIndustries.slice(0, SHOW_ALL_THRESHOLD);
  }, [q, showAllIndustries, filteredSidebarIndustries]);

  /* ── Search-match auto-open: overrides user accordion state ───── */
  const searchMatchSections = useMemo((): Set<SectionKey> | null => {
    if (!q) return null;
    const matches = new Set<SectionKey>();
    if (filteredSidebarIndustries.length > 0) matches.add('industries');
    if (filteredTags.length > 0) matches.add('tags');
    if (filteredRegions.length > 0) matches.add('regions');
    if (filteredYears.length > 0) matches.add('years');
    return matches;
  }, [q, filteredSidebarIndustries, filteredTags, filteredRegions, filteredYears]);

  const isSectionOpen = (key: SectionKey): boolean => {
    if (searchMatchSections) return searchMatchSections.has(key);
    switch (key) {
      case 'industries': return industriesOpen;
      case 'tags':       return tagsOpen;
      case 'regions':    return regionsOpen;
      case 'years':      return publishYearOpen;
    }
  };

  const totalIndustries = filteredSidebarIndustries.length;

  return (
    <div data-component="FiltersPanel" ref={scrollContainerRef}>
      {/* Search within filters */}
      <div className="px-3 py-2.5" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}>
        <FilterSearchInput value={sidebarSearch} onChange={setSidebarSearch} placeholder="Search filters..." />
      </div>

      {/* ── INDUSTRIES ── */}
      <div style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}>
        <FilterSectionHeader
          icon={<Layers size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />}
          label="Industries"
          activeCount={selectedIndustry ? 1 : 0}
          isOpen={isSectionOpen('industries')}
          onToggle={() => setIndustriesOpen(!industriesOpen)}
          active={!!selectedIndustry}
        />
        {isSectionOpen('industries') && (
          <div className="pb-0">
            <div className="py-0.5">
              {visibleIndustries.map((ind) => {
                const isSelected = selectedIndustry === ind.label;
                return (
                  <div key={ind.label}>
                    {/* Industry row */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
                      style={{
                        borderLeftWidth: '3px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: isSelected ? 'rgb(0,0,0)' : 'rgba(0,0,0,0)',
                        backgroundColor: isSelected ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0)',
                      }}
                      onClick={() => selectIndustry(ind.label)}
                      aria-pressed={isSelected}
                      aria-expanded={isSelected && (ind.subs?.length ?? 0) > 0}
                    >
                      <span
                        className="p-0.5 flex-shrink-0"
                        style={{ borderRadius: 'var(--radius-inner)' }}
                        aria-hidden="true"
                      >
                        {isSelected
                          ? <ChevronDown size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />
                          : <ChevronRight size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />
                        }
                      </span>
                      <span
                        className="flex-1 text-left truncate transition-colors"
                        title={ind.label}
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: isSelected ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)',
                        }}
                      >
                        {ind.label}
                      </span>
                      <span
                        className="tabular-nums flex-shrink-0"
                        aria-label={`${ind.count.toLocaleString()} reports`}
                        style={{
                          fontSize: 'var(--text-card-micro)',
                          color: isSelected ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)',
                        }}
                      >
                        {ind.count.toLocaleString()}
                      </span>
                    </button>

                    {/* Nested sub-industries */}
                    {isSelected && ind.subs && ind.subs.length > 0 && (
                      <div
                        className="ml-7"
                        style={{ borderLeftWidth: '1px', borderLeftStyle: 'solid', borderLeftColor: 'rgba(0,0,0,0.08)' }}
                        role="group"
                        aria-label={`${ind.label} sub-categories`}
                      >
                        {[...ind.subs].sort((a, b) => a.localeCompare(b)).map((sub) => {
                          const isSubActive = selectedSubIndustries.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              className="block w-full text-left px-3 py-1.5 transition-all duration-100 truncate cursor-pointer hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
                              title={sub}
                              aria-pressed={isSubActive}
                              data-sub-active={isSubActive}
                              style={{
                                fontSize: 'var(--text-xs)',
                                color: isSubActive ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.4)',
                                backgroundColor: isSubActive ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0)',
                                borderLeftWidth: '2px',
                                borderLeftStyle: 'solid',
                                borderLeftColor: isSubActive ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
                                marginLeft: '-1px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubIndustry(sub);
                              }}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Search: no matches */}
              {q && filteredSidebarIndustries.length === 0 && (
                <p className="py-2 px-3" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}>
                  No matching industries
                </p>
              )}

              {/* Show-all / collapse toggle — only when above threshold and not searching */}
              {!q && totalIndustries > SHOW_ALL_THRESHOLD && (
                <button
                  type="button"
                  className="w-full text-center py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
                  style={{
                    fontSize: 'var(--text-xs)',
                    borderTopWidth: '1px',
                    borderTopStyle: 'solid',
                    borderTopColor: 'rgba(0,0,0,0.06)',
                    color: 'rgba(0,0,0,0.45)',
                  }}
                  onClick={() => setShowAllIndustries((prev) => !prev)}
                >
                  {showAllIndustries
                    ? 'Collapse industries'
                    : `+ Show all ${totalIndustries} industries`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── TAGS (checkbox, dependent on industry) ── */}
      <div style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}>
        <FilterSectionHeader
          icon={<Tag size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />}
          label="Tags"
          activeCount={selectedTags.length}
          isOpen={isSectionOpen('tags')}
          onToggle={() => selectedIndustry && setTagsOpen(!tagsOpen)}
          active={selectedTags.length > 0}
          disabled={!selectedIndustry}
          trailing={!selectedIndustry ? <Lock size={12} style={{ color: 'rgba(0,0,0,0.2)' }} aria-hidden="true" /> : undefined}
          showChevron={!!selectedIndustry}
        />
        {selectedIndustry && isSectionOpen('tags') ? (
          <div className="pb-0 scrollbar-hide" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <FilterCheckboxItem
                  key={tag}
                  label={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
              ))
            ) : (
              <p className="px-4 py-3 text-center" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}>
                No matches found
              </p>
            )}
          </div>
        ) : !selectedIndustry ? (
          <div className="px-4 pb-2.5" style={{ marginTop: '-4px' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)', lineHeight: 1.4 }}>
              Select an industry first to filter by tags
            </p>
          </div>
        ) : null}
      </div>

      {/* ── REGIONS (checkbox) ── */}
      <div style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}>
        <FilterSectionHeader
          icon={<MapPin size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />}
          label="Regions"
          activeCount={selectedRegions.length}
          isOpen={isSectionOpen('regions')}
          onToggle={() => setRegionsOpen(!regionsOpen)}
          active={selectedRegions.length > 0}
        />
        {isSectionOpen('regions') && (
          <div className="pb-0 scrollbar-hide" style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {filteredRegions.length > 0 ? (
              filteredRegions.map((reg) => (
                <FilterCheckboxItem
                  key={reg.label}
                  label={reg.label}
                  count={reg.count}
                  checked={selectedRegions.includes(reg.label)}
                  onChange={() => toggleRegion(reg.label)}
                />
              ))
            ) : (
              <p className="px-4 py-3 text-center" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}>
                No matches found
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── PUBLISH YEAR (checkbox) ── */}
      <div style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}>
        <FilterSectionHeader
          icon={<Calendar size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />}
          label="Publish Year"
          activeCount={selectedYears.length}
          isOpen={isSectionOpen('years')}
          onToggle={() => setPublishYearOpen(!publishYearOpen)}
          active={selectedYears.length > 0}
        />
        {isSectionOpen('years') && (
          <div className="pb-0">
            {filteredYears.length > 0 ? (
              filteredYears.map((year) => (
                <FilterCheckboxItem
                  key={year}
                  label={year}
                  checked={selectedYears.includes(year)}
                  showTooltip={false}
                  onChange={() => toggleYear(year)}
                />
              ))
            ) : (
              <p className="px-4 py-3 text-center" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.3)' }}>
                No matches found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
