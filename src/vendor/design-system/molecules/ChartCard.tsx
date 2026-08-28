/**
 * ChartCard — Molecule
 *
 * WHY · Every chart on the PDP (Market Size, Forecast, Segmentation, etc.) needs
 *       an identical anatomy frame: eyebrow → title → insight → controls →
 *       chart body → dataset preview → source provenance → access-gated CTAs.
 *       Without this wrapper, every chart section drifts on padding, access logic,
 *       and CTA hierarchy. Promoting to core-v2 day-1 per DECISIONS D1 so the
 *       pattern is portable (report-store, case-study future consumers).
 *
 * WHAT · Molecule that composes: SectionLabel (eyebrow) · h3 serif title ·
 *        italic insight · optional controls slot · any Ken Charts child (body slot) ·
 *        CollapsibleSection (dataset preview) · source note · paywall overlay when
 *        accessLevel='paid'|'lead' · meter pill when accessLevel='metered' ·
 *        primary + secondary Button CTAs.
 *
 * WHEN · Wrapping HistoricalProjectedAreaChart, AreaChart, LineChart, BarChart, etc.
 *        in Market Size, Forecast, Submarket, Segmentation, Macro sections.
 *
 * WHEN NOT · Stat callout blocks → StatCard · card listing → ReportCard ·
 *            standalone prose charts w/ no access layer → raw Ken Charts + SectionHeading.
 *
 * WHERE · v1-product-page-ver0.2 Sections 14, 15, 16, 23, 25.
 *         Also: report-store-v07 (when promoted to 2nd consumer).
 *
 * HOW ·
 * ```tsx
 * // Light variant · public access
 * <ChartCard
 *   eyebrow="MARKET SIZE"
 *   title="Australia Cold Chain Logistics Market Size, 2022–2027"
 *   insight="Market expected to maintain 8.2% CAGR driven by pharmaceutical and e-commerce demand."
 *   source="Ken Research Primary Analysis, 2023"
 *   methodologyHref="/methodology"
 *   accessLevel="public"
 *   primaryCta={{ label: 'Download Sample Report', onClick: () => {} }}
 *   secondaryCta={{ label: 'Talk to Analyst', onClick: () => {} }}
 * >
 *   <HistoricalProjectedAreaChart
 *     labels={['2022', '2023', '2024', '2025e', '2026e', '2027e']}
 *     series={[{ name: 'Market Size', data: [4.2, 4.6, 5.0, 5.4, 5.9, 6.4], isProjected: false }]}
 *     yAxisTitle="USD Billion"
 *     projectionStartIndex={3}
 *   />
 * </ChartCard>
 *
 * // Metered variant — shows unlock meter
 * <ChartCard
 *   eyebrow="SUBMARKET"
 *   title="Temperature-Controlled Warehousing Segment"
 *   insight="Segment accounts for 42% of total market value in 2023."
 *   source="Ken Research, 2023"
 *   accessLevel="metered"
 *   meterUsed={3}
 *   meterTotal={10}
 *   variant="light"
 * >
 *   <BarChart labels={['2022', '2023']} data={[1.8, 2.1]} />
 * </ChartCard>
 * ```
 *
 * ANIMATION STACK · Framer Motion FadeInSection for entrance · no GSAP.
 * Reduced motion: FadeInSection skips animation when prefers-reduced-motion set.
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom v1-product-page-ver0.2 (day-1 core-v2 promotion per DECISIONS D1)
 * @portedDate 2026-05-18 — Sprint 1 Foundation
 */
'use client';

import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '../lib/cn';
import { SectionLabel } from '../atoms/SectionLabel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { CollapsibleSection } from '../atoms/CollapsibleSection';
import { FadeInSection } from '../atoms/FadeInSection';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChartCardAccessLevel = 'public' | 'metered' | 'lead' | 'paid';
export type ChartCardVariant = 'light' | 'dark';

