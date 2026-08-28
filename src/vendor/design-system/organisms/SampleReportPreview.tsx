/**
 * SampleReportPreview
 *
 * WHAT:
 * Full-width sample report section with a 3-state sticky sidebar TOC (open 280px /
 * compressed 200px / minimal 60px dots) and a main content area rendering multiple
 * chapter previews separated by dividers. The sidebar tracks the active chapter via
 * IntersectionObserver. Mobile: sidebar hidden, floating TOC button shown at bottom.
 *
 * WHY:
 * Users who haven't bought the report can't trust abstract marketing copy. A visible
 * partial content preview (chapters 1, 2, and an extended TOC) lets buyers evaluate
 * report quality directly — removes the "what am I paying for?" objection.
 * The 3-state sidebar mirrors a real document reader UX, signalling professionalism.
 * Paywall blurs on locked chapters convert the curiosity triggered by visible structure
 * into purchase intent (progressive disclosure + scarcity cue).
 *
 * WHEN:
 * - Report PDP pages — "Sample Report" / "Preview" section.
 * - Any context where you want to show a partial content read with a navigable TOC.
 *
 * WHEN NOT:
 * - Full report reader (content is previews only — for full reader use LongFormReader).
 * - Pages without chapter structure.
 *
 * WHERE:
 * - V1 product page PDP — after ResearchMethodology, before FAQSection.
 * - `projects/V0_lite_report-legacy/src/app/components/SampleReportPreview.tsx` (canonical).
 *
 * HOW:
 * ```tsx
 * import { SampleReportPreview } from '@kenresearch/design-system/organisms';
 *
 * <SampleReportPreview
 *   tocItems={[
 *     { id: 'ch-1', number: 1, title: 'Executive Summary', unlocked: true },
 *     { id: 'ch-2', number: 2, title: 'Market Overview',    unlocked: true },
 *     { id: 'ch-3', number: 3, title: 'AI Technology',      unlocked: false },
 *   ]}
 *   chapters={[
 *     { id: 'ch-1', content: <ChapterExecutiveSummary /> },
 *     { id: 'ch-2', content: <ChapterMarketOverview /> },
 *   ]}
 *   totalTime="56m"
 * />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report-legacy/src/app/components/SampleReportPreview.tsx
 */
'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, List, LockKeyhole } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** 3 sidebar width states following SidebarTOC canonical pattern. */
export type SidebarTOCState = 'open' | 'compressed' | 'minimal';

/** A single TOC item for the sidebar. */
export interface SampleTOCItem {
  /** Anchor ID matching a `<div id="...">` in the chapters area. */
  id: string;
  /** Display chapter number (1, 2, 11, etc.). */
  number: number;
  /** Chapter title. */
  title: string;
  /** Whether this chapter is accessible (unlocked) or blurred (locked). */
  unlocked: boolean;
  /** Optional display pages range. */
  pages?: string;
  /** Optional estimated read time. */
  time?: string;
}

/** A rendered chapter block for the main content area. */
export interface SampleChapter {
  /** Must match the `id` on the corresponding SampleTOCItem. */
  id: string;
  /** The React content to render for this chapter. */
  content: ReactNode;
}

export interface SampleReportPreviewProps {
  /**
   * TOC items defining what appears in the sidebar.
   * // TODO: replace w/ real API — derive from report chapter metadata
   */
  tocItems: SampleTOCItem[];
  /**
   * Chapter content blocks to render in order.
   * Each chapter `id` must match a tocItem `id`.
   */
  chapters: SampleChapter[];
  /**
   * Total estimated read time shown in the sidebar header.
   * @example "56m"
   */
  totalTime?: string;
  /**
   * Initial sidebar state.
   * @default "open"
   */
  defaultTOCState?: SidebarTOCState;
  /** Optional className on the root `<section>`. */
  className?: string;
}

// Sidebar width map — canonical V0_lite SidebarTOC widths
const SIDEBAR_WIDTHS: Record<SidebarTOCState, string> = {
  open: '280px',
  compressed: '200px',
  minimal: '60px',
};

