/**
 * Breadcrumb — Molecule
 *
 * WHAT: Accessible breadcrumb navigation with `<nav aria-label="Breadcrumb">` → `<ol>`.
 *       Each level has a ChevronRight separator, a link, and an optional dropdown trigger.
 *       Last item renders `aria-current="page"` and (when hasDropdown) a caret button
 *       that opens a Framer-animated panel with sibling and child columns.
 *
 * WHY: V0_lite HeroSection uses this for every report PDP — linking Home → Category →
 *      Subcategory → Report. The dropdown lets users jump to sibling categories without
 *      going back. V0_lite Breadcrumb.tsx is the canonical source.
 *      Navigation landmarks reduce cognitive load (Nielsen #6 Recognition over recall).
 *
 * WHEN: Any page with 2+ levels of hierarchy — report PDP, case-study, category listing.
 *
 * WHEN NOT: Do NOT use for tab-style navigation — use StepperHorizontal.
 *           Do NOT use for sidebar TOC — use TableOfContentsSidebar organism.
 *
 * WHERE: HeroSection top (above h1) · listing page header · case-study page header.
 *
 * HOW:
 * ```tsx
 * <Breadcrumb
 *   levels={[
 *     { label: 'Home', href: '/' },
 *     {
 *       label: 'Healthcare',
 *       href: '/industries/healthcare',
 *       dropdownLabel: 'Browse industries',
 *       siblings: [
 *         { label: 'Technology', href: '/industries/technology' },
 *         { label: 'Healthcare', href: '/industries/healthcare', active: true },
 *       ],
 *     },
 *     { label: 'AI in Healthcare', href: '/industries/healthcare/ai', isLast: true },
 *   ]}
 *   colorScheme="dark"
 * />
 * ```
 *
 * A11y:
 * - `<nav aria-label="Breadcrumb">` landmark
 * - `<ol>` with `<li>` items — semantically ordered list
 * - Last item: `aria-current="page"`
 * - Dropdown trigger: `aria-expanded`, `aria-haspopup="listbox"`, `aria-label`
 * - Dropdown closes on Escape + click-outside
 * - All interactive elements keyboard-reachable (tab + enter/space)
 *
 * Motion: Framer AnimatePresence dropdown (opacity+y+scale). useReducedMotion guard.
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · Breadcrumb.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

// ── Types ──────────────────────────────────────────────────────────────────

/** A single item inside a breadcrumb dropdown column (sibling or child). */
export interface BreadcrumbNavItem {
  label: string;
  href: string;
  /** Marks item as currently active in dropdown list. */
  active?: boolean;
}

export interface BreadcrumbLevel {
  /** Display label for this crumb. */
  label: string;
  /** Navigation href. */
  href: string;
  /** Column header label shown in the dropdown. */
  dropdownLabel?: string;
  /** Sibling items shown in the left dropdown column. */
  siblings?: BreadcrumbNavItem[];
  /** Child items shown in the right dropdown column. */
  children?: {
    dropdownLabel: string;
    items: BreadcrumbNavItem[];
  };
}

export interface BreadcrumbProps {
  /** Ordered list of navigation levels. Last level is current page. */
  levels: BreadcrumbLevel[];
  /**
   * Color scheme adapts text for surface.
   * "dark" → white/40 inactive, white active (cinematic hero).
   * "light" → black/50 inactive, black/80 active (editorial).
   * @default 'dark'
   */
  colorScheme?: 'light' | 'dark';
  /** Additional className on the root nav. */
  className?: string;
}

// ── Dropdown column (internal) ─────────────────────────────────────────────

