/**
 * ComparisonParameterCard
 *
 * WHAT · Compact parameter card: square purple-tinted icon/number container, h4 title,
 *        and short description. Hover changes border. Used in comparison parameter grids
 *        in CompetitiveLandscape.
 *
 * WHY · CompetitiveLandscape organism displays 6–8 comparison parameters (Revenue Growth,
 *       Market Penetration, Customer Retention, etc.) in a grid. Each card has the same
 *       chrome as AnalysisCard but semantically represents a comparison dimension rather
 *       than an analysis point. Separate component preserves semantic clarity.
 *       (AnalysisCard: analysis of findings. ComparisonParameterCard: dimension of comparison.)
 *
 * WHEN · CompetitiveLandscape comparison parameter grid. Any section listing evaluation
 *        criteria or comparison dimensions with short descriptions.
 *
 * WHEN NOT · Analysis findings → AnalysisCard. Feature cards → IconCard.
 *            Stakeholder types → StakeholderCard.
 *
 * WHERE · core-v2/src/molecules/ComparisonParameterCard.tsx
 *         Consumed by: CompetitiveLandscape organism
 *
 * HOW · Accepts either `icon` (ReactNode) OR `number` (displayed as badge text).
 *       Icon takes precedence. Token-only styling. h4 uses `--text-compact` (14px).
 *       Description uses `--text-xs` (12.8px ≈ 13px).
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/comparison-parameter-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[var(--radius-md)]` (10px V0.2) → `--radius-sm` (10px core-v2)
 *   V0.2 `text-sm font-bold` (13px V0.2) for title → `--text-compact` (14px) + bold
 *     NOTE: V0.2 title used `text-sm` which maps to 13px in their theme; 14px is close
 *   V0.2 `text-xs` (V0.2 theme value) for desc → `--text-xs` (12.8px) — same intent
 *   V0.2 `text-base font-bold` (14px V0.2) for number → `--text-compact` + bold
 */

import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ComparisonParameterCardProps {
  /**
   * Icon element (Lucide/Phosphor).
   * Takes precedence over `number` when both provided.
   */
  icon?: ReactNode;
  /** Number badge alternative to icon (e.g., 1, 2, 3). */
  number?: number;
  /** Parameter title (h4) */
  title: string;
  /** Short description of the parameter */
  description: string;
  /** Additional classes for the root element. */
  className?: string;
}

export function ComparisonParameterCard({
  icon,
  number,
  title,
  description,
  className,
}: ComparisonParameterCardProps) {
  return (
    <div
      className={cn(
        'h-full p-4 border transition-colors duration-300',
        'hover:border-[var(--black-300)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Icon or number badge */}
      <div
        className="size-10 mb-4 flex items-center justify-center"
        style={{
          backgroundColor: 'var(--purple-100)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        {number !== undefined && !icon ? (
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: 'var(--text-compact)',
              color: 'var(--purple-500)',
            }}
          >
            {number}
          </span>
        ) : (
          <div style={{ color: 'var(--purple-500)' }}>
            {icon}
          </div>
        )}
      </div>

      {/* Title */}
      <h4
        className="mb-2 font-bold"
        style={{
          fontSize: 'var(--text-compact)',
          color: 'var(--black-900)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {title}
      </h4>

      {/* Description */}
      <p
        style={{
          fontSize: 'var(--text-xs)',
          lineHeight: 'var(--leading-relaxed)',
          color: 'var(--black-500)',
        }}
      >
        {description}
      </p>
    </div>
  );
}