// Chapter state type
type ChapterState = 'past' | 'present' | 'future' | 'locked';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SampleReportPreview({
  tocItems,
  chapters,
  totalTime,
  defaultTOCState = 'open',
  className,
}: SampleReportPreviewProps) {
  const [tocState, setTocState] = useState<SidebarTOCState>(defaultTOCState);
  const [activeChapterId, setActiveChapterId] = useState<string>(
    tocItems.find((t) => t.unlocked)?.id ?? tocItems[0]?.id ?? '',
  );
  const isScrollingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Accessible chapter order — unlocked only
  const accessibleIds = tocItems.filter((t) => t.unlocked).map((t) => t.id);

  // IntersectionObserver for scroll-based active chapter tracking
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveChapterId(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  function handleChapterClick(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    isScrollingRef.current = true;
    setActiveChapterId(id);
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { isScrollingRef.current = false; }, 1000);
  }

  function cycleTOCState() {
    setTocState((prev) => {
      if (prev === 'open') return 'compressed';
      if (prev === 'compressed') return 'minimal';
      return 'open';
    });
  }

  function getChapterState(item: SampleTOCItem): ChapterState {
    if (!item.unlocked) return 'locked';
    if (item.id === activeChapterId) return 'present';
    const activeIndex = accessibleIds.indexOf(activeChapterId);
    const itemIndex = accessibleIds.indexOf(item.id);
    if (itemIndex < activeIndex) return 'past';
    return 'future';
  }

  const sidebarWidth = SIDEBAR_WIDTHS[tocState];

  return (
    <section
      id="sample-report"
      data-component="SampleReportPreview"
      className={`border-b${className ? ` ${className}` : ''}`}
      style={{ borderColor: 'var(--black-100)' }}
    >
      {/* Full-bleed container: !px-0 !py-0 matching SectionWrapper spacing="sm" maxWidth="full" */}
      <div className="flex gap-0 items-start">
        {/* ----------------------------------------------------------------
            Sidebar TOC — hidden below lg
        ---------------------------------------------------------------- */}
        <aside
          aria-label="Sample report table of contents"
          role="navigation"
          className="hidden lg:block flex-shrink-0 z-40"
          style={{
            width: sidebarWidth,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderRight: '1px solid var(--black-100)',
            transition: prefersReducedMotion
              ? 'none'
              : `width var(--duration-normal) var(--ease-smooth)`,
            position: 'sticky',
            top: '50px',
            height: 'calc(100vh - 50px)',
          }}
        >
          {tocState !== 'minimal' ? (
            <div className="h-full flex flex-col pt-4 pb-0 relative">
              {/* Header */}
              <div
                className="flex items-center gap-2 px-4 pb-3 pt-5 mb-2"
                style={{ borderBottom: '1px solid var(--black-100)' }}
              >
                <h3
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
                </h3>
                {tocState === 'open' && totalTime && (
                  <span
                    className="ml-auto"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
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

              {/* TOC list */}
              <nav className="flex-1 min-h-0 overflow-y-auto" style={{ padding: 'var(--space-2)' }}>
                {tocItems.map((item) => {
                  const state = getChapterState(item);
                  const isLocked = state === 'locked';
                  const isPresent = state === 'present';
                  const isPast = state === 'past';

                  if (isLocked) {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 cursor-not-allowed select-none"
                        style={{
                          padding: 'var(--space-2) var(--space-3)',
                          minHeight: '44px',
                        }}
                        aria-disabled="true"
                        aria-label={`${item.title} (locked)`}
                      >
                        <div
                          style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <LockKeyhole
                            aria-hidden="true"
                            style={{ width: '0.875rem', height: '0.875rem', color: 'var(--black-300)' }}
                            strokeWidth={2}
                          />
                        </div>
                        <span
                          className="truncate flex-1"
                          style={{
                            fontSize: 'var(--text-nav)',
                            color: 'var(--black-300)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleChapterClick(item.id)}
                      aria-current={isPresent ? 'step' : undefined}
                      className="w-full text-left flex items-center gap-2 group"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-2xs)',
                        minHeight: '44px',
                        background: isPresent ? 'var(--black-100)' : 'transparent',
                        cursor: 'pointer',
                        border: 'none',
                        transition: prefersReducedMotion
                          ? 'none'
                          : `background var(--duration-fast) var(--ease-smooth)`,
                      }}
                    >
                      {/* Status indicator */}
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
                          background: isPresent || isPast ? 'var(--black-900)' : 'var(--black-100)',
                        }}
                      >
                        {isPast ? (
                          <Check
                            style={{ width: '0.75rem', height: '0.75rem', color: 'var(--white)' }}
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 'var(--text-xs)',
                              color: isPresent ? 'var(--white)' : 'var(--black-500)',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {item.number}
                          </span>
                        )}
                      </div>

                      <span
                        className="truncate flex-1"
                        style={{
                          fontSize: 'var(--text-nav)',
                          color: isPresent ? 'var(--black-900)' : 'var(--black-500)',
                          fontWeight: isPresent ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : (
            /* MINIMAL STATE — dot nav */
            <div
              className="flex flex-col items-center gap-3 mt-6 overflow-y-auto"
              style={{ padding: 'var(--space-3) var(--space-2)', maxHeight: 'calc(100% - 5rem)' }}
            >
              {tocItems.map((item) => {
                const state = getChapterState(item);
                const isPresent = state === 'present';
                const isPast = state === 'past';
                const isLocked = state === 'locked';

                return isLocked ? (
                  <div
                    key={item.id}
                    aria-label={`${item.title} (locked)`}
                    aria-disabled="true"
                    style={{
                      width: '1.5rem', height: '1.5rem', borderRadius: '9999px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--black-100)', cursor: 'not-allowed',
                    }}
                  >
                    <LockKeyhole style={{ width: '0.75rem', height: '0.75rem', color: 'var(--black-300)' }} aria-hidden="true" strokeWidth={2} />
                  </div>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChapterClick(item.id)}
                    aria-label={item.title}
                    aria-current={isPresent ? 'step' : undefined}
                    style={{
                      width: '1.5rem', height: '1.5rem', borderRadius: '9999px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isPresent || isPast ? 'var(--black-900)' : 'var(--black-100)',
                      border: 'none', cursor: 'pointer',
                      transition: prefersReducedMotion ? 'none' : `background var(--duration-fast) var(--ease-smooth)`,
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    {isPast ? (
                      <Check style={{ width: '0.75rem', height: '0.75rem', color: 'var(--white)' }} strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <span style={{ fontSize: 'var(--text-xs)', color: isPresent ? 'var(--white)' : 'var(--black-500)', fontFamily: 'var(--font-sans)' }}>
                        {item.number}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={cycleTOCState}
                aria-label="Expand sidebar"
                className="mt-4 hover:bg-[var(--black-100)] transition-colors rounded"
                style={{ padding: 'var(--space-2)', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <ChevronRight aria-hidden="true" style={{ width: '1rem', height: '1rem', color: 'var(--black-500)' }} />
              </button>
            </div>
          )}

          {/* Collapse button — half-outside at -right-4 */}
          {tocState !== 'minimal' && (
            <button
              type="button"
              onClick={cycleTOCState}
              aria-label="Collapse sidebar"
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
                transition: prefersReducedMotion ? 'none' : `box-shadow var(--duration-fast) var(--ease-smooth)`,
              }}
            >
              <ChevronLeft
                aria-hidden="true"
                style={{
                  width: '1rem',
                  height: '1rem',
                  color: 'var(--black-600)',
                }}
              />
            </button>
          )}
        </aside>

        {/* ----------------------------------------------------------------
            Main content — multi-chapter preview
        ---------------------------------------------------------------- */}
        <main
          id="sample-report-content"
          className="flex-1 overflow-hidden"
          style={{ background: 'var(--white)' }}
        >
          <div
            style={{
              maxWidth: 'var(--container-page)',
              margin: '0 auto',
              paddingLeft: 'var(--padding-mobile)',
              paddingRight: 'var(--padding-mobile)',
              paddingTop: 'var(--space-8)',
              paddingBottom: 'var(--space-8)',
            }}
            className="sm:px-6 md:px-10 lg:px-12 sm:py-12 md:py-16"
          >
            {chapters.map((chapter, idx) => (
              <div key={chapter.id}>
                {/* Chapter anchor */}
                <div id={chapter.id} className="scroll-mt-[72px]">
                  {chapter.content}
                </div>

                {/* Chapter divider — `border-t border-black/5` between chapters */}
                {idx < chapters.length - 1 && (
                  <div
                    className="my-8 sm:my-12"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ----------------------------------------------------------------
          Mobile floating TOC button — hidden lg+
      ---------------------------------------------------------------- */}
      <button
        type="button"
        aria-label="Open table of contents"
        className="fixed bottom-6 right-4 z-50 lg:hidden rounded-full flex items-center justify-center gap-2"
        style={{
          background: 'var(--black-900)',
          color: 'var(--white)',
          padding: 'var(--space-3) var(--space-4)',
          boxShadow: 'var(--shadow-lg)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <List aria-hidden="true" style={{ width: '1.25rem', height: '1.25rem' }} />
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-sans)', fontWeight: 'var(--font-weight-medium)' }}>Contents</span>
      </button>
    </section>
  );
}
