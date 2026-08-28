/**
 * InlineStats — Atom
 *
 * WHAT: Single self-contained inline stat unit: IconBox + value + label.
 *       Renders vertically (icon → value → label) or horizontally (icon → value+label row).
 *       Does NOT render a grid row — compose into StatPairRow molecule for the 3-col strip.
 *
 * WHY: V0_lite KeyStats.tsx `StatItem` (L69-118) is a recurring 3-part composition:
 *      icon-box + tabular-nums stat value + muted utility label.
 *      Extracting as an atom lets StatPairRow molecule compose 3 of these in a grid
 *      without duplicating the internal layout logic.
 *
 * WHEN: Single stat callout anywhere (hero metadata · chapter summary · sidebar).
 *       Compose 3 in StatPairRow molecule for the standard KeyStats strip.
 *
 * WHEN NOT: For value + label without icon → use StatPair atom.
 *           For badge-style trend callout → use StatBadge atom.
 *
 * WHERE: KeyStatsStrip organism · HeroSection metadata · InlineStats used in molecules.
 *
 * HOW:
 * ```tsx
 * import { BarChart3 } from 'lucide-react';
 *
 * // Vertical layout (default — stacks icon → value → label)
 * <InlineStats
 *   icon={BarChart3}
 *   value="$45.2B"
 *   label="Market Size 2024"
 * />
 *
 * // Horizontal — icon beside value+label column
 * <InlineStats
 *   icon={TrendingUp}
 *   value="32.5%"
 *   label="CAGR 2024–2030"
 *   orientation="horizontal"
 * />
 *
 * // Coral icon colour
 * <InlineStats icon={Globe} value="50+" label="Countries" iconColor="coral" />
 * ```
 *
 * A11y: Uses StatPair (<dl><dt><dd>) for semantic value+label pairing.
 *       Icon is decorative (aria-hidden) — label carries meaning.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx:69 (StatItem pattern)
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { LucideIcon } from 'lucide-react';
import { IconBox, type IconBoxColor, type IconBoxSize } from './IconBox';
import { StatPair } from './StatPair';

export interface InlineStatsProps {
  /** Lucide icon component for the icon box. */
  icon: LucideIcon;

  /** Metric value string (e.g. "$45.2B"). Rendered large, semibold, tabular-nums. */
  value: string;

  /** Descriptor label below the value. */
  label: string;

  /**
   * Layout orientation.
   * - `'vertical'` — icon → value → label stacked (default · matches KeyStats canonical).
   * - `'horizontal'` — icon beside value+label column.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Colour palette for the icon box tint.
   * @default 'purple'
   */
  iconColor?: IconBoxColor;

  /**
   * Icon box size.
   * - `'sm'` — 44px (default).
   * - `'md'` — 48px (canonical for KeyStats strip, matches V0_lite size-12).
   * @default 'md'
   */
  iconSize?: IconBoxSize;

  /** Tailwind utility overrides on the root wrapper. */
  className?: string;
}

export function InlineStats({
  icon,
  value,
  label,
  orientation = 'vertical',
  iconColor = 'purple',
  iconSize = 'md',
  className = '',
}: InlineStatsProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      data-component="InlineStats"
      data-orientation={orientation}
      className={`${isHorizontal ? 'flex items-center gap-3' : 'flex flex-col items-start gap-2'} ${className}`}
    >
      <IconBox icon={icon} color={iconColor} size={iconSize} />
      <StatPair
        value={value}
        label={label}
        orientation={isHorizontal ? 'vertical-label-first' : 'vertical'}
      />
    </div>
  );
}
