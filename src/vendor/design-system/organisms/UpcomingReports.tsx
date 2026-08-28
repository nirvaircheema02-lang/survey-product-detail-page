/**
 * UpcomingReports — Organism (DS v4.3)
 *
 * WHAT: Upcoming/pipeline reports preview section.
 * WHY:  Builds anticipation — shows reports in production with expected dates.
 * WHEN: Report Store home page, discovery section.
 * HOW:  SectionWrapper(white) + timeline-style list of upcoming reports.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 */
import { CalendarClock, Bell } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const UPCOMING = [
  { title: 'Global Generative AI Enterprise Adoption Survey 2026', industry: 'Technology & Telecom', expectedDate: 'Apr 2026', status: 'In Review' },
  { title: 'MENA Renewable Energy Infrastructure Assessment', industry: 'Energy & Utilities', expectedDate: 'Apr 2026', status: 'Data Collection' },
  { title: 'Southeast Asia Fintech Ecosystem Map', industry: 'Banking & Financial Services', expectedDate: 'May 2026', status: 'In Production' },
  { title: 'Global Smart Manufacturing Readiness Index', industry: 'Manufacturing', expectedDate: 'May 2026', status: 'Scheduled' },
];

export function UpcomingReports() {
  return (
    <SectionWrapper data-component="UpcomingReports" background="white" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label="Pipeline"
          title="Upcoming Reports"
          subtitle="Reports currently in production — subscribe to get notified on release"
        />
        <div className="mt-8 space-y-0">
          {UPCOMING.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center gap-4 py-4 flex-col sm:flex-row"
              style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.06)' }}
            >
              {/* Date badge */}
              <div
                className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1.5"
                style={{
                  borderRadius: 'var(--radius-inner)',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  minWidth: '90px',
                }}
              >
                <CalendarClock size={12} style={{ color: 'rgba(0,0,0,0.35)' }} />
                <span
                  className="tabular-nums"
                  style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}
                >
                  {item.expectedDate}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.8)' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)', marginTop: '2px' }}>
                  {item.industry}
                </p>
              </div>

              {/* Status + Notify */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="pill" size="xs" theme="neutral">
                  {item.status}
                </Badge>
                <Button variant="ghost" size="xs" icon={<Bell size={13} />}>
                  Notify me
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}