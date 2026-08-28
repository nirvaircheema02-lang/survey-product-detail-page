'use client';

/**
 * MindMapModal — Full-screen modal wrapping the MindMap organism
 *
 * WHAT: Fixed-position overlay presenting the MindMap in 'full' interaction mode
 *       with a search input, title header, and close controls. Implements focus-trap,
 *       ESC-key dismiss, and backdrop-click dismiss.
 *
 * WHY: ScopeOfReport shows a read-only preview at 600px height. Users need full
 *      pan/zoom/search exploration. The modal lifts MindMap into a 95vw × 90vh
 *      canvas for deep interaction without leaving the page.
 *
 * WHEN: Triggered by ScopeOfReport or TaxonomyTree hover-overlay click. Can also
 *       be triggered by any organism that embeds a MindMap preview.
 *
 * WHEN NOT: Do not use for non-MindMap content — this modal is specifically sized
 *           and styled for the D3 canvas. For general modal use, reach for
 *           Radix UI Dialog (@radix-ui/react-dialog already in core-v2 deps).
 *
 * WHERE: core-v2/src/organisms/MindMapModal.tsx
 *        Canonical source: V0.2-for-ds src/app/components/MindMapModal.tsx
 *
 * HOW: Uses React portal-equivalent (fixed inset-0) overlay. Tab is trapped within
 *      the modal when open (focusable elements: search input + close button + MindMap
 *      nodes). ESC closes via keydown listener. Body scroll locked while open.
 *      Focus returns to openerRef element on close. Framer AnimatePresence drives
 *      overlay fade + panel slide — useReducedMotion() disables animation.
 *
 * A11Y: role="dialog" + aria-modal="true" + aria-labelledby on panel. Focus trap
 *       via Tab cycling between first/last focusable. ESC close. Focus return to opener.
 *       Body overflow:hidden prevents scroll during modal open.
 *
 * MOTION: Framer Motion overlay fade (opacity 0→1) + panel slide (translateY 16px→0).
 *         useReducedMotion() removes both animations.
 *
 * @promotedFrom V0.2-for-ds src/app/components/MindMapModal.tsx (DS Port Batch 3.2c · 2026-05-19)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { MindMap, type MindMapNode } from './MindMap';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MindMapModalProps {
  /**
   * Whether the modal is visible. Managed by parent (ScopeOfReport / TaxonomyTree).
   */
  isOpen: boolean;
  /**
   * Callback to close the modal. Called on: ESC key · backdrop click · close button.
   */
  onClose: () => void;
  /**
   * Root mind map data to render in full mode.
   */
  data: MindMapNode;
  /**
   * Modal heading displayed in the header bar.
   * @default 'Report Coverage Taxonomy'
   */
  title?: string;
  /**
   * Subtitle instruction text shown below the title.
   * @default 'Click to expand categories • Drag to pan • Scroll to zoom'
   */
  subtitle?: string;
  /**
   * Search input placeholder.
   * @default 'Search taxonomy...'
   */
  searchPlaceholder?: string;
  /**
   * Ref of the element that triggered the modal open — focus returns here on close.
   * Optional: if not provided, focus returns to document.body.
   */
  openerRef?: React.RefObject<HTMLElement | null>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MindMapModal({
  isOpen,
  onClose,
  data,
  title = 'Report Coverage Taxonomy',
  subtitle = 'Click to expand categories • Drag to pan • Scroll to zoom',
  searchPlaceholder = 'Search taxonomy...',
  openerRef,
}: MindMapModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalId = 'mindmap-modal-title';

  // ── Node click handler ──────────────────────────────────────────────────
  const handleNodeClick = useCallback((_name: string) => {
    // Node click inside modal — no-op at modal level (MindMap handles expand/collapse)
  }, []);

  // ── Lock body scroll + listen for ESC ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: Tab cycling between search input and close button
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Move focus into modal on open
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
      // Return focus to opener on close
      if (openerRef?.current) {
        openerRef.current.focus();
      }
    };
  }, [isOpen, onClose, openerRef]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  // ── Animation variants ──────────────────────────────────────────────────
  const overlayVariants: Variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      };

  const panelVariants: Variants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
        exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          aria-hidden="true"
        >
          <motion.div
            ref={panelRef}
            className="relative overflow-hidden"
            style={{
              width: '95vw',
              height: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
            }}
            variants={panelVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalId}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
              className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between"
              style={{
                borderBottom: '1px solid var(--black-200)',
                backgroundColor: '#ffffff',
                padding: 'var(--space-4) var(--space-8)',
              }}
            >
              {/* Title + subtitle */}
              <div>
                <h2
                  id={modalId}
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    color: 'var(--black-900)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: '1.25',
                  }}
                >
                  {title}
                </h2>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--black-500)',
                    marginTop: 'var(--space-1)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {subtitle}
                </p>
              </div>

              {/* Search + close */}
              <div className="flex items-center gap-3">
                <input
                  ref={searchRef}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Search taxonomy nodes"
                  className="transition-all"
                  style={{
                    width: '14rem',
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--black-900)',
                    border: '1px solid var(--black-200)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--purple-500)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--black-200)'; }}
                />

                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close mind map modal"
                  className="flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    outlineColor: 'var(--brand-red)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--black-100)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <X
                    aria-hidden="true"
                    style={{ width: '1.25rem', height: '1.25rem', color: 'var(--black-500)' }}
                  />
                </button>
              </div>
            </div>

            {/* ── MindMap canvas (below 72px header) ─────────────────────── */}
            <div className="w-full h-full" style={{ paddingTop: '72px' }}>
              <MindMap
                data={data}
                searchTerm={searchTerm}
                onNodeClick={handleNodeClick}
                interactionMode="full"
                ariaLabel={title}
                ariaDescription={`Interactive mind map for ${title}. Use Tab to navigate nodes, Enter to expand or collapse, Escape to close.`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MindMapModal;
