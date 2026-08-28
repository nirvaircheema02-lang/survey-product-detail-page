/**
 * DailyDataHighlights — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Daily data highlights section for the Report Store home page.
 * WHY:  Wraps SectionWrapper + SectionHeading + DataHighlightCard grid.
 * WHEN: Section 5 of ReportStorePage (Home mode).
 * HOW:  Accepts `highlights` via prop (data injection).
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { CTALink } from '../atoms/CTALink';
import { DataHighlightCard } from '../molecules/DataHighlightCard';
import type { DataHighlight } from '../types';

export interface DailyDataHighlightsProps {
  highlights: DataHighlight[];
  label?: string;
  title?: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}

export function DailyDataHighlights({
  highlights,
  label = 'Data Points',
  title = 'Daily Highlights',
  subtitle = 'The latest data points shaping market narratives',
  seeAllHref = '#',
  seeAllLabel = 'See all data',
}: DailyDataHighlightsProps) {
  return (
    <SectionWrapper data-component="DailyDataHighlights" background="white" spacing="lg" maxWidth="wide" className="border-t border-black/6">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label={label}
          title={title}
          subtitle={subtitle}
          endSlot={<CTALink href={seeAllHref}>{seeAllLabel}</CTALink>}
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((d, idx) => (
            <DataHighlightCard key={idx} {...d} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
