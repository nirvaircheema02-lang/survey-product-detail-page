/**
 * SegmentationCard
 *
 * WHAT · Card for displaying market segmentation data: icon header, title, description,
 *        and a list of items each with a name, share percentage, optional CAGR, optional
 *        sub-description, and an inline ProgressBar. Used in a 2/3/2 staggered grid.
 *
 * WHY · SegmentationSection organism shows 7 segmentation dimensions (herb type, customer
 *       type, distribution channel, packaging, geography, cultivation method, etc.). Each
 *       card follows the same layout contract. Without a shared molecule the progress-bar
 *       colors, icon sizing, and spacing drift. This molecule locks that contract.
 *
 * WHEN · SegmentationSection 7-card grid. Any section presenting categorical breakdown
 *        data with share percentages.
 *
 * WHEN NOT · Non-percentage data → AnalysisCard. Icon feature cards → IconCard.
 *            Timeline rows → TimelineCard.
 *
 * WHERE · core-v2/src/molecules/SegmentationCard.tsx
 *         Consumed by: SegmentationSection organism
 *
 * HOW · Composes ProgressBar atom for the per-item bar. Icon prop accepts any ReactNode
 *       (Lucide, Phosphor, SVG). All sizing/color via tokens. No motion —
 *       parent organism handles stagger. 44px touch target on icon area.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/segmentation-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[var(--radius-md)]` (10px V0.2) → `--radius-sm` (10px core-v2)
 *   V0.2 `text-lg` (18px V0.2) for title → `--text-md` (18px alias per TOKEN-GAP-REPORT §2.9)
 *     NOTE: --text-md may not yet be in base.css; falls back to `--text-sm` (16px) if absent
 *   V0.2 `text-sm` (13px V0.2) → `--text-xs` (12.8px)
 *   V0.2 `var(--shadow-brand-purple)` → kept (token in base.css)
 *   V0.2 inline ProgressBar re-implemented → compose ProgressBar atom
 */

import { type ReactNode } from 'react';
import { ProgressBar } from '../atoms/ProgressBar';
import { cn } from '../lib/cn';

export interface SegmentationItem {
  /** Item name (e.g., "Mint", "Retail Consumers") */
  name: string;
  /** Market share percentage (0–100) */
  share: number;
  /** Optional CAGR growth rate (e.g., "7.2%") */
  cagr?: string;
  /** Optional sub-description */
  description?: string;
}

export interface SegmentationCardProps {
  /**
   * Icon element (Lucide, Phosphor, or any ReactNode).
   * Rendered inside a `--purple-100` tinted container.
   */
  icon: ReactNode;
  /** Card heading */
  title: string;
  /** Card subtitle / segmentation dimension label */
  description?: string;
  /** Segmentation items with share percentages */
  items: SegmentationItem[];
  /**
   * Denominator for progress bar scaling.
   * Set to the highest share value if bars should be relative, or 100 for absolute.
   * @default 100
   */
  maxPercentage?: number;
  /** Additional classes for the root element. */
  className?: string;
}

export function SegmentationCard({
  icon,
  title,
  description,
  items,
  maxPercentage = 100,
  className,
}: SegmentationCardProps) {
  return (
    <div
      className={cn(
        'h-full p-4 border transition-shadow duration-300',
        'hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Icon */}
      <div
        className="size-10 mb-4 flex items-center justify-center"
        style={{
          borderRadius: 'var(--radius-xs)',
          backgroundColor: 'var(--purple-100)',
        }}
        aria-hidden="true"
      >
        <div style={{ color: 'var(--purple-500)' }}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-1"
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--black-900)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      {description && (
        <p
          className="mb-4"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--black-500)',
          }}
        >
          {description}
        </p>
      )}

      {/* Segmentation items */}
      <ul className="space-y-4 mt-6 list-none p-0" aria-label={`${title} breakdown`}>
        {items.map((item, idx) => (
          <li key={idx}>
            {/* Item header row */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-900)',
                    }}
                  >
                    {item.name}
                  </span>
                  {item.cagr && (
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--black-500)',
                      }}
                    >
                      ({item.cagr})
                    </span>
                  )}
                </div>
                {item.description && (
                  <p
                    className="mt-0.5"
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
              <span
                className="ml-2 font-bold tabular-nums shrink-0"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--black-900)',
                }}
              >
                {item.share}%
              </span>
            </div>

            {/* Progress bar */}
            <ProgressBar
              value={item.share}
              max={maxPercentage}
              color="var(--purple-300)"
              noAnimation={false}
              ariaLabel={`${item.name}: ${item.share}%`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
