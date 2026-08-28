/**
 * TableOfContentsSidebar
 *
 * WHAT:
 * Sticky left sidebar for report PDP pages. Displays an ordered list of section
 * links with three visual states per item: upcoming (grey circle + number),
 * active (black filled circle + number), completed (black filled circle + Check icon).
 * Supports expand/collapse toggle — 255px expanded, 80px collapsed.
 * Collapse button is half-outside the sidebar container at `-right-4`.
 * Mobile: hidden (lg:hidden) — floating TOC button shown separately.
 *
 * WHY:
 * Long-form report PDPs have 10–25 sections. Without a visual position indicator,
 * readers lose their place (Miller's Law — 7±2 items in working memory). A sticky
 * TOC externalises the cognitive map, reduces re-scanning, and increases time-on-page
 * (Nielsen: wayfinding reduces disorientation for long-form content).
 * Neutral black/grey circles avoid brand-red on non-CTA elements (Anti-pattern §9).
 *
 * WHEN:
 * - Report PDP pages (V1 product page layout) — inside PDPLayout left column.
 * - Any long-form page with 5+ named sections and stable anchor IDs.
 *
 * WHEN NOT:
 * - Pages with fewer than 5 sections (cognitive overhead > benefit).
 * - Mobile viewport (hidden lg:hidden — use MobileTOC floating button instead).
 * - Case-study pages (use ReadingProgressBar instead).
 *
 * WHERE:
 * - `PDPLayoutTemplate` — left aside column.
 * - `projects/V0.2-for design system/` — canonical source.
 *
 * HOW:
 * ```tsx
 * import { TableOfContentsSidebar } from '@kenresearch/design-system/organisms';
 *
 * <TableOfContentsSidebar
 *   sections={[
 *     { id: 'market-overview', number: '1', title: 'Market Overview', time: '5m' },
 *     { id: 'segmentation',    number: '2', title: 'Segmentation',    time: '7m' },
 *   ]}
 *   totalTime="56m"
 * />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0.2-for-design-system/src/app/components/TableOfContentsSidebar.tsx
 */
'use client';

import { useState } from 'react';
import { ChevronLeft, Check, List } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useReducedMotion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single navigable section in the TOC. */
export interface TOCSectionItem {
  /** Anchor ID matching the `id` attribute on the section element in the page. */
  id: string;
  /** Display number, e.g. "1", "2", "11". */
  number: string;
  /** Section title shown in the sidebar. */
  title: string;
  /** Optional estimated read time, e.g. "5m". */
  time?: string;
}

