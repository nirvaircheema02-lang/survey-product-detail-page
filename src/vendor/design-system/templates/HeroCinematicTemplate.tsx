/**
 * HeroCinematicTemplate
 *
 * WHAT · Composition shell for the cinematic-dark hero section on a report PDP.
 *        Composes: SectionWrapper (mesh/cinematic-dark) · Container · Breadcrumb ·
 *        5-col 3/2 grid → left col (SectionLabel + h1 + lede + CTARowResponsive +
 *        MetadataStrip) · right col (PreviewCard or custom right slot) ·
 *        optional floating orbs (Framer Motion, reduced-motion guarded).
 *
 * WHY · The cinematic dark hero is the brand-defining surface of any report PDP.
 *       Centralising this shell prevents variant drift between sections that share
 *       the same cinematic chrome (CANON §2.2). Template is the single source of
 *       the 5-col 3/2 split, orb positioning, and scroll indicator placement.
 *
 * WHEN · Report PDP hero (section 1 — HeroCinematicTemplate + ReportHeroSection).
 *        Any full-bleed cinematic hero that uses the 3/2 grid layout.
 *
 * WHEN NOT · Editorial light pages → use HeroEditorialTemplate.
 *            Case-study hero → editorial light pattern (unless cinematic override requested).
 *
 * WHERE · `core-v2/src/templates/HeroCinematicTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <HeroCinematicTemplate
 *   id="hero"
 *   breadcrumbItems={[{label: 'Reports', href: '/reports'}, {label: 'Cold Chain', href: '/cold-chain'}]}
 *   eyebrow="CHAPTER 0 · AUSTRALIA COLD CHAIN"
 *   headline="Australia Cold Chain Logistics"
 *   headlineAccent="Market Report 2024"
 *   lede="Comprehensive analysis of the USD 14.2Bn cold chain market."
 *   primaryCTA={{ label: 'Download Report', href: '/buy' }}
 *   secondaryCTA={{ label: 'View TOC', href: '#toc' }}
 *   metadataItems={[{label: 'Author', value: 'Ken Research'}, ...]}
 *   rightSlot={<PreviewCard chapterLabel="Chapter 2" title="Market Size" />}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · Breadcrumb · SectionLabel · CTARowResponsive · MetadataStrip · PreviewCard
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.2
 */
'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionLabel } from '../atoms/SectionLabel';
import { Breadcrumb, type BreadcrumbLevel } from '../molecules/Breadcrumb';
import { CTARowResponsive, type CTAButtonSpec } from '../molecules/CTARowResponsive';
import { MetadataStrip, type MetadataItem } from '../molecules/MetadataStrip';

export interface HeroCinematicTemplateProps {
  /** HTML id for skip-link target and anchor */
  id?: string;

  /**
   * Breadcrumb levels array forwarded to Breadcrumb molecule.
   * Omit to hide breadcrumb.
   */
  breadcrumbLevels?: BreadcrumbLevel[];

  /**
   * Eyebrow label — e.g. "CHAPTER 0 · AUSTRALIA COLD CHAIN LOGISTICS"
   * Rendered via SectionLabel variant="accent-dark" (white uppercase on dark).
   */
  eyebrow?: string;

  /** Hero h1 headline — first line */
  headline: string;

  /**
   * Optional second line of headline rendered as `<span className="block">`.
   * Allows a deliberate line break for brand typographic control.
   */
  headlineAccent?: string;

  /** Lede paragraph — max-w-lg on dark surface */
  lede?: string;

  /** Primary CTA spec forwarded to CTARowResponsive */
  primaryCTA: CTAButtonSpec;

  /** Secondary CTA spec forwarded to CTARowResponsive */
  secondaryCTA?: CTAButtonSpec;

  /**
   * MetadataStrip items — rendered below the CTA row.
   * Typically: Author · Pages · Published · Code · Base Year.
   */
  metadataItems?: MetadataItem[];

  /**
   * Right column slot — PreviewCard or custom glass card content.
   * Occupies lg:col-span-2 (2 of 5 cols).
   */
  rightSlot?: ReactNode;

  /**
   * Show floating cinematic orbs (Framer Motion).
   * Automatically disabled when `prefers-reduced-motion` is set.
   * @default true
   */
  showOrbs?: boolean;

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * HeroCinematicTemplate — cinematic dark hero section shell.
 *
 * Renders SectionWrapper (background="mesh") → Breadcrumb → 5-col 3/2 grid →
 *   left: eyebrow + h1 + lede + CTARowResponsive + MetadataStrip →
 *   right: rightSlot (PreviewCard typical) →
 *   optional floating orbs (reduced-motion guarded).
 */
export function HeroCinematicTemplate({
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
  showOrbs = true,
  className,
}: HeroCinematicTemplateProps) {
  const prefersReducedMotion = useReducedMotion();
  const orbsVisible = showOrbs && !prefersReducedMotion;

  return (
    <SectionWrapper
      id={id}
      background="mesh"
      spacing="xl"
      maxWidth="full"
      className={className}
      data-template="HeroCinematicTemplate"
      data-variant-section="cinematic"
    >
      {/* CINEMATIC ORBS — decorative floating blur spheres */}
      {orbsVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: '40vw',
              height: '40vw',
              top: '-10%',
              right: '-5%',
              background: 'var(--brand-red, #b01f24)',
            } as CSSProperties}
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full opacity-10 blur-3xl"
            style={{
              width: '30vw',
              height: '30vw',
              bottom: '10%',
              left: '-5%',
              background: 'var(--color-ramp-periwinkle-400, #818cf8)',
            } as CSSProperties}
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
      )}

      {/* INNER CONTENT — max-w-page centered */}
      <div className="max-w-[var(--container-page,75rem)] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* BREADCRUMB */}
        {breadcrumbLevels && breadcrumbLevels.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <Breadcrumb levels={breadcrumbLevels} colorScheme="dark" />
          </div>
        )}

        {/* 5-COL GRID · 3/2 SPLIT */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* LEFT COL — span-3 */}
          <div className="lg:col-span-3 space-y-6">
            {eyebrow && (
              <SectionLabel variant="accent" className="text-[var(--glass-text,rgba(255,255,255,0.7))]">
                {eyebrow}
              </SectionLabel>
            )}

            {/* H1 HEADLINE — cinematic serif */}
            <h1
              className="font-serif font-light leading-[1.1] tracking-[var(--tracking-display-tight,-0.02em)]"
              style={{
                fontSize: 'clamp(var(--text-30,1.875rem), 4vw, var(--text-48,3rem))',
                color: 'var(--color-foundation-white, #fafafa)',
              } as CSSProperties}
            >
              {headline}
              {headlineAccent && <span className="block">{headlineAccent}</span>}
            </h1>

            {/* LEDE */}
            {lede && (
              <p
                className="text-base leading-relaxed max-w-lg"
                style={{ color: 'var(--glass-text, rgba(255,255,255,0.7))' } as CSSProperties}
              >
                {lede}
              </p>
            )}

            {/* CTA ROW */}
            <CTARowResponsive
              primary={primaryCTA}
              secondary={secondaryCTA ?? { label: '' }}
              background="dark"
            />

            {/* METADATA STRIP */}
            {metadataItems && metadataItems.length > 0 && (
              <MetadataStrip items={metadataItems} colorScheme="dark" />
            )}
          </div>

          {/* RIGHT COL — span-2 */}
          {rightSlot && (
            <div className="lg:col-span-2" data-slot="right">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
