'use client';

/**
 * TableOfContents — sticky sidebar navigation atom for long-form scroll pages.
 *
 * WHY: Long-form pages (DS docs, reports, case studies) require persistent
 *      wayfinding. A sticky TOC reduces cognitive load by anchoring "where am I"
 *      continuously — Nielsen Law of Visibility. Extracted from OG DS doc-page
 *      to make reusable across any anchor-section page.
 *
 * WHAT: Collapsible two-tier nav (section + subsections). Active section
 *       highlighted via `aria-current="page"`. Keyboard navigable with
 *       focus-visible rings. Scroll-container clipped to viewport height.
 *
 * WHEN: Sidebar on DS documentation pages, long-form report viewer,
 *       any page with 4+ navigable anchor sections.
 *
 * WHEN NOT: Short pages (< 3 sections). Do not use as primary nav.
 *           Mobile — hide below md breakpoint (sticky TOC is desktop-only
 *           pattern; use section ribbon in navbar for mobile).
 *
 * WHERE: `design-system/core-v2/src/atoms/TableOfContents.tsx`
 *        Consumer: any page with `<section id="...">` anchors.
 *
 * HOW:
 * ```tsx
 * const [activeSection, setActiveSection] = useState('intro');
 * // pair with useActiveSection() hook for automatic tracking
 * <TableOfContents
 *   sections={sections}
 *   activeSection={activeSection}
 *   onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
 * />
 * ```
 *
 * @promotedFrom Design_system_vs_26 OG src/app/components/TableOfContents.tsx
 * @reusabilityScore 4/5 — fully decoupled from data · accepts any section tree
 * @a11y_status pass — aria-current on active · aria-label on nav · focus-visible rings
 * @lifecycle stable · v2 addition 2026-05-15
 */

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A subsection entry within a TOC section. */
export interface TOCSubsection {
  /** Unique anchor ID matching `<section id="...">` on page. */
  id: string;
  /** Display label shown in the TOC. */
  label: string;
}

/** A top-level section entry in the TOC. */
export interface TOCSection {
  /** Unique anchor ID matching `<section id="...">` on page. */
  id: string;
  /** Display label shown in the TOC. */
  label: string;
  /** Optional nested subsections displayed indented below parent. */
  subsections?: TOCSubsection[];
}

/** Props for the TableOfContents component. */
export interface TableOfContentsProps {
  /** Ordered array of navigable sections (and optional subsections). */
  sections: TOCSection[];
  /**
   * ID of the currently active (in-view) section or subsection.
   * Pass output of `useActiveSection()` hook for automatic tracking.
   */
  activeSection: string;
  /**
   * Callback fired when user clicks a section or subsection.
   * Responsible for scroll behavior — component stays stateless.
   */
  onNavigate: (id: string) => void;
  /**
   * Accessible label for the `<nav>` landmark.
   * @default "Page contents"
   */
  ariaLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Sticky sidebar table of contents with two-tier hierarchy and active-section
 * highlighting. Pairs with `useActiveSection` hook for intersection-observer
 * driven active tracking.
 */
export function TableOfContents({
  sections,
  activeSection,
  onNavigate,
  ariaLabel = 'Page contents',
}: TableOfContentsProps) {
  return (
    <nav
      data-component="TableOfContents"
      aria-label={ariaLabel}
      className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pb-8"
    >
      <div className="space-y-1">
        {sections.map((section) => {
          const isSectionActive = activeSection === section.id;

          return (
            <div key={section.id}>
              {/* ── Top-level section button ──────────────────────── */}
              <button
                onClick={() => onNavigate(section.id)}
                aria-current={isSectionActive ? 'page' : undefined}
                className="w-full text-left rounded-[5px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isSectionActive ? 700 : 400,
                  color: isSectionActive
                    ? 'var(--white)'
                    : 'rgba(0,0,0,0.70)',
                  background: isSectionActive
                    ? 'var(--black)'
                    : 'transparent',
                  // focus ring color via CSS var
                  '--tw-ring-color': 'var(--black)',
                } as React.CSSProperties}
                // hover handled via Tailwind — inline style can't target :hover
              >
                <span
                  className={
                    !isSectionActive
                      ? 'hover:text-[var(--black)]'
                      : ''
                  }
                >
                  {section.label}
                </span>
              </button>

              {/* ── Subsections ───────────────────────────────────── */}
              {section.subsections && section.subsections.length > 0 && (
                <div
                  className="space-y-1"
                  style={{ marginLeft: 'var(--space-4)', marginTop: 'var(--space-1)' }}
                >
                  {section.subsections.map((subsection) => {
                    const isSubActive = activeSection === subsection.id;

                    return (
                      <button
                        key={subsection.id}
                        onClick={() => onNavigate(subsection.id)}
                        aria-current={isSubActive ? 'page' : undefined}
                        className="w-full text-left rounded-[5px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={{
                          padding: 'var(--space-1) var(--space-3)',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: isSubActive ? 700 : 400,
                          color: isSubActive
                            ? 'var(--black)'
                            : 'rgba(0,0,0,0.60)',
                          background: isSubActive
                            ? 'rgba(0,0,0,0.10)'
                            : 'transparent',
                          '--tw-ring-color': 'var(--black)',
                        } as React.CSSProperties}
                      >
                        {subsection.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
