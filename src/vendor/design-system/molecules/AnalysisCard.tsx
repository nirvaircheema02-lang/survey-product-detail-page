/**
 * AnalysisCard
 *
 * WHAT · Compact numbered or icon-led analysis card. Square icon container with purple
 *        tint holds either a formatted number badge (e.g., "01") or an icon element.
 *        Below: h4 title + small description paragraph.
 *
 * WHY · CompetitiveLandscape organism grids numbered analysis points (fragmentation,
 *       pricing pressure, etc.). Each point needs a consistent chrome: number in a
 *       purple-tinted box, bold title, muted description. Without a shared molecule
 *       V0.2 hardcoded hex across every landscape card.
 *
 * WHEN · CompetitiveLandscape numbered analysis grids. Any multi-card grid needing
 *        sequential numbered items with short descriptions.
 *
 * WHEN NOT · Large icon-led feature cards → IconCard. Stakeholder rows → StakeholderCard.
 *            Timeline data → TimelineCard.
 *
 * WHERE · core-v2/src/molecules/AnalysisCard.tsx
 *         Consumed by: CompetitiveLandscape organism
 *
 * HOW · `number` OR `icon` required (at least one). Hover changes border color.
 *       All hex replaced with core-v2 token vars. h4 uses `--text-compact` (14px)
 *       to match V0.2 intent. Description uses `--text-xs` (12.8px ≈ 13px V0.2).
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/analysis-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `border-[#e5e5e5]` → `var(--black-200)`
 *   V0.2 `rounded-[10px]` → `var(--radius-sm)` (10px in core-v2)
 *   V0.2 `backgroundColor: '#f4f2fc'` → `var(--purple-100)`
 *   V0.2 `color: '#7f5fe3'` → `var(--purple-500)` (core-v2 canonical hex differs · accepted per TOKEN-GAP-REPORT §4)
 *   V0.2 `text-[14px] text-[#171717]` → `--text-compact` + `--black-900`
 *   V0.2 `text-[12px] text-[#737373]` → `--text-xs` + `--black-500`
 *   V0.2 `text-sm font-bold` (13px V0.2) for number → `--text-xs` + bold
 *   V0.2 `hover:border-purple-300` → `hover:border-[var(--purple-300)]`
 */

import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AnalysisCardProps {
  /**
   * Formatted number badge (e.g., "01", "02").
   * Used when `icon` is not provided.
   */
  number?: string;
  /**
   * Icon element (Lucide/Phosphor).
   * Takes precedence over `number` when both provided.
   */
  icon?: ReactNode;
  /** Card heading (h4) */
  title: string;
  /** Short descriptive text */
  description: string;
  /** Additional classes for the root element. */
  className?: string;
}

export function AnalysisCard({
  number,
  icon,
  title,
  description,
  className,
}: AnalysisCardProps) {
  return (
    <div
      className={cn(
        'p-4 border transition-colors duration-200',
        'hover:border-[var(--purple-300)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Badge: icon or number */}
      <div
        className="size-10 mb-3 flex items-center justify-center shrink-0"
        style={{
          backgroundColor: 'var(--purple-100)',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        {icon ? (
          <div style={{ color: 'var(--purple-500)' }}>
            {icon}
          </div>
        ) : (
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--purple-500)',
            }}
          >
            {number}
          </span>
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
