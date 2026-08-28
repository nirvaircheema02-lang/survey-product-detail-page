'use client';

/**
 * ReportHeroSection — Cinematic-dark Hero organism for report PDP pages.
 *
 * WHAT: Full-width cinematic-dark section (min-h-[55vh]) with:
 *   - Video background (optional, props-controlled) fading in 500ms after load
 *   - Gradient overlays: from-black/80 via-black/70 to-black/90 + left fade
 *   - Grid-pattern texture overlay (opacity-[0.03], 50px grid)
 *   - 2 floating blur orbs animated via Framer Motion (guarded by useReducedMotion)
 *   - 5-col 3/2 grid: left 3-col (Breadcrumb → badges → SectionLabel → h1 → lede →
 *     CTARowResponsive → MetadataStrip) | right 2-col (PreviewCard, lg+ only)
 *   - Glass card variant (right col) OR PreviewCard with paywall overlay
 *   - Scroll-down indicator at bottom-center
 *
 * WHY: Report PDPs need cinematic surface to elevate perceived data value
 *      (aesthetic-usability effect). 3/2 grid with content-heavy left and
 *      preview-card right follows F-pattern reading: eye lands on title, scans
 *      CTAs, then reward of visual preview converts. Video bg = motion-rich
 *      but restrained (≤2 animations in hero per 9.5/10 craft bar).
 *      Orbs use Framer animate() not raw rAF — reduced-motion guard is
 *      MANDATORY per ANTI-PATTERNS rule 26.
 *
 * WHEN: Top of every report PDP. One per page. Section id must be "hero".
 *
 * WHEN NOT: Case-study pages (use HeroSection — editorial variant). Listing pages
 *           (use ReportStoreHero — search-led). Light surface pages.
 *
 * WHERE: report PDP / v1-product-page surface. Pairs with Navbar above + TableOfContentsSidebar.
 *
 * HOW:
 * ```tsx
 * <ReportHeroSection
 *   title="Qatar Fresh Herbs Market"
 *   subtitle="2019 – 2030"
 *   description="Comprehensive analysis of market size..."
 *   badges={[{ label: 'Middle East' }, { label: 'November 2025' }]}
 *   breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Healthcare', href: '/healthcare' }, { label: 'Report Title', href: '#', current: true }]}
 *   metadata={[{ label: 'Author', value: 'Rebecca' }, { label: 'Pages', value: '82' }]}
 *   primaryCTA={{ label: 'Download Sample', onClick: handleDownload }}
 *   secondaryCTA={{ label: 'Connect with Consultant', onClick: handleConsult }}
 *   previewChapter="Chapter 2"
 *   previewTitle="Market Overview"
 *   onPreviewExpand={handleExpand}
 *   onPaywallCTA={handlePurchase}
 *   videoSrc="https://example.com/bg.mp4"
 * />
 * ```
 *
 * A11y:
 * - <section> landmark with aria-label="Report hero"
 * - Orbs + decorative overlays: aria-hidden="true"
 * - Video: autoPlay muted playsInline + aria-hidden (decorative)
 * - Scroll-indicator button: aria-label="Scroll to next section"
 * - h1 is the only h1 on the page — consumers must NOT add another
 *
 * Motion:
 * - Floating orbs: Framer Motion animate + useReducedMotion guard
 * - Content entrance: staggered opacity+y with useInView(once:true)
 * - PreviewCard: whileHover scale in PreviewCard molecule
 * - Reduced-motion: all animations disabled via prefersReducedMotion check
 *
 * @canonical V0_lite_report-legacy/src/app/components/HeroSection.tsx (layout + CTA pattern)
 *            V0.2-for-design-system/src/app/components/HeroSection.tsx (cinematic chrome + glass card)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { useRef, useEffect } from 'react';
import { motion, useReducedMotion, useInView, type TargetAndTransition, type Transition } from 'framer-motion';
import { Breadcrumb, type BreadcrumbLevel } from '../molecules/Breadcrumb';
import { CTARowResponsive, type CTAButtonSpec } from '../molecules/CTARowResponsive';
import { MetadataStrip, type MetadataItem } from '../molecules/MetadataStrip';
import { PreviewCard } from '../molecules/PreviewCard';
import { SectionLabel } from '../atoms/SectionLabel';
import { Badge } from '../atoms/Badge';

// Re-export for consumers that compose this organism
export type { CTAButtonSpec, MetadataItem, BreadcrumbLevel };

// ── Types ──────────────────────────────────────────────────────────────────

export interface HeroBadge {
  /** Badge label text. */
  label: string;
  /** Optional icon (lucide component). */
  icon?: React.ReactNode;
}

