/**
 * AccordionItem — Molecule
 *
 * WHAT: Single bordered accordion card — question trigger + animated answer panel.
 *       Per-item card with `border border-black/10 rounded-[--radius-sm]` chrome,
 *       hover darkens border to black/25. ChevronDown rotates 180° on open.
 *       Panel reveals via Framer Motion height animation (0 → auto).
 *
 * WHY: V0_lite FAQSection.tsx (L81-127) renders each FAQ as an individually-bordered card,
 *      NOT a connected accordion strip. This pattern is more scannable for pricing FAQs —
 *      each question is a discrete unit (Gestalt proximity — gap-4 between cards = separate).
 *      Framer Motion height animation avoids CSS clip-path shimmy on variable-length answers.
 *
 * WHEN: FAQ sections, help pages, report-detail expand-collapse details.
 *       Compose multiple AccordionItems in `<div className="space-y-4">`.
 *
 * WHEN NOT: Do NOT use for navigation menus — use DropdownPanel.
 *           Do NOT use for filter categories — use FilterAccordion molecule.
 *           Do NOT use inside another accordion (no nesting).
 *
 * WHERE: FAQSection organism · HelpCenter page · any question-answer list.
 *
 * HOW:
 * ```tsx
 * // Controlled
 * <AccordionItem
 *   id="faq-1"
 *   question="What format do I receive the report in?"
 *   answer="You receive PDF, Excel, and PowerPoint formats."
 *   isOpen={openId === 'faq-1'}
 *   onToggle={() => setOpenId(openId === 'faq-1' ? null : 'faq-1')}
 * />
 *
 * // Uncontrolled (manages own state)
 * <AccordionItem
 *   id="faq-2"
 *   question="How recent is the data?"
 *   answer="All reports use 2024 as the base year."
 * />
 * ```
 *
 * A11y:
 * - Trigger is a `<button>` with `aria-expanded` + `aria-controls`
 * - Answer region has `role="region"` + `aria-labelledby`
 * - Focus ring on trigger: `focus-visible:ring-2 focus-visible:ring-black/20`
 * - ChevronDown is aria-hidden (decorative rotation)
 *
 * Motion: Framer height animation · useReducedMotion guard (instant when reduced).
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · FAQSection.tsx:81-127
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */
'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

export interface AccordionItemProps {
  /** Unique ID for ARIA wiring (aria-controls / aria-labelledby). */
  id: string;
  /** Question / trigger text. */
  question: string;
  /**
   * Answer content. Accepts string or ReactNode for rich text / lists.
   */
  answer: ReactNode;
  /**
   * Controlled open state. When provided, component is controlled.
   * When omitted, component manages its own state (uncontrolled).
   */
  isOpen?: boolean;
  /**
   * Toggle callback (controlled mode). Called with no args.
   */
  onToggle?: () => void;
  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;
  /** Additional className on the root card div. */
  className?: string;
}

/**
 * AccordionItem
 *
 * Bordered FAQ card with Framer height animation.
 * Controlled via isOpen+onToggle OR self-managed (defaultOpen).
 */
export function AccordionItem({
  id,
  question,
  answer,
  isOpen: isOpenProp,
  onToggle,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const triggerId = `faq-question-${id}`;
  const panelId = `faq-answer-${id}`;

  return (
    <div
      data-component="AccordionItem"
      className={cn(
        'border rounded-[var(--radius-sm)] overflow-hidden transition-colors duration-200',
        isOpen
          ? 'border-black/25'
          : 'border-black/10 hover:border-black/25',
        className
      )}
    >
      {/* Trigger button */}
      <button
        id={triggerId}
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left',
          'hover:bg-black/[0.02] transition-colors duration-200 group',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/20 focus-visible:outline-offset-2'
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className="font-sans font-medium pr-4 leading-relaxed"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--black-900)' }}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 transition-transform',
            prefersReducedMotion ? '' : 'duration-300',
            isOpen && 'rotate-180'
          )}
          style={{ color: 'var(--icon-utility, #737373)' }}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {/* Animated answer panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 leading-relaxed"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--black-500)',
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
