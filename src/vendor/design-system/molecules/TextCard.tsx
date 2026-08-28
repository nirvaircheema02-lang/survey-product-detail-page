/**
 * TextCard
 *
 * WHAT · Card with optional icon container, title (h3), paragraph content, and an
 *        optional bottom stats grid. The header area is visually separated from the
 *        content area. Children prop replaces paragraphs for chart/table embeds.
 *
 * WHY · RegionalComparison organism needs a uniform card wrapper for both the chart
 *       column and the table column. Outlooks and Summaries sections also use this
 *       pattern. Without a shared molecule the border/radius/shadow are inconsistent
 *       across V0.2 organisms.
 *
 * WHEN · Chart or table wrapper inside RegionalComparison. Text-heavy summary cards
 *        in FutureOutlook and HistoricalPerformance sections. Any content block needing
 *        a titled card with bottom stat row.
 *
 * WHEN NOT · Icon-led feature cards → use IconCard. Analysis numbered cards → use
 *            AnalysisCard. Pure stat tiles → use StatCard.
 *
 * WHERE · core-v2/src/molecules/TextCard.tsx
 *         Consumed by: RegionalComparison · FutureOutlookSection organisms
 *
 * HOW · All text uses DM Sans (font-family-body token). h3 uses DM Sans per V0.2 rule
 *       ("Noto Serif reserved for h1-h6 page headings only inside this component").
 *       Token-only sizing. Stats grid uses `tabular-nums` for numeric alignment.
 *       No motion (card is container-level, entrance handled by parent organism).
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/text-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[var(--radius-md)]` (10px in V0.2) → `--radius-sm` (10px in core-v2)
 *   V0.2 hardcoded `text-[26px]` stat value → `--text-lg` (25px · closest core-v2 token)
 *   V0.2 hardcoded `text-[14px]` stat label → `--text-compact` (14px)
 *   V0.2 `text-base leading-relaxed` paragraphs → `--text-sm` + `--leading-relaxed`
 *   V0.2 `var(--shadow-brand-periwinkle)` → kept as token ref (exists in base.css)
 */

import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TextCardStat {
  /** Numeric or string value to display prominently (e.g., "6.0%", "$213 Mn") */
  value: string | number;
  /** Descriptive label below the value */
  label: string;
  /** Highlight value with `--purple-500`. @default false */
  isPrimary?: boolean;
}

export interface TextCardProps {
  /** Card heading (rendered as h3, DM Sans per V0.2 DS rule) */
  title: string;
  /**
   * Array of paragraph text strings.
   * Ignored when `children` is provided.
   */
  paragraphs?: string[];
  /**
   * Optional icon element rendered in a `--purple-100` container before the title.
   * Typically a Phosphor or Lucide icon.
   */
  icon?: ReactNode;
  /** Optional statistics to render in a 2-col grid at the bottom of the card. */
  stats?: TextCardStat[];
  /**
   * Custom content that replaces the `paragraphs` prop.
   * Use this to embed charts or tables inside the card body.
   */
  children?: ReactNode;
  /** Additional classes for the root element. */
  className?: string;
}

export function TextCard({
  title,
  paragraphs = [],
  icon,
  stats,
  children,
  className,
}: TextCardProps) {
  return (
    <div
      className={cn(
        'border transition-all duration-300',
        'hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
      style={{
        borderColor: 'var(--black-200)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        {icon && (
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--purple-100)',
              }}
            >
              {icon}
            </div>
          </div>
        )}

        <h3
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--black-900)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 pb-6">
        {children ?? (
          <>
            {paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={cn(
                  idx < paragraphs.length - 1 && 'mb-4',
                  idx === paragraphs.length - 1 && stats && 'mb-6',
                )}
                style={{
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--black-600)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </>
        )}

        {/* Stats grid */}
        {stats && stats.length > 0 && (
          <div
            className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t"
            style={{ borderColor: 'var(--black-200)' }}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p
                  className="tabular-nums font-bold"
                  style={{
                    fontSize: 'var(--text-lg)',
                    color: stat.isPrimary ? 'var(--purple-500)' : 'var(--black-900)',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: 'var(--text-compact)',
                    color: 'var(--black-600)',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
