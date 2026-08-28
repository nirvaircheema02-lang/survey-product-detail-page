/**
 * MegaBreadcrumb
 *
 * WHY:
 * - Ken Research reports live in a deep taxonomy (Industry > Subcategory > Tag > Report).
 *   A standard breadcrumb chain is read-only navigation; users need to pivot sideways
 *   at any level without returning to the listing page. MegaBreadcrumb exposes
 *   sibling + child items per level in a two-column mega-popover, turning each crumb
 *   into an in-place navigator.
 * - Hover-triggered dropdown (with keyboard fallback via aria-expanded + Enter/Space
 *   + Escape) means power users never leave the report PDP to browse adjacent topics.
 * - Two-column layout (siblings left · children right) mirrors the mental model:
 *   "where am I in THIS category?" (siblings) + "what's one level deeper?" (children).
 * - AnimatePresence gives a subtle scale+fade entry that signals "this is a panel,
 *   not inline content" without a jarring hard-toggle.
 * - colorScheme prop adapts text alpha for use on both cinematic-dark hero surfaces
 *   and editorial-light page bodies without duplicate implementations.
 *
 * WHAT:
 * - `<nav aria-label="Breadcrumb">` wrapping `<ol>` of crumb `<li>` items.
 * - Home (first level): simple `<a>` link, no dropdown.
 * - Mid/last levels: `<a>` label + optional dropdown trigger `<button>` with
 *   ChevronRight indicator (rotates on open). Dropdown shows on last level only by default
 *   but the component accepts sibling/children on any level.
 * - `BreadcrumbDropdown` internal: `motion.div` panel, click-outside + Escape to close.
 * - `DropdownColumn` internal: label header + `<ul>` of `<a>` items; active item gets
 *   brand-red bg tint + font-medium.
 * - Two-column split: siblings left (border-right divider) · children right.
 * - `BreadcrumbItem.active` marks the current position within each column.
 *
 * WHEN:
 * - Top of report PDP hero section — sits below the primary `<Navbar>`, above the
 *   hero headline. Renders on dark (colorScheme="dark") or light (colorScheme="light")
 *   depending on the hero surface variant.
 * - Any page with a ≥ 3-level taxonomy where lateral navigation adds value.
 *
 * WHEN NOT:
 * - Simple 2-level "Home > Page" breadcrumbs → use a plain `<nav>` inline, not this component.
 * - Tabs or category switchers at the top of a listing page → use `<TabBar>` molecule.
 * - Mobile nav category picker → use drawer/bottom-sheet instead.
 *
 * WHERE:
 * - `projects/V0_lite_report/` — HeroSection breadcrumb slot.
 * - Any consumer page importing from `@kenresearch/design-system`.
 *
 * HOW:
 * ```tsx
 * import { MegaBreadcrumb, type BreadcrumbItem } from '@kenresearch/design-system/organisms';
 *
 * // TODO: replace w/ real API — `GET /api/taxonomy/breadcrumb?reportId={id}`
 * const crumbs: BreadcrumbItem[] = [
 *   { id: 'home', label: 'Home', href: '/' },
 *   {
 *     id: 'healthcare',
 *     label: 'Healthcare',
 *     href: '/industries/healthcare',
 *     siblings: [
 *       { id: 'bfsi', label: 'Banking & Financial Services', href: '/industries/bfsi' },
 *       { id: 'healthcare', label: 'Healthcare', href: '/industries/healthcare', active: true },
 *     ],
 *     children: [
 *       { id: 'ai-health', label: 'AI in Healthcare', href: '/industries/healthcare/ai', active: true },
 *       { id: 'medical-devices', label: 'Medical Devices', href: '/industries/healthcare/medical-devices' },
 *     ],
 *   },
 *   { id: 'ai-health', label: 'AI in Healthcare', href: '/industries/healthcare/ai' },
 * ];
 *
 * // On dark hero
 * <MegaBreadcrumb breadcrumbItems={crumbs} colorScheme="dark" />
 *
 * // On light surface
 * <MegaBreadcrumb breadcrumbItems={crumbs} colorScheme="light" />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report-legacy/src/app/components/Breadcrumb.tsx (renamed MegaBreadcrumb)
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single navigable item (crumb or dropdown entry). */
export interface BreadcrumbItem {
  /** Unique identifier for this item. */
  id: string;
  /** Display label shown in breadcrumb chain or dropdown list. */
  label: string;
  /** Navigation href. Use '#' for placeholder/disabled. */
  href: string;
  /**
   * Marks this item as the current selection within its column.
   * Renders with brand-red bg tint + font-medium in dropdowns.
   */
  active?: boolean;
  /**
   * Sibling items at this taxonomy level — rendered in the left dropdown column.
   * When absent, no dropdown is shown for this crumb.
   */
  siblings?: BreadcrumbItem[];
  /**
   * Children at the next taxonomy level — rendered in the right dropdown column.
   * When absent, only the siblings column is shown (single-column dropdown).
   */
  children?: BreadcrumbItem[];
}

