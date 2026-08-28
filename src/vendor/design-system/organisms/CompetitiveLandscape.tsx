/**
 * CompetitiveLandscape
 *
 * WHAT · Competitive landscape organism for report PDPs. Top row: 3 summary cards
 *        (market share chart slot · top players list · market dynamics bars).
 *        Below: sortable competitors table with paywall overlay on sensitive columns.
 *        Below that: cross-comparison parameter grid (ComparisonParameterCard × N).
 *        Footer: gradient analysis inclusions card (AnalysisCard × N).
 *        Dot-pattern bg texture from --pattern-* tokens.
 *
 * WHY · Competitive analysis is the highest-value section of a market report. Blurring
 *       company share data drives lead capture. The 3-card summary + table + parameters
 *       pattern mirrors Bloomberg/Euromonitor report structure — familiar to analyst buyers.
 *       Paywall on share/est/type columns uses pointer-events-none blur to preview data
 *       without leaking it (Law of Scarcity + loss aversion for conversion).
 *
 * WHEN · Report PDP "Competitive Landscape" chapter. Any chapter comparing named entities
 *        with market share, founding date, type, and focus area.
 *
 * WHEN NOT · Do not use for unnamed/generic segments — use SegmentationSection.
 *            Do not use where no paywall is needed — Table atom is simpler.
 *
 * WHERE · core-v2/src/organisms/CompetitiveLandscape.tsx
 *         Consumer: V0.2 report PDP
 *
 * HOW · `companies` typed as `CompetitorEntry[]`. `chartSlot` accepts any chart node
 *       (ChartCard or raw chart component). `comparisonParams` and `analysisItems` are
 *       typed arrays. Sortable table headers are keyboard-accessible (WAI-ARIA 28 pattern).
 *       Dot pattern via --pattern-* tokens. LabelHeadingPair for section header.
 *       Gradient takeaways div via --bg-card-takeaways token.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/CompetitiveLandscape.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @token_refactor
 *   V0.2 `py-24 lg:py-32` → py-12 md:py-20 (--section-py-lg)
 *   V0.2 `max-w-7xl px-[84.375px]` → Container variant="page"
 *   V0.2 `mb-16` header → --section-header-mb (2.5rem)
 *   V0.2 `font-bold tracking-widest uppercase fontSize:13px` eyebrow → LabelHeadingPair
 *   V0.2 `text-[48px] tracking-tight` → var(--text-3xl) + --tracking-display-tight
 *   V0.2 `text-[16px] leading-relaxed` → var(--text-sm) + var(--leading-relaxed)
 *   V0.2 `rounded-[10px]` → var(--radius-sm)
 *   V0.2 `border-[#e5e5e5]` → var(--black-200)
 *   V0.2 `bg-[#eff1fe]` icon container → var(--purple-100)
 *   V0.2 `color: '#7f5fe3'` → var(--purple-500) (hex shift accepted per TOKEN-GAP-REPORT §4.11)
 *   V0.2 `text-[14px]` → var(--text-compact)
 *   V0.2 `text-sm` (V0.2 13px) → var(--text-xs)
 *   V0.2 `text-lg text-[#171717]` analysis header → var(--text-sm) + var(--black-900)
 *   V0.2 gradient inline → --bg-card-takeaways token
 *   V0.2 `Highcharts direct` → chart passed as `chartSlot` ReactNode (ChartCard + @ken-research/charts)
 *   V0.2 `accessibility.enabled: false` → callers MUST pass a11y-enabled chart prop
 *   V0.2 sortable th onClick → keyboard-accessible button inside th (WAI-ARIA 28)
 */

'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { ProgressBar } from '../atoms/ProgressBar';
import { Button } from '../atoms/Button';
import { ComparisonParameterCard } from '../molecules/ComparisonParameterCard';
import { AnalysisCard } from '../molecules/AnalysisCard';
import { cn } from '../lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CompetitorEntry {
  /** Company name */
  company: string;
  /** Market share percentage (optional — blurred in paywall) */
  share?: number;
  /** Year established (optional — blurred in paywall) */
  est?: number | null;
  /** Company type: 'Local' | 'Regional' | 'Government' | string */
  type?: string;
  /** Focus area description (blurred in paywall) */
  focus?: string;
}

export interface MarketDynamicsBar {
  label: string;
  percentage: number;
}

export interface ComparisonParam {
  number: number;
  title: string;
  description: string;
}

export interface AnalysisItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface TopPlayer {
  rank: number;
  name: string;
  share?: number;
}

export interface GDCStat {
  value: string;
  label: string;
}

