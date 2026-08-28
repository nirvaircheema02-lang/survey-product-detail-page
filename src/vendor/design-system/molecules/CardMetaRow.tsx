/**
 * CardMetaRow
 *
 * WHY · Report cards require a scannable inline meta strip (projection/region/date) but
 *        different contexts need different field combinations. A single component with
 *        variant prop avoids duplicating the icon + color token logic across every card.
 * WHAT · Flex row of icon-labelled metadata fields. Variant A: projection (TrendingUp green)
 *        + region (MapPin). Variant B: region + date (Calendar). Props: projection, region,
 *        date, variant ("A"|"B"), className. Returns null if all fields are empty.
 * WHEN · Inside ReportCard, ReportGridCard, AnalystPickCardB embedded mini-card, and any
 *        listing card that needs 1-2 inline meta fields.
 * WHEN NOT · Don't use when only a date is needed alone — use CardFooterRow. Don't use
 *             for 3+ meta fields; compose a custom row instead.
 * WHERE · ReportCard molecule · AnalystPickCardB · report-store-legacy ReportCard.tsx ·
 *          competition-benchmarking-listing-v02 ReportCard.tsx + BenchmarkCard.tsx
 * HOW ·
 *   ```tsx
 *   // Variant A: projection + region
 *   <CardMetaRow projection="12.4% CAGR" region="Asia Pacific" />
 *
 *   // Variant B: region + date
 *   <CardMetaRow variant="B" region="North America" date="May 2025" />
 *   ```
 *
 * @reusabilityScore 4     // used in every report card type across 3+ projects
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { TrendingUp, MapPin, Calendar } from "lucide-react";
import { iconColors } from '../atoms/iconColors';
import { Tooltip } from '../atoms/Tooltip';

export type CardMetaVariant = "A" | "B";

interface CardMetaRowProps {
  projection?: string | null;
  region: string;
  date?: string;
  variant?: CardMetaVariant;
  className?: string;
}

export function CardMetaRow({ projection, region, date, variant = "A", className }: CardMetaRowProps) {
  if (!projection && !region && !date) return null;

  if (variant === "B") {
    return (
      <div data-component="CardMetaRow" className={className || "flex items-center gap-1.5 flex-wrap"} style={{ fontSize: "var(--text-xs)" }}>
        {region && (
          <span className="text-black/40 flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" color={iconColors.utility} />
            {region}
          </span>
        )}
        {region && date && <span className="text-black/15">&middot;</span>}
        {date && (
          <span className="text-black/35 flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" color={iconColors.utility} />
            {date}
          </span>
        )}
      </div>
    );
  }

  return (
    <div data-component="CardMetaRow" className={className || "flex items-center gap-1.5 flex-wrap"} style={{ fontSize: "var(--text-xs)" }}>
      {projection && (
        <Tooltip text="Projected growth rate">
          <span className="flex items-center gap-1" style={{ color: "var(--green-600)" }}>
            <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
            {projection}
          </span>
        </Tooltip>
      )}
      {projection && region && <span className="text-black/15">&middot;</span>}
      {region && (
        <span className="text-black/40 flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0" color={iconColors.utility} />
          {region}
        </span>
      )}
    </div>
  );
}