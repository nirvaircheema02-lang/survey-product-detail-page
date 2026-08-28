/**
 * IconBadge — Atom
 *
 * WHY: Reusable decorative icon holder for section headers, list items,
 *      and card accents. Prevents each component from hand-coding the
 *      same icon-wrapper pattern w/ background tint.
 * WHAT: Small icon container with background tint and rounded shape.
 * WHEN: SectionHeading icon slots · CategoryListItem leading icon ·
 *       IndustrySectorsGrid sector icons · filter section headers.
 * WHEN NOT: Pure-text labels (use Badge) · large hero icons (use raw <Icon> directly).
 *
 * HOW:
 * ```tsx
 * <IconBadge icon={Sparkles} size="md" />
 * <IconBadge icon={ChevronDown} color={iconColors.utility} size="sm" />
 * ```
 *
 * COLOR SYSTEM: Background uses rgba() opacity tint of the icon color.
 * Defaults to content icon color (#806ce0 at 10% bg).
 *
 * @promotedFrom Design_system_vs_26/src/app/components/IconBadge.tsx
 * @portedDate 2026-05-12 — DS Port Batch 1
 */
import type { LucideIcon } from 'lucide-react';
import { iconColors } from './iconColors';

export type IconBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconBadgeProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Size preset (default: 'sm') */
  size?: IconBadgeSize;
  /** Icon stroke color — defaults to iconColors.content */
  color?: string;
  /** Background color — defaults to 10% opacity of `color` */
  bgColor?: string;
  /** Additional className */
  className?: string;
}

const SIZE_MAP: Record<IconBadgeSize, { container: number; icon: number }> = {
  xs: { container: 24, icon: 12 },
  sm: { container: 28, icon: 14 },
  md: { container: 32, icon: 16 },
  lg: { container: 40, icon: 20 },
};

export function IconBadge({
  icon: Icon,
  size = 'sm',
  color = iconColors.content,
  bgColor,
  className = '',
}: IconBadgeProps) {
  const dims = SIZE_MAP[size];

  /* Default bg: 10% opacity of the icon color (hex + 1a suffix ≈ 10%) */
  const resolvedBg = bgColor || `${color}1a`;

  return (
    <div
      data-component="IconBadge"
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: `${dims.container}px`,
        height: `${dims.container}px`,
        borderRadius: 'var(--radius-inner, 6px)',
        backgroundColor: resolvedBg,
      }}
    >
      <Icon size={dims.icon} color={color} />
    </div>
  );
}