export interface ChartCardProps {
  /** Section eyebrow above title · e.g. "MARKET SIZE" */
  eyebrow?: string;
  /** Chart title · rendered as H3 serif */
  title: string;
  /** One-line analyst insight shown beneath title · italic muted */
  insight?: string;
  /** Source note shown above CTAs */
  source?: string;
  /** Methodology link href */
  methodologyHref?: string;
  /**
   * Access level — governs lock pill + paywall overlay.
   * public   → full chart, no lock UI, CTAs for cross-sell.
   * metered  → meter pill shown top-right, chart visible.
   * lead     → paywall overlay, primary CTA = "Unlock Full Dataset".
   * paid     → full chart, all rows, no lock UI.
   */
  accessLevel?: ChartCardAccessLevel;
  /** Meter state · shown when accessLevel='metered'. meterUsed / meterTotal. */
  meterUsed?: number;
  meterTotal?: number;
  /**
   * Surface variant.
   * light (default) → bg --bg-pure-white · --shadow-md rest → --shadow-lg hover.
   * dark            → bg --variant-cinematic-bg-surface · on-dark text tokens.
   */
  variant?: ChartCardVariant;
  /** Chart body slot — pass any Ken Charts component here. */
  children: ReactNode;
  /** Interactive controls slot — above chart body — row of toggles / filters. */
  controls?: ReactNode;
  /** Dataset preview slot — rendered inside CollapsibleSection below chart. */
  datasetPreview?: ReactNode;
  /** Primary CTA · default "Download Sample Report" */
  primaryCta?: { label: string; onClick: () => void };
  /** Secondary CTA · default "Talk to Analyst" */
  secondaryCta?: { label: string; onClick: () => void };
  /** Optional className passthrough */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ChartCard — standard chart anatomy frame for every data chart in the PDP.
 * Composes SectionLabel · h3 title · insight · controls · chart body ·
 * dataset preview · source note · access gating · CTAs.
 */
export function ChartCard({
  eyebrow,
  title,
  insight,
  source,
  methodologyHref,
  accessLevel = 'public',
  meterUsed,
  meterTotal = 10,
  variant = 'light',
  children,
  controls,
  datasetPreview,
  primaryCta,
  secondaryCta,
  className,
}: ChartCardProps) {
  const isLocked = accessLevel === 'paid' || accessLevel === 'lead';
  const isMetered = accessLevel === 'metered';
  const isDark = variant === 'dark';

  // Default CTAs per Q9 (PHASE-2-PROPOSAL D9)
  const resolvedPrimary = primaryCta ?? {
    label: accessLevel === 'lead' ? 'Unlock Full Dataset' : 'Download Sample Report',
    onClick: () => {},
  };
  const resolvedSecondary = secondaryCta ?? { label: 'Talk to Analyst', onClick: () => {} };

  return (
    <FadeInSection direction="up">
      <div
        data-component="ChartCard"
        className={cn(
          'relative rounded-[var(--radius-card)] border transition-shadow duration-300',
          // Variant surface tokens
          isDark
            ? [
                'bg-[var(--variant-cinematic-bg-surface)]',
                'border-[var(--semantic-hairline-on-dark-soft)]',
                'text-[var(--semantic-ink-on-dark-strong)]',
              ]
            : [
                'bg-[var(--color-foundation-white)]',
                'border-[var(--border-soft)]',
                'shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]',
              ],
          className,
        )}
      >
        {/* ── Card header ── */}
        <div
          className="flex items-start justify-between gap-4"
          style={{ padding: 'var(--space-xl) var(--space-xl) 0' }}
        >
          {/* Left: eyebrow + title + insight */}
          <div className="flex-1 min-w-0">
            {eyebrow && (
              <div style={{ marginBottom: 'var(--pair-label-heading)' }}>
                <SectionLabel
                  variant="accent"
                  background={isDark ? 'dark' : 'light'}
                >
                  {eyebrow}
                </SectionLabel>
              </div>
            )}

            <h3
              className={cn(
                'font-[var(--typography-family-display)] font-[300] tracking-[var(--tracking-tight)]',
                isDark
                  ? 'text-[var(--semantic-ink-on-dark-strong)]'
                  : 'text-[var(--semantic-ink-strong)]',
              )}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                lineHeight: 'var(--leading-snug)',
                marginBottom: insight ? 'var(--pair-heading-description)' : 0,
              }}
            >
              {title}
            </h3>

