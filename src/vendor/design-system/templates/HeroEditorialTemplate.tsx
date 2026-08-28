/**
 * HeroEditorialTemplate
 *
 * WHAT · Composition shell for an editorial-light hero section (white bg).
 *        Composes: SectionWrapper (white) · Breadcrumb · LabelHeadingPair ·
 *        CTARowResponsive · MetadataStrip · optional 2-col content slot
 *        (left: editorial text/image · right: optional secondary content).
 *
 * WHY · Editorial-light hero is the DEFAULT variant for case-study and listing pages.
 *       Centralising this avoids per-page re-invention of the white-surface hero
 *       layout. Variant LOCK: this template is ALWAYS editorial-light. Never
 *       cinematic-dark (use HeroCinematicTemplate for that). (CANON anti-pattern
 *       Cat 13.10 variant-lock enforcement).
 *
 * WHEN · Case-study hero (editorial-light default).
 *        Report store listing page hero.
 *        Any editorial landing hero that does NOT require cinematic chrome.
 *
 * WHEN NOT · Cinematic dark hero → use HeroCinematicTemplate.
 *            Report PDP primary hero → use HeroCinematicTemplate (section 1).
 *
 * WHERE · `core-v2/src/templates/HeroEditorialTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <HeroEditorialTemplate
 *   id="hero"
 *   breadcrumbItems={[{label: 'Case Studies', href: '/case-studies'}]}
 *   eyebrow="CASE STUDY"
 *   headline="How APAC Logistics Optimised Cold Chain"
 *   lede="A comprehensive engagement delivering 23% cost reduction."
 *   primaryCTA={{ label: 'Read Full Study', href: '/case-study/apac' }}
 *   secondaryCTA={{ label: 'Talk to Analyst', href: '/contact' }}
 *   metadataItems={[{label: 'Industry', value: 'Logistics'}, ...]}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · Breadcrumb · LabelHeadingPair · CTARowResponsive · MetadataStrip
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.2 (editorial variant)
 * @variantLock editorial-light — NEVER switch to cinematic-dark (Cat 13.10)
 */

import type { CSSProperties, ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { Breadcrumb, type BreadcrumbLevel } from '../molecules/Breadcrumb';
import { CTARowResponsive, type CTAButtonSpec } from '../molecules/CTARowResponsive';
import { MetadataStrip, type MetadataItem } from '../molecules/MetadataStrip';

export interface HeroEditorialTemplateProps {
  /** HTML id for anchor and skip-link target */
  id?: string;

  /**
   * Breadcrumb levels forwarded to Breadcrumb molecule.
   * Omit to hide breadcrumb.
   */
  breadcrumbLevels?: BreadcrumbLevel[];

  /** Eyebrow label — e.g. "CASE STUDY" or "INDUSTRY RESEARCH" */
  eyebrow?: string;

  /** Hero h1 headline */
  headline: string;

  /**
   * Optional second line of headline rendered as `<span className="block">`.
   * Allows typographic line-break control.
   */
  headlineAccent?: string;

  /** Lede paragraph */
  lede?: string;

  /** Primary CTA */
  primaryCTA: CTAButtonSpec;

  /** Secondary CTA */
  secondaryCTA?: CTAButtonSpec;

  /** MetadataStrip items — rendered below CTA row */
  metadataItems?: MetadataItem[];

  /**
   * Optional right column content slot.
   * When provided, renders a 2-col editorial layout (left: text · right: slot).
   * Omit for single-column centered hero.
   */
  rightSlot?: ReactNode;

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * HeroEditorialTemplate — editorial-light hero section shell.
 *
 * Variant LOCK: ALWAYS white/warm bg. NEVER cinematic-dark.
 *
 * Composition: SectionWrapper (white) → Breadcrumb → LabelHeadingPair →
 *   CTARowResponsive → MetadataStrip → optional 2-col (left text / right slot).
 */
export function HeroEditorialTemplate({
  id = 'hero',
  breadcrumbLevels,
  eyebrow,
  headline,
  headlineAccent,
  lede,
  primaryCTA,
  secondaryCTA,
  metadataItems,
  rightSlot,
  className,
}: HeroEditorialTemplateProps) {
  const hasTwoCol = Boolean(rightSlot);

  return (
    <SectionWrapper
      id={id}
      background="white"
      spacing="lg"
      maxWidth="wide"
      className={className}
      data-template="HeroEditorialTemplate"
    >
      {/* BREADCRUMB */}
      {breadcrumbLevels && breadcrumbLevels.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <Breadcrumb levels={breadcrumbLevels} colorScheme="light" />
        </div>
      )}

      {hasTwoCol ? (
        /* TWO-COL LAYOUT — left: editorial text · right: slot */
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* LEFT COLUMN — editorial text block */}
          <div className="space-y-6">
            <LabelHeadingPair
              label={eyebrow ?? ''}
              heading={headline}
              headingId={`${id}-heading`}
              headingLevel={1}
              labelVariant={eyebrow ? 'accent' : 'default'}
              lede={lede}
            />
            {headlineAccent && (
              <span
                className="block font-serif font-light"
                style={{ fontSize: 'inherit', display: 'block', marginTop: '-1rem' } as CSSProperties}
              >
                {headlineAccent}
              </span>
            )}
            <CTARowResponsive
              primary={primaryCTA}
              secondary={secondaryCTA ?? { label: '' }}
              background="light"
            />
            {metadataItems && metadataItems.length > 0 && (
              <MetadataStrip items={metadataItems} colorScheme="light" />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div data-slot="right">{rightSlot}</div>
        </div>
      ) : (
        /* SINGLE-COL LAYOUT */
        <div className="space-y-6 max-w-[var(--container-content,62.5rem)]">
          <LabelHeadingPair
            label={eyebrow ?? ''}
            heading={headline}
            headingId={`${id}-heading`}
            headingLevel={1}
            labelVariant={eyebrow ? 'accent' : 'default'}
            lede={lede}
          />
          {headlineAccent && (
            <p
              className="font-serif font-light text-3xl leading-snug"
              style={{ marginTop: '-0.5rem' } as CSSProperties}
            >
              {headlineAccent}
            </p>
          )}
          <CTARowResponsive
            primary={primaryCTA}
            secondary={secondaryCTA ?? { label: '' }}
            background="light"
          />
          {metadataItems && metadataItems.length > 0 && (
            <MetadataStrip items={metadataItems} colorScheme="light" />
          )}
        </div>
      )}
    </SectionWrapper>
  );
}
