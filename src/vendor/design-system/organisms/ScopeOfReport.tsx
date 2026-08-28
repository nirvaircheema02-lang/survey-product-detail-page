'use client';

/**
 * ScopeOfReport — Report PDP chapter section embedding MindMap preview + modal
 *
 * WHAT: Chapter 2 section presenting the report's taxonomy as an interactive mind
 *       map preview card. A 600px-tall card shows MindMap in 'preview' mode.
 *       Hovering reveals a gradient overlay CTA ("Click to Explore"). Clicking opens
 *       MindMapModal at full 95vw × 90vh for deep pan/zoom/search.
 *
 * WHY: V0.3 regressed this section to a flat 2-column bullet grid ("NO cards") — the
 *      canonical design is an interactive D3 hierarchy. This organism restores the
 *      V0.2 canonical pattern and prevents future AI regression.
 *
 * WHEN: Use on Report PDP at the Scope/Coverage chapter position (Chapter 2 canonical).
 *       Always receives props for the mindMapData — never hardcodes data.
 *
 * WHEN NOT: Do not use for navigational TOC (use TableOfContentsSidebar). Do not use
 *           when the taxonomy has <5 nodes (use a simple ul list instead). Do not wrap
 *           in another SectionWrapper — this organism owns its own section element.
 *
 * WHERE: core-v2/src/organisms/ScopeOfReport.tsx
 *        Canonical source: V0.2-for-ds src/app/components/ScopeOfReport.tsx:240-313
 *
 * HOW: Composes OverheadText + LabelHeadingPair for the header region. MindMap in a
 *      Card wrapper with hover overlay (Framer motion opacity transition). MindMapModal
 *      mounts controlled by local isModalOpen state. SectionWrapper handles section
 *      padding + bg token. Dot-pattern bg is optional via showDotPattern prop.
 *
 * A11Y: The preview card uses a semantic `<button>` (single interactive surface).
 *       The MindMap canvas inside is aria-hidden="true" in preview mode — D3-injected
 *       node role=button elements are hidden from AT to prevent nested-interactive violation.
 *       The hover overlay is pointer-events:none (decorative). MindMapModal handles its own a11y.
 *       Focus returns to the card button on modal close.
 *
 * MOTION: Framer motion whileHover opacity transition on overlay (useReducedMotion
 *         skips). Modal open/close via AnimatePresence in MindMapModal.
 *
 * COMPOSITION: SectionWrapper (bg variant) · OverheadText · LabelHeadingPair ·
 *              MindMap (preview) · MindMapModal
 *
 * TOKENS: --black-50 bg · --black-200 card border · --radius-md card radius ·
 *         --shadow-brand-periwinkle hover shadow · --space-* vertical rhythm ·
 *         --ease-smooth transition · --duration-fast 200ms
 *
 * @promotedFrom V0.2-for-ds src/app/components/ScopeOfReport.tsx (DS Port Batch 3.2c · 2026-05-19)
 */

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { MindMap, type MindMapNode } from './MindMap';
import { MindMapModal } from './MindMapModal';
import { OverheadText } from '../atoms/OverheadText';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScopeOfReportProps {
  /**
   * Root node of the mind map hierarchy.
   * The tree will start collapsed — only root children visible.
   * Typically 5-8 top-level dimensions, each with 2-4 sub-levels.
   */
  mindMapData: MindMapNode;
  /**
   * Chapter eyebrow label — displayed via OverheadText above heading.
   * @default 'CHAPTER 2 · REPORT COVERAGE'
   */
  chapterLabel?: string;
  /**
   * Primary section heading.
   * @default 'Scope of the Report'
   */
  heading?: string;
  /**
   * Description paragraph below heading. Keep under 30 words for visual balance.
   */
  description?: string;
  /**
   * Modal title when opened in full mode.
   * @default 'Report Coverage Taxonomy'
   */
  modalTitle?: string;
  /**
   * Whether to show the dot-pattern decorative background.
   * @default true
   */
  showDotPattern?: boolean;
  /**
   * Section element id — for TOC scroll-spy anchoring.
   * @default 'scope-of-report'
   */
  id?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ScopeOfReport({
  mindMapData,
  chapterLabel = 'CHAPTER 2 · REPORT COVERAGE',
  heading = 'Scope of the Report',
  description = 'Comprehensive analysis across key market dimensions, offering actionable insights for strategic decision-making and investment planning.',
  modalTitle = 'Report Coverage Taxonomy',
  showDotPattern = true,
  id = 'scope-of-report',
}: ScopeOfReportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ── Node click in preview mode — open modal ─────────────────────────────
  const handlePreviewNodeClick = (_name: string) => {
    setIsModalOpen(true);
  };

  // ── Hover overlay animation ──────────────────────────────────────────────
  const overlayVariants: Variants = prefersReducedMotion
    ? { rest: { opacity: 0 }, hover: { opacity: 1 } }
    : {
        rest: { opacity: 0 },
        hover: { opacity: 1, transition: { duration: 0.3 } },
      };

  return (
    <section
      id={id}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'var(--section-py-lg, 3rem)',
        paddingBottom: 'var(--section-py-lg, 3rem)',
        backgroundColor: 'var(--black-50)',
      }}
      aria-labelledby={`${id}-heading`}
    >
      {/* ── Dot pattern (decorative) ──────────────────────────────────────── */}
      {showDotPattern && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.4,
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--black-300) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* ── Content container ─────────────────────────────────────────────── */}
      <div
        className="relative mx-auto px-4 sm:px-6 md:px-8"
        style={{ maxWidth: 'var(--container-page)' }}
      >
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <OverheadText>{chapterLabel}</OverheadText>
          </div>
          <div id={`${id}-heading`}>
            <LabelHeadingPair
              label=""
              heading={heading}
            />
          </div>
          {description && (
            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--black-500)',
                maxWidth: '48rem',
                lineHeight: '1.6',
                marginTop: 'var(--space-4)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* ── MindMap preview card ──────────────────────────────────────────── */}
        <div className="flex justify-center">
          <motion.div
            ref={cardRef}
            className="w-full overflow-hidden group"
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            {/* Semantic button — single interactive surface; inner MindMap nodes are aria-hidden in preview */}
            <button
              type="button"
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2"
              aria-label="Open interactive mind map — press Enter to explore in full screen"
              onClick={() => setIsModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModalOpen(true);
                }
              }}
            >
            <div
              className="overflow-hidden transition-shadow"
              style={{
                border: '1px solid var(--black-200)',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                transitionDuration: '300ms',
                transitionTimingFunction: 'var(--ease-smooth)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-brand-periwinkle, 0 0 0 2px var(--purple-300))';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* 600px fixed-height canvas — aria-hidden: inner D3 nodes are decorative in preview mode */}
              <div className="relative" aria-hidden="true" style={{ height: '600px' }}>
                <MindMap
                  data={mindMapData}
                  searchTerm=""
                  onNodeClick={handlePreviewNodeClick}
                  interactionMode="preview"
                  ariaLabel={`${heading} mind map preview — activate to explore`}
                  ariaDescription="Hierarchical mind map showing report coverage dimensions. Press Enter to open in full screen for pan, zoom, and search."
                />

                {/* Hover overlay (decorative + CTA label) */}
                <motion.div
                  className="absolute inset-0 flex items-end justify-center pointer-events-none"
                  style={{ paddingBottom: 'var(--space-8)' }}
                  variants={overlayVariants}
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
                    }}
                  />
                  <div
                    className="relative flex items-center gap-2"
                    style={{ color: '#ffffff' }}
                  >
                    <Maximize2
                      aria-hidden="true"
                      style={{ width: '1.25rem', height: '1.25rem' }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: '700',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Click to Explore Interactive Mind Map
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── MindMapModal ──────────────────────────────────────────────────── */}
      <MindMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={mindMapData}
        title={modalTitle}
        openerRef={cardRef as React.RefObject<HTMLElement>}
      />
    </section>
  );
}

export default ScopeOfReport;
