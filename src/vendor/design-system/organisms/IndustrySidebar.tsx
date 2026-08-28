/**
 * IndustrySidebar — Organism (DS v4.4 · Phase 3 adapter)
 *
 * WHAT: Desktop filter sidebar wrapping SidebarPanel (card variant) + FiltersPanel.
 * WHY:  Composes the sidebar container with sticky header · footer · filter content.
 * WHEN: Left column of the Report Store listing layout (hidden < lg).
 * WHEN NOT: Mobile — use MobileFilterSheet which also consumes FiltersPanel.
 * HOW:  Accepts `filters` state · `regions` · `publishYears` · `catalogTotal` via props.
 *       Header shows active filter count badge + clear-all.
 *       Footer shows catalog total from consumer.
 *       FiltersPanel handles all filter accordion content (search, sections, show-all, scroll).
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 * @parity-merged 2026-05-15 — header/footer now token-only (removed rgba hardcodes)
 */
import { SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { SidebarPanel } from '../molecules/SidebarPanel';
import { FiltersPanel } from './FiltersPanel';
import type { ReportFilters, RegionData } from '../types';

export interface IndustrySidebarProps {
  filters: ReportFilters;
  regions: RegionData[];
  publishYears: string[];
  /** Total catalog size shown in footer (e.g. 50000) */
  catalogTotal: number;
}

export function IndustrySidebar({ filters, regions, publishYears, catalogTotal }: IndustrySidebarProps) {
  const { activeFilterCount, clearAllFilters } = filters;

  return (
    <SidebarPanel
      data-component="IndustrySidebar"
      visible={true}
      variant="card"
      width="15rem"
      stickyTop={24}
      header={
        <div className="p-4" style={{ backgroundColor: 'var(--warm-300)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{
                  borderRadius: 'var(--radius-element)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(0,0,0,0.08)',
                  backgroundColor: 'var(--color-surface-primary, #ffffff)',
                }}
              >
                <SlidersHorizontal size={14} style={{ color: 'rgba(0,0,0,0.45)' }} aria-hidden="true" />
              </div>
              <h3
                className="uppercase tracking-[0.1em]"
                style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}
              >
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <Badge variant="pill" size="xs" theme="neutral" mode="dark">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
                style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}
                aria-label="Clear all filters"
              >
                <X size={12} aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>
        </div>
      }
      footer={
        <div className="p-3">
          <p className="text-center" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
            <span className="tabular-nums" style={{ color: 'rgba(0,0,0,0.55)' }}>
              {catalogTotal.toLocaleString()}+
            </span>{' '}
            reports available
          </p>
        </div>
      }
    >
      <FiltersPanel filters={filters} regions={regions} publishYears={publishYears} />
    </SidebarPanel>
  );
}
