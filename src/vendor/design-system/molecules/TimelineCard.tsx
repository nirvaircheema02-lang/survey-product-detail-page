/**
 * TimelineCard
 *
 * WHAT · Centered card for displaying timeline / period data. Off-white background,
 *        muted label text above, bold prominent value below. Hover darkens background.
 *        Used in horizontal timeline rows (Base Year / Historical Period / Forecast Period).
 *
 * WHY · MarketOverview and SampleReportPreview both render a horizontal strip of
 *       period cards (2019–2024 historical · 2024 base · 2024–2030 forecast). Without
 *       a shared molecule the V0.2 cards use hardcoded hex across every instance.
 *
 * WHEN · Horizontal timeline strips showing date ranges and base years.
 *        MarketOverview period selector. SampleReportPreview sidebar metadata.
 *
 * WHEN NOT · Full stat tiles with icons → StatCard. Analysis numbered cards → AnalysisCard.
 *            Progress data → SegmentationCard.
 *
 * WHERE · core-v2/src/molecules/TimelineCard.tsx
 *         Consumed by: MarketOverview organism · SampleReportPreview organism
 *
 * HOW · Pure display — no interaction state beyond hover. `value` accepts string or number.
 *       Token-only styling. No motion (static in timeline context).
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/timeline-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[10px]` → `var(--radius-sm)` (10px core-v2)
 *   V0.2 `border-[#f5f5f5]` → `var(--black-100)`
 *   V0.2 `bg-[#fafafa]` → `var(--black-50)`
 *   V0.2 `hover:bg-[#f5f5f5]` → `var(--black-100)` via Tailwind arbitrary
 *   V0.2 `text-[14px] text-[#737373]` for label → `--text-compact` + `--black-500`
 *   V0.2 `text-[26px] font-bold text-[#171717]` for value → `--text-lg` (25px) + bold + `--black-900`
 */

import { cn } from '../lib/cn';

export interface TimelineCardProps {
  /** Label text (e.g., "Base Year", "Historical Period", "Forecast Period") */
  label: string;
  /** Prominent value (e.g., "2024", "2019–2024", "6.0%") */
  value: string | number;
  /** Additional classes for the root element. */
  className?: string;
}

export function TimelineCard({ label, value, className }: TimelineCardProps) {
  return (
    <div
      className={cn(
        'border transition-colors duration-300 hover:bg-[var(--black-100)]',
        className,
      )}
      style={{
        borderRadius: 'var(--radius-sm)',
        borderColor: 'var(--black-100)',
        backgroundColor: 'var(--black-50)',
      }}
    >
      <div className="p-4 text-center">
        <p
          className="mb-1"
          style={{
            fontSize: 'var(--text-compact)',
            color: 'var(--black-500)',
          }}
        >
          {label}
        </p>
        <p
          className="tabular-nums font-bold"
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--black-900)',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
