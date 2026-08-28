/**
 * StatBadge — Atom
 *
 * WHAT: Mini pill badge for trend/change/count callouts within report highlight cards.
 *       Compact `px-2.5 py-1` pill, icon + value + label, 4 semantic variants.
 *
 * WHY: ReportHighlights cards (V0_lite) show a stat badge (e.g. "+316% Growth") alongside
 *      the card icon box. Without a central atom, each card invents its own badge styling.
 *      Centralising locks: radius · spacing · icon size · variant colours.
 *
 * WHEN: Metric callout badges inside highlight cards, stat strips, or data summaries.
 *       Use when a stat needs secondary metadata context (trend direction, category count).
 *
 * WHEN NOT: For primary stat display → use StatPair.
 *           For status/category labelling → use Badge.
 *           Never use brand-red variant for non-CTA contexts.
 *
 * WHERE: ReportHighlights organism · KeyStatsStrip organism · DataChartTemplate.
 *
 * HOW:
 * ```tsx
 * import { TrendingUp } from 'lucide-react';
 *
 * // Trend — green positive indicator
 * <StatBadge variant="trend" value="+316%" label="Growth" />
 *
 * // Change — rose/red negative indicator
 * <StatBadge variant="change" value="-12%" label="Decline" />
 *
 * // Count — neutral dark
 * <StatBadge variant="neutral" value="50+" label="Countries" />
 *
 * // With leading icon
 * <StatBadge variant="trend" value="32.5%" label="CAGR" icon={TrendingUp} />
 * ```
 *
 * A11y: Inline span — aria context comes from surrounding heading/paragraph.
 *       When standalone, wrap in <span aria-label="trend: +316% Growth">.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/ReportHighlights.tsx:65 (badge pattern)
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

import type { LucideIcon } from 'lucide-react';

export type StatBadgeVariant = 'trend' | 'change' | 'neutral' | 'emphasis';

export interface StatBadgeProps {
  /**
   * Semantic variant controlling background/text colour.
   * - `'trend'` — positive growth (green tint).
   * - `'change'` — negative/risk (rose tint).
   * - `'neutral'` — generic count (warm grey tint).
   * - `'emphasis'` — purple-tinted data accent (chart callout contexts).
   */
  variant?: StatBadgeVariant;

  /** Primary value string (e.g. "+316%", "50+", "6"). */
  value: string;

  /** Secondary descriptor label (e.g. "Growth", "Countries"). */
  label: string;

  /** Optional leading Lucide icon. Sized to 14×14. */
  icon?: LucideIcon;

  /** Tailwind utility overrides on the root span. */
  className?: string;
}

const variantStyles: Record<StatBadgeVariant, { bg: string; valueFg: string; labelFg: string }> = {
  trend: {
    bg: 'rgba(5, 150, 105, 0.08)',
    valueFg: 'var(--green-700)',
    labelFg: 'var(--green-600)',
  },
  change: {
    bg: 'rgba(225, 29, 72, 0.08)',
    valueFg: 'var(--rose-600)',
    labelFg: 'var(--rose-600)',
  },
  neutral: {
    bg: 'rgba(0, 0, 0, 0.04)',
    valueFg: 'var(--black-900)',
    labelFg: 'var(--black-500)',
  },
  emphasis: {
    bg: 'rgba(148, 136, 236, 0.1)',
    valueFg: 'var(--purple-600)',
    labelFg: 'var(--purple-500)',
  },
};

export function StatBadge({
  variant = 'neutral',
  value,
  label,
  icon: Icon,
  className = '',
}: StatBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      data-component="StatBadge"
      data-variant={variant}
      className={`inline-flex items-center gap-1 ${className}`}
      style={{
        backgroundColor: styles.bg,
        paddingInline: 'var(--space-2-5, 0.625rem)',
        paddingBlock: 'var(--space-1)',
        borderRadius: 'var(--radius-xs)',
        fontSize: 'var(--text-xs)',
        lineHeight: 'var(--leading-stat-label)',
      }}
    >
      {Icon && (
        <Icon
          style={{ width: 14, height: 14, color: styles.valueFg, flexShrink: 0 }}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      <span
        style={{
          fontWeight: 'var(--font-weight-semibold)',
          color: styles.valueFg,
        }}
      >
        {value}
      </span>
      <span style={{ color: styles.labelFg }}>
        {label}
      </span>
    </span>
  );
}
