/**
 * IndustrySectorsGrid — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Industry coverage grid for the Report Store home page.
 * WHY:  Shows industries in two side-by-side cards · row = [icon] [label] [count] [hover arrow].
 * WHEN: Section 8 of ReportStorePage (Home mode).
 * HOW:  Accepts `industries` array via prop · uses getIndustryIcon for icon resolution.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity + periwinkle icon tint.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { ArrowRight } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { getIndustryIcon } from '../atoms/industryIconMap';
import { iconColors } from '../atoms/iconColors';
import type { IndustryData } from '../types';

export interface IndustrySectorsGridProps {
  industries: IndustryData[];
  label?: string;
  title?: string;
  subtitle?: string;
  onSectorClick?: (sector: string) => void;
}

export function IndustrySectorsGrid({
  industries,
  label = 'Coverage',
  title = 'Industry Coverage',
  subtitle,
  onSectorClick,
}: IndustrySectorsGridProps) {
  const midpoint = Math.ceil(industries.length / 2);
  const leftColumn = industries.slice(0, midpoint);
  const rightColumn = industries.slice(midpoint);
  const resolvedSubtitle = subtitle ?? `Explore ${industries.length} industry verticals`;

  return (
    <SectionWrapper data-component="IndustrySectorsGrid" background="white" spacing="lg" maxWidth="content">
      <SectionHeading label={label} title={title} subtitle={resolvedSubtitle} />
      <div className="mt-8 grid sm:grid-cols-2 gap-0 sm:gap-5">
        <IndustryColumn items={leftColumn} onItemClick={onSectorClick} />
        <IndustryColumn items={rightColumn} onItemClick={onSectorClick} className="mt-3 sm:mt-0" />
      </div>
    </SectionWrapper>
  );
}

interface IndustryColumnProps {
  items: IndustryData[];
  onItemClick?: (label: string) => void;
  className?: string;
}

function IndustryColumn({ items, onItemClick, className = '' }: IndustryColumnProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: 'rgb(255, 255, 255)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderRadius: 'var(--rc-radius-card)',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px, rgba(0, 0, 0, 0.02) 0px 1px 2px',
      }}
    >
      {items.map((industry, idx) => {
        const Icon = getIndustryIcon(industry.label);
        const isLast = idx === items.length - 1;

        return (
          <div
            key={industry.label}
            role="button"
            tabIndex={0}
            className="group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-inset"
            aria-label={`${industry.label}, ${industry.count.toLocaleString()}`}
            style={{
              borderBottomWidth: isLast ? '0' : '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: isLast ? 'transparent' : 'var(--warm-500)',
            }}
            onClick={() => onItemClick?.(industry.label)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onItemClick?.(industry.label);
              }
            }}
          >
            <div
              className="w-7 h-7 flex-shrink-0 flex items-center justify-center"
              aria-hidden="true"
              style={{
                borderRadius: 'var(--radius-element)',
                backgroundColor: 'rgba(128, 108, 224, 0.05)',
              }}
            >
              <Icon className="w-3.5 h-3.5" color={iconColors.content} />
            </div>

            <span
              className="flex-1 min-w-0 text-black/70 group-hover:text-black transition-colors truncate"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {industry.label}
            </span>

            <span style={{ display: 'inline-flex', position: 'relative' }}>
              <span
                className="flex-shrink-0 tabular-nums text-black/35"
                style={{ fontSize: 'var(--text-xs)' }}
              >
                {industry.count.toLocaleString()}
              </span>
            </span>

            <ArrowRight
              className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              color={iconColors.utility}
            />
          </div>
        );
      })}
    </div>
  );
}
