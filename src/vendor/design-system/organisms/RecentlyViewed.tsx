/**
 * RecentlyViewed — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Recently viewed reports horizontal scroll row.
 * WHY:  Personalization — lets users quickly revisit reports they've viewed.
 * WHEN: Report Store home page, below hero or featured sections.
 * HOW:  SectionWrapper(white) + HorizontalScroll + compact ReportCard thumbnails.
 *       Accepts `reports` via prop. Consumer slices to "recent" subset.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { CTALink } from '../atoms/CTALink';
import { HorizontalScroll } from '../molecules/HorizontalScroll';
import { ReportCard } from '../molecules/ReportCard';
import type { ReportItem } from '../types';

export interface RecentlyViewedProps {
  reports: ReportItem[];
  label?: string;
  title?: string;
  subtitle?: string;
  historyHref?: string;
  historyLabel?: string;
}

export function RecentlyViewed({
  reports,
  label = 'Your Activity',
  title = 'Recently Viewed',
  subtitle = 'Pick up where you left off',
  historyHref = '#',
  historyLabel = 'View history',
}: RecentlyViewedProps) {
  return (
    <SectionWrapper data-component="RecentlyViewed" background="white" spacing="md" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label={label}
          title={title}
          subtitle={subtitle}
          endSlot={<CTALink href={historyHref}>{historyLabel}</CTALink>}
        />
        <div className="mt-6">
          <HorizontalScroll>
            {reports.map((report) => (
              <div key={report.id} className="flex-shrink-0" style={{ width: '240px' }}>
                <ReportCard {...report} variant="grid" />
              </div>
            ))}
          </HorizontalScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