            {insight && (
              <p
                className={cn(
                  'italic',
                  isDark
                    ? 'text-[var(--semantic-ink-on-dark-muted)]'
                    : 'text-[var(--semantic-ink-muted)]',
                )}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-nav)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                {insight}
              </p>
            )}
          </div>

          {/* Right: meter pill */}
          {isMetered && meterUsed !== undefined && (
            <div
              aria-live="polite"
              aria-atomic="true"
            >
              <Badge
                variant="pill"
                theme="neutral"
                size="sm"
              >
                {meterUsed}/{meterTotal} unlocks used
              </Badge>
            </div>
          )}
        </div>

        {/* ── Controls row ── */}
        {controls && (
          <div
            className="flex flex-wrap items-center gap-2"
            style={{ padding: 'var(--space-sm) var(--space-xl) 0' }}
          >
            {controls}
          </div>
        )}

        {/* ── Chart body ── */}
        <div
          style={{ padding: 'var(--space-md) var(--space-xl)' }}
        >
          <div
            className="relative rounded-[var(--radius-sm)] overflow-hidden"
            role="img"
            aria-label={title}
          >
            {children}

            {/* Paywall overlay for locked access */}
            {isLocked && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-sm)]"
                style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.7)' }}
                aria-label="Content locked — unlock required"
              >
                <div
                  className="flex flex-col items-center gap-3 text-center"
                  style={{ padding: 'var(--space-lg)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-foundation-white)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <Lock
                      size={18}
                      className="text-[var(--semantic-ink-muted)]"
                      aria-hidden="true"
                    />
                  </div>
                  <p
                    className="text-[var(--semantic-ink-body)] font-[500]"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-nav)' }}
                  >
                    {accessLevel === 'lead'
                      ? 'Share your details to unlock full dataset access'
                      : 'Paid access required for this dataset'}
                  </p>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={resolvedPrimary.onClick}
                  >
                    {resolvedPrimary.label}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Dataset preview (collapsible) ── */}
        {datasetPreview && (
          <div style={{ padding: '0 var(--space-xl)' }}>
            <CollapsibleSection
              title="Dataset Preview"
              defaultOpen={false}
            >
              {datasetPreview}
            </CollapsibleSection>
          </div>
        )}

        {/* ── Footer: source + CTAs ── */}
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
            'border-t',
            isDark
              ? 'border-[var(--semantic-hairline-on-dark-soft)]'
              : 'border-[var(--border-soft)]',
          )}
          style={{ padding: 'var(--space-md) var(--space-xl)' }}
        >
          {/* Source note */}
          <div className="flex flex-col gap-0.5">
            {source && (
              <p
                className={cn(
                  isDark
                    ? 'text-[var(--semantic-ink-on-dark-subtle)]'
                    : 'text-[var(--semantic-ink-subtle)]',
                )}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)' }}
              >
                Source: {source}
              </p>
            )}
            {methodologyHref && (
              <a
                href={methodologyHref}
                className={cn(
                  'underline underline-offset-2 transition-opacity hover:opacity-80',
                  isDark
                    ? 'text-[var(--semantic-ink-on-dark-muted)]'
                    : 'text-[var(--semantic-ink-muted)]',
                )}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Methodology
              </a>
            )}
          </div>

          {/* CTAs — hidden when chart is locked (overlay shows CTA instead) */}
          {!isLocked && (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                variant="brand"
                size="sm"
                onClick={resolvedPrimary.onClick}
              >
                {resolvedPrimary.label}
              </Button>
              <Button
                variant={isDark ? 'ghost' : 'secondary'}
                background={isDark ? 'dark' : 'light'}
                size="sm"
                onClick={resolvedSecondary.onClick}
              >
                {resolvedSecondary.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </FadeInSection>
  );
}
