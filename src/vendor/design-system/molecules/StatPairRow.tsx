/**
 * StatPairRow — Molecule
 *
 * WHAT: 3-column stat strip composing three InlineStats atoms in a responsive grid.
 *       Mobile: 1 column. Desktop (sm+): 3 columns with `gap-3 sm:gap-6`.
 *       Includes top padding `pt-6 sm:pt-8` per V0_lite canonical KeyStats grid pattern.
 *
 * WHY: V0_lite HeroSection (L349-379) uses a `grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8`
 *      stat strip that repeats in hero + key-stats contexts. Molecule extracts this grid
 *      layout + spacing so consumers compose data without managing grid classes.
 *      Serial position effect — stats in a row read L→R naturally, no row interruption.
 *
 * WHEN: Three-stat summary rows — hero sub-CTA stats · chapter summary rows ·
 *       section callout blocks. ALWAYS exactly 3 items (design canonical).
 *
 * WHEN NOT: Do NOT use for 1 or 2 stats — compose InlineStats directly.
 *           Do NOT use for the full KeyStatsStrip section — that is the
 *           KeyStatsStrip organism with gradient bg + container.
 *
 * WHERE: HeroSection left-column below CTA · chapter summary context · PreviewCard stats row.
 *
 * HOW:
 * ```tsx
 * import { BarChart3, TrendingUp, Globe } from 'lucide-react';
 *
 * <StatPairRow
 *   stats={[
 *     { icon: BarChart3, value: '$45.2B', label: 'Market Size 2024', iconColor: 'periwinkle' },
 *     { icon: TrendingUp, value: '32.5%', label: 'CAGR 2024–2030', iconColor: 'periwinkle' },
 *     { icon: Globe, value: '50+', label: 'Countries Covered', iconColor: 'periwinkle' },
 *   ]}
 * />
 * ```
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · HeroSection.tsx:349-379
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */

import { InlineStats } from '../atoms/InlineStats';
import type { InlineStatsProps } from '../atoms/InlineStats';
import { cn } from '../lib/cn';

export interface StatPairRowItem
  extends Pick<InlineStatsProps, 'icon' | 'value' | 'label' | 'iconColor' | 'iconSize'> {
  /** Override layout orientation per item. Defaults to 'vertical'. */
  orientation?: 'vertical' | 'horizontal';
}

export interface StatPairRowProps {
  /**
   * Exactly 3 stat items. Each composed via InlineStats atom.
   * iconColor defaults to 'periwinkle' — canonical V0_lite KeyStats colour.
   */
  stats: [StatPairRowItem, StatPairRowItem, StatPairRowItem];

  /**
   * Additional className on the root grid container.
   * Use to override grid gap or top padding per context.
   */
  className?: string;
}

/**
 * StatPairRow
 *
 * Responsive 3-col stat grid with canonical spacing.
 * grid-cols-3 · gap-3 sm:gap-6 · pt-6 sm:pt-8
 */
export function StatPairRow({ stats, className }: StatPairRowProps) {
  return (
    <div
      data-component="StatPairRow"
      className={cn(
        'grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8',
        className
      )}
    >
      {stats.map((stat, idx) => (
        <InlineStats
          key={idx}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          iconColor={stat.iconColor ?? 'periwinkle'}
          iconSize={stat.iconSize}
          orientation={stat.orientation ?? 'vertical'}
        />
      ))}
    </div>
  );
}
