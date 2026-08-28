/**
 * MobileFilterBar — Molecule
 *
 * WHAT: Fixed bottom pill bar (mobile only) that shows active filter count
 *       and triggers the MobileFilterSheet on tap.
 * WHY:  Provides persistent, thumb-reachable filter access below lg breakpoint.
 *       Frosted-glass treatment signals elevation above content (Fitts's Law
 *       bottom-anchored targets · Material Design pattern).
 * WHEN: Always visible below lg when on a listing page.
 * WHEN NOT: ≥lg breakpoint (hidden via lg:hidden). Never inside a modal.
 * WHERE: report-store-legacy listing page · any Ken listing surface.
 * HOW:
 *   ```tsx
 *   <MobileFilterBar
 *     activeFilterCount={3}
 *     onOpenFilters={() => setSheetOpen(true)}
 *   />
 *   ```
 *
 * Canonical source: report-store-legacy `MobileFilterBar.tsx:14-61`
 * Ported: 2026-05-19 · Batch 3.3d · aura-builder
 * Status: ready
 */
'use client';

import { SlidersHorizontal } from 'lucide-react';

export interface MobileFilterBarProps {
  /** Number of active filter dimensions (0 = no badge) */
  activeFilterCount: number;
  /** Handler to open the MobileFilterSheet */
  onOpenFilters: () => void;
}

/**
 * Sticky bottom pill for mobile filter access.
 * Frosted glass (rgba + backdrop-blur) — always above content (z-[1500]).
 * Safe-area-inset-bottom respected via env() so iPhone notch doesn't clip.
 */
export function MobileFilterBar({ activeFilterCount, onOpenFilters }: MobileFilterBarProps) {
  const hasFilters = activeFilterCount > 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 lg:hidden flex justify-center pointer-events-none"
      style={{
        zIndex: 1500,
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
      }}
    >
      <button
        className="pointer-events-auto inline-flex items-center gap-2 active:scale-[0.97] transition-transform"
        style={{
          padding: hasFilters ? '10px 18px 10px 14px' : '10px 20px 10px 16px',
          borderRadius: '9999px',
          background: 'rgba(10, 10, 10, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          /* 44px min touch target height guaranteed by inline padding */
          minHeight: '44px',
        }}
        onClick={onOpenFilters}
        aria-label={
          hasFilters
            ? `Open filters, ${activeFilterCount} active`
            : 'Open filters'
        }
        aria-haspopup="dialog"
      >
        <SlidersHorizontal
          className="h-4 w-4 flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        />
        <span style={{ fontSize: 'var(--text-nav)', color: 'rgba(255,255,255,0.9)' }}>
          Filters
        </span>
        {hasFilters && (
          <span
            className="min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center tabular-nums flex-shrink-0"
            style={{
              fontSize: '10px',
              background: 'var(--brand-red)',
              color: 'white',
              fontWeight: 'var(--font-weight-medium)',
            }}
            aria-live="polite"
            aria-label={`${activeFilterCount} filters active`}
          >
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
