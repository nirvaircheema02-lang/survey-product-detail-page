/**
 * CardFooterRow
 *
 * WHY · Cards in grid layout need a consistent bottom-pinned date row. Centralising
 *        the Calendar icon + date formatting prevents per-card duplication and keeps
 *        icon color tokens in one place.
 * WHAT · Renders a Calendar icon + date string as a single flex row. Props: date (string),
 *        className (string). Default class pins to bottom via mt-auto.
 * WHEN · Inside ReportCard grid layout as the final row. Also usable in any card that
 *        shows a single date field pinned to the card bottom.
 * WHEN NOT · Don't use when date appears alongside other meta (region, projection) — use
 *             CardMetaRow variant B instead, which handles the composite row.
 * WHERE · ReportCard molecule (grid layout) · report-store-legacy ReportGridCard
 * HOW ·
 *   ```tsx
 *   <CardFooterRow date="May 2025" />
 *   ```
 *
 * @reusabilityScore 2     // consumed mainly via ReportCard internally
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { Calendar } from "lucide-react";
import { iconColors } from '../atoms/iconColors';

interface CardFooterRowProps {
  date: string;
  className?: string;
}

export function CardFooterRow({ date, className }: CardFooterRowProps) {
  return (
    <div data-component="CardFooterRow" className={className || "flex items-center gap-2 mt-auto pt-1"}>
      <span className="flex items-center gap-1 text-black/35" style={{ fontSize: "var(--text-xs)" }}>
        <Calendar className="h-3 w-3" color={iconColors.utility} />
        {date}
      </span>
    </div>
  );
}