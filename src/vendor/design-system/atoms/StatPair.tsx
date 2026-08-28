/**
 * StatPair — Atom
 *
 * WHAT: Label-value pair for key metrics. Value is large tabular-nums; label is small muted text.
 *       Supports vertical (label-on-top OR value-on-top) and horizontal layouts.
 *
 * WHY: Recurring pattern across KeyStats strip, report hero metadata, and chart callouts.
 *      Centralising locks: tabular-nums on value · muted label colour · weight/size ratio.
 *      Without atom, each consumer invents its own font-size/spacing — drift risk.
 *
 * WHEN: Stat callouts with a single value + label (market size, CAGR, country count).
 *       Use alone or compose into StatPairRow molecule (3-col stat strip).
 *
 * WHEN NOT: For multi-stat strips → use StatPairRow molecule.
 *           For badge-style trend indicators → use StatBadge.
 *
 * WHERE: KeyStatsStrip organism · report hero metadata strip · chart summary callouts.
 *
 * HOW:
 * ```tsx
 * // Vertical — value above label (default)
 * <StatPair value="$45.2B" label="Market Size 2024" />
 *
 * // Vertical — label above value
 * <StatPair value="32.5%" label="CAGR 2024–2030" orientation="vertical-label-first" />
 *
 * // Horizontal — value left of label
 * <StatPair value="50+" label="Countries Covered" orientation="horizontal" />
 * ```
 *
 * A11y: <dl><dt><dd> semantic pairing for assistive technology.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx (StatItem pattern)
 * @portedDate 2026-05-19 · Batch 3.1b · aura-builder
 */

export interface StatPairProps {
  /**
   * The metric value string (e.g. "$45.2B", "32.5%", "50+").
   * Rendered large, semibold, tabular-nums.
   */
  value: string;

  /**
   * Descriptor label for the value (e.g. "Market Size 2024").
   * Rendered small, muted.
   */
  label: string;

  /**
   * Layout orientation.
   * - `'vertical'` — value on top, label below (default). Used in KeyStatsStrip.
   * - `'vertical-label-first'` — label on top, value below. Used in metadata strips.
   * - `'horizontal'` — value left, label right. Used in compact inline contexts.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'vertical-label-first' | 'horizontal';

  /** Tailwind utility overrides on the root element. */
  className?: string;
}

export function StatPair({
  value,
  label,
  orientation = 'vertical',
  className = '',
}: StatPairProps) {
  const isHorizontal = orientation === 'horizontal';
  const isLabelFirst = orientation === 'vertical-label-first';

  const valueEl = (
    <dd
      style={{
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-weight-semibold)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 'var(--leading-tight)',
        letterSpacing: 'var(--tracking-tight)',
        color: 'var(--black-900)',
      }}
    >
      {value}
    </dd>
  );

  const labelEl = (
    <dt
      style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: 'var(--leading-stat-label)',
        color: 'var(--black-500)',
      }}
    >
      {label}
    </dt>
  );

  return (
    <dl
      data-component="StatPair"
      data-orientation={orientation}
      className={`${isHorizontal ? 'flex items-baseline gap-2' : 'flex flex-col gap-1'} ${className}`}
    >
      {isLabelFirst ? (
        <>
          {labelEl}
          {valueEl}
        </>
      ) : (
        <>
          {valueEl}
          {labelEl}
        </>
      )}
    </dl>
  );
}
