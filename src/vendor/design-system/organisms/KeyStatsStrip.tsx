/**
 * KeyStatsStrip
 *
 * WHAT:
 * Full-width section strip displaying 1–4 key market metrics (stat pairs).
 * Each stat has an optional icon box, an animated counter value, and a label.
 * Background is a tinted gradient (`--bg-section-stats-tinted`) separating it
 * visually from surrounding white sections. Stats animate from 0 → target when
 * the section scrolls into view (IntersectionObserver via `useAnimatedCounter`).
 *
 * WHY:
 * Stat strips convert the abstract "why buy this report" question into concrete
 * quantitative answers before the user decides to scroll further. Serial-position
 * effect: key numbers placed high in a section are remembered better than buried
 * inline figures. The counter animation draws attention to the values on reveal —
 * motion-as-signal (not decoration).
 *
 * WHEN:
 * - Directly below HeroSection on a report PDP — primary signal row.
 * - Market-sizing section opener (3 stats: market size / CAGR / coverage).
 * - Any section needing a 1–4 metric highlight row.
 *
 * WHEN NOT:
 * - Inside a card (use InlineStats molecule instead).
 * - More than 4 stats (becomes visually cluttered — split into two strips or use a table).
 *
 * WHERE:
 * - V1 product-page PDP (report PDP) — directly below HeroSection.
 * - `projects/V0_lite_report-legacy/src/app/components/KeyStats.tsx:132-156` (canonical).
 *
 * HOW:
 * ```tsx
 * import { KeyStatsStrip } from '@kenresearch/design-system/organisms';
 *
 * <KeyStatsStrip
 *   stats={[
 *     { id: 'market-size', label: 'Market Size 2024',   value: 45, suffix: 'B', prefix: '$', icon: BarChart3, duration: 1800 },
 *     { id: 'cagr',        label: 'CAGR 2024–2030',     value: 32, suffix: '%', prefix: '',  icon: TrendingUp, duration: 1800 },
 *     { id: 'countries',   label: 'Countries Covered',  value: 50, suffix: '+', prefix: '',  icon: Globe,      duration: 1800 },
 *   ]}
 * />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report-legacy/src/app/components/KeyStats.tsx:132-156
 */
'use client';

import type { LucideIcon } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single stat item to display in the strip. */
export interface StatItem {
  /** Unique key for React list rendering. */
  id: string;
  /**
   * Label below or above the value.
   * @example "Market Size 2024" · "CAGR 2024–2030" · "Countries Covered"
   */
  label: string;
  /**
   * Numeric value to animate to. The display value uses prefix + animated count + suffix.
   * For fractional display (e.g. "$45.0B"), encode as integer * 10 and use `divisor: 10`.
   * @example 450 (to display "$45.0B" with divisor=10)
   */
  value: number;
  /**
   * Text appended to the animated value.
   * @example "B" · "%" · "+" · "K"
   */
  suffix?: string;
  /**
   * Text prepended to the animated value.
   * @example "$" · "~"
   */
  prefix?: string;
  /**
   * Divide the animated count by this value for display. Useful for decimal display.
   * @example divisor=10: `450 → "45.0"`; divisor=1: `32 → "32"`
   * @default 1
   */
  divisor?: number;
  /**
   * Optional Lucide icon rendered in an icon box above the value.
   */
  icon?: LucideIcon;
  /**
   * Icon box background colour (uses DS `--` token or CSS colour).
   * @default "rgba(128, 108, 224, 0.1)" (content-icon/10)
   */
  iconBoxBg?: string;
  /**
   * Icon colour.
   * @default "var(--icon-content)"
   */
  iconColor?: string;
  /**
   * Animation duration in ms.
   * @default 1800
   */
  duration?: number;
}

export interface KeyStatsStripProps {
  /**
   * Array of 1–4 stat items.
   * // TODO: replace w/ real API — `GET /api/reports/{slug}/key-stats`
   */
  stats: StatItem[];
  /** Optional className on the root `<section>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Internal StatCell
// ---------------------------------------------------------------------------

function StatCell({ stat, prefersReducedMotion }: { stat: StatItem; prefersReducedMotion: boolean | null }) {
  const divisor = stat.divisor ?? 1;
  const duration = stat.duration ?? 1800;
  // Skip animation when reduced-motion; pass target directly
  const animTarget = prefersReducedMotion ? stat.value : stat.value;
  const { count, ref } = useAnimatedCounter(animTarget, duration);

  const displayCount = prefersReducedMotion ? stat.value : count;

  const displayValue = (() => {
    if (divisor !== 1) {
      const divided = displayCount / divisor;
      return `${stat.prefix ?? ''}${divided.toFixed(1)}${stat.suffix ?? ''}`;
    }
    return `${stat.prefix ?? ''}${displayCount}${stat.suffix ?? ''}`;
  })();

  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className="flex flex-col items-start gap-2"
      aria-label={`${stat.label}: ${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`}
    >
      {/* Icon box — optional */}
      {Icon && (
        <div
          aria-hidden="true"
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: stat.iconBoxBg ?? 'rgba(128, 108, 224, 0.1)',
          }}
        >
          <Icon
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: stat.iconColor ?? 'var(--icon-content)',
            }}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Value — tabular-nums for visual stability during animation */}
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--text-xl)',
          lineHeight: '1.2',
          color: 'var(--black-900)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        {displayValue}
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          lineHeight: '1.5',
          color: 'var(--icon-utility)',
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KeyStatsStrip({ stats, className }: KeyStatsStripProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      data-component="KeyStatsStrip"
      className={`py-10 md:py-14${className ? ` ${className}` : ''}`}
      style={{
        background: 'var(--bg-section-stats-tinted)',
      }}
    >
      {/* Container — page-width max */}
      <div
        style={{
          maxWidth: 'var(--container-page)',
          margin: '0 auto',
          paddingLeft: 'var(--padding-mobile)',
          paddingRight: 'var(--padding-mobile)',
        }}
        className="sm:px-6 md:px-8"
      >
        <dl
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16"
          aria-label="Key market statistics"
        >
          {stats.map((stat) => (
            <StatCell key={stat.id} stat={stat} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </dl>
      </div>
    </section>
  );
}
