/**
 * AccordionListTemplate
 *
 * WHAT · Composition shell for an FAQ-style accordion section.
 *        Composes LabelHeadingPair + space-y-4 AccordionItem list +
 *        FAQContactCTA + optional JSON-LD FAQPage structured data script.
 *
 * WHY · FAQ sections across report PDP chapters (TOC reference, FAQ chapter, Definitions)
 *       follow the same composition (CANON §2.3). Centralising avoids re-inventing the
 *       spacing, contact-CTA placement, and JSON-LD boilerplate per section.
 *
 * WHEN · Report PDP FAQ section (section 26).
 *        Definitions section (section 7) with simplified items.
 *        TOC reference section (section 25) as an expandable list.
 *        Any accordion-list context with optional "Still have questions?" footer CTA.
 *
 * WHEN NOT · Do NOT use for stepped methodology (use StepperPlusGridTemplate).
 *            Do NOT use when items need full-page modal expansion.
 *
 * WHERE · `core-v2/src/templates/AccordionListTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <AccordionListTemplate
 *   id="faq"
 *   background="white"
 *   label="CHAPTER 26 · FAQ"
 *   heading="Frequently Asked Questions"
 *   lede="Common questions about this report and Ken Research methodology."
 *   items={faqItems}
 *   showContactCTA
 *   includeFaqJsonLd
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · LabelHeadingPair · BodyText · AccordionItem · FAQContactCTA
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.3
 */

import type { ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { AccordionItem } from '../molecules/AccordionItem';
import { FAQContactCTA } from '../molecules/FAQContactCTA';

export type AccordionBg = 'white' | 'warm';

export interface AccordionListItem {
  /** Unique key for the item */
  id: string;
  /** Question / accordion trigger label */
  question: string;
  /** Answer / expanded body content */
  answer: ReactNode;
}

export interface AccordionListTemplateProps {
  /** HTML id for anchor scroll — receives scroll-margin-top token */
  id: string;

  /** Background variant. Defaults to 'white'. */
  background?: AccordionBg;

  /** Eyebrow label text */
  label: string;

  /** Section h2 heading */
  heading: string;

  /** Optional lede paragraph */
  lede?: string;

  /** Array of FAQ / definition items */
  items: AccordionListItem[];

  /**
   * Show "Still have questions?" FAQContactCTA footer card.
   * True by default for FAQ sections, false for Definitions/TOC reference.
   */
  showContactCTA?: boolean;

  /**
   * Inject JSON-LD FAQPage structured data script into `<head>`.
   * Only applicable when items are true public-facing FAQs.
   * Requires `@/lib/json-ld` or caller injects via Next `<Head>`.
   * When true the template renders a `<script type="application/ld+json">` tag inline.
   */
  includeFaqJsonLd?: boolean;

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * AccordionListTemplate — FAQ / definition accordion section shell.
 *
 * Composition: SectionWrapper → LabelHeadingPair → optional lede →
 *   mb-10/12 spacer → space-y-4 AccordionItem list →
 *   mt-10/12 FAQContactCTA (optional) → JSON-LD script (optional).
 */
export function AccordionListTemplate({
  id,
  background = 'white',
  label,
  heading,
  lede,
  items,
  showContactCTA = true,
  includeFaqJsonLd = false,
  className,
}: AccordionListTemplateProps) {
  const jsonLdData = includeFaqJsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: typeof item.answer === 'string' ? item.answer : item.question,
          },
        })),
      }
    : null;

  return (
    <SectionWrapper
      id={id}
      background={background}
      spacing="lg"
      maxWidth="wide"
      className={className}
      style={{ scrollMarginTop: 'var(--scroll-margin-section, 72px)' } as React.CSSProperties}
      data-template="AccordionListTemplate"
    >
      {/* JSON-LD structured data */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      {/* SECTION HEADER BLOCK */}
      <div className="mb-10 md:mb-12">
        <LabelHeadingPair
          label={label}
          heading={heading}
          headingId={`${id}-heading`}
          headingLevel={2}
          labelVariant="accent"
          lede={lede}
        />
      </div>

      {/* ACCORDION LIST — space-y-4 per CANON §2.3 */}
      <div className="space-y-4" role="list" aria-labelledby={`${id}-heading`}>
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>

      {/* CONTACT CTA — mt-10 sm:mt-12 per CANON §2.3 */}
      {showContactCTA && <FAQContactCTA className="mt-10 sm:mt-12" />}
    </SectionWrapper>
  );
}