export interface MegaBreadcrumbProps {
  /**
   * Ordered array of breadcrumb levels from root (Home) to current page.
   * // TODO: replace w/ real API — `GET /api/taxonomy/breadcrumb?reportId={id}`
   */
  breadcrumbItems: BreadcrumbItem[];
  /**
   * Color scheme — adapts text alpha and hover states to the surface behind the breadcrumb.
   * - `"dark"` — for cinematic-dark hero sections (`#0a0a0c` surface).
   * - `"light"` — for editorial-light page surfaces.
   * @default "dark"
   */
  colorScheme?: 'dark' | 'light';
  /** Column header label shown above the siblings list. @default "Browse category" */
  siblingsLabel?: string;
  /** Column header label shown above the children list. @default "Browse subcategory" */
  childrenLabel?: string;
  /** Optional additional className on the root `<nav>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// DropdownColumn — internal
// ---------------------------------------------------------------------------

interface DropdownColumnProps {
  /** Column header text (e.g. "Search category"). */
  label: string;
  /** Items to render as `<a>` links in the column. */
  items: BreadcrumbItem[];
  /** Called when the user clicks any item link. */
  onClose: () => void;
}

function DropdownColumn({ label, items, onClose }: DropdownColumnProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: 'var(--space-md) var(--space-lg)',
      }}
    >
      {/* Column header */}
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--typography-size-compact)',
          letterSpacing: 'var(--tracking-wide)',
          paddingBottom: 'var(--space-xs)',
          marginBottom: 'var(--space-xs)',
          borderBottom: '1px solid var(--border-card)',
          color: 'var(--black-600)',
        }}
      >
        {label}
      </div>

      {/* Item list */}
      <ul role="list" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
              style={{
                display: 'block',
                padding: 'var(--space-xs) var(--space-sm)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--typography-size-compact)',
                borderRadius: 'var(--radius-xs)',
                transition: 'var(--transition-fast)',
                fontWeight: item.active
                  ? 'var(--typography-weight-medium)'
                  : 'var(--typography-weight-normal)',
                color: item.active ? 'var(--brand-red)' : 'var(--black-600)',
                backgroundColor: item.active
                  ? 'var(--semantic-brand-red-alpha-12)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'var(--tint-default)';
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    'var(--semantic-ink-body)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    'var(--black-600)';
                }
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

// ---------------------------------------------------------------------------
// BreadcrumbDropdown — internal
// ---------------------------------------------------------------------------

interface BreadcrumbDropdownProps {
  /** The crumb level whose siblings/children populate this panel. */
  item: BreadcrumbItem;
  /** Called when the panel should close (click-outside, Escape, item click). */
  onClose: () => void;
  /** Fallback column header for siblings when item has no custom label. */
  siblingsLabel: string;
  /** Fallback column header for children when item has no custom label. */
  childrenLabel: string;
  /** Whether reduced-motion preference is active. */
  prefersReducedMotion: boolean | null;
}

function BreadcrumbDropdown({
  item,
  onClose,
  siblingsLabel,
  childrenLabel,
  prefersReducedMotion,
}: BreadcrumbDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const hasTwoColumns = !!item.siblings && !!item.children;

  // Click-outside close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Escape-key close
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const panelTransition: Transition = {
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      initial={prefersReducedMotion ? false : { opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
      transition={prefersReducedMotion ? { duration: 0 } : panelTransition}
      style={{
        position: 'absolute',
        left: 0,
        top: '100%',
        marginTop: 'var(--space-xs)',
        backgroundColor: 'var(--bg-pure-white)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-card)',
        minWidth: hasTwoColumns ? '520px' : '260px',
        maxWidth: 'calc(100vw - 2rem)',
        zIndex: 'var(--z-popover)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: hasTwoColumns ? 'column' : 'row',
        }}
        className={hasTwoColumns ? 'sm:flex-row' : ''}
      >
        {/* Siblings column */}
        {item.siblings && item.siblings.length > 0 && (
          <div
            style={{
              flex: 1,
              borderBottom: hasTwoColumns ? '1px solid var(--border-card)' : 'none',
            }}
            className={hasTwoColumns ? 'sm:border-b-0 sm:border-r' : ''}
          >
            <DropdownColumn
              label={siblingsLabel}
              items={item.siblings}
              onClose={onClose}
            />
          </div>
        )}

        {/* Children column */}
        {item.children && item.children.length > 0 && (
          <div style={{ flex: 1 }}>
            <DropdownColumn
              label={childrenLabel}
              items={item.children}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MegaBreadcrumb — main export
// ---------------------------------------------------------------------------

export function MegaBreadcrumb({
  breadcrumbItems,
  colorScheme = 'dark',
  siblingsLabel = 'Browse category',
  childrenLabel = 'Browse subcategory',
  className,
}: MegaBreadcrumbProps) {
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDark = colorScheme === 'dark';

  const closeDropdown = useCallback(() => setOpenDropdownIdx(null), []);

  // Text color tokens for crumb labels by state
  // Light: --black-600 (#525252, 7:1 on white) meets WCAG AA (was --semantic-ink-subtle / #737373, 4.48:1 — failed)
  const crumbDefault = isDark
    ? 'var(--semantic-ink-on-dark-muted)'
    : 'var(--black-600)';
  const crumbHover = isDark
    ? 'var(--semantic-ink-on-dark-strong)'
    : 'var(--semantic-ink-body)';
  const crumbActive = isDark
    ? 'var(--semantic-ink-on-dark-strong)'
    : 'var(--semantic-ink-strong)';
  const separatorColor = isDark
    ? 'var(--semantic-ink-on-dark-faint)'
    : 'var(--semantic-ink-faint)';
  const dropdownTriggerHoverBg = isDark
    ? 'var(--tint-soft)'
    : 'var(--tint-default)';

  return (
    <nav data-component="MegaBreadcrumb" aria-label="Breadcrumb" className={className} style={{ position: 'relative' }}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px 0',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {breadcrumbItems.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === breadcrumbItems.length - 1;
          const hasDropdown = !!(item.siblings?.length || item.children?.length);
          const isOpen = openDropdownIdx === idx;

          return (
            <li
              key={item.id}
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              {/* Chevron separator (not before first item) */}
              {!isFirst && (
                <ChevronRight
                  aria-hidden="true"
                  style={{
                    margin: '0 6px',
                    width: '0.75rem',
                    height: '0.75rem',
                    flexShrink: 0,
                    color: separatorColor,
                  }}
                  strokeWidth={2.5}
                />
              )}

              {/* Home (first) crumb — simple link, no dropdown */}
              {isFirst ? (
                <a
                  href={item.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--typography-size-compact)',
                    letterSpacing: 'var(--tracking-normal)',
                    color: crumbDefault,
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2"
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = crumbHover)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = crumbDefault)
                  }
                >
                  {item.label}
                </a>
              ) : (
                /* Mid and last crumbs */
                <span style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
                  {/* Crumb label link */}
                  <a
                    href={item.href}
                    {...(isLast ? { 'aria-current': 'page' as const } : {})}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--typography-size-compact)',
                      letterSpacing: 'var(--tracking-normal)',
                      color: isLast ? crumbActive : crumbDefault,
                      fontWeight: isLast
                        ? 'var(--typography-weight-medium)'
                        : 'var(--typography-weight-normal)',
                      textDecoration: 'none',
                      transition: 'var(--transition-fast)',
                      minHeight: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2"
                    onMouseEnter={(e) => {
                      if (!isLast)
                        (e.currentTarget as HTMLAnchorElement).style.color = crumbHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isLast)
                        (e.currentTarget as HTMLAnchorElement).style.color = crumbDefault;
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </a>

                  {/* Dropdown trigger button — only when item has siblings or children */}
                  {hasDropdown && (
                    <button
                      type="button"
                      onClick={() => setOpenDropdownIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-haspopup="dialog"
                      aria-label={`Browse ${item.label} options`}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '6px',
                        padding: '4px',
                        minWidth: '28px',
                        minHeight: '28px',
                        borderRadius: 'var(--radius-xs)',
                        border: 'none',
                        backgroundColor: isOpen ? dropdownTriggerHoverBg : 'transparent',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          dropdownTriggerHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        if (!isOpen) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            'transparent';
                        }
                      }}
                    >
                      {/* Small right-chevron indicator rotates 90deg when open */}
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: prefersReducedMotion
                            ? 'none'
                            : `transform var(--duration-fast) var(--ease-out)`,
                        }}
                      >
                        <path
                          d="M2 1L6 4L2 7"
                          stroke="var(--brand-red)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Mega-popover panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <BreadcrumbDropdown
                        item={item}
                        onClose={closeDropdown}
                        siblingsLabel={siblingsLabel}
                        childrenLabel={childrenLabel}
                        prefersReducedMotion={prefersReducedMotion}
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
