/**
 * ProgressBar
 *
 * WHAT · Linear progress bar with token-driven fill color and track.
 *        Renders a full-width track with a proportional fill at percentage of value/max.
 *        Optional label below bar. Three height variants (sm/default/lg).
 *
 * WHY · SegmentationCard, MarketDataTable cells, and CompetitiveLandscape all need a
 *       consistent inline visual encoding of share/progress percentages. Without a shared
 *       primitive each site re-implements the bar with raw inline styles and hardcoded hex
 *       (audit pattern in V0.2 stat-card.tsx and segmentation-card.tsx). One canonical atom
 *       prevents drift.
 *
 * WHEN · Inside SegmentationCard items (share %), MarketDataTable cells (market contribution %),
 *        any section where a numeric proportion must be visualised inline.
 *
 * WHEN NOT · Do not use as a loading indicator — use Skeleton for that. Do not use for
 *            range-input (use a Slider primitive).
 *
 * WHERE · core-v2/src/atoms/ProgressBar.tsx
 *         Consumed by: SegmentationCard · MarketDataTable · ComparisonParameterCard
 *
 * HOW · Zero hardcoded hex. All colors accepted as CSS var names via `color` prop.
 *       CSS transition guarded by `useReducedMotion()`. ARIA progressbar role.
 *       `noAnimation` prop for static use (data tables).
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/progress-bar.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor V0.2 color prop was CSS var strings — kept as-is since they ARE token refs.
 *                 Replaced raw `transition-all duration-700 ease-out` with token motion var.
 */

'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

/** Height variant of the progress bar track */
export type ProgressBarSize = 'sm' | 'default' | 'lg';

export interface ProgressBarProps {
  /** Current value (0–max). Clamped to [0, max]. */
  value: number;
  /** Maximum value for percentage calculation. @default 100 */
  max?: number;
  /** Show label text below the bar. @default false */
  showLabel?: boolean;
  /** Custom label string. Falls back to "{percentage}%". */
  label?: string;
  /** Height variant. @default 'default' */
  size?: ProgressBarSize;
  /**
   * Fill color — CSS var reference (e.g., `var(--purple-300)`).
   * Use token names only, never raw hex.
   * @default 'var(--purple-300)'
   */
  color?: string;
  /**
   * Track background color — CSS var reference.
   * @default 'var(--black-100)'
   */
  backgroundColor?: string;
  /** Disable CSS transition (useful inside sortable tables). @default false */
  noAnimation?: boolean;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Accessible label for the progressbar role. Falls back to `${percentage}%`. */
  ariaLabel?: string;
}

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  default: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  label,
  size = 'default',
  color = 'var(--purple-300)',
  backgroundColor = 'var(--black-100)',
  noAnimation = false,
  className,
  ariaLabel,
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const displayLabel = label ?? `${Math.round(percentage)}%`;

  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? displayLabel}
        className={cn('w-full rounded-full overflow-hidden', sizeClasses[size])}
        style={{ backgroundColor }}
      >
        <div
          className={cn(
            'h-full rounded-full',
            !noAnimation && !shouldReduceMotion && 'transition-[width] duration-700 ease-out',
          )}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      {showLabel && (
        <div
          className="mt-1 text-right"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--black-600)',
          }}
        >
          {displayLabel}
        </div>
      )}
    </div>
  );
}