function DropdownColumn({
  label,
  items,
  onClose,
}: {
  label: string;
  items: BreadcrumbNavItem[];
  onClose: () => void;
}) {
  return (
    <div className="flex-1 py-4 px-5">
      <div
        className="font-sans pb-2 mb-2 border-b"
        style={{
          fontSize: 'var(--text-nav-helper)',
          letterSpacing: 'var(--tracking-nav)',
          color: 'var(--black-400)',
          borderColor: 'var(--black-200)',
        }}
      >
        {label}
      </div>
      <ul className="space-y-0.5" role="listbox">
        {items.map((item) => (
          <li key={item.label} role="option" aria-selected={item.active}>
            <a
              href={item.href}
              className={cn(
                'block px-3 py-2 font-sans transition-colors',
                item.active
                  ? 'font-medium'
                  : 'hover:bg-black/[0.03]'
              )}
              style={{
                fontSize: 'var(--text-nav)',
                borderRadius: 'var(--radius-xs)',
                color: item.active ? 'var(--brand-red)' : 'rgba(0,0,0,0.6)',
                backgroundColor: item.active ? 'rgba(176,31,36,0.06)' : undefined,
              }}
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Dropdown panel (internal) ──────────────────────────────────────────────

function BreadcrumbDropdown({
  level,
  onClose,
  reducedMotion,
}: {
  level: BreadcrumbLevel;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const hasTwoColumns = !!level.children;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      className="absolute left-0 top-full mt-2 bg-white overflow-hidden z-[var(--z-dropdown)]"
      style={{
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        border: '1px solid var(--black-200)',
        minWidth: hasTwoColumns ? '520px' : '260px',
        maxWidth: 'calc(100vw - 2rem)',
        zIndex: 'var(--z-dropdown)',
      }}
      initial={reducedMotion ? false : { opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={cn('flex', hasTwoColumns ? 'flex-col sm:flex-row' : '')}>
        {level.siblings && (
          <div
            className={cn(
              hasTwoColumns ? 'flex-1 border-b sm:border-b-0 sm:border-r' : 'flex-1'
            )}
            style={{ borderColor: 'var(--black-200)' }}
          >
            <DropdownColumn
              label={level.dropdownLabel ?? 'Browse'}
              items={level.siblings}
              onClose={onClose}
            />
          </div>
        )}
        {level.children && (
          <DropdownColumn
            label={level.children.dropdownLabel}
            items={level.children.items}
            onClose={onClose}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Breadcrumb (exported) ──────────────────────────────────────────────────

/**
 * Breadcrumb
 *
 * Accessible breadcrumb nav with optional per-level dropdown panels.
 * Dropdown triggers appear only on the last crumb (when hasDropdown).
 */
export function Breadcrumb({
  levels,
  colorScheme = 'dark',
  className,
}: BreadcrumbProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const isDark = colorScheme === 'dark';

  const closeDropdown = useCallback(() => setOpenIdx(null), []);

  return (
    <nav
      aria-label="Breadcrumb"
      data-component="Breadcrumb"
      className={cn('relative', className)}
    >
      <ol className="flex items-center flex-wrap gap-y-1">
        {levels.map((level, idx) => {
          const isLast = idx === levels.length - 1;
          const hasDropdown = !!(level.siblings || level.children);
          const isOpen = openIdx === idx;

          return (
            <li key={level.href + idx} className="flex items-center relative">
              {/* Chevron separator (skip first item) */}
              {idx > 0 && (
                <ChevronRight
                  className={cn(
                    'mx-1.5 sm:mx-2 h-3 w-3 shrink-0',
                    isDark ? 'text-white/40' : 'text-black/30'
                  )}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}

              {/* First item — simple link */}
              {idx === 0 ? (
                <a
                  href={level.href}
                  className={cn(
                    'font-sans transition-colors duration-200',
                    isDark
                      ? 'text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50'
                      : 'text-black/50 hover:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30'
                  )}
                  style={{ fontSize: 'var(--text-nav-helper)', letterSpacing: '0.2px' }}
                >
                  {level.label}
                </a>
              ) : (
                <span className="relative inline-flex items-center">
                  <a
                    href={level.href}
                    className={cn(
                      'font-sans transition-colors duration-200',
                      isLast
                        ? isDark
                          ? 'text-white font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50'
                          : 'text-black/80 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30'
                        : isDark
                        ? 'text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50'
                        : 'text-black/50 hover:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30'
                    )}
                    style={{ fontSize: 'var(--text-nav-helper)', letterSpacing: '0.2px' }}
                    {...(isLast ? { 'aria-current': 'page' as const } : {})}
                    onClick={(e) => e.preventDefault()}
                  >
                    {level.label}
                  </a>

                  {/* Dropdown caret — last item only */}
                  {isLast && hasDropdown && (
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className={cn(
                        'ml-1.5 p-1 rounded transition-colors duration-150 focus-visible:outline focus-visible:outline-2',
                        isDark
                          ? 'hover:bg-white/10 focus-visible:outline-white/50'
                          : 'hover:bg-black/5 focus-visible:outline-black/30',
                        isOpen && (isDark ? 'bg-white/10' : 'bg-black/5')
                      )}
                      style={{ borderRadius: 'var(--radius-xs)' }}
                      aria-label={`Browse ${level.label} options`}
                      aria-expanded={isOpen}
                      aria-haspopup="listbox"
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        className={cn(
                          'shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-90'
                        )}
                        aria-hidden="true"
                      >
                        <path
                          d="M2 1L6 4L2 7"
                          fill="var(--brand-red)"
                          strokeWidth={0}
                        />
                      </svg>
                    </button>
                  )}

                  {/* Animated dropdown panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <BreadcrumbDropdown
                        level={level}
                        onClose={closeDropdown}
                        reducedMotion={prefersReducedMotion}
                      />
                    )}
                  </AnimatePresence>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
