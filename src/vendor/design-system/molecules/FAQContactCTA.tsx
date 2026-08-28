/**
 * FAQContactCTA — Molecule
 *
 * WHAT: "Still have questions?" card placed after a FAQ accordion list.
 *       Flex row on sm+, stacked on mobile. Gradient bg via --bg-card-takeaways
 *       token. Headline + sub-copy left, CTALink right. Rounded card, soft border.
 *
 * WHY: After scanning FAQs, users who still have questions need a clear escape hatch
 *      to a human or contact path. Placing it immediately after the last accordion item
 *      captures exit intent (Hick's Law — one obvious next action). Gradient bg
 *      differentiates it from FAQ cards above (visual hierarchy / Gestalt figure-ground).
 *
 * WHEN: After any FAQ accordion list (FAQSection organism). Also after any Q&A,
 *       help-center list, or pricing page where users may need support.
 *
 * WHEN NOT: Do NOT use as a section-level CTA (use FinalCTASection organism).
 *           Do NOT use at the top of a FAQ list — always after.
 *           Do NOT nest inside an AccordionItem.
 *
 * WHERE: FAQSection organism · any page with a FAQ block.
 *
 * HOW:
 * ```tsx
 * <FAQContactCTA
 *   headline="Still have questions?"
 *   subCopy="Our research team is here to help you find the right solution"
 *   ctaLabel="Contact Research Team"
 *   ctaHref="/contact"
 * />
 * ```
 *
 * A11y:
 * - Semantic: `<div>` wrapper with `data-component` · no landmark (molecule, not section)
 * - Headline: `<p>` (not heading — card-level text, not page-section heading)
 * - CTALink receives its own a11y from the atom (animated-arrow, brand-red underline)
 *
 * Motion: none (static card). CTALink hover handled by CTALink atom.
 *
 * Tokens: --bg-card-takeaways (gradient), --radius-sm, --text-sm, --text-compact,
 *         --black-500, --black-900 (or CSS black).
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · FAQSection.tsx:127-139
 * @ported 2026-05-19 · aura-builder · Batch 3.2a
 * @status ready
 */

import { CTALink } from '../atoms/CTALink';
import { cn } from '../lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FAQContactCTAProps {
  /**
   * Main question / headline text.
   * @default "Still have questions?"
   */
  headline?: string;
  /**
   * Supporting sub-copy below headline.
   * @default "Our research team is here to help you find the right solution"
   */
  subCopy?: string;
  /**
   * CTA button / link label.
   * @default "Contact Research Team"
   */
  ctaLabel?: string;
  /**
   * CTA href.
   * @default "/contact"
   */
  ctaHref?: string;
  /** Additional className on the root card element. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * FAQContactCTA
 *
 * "Still have questions?" gradient card after a FAQ accordion list.
 * Composes CTALink atom. No client interaction — no 'use client' needed.
 */
export function FAQContactCTA({
  headline = 'Still have questions?',
  subCopy = 'Our research team is here to help you find the right solution',
  ctaLabel = 'Contact Research Team',
  ctaHref = '/contact',
  className,
}: FAQContactCTAProps) {
  return (
    <div
      data-component="FAQContactCTA"
      className={cn(
        // Layout: stacked mobile, row sm+
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
        // Spacing — canonical V0_lite: mt-10 sm:mt-12 applied by parent space-y or mt prop
        'p-5 sm:p-8',
        // Shape
        'rounded-[var(--radius-sm)]',
        // Border — soft, same as FAQ card chrome
        'border border-black/10',
        className
      )}
      style={{
        // --bg-card-takeaways: gradient(135deg, rgba(243,244,255,0.5), rgba(250,250,250,0.3))
        // Matches canonical V0_lite "bg-black/[0.02]" treatment via token
        background: 'var(--bg-card-takeaways, rgba(0,0,0,0.02))',
      }}
    >
      {/* Copy block */}
      <div>
        <p
          className="font-sans font-medium mb-2"
          style={{ fontSize: 'var(--text-sm)', color: 'black' }}
        >
          {headline}
        </p>
        <p
          className="font-sans"
          style={{ fontSize: 'var(--text-compact)', color: 'var(--black-500)' }}
        >
          {subCopy}
        </p>
      </div>

      {/* CTA — flex-shrink-0 so it doesn't compress on sm */}
      <CTALink
        href={ctaHref}
        variant="brand"
        size="md"
        className="flex-shrink-0"
      >
        {ctaLabel}
      </CTALink>
    </div>
  );
}