export interface TableOfContentsSidebarProps {
  /**
   * Ordered list of sections to display.
   * All content injected — no inline defaults.
   * // TODO: replace w/ real API — derive from report chapter metadata
   */
  sections: TOCSectionItem[];
  /**
   * Total estimated reading time shown in the expanded header.
   * @default undefined
   */
  totalTime?: string;
  /**
   * rootMargin offset (px) for scroll-spy. Higher = section activates earlier on scroll.
   * @default 200
   */
  scrollSpyOffset?: number;
  /**
   * Scroll offset (px) subtracted when navigating to a section — accounts for fixed navbar.
   * @default 88
   */
  scrollOffset?: number;
  /**
   * Whether sidebar starts expanded. Set false for compressed-default.
   * @default true
   */
  defaultExpanded?: boolean;
  /** Optional className on the root `<aside>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TableOfContentsSidebar({
  sections,
  totalTime,
  scrollSpyOffset = 200,
  scrollOffset = 88,
  defaultExpanded = true,
  className,
}: TableOfContentsSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const prefersReducedMotion = useReducedMotion();

  const sectionIds = sections.map((s) => s.id);
  const activeId = useScrollSpy(sectionIds, scrollSpyOffset);

  // Determine status of a section relative to the active one
  function getSectionStatus(sectionId: string): 'active' | 'completed' | 'upcoming' {
    const activeIndex = sections.findIndex((s) => s.id === activeId);
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    if (currentIndex === activeIndex) return 'active';
    if (currentIndex < activeIndex) return 'completed';
    return 'upcoming';
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop - scrollOffset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <>
      {/* ----------------------------------------------------------------
          Mobile floating TOC trigger — hidden on lg+ (actual TOC is desktop-only)
      ---------------------------------------------------------------- */}
      <button
        type="button"
        aria-label="Open table of contents"
        className="fixed bottom-24 left-4 z-50 lg:hidden rounded-full flex items-center justify-center"
        style={{
          width: '3rem',
          height: '3rem',
          backgroundColor: 'var(--black-900)',
          color: 'var(--white)',
          boxShadow: 'var(--shadow-lg)',
          transition: prefersReducedMotion ? 'none' : 'box-shadow var(--duration-normal) var(--ease-smooth)',
        }}
      >
        <List aria-hidden="true" style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>

      {/* ----------------------------------------------------------------
          Desktop sidebar — hidden below lg
      ---------------------------------------------------------------- */}
      <aside
        aria-label="Table of contents"
        className={`hidden lg:block flex-shrink-0 sticky self-start z-[100] ${className ?? ''}`}
        style={{
          top: '88px',
          height: 'calc(100vh - 88px)',
          width: isExpanded ? '255px' : '80px',
          transition: prefersReducedMotion
            ? 'none'
            : `width var(--duration-normal) var(--ease-smooth)`,
        }}
      >
        {/* Inner panel */}
        <div
          className="relative h-full"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderRight: '1px solid var(--black-200)',
            overflow: 'hidden',
          }}
        >
          {/* ---- Collapse / expand toggle — half-outside at -right-4 ---- */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? 'Collapse table of contents' : 'Expand table of contents'}
            aria-expanded={isExpanded}
            className="absolute z-[100] flex items-center justify-center"
            style={{
              bottom: '20%',
              right: '-1rem',
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              background: 'var(--white)',
              border: '1px solid var(--black-200)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft
              aria-hidden="true"
              style={{
                width: '1rem',
                height: '1rem',
                color: 'var(--black-600)',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: prefersReducedMotion
                  ? 'none'
                  : `transform var(--duration-normal) var(--ease-smooth)`,
              }}
            />
          </button>

          {isExpanded ? (
            /* ---- EXPANDED STATE ---- */
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                style={{
                  padding: 'calc(var(--space-4) + 4px) var(--space-4) var(--space-3)',
                  borderBottom: '1px solid var(--black-100)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--black-900)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-label-wide)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Table of Contents
                </span>
                {totalTime && (
                  <span
                    className="ml-auto"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-600)',
                      background: 'var(--black-100)',
                      padding: '2px var(--space-2)',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {totalTime}
                  </span>
                )}
              </div>

              {/* Navigation list */}
              <nav
                aria-label="Report sections"
                className="flex-1 overflow-y-auto"
                style={{ padding: 'var(--space-2)' }}
              >
                {sections.map((section) => {
                  const status = getSectionStatus(section.id);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      aria-current={isActive ? 'step' : undefined}
                      className="w-full text-left flex items-center gap-2 group"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-2xs)',
                        minHeight: '44px',
                        background: isActive ? 'var(--black-100)' : 'transparent',
                        transition: prefersReducedMotion
                          ? 'none'
                          : `background var(--duration-fast) var(--ease-smooth)`,
                        cursor: 'pointer',
                        border: 'none',
                      }}
                    >
                      {/* Status circle */}
                      <div
                        aria-hidden="true"
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          borderRadius: '9999px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isActive || isCompleted ? 'var(--black-900)' : 'var(--black-100)',
                          transition: prefersReducedMotion
                            ? 'none'
                            : `background var(--duration-fast) var(--ease-smooth)`,
                        }}
                      >
                        {isCompleted ? (
                          <Check
                            style={{
                              width: '0.75rem',
                              height: '0.75rem',
                              color: 'var(--white)',
                            }}
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              color: isActive ? 'var(--white)' : 'var(--black-600)',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {section.number}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <span
                        className="truncate flex-1"
                        style={{
                          fontSize: 'var(--text-nav)',
                          color: isActive
                            ? 'var(--black-900)'
                            : isCompleted
                            ? 'rgba(0,0,0,0.7)'
                            : 'var(--black-600)',
                          fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
                          fontFamily: 'var(--font-sans)',
                          transition: prefersReducedMotion
                            ? 'none'
                            : `color var(--duration-fast) var(--ease-smooth)`,
                        }}
                      >
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : (
            /* ---- COLLAPSED STATE — dots only ---- */
            <nav
              aria-label="Report sections (collapsed)"
              className="flex flex-col items-center gap-3 overflow-y-auto"
              style={{
                padding: 'var(--space-4) var(--space-2)',
                maxHeight: 'calc(100% - 5rem)',
              }}
            >
              {sections.map((section) => {
                const status = getSectionStatus(section.id);
                const isActive = status === 'active';
                const isCompleted = status === 'completed';

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    aria-label={`${section.title}${isCompleted ? ' (completed)' : isActive ? ' (current)' : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                    className="group"
                    style={{ minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isActive || isCompleted ? 'var(--black-900)' : 'var(--black-100)',
                        transition: prefersReducedMotion
                          ? 'none'
                          : `background var(--duration-fast) var(--ease-smooth), transform var(--duration-fast) var(--ease-smooth)`,
                      }}
                      className="group-hover:scale-110"
                    >
                      {isCompleted ? (
                        <Check
                          style={{ width: '0.875rem', height: '0.875rem', color: 'var(--white)' }}
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: isActive ? 'var(--white)' : 'var(--black-600)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {section.number}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}
