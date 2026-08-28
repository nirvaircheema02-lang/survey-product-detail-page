/**
 * IconBox — Atom
 *
 * WHAT: Square icon container with tinted background.
 *       `size="sm"` (44px) · `size="md"` (48px). Corner radius = --radius-sm (10px).
 *       Background is a 10% tint of the semantic icon colour via the `color` prop.
 *
 * WHY: V0_lite KeyStats and ReportHighlights both use a `size-11 / size-12 rounded-[10px]`
 *      icon container with `bg-content-icon/10`. Centralising prevents radius drift
 *      (V0.2 uses --radius-md for 10px which collides with core-v2 15px --radius-md).
 *      Token-mapping: V0.2 `--radius-md (10px)` → core-v2 `--radius-sm (10px)` ✅.
 *
 * WHEN: Icon callout in stat rows, highlight cards, feature cards.
 *       Any context where a Lucide icon needs a branded tinted square container.
 *
 * WHEN NOT: For navigation icons → use MenuItem's built-in iconBg prop.
 *           For badge-with-icon → use IconBadge atom.
 *           Never use brand-red for the icon colour (rule C2.9 — content purple only).
 *
 * WHERE: KeyStatsStrip organism · ReportHighlights organism · InlineStats atom · GrowthDriversChallenges.
 *
 * HOW:
 * ```tsx
 * import { BarChart3 } from 'lucide-react';
 *
 * // Default purple content icon
 * <IconBox icon={BarChart3} />
 *
 * // Coral accent variant
 * <IconBox icon={Globe} color="coral" size="md" />
 *
 * // With accessible label
 * <IconBox icon={TrendingUp} label="CAGR trending up" />
 * ```
 *
 * A11y: Icon wrapped in aria-hidden by default (decorative).
 *       Pass `label` prop to expose to assistive tech via aria-label on wrapper.
 *       Touch target ≥44px: size="sm" is exactly 44px — meets WCAG 2.5.5 when interactive.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx (icon-box pattern)
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { LucideIcon } from 'lucide-react';
import { iconColors } from './iconColors';

export type IconBoxColor = 'purple' | 'coral' | 'periwinkle' | 'perano' | 'warm';
export type IconBoxSize = 'sm' | 'md';
export type IconBoxShape = 'square' | 'circle';

export interface IconBoxProps {
  /** Lucide icon component to render inside the box. */
  icon: LucideIcon;

  /**
   * Semantic colour palette for the tinted background.
   * The icon colour follows the palette automatically.
   * - `'purple'` — `--purple-600` icon on purple-100 tint (default, canonical for content icons).
   * - `'coral'` — `--coral-500` icon on coral-100 tint.
   * - `'periwinkle'` — `--periwinkle-500` icon on periwinkle-100 tint.
   * - `'perano'` — `--perano-500` icon on perano-100 tint.
   * - `'warm'` — `--black-500` utility icon on warm-200 tint.
   * NOTE: NO `brand` variant — brand-red reserved for CTAs only (ANTI-PATTERNS rule 19).
   * @default 'purple'
   */
  color?: IconBoxColor;

  /**
   * Box size.
   * - `'sm'` — 44px × 44px (default). Matches V0_lite `size-11`.
   * - `'md'` — 48px × 48px. Matches V0_lite `size-12` (KeyStats StatItem).
   * @default 'sm'
   */
  size?: IconBoxSize;

  /**
   * Container shape.
   * - `'square'` — rounded-square, `--radius-sm` corners (default, matches KeyStats/ReportHighlights).
   * - `'circle'` — full circle. Used by report stat-card patterns that need a circular tinted badge.
   * @default 'square'
   */
  shape?: IconBoxShape;

  /**
   * Accessible label for the icon box when it carries semantic meaning.
   * When provided, adds `aria-label` to the wrapper and keeps icon `aria-hidden`.
   * Omit for purely decorative icon boxes.
   */
  label?: string;

  /** Tailwind utility overrides on the root div. */
  className?: string;
}

const colorMap: Record<
  IconBoxColor,
  { bg: string; iconColor: string; iconStroke: number }
> = {
  purple: {
    bg: 'rgba(128, 108, 224, 0.10)',
    iconColor: iconColors.content,
    iconStroke: 1.8,
  },
  coral: {
    bg: 'rgba(251, 184, 167, 0.20)',
    iconColor: 'var(--coral-500)',
    iconStroke: 1.8,
  },
  periwinkle: {
    bg: 'rgba(165, 180, 252, 0.20)',
    iconColor: 'var(--periwinkle-500)',
    iconStroke: 1.8,
  },
  perano: {
    bg: 'rgba(187, 203, 255, 0.20)',
    iconColor: 'var(--perano-500)',
    iconStroke: 1.8,
  },
  warm: {
    bg: 'rgba(234, 229, 227, 0.50)',
    iconColor: iconColors.utility,
    iconStroke: 1.5,
  },
};

const sizeMap: Record<IconBoxSize, { boxSize: string; iconSize: number }> = {
  sm: { boxSize: '2.75rem', iconSize: 20 }, // 44px
  md: { boxSize: '3rem',    iconSize: 20 }, // 48px
};

export function IconBox({
  icon: Icon,
  color = 'purple',
  size = 'sm',
  shape = 'square',
  label,
  className = '',
}: IconBoxProps) {
  const { bg, iconColor, iconStroke } = colorMap[color];
  const { boxSize, iconSize } = sizeMap[size];

  return (
    <div
      data-component="IconBox"
      data-color={color}
      data-size={size}
      data-shape={shape}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: boxSize,
        height: boxSize,
        borderRadius: shape === 'circle' ? '9999px' : 'var(--radius-sm)',
        backgroundColor: bg,
      }}
    >
      <Icon
        style={{ width: iconSize, height: iconSize, color: iconColor }}
        strokeWidth={iconStroke}
        aria-hidden="true"
      />
    </div>
  );
}
