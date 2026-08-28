'use client';

/**
 * TableSkeleton · loading placeholder for table areas.
 *
 * WHY  · Tables render after data fetch. Without skeleton, users see layout
 *        collapse then re-expand — CLS + jarring UX. Skeleton maintains height
 *        and communicates loading intent with brand-aligned shimmer.
 *
 * WHAT · Renders fake table rows + columns matching TableShell wrapper styling.
 *        Card variant: shows periwinkle-tinted border + 10px radius.
 *        Shimmer: same as ChartSkeleton (periwinkle 1.5s ease-in-out).
 *        Respects prefers-reduced-motion.
 *
 * WHEN · Pass `loading={true}` to table components. Also use directly in
 *        skeleton screens or Suspense fallbacks.
 *
 * WHERE · `design-system/core-v2/src/charts/states/TableSkeleton.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <TableSkeleton rows={5} cols={4} density="comfortable" />
 *        <TableSkeleton variant="open" rows={3} cols={3} animate={false} />
 *        ```
 *
 * A11y · role="status" + aria-label="Loading table" on wrapper.
 *
 * @module design-system/core-v2/src/charts/states/TableSkeleton
 */

import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { TableDensity, TableVariant } from '../primitives/TableShell';
import { KEN_TABLE, KEN_TABLE_DENSITY } from '../theme/tokens';

export interface TableSkeletonProps {
  /** Number of fake body rows · default 5 */
  rows?: number;
  /** Number of fake columns · default 5 */
  cols?: number;
  /** Row density — matches TableShell density prop */
  density?: TableDensity;
  /** Variant — card shows border+radius · open shows flush */
  variant?: TableVariant;
  /**
   * Enable shimmer animation. Disabled when prefers-reduced-motion is active.
   * @default true
   */
  animate?: boolean;
  /** Optional className on wrapper */
  className?: string;
}

const shimmerKeyframes = `
@keyframes ken-skeleton-shimmer {
  0%   { opacity: 0.6; }
  50%  { opacity: 1;   }
  100% { opacity: 0.6; }
}
`;

const CELL_BG = 'rgba(148, 136, 236, 0.08)';
const HEADER_BG = 'rgba(148, 136, 236, 0.13)';

export function TableSkeleton({
  rows = 5,
  cols = 5,
  density = 'standard',
  variant = 'card',
  animate = true,
  className,
}: TableSkeletonProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;
  const rowHeightPx = KEN_TABLE_DENSITY[density];

  const wrapperStyle: CSSProperties = variant === 'card'
    ? {
        border: `1px solid ${KEN_TABLE.cardBorder}`,
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'transparent',
        margin: '28px 0',
        animation: shouldAnimate ? 'ken-skeleton-shimmer 1.5s ease-in-out infinite' : undefined,
      }
    : {
        border: 'none',
        borderRadius: 0,
        overflow: 'visible',
        background: 'transparent',
        margin: '28px 0',
        animation: shouldAnimate ? 'ken-skeleton-shimmer 1.5s ease-in-out infinite' : undefined,
      };

  return (
    <div
      className={['w-full', className ?? ''].join(' ')}
      role="status"
      aria-label="Loading table"
      style={wrapperStyle}
    >
      {shouldAnimate && <style>{shimmerKeyframes}</style>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }} aria-hidden="true">
        {/* Fake header row */}
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, c) => (
              <th
                key={c}
                style={{
                  height: `${rowHeightPx}px`,
                  padding: '0 14px',
                  background: KEN_TABLE.headerWash,
                  borderBottom: `1px solid ${KEN_TABLE.rowDivider}`,
                  verticalAlign: 'middle',
                }}
              >
                <div
                  style={{
                    height: '10px',
                    width: c === 0 ? '60%' : '80%',
                    borderRadius: '3px',
                    background: HEADER_BG,
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        {/* Fake body rows */}
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr
              key={r}
              style={{
                borderBottom: r < rows - 1
                  ? `1px solid ${KEN_TABLE.rowDivider}`
                  : variant === 'open'
                  ? `1px solid ${KEN_TABLE.openLastRowBorder}`
                  : 'none',
              }}
            >
              {Array.from({ length: cols }).map((_, c) => (
                <td
                  key={c}
                  style={{ height: `${rowHeightPx}px`, padding: '0 14px', verticalAlign: 'middle' }}
                >
                  <div
                    style={{
                      height: '11px',
                      width: c === 0 ? '70%' : `${55 + ((r * 3 + c * 7) % 35)}%`,
                      borderRadius: '3px',
                      background: CELL_BG,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="sr-only">Loading table data</span>
    </div>
  );
}