export interface ReportHeroSectionProps {
  // Content
  /** Report title — renders as h1. */
  title: string;
  /** Subtitle line (year range / period). */
  subtitle?: string;
  /** Report description paragraph. */
  description?: string;
  /** Section label eyebrow. Default: "Market Research Report". */
  sectionLabel?: string;
  /** Badge pills above the title. E.g. region, date. */
  badges?: HeroBadge[];
  /** Breadcrumb items. */
  breadcrumb?: BreadcrumbLevel[];
  /** Metadata strip items below CTA. E.g. Author, Pages, Base Year. */
  metadata?: MetadataItem[];

  // CTAs
  /** Primary CTA (download / purchase). */
  /** Primary CTA spec (download / purchase). */
  primaryCTA?: { label: string; href?: string; onClick?: () => void };
  /** Secondary CTA spec (consult / request). */
  secondaryCTA?: { label: string; href?: string; onClick?: () => void };

  // Preview card (right col)
  /** Chapter label for PreviewCard. Default: "Chapter 2". */
  previewChapter?: string;
  /** Section title for PreviewCard. Default: "Market Overview & Definition". */
  previewTitle?: string;
  /** Called when preview card expand icon clicked. */
  onPreviewExpand?: () => void;
  /** Paywall CTA label. Default: "Unlock Full Report". */
  paywallLabel?: string;
  /** Called when paywall CTA in PreviewCard is clicked. */
  onPaywallCTA?: () => void;

  // Background
  /** Optional video source URL. If omitted, gradient fallback renders. */
  videoSrc?: string;
  /** Section id — must be "hero" for CaseStudyNavbar compat. Default: "hero". */
  sectionId?: string;

  /** Scroll target section id. Default: "report-content". */
  scrollTargetId?: string;
  className?: string;
}

// ── Floating orb component ─────────────────────────────────────────────────

interface OrbProps {
  className: string;
  animate: TargetAndTransition;
  transition: Transition;
  prefersReduced: boolean | null;
}