export interface CompetitiveLandscapeProps {
  /** Section id for scroll-spy. @default "key-players" */
  id?: string;
  /** Eyebrow label, e.g. "CHAPTER 8 - Competitive Landscape" */
  label: string;
  /** Section heading — ReactNode for inline block spans */
  heading: ReactNode;
  /** Optional lede paragraph */
  lede?: string;
  /** Stats shown in header strip — max 3 */
  stats?: GDCStat[];
  /**
   * Chart node for the market share card slot.
   * Pass a ChartCard or raw PieChart from @ken-research/charts.
   * The slot is 200px tall.
   */
  chartSlot?: ReactNode;
  /** Legend items for the chart card (name + color dot) */
  chartLegend?: { name: string; color: string }[];
  /** Top 5 (or N) players for the summary ranking card */
  topPlayers?: TopPlayer[];
  /** Combined share for top players footer row */
  combinedShare?: string;
  /** Market dynamics bars (e.g., Local Players 70% / Regional 30%) */
  dynamicsBars?: MarketDynamicsBar[];
  /** Dynamics footnote text */
  dynamicsNote?: string;
  /** Full companies list for sortable table */
  companies: CompetitorEntry[];
  /** Table caption */
  tableCaption?: string;
  /** Table caption subtitle */
  tableCaptionSubtitle?: string;
  /** Unlock CTA label */
  unlockLabel?: string;
  /** Unlock CTA click handler */
  onUnlock?: () => void;
  /** Comparison parameter cards */
  comparisonParams?: ComparisonParam[];
  /** Analysis items in the footer gradient card */
  analysisItems?: AnalysisItem[];
  /** Analysis card heading */
  analysisHeading?: string;
  /** Analysis card subheading */
  analysisSubheading?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

type SortDirection = 'asc' | 'desc';

/**
 * CompetitiveLandscape — full competitive analysis organism.
 * 3-card summary row + sortable companies table (paywall) + comparison params + analysis inclusions.
 */
export function CompetitiveLandscape({
  id = 'key-players',
  label,
  heading,
  lede,
  stats,
  chartSlot,
  chartLegend,
  topPlayers,
  combinedShare,
  dynamicsBars,
  dynamicsNote,
  companies,
  tableCaption = 'Major Players',
  tableCaptionSubtitle = 'Click column headers to sort • Sorted by market share',
  unlockLabel = 'Unlock Company Profiles',
  onUnlock,
  comparisonParams,
  analysisItems,
  analysisHeading = 'Analysis Included in Report',
  analysisSubheading,
}: CompetitiveLandscapeProps) {
  const shouldReduceMotion = useReducedMotion();

  const [sortConfig, setSortConfig] = useState<{ key: keyof CompetitorEntry; direction: SortDirection }>({
    key: 'share',
    direction: 'desc',
  });

  const handleSort = useCallback((key: keyof CompetitorEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const sortedCompanies = [...companies].sort((a, b) => {
    const av = a[sortConfig.key];
    const bv = b[sortConfig.key];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return sortConfig.direction === 'asc'
      ? av > bv ? 1 : -1
      : av < bv ? 1 : -1;
  });

  const cardStyle = {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--black-200)',
    borderRadius: 'var(--radius-sm)',
  } as const;

  const sortButtonClass = cn(
    'flex items-center gap-1 cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-sm',
    'hover:text-[var(--black-900)] transition-colors',
    !shouldReduceMotion && 'duration-150',
  );

  return (
    <section
      id={id}
      aria-label={typeof heading === 'string' ? heading : label}
      className="py-12 md:py-20 relative overflow-hidden"
      style={{ backgroundColor: 'var(--black-50)' }}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          opacity: 'var(--pattern-opacity)',
          backgroundImage: `radial-gradient(circle, var(--black-900) var(--pattern-dot-size), transparent 0)`,
          backgroundSize: `var(--pattern-grid-size) var(--pattern-grid-size)`,
        }}
      />

      <Container maxWidth="page" className="relative">
        {/* ── Section header ── */}
        <div style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}>
          <LabelHeadingPair
            label={label}
            heading={heading}
            lede={lede}
            ledeMaxWidth="max-w-3xl"
          />

