'use client';

/**
 * LongFormReader — orchestrator organism for long-form scroll surfaces (reports, case studies).
 *
 * WHY: Long-form research documents (100-200+ pages) need persistent navigation, progress
 *      tracking, and mobile accessibility. A bare-scroll page loses users at chapter 2 —
 *      there is no wayfinding. This orchestrator composes sidebar TOC (3 states), reading
 *      progress bar, active-section tracking, and a slot-based content area to solve all
 *      four problems in a single composable unit.
 *
 * WHAT: Desktop sticky sidebar with 3 states (open 280px → compressed 200px → minimal 60px
 *       dot-nav). Mobile companion: floating bottom bar expanding to bottom-sheet with drag
 *       handle. Active chapter tracked via IntersectionObserver (useActiveSection hook).
 *       Past chapters show checkmark, current highlighted, future/locked appropriately styled.
 *       ReadingProgressBar sits at top of viewport. CTA slot in open sidebar state.
 *       Children render in the main content column.
 *
 * WHEN: Any page with 4+ navigable anchor chapters and long scroll depth. Report viewer,
 *       case study template, documentation pages.
 *
 * WHEN NOT: Short pages (<3 sections) — overhead is unjustified. Use TableOfContents atom
 *           directly for simple sidebar-only pattern without mobile sheet.
 *
 * WHERE: design-system/core-v2/src/organisms/LongFormReader.tsx
 *        Consumed by: V0_lite_report sample-report page, V0.2_report report viewer.
 *
 * HOW:
 * ```tsx
 * const chapters: Chapter[] = [
 *   { id: 'chapter-1', label: 'Executive Summary', state: 'current' },
 *   { id: 'chapter-2', label: 'Market Overview', state: 'future' },
 *   { id: 'chapter-3', label: 'Competitive Landscape', state: 'locked' },
 * ];
 *
 * <LongFormReader
 *   chapters={chapters}
 *   showProgressBar
 *   ctaSlot={<Button variant="brand" size="sm">Unlock Full Report</Button>}
 *   onChapterClick={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
 * >
 *   <section id="chapter-1">...</section>
 *   <section id="chapter-2">...</section>
 * </LongFormReader>
 * ```
 *
 * DESIGN DECISIONS:
 * - No shadow on sidebar (supporting element, must not compete with content hierarchy).
 * - bg white/80 + backdrop-blur provides depth without shadow (post-audit pattern from SidebarTOC).
 * - border-r uses var(--color-ramp-warm-500) for subtle structural delineation.
 * - Transition[width] guarded by useReducedMotion — skips animation for accessibility.
 * - Mobile sheet: max-h 70vh, drag handle at top, backdrop overlay on open.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/SampleReportPreview.tsx
 *               + sample-report/SidebarTOC.tsx
 * @reusabilityScore 5/5 — slot-based, data-driven, zero hardcoded content
 * @a11y_status pass — aria-label nav, aria-current step, focus-visible rings, 44px mobile touch
 * @lifecycle stable
 */

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ReadingProgressBar } from './ReadingProgressBar';
import { useActiveSection } from '../hooks/useActiveSection';
import { useMountTransition } from '../hooks/useMountTransition';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single navigable chapter entry in the long-form reader. */
export interface Chapter {
  /** Unique anchor ID matching `<section id="...">` in the content. */
  id: string;
  /** Display label shown in the TOC sidebar and mobile sheet. */
  label: string;
  /**
   * Visual state of this chapter entry.
   * - past: completed, shows checkmark
   * - current: active, highlighted
   * - future: accessible but not yet reached
   * - locked: inaccessible (paywall / preview mode)
   */
  state: 'past' | 'current' | 'future' | 'locked';
  /** Optional URL for anchor link navigation (alternative to scroll). */
  href?: string;
}

/** Sidebar collapse states — open (280px) → compressed (200px) → minimal (60px dots). */
type SidebarState = 'open' | 'compressed' | 'minimal';

/** Props for the LongFormReader organism. */
export interface LongFormReaderProps {
  /** Ordered chapter list for sidebar TOC and mobile sheet. */
  chapters: Chapter[];
  /** Main reading content rendered in the content column. */
  children: ReactNode;
  /**
   * Initial sidebar collapse state.
   * @default 'open'
   */
  initialSidebarState?: SidebarState;
  /**
   * When true, renders ReadingProgressBar fixed at top of viewport.
   * @default false
   */
  showProgressBar?: boolean;
  /**
   * CTA content rendered at the bottom of the sidebar in "open" state only.
   * Typically a Button or promotional block.
   */
  ctaSlot?: ReactNode;
  /** Fired when the user clicks a chapter entry. Use to scroll or route. */
  onChapterClick?: (chapterId: string) => void;
  /** Additional class names applied to the outer wrapper div. */
  className?: string;
}

// ─── Sidebar width map ────────────────────────────────────────────────────────

const SIDEBAR_WIDTHS: Record<SidebarState, number> = {
  open: 280,
  compressed: 200,
  minimal: 60,
};

// ─── Chapter dot indicator (minimal state) ────────────────────────────────────

interface ChapterDotProps {
  chapter: Chapter;
  isActive: boolean;
  onClick: () => void;
}

function ChapterDot({ chapter, isActive, onClick }: ChapterDotProps) {
  if (chapter.state === 'locked') {
    return (
      <div
        aria-disabled="true"
        aria-label={`${chapter.label} (locked)`}
        className="w-6 h-6 rounded-full flex items-center justify-center cursor-not-allowed"
        style={{
          background: 'var(--color-ramp-warm-300)',
          color: 'rgba(0,0,0,0.3)',
          fontSize: 'var(--typography-size-2xs, 0.65rem)',
        }}
      >
        {/* lock glyph via unicode — no dep needed at this size */}
        <span aria-hidden="true" style={{ fontSize: '10px' }}>&#x1F512;</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={chapter.label}
      aria-current={isActive ? 'step' : undefined}
      className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        background: isActive || chapter.state === 'past' ? 'var(--color-foundation-black)' : 'var(--color-ramp-warm-300)',
        color: isActive || chapter.state === 'past' ? 'var(--color-foundation-white)' : 'rgba(0,0,0,0.5)',
        // focus ring color
        '--tw-ring-color': 'var(--color-brand-red)',
      } as React.CSSProperties}
    >
      {chapter.state === 'past' ? (
        <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
      ) : (
        <span aria-hidden="true" />
      )}
    </button>
  );
}

// ─── Chapter row (open / compressed states) ───────────────────────────────────

interface ChapterRowProps {
  chapter: Chapter;
  isActive: boolean;
  isCompressed: boolean;
  onClick: () => void;
}

function ChapterRow({ chapter, isActive, isCompressed, onClick }: ChapterRowProps) {
  if (chapter.state === 'locked') {
    return (
      <div
        className="w-full text-left flex items-center gap-2 cursor-not-allowed select-none"
        style={{
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-element)',
        }}
      >
        <div
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-ramp-warm-300)' }}
        >
          {/* lock */}
          <span aria-hidden="true" style={{ fontSize: '9px' }}>&#x1F512;</span>
        </div>
        {!isCompressed && (
          <span
            className="truncate flex-1"
            style={{
              fontSize: 'var(--typography-size-xs)',
              color: 'rgba(0,0,0,0.3)',
            }}
          >
            {chapter.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'step' : undefined}
      className="w-full text-left flex items-center gap-2 group transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-element)',
        background: isActive ? 'var(--color-ramp-warm-200)' : 'transparent',
        fontWeight: isActive ? 700 : 400,
        '--tw-ring-color': 'var(--color-brand-red)',
      } as React.CSSProperties}
    >
      {/* State indicator dot */}
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
        style={{
          background: chapter.state === 'past' || isActive
            ? 'var(--color-foundation-black)'
            : 'var(--color-ramp-warm-300)',
          color: chapter.state === 'past' || isActive
            ? 'var(--color-foundation-white)'
            : 'rgba(0,0,0,0.5)',
        }}
      >
        {chapter.state === 'past' ? (
          <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
        ) : (
          <span aria-hidden="true" style={{ fontSize: '10px', lineHeight: 1 }}>
            {/* empty — dot is the background circle itself */}
          </span>
        )}
      </div>

      {!isCompressed && (
        <span
          className="truncate flex-1"
          style={{
            fontSize: 'var(--typography-size-xs)',
            color: isActive ? 'var(--color-foundation-black)' : 'rgba(0,0,0,0.6)',
          }}
        >
          {chapter.label}
        </span>
      )}
    </button>
  );
}

// ─── Mobile bottom bar + sheet ────────────────────────────────────────────────

interface MobileSheetProps {
  chapters: Chapter[];
  activeId: string;
  onChapterClick: (id: string) => void;
}

