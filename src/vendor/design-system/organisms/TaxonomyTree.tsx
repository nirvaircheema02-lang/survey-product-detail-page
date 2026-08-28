'use client';

/**
 * TaxonomyTree — Industry taxonomy chapter section sharing the MindMap D3 engine
 *
 * WHAT: Chapter section presenting an industry taxonomy as an interactive D3 mind map.
 *       Structurally identical to ScopeOfReport but styled for taxonomy use-cases:
 *       white background, left-aligned layout, with an inline search bar above the card
 *       (vs. ScopeOfReport's modal-only search). Also renders a full-mode MindMap
 *       directly (no preview→modal indirection) when variant="inline", or follows
 *       the preview→modal pattern when variant="preview" (default).
 *
 * WHY: V0.3 invented a "tree-style parent → children list · indentation + chevrons"
 *      (TaxonomySection.tsx:4 regression) because this organism was missing. Taxonomy
 *      and Scope both use the D3 engine — but taxonomy chapters often appear on white bg
 *      with an inline search affordance rather than the dot-pattern + click-to-modal
 *      pattern of ScopeOfReport.
 *
 * WHEN: Use at the taxonomy chapter of a Report PDP (typically Chapter 3 or per-section
 *       label). Use variant="preview" when the section has limited vertical space and
 *       you want the modal to provide the full canvas. Use variant="inline" when the
 *       section height can accommodate a 700-800px D3 canvas directly.
 *
 * WHEN NOT: Don't use for navigational trees (use TableOfContentsSidebar). Don't use
 *           for competitive comparison trees (those belong in CompetitiveLandscape).
 *           Don't double-wrap with another SectionWrapper.
 *
 * WHERE: core-v2/src/organisms/TaxonomyTree.tsx
 *        Canonical source: V0.2-for-ds MindMapDemo.tsx (shares MindMap engine ·
 *        "Logistics Industry Taxonomy" data · same component · different data/context)
 *        V0.2 source: projects/V0.2-for-ds/src/app/pages/MindMapDemo.tsx
 *
 * HOW: Composes OverheadText + LabelHeadingPair for the header. When variant="preview":
 *      600px card w/ hover overlay + MindMapModal (same as ScopeOfReport pattern).
 *      When variant="inline": full D3 canvas at 700px with search bar above and usage
 *      instructions below. Inline search updates MindMap searchTerm in real time.
 *
 * A11Y: Inline search has aria-label + associated hint text. MindMap gets aria-label
 *       referencing the taxonomy name. Modal variant inherits MindMapModal a11y.
 *
 * MOTION: Same as ScopeOfReport — Framer hover overlay · MindMapModal AnimatePresence.
 *         useReducedMotion() disables overlay transitions.
 *
 * COMPOSITION: OverheadText · LabelHeadingPair · MindMap · MindMapModal (preview only)
 *
 * TOKENS: bg white default (vs --black-50 in ScopeOfReport) · --black-200 border ·
 *         --radius-md card radius · --space-* rhythm · --container-page max-width
 *
 * @promotedFrom V0.2-for-ds src/app/pages/MindMapDemo.tsx (DS Port Batch 3.2c · 2026-05-19)
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { MindMap, type MindMapNode } from './MindMap';
import { MindMapModal } from './MindMapModal';
import { OverheadText } from '../atoms/OverheadText';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TaxonomyTreeProps {
  /**
   * Root node of the taxonomy hierarchy.
   * Typically represents an industry name with subcategory layers.
   */
  taxonomyData: MindMapNode;
  /**
   * Chapter eyebrow label.
   * @default 'CHAPTER 3 · MARKET TAXONOMY'
   */
  chapterLabel?: string;
  /**
   * Primary section heading.
   * @default 'Industry Taxonomy'
   */
  heading?: string;
  /**
   * Descriptive paragraph below heading.
   */
  description?: string;
  /**
   * Modal title when opened in full mode (preview variant only).
   * Defaults to the taxonomy root node name.
   */
  modalTitle?: string;
  /**
   * Display variant:
   * - 'preview' — 600px card w/ hover overlay → opens MindMapModal (default)
   * - 'inline'  — 700px full-mode D3 canvas directly in section w/ search bar
   * @default 'preview'
   */
  variant?: 'preview' | 'inline';
  /**
   * Section bg color — 'white' | 'warm' | 'subtle'.
   * white = #ffffff, warm = --warm-300, subtle = --black-50
   * @default 'white'
   */
  bgVariant?: 'white' | 'warm' | 'subtle';
  /**
   * Section id for TOC scroll-spy anchoring.
   * @default 'taxonomy-tree'
   */
  id?: string;
}

