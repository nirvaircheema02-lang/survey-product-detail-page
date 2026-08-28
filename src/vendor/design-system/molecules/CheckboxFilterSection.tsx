/**
 * CheckboxFilterSection — Molecule
 *
 * WHAT: Collapsible accordion section in a filter sidebar. Shows a title + item count,
 *       chevron toggle, optional search input, and a list of checkbox items.
 *       Each item shows label + count. Active items show custom 14×14 checkbox
 *       with black fill + white check.
 * WHY:  Encapsulates the accordion+checkbox pattern used across FiltersPanel.
 *       Avoids duplicating the 80-line pattern per filter category.
 *       Miller's Law: grouping by category reduces cognitive load on dense filter panels.
 * WHEN: Inside FiltersPanel sidebar for each filter category (Industry, Geography, Tags, Year).
 * WHEN NOT: When using FilterAccordion molecule (full FilterChip row — different shape).
 *            Not for radio-select (use FilterChip group). Not for full-screen sheets.
 * WHERE: FiltersPanel organism (desktop sidebar, w-56). Also inside MobileFilterSheet children.
 * HOW:
 *   ```tsx
 *   <CheckboxFilterSection
 *     title="Industry"
 *     items={industryFilters}
 *     selected={selectedIndustries}
 *     onChange={setSelectedIndustries}
 *   />
 *   ```
 *
 * Canonical source: report-store-legacy `FiltersPanel.tsx:48-154` (embedded CheckboxFilterSection)
 * Ported: 2026-05-19 · Batch 3.3d · aura-builder
 * Status: ready
 */
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface FilterItem {
  /** Display label */
  name: string;
  /** Count of matching results */
  count: number;
}

export interface CheckboxFilterSectionProps {
  /** Section heading (e.g. "Industry", "Geography") */
  title: string;
  /** Available filter items */
  items: FilterItem[];
  /** Currently selected item names */
  selected: string[];
  /** Called when selection changes */
  onChange: (selected: string[]) => void;
  /** Shows inline search input above the list */
  searchable?: boolean;
  /** Start collapsed (default: false — expanded) */
  defaultCollapsed?: boolean;
  /** Max items to show before "Show more" toggle (0 = no limit) */
  showMoreThreshold?: number;
}

const ICON_COLOR = 'rgba(0,0,0,0.4)';

export function CheckboxFilterSection({
  title,
  items,
  selected,
  onChange,
  searchable = false,
  defaultCollapsed = false,
  showMoreThreshold = 0,
}: CheckboxFilterSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredItems =
    searchable && searchTerm
      ? items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

  const visibleItems =
    showMoreThreshold > 0 && !showAll
      ? filteredItems.slice(0, showMoreThreshold)
      : filteredItems;

  const hasMore =
    showMoreThreshold > 0 && filteredItems.length > showMoreThreshold && !searchTerm;

  const toggleItem = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const activeCount = items.filter((i) => selected.includes(i.name)).length;

  return (
    <div
      className="pb-4 mb-4 last:mb-0 last:pb-0"
      style={{ borderBottom: '1px solid var(--warm-500)' }}
    >
      {/* Section header — toggle button */}
      <button
        className="flex items-center justify-between w-full text-left mb-3 group"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls={`filter-section-${title}`}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="tracking-wide uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--black-600, rgba(0,0,0,0.6))',
              fontWeight: 'var(--font-weight-heading)',
            }}
          >
            {title}
          </span>
          {activeCount > 0 && (
            <span
              className="min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center tabular-nums"
              style={{
                fontSize: '9px',
                background: 'var(--text-primary)',
                color: 'white',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {activeCount}
            </span>
          )}
        </span>
        {collapsed ? (
          <ChevronDown className="h-3.5 w-3.5 transition-colors" style={{ color: ICON_COLOR }} />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 transition-colors" style={{ color: ICON_COLOR }} />
        )}
      </button>

      {/* Expanded content */}
      {!collapsed && (
        <div id={`filter-section-${title}`}>
          {/* Optional search */}
          {searchable && (
            <div className="relative mb-3">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3"
                style={{ color: ICON_COLOR }}
              />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}…`}
                className="w-full pl-7 pr-3 py-1.5 outline-none transition-all"
                style={{
                  fontSize: 'var(--text-xs)',
                  background: 'var(--warm-300)',
                  border: '1px solid var(--warm-500)',
                  borderRadius: 'var(--radius-element)',
                  color: 'var(--text-primary)',
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={`Search ${title}`}
              />
            </div>
          )}

          {/* Item list */}
          <div className="space-y-0.5">
            {visibleItems.map((item) => {
              const isChecked = selected.includes(item.name);
              return (
                <label
                  key={item.name}
                  className="flex items-center gap-2.5 cursor-pointer group py-1.5 px-1 transition-colors hover:bg-black/[0.03]"
                  style={{ borderRadius: 'var(--radius-element)' }}
                >
                  {/* Custom 14×14 checkbox */}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleItem(item.name)}
                    aria-label={item.name}
                  />
                  <div
                    className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderRadius: 'var(--radius-inner)',
                      border: `1px solid ${isChecked ? 'var(--text-primary)' : 'var(--warm-700)'}`,
                      background: isChecked ? 'var(--text-primary)' : 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    {isChecked && (
                      <svg
                        className="h-2.5 w-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="flex-1 truncate transition-colors text-black/60 group-hover:text-black/80"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {item.name}
                  </span>

                  {/* Count */}
                  <span
                    className="text-black/40 tabular-nums"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {item.count.toLocaleString()}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Show more / collapse */}
          {hasMore && (
            <button
              className="mt-2 text-black/40 hover:text-black/70 transition-colors"
              style={{ fontSize: 'var(--text-xs)' }}
              onClick={() => setShowAll((s) => !s)}
            >
              {showAll
                ? 'Show less'
                : `Show ${filteredItems.length - showMoreThreshold} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
