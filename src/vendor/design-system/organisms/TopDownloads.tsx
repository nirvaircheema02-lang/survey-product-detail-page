/**
 * TopDownloads — Organism (DS v4.3)
 *
 * WHAT: Top downloaded reports ranked list section.
 * WHY:  Social proof — shows most popular reports by download count.
 * WHEN: Report Store home page, secondary discovery section.
 * HOW:  SectionWrapper(warm) + numbered list of report titles with download counts.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 */
import { Download } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { CTALink } from '../atoms/CTALink';

const TOP_DOWNLOADS = [
  { rank: 1, title: 'Global AI Semiconductor Market Forecast 2026-2032', downloads: '12,847', industry: 'Technology' },
  { rank: 2, title: 'Next-Gen Biologics Pipeline Analysis: mRNA & Cell Therapy', downloads: '9,234', industry: 'Healthcare' },
  { rank: 3, title: 'Green Hydrogen Economy: Production & Distribution', downloads: '8,156', industry: 'Energy' },
  { rank: 4, title: 'Embedded Finance & Banking-as-a-Service Platforms', downloads: '7,892', industry: 'Financial Services' },
  { rank: 5, title: 'Autonomous Vehicle Supply Chain: Sensors to Software', downloads: '6,743', industry: 'Automotive' },
];

interface TopDownloadsProps {
  onReportClick?: (title: string) => void;
}

export function TopDownloads({ onReportClick }: TopDownloadsProps) {
  return (
    <SectionWrapper data-component="TopDownloads" background="warm" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label="Most Popular"
          title="Top Downloads"
          subtitle="Our most downloaded reports this quarter"
          endSlot={<CTALink href="#">View all</CTALink>}
        />
        <div className="mt-8 space-y-0">
          {TOP_DOWNLOADS.map((item) => (
            <button
              key={item.rank}
              onClick={() => onReportClick?.(item.title)}
              className="w-full flex items-center gap-4 px-4 py-4 transition-all duration-150 cursor-pointer group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
              style={{
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'rgba(0,0,0,0.06)',
              }}
            >
              {/* Rank */}
              <span
                className="flex-shrink-0 tabular-nums"
                style={{
                  fontSize: 'var(--text-lg)',
                  color: 'rgba(0,0,0,0.15)',
                  width: '28px',
                  textAlign: 'right',
                }}
              >
                {item.rank}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <p
                  className="truncate transition-colors"
                  style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.8)' }}
                >
                  {item.title}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)', marginTop: '2px' }}>
                  {item.industry}
                </p>
              </div>

              {/* Downloads */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Download size={13} style={{ color: 'rgba(0,0,0,0.25)' }} />
                <span
                  className="tabular-nums"
                  style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}
                >
                  {item.downloads}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}