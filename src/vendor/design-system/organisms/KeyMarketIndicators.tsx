/**
 * KeyMarketIndicators — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Report Store–specific wrapper around StatsRow with RS data.
 * WHY:  Encapsulates the Section 3 stat card configuration so the
 *       template doesn't inline props.
 * WHEN: Section 3 of ReportStorePage (Home mode).
 * HOW:  Accepts `stats` via prop. Consumer owns mock data.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { StatsRow } from './StatsRow';
import type { StatData } from '../types';

export interface KeyMarketIndicatorsProps {
  stats: StatData[];
  label?: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
}

export function KeyMarketIndicators({
  stats,
  label = 'Market Intelligence',
  title = 'Key Indicators',
  subtitle = 'Real-time market sizing and growth metrics from our research coverage',
  columns = 4,
}: KeyMarketIndicatorsProps) {
  return <StatsRow data-component="KeyMarketIndicators" label={label} title={title} subtitle={subtitle} stats={stats} columns={columns} />;
}
