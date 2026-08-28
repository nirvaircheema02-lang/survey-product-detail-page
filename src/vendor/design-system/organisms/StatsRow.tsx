/**
 * StatsRow — Organism (cross-pillar)
 *
 * WHY: Numeric stat callouts (market size · CAGR · report count) need consistent grid + SectionHeading framing.
 *      Reusable across Report Store · Surveys · case-studies.
 * WHAT: SectionWrapper(warm) wrapping SectionHeading + 2/3/4-col grid of StatCard (each = category · value · label · description · growth · metric).
 * WHEN: Section 3 of pillar homes ("Key Market Indicators") · Methodology stats · Impact metrics on case-studies.
 * WHEN NOT: Single hero stat (use direct StatCard) · charts (use Chart Card · 8-zone) · dynamic data that changes (use real-time component).
 * HOW: Pass `stats: StatItem[]` · `columns: 2|3|4 default=4` · `label · title · subtitle · background='warm'|'white'|'black'`.
 *
 * Structure: SectionWrapper(warm) → SectionHeading → StatCard grid
 */
import type { ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { StatCard } from '../molecules';

export interface StatItem {
  category: string;
  value: string;
  label: string;
  description: string;
  growth?: string;
  metric?: string;
}

export interface StatsRowProps {
  /** SectionHeading label */
  label: string;
  /** SectionHeading title */
  title: string;
  /** SectionHeading subtitle */
  subtitle?: string;
  /** Array of stat data to render as StatCards */
  stats: StatItem[];
  /** Background color variant */
  background?: 'white' | 'warm' | 'black';
  /** Number of grid columns at large breakpoint */
  columns?: 2 | 3 | 4;
  /** Optional extra content rendered below the grid */
  children?: ReactNode;
  /** className for outer wrapper */
  className?: string;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

export function StatsRow({
  label,
  title,
  subtitle,
  stats,
  background = 'warm',
  columns = 4,
  children,
  className,
  ...dataProps
}: StatsRowProps) {
  const colClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <SectionWrapper data-component="StatsRow" {...dataProps} background={background} spacing="lg" maxWidth="wide" className={className}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label={label}
          title={title}
          subtitle={subtitle}
        />
        <div className={`mt-8 grid ${colClass} gap-4`}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </SectionWrapper>
  );
}
