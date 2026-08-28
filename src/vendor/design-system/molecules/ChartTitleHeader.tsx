/**
 * ChartTitleHeader — Molecule
 *
 * WHAT: Chart block header row composing title text + optional subtitle +
 *       optional legend items (colour dot + label pairs) + optional info tooltip trigger.
 *       Renders above a chart body inside a Card.
 *
 * WHY: V0.2 chart-title-header.tsx (projects/V0.2 -for design system/src/app/components/ui/chart-title-header.tsx)
 *      uses CardTitle + legend items. Ported to DS to decouple from shadcn Card internals
 *      and apply token-based typography instead of hardcoded font-family/text-size classes.
 *      Every data chart in the V1 PDP uses the same title+subtitle+legend pattern —
 *      centralising prevents drift in font, colour, and legend dot scaling.
 *
 * WHEN: Top of any chart block (MarketAnalysis, RegionalComparison, MarketOverview charts).
 *       Inside Card with padding="lg".
 *
 * WHEN NOT: Do NOT use as a page/section heading — use LabelHeadingPair.
 *           Do NOT use for non-chart cards — use CardHeader or LabelHeadingPair.
 *
 * WHERE: MarketAnalysis organism · RegionalComparison organism · MarketOverview organism ·
 *        any chart card in report PDP.
 *
 * HOW:
 * ```tsx
 * <ChartTitleHeader
 *   title="AI in Healthcare Market Size"
 *   subtitle="Revenue by Segment 2020–2030 (USD Billion)"
 *   legendItems={[
 *     { color: 'purple-500', label: 'North America' },
 *     { color: 'periwinkle-400', label: 'Asia Pacific' },
 *     { color: 'coral-400', label: 'Europe' },
 *   ]}
 * />
 *
 * // With info icon
 * <ChartTitleHeader
 *   title="Market Share by Company"
 *   info="Data sourced from Q4 2023 filings"
 * />
 * ```
 *
 * A11y: Heading is a <p role="heading" aria-level="3"> inside a card context —
 *       avoids double-heading if parent card is inside a section with an h2.
 *       Info icon button: aria-label, role="button", keyboard-accessible.
 *
 * @tier molecule
 * @canonical-source projects/V0.2 -for design system/src/app/components/ui/chart-title-header.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */

import { Info } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ChartLegendItem {
  /**
   * CSS custom property name for the legend dot colour.
   * Pass the token name without `var(--...)` wrapper.
   * Example: 'purple-500', 'coral-400', 'periwinkle-400'.
   */
  color: string;
  /** Legend label text. */
  label: string;
}

export interface ChartTitleHeaderProps {
  /** Chart title — rendered as a heading-level element. */
  title: string;
  /** Optional subtitle / data description below the title. */
  subtitle?: string;
  /** Optional legend items — colour dot + label pairs. */
  legendItems?: ChartLegendItem[];
  /**
   * Optional info tooltip content.
   * When provided, shows an Info icon button on the right side.
   * Currently renders as a title attribute — full Tooltip atom integration
   * deferred to organism layer.
   */
  info?: string;
  /** Additional className on the root wrapper. */
  className?: string;
}

/**
 * ChartTitleHeader
 *
 * Chart block header: title + optional subtitle + optional legend row + optional info.
 */
export function ChartTitleHeader({
  title,
  subtitle,
  legendItems,
  info,
  className,
}: ChartTitleHeaderProps) {
  return (
    <div
      data-component="ChartTitleHeader"
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
    >
      {/* Title + subtitle + legend (left column) */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Title */}
        <p
          role="heading"
          aria-level={3}
          className="font-sans font-medium truncate"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--black-900)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {title}
        </p>

        {/* Optional subtitle */}
        {subtitle && (
          <p
            className="font-sans"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--black-500)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Optional legend items */}
        {legendItems && legendItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {legendItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:scale-125"
                  style={{ backgroundColor: `var(--${item.color})` }}
                  aria-hidden="true"
                />
                <span
                  className="font-sans transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--black-900)]"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--black-500)',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional info icon (right side) */}
      {info && (
        <button
          type="button"
          className="flex-shrink-0 p-1 rounded transition-colors duration-[var(--duration-fast)] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/20"
          style={{ borderRadius: 'var(--radius-xs)', marginTop: '2px' }}
          aria-label={`Chart information: ${info}`}
          title={info}
        >
          <Info
            className="h-4 w-4"
            style={{ color: 'var(--black-400)' }}
            aria-hidden="true"
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  );
}
