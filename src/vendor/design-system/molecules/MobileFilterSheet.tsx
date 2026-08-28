/**
 * MobileFilterSheet
 *
 * WHY · Desktop filter sidebar is hidden at `lg:hidden` — mobile users need filter access
 *        via a thumb-reachable pattern. Bottom-sheet follows iOS/Android platform conventions
 *        (Fitts's Law: thumb zone · Miller's Law: progressive disclosure of options).
 * WHAT · Fixed-position bottom sheet with backdrop, drag handle, filter header (title +
 *        active-count badge + close button), scrollable children body, and footer with
 *        "Show N results" CTA + optional "Clear all". Props: isOpen, onClose, activeCount,
 *        resultCount, onClearAll, children (same FilterAccordion JSX as desktop sidebar).
 *        Body scroll locked while open. Closes on Escape key.
 * WHEN · Triggered by the SlidersHorizontal icon button in the listing toolbar at mobile
 *        breakpoints. Pass the same FilterAccordion children used in the desktop SidebarPanel.
 * WHEN NOT · Don't use above lg breakpoint — use SidebarPanel instead. Don't use for
 *             non-filter content (use shadcn Sheet for general overlays). Don't nest
 *             another modal inside it.
 * WHERE · report-store-legacy App.tsx + ReportStorePage.tsx ·
 *          competition-benchmarking-listing-v02 ReportStorePage.tsx (BenchmarkMobileFilterSheet
 *          is a local variant with extended props)
 * HOW ·
 *   ```tsx
 *   <MobileFilterSheet
 *     isOpen={sheetOpen}
 *     onClose={() => setSheetOpen(false)}
 *     activeCount={activeFilters.length}
 *     resultCount={filteredCount}
 *     onClearAll={clearAllFilters}
 *   >
 *     <FilterAccordion title="Industry" options={industries} ... />
 *   </MobileFilterSheet>
 *   ```
 *
 * @reusabilityScore 4     // every listing page with filters at mobile breakpoints
 * @a11y_status reviewed-AA  // Escape closes · aria-label on close btn · body scroll lock
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { ReactNode, useEffect, useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../atoms/Badge';

interface MobileFilterSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Number of active filter dimensions */
  activeCount?: number;
  /** Number of filtered results to show in footer CTA */
  resultCount?: number;
  /** Clear all filters handler */
  onClearAll?: () => void;
  /** Filter content (same JSX as desktop sidebar) */
  children: ReactNode;
}

export function MobileFilterSheet({
  isOpen,
  onClose,
  activeCount = 0,
  resultCount = 0,
  onClearAll,
  children,
}: MobileFilterSheetProps) {
  const [closeHovered, setCloseHovered] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div data-component="MobileFilterSheet" className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          animation: 'fadeIn 200ms ease-out',
        }}
        onClick={onClose}
      />

      {/* Sheet Panel */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          maxHeight: '85vh',
          borderRadius: '10px 10px 0 0',
          backgroundColor: 'rgba(255,255,255,1)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.12), 0 -1px 4px rgba(0,0,0,0.06)',
          animation: 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{
                borderRadius: 'var(--radius-element)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(0,0,0,0.08)',
                backgroundColor: 'rgba(255,255,255,1)',
              }}
            >
              <SlidersHorizontal size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
            </div>
            <h3
              className="uppercase tracking-[0.1em]"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Filters
            </h3>
            {activeCount > 0 && (
              <Badge variant="pill" size="xs" theme="neutral" mode="dark">
                {activeCount}
              </Badge>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
            style={{
              borderRadius: 'var(--radius-element)',
              backgroundColor: closeHovered ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0)',
            }}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            aria-label="Close filters"
          >
            <X size={16} style={{ color: 'rgba(0,0,0,0.5)' }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'rgba(0,0,0,0.06)',
            backgroundColor: 'var(--black-50, rgba(250,250,250,1))',
          }}
        >
          {activeCount > 0 && onClearAll && (
            <button
              onClick={() => { onClearAll(); onClose(); }}
              className="flex items-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
              style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.4)'; }}
            >
              <X size={12} />
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 px-5 py-2.5 min-h-[44px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
            style={{
              borderRadius: 'var(--radius-element)',
              fontSize: 'var(--text-xs)',
              backgroundColor: ctaHovered ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,1)',
              color: 'rgba(255,255,255,1)',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
          >
            Show {resultCount.toLocaleString()} report{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
