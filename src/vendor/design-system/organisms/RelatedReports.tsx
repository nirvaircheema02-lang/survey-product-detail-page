/**
 * RelatedReports — Organism
 *
 * WHAT: Horizontal-scroll row of related/recommended reports.
 *       Section heading + optional "View all" CTALink above a snap-scroll card row.
 *       Reports render as compact or grid variant of ReportCardOrganism.
 * WHY:  Cross-sell and content discovery. Horizontally scrollable row allows
 *       browsing without leaving the current page (Fitt's Law: stays in context).
 *       Used for "Recommended for You", "Analyst Picks", and "Featured Research".
 * WHEN: Bottom-of-page or section-end cross-sell on report PDP or listing page.
 * WHEN NOT: On mobile when reports need to be individually scannable — prefer
 *            vertical grid. Don't use compact variant for featured hero.
 * WHERE: Report Store listing page (below results grid) · report PDP bottom section.
 * HOW:
 *   ```tsx
 *   <RelatedReports
 *     label="Explore More"
 *     heading="Recommended Reports"
 *     reports={relatedReports}
 *     onView={(id) => router.push(`/reports/${id}`)}
 *     viewAllHref="/reports"
 *   />
 *   ```
 *
 * Canonical source: report-store-legacy `RecommendedForYou` / `AnalystPicks` / `FeaturedResearch` sections
 * Ported: 2026-05-19 · Batch 3.3d · aura-builder
 * Status: ready
 */
'use client';

import { CTALink } from '../atoms/CTALink';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { HorizontalScroll } from '../molecules/HorizontalScroll';
import { ReportCard, type ReportCardVariant } from '../molecules/ReportCard';

/** Report data shape consumed by RelatedReports · matches ReportCard flat-props API */
export interface ReportCardData {
  id: string;
  image: string;
  title: string;
  industry: string;
  subcat?: string;
  projection?: string | null;
  region: string;
  date: string;
  description?: string;
}

export interface RelatedReportsProps {
  /** Eyebrow label (e.g. "Explore More") — defaults to "Related" */
  label?: string;
  /** Section heading (e.g. "Recommended Reports") */
  heading: string;
  /** Optional subheading / lede */
  subheading?: string;
  /** Reports to display */
  reports: ReportCardData[];
  /** Navigate to report handler */
  onView: (id: string) => void;
  /** "View all" link href — omit to hide the link */
  viewAllHref?: string;
  /** "View all" link label */
  viewAllLabel?: string;
  /** Card variant — defaults to "compact" for horizontal scroll rows */
  cardVariant?: ReportCardVariant;
  /**
   * Card width in horizontal scroll row.
   * Default: "280px" (grid variant: "260px")
   */
  cardWidth?: string;
  /** Section background */
  background?: 'white' | 'warm' | 'transparent';
  /** Optional className */
  className?: string;
}

const BG_MAP = {
  white: 'rgba(255,255,255,1)',
  warm: 'var(--warm-100)',
  transparent: 'transparent',
};

export function RelatedReports({
  label,
  heading,
  subheading,
  reports,
  onView,
  viewAllHref,
  viewAllLabel = 'View all reports',
  cardVariant = 'compact',
  cardWidth,
  background = 'white',
  className,
}: RelatedReportsProps) {
  if (reports.length === 0) return null;

  const defaultCardWidth =
    cardVariant === 'compact' ? '300px' : cardVariant === 'grid' ? '260px' : '280px';
  const itemWidth = cardWidth || defaultCardWidth;

  const fadeBg = background === 'warm' ? 'var(--warm-100)' : 'white';

  return (
    <section
      className={`py-8 md:py-10 ${className || ''}`}
      style={{ background: BG_MAP[background] }}
      aria-label={heading}
    >
      {/* Header row */}
      <div className="px-4 sm:px-6 md:px-8 max-w-[75rem] mx-auto flex items-end justify-between gap-4 mb-5">
        <LabelHeadingPair
          label={label || 'Related'}
          heading={heading}
          lede={subheading}
          align="left"
        />
        {viewAllHref && (
          <div className="flex-shrink-0">
            <CTALink href={viewAllHref}>
              {viewAllLabel}
            </CTALink>
          </div>
        )}
      </div>

      {/* Horizontal scroll row */}
      <HorizontalScroll fadeBg={fadeBg} gap="gap-4" className="px-4 sm:px-6 md:px-8">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex-shrink-0 snap-start"
            style={{
              width: itemWidth,
              /* For compact: full-height alignment */
              ...(cardVariant === 'compact' ? { alignSelf: 'stretch' } : {}),
            }}
          >
            <ReportCard
              variant={cardVariant}
              id={report.id}
              image={report.image}
              title={report.title}
              industry={report.industry}
              subcat={report.subcat}
              projection={report.projection}
              region={report.region}
              date={report.date}
              description={report.description}
              onClick={() => onView(report.id)}
              className={cardVariant === 'compact' ? 'w-full' : 'h-full'}
            />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}
