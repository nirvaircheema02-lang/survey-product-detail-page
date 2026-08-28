/**
 * StakeholderCard
 *
 * WHAT · Horizontal card: Phosphor icon in a `--purple-100` rounded container on the
 *        left, title (h4) and description paragraph on the right. Used in audience grids.
 *
 * WHY · TargetAudience organism lists 6–8 stakeholder types (Investors, Food Service,
 *       Government, etc.). Each card follows the same icon-left layout. Without a shared
 *       molecule the icon sizing, gap, radius, and hover state drift per-card or per-section.
 *
 * WHEN · TargetAudience stakeholder grids. Any section needing compact icon-left
 *        role/description rows (partner types, audience segments, team roles).
 *
 * WHEN NOT · Vertical icon-above layouts → IconCard. Numbered analysis → AnalysisCard.
 *            Photo/avatar + bio cards → use Avatar atom + custom layout.
 *
 * WHERE · core-v2/src/molecules/StakeholderCard.tsx
 *         Consumed by: TargetAudience organism
 *
 * HOW · Phosphor icon required (pass the component class, not JSX).
 *       44px icon container meets touch target spec. Group hover: optional `group-hover`
 *       styling added at parent if needed. Token-only colors.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/stakeholder-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[10px]` → `var(--radius-sm)` (10px core-v2)
 *   V0.2 `border-[var(--black-100)]` → `var(--black-200)` (visible border per audit preference)
 *   V0.2 `text-base font-bold` (14px V0.2) for title → `--text-compact` + `--font-weight-bold`
 *   V0.2 `text-sm leading-relaxed` (13px V0.2) for desc → `--text-xs` + `--leading-relaxed`
 *   V0.2 `text-foreground` → `var(--black-900)`
 */

import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface StakeholderCardProps {
  /**
   * Icon element (Lucide, Phosphor, or any ReactNode).
   * Rendered inside a `--purple-100` container (44px touch target).
   */
  icon: ReactNode;
  /** Stakeholder type heading (h4) */
  title: string;
  /** Description of the stakeholder's relevance / what they gain */
  description: string;
  /** Additional classes for the root element. */
  className?: string;
}

export function StakeholderCard({
  icon,
  title,
  description,
  className,
}: StakeholderCardProps) {
  return (
    <div
      className={cn(
        'group flex items-start gap-4 p-5 border transition-all duration-300',
        className,
      )}
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Icon container — 44px min for touch target */}
      <div
        className="size-11 flex items-center justify-center shrink-0"
        style={{
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--purple-100)',
          color: 'var(--purple-500)',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="mb-1 font-bold"
          style={{
            fontSize: 'var(--text-compact)',
            color: 'var(--black-900)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {title}
        </h3>
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
    </div>
  );
}
