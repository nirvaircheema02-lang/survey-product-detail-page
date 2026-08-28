'use client';

/**
 * DropdownPanel — Industries mega-menu dropdown for Navbar.
 *
 * WHAT: Positioned panel that opens below a trigger button. Renders a 2-column
 *       grid of MenuItem atoms. Closes on ESC, outside-click, or focus leaving
 *       the panel. Glass background (`--glass-header-bg`) with backdrop blur.
 *
 * WHY: Industries taxonomy is Ken Research's primary navigation dimension.
 *      A mega-menu grid gives scannable discovery without deep nesting
 *      (Miller's Law — 7±2 items per column). Outside-click + ESC close
 *      follows ARIA APG disclosure-button pattern.
 *
 * WHEN: Inside Navbar · attached to Industries trigger button · lg+ viewports.
 *
 * WHEN NOT: Mobile nav (use MobileMenu stacked list). Single-item dropdowns.
 *
 * WHERE: Navbar organism. Industries trigger only (not generic utility).
 *
 * HOW:
 * ```tsx
 * <DropdownPanel
 *   items={['Healthcare', 'Technology & Telecom', 'Energy & Utilities']}
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   anchorRef={triggerRef}
 * />
 * ```
 *
 * @canonical report-store-legacy/src/app/components/Header.tsx Industries dropdown
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export interface DropdownPanelProps {
  /** Flat list of industry labels to render as MenuItems. */
  items: string[];
  /** Whether the panel is open. */
  isOpen: boolean;
  /** Called when panel should close (ESC / outside-click / blur). */
  onClose: () => void;
  /** Ref to the trigger element — used for focus-return on close. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Override link href builder. Defaults to `#`. */
  hrefBuilder?: (item: string) => string;
  className?: string;
}

/**
 * Split flat array into N columns evenly.
 * Used to build 2-col layout.
 */
function splitIntoColumns<T>(items: T[], cols: number): T[][] {
  const result: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => result[i % cols].push(item));
  return result;
}

export function DropdownPanel({
  items,
  isOpen,
  onClose,
  anchorRef,
  hrefBuilder = () => '#',
  className = '',
}: DropdownPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const columns = splitIntoColumns(items, 2);

  // ESC key close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        anchorRef?.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose, anchorRef]);

  // Outside-click close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  // Focus-trap: close when focus leaves the entire widget (panel + trigger)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const relatedTarget = e.relatedTarget as Node | null;
      const panelContains = panelRef.current?.contains(relatedTarget);
      const anchorContains = anchorRef?.current?.contains(relatedTarget);
      if (!panelContains && !anchorContains) {
        onClose();
      }
    },
    [onClose, anchorRef]
  );

  const variants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="menu"
          aria-label="Industries navigation"
          data-component="DropdownPanel"
          onBlur={handleBlur}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute top-full left-0 mt-1.5 z-[var(--z-popover)] min-w-[320px] ${className}`}
          style={{
            background: 'var(--glass-header-bg)',
            backdropFilter: 'var(--glass-header-blur)',
            WebkitBackdropFilter: 'var(--glass-header-blur)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 'var(--rc-radius-card, var(--radius-element))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            padding: 'var(--space-2)',
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-0.5">
                {col.map((item) => (
                  <a
                    key={item}
                    href={hrefBuilder(item)}
                    role="menuitem"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-black/70 hover:text-black hover:bg-black/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
                    style={{ fontSize: 'var(--text-nav)', minHeight: '36px' }}
                  >
                    <ChevronRight
                      className="h-3 w-3 flex-shrink-0 text-black/30"
                      aria-hidden="true"
                    />
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
