/**
 * FeaturedResearch — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Featured research reports carousel for the Report Store home page.
 * WHY:  Wraps FeaturedCarousel with RS-specific content and data.
 * WHEN: Section 2 of ReportStorePage (Home mode).
 * HOW:  Accepts `reports` via prop. Each item rendered via ReportCard variant="grid".
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { FeaturedCarousel } from './FeaturedCarousel';
import { ReportCard } from '../molecules/ReportCard';
import type { ReportItem } from '../types';

export interface FeaturedResearchProps {
  reports: ReportItem[];
  label?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export function FeaturedResearch({
  reports,
  label = 'Featured',
  title = 'Latest Research',
  subtitle = 'Our most recent publications across key growth sectors',
  ctaText = 'View all reports',
}: FeaturedResearchProps) {
  return (
    <FeaturedCarousel data-component="FeaturedResearch" label={label} title={title} subtitle={subtitle} ctaText={ctaText}>
      {reports.map((report) => (
        <div key={report.id} className="flex-shrink-0" style={{ width: '300px' }}>
          <ReportCard {...report} variant="grid" />
        </div>
      ))}
    </FeaturedCarousel>
  );
}
