/**
 * IndustryBadge
 *
 * WHY · Report cards, listing rows, and carousels need a lightweight, text-only industry
 *        label above the title. Using a shared component keeps the letter-spacing, font-size
 *        token, and truncation behaviour identical across every card type.
 * WHAT · Block-level `<span>` with uppercase text, var(--text-xs) size, 0.06em letter
 *        spacing, 40% opacity black, truncated to one line. Props: children (ReactNode),
 *        className (string).
 * WHEN · Above the title in any report card (ReportCard, ReportGridCard, AnalystPickCardB
 *        embedded mini-card, UpcomingReports list item). Use whenever the industry or
 *        subcategory label precedes the title.
 * WHEN NOT · Don't use as a clickable filter chip — use FilterChip atom instead. Don't
 *             use when colour-coded category distinction is needed — use Badge atom with
 *             theme instead.
 * WHERE · ReportCard molecule · AnalystPickCardB · report-store-legacy UpcomingReports.tsx
 *          + ReportCard.tsx + molecules/ReportGridCard.tsx ·
 *          competition-benchmarking-listing-v02 UpcomingReports.tsx + ReportCard.tsx +
 *          BenchmarkCard.tsx + BenchmarkListCard.tsx
 * HOW ·
 *   ```tsx
 *   <IndustryBadge>Automotive</IndustryBadge>
 *   ```
 *
 * @reusabilityScore 5     // used in every report card variant across 3+ projects
 * @a11y_status reviewed-AA  // text-only, no interactive affordance required
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import type { ReactNode } from "react";

interface IndustryBadgeProps {
  children: ReactNode;
  className?: string;
}

export function IndustryBadge({ children, className }: IndustryBadgeProps) {
  return (
    <span
      data-component="IndustryBadge"
      className={`block truncate uppercase ${className ?? ''}`}
      style={{
        fontSize: 'var(--text-xs)',
        color: 'rgba(0,0,0,0.4)',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </span>
  );
}