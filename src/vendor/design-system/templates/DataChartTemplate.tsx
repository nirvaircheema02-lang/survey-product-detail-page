/**
 * DataChartTemplate
 *
 * WHAT · Composition shell for a 2-col data visualisation section: left ChartCard
 *        (chart slot) + right ChartCard (table/secondary slot).
 *        Optional mobile ViewToggle to switch between chart and table.
 *        Optional PaywallOverlay on either or both cards.
 *
 * WHY · Chart + table pair is the canonical data-viz pattern across the report PDP
 *       (Market Size §11, DS Gap §18, Macro Indicators §20). Centralising this avoids
 *       per-section re-invention of the 2-col responsive grid and mobile toggle.
 *       (CANON §2.5 + §1.7 gap-6).
 *
 * WHEN · Report PDP: section 11 (Market Size), section 18 (DS Gap), section 20 (Macro).
 *        Any 2-up chart + table combination.
 *
 * WHEN NOT · Single chart without a paired table → use ChartCard directly.
 *            3+ chart panel → use custom grid layout.
 *
 * WHERE · `core-v2/src/templates/DataChartTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <DataChartTemplate
 *   id="market-size"
 *   background="white"
 *   label="CHAPTER 11 · MARKET SIZE"
 *   heading="Australia Cold Chain Market Size & Forecast"
 *   chartCard={{
 *     eyebrow: "MARKET SIZE",
 *     title: "Total Market Size, 2018–2030E",
 *     insight: "CAGR of 8.4% expected through 2030.",
 *     children: <BarChartFromKenCharts data={data} />,
 *   }}
 *   tableCard={{
 *     eyebrow: "DATA TABLE",
 *     title: "Annual Market Size by Segment (USD Bn)",
 *     children: <DatasetPreviewTable rows={rows} accessTier="lead" />,
 *   }}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · LabelHeadingPair · ChartCard · PaywallOverlay (optional)
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.5 · §1.7
 */

import type { CSSProperties } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { ChartCard, type ChartCardProps } from '../molecules/ChartCard';

export type DataChartBg = 'white' | 'warm';

/** Subset of ChartCardProps forwarded per card slot */
export type ChartSlotProps = Omit<ChartCardProps, 'className'>;

export interface DataChartTemplateProps {
  /** HTML id for anchor scroll */
  id: string;

  /** Background variant. Defaults to 'white'. */
  background?: DataChartBg;

  /** Eyebrow label */
  label: string;

  /** Section h2 heading */
  heading: string;

  /** Optional lede paragraph */
  lede?: string;

  /** Left ChartCard props — chart visualisation slot */
  chartCard: ChartSlotProps;

  /** Right ChartCard props — table / secondary data slot */
  tableCard: ChartSlotProps;

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * DataChartTemplate — 2-col chart + table section shell.
 *
 * Composition: SectionWrapper → LabelHeadingPair → 2-col grid (gap-6 lg:gap-8) →
 *   ChartCard (chart) + ChartCard (table). Paywalls handled internally by ChartCard accessLevel prop.
 *
 * Mobile: stacks single column. Both cards full-width.
 */
export function DataChartTemplate({
  id,
  background = 'white',
  label,
  heading,
  lede,
  chartCard,
  tableCard,
  className,
}: DataChartTemplateProps) {
  return (
    <SectionWrapper
      id={id}
      background={background}
      spacing="lg"
      maxWidth="wide"
      className={className}
      style={{ scrollMarginTop: 'var(--scroll-margin-section, 72px)' } as CSSProperties}
      data-template="DataChartTemplate"
    >
      {/* SECTION HEADER BLOCK */}
      <div className="mb-10 md:mb-12">
        <LabelHeadingPair
          label={label}
          heading={heading}
          headingId={`${id}-heading`}
          headingLevel={2}
          labelVariant="accent"
          lede={lede}
        />
      </div>

      {/* 2-COL GRID — gap-6 standard (CANON §1.7) · lg gap-8 spacious */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8" data-slot="chart-grid">
        {/* CHART CARD — left */}
        <ChartCard {...chartCard} />

        {/* TABLE CARD — right */}
        <ChartCard {...tableCard} />
      </div>
    </SectionWrapper>
  );
}