          {/* Stats strip */}
          {stats && stats.length > 0 && (
            <div
              style={{
                paddingTop: 'var(--space-10, 2.5rem)',
                marginTop: 'var(--space-10, 2.5rem)',
                borderTop: '1px solid var(--black-200)',
              }}
            >
              {/* Desktop */}
              <div className="hidden md:flex items-baseline gap-10 lg:gap-14">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-10 lg:gap-14">
                    <div>
                      <p className="tabular-nums font-bold" style={{ fontSize: 'var(--text-24, 1.5rem)', color: 'var(--black-900)', letterSpacing: 'var(--tracking-display-tight)' }}>
                        {stat.value}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)', marginTop: '0.375rem' }}>
                        {stat.label}
                      </p>
                    </div>
                    {i < stats.length - 1 && (
                      <div className="w-px h-8 self-center" style={{ backgroundColor: 'var(--black-300)' }} aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
              {/* Mobile */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:hidden">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="tabular-nums font-bold" style={{ fontSize: 'var(--text-24, 1.5rem)', color: 'var(--black-900)', letterSpacing: 'var(--tracking-display-tight)' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)', marginTop: 'var(--space-1, 0.25rem)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 3-card summary row ── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Market share chart card */}
          {chartSlot && (
            <div className="h-full p-4 transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]" style={cardStyle}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-500)', marginBottom: 'var(--space-4, 1rem)' }}>
                Market Share Distribution
              </p>
              <div style={{ height: '12.5rem' }}>
                {chartSlot}
              </div>
              {chartLegend && chartLegend.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {chartLegend.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                      <span style={{ fontSize: 'var(--text-2xs, 0.6875rem)', color: 'var(--black-500)' }} className="truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top players card */}
          {topPlayers && topPlayers.length > 0 && (
            <div className="h-full p-4 transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]" style={cardStyle}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-500)', marginBottom: 'var(--space-4, 1rem)' }}>
                Top {topPlayers.length} Players
              </p>
              <div className="space-y-3">
                {topPlayers.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--purple-100)', borderRadius: 'var(--radius-xs)' }}
                      >
                        <span className="font-bold" style={{ fontSize: 'var(--text-xs)', color: 'var(--black-900)' }}>
                          {player.rank}
                        </span>
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--black-900)' }}>{player.name}</span>
                    </div>
                    {player.share !== undefined && (
                      <span className="font-bold blur-sm select-none" style={{ fontSize: 'var(--text-xs)', color: 'var(--black-900)' }}>
                        {player.share}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {combinedShare && (
                <div
                  className="flex justify-between"
                  style={{ paddingTop: 'var(--space-4, 1rem)', marginTop: 'var(--space-4, 1rem)', borderTop: '1px solid var(--black-200)', fontSize: 'var(--text-xs)' }}
                >
                  <span style={{ color: 'var(--black-500)' }}>Combined Share</span>
                  <span className="font-bold blur-sm select-none" style={{ color: 'var(--black-900)' }}>{combinedShare}</span>
                </div>
              )}
            </div>
          )}

          {/* Market dynamics card */}
          {dynamicsBars && dynamicsBars.length > 0 && (
            <div className="h-full p-4 transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]" style={cardStyle}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-500)', marginBottom: 'var(--space-4, 1rem)' }}>
                Market Dynamics
              </p>
              <div className="space-y-4">
                {dynamicsBars.map((bar, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--black-900)' }}>{bar.label}</span>
                      <span className="font-bold" style={{ fontSize: 'var(--text-xs)', color: 'var(--black-900)' }}>{bar.percentage}%</span>
                    </div>
                    <ProgressBar
                      value={bar.percentage}
                      max={100}
                      color="var(--purple-300)"
                      ariaLabel={`${bar.label}: ${bar.percentage}%`}
                    />
                  </div>
                ))}
                {dynamicsNote && (
                  <div
                    style={{
                      paddingTop: 'var(--space-3, 0.75rem)',
                      borderTop: '1px solid var(--black-200)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: dynamicsNote }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sortable companies table ── */}
        <div
          className="relative overflow-x-auto border transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] mb-6"
          style={{ backgroundColor: 'var(--white)', borderColor: 'var(--black-200)', borderRadius: 'var(--radius-sm)' }}
        >
          <table
            className="w-full text-left rtl:text-right"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}
            aria-label={tableCaption}
          >
            <caption className="p-5 text-left rtl:text-right" style={{ color: 'var(--black-900)' }}>
              <span style={{ fontSize: 'var(--text-md, 1.125rem)', fontWeight: 'var(--font-weight-medium)' }}>{tableCaption}</span>
              {tableCaptionSubtitle && (
                <p className="mt-1.5 font-normal" style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}>
                  {tableCaptionSubtitle}
                </p>
              )}
            </caption>
            <thead style={{ backgroundColor: 'var(--black-50)', borderBottom: '1px solid var(--black-200)', borderTop: '1px solid var(--black-200)' }}>
              <tr>
                {/* Company — sortable */}
                <th scope="col" aria-sort={sortConfig.key === 'company' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-6 py-3 font-normal">
                  <button type="button" className={sortButtonClass} onClick={() => handleSort('company')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSort('company'); } }} aria-label="Sort by company">
                    Company
                    <span aria-hidden="true" style={{ color: 'var(--purple-500)', opacity: 0.5, fontSize: '0.625rem' }}>⇅</span>
                  </button>
                </th>
                {/* Share — sortable + blurred */}
                <th scope="col" aria-sort={sortConfig.key === 'share' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-6 py-3 font-normal blur-sm">
                  <button type="button" className={sortButtonClass} onClick={() => handleSort('share')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSort('share'); } }} aria-label="Sort by share">
                    Share
                    <span aria-hidden="true" style={{ color: 'var(--purple-500)', opacity: 0.5, fontSize: '0.625rem' }}>⇅</span>
                  </button>
                </th>
                {/* Est. — sortable + blurred */}
                <th scope="col" aria-sort={sortConfig.key === 'est' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-6 py-3 font-normal blur-sm">
                  <button type="button" className={sortButtonClass} onClick={() => handleSort('est')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSort('est'); } }} aria-label="Sort by year established">
                    Est.
                    <span aria-hidden="true" style={{ color: 'var(--purple-500)', opacity: 0.5, fontSize: '0.625rem' }}>⇅</span>
                  </button>
                </th>
                {/* Type — blurred */}
                <th scope="col" className="px-6 py-3 font-normal blur-sm">Type</th>
                {/* Focus area — blurred */}
                <th scope="col" className="px-6 py-3 font-normal blur-sm">Focus Area</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, i) => (
                <tr
                  key={i}
                  className={cn(
                    'bg-white hover:bg-[var(--black-50)] transition-colors',
                    !shouldReduceMotion && 'duration-150',
                    i < sortedCompanies.length - 1 && 'border-b border-[var(--black-200)]',
                  )}
                >
                  <th scope="row" className="px-6 py-4 whitespace-nowrap" style={{ color: 'var(--black-900)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'var(--purple-100)', borderRadius: 'var(--radius-xs)' }}>
                        <Building2 className="h-4 w-4" style={{ color: 'var(--purple-500)' }} aria-hidden="true" />
                      </div>
                      <span>{company.company}</span>
                    </div>
                  </th>
                  <td className="px-6 py-4 blur-sm select-none">
                    {company.share !== undefined && (
                      <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: 'var(--text-xs)', backgroundColor: 'var(--black-100)', color: 'var(--black-600)' }}>
                        {company.share}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 blur-sm select-none" style={{ color: 'var(--black-500)' }}>
                    {company.est ?? '–'}
                  </td>
                  <td className="px-6 py-4 blur-sm select-none" style={{ color: 'var(--black-500)' }}>
                    {company.type ?? '–'}
                  </td>
                  <td className="px-6 py-4 blur-sm select-none" style={{ color: 'var(--black-500)' }}>
                    {company.focus ?? '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Unlock overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Button variant="brand" size="md" onClick={onUnlock}>
                {unlockLabel}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Comparison parameters ── */}
        {comparisonParams && comparisonParams.length > 0 && (
          <div
            className="border mb-6"
            style={{ backgroundColor: 'var(--white)', borderColor: 'var(--black-200)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-6, 1.5rem)' }}
          >
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--black-500)', marginBottom: 'var(--space-2, 0.5rem)', fontWeight: 'var(--font-weight-medium)' }}>
              Cross Comparison Parameters
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)', marginBottom: 'var(--space-4, 1rem)' }}>
              The report provides detailed cross-comparison of key players across {comparisonParams.length} performance parameters.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonParams.map((param) => (
                <ComparisonParameterCard
                  key={param.number}
                  number={param.number}
                  title={param.title}
                  description={param.description}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Analysis inclusions footer ── */}
        {analysisItems && analysisItems.length > 0 && (
          <div
            className="border"
            style={{
              background: 'var(--bg-card-takeaways)',
              borderColor: 'rgba(226, 228, 253, 0.5)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4, 1rem)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ marginBottom: 'var(--space-6, 1.5rem)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--black-900)', marginBottom: 'var(--space-1, 0.25rem)' }}>
                  {analysisHeading}
                </h3>
                {analysisSubheading && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}>{analysisSubheading}</p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {analysisItems.map((item, i) => (
                <AnalysisCard
                  key={i}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
