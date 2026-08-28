/**
 * ReportGridCard
 *
 * WHY · Legacy projects (report-store-legacy, competition-benchmarking-listing-v02) imported
 *        ReportGridCard before ReportCard unified grid+list into one component. This wrapper
 *        preserves backward compatibility without forking code.
 * WHAT · Thin wrapper that delegates to `<ReportCard layout="grid" />`. Omits layout,
 *        description, and ctaLabel props. All other ReportCardProps pass through.
 * WHEN · NEVER in new code. Only for existing consumers that import ReportGridCard and
 *        have not yet been migrated to ReportCard.
 * WHEN NOT · New code: import ReportCard directly with layout="grid"|"list".
 * WHERE · report-store-legacy TopDownloads.tsx + IndustryReportSection.tsx + QuickAccess.tsx +
 *          RecommendedForYou.tsx · competition-benchmarking-listing-v02 same sections
 * HOW ·
 *   ```tsx
 *   // Deprecated — prefer ReportCard
 *   <ReportGridCard id="rpt-001" image="/img.jpg" title="EV Battery" industry="Auto"
 *     region="Asia Pacific" date="May 2025" onClick={(id) => handleClick(id)} />
 *   ```
 *
 * @reusabilityScore 3     // legacy only · do not add new consumers
 * @a11y_status pending-review
 * @lifecycle deprecated
 * @promotedFrom core-v2 native
 */
import { ReportCard } from './ReportCard';
import type { ReportCardProps } from './ReportCard';

type ReportGridCardProps = Omit<ReportCardProps, 'layout' | 'description' | 'ctaLabel'>;

export function ReportGridCard(props: ReportGridCardProps) {
  return <ReportCard {...props} layout="grid" />;
}
