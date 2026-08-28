/**
 * AnalystPicks — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Analyst picks section for the Report Store home page.
 * WHY:  Wraps SectionWrapper + SectionHeading + AnalystPickCardB grid.
 * WHEN: Section 6 of ReportStorePage (Home mode).
 * HOW:  Accepts `picks` via prop (data injection). Consumer owns mock data.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { AnalystPickCardB } from '../molecules/AnalystPickCardB';
import type { AnalystPick } from '../types';

export interface AnalystPicksProps {
  picks: AnalystPick[];
  label?: string;
  title?: string;
  subtitle?: string;
}

export function AnalystPicks({
  picks,
  label = 'Expert Insights',
  title = 'Analyst Picks',
  subtitle = 'Hand-selected reports from our senior research team',
}: AnalystPicksProps) {
  return (
    <SectionWrapper data-component="AnalystPicks" background="warm" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading label={label} title={title} subtitle={subtitle} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((pick) => (
            <AnalystPickCardB key={pick.id} {...pick} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