function MobileSheet({ chapters, activeId, onChapterClick }: MobileSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldRender, isTransitioning } = useMountTransition(isOpen, 300);
  const reducedMotion = useReducedMotion();

  const activeChapter = chapters.find((c) => c.id === activeId) ?? chapters.find((c) => c.state === 'current');

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Floating bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderTop: '1px solid var(--color-ramp-warm-500)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: 'var(--space-3) var(--space-4)' }}
        >
          <div className="flex flex-col min-w-0">
            <span
              className="uppercase tracking-wider font-bold"
              style={{
                fontSize: 'var(--typography-size-2xs, 0.65rem)',
                color: 'rgba(0,0,0,0.4)',
              }}
            >
              Now reading
            </span>
            <span
              className="truncate font-medium"
              style={{
                fontSize: 'var(--typography-size-xs)',
                color: 'var(--color-foundation-black)',
              }}
            >
              {activeChapter?.label ?? 'Table of Contents'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open table of contents"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded"
            style={{
              fontSize: 'var(--typography-size-xs)',
              color: 'var(--color-brand-red)',
              fontWeight: 600,
              padding: 'var(--space-2) var(--space-3)',
              // 44px min touch area
              minHeight: '44px',
            }}
          >
            Chapters
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      {shouldRender && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] lg:hidden transition-opacity duration-300"
            style={{
              background: 'rgba(0,0,0,0.4)',
              opacity: isTransitioning ? 1 : 0,
            }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Sheet panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden transition-transform duration-300"
            style={{
              background: 'var(--color-foundation-white)',
              borderRadius: 'var(--radius-card, 12px) var(--radius-card, 12px) 0 0',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              transform: isTransitioning ? 'translateY(0)' : 'translateY(100%)',
              // skip animation if reduced motion
              transitionDuration: reducedMotion ? '0ms' : '300ms',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div
                className="rounded-full"
                style={{
                  width: 36,
                  height: 4,
                  background: 'var(--color-ramp-warm-500)',
                }}
                aria-hidden="true"
              />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--color-ramp-warm-400)',
              }}
            >
              <h3
                className="font-bold uppercase tracking-wider"
                style={{ fontSize: 'var(--typography-size-xs)', color: 'var(--color-foundation-black)' }}
              >
                Table of Contents
              </h3>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close table of contents"
                className="flex items-center justify-center transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Chapter list */}
            <nav
              aria-label="Report chapters"
              className="overflow-y-auto flex-1"
              style={{ padding: 'var(--space-2) var(--space-2)' }}
            >
              {chapters.map((chapter) => {
                const isActive = chapter.id === activeId || chapter.state === 'current';
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    disabled={chapter.state === 'locked'}
                    aria-current={isActive ? 'step' : undefined}
                    aria-disabled={chapter.state === 'locked' ? 'true' : undefined}
                    onClick={() => {
                      if (chapter.state !== 'locked') {
                        onChapterClick(chapter.id);
                        handleClose();
                      }
                    }}
                    className={`w-full text-left flex items-center gap-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${
                      chapter.state === 'locked' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                    style={{
                      padding: 'var(--space-3) var(--space-3)',
                      borderRadius: 'var(--radius-element)',
                      background: isActive ? 'var(--color-ramp-warm-200)' : 'transparent',
                      // 44px min touch target
                      minHeight: '44px',
                    }}
                  >
                    {/* State indicator */}
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{
                        background:
                          chapter.state === 'past' || isActive
                            ? 'var(--color-foundation-black)'
                            : 'var(--color-ramp-warm-300)',
                        color:
                          chapter.state === 'past' || isActive
                            ? 'var(--color-foundation-white)'
                            : 'rgba(0,0,0,0.5)',
                      }}
                    >
                      {chapter.state === 'past' ? (
                        <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
                      ) : chapter.state === 'locked' ? (
                        <span aria-hidden="true" style={{ fontSize: '9px' }}>&#x1F512;</span>
                      ) : null}
                    </div>
                    <span
                      className="flex-1"
                      style={{
                        fontSize: 'var(--typography-size-sm)',
                        fontWeight: isActive ? 700 : 400,
                        color: chapter.state === 'locked' ? 'rgba(0,0,0,0.35)' : 'var(--color-foundation-black)',
                      }}
                    >
                      {chapter.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

// ─── Main organism ────────────────────────────────────────────────────────────

/**
 * LongFormReader — orchestrator for long-form scroll reading surfaces.
 * Composes sidebar TOC (3 states), reading progress, mobile sheet, and content slot.
 */
export function LongFormReader({
  chapters,
  children,
  initialSidebarState = 'open',
  showProgressBar = false,
  ctaSlot,
  onChapterClick,
  className = '',
}: LongFormReaderProps) {
  const [sidebarState, setSidebarState] = useState<SidebarState>(initialSidebarState);
  const reducedMotion = useReducedMotion();
  const isScrollingRef = useRef(false);

  // Derive section IDs from chapters for active tracking
  const chapterIds = chapters.filter((c) => c.state !== 'locked').map((c) => c.id);
  const activeId = useActiveSection(chapterIds);

  const cycleSidebar = useCallback(() => {
    setSidebarState((prev) =>
      prev === 'open' ? 'compressed' : prev === 'compressed' ? 'minimal' : 'open'
    );
  }, []);

  const handleChapterClick = useCallback(
    (chapterId: string) => {
      const el = document.getElementById(chapterId);
      if (el) {
        isScrollingRef.current = true;
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        setTimeout(() => { isScrollingRef.current = false; }, 1000);
      }
      onChapterClick?.(chapterId);
    },
    [onChapterClick, reducedMotion]
  );

  const sidebarWidth = SIDEBAR_WIDTHS[sidebarState];
  const isMinimal = sidebarState === 'minimal';
  const isCompressed = sidebarState === 'compressed';

  return (
    <div data-component="LongFormReader" className={`relative ${className}`}>
      {showProgressBar && <ReadingProgressBar />}

      <div className="flex items-start">
        {/* ── Desktop Sidebar ──────────────────────────────────── */}
        <aside
          aria-label="Report chapters"
          role="navigation"
          className="flex-shrink-0 hidden lg:block sticky self-start z-40"
          style={{
            // Transition width — skip when reduced motion
            width: sidebarWidth,
            top: 50,
            height: 'calc(100vh - 50px)',
            transition: reducedMotion ? 'none' : 'width 300ms ease-in-out',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid var(--color-ramp-warm-500)',
          }}
        >
          {/* ── Non-minimal: full panel ──── */}
          {!isMinimal && (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center gap-2 flex-shrink-0"
                style={{
                  padding: 'var(--space-5) var(--space-4) var(--space-3)',
                  borderBottom: '1px solid var(--color-ramp-warm-400)',
                }}
              >
                <h3
                  className="font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ fontSize: 'var(--typography-size-2xs, 0.65rem)', color: 'var(--color-foundation-black)' }}
                >
                  {isCompressed ? 'TOC' : 'Table of Contents'}
                </h3>
                {!isCompressed && (
                  <span
                    className="ml-auto rounded-full"
                    style={{
                      fontSize: 'var(--typography-size-2xs, 0.65rem)',
                      color: 'rgba(0,0,0,0.5)',
                      background: 'var(--color-ramp-warm-300)',
                      padding: '2px 8px',
                    }}
                  >
                    {chapters.length} ch
                  </span>
                )}
              </div>

              {/* Chapter list */}
              <nav
                aria-label="Chapters"
                className="flex-1 overflow-y-auto min-h-0"
                style={{ padding: 'var(--space-2)' }}
              >
                {chapters.map((chapter) => {
                  const isActive = chapter.id === activeId;
                  return (
                    <ChapterRow
                      key={chapter.id}
                      chapter={chapter}
                      isActive={isActive}
                      isCompressed={isCompressed}
                      onClick={() => handleChapterClick(chapter.id)}
                    />
                  );
                })}
              </nav>

              {/* CTA slot — open state only */}
              {!isCompressed && ctaSlot && (
                <div
                  className="flex-shrink-0"
                  style={{
                    padding: 'var(--space-3) var(--space-4) var(--space-4)',
                    borderTop: '1px solid var(--color-ramp-warm-400)',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-card, 8px)',
                      background: 'var(--color-ramp-warm-200)',
                    }}
                  >
                    {ctaSlot}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Minimal: dot nav ──────────── */}
          {isMinimal && (
            <div
              className="flex flex-col items-center gap-3"
              style={{ padding: 'var(--space-6) var(--space-3)' }}
            >
              {chapters.map((chapter) => {
                const isActive = chapter.id === activeId;
                return (
                  <ChapterDot
                    key={chapter.id}
                    chapter={chapter}
                    isActive={isActive}
                    onClick={() => handleChapterClick(chapter.id)}
                  />
                );
              })}
              {/* Expand button */}
              <button
                type="button"
                onClick={cycleSidebar}
                aria-label="Expand sidebar"
                className="flex items-center justify-center transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-element)',
                  minWidth: 32,
                  minHeight: 32,
                }}
              >
                <ChevronRight className="h-4 w-4" style={{ color: 'rgba(0,0,0,0.5)' }} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* ── Collapse toggle button ──── */}
          {!isMinimal && (
            <button
              type="button"
              onClick={cycleSidebar}
              aria-label="Collapse sidebar"
              className="absolute flex items-center justify-center transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
              style={{
                bottom: '20%',
                right: -16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-foundation-white)',
                border: '1px solid var(--color-ramp-warm-500)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 100,
              }}
            >
              <ChevronLeft className="h-4 w-4" style={{ color: 'rgba(0,0,0,0.6)' }} aria-hidden="true" />
            </button>
          )}
        </aside>

        {/* ── Main content area ────────────────────────────────── */}
        <main
          className="flex-1 min-w-0"
          id="long-form-content"
          style={{ background: 'var(--color-foundation-white)' }}
        >
          {children}
        </main>
      </div>

      {/* ── Mobile companion ─────────────────────────────────────── */}
      <MobileSheet
        chapters={chapters}
        activeId={activeId}
        onChapterClick={handleChapterClick}
      />
    </div>
  );
}
