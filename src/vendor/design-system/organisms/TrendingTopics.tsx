/**
 * TrendingTopics — Organism (DS v4.3)
 *
 * WHAT: Trending topics/tags horizontal pill row for the Report Store.
 * WHY:  Shows currently popular research topics as clickable pills,
 *       driving discovery on the home page.
 * WHEN: Below hero or between sections on ReportStorePage (Home mode).
 * HOW:  SectionWrapper(white) + horizontal scrollable row of topic pills.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity. Active pill uses solid black.
 */
import { TrendingUp } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { Badge } from '../atoms/Badge';

const TRENDING_TOPICS = [
  { label: 'Generative AI', growth: '+340%' },
  { label: 'GLP-1 Therapeutics', growth: '+215%' },
  { label: 'Green Hydrogen', growth: '+128%' },
  { label: 'Battery Recycling', growth: '+97%' },
  { label: 'Edge Computing', growth: '+86%' },
  { label: 'Embedded Finance', growth: '+74%' },
  { label: 'Quantum Computing', growth: '+68%' },
  { label: 'Digital Twins', growth: '+62%' },
  { label: 'Autonomous Logistics', growth: '+55%' },
  { label: 'Carbon Capture', growth: '+48%' },
];

interface TrendingTopicsProps {
  onTopicClick?: (topic: string) => void;
}

export function TrendingTopics({ onTopicClick }: TrendingTopicsProps) {
  return (
    <SectionWrapper data-component="TrendingTopics" background="white" spacing="md" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label="Trending"
          title="Popular Topics"
          subtitle="Most searched research topics this week"
        />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.label}
              onClick={() => onTopicClick?.(topic.label)}
              className="group inline-flex items-center gap-2 px-4 py-2.5 transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
              style={{
                borderRadius: 'var(--radius-element)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(0,0,0,0.08)',
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            >
              <TrendingUp
                size={13}
                className="flex-shrink-0"
                style={{ color: 'rgba(0,0,0,0.3)' }}
              />
              <span
                className="transition-colors"
                style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.65)' }}
              >
                {topic.label}
              </span>
              <Badge variant="pill" size="xs" theme="neutral">
                {topic.growth}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
