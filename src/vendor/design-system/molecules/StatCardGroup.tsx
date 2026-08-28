/**
 * StatCardGroup
 *
 * WHAT · Responsive stat display group: desktop shows inline divider-separated stats;
 *        mobile shows a 2-column grid. Pure display — no icons, no animation.
 *        Value is prominent, label is muted below.
 *
 * WHY · MarketOverview and SummarySection organisms need a responsive stat strip
 *       (e.g., "8.5% GCC Market Share · 6.0% Qatar CAGR · 4th Regional Ranking").
 *       V0.2 StatCardGroup composed V0.2's StatCard which has an incompatible API
 *       with core-v2's cinematic StatCard. This molecule provides the same responsive
 *       layout contract without depending on the cinema variant.
 *
 * WHEN · Market-overview stat strips. Report PDP summary stats (non-animated).
 *        Any section needing 2-4 stats displayed inline with responsive fallback.
 *
 * WHEN NOT · Animated count-up stats → use core-v2 StatCard molecule. Icon-led tiles →
 *            use StatCard (cinema) or IconBox + StatPair combo. Single stat → use StatPair.
 *
 * WHERE · core-v2/src/molecules/StatCardGroup.tsx
 *         Consumed by: MarketOverview · SummarySection organisms
 *
 * HOW · Desktop: `hidden md:flex` row with `--black-300` divider between items.
 *       Mobile: `grid grid-cols-2` fallback. Token-only. No motion.
 *       `tabular-nums` on values for numeric alignment.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/stat-card-group.tsx
 *                   V0.2 StatCard (composed here) at .../stat-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 StatCard hardcoded hex `#171717` → `--black-900`
 *   V0.2 StatCard hardcoded `#737373` → `--black-500`
 *   V0.2 StatCard `text-[26px]` (xl size) → `--text-lg` (25px · closest)
 *   V0.2 StatCard `text-[22px]` (lg size) → `--text-base` (20px · close)
 *   V0.2 StatCard `text-[14px]` → `--text-compact`
 *   V0.2 `bg-warm-200` in StatCard icon-left → fixed to `bg-[var(--warm-200)]`
 *   V0.2 inline divider `bg-[#d4d4d4]` → `var(--black-300)`
 *   NOTE: V0.2 StatCardGroup used StatCard `variant="inline"` (desktop) and
 *         `variant="centered"` (mobile). Ports both as self-contained inline layouts.
 */

import { cn } from '../lib/cn';

export interface StatCardGroupItem {
  /** Prominent value string (e.g., "8.5%", "$150M", "4th") */
  value: string;
  /** Descriptive label */
  label: string;
}

export interface StatCardGroupProps {
  /** 2–6 stat items */
  stats: StatCardGroupItem[];
  /** Additional classes for both desktop and mobile wrappers */
  className?: string;
}

export function StatCardGroup({ stats, className = '' }: StatCardGroupProps) {
  return (
    <>
      {/* Desktop: inline row with dividers */}
      <div
        className={cn('hidden md:flex items-baseline gap-8', className)}
        role="list"
        aria-label="Key statistics"
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            role="listitem"
            className="flex items-baseline gap-8"
          >
            <div className="flex flex-col">
              <p
                className="tabular-nums font-bold tracking-tight"
                style={{
                  fontSize: 'var(--text-lg)',
                  color: 'var(--black-900)',
                  lineHeight: 'var(--leading-tight)',
                }}
              >
                {stat.value}
              </p>
              <p
                className="mt-1"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--black-500)',
                }}
              >
                {stat.label}
              </p>
            </div>

            {/* Divider between items */}
            {idx < stats.length - 1 && (
              <div
                aria-hidden="true"
                className="w-px h-8 self-center"
                style={{ backgroundColor: 'var(--black-300)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: 2-column grid */}
      <div
        className={cn('grid grid-cols-2 gap-x-8 gap-y-6 md:hidden', className)}
        role="list"
        aria-label="Key statistics"
      >
        {stats.map((stat, idx) => (
          <div key={idx} role="listitem" className="text-center">
            <p
              className="tabular-nums font-bold"
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--black-900)',
                lineHeight: 'var(--leading-tight)',
              }}
            >
              {stat.value}
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: 'var(--text-compact)',
                color: 'var(--black-500)',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
