/**
 * RecommendedForYou — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Recommended reports browse grid for the Report Store home page.
 * WHY:  Wraps BrowseGrid with RS-specific content and data.
 * WHEN: Section 4 of ReportStorePage (Home mode).
 * HOW:  Accepts `reports` via prop · view-mode state owned locally.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { useState } from 'react';
import { BrowseGrid } from './BrowseGrid';
import { ReportCard } from '../molecules/ReportCard';
import type { ViewMode } from '../atoms/ViewToggle';
import type { ReportItem } from '../types';

export interface RecommendedForYouProps {
  reports: ReportItem[];
  label?: string;
  title?: string;
  subtitle?: string;
}

export function RecommendedForYou({
  reports,
  label = 'Recommended',
  title = 'Reports for You',
  subtitle = 'Personalized recommendations based on your industry interests',
}: RecommendedForYouProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <BrowseGrid
      data-component="RecommendedForYou"
      label={label}
      title={title}
      subtitle={subtitle}
      items={reports}
      viewMode={viewMode}
      onViewModeChange={(m) => {
        setViewMode(m);
        simulateLoading();
      }}
      loading={loading}
      renderCard={(r, vm) => <ReportCard key={r.id} {...r} layout={vm} />}
    />
  );
}