function FloatingOrb({ className, animate, transition, prefersReduced }: OrbProps) {
  if (prefersReduced) {
    return <div className={className} aria-hidden="true" />;
  }
  return (
    <motion.div
      className={className}
      animate={animate}
      transition={transition}
      aria-hidden="true"
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ReportHeroSection({
  title,
  subtitle,
  description,
  sectionLabel = 'Market Research Report',
  badges = [],
  breadcrumb = [],
  metadata = [],
  primaryCTA,
  secondaryCTA,
  previewChapter = 'Chapter 2',
  previewTitle = 'Market Overview & Definition',
  onPreviewExpand,
  paywallLabel = 'Unlock Full Report',
  onPaywallCTA,
  videoSrc,
  sectionId = 'hero',
  scrollTargetId = 'report-content',
  className = '',
}: ReportHeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

  // Fade-in video after load
  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    const timer = setTimeout(() => {
      if (videoRef.current) videoRef.current.style.opacity = '1';
    }, 500);
    return () => clearTimeout(timer);
  }, [videoSrc]);

  const handleScrollDown = () => {
    const target = document.getElementById(scrollTargetId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const primaryBtn: CTAButtonSpec = primaryCTA ?? { label: 'Download Sample Report' };
  const secondaryBtn: CTAButtonSpec = secondaryCTA ?? { label: 'Connect with Consultant' };

  // contentVariants used for staggered entrance via per-element spread below

  return (
    <section
      id={sectionId}
      data-component="ReportHeroSection"
      data-variant-section="cinematic"
      aria-label="Report hero"
      className={`relative overflow-hidden flex items-center min-h-[55vh] lg:min-h-[60vh] ${className}`}
      style={{ background: 'var(--bg-pure-black, #0a0a0c)' }}
    >
      {/* ── Background layer ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Video background */}
        {videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: 0 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

        {/* Fallback gradient (always rendered — shows under transparent video) */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(135deg, #171717, #262626, #0a0a0c)' }}
        />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating orbs */}
        <FloatingOrb
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px]"
          animate={prefersReducedMotion ? {} : {
            x: [0, 30, 0, -30, 0],
            opacity: [0.10, 0.15, 0.10, 0.15, 0.10],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          prefersReduced={prefersReducedMotion}
        />
        <FloatingOrb
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-[100px]"
          animate={prefersReducedMotion ? {} : {
            x: [0, -30, 0, 30, 0],
            opacity: [0.08, 0.14, 0.08, 0.14, 0.08],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          prefersReduced={prefersReducedMotion}
        />
        {/* Orb base color — white/10 per V0.2 */}
        <style>{`
          [data-component="ReportHeroSection"] .absolute.rounded-full {
            background: rgba(255,255,255,0.10);
          }
        `}</style>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full py-10 lg:py-14"
        style={{ paddingLeft: 'var(--padding-mobile)', paddingRight: 'var(--padding-mobile)' }}
      >
        <div
          className="mx-auto sm:px-6 md:px-8"
          style={{ maxWidth: 'var(--container-page)' }}
        >
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <motion.div
              className="mb-6 sm:mb-8"
              {...(prefersReducedMotion ? {} : {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4 },
              })}
            >
              <Breadcrumb levels={breadcrumb} colorScheme="dark" />
            </motion.div>
          )}

          {/* 5-col 3/2 grid */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">

            {/* ── Left: 3 cols ──────────────────────────────────────────── */}
            <div ref={contentRef} className="lg:col-span-3 space-y-6">

              {/* Badges */}
              {badges.length > 0 && (
                <motion.div
                  className="flex items-center gap-3 flex-wrap"
                  {...(prefersReducedMotion ? {} : {
                    initial: { opacity: 0, x: -16 },
                    animate: isInView ? { opacity: 1, x: 0 } : {},
                    transition: { duration: 0.4 },
                  })}
                >
                  {badges.map((badge, i) => (
                    <Badge
                      key={i}
                      variant="pill"
                      size="sm"
                      theme="neutral"
                      mode="dark"
                    >
                      {badge.icon && (
                        <span className="mr-1.5 h-3.5 w-3.5 inline-flex" aria-hidden="true">
                          {badge.icon}
                        </span>
                      )}
                      {badge.label}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* Section label */}
              <motion.div
                {...(prefersReducedMotion ? {} : {
                  initial: { opacity: 0, y: 16 },
                  animate: isInView ? { opacity: 1, y: 0 } : {},
                  transition: { duration: 0.5, delay: 0.05 },
                })}
              >
                <SectionLabel background="dark">{sectionLabel}</SectionLabel>
              </motion.div>

              {/* Title */}
              <motion.div
                {...(prefersReducedMotion ? {} : {
                  initial: { opacity: 0, y: 20 },
                  animate: isInView ? { opacity: 1, y: 0 } : {},
                  transition: { duration: 0.6, delay: 0.1 },
                })}
              >
                <h1
                  className="text-white leading-[1.1] tracking-tight font-light"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.75rem, 4vw, var(--text-4xl, 2.5rem))',
                  }}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p
                    className="text-white/60 mt-2 font-light tracking-wide"
                    style={{ fontSize: 'var(--text-lg, 1.125rem)' }}
                  >
                    {subtitle}
                  </p>
                )}
              </motion.div>

              {/* Description */}
              {description && (
                <motion.p
                  className="text-white/70 max-w-xl leading-relaxed font-light"
                  style={{ fontSize: 'var(--text-base, 1rem)' }}
                  {...(prefersReducedMotion ? {} : {
                    initial: { opacity: 0, y: 16 },
                    animate: isInView ? { opacity: 1, y: 0 } : {},
                    transition: { duration: 0.6, delay: 0.2 },
                  })}
                >
                  {description}
                </motion.p>
              )}

              {/* CTA Row */}
              <motion.div
                {...(prefersReducedMotion ? {} : {
                  initial: { opacity: 0, y: 16 },
                  animate: isInView ? { opacity: 1, y: 0 } : {},
                  transition: { duration: 0.6, delay: 0.3 },
                })}
              >
                <CTARowResponsive
                  primary={primaryBtn}
                  secondary={secondaryBtn}
                  background="dark"
                />
              </motion.div>

              {/* Metadata strip */}
              {metadata.length > 0 && (
                <motion.div
                  {...(prefersReducedMotion ? {} : {
                    initial: { opacity: 0 },
                    animate: isInView ? { opacity: 1 } : {},
                    transition: { duration: 0.6, delay: 0.4 },
                  })}
                >
                  <MetadataStrip items={metadata} colorScheme="dark" />
                </motion.div>
              )}
            </div>

            {/* ── Right: 2 cols — PreviewCard (lg+ only) ─────────────────── */}
            <motion.div
              className="hidden lg:block lg:col-span-2"
              {...(prefersReducedMotion ? {} : {
                initial: { opacity: 0, x: 32 },
                animate: isInView ? { opacity: 1, x: 0 } : {},
                transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
              })}
            >
              {/* Decor orbs around card */}
              <div className="relative mx-auto max-w-md">
                <div
                  className="absolute -right-4 -top-4 h-24 w-24 rounded-[10px] bg-white/5 blur-xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-4 -left-4 h-32 w-32 rounded-[10px] bg-white/5 blur-xl"
                  aria-hidden="true"
                />
                <PreviewCard
                  chapterLabel={previewChapter}
                  sectionTitle={previewTitle}
                  surface="dark"
                  onExpand={onPreviewExpand}
                  paywallLabel={paywallLabel}
                  onPaywallCTA={onPaywallCTA}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <motion.button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden lg:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 1.2 },
          })}
        >
          <div
            className="w-[30px] h-[48px] rounded-full border-2 flex items-start justify-center pt-2 transition-colors duration-300 border-white/30 hover:border-white/60"
          >
            <motion.div
              className="w-1 h-2 bg-white/40 rounded-full"
              {...(prefersReducedMotion ? {} : {
                animate: { y: [0, 6, 0] },
                transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
              })}
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