const BG_MAP: Record<NonNullable<TaxonomyTreeProps['bgVariant']>, string> = {
  white: '#ffffff',
  warm: 'var(--warm-300)',
  subtle: 'var(--black-50)',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function TaxonomyTree({
  taxonomyData,
  chapterLabel = 'CHAPTER 3 · MARKET TAXONOMY',
  heading = 'Industry Taxonomy',
  description,
  modalTitle,
  variant = 'preview',
  bgVariant = 'white',
  id = 'taxonomy-tree',
}: TaxonomyTreeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Debounce search input → 300ms · prevents D3 re-render storm on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const resolvedModalTitle = modalTitle ?? taxonomyData.name;
  const bgColor = BG_MAP[bgVariant];

  // ── Overlay hover animation ──────────────────────────────────────────────
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
        backgroundColor: bgColor,
      }}
      aria-labelledby={`${id}-heading`}
    >
      <div
        className="relative mx-auto px-4 sm:px-6 md:px-8"
        style={{ maxWidth: 'var(--container-page)' }}
      >
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
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

        {/* ── Inline variant: search bar + full D3 canvas ─────────────────── */}
        {variant === 'inline' && (
          <>
            <div style={{ marginBottom: 'var(--space-8)', maxWidth: '28rem' }}>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search ${heading.toLowerCase()}...`}
                aria-label={`Search within ${heading}`}
                className="w-full transition-all"
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--black-900)',
                  border: '1px solid var(--black-200)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--purple-500)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--purple-100)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--black-200)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Full-mode canvas */}
            <div
              style={{
                height: '700px',
                border: '1px solid var(--black-200)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <MindMap
                data={taxonomyData}
                searchTerm={searchTerm}
                onNodeClick={(_name) => { /* Analytics hook point */ }}
                interactionMode="full"
                ariaLabel={`${heading} interactive tree`}
                ariaDescription={`Interactive taxonomy tree for ${heading}. Click nodes to expand. Drag to pan. Scroll to zoom. Use Tab to navigate nodes with keyboard.`}
              />
            </div>

            {/* Usage hint */}
            <div
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--black-50)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--black-200)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--black-600)',
                  margin: 0,
                }}
              >
                <strong style={{ color: 'var(--black-900)' }}>How to use:</strong>{' '}
                Click nodes to expand or collapse subcategories. Drag the canvas to pan. Use scroll wheel to zoom in or out. Use the search bar to highlight matching categories.
              </p>
            </div>
          </>
        )}

        {/* ── Preview variant: 600px card → opens modal ───────────────────── */}
        {variant === 'preview' && (
          <div className="flex justify-center">
            <motion.div
              ref={cardRef}
              role="button"
              tabIndex={0}
              aria-label={`Open ${heading} interactive taxonomy — click to explore in full screen`}
              onClick={() => setIsModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModalOpen(true);
                }
              }}
              className="w-full overflow-hidden"
              whileHover="hover"
              initial="rest"
              animate="rest"
              style={{ cursor: 'pointer' }}
            >
              <div
                className="overflow-hidden transition-shadow"
                style={{
                  border: '1px solid var(--black-200)',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  transitionDuration: '300ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    'var(--shadow-brand-periwinkle, 0 0 0 2px var(--purple-300))';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div className="relative" style={{ height: '600px' }}>
                  <MindMap
                    data={taxonomyData}
                    searchTerm=""
                    onNodeClick={() => setIsModalOpen(true)}
                    interactionMode="preview"
                    ariaLabel={`${heading} taxonomy preview — activate to explore`}
                    ariaDescription="Hierarchical taxonomy tree preview. Press Enter to open in full screen for pan, zoom, and search."
                  />

                  {/* Hover overlay */}
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
                        Click to Explore Interactive Taxonomy
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* ── MindMapModal (preview variant only) ─────────────────────────── */}
      {variant === 'preview' && (
        <MindMapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={taxonomyData}
          title={resolvedModalTitle}
          subtitle="Click to expand categories • Drag to pan • Scroll to zoom"
          openerRef={cardRef as React.RefObject<HTMLElement>}
        />
      )}
    </section>
  );
}

export default TaxonomyTree;
