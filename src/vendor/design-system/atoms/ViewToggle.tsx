/**
 * ViewToggle — Atom
 *
 * WHY: Standard list/grid switch UI for listing surfaces. Provides keyboard
 *      + screen-reader-accessible toggle with Tooltip labels and 44px touch
 *      targets on mobile.
 * WHAT: Two-button pill with active-state surface, count display, Tooltip
 *       icon labels.
 * WHEN: Report Store listing · search results · category browse · any
 *       grid-or-list display surface.
 * WHEN NOT: Read-only contexts · charts (use chart-internal controls).
 *
 * HOW:
 * ```tsx
 * <ViewToggle
 *   viewMode={mode}
 *   onViewModeChange={setMode}
 *   count={42}
 *   countLabel="reports"
 * />
 * ```
 *
 * @promotedFrom Design_system_vs_26/src/app/components/ViewToggle.tsx
 * @portedDate 2026-05-12 — DS Port Batch 2 · Tier 2
 */
'use client';

import { LayoutList, LayoutGrid } from 'lucide-react';
import { Tooltip } from './Tooltip';

export type ViewMode = 'list' | 'grid';

export interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count?: number;
  countLabel?: string;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  count,
  countLabel = 'items',
  className = '',
}: ViewToggleProps) {
  return (
    <div data-component="ViewToggle" className={`flex items-center gap-3 ${className}`}>
      <div
        className="inline-flex items-center p-0.5"
        style={{
          background: 'var(--color-ramp-warm-300)',
          borderRadius: 'var(--radius-element, 5px)',
          border: '1px solid var(--color-ramp-warm-500, rgba(0,0,0,0.08))',
        }}
      >
        <Tooltip text="List view">
          <button
            type="button"
            className={`inline-flex items-center justify-center w-9 h-9 sm:w-7 sm:h-7 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${
              viewMode === 'list'
                ? 'bg-white text-black shadow-sm'
                : 'text-black/35 hover:text-black/60'
            }`}
            style={{ borderRadius: 'var(--radius-inner, 2.5px)' }}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <LayoutList className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
        <Tooltip text="Grid view">
          <button
            type="button"
            className={`inline-flex items-center justify-center w-9 h-9 sm:w-7 sm:h-7 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-sm'
                : 'text-black/35 hover:text-black/60'
            }`}
            style={{ borderRadius: 'var(--radius-inner, 2.5px)' }}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
      {count !== undefined && (
        <p
          className="text-black/40 hidden sm:block"
          style={{ fontSize: 'var(--typography-size-xs, 0.8rem)' }}
        >
          {count} {countLabel}
        </p>
      )}
    </div>
  );
}
