'use client';

/**
 * ChartFigure · canonical anatomy wrapper for ALL section charts.
 *
 * WHY  · Refs always pair charts with title + unit + legend + insight.
 *        A naked bare chart is insufficient for premium B2B research delivery.
 *        User feedback (2026-05-21): "user won't understand what chart shows · UX lacking."
 *
 * WHAT · Composes ref-aligned chart anatomy:
 *
 *   ┌────────────────────────────────────────────────────────────────────┐
 *   │ EYEBROW · UPPERCASE TRACKED                    [unit — top-right]  │
 *   │ Chart title · Noto Serif 18-24px                                   │
 *   │ Subtitle · DM Sans italic 13px (optional)                          │
 *   │ Italic insight · DM Sans 13px · max 2 lines                        │
 *   │                                                                    │
 *   │ [CHART · KenColumnChart · KenLineChart · etc.]                     │
 *   │                                                                    │
 *   │ [● Solid · Historical] [▭ Dashed · Forecast]   ← ChartFigure-owned │
 *   │                                                                    │
 *   │ figcaption: Italic interpretation · 11px                           │
 *   │ Source: Ken Forecast Model · Cross-ref: Oxford Economics           │
 *   └────────────────────────────────────────────────────────────────────┘
 *
 * Gap chain (ref-canonical):
 *   title → subtitle: 4px
 *   title/subtitle → insight: 12px
 *   insight → chart: 20px
 *   chart → legend: 16px
 *   legend → figcaption: 12px
 *   figcaption → source: 8px
 *
 * WHEN · Wrap EVERY chart in Ken pages. Provide eyebrow + title + insight.
 *        Add legend for multi-series or projection-based charts.
 *        Add figcaption for analyst interpretation.
 *        Add source for citation integrity (B2B research standard).
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/ChartFigure.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ChartFigure
 *          eyebrow="Market trajectory"
 *          title="Australia cold chain market size · 2017–2027F"
 *          subtitle="AUD Mn · 2022 constant prices"
 *          unitPosition="top-right"
 *          unit="AUD Mn"
 *          insight="Market sustains 9.1% historical growth · forecast accelerates to 10.3% CAGR."
 *          legend={[
 *            { kind: 'solid',  color: '#9488ec', label: 'Historical · 2017–2022' },
 *            { kind: 'dashed', color: '#9488ec', label: 'Forecast · 2023–2027F' },
 *          ]}
 *          figcaption="Solid bars are historical actuals · dashed are forecast."
 *          source={{ primary: 'Ken Forecast Model 2025', cross: ['Oxford Economics'], date: '2025-Q2' }}
 *        >
 *          <KenColumnChart ... />
 *        </ChartFigure>
 *        ```
 *
 * A11y · `<figure>` semantic element · `<figcaption>` for caption ·
 *        legend `<ul>` has aria-label="Chart legend" · swatches aria-hidden.
 *
 * Internal Highcharts legend must be disabled on wrapped charts.
 * ChartFigure owns the legend slot exclusively.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/charts/ChartFigure.tsx
 */

import type { ReactNode } from 'react';
import { ChartDataTable } from './ChartDataTable';
import type { ChartDataTableProps } from './ChartDataTable';
import { DataFreshness } from './DataFreshness';
import { ExportMenu } from './ExportMenu';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Visual style of a legend swatch · matches Highcharts series appearance */
export type LegendKind = 'solid' | 'dashed' | 'line' | 'area' | 'dot';

export interface LegendEntry {
  /** Visual style of swatch · matches series appearance in chart */
  kind: LegendKind;
  /** Color (hex or rgba) · should match chart series color */
  color: string;
  /** Human label · ≤6 words */
  label: string;
}

/**
 * Source citation · B2B research standard.
 * Rendered as italic 10px line below figcaption.
 */
export interface SourceInfo {
  /** Primary source · e.g. 'Ken Forecast Model 2025' */
  primary: string;
  /** Optional cross-reference sources · e.g. ['Oxford Economics', 'IBISWorld'] */
  cross?: string[];
  /** Optional date · e.g. '2025-Q2' */
  date?: string;
}

export interface ChartFigureProps {
  /** Uppercase tracked label · context tag (e.g. "MARKET TRAJECTORY") */
  eyebrow?: string;
  /** Serif title · what the chart shows · 8–14 words */
  title: string;
  /**
   * Optional subtitle · italic DM Sans 13px · displayed below title.
   * Use for units/context when unit is long (e.g. "AUD Mn · 2022 constant prices").
   */
  subtitle?: string;
  /** Unit label displayed near eyebrow row */
  unit?: string;
  /**
   * Position of unit label.
   * top-right: right-aligned pill on same row as eyebrow (default).
   * inline-eyebrow: inlined with eyebrow text after a separator.
   * @default 'top-right'
   */
  unitPosition?: 'top-right' | 'inline-eyebrow';
  /** Italic insight · 1–2 lines explaining WHY the chart matters · max 24 words */
  insight?: string;
  /** Legend entries · render below chart · skip for single-series no-projection charts */
  legend?: LegendEntry[];
  /** Figcaption · italic · analyst interpretation · 1–2 lines · max 30 words */
  figcaption?: string;
  /**
   * Source citation · primary + optional cross-references + date.
   * Rendered as italic 10px line below figcaption.
   */
  source?: SourceInfo;
  /** The chart itself · KenColumnChart, KenLineChart, etc. */
  children: ReactNode;
  /** Optional className passthrough for outer `<figure>` container */
  className?: string;
  /**
   * Optional screen reader data table — WCAG 1.1.1 fallback for visual chart data.
   * When provided, renders a `<table className="sr-only">` after the chart canvas.
   * Revealed as primary content in `@media print` via print.css override.
   * Omit for purely decorative / label-only charts.
   */
  dataTable?: ChartDataTableProps;
  /**
   * Data cutoff date · renders an italic "Data as of: <date>" caption below source.
   * - Date object: formatted via Intl (e.g. "Jun 1, 2025")
   * - String: rendered verbatim (e.g. "Q2 2025")
   * B2B research standard — always provide for forecast/historical charts.
   */
  dataAsOf?: string | Date;
  /**
   * Enable CSV export button (top-right icon).
   * Requires `dataTable` to be provided — uses it as the export data source.
   * @default false
   */
  enableExport?: boolean;
  /**
   * Filename for CSV download (without extension).
   * @default 'chart-data'
   */
  exportFilename?: string;
  /**
   * Surface context — passed to DataFreshness + ExportMenu for contrast-safe colors.
   * 'light' (default): editorial-light surfaces.
   * 'dark': cinematic-dark sections — text/icon on #0a0a0c.
   * @default 'light'
   */
  surface?: 'light' | 'dark';
}

// ─── Legend swatch ────────────────────────────────────────────────────────────

function LegendSwatch({ kind, color }: { kind: LegendKind; color: string }) {
  switch (kind) {
    case 'solid':
      return (
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 flex-none"
          style={{ background: color, borderRadius: 1 }}
        />
      );
    case 'dashed':
      return (
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 flex-none"
          style={{
            background: `${color}55`,
            border: `1px dashed ${color}`,
            borderRadius: 1,
          }}
        />
      );
    case 'line':
      return (
        <span
          aria-hidden="true"
          className="inline-block flex-none"
          style={{
            width: '14px',
            height: '2px',
            background: color,
            marginTop: '4px',
          }}
        />
      );
    case 'area':
      return (
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 flex-none"
          style={{
            background: `linear-gradient(180deg, ${color}55 0%, ${color}11 100%)`,
            borderTop: `2px solid ${color}`,
          }}
        />
      );
    case 'dot':
    default:
      return (
        <span
          aria-hidden="true"
          className="inline-block flex-none rounded-full"
          style={{
            width: '8px',
            height: '8px',
            background: color,
            marginTop: '2px',
          }}
        />
      );
  }
}

// ─── Source line renderer ─────────────────────────────────────────────────────

function SourceLine({ source }: { source: SourceInfo }) {
  const parts: string[] = [`Source: ${source.primary}`];
  if (source.cross && source.cross.length > 0) {
    parts.push(`Cross-ref: ${source.cross.join(', ')}`);
  }
  if (source.date) {
    parts.push(source.date);
  }
  return (
    <p
      className="font-body italic text-[var(--semantic-ink-muted)] max-w-[72ch]"
      style={{ fontSize: '10px', lineHeight: 1.5, marginTop: '8px' }}
    >
      {parts.join(' · ')}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChartFigure({
  eyebrow,
  title,
  subtitle,
  insight,
  unit,
  unitPosition = 'top-right',
  legend,
  figcaption,
  source,
  children,
  className,
  dataTable,
  dataAsOf,
  enableExport = false,
  exportFilename = 'chart-data',
  surface = 'light',
}: ChartFigureProps) {
  return (
    <figure className={['w-full', className ?? ''].join(' ')}>

      {/* ── Row 1: eyebrow + unit + export ───────────────────────────────── */}
      {(eyebrow || (unit && unitPosition === 'top-right') || (enableExport && dataTable)) && (
        <div className="flex items-start justify-between gap-4 flex-wrap mb-1.5">
          {eyebrow && (
            <p
              className="font-body uppercase tracking-[0.12em] text-[var(--semantic-ink-muted)] flex-1 min-w-0"
              style={{ fontSize: '10px', fontWeight: 600 }}
            >
              {eyebrow}
              {/* Inline unit: append after eyebrow with separator */}
              {unit && unitPosition === 'inline-eyebrow' && (
                <span
                  className="ml-2 normal-case tracking-normal"
                  style={{ fontWeight: 500 }}
                  aria-label={`Unit: ${unit}`}
                >
                  · {unit}
                </span>
              )}
            </p>
          )}
          <div className="flex items-center gap-2 flex-none">
            {unit && unitPosition === 'top-right' && (
              <span
                className="font-body uppercase tracking-[0.12em] text-[var(--semantic-ink-muted)]"
                style={{ fontSize: '10px', fontWeight: 600 }}
                aria-label={`Unit: ${unit}`}
              >
                {unit}
              </span>
            )}
            {/* Export button — only when dataTable is provided (CSV source) */}
            {enableExport && dataTable && (
              <ExportMenu dataTable={dataTable} filename={exportFilename} surface={surface} />
            )}
          </div>
        </div>
      )}

      {/* ── Row 2: title ──────────────────────────────────────────────────── */}
      <h3
        className="font-display font-light text-[var(--semantic-ink-strong)]"
        style={{
          fontSize: 'clamp(16px, 1.4vw, 19px)',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          marginBottom: subtitle ? '4px' : insight ? '12px' : '20px',
        }}
      >
        {title}
      </h3>

      {/* ── Row 2b: subtitle ──────────────────────────────────────────────── */}
      {subtitle && (
        <p
          className="font-body italic text-[var(--semantic-ink-muted)] max-w-[64ch]"
          style={{ fontSize: '13px', lineHeight: 1.45, marginBottom: insight ? '12px' : '20px' }}
        >
          {subtitle}
        </p>
      )}

      {/* ── Row 3: insight ────────────────────────────────────────────────── */}
      {insight && (
        <p
          className="font-body italic text-[var(--semantic-ink-body)] max-w-[60ch]"
          style={{ fontSize: '13px', lineHeight: 1.55, marginBottom: '20px' }}
        >
          {insight}
        </p>
      )}

      {/* ── Row 4: chart canvas ───────────────────────────────────────────── */}
      <div className="w-full">{children}</div>

      {/* ── Row 5: legend ─────────────────────────────────────────────────── */}
      {legend && legend.length > 0 && (
        <ul
          className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-1"
          style={{ marginTop: '16px' }}
          aria-label="Chart legend"
        >
          {legend.map((entry, i) => (
            <li
              key={`${entry.label}-${i}`}
              className="flex items-center gap-2 font-body text-[var(--semantic-ink-body)]"
              style={{ fontSize: '11px' }}
            >
              <LegendSwatch kind={entry.kind} color={entry.color} />
              {/* Bible § 1.9: truncate long legend labels at 32 chars · full text in title tooltip */}
              <span
                title={entry.label.length > 32 ? entry.label : undefined}
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                {entry.label.length > 32 ? `${entry.label.slice(0, 32)}…` : entry.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ── Row 6: figcaption ─────────────────────────────────────────────── */}
      {figcaption && (
        <figcaption
          className="font-body italic text-[var(--semantic-ink-muted)] max-w-[68ch]"
          style={{ fontSize: '11px', lineHeight: 1.55, marginTop: '12px' }}
        >
          {figcaption}
        </figcaption>
      )}

      {/* ── Row 7: source citation ────────────────────────────────────────── */}
      {source && <SourceLine source={source} />}

      {/* ── Row 7b: data freshness indicator ─────────────────────────────── */}
      {dataAsOf && <DataFreshness asOf={dataAsOf} surface={surface} />}

      {/* ── Row 8: sr-only data table · WCAG 1.1.1 screen reader fallback ── */}
      {dataTable && (
        <ChartDataTable
          caption={dataTable.caption}
          headers={dataTable.headers}
          rows={dataTable.rows}
        />
      )}

    </figure>
  );
}
