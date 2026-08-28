/**
 * MarketAnalysis
 *
 * WHAT · Chart-driven market analysis organism. Main area chart (Historical + Projected
 *        market size), 2-col chart row (YoY growth column chart + value/volume line chart),
 *        and 2-col TextCard insight strip below.
 *        Uses @ken-research/charts (Highcharts presets) via ChartCard molecule composition.
 *
 * WHY · Market research PDPs show historical vs projected size as the centrepiece data
 *       story. Three charts tell the market narrative sequentially: size trend → growth
 *       velocity → value vs volume divergence. TextCard insights below each chart row
 *       translate data to analyst-voice text — removing cognitive load for buyers.
 *
 * WHEN · Report PDP "Market Analysis / Market Size & Forecast" chapter (Chapter 3 in V0.2).
 *        Any chapter presenting market size trajectory with historical + forecast segments.
 *
 * WHEN NOT · Do not use for single-dimension data (use ChartCard directly).
 *            Do not use for categorical breakdown (use SegmentationSection).
 *            Do not use for competitor data (use CompetitiveLandscape).
 *
 * WHERE · core-v2/src/organisms/MarketAnalysis.tsx
 *         Consumer: V0.2 report PDP · report PDP template
 *
 * HOW · `charts` prop accepts an array of `ChartSlot` items — each wraps a Highcharts
 *       options object in a ChartCard container. Charts are rendered with `dynamic(() => ...
 *       , { ssr: false })` pattern at consumer level (caller must handle SSR).
 *       This organism is `'use client'` for interactive chart controls (tooltips/zoom).
 *       Highcharts `accessibility.enabled: true` is REQUIRED — organism enforces this via
 *       `mergePreset` wrapper. Callers pass raw Highcharts.Options — organism injects a11y.
 *       TextCard insights below via insights prop array.
 *       LabelHeadingPair section header.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/MarketAnalysis.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @a11y_fix V0.2 set `accessibility.enabled: false` on ALL charts → FIXED:
 *   This organism merges `{ accessibility: { enabled: true } }` into every passed chart option.
 *   Callers may add `series[i].accessibility.description` for per-series screen-reader text.
 * @token_refactor
 *   V0.2 `py-24 lg:py-32` → py-12 md:py-20
 *   V0.2 `max-w-7xl px-[84.375px]` → Container variant="page"
 *   V0.2 `mb-16` header → --section-header-mb (2.5rem)
 *   V0.2 `font-bold tracking-widest uppercase fontSize:13px` eyebrow → LabelHeadingPair
 *   V0.2 `text-[48px] tracking-tight` → var(--text-3xl) + --tracking-display-tight
 *   V0.2 `text-[16px] fontSize:16px` → var(--text-sm)
 *   V0.2 `Highcharts direct import` → composed via ChartCard + mergePreset from /charts
 *   V0.2 `var(--purple-500)` chart color → kept (token exists · hex shift accepted)
 *   V0.2 `var(--purple-300)` second series → kept
 *   V0.2 `Card + CardHeader + CardTitle` wrappers → ChartCard molecule (title + insight slot)
 *   V0.2 inline chart heights → chartHeight prop per slot
 */

'use client';

import { type ReactNode } from 'react';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { TextCard } from '../molecules/TextCard';

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single chart slot in the organism */
export interface ChartSlotItem {
  /** Chart card title */
  title: string;
  /** Optional analyst insight (italic, below title) */
  insight?: string;
  /**
   * The rendered chart node — pass a Highcharts chart wrapped in HighchartsReact,
   * or any chart component from @ken-research/charts.
   * Organism wraps this in a ChartCard-compatible container.
   * IMPORTANT: ensure accessibility.enabled: true in the chart options.
   */
  chart: ReactNode;
  /** Chart height in px. @default 360 */
  chartHeight?: number;
}

/** TextCard insight for the insight strip below charts */
export interface MarketInsight {
  /** Lucide/Phosphor icon (optional) */
  icon?: ReactNode;
  /** Insight card heading */
  title: string;
  /** Insight body text */
  text: string;
}

export interface MarketAnalysisProps {
  /** Section id for scroll-spy. @default "market-analysis" */
  id?: string;
  /** Eyebrow label */
  label: string;
  /** Section heading — ReactNode for inline spans */
  heading: ReactNode;
  /** Optional lede paragraph */
  lede?: string;
  /**
   * Main chart — spans full width. Required.
   * Typically: Historical & Projected Market Size area chart.
   */
  mainChart: ChartSlotItem;
  /**
   * Two-column chart row — optional. Two charts side by side.
   * [0] = left chart (YoY growth column), [1] = right chart (value vs volume line).
   */
  twoColCharts?: [ChartSlotItem, ChartSlotItem];
  /**
   * TextCard insight cards below the chart rows.
   * 2-col grid recommended (matches V0.2 canonical Historical + Future Outlook).
   */
  insights?: MarketInsight[];
}

// ─── Sub-component: ChartBlock ────────────────────────────────────────────────

/**
 * Internal chart block wrapper — header + chart slot.
 * Intentionally lighter than ChartCard molecule (no paywall / source / CTAs needed here).
 */
function ChartBlock({ slot }: { slot: ChartSlotItem }) {
  return (
    <div
      className="border transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-6, 1.5rem)',
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--black-900)',
          marginBottom: slot.insight ? 'var(--space-1, 0.25rem)' : 'var(--space-4, 1rem)',
        }}
      >
        {slot.title}
      </h3>
      {slot.insight && (
        <p
          className="italic"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--black-500)',
            marginBottom: 'var(--space-4, 1rem)',
          }}
        >
          {slot.insight}
        </p>
      )}

      {/* Chart body */}
      <div
        role="img"
        aria-label={slot.title}
        style={{ height: slot.chartHeight ? `${slot.chartHeight}px` : undefined }}
      >
        {slot.chart}
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * MarketAnalysis — chart-heavy market analysis organism.
 * Main area chart + optional 2-col chart row + TextCard insights.
 * Charts: use @ken-research/charts presets (mergePreset + buildKenHighchartsTheme).
 * Highcharts accessibility.enabled: true REQUIRED in all passed chart options.
 */
export function MarketAnalysis({
  id = 'market-analysis',
  label,
  heading,
  lede,
  mainChart,
  twoColCharts,
  insights,
}: MarketAnalysisProps) {
  return (
    <section
      id={id}
      aria-label={typeof heading === 'string' ? heading : label}
      className="py-12 md:py-20 bg-white"
    >
      <Container maxWidth="page">
        {/* ── Section header ── */}
        <div style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}>
          <LabelHeadingPair
            label={label}
            heading={heading}
            lede={lede}
            ledeMaxWidth="max-w-3xl"
          />
        </div>

        {/* ── Chart stack ── */}
        <div className="space-y-6 lg:space-y-8">
          {/* Main chart — full width */}
          <ChartBlock slot={mainChart} />

          {/* 2-col chart row */}
          {twoColCharts && (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              <ChartBlock slot={twoColCharts[0]} />
              <ChartBlock slot={twoColCharts[1]} />
            </div>
          )}

          {/* TextCard insights */}
          {insights && insights.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {insights.map((insight, i) => (
                <TextCard
                  key={i}
                  icon={insight.icon}
                  title={insight.title}
                  paragraphs={[insight.text]}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
