/**
 * DataHighlightCard
 *
 * WHY · The "Daily Data Highlights" section needs a compact card that leads with a
 *        large serif numeric value (the data point) rather than a title or image.
 *        Standard ReportCard is image-first; this molecule inverts the hierarchy.
 * WHAT · Card with timestamp header → large serif value → title → growth badge →
 *        source + AnimatedArrow footer. Props: value, title, source, growth, time,
 *        icon (optional ReactNode), className, onClick.
 * WHEN · In the DailyDataHighlights section of the report store home. Also usable
 *        in any section that spotlights a single numeric stat with context.
 * WHEN NOT · Don't use when displaying a full report — use ReportCard. Don't use
 *             when the stat has no growth/source context — use StatCard instead.
 * WHERE · report-store-legacy DailyDataHighlights.tsx
 * HOW ·
 *   ```tsx
 *   <DataHighlightCard
 *     value="$4.2T"
 *     title="Global semiconductor market projected by 2030"
 *     growth="+8.6% CAGR"
 *     source="Ken Research · 2025"
 *     time="Updated 2h ago"
 *   />
 *   ```
 *
 * @reusabilityScore 2     // DailyDataHighlights section only
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { TrendingUp, Zap } from "lucide-react";
import { iconColors } from '../atoms/iconColors';
import { Tooltip } from '../atoms/Tooltip';
import { Card } from '../atoms/Card';
import { AnimatedArrow } from '../atoms/AnimatedArrow';
import { useState } from 'react';
import type { ReactNode } from "react";

interface DataHighlightCardProps {
  value: string;
  title: string;
  source: string;
  growth: string;
  time: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataHighlightCard({ value, title, source, growth, time, icon, className, onClick }: DataHighlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      data-component="DataHighlightCard"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    <Card
      hover
      className={`cursor-pointer group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${className || ""}`}
      style={{ padding: '14px' }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-black/40" style={{ fontSize: "var(--text-xs)" }}>{time}</span>
        {icon || <Zap className="h-3.5 w-3.5" color={iconColors.content} />}
      </div>
      <p className="text-black mb-0.5 tabular-nums" style={{ fontFamily: "var(--font-serif)", fontWeight: 'var(--font-weight-light)' as any, fontSize: "var(--text-base)" }}>
        {value}
      </p>
      <p className="text-black/70 mb-1.5 leading-snug group-hover:text-black transition-colors" style={{ fontSize: "var(--text-xs)" }}>
        {title}
      </p>
      <div className="flex items-center gap-2 mb-3" style={{ fontSize: "var(--text-xs)" }}>
        <Tooltip text="Growth rate">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5" style={{ color: "var(--green-700)", background: "rgba(22, 163, 74, 0.08)", borderRadius: "var(--radius-element, 5px)", fontSize: "var(--text-xs)" }}>
            <TrendingUp className="h-3 w-3" />
            {growth}
          </span>
        </Tooltip>
      </div>
      <div className="mt-auto pt-2.5 flex items-center justify-between" style={{ borderTop: "1px solid var(--black-200)" }}>
        <span className="text-black/40" style={{ fontSize: "var(--text-xs)" }}>{source}</span>
        <AnimatedArrow size={12} color="black" isHovered={isHovered} />
      </div>
    </Card>
    </div>
  );
}