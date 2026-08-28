/**
 * RegionalComparison — Organism
 *
 * WHY · V0.2 implemented a 2-col chart+table comparison pattern for regional market
 *       data (GCC herbs, Qatar vs GCC). Without a shared organism, every chapter
 *       section that needs geographic + tabular side-by-side re-implements the
 *       paywall blur, mobile toggle, and ChartCard framing independently. This
 *       organism codifies the canonical pattern once.
 *
 * WHAT · Two-panel layout: left = MapChart inside ChartCard, right = DatasetPreviewTable
 *        inside ChartCard. Desktop: 2-col grid. Mobile: single-col with ViewToggle
 *        tab strip to switch between panels. Optional paywall blur variant on table rows.
 *        LabelHeadingPair section header. SectionWrapper container with bg token.
 *
 * WHEN · Chapter sections comparing regional market sizes / shares geographically.
 *        Primary: v1-product-page RegionalAnalysis section.
 *        Secondary: MarketOverview geographic breakdown.
 *
 * WHEN NOT · Time-series data → use ChartCard with AreaChart.
 *            Non-geographic comparisons → ComparisonParameterCard.
 *            Full sortable table → MarketDataTable organism.
 *
 * WHERE · core-v2/src/organisms/RegionalComparison.tsx
 *         Canonical source: V0.2-for-ds `RegionalComparison.tsx` (ported + enhanced).
 *
 * HOW ·
 * ```tsx
 * <RegionalComparison
 *   eyebrow="CHAPTER 6 - REGIONAL ANALYSIS"
 *   title="Australia Cold Chain: State Breakdown"
 *   lede="Comparing cold chain logistics capacity and market size across Australian states."
 *   regions={MOCK_REGIONS}
 *   geographyUrl="/maps/australia-states.json"
 *   tableColumns={TABLE_COLS}
 *   tableRows={TABLE_ROWS}
 *   source="Ken Research Primary Analysis, 2024"
 *   paywall={false}
 *   accessTier="anonymous"
 * />
 * ```
 *
 * ANIMATION STACK · Framer Motion via ViewToggle + ViewTogglePanel (crossfade 150ms).
 *                   useReducedMotion() propagated via ViewTogglePanel.
 *
 * @reusabilityScore 4
 * @a11y_status reviewed-AA (tablist/tabpanel mobile toggle · locked table rows aria-hidden · keyboard)
 * @lifecycle stable
 * @portedDate 2026-05-19 · aura-builder · Batch 3.3a (port from V0.2 + enhancements)
 * @canonical_source V0.2-for-ds `src/app/components/RegionalComparison.tsx`
 * @changes_from_source
 *   - Replaces Highcharts bar chart with MapChart organism (react-simple-maps)
 *   - Replaces inline Table+blur with DatasetPreviewTable molecule (access-aware)
 *   - Adds ViewToggle mobile layout (V0.2 was always 2-col)
 *   - Replaces hardcoded px/hex with DS tokens throughout
 *   - Replaces V0.2 TextCard with ChartCard molecule
 *   - LabelHeadingPair replaces inline h2 + p + OverheadText
 *   - SectionWrapper replaces hardcoded section padding + max-width
 *   - paywall now delegated to DatasetPreviewTable (accessTier prop)
 */
'use client';

import { useState } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { ChartCard } from '../molecules/ChartCard';
import { DatasetPreviewTable } from '../molecules/DatasetPreviewTable';
import { TabStrip, TabStripPanel } from '../molecules/TabStrip';
import { MapChart } from './MapChart';
import { cn } from '../lib/cn';
import type { MapRegion } from './MapChart';
import type { DatasetColumn, DatasetRow, DatasetAccessTier } from '../molecules/DatasetPreviewTable';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegionalComparisonProps {
  /** Section eyebrow label e.g. "CHAPTER 6 - REGIONAL ANALYSIS" */
  eyebrow?: string;
  /** Section heading */
  title?: string;
  /** Optional lede paragraph below heading */
  lede?: string;
  /** Shared dataset: drives both MapChart regions and can inform table */
  regions: MapRegion[];
  /** TopoJSON file path — passed to MapChart · @default '/maps/world-110m.json' */
  geographyUrl?: string;
  /**
   * Map color ramp.
   * @default 'purple'
   */
  colorScale?: 'purple' | 'periwinkle' | 'coral';
  /** Column definitions for the DatasetPreviewTable */
  tableColumns: DatasetColumn[];
  /** Row data for the DatasetPreviewTable */
  tableRows: DatasetRow[];
  /**
   * Access tier controlling how many table rows are visible.
   * anonymous → 1 row · lead → 3 rows · paid → all rows
   * @default 'anonymous'
   */
  accessTier?: DatasetAccessTier;
  /** Source attribution shown in both ChartCard footers */
  source?: string;
  /**
   * Paywall variant — deprecated alias for accessTier.
   * When true, forces accessTier='anonymous' if accessTier not explicitly set.
   */
  paywall?: boolean;
  /** Unlock CTA click handler for paywall rows */
  onUnlockClick?: () => void;
  /** Optional className passthrough on outer SectionWrapper */
  className?: string;
}

// ─── View toggle options ───────────────────────────────────────────────────────

const VIEW_OPTIONS = [
  { id: 'map', label: 'Map View' },
  { id: 'table', label: 'Table View' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * RegionalComparison — two-panel geographic + tabular comparison organism.
 * Desktop: 2-col grid (MapChart left, Table right).
 * Mobile: single-col with TabStrip tab strip to switch panels.
 */
export function RegionalComparison({
  eyebrow = 'REGIONAL ANALYSIS',
  title = 'Regional Market Comparison',
  lede,
  regions,
  geographyUrl = '/maps/world-110m.json',
  colorScale = 'purple',
  tableColumns,
  tableRows,
  accessTier: accessTierProp,
  source,
  paywall = false,
  onUnlockClick,
  className,
}: RegionalComparisonProps) {
  const [mobileView, setMobileView] = useState<string>('map');

  // Resolve access tier: explicit prop wins · paywall flag fallback
  const accessTier: DatasetAccessTier =
    accessTierProp ?? (paywall ? 'anonymous' : 'anonymous');

  const mapPanel = (
    <ChartCard
      title="Map View"
      insight={
        regions.length > 0
          ? `${regions.length} regions visualised · color depth indicates relative market size`
          : undefined
      }
      source={source}
      accessLevel="public"
    >
      <MapChart
        regions={regions}
        geographyUrl={geographyUrl}
        colorScale={colorScale}
        height={320}
        showLegend
        showTooltip
        ariaLabel={title}
      />
    </ChartCard>
  );

  const tablePanel = (
    <ChartCard
      title="Table View"
      source={source}
      accessLevel={accessTier === 'paid' ? 'public' : 'lead'}
      primaryCta={
        accessTier !== 'paid' && onUnlockClick
          ? { label: 'Unlock Full Dataset', onClick: onUnlockClick }
          : undefined
      }
    >
      <DatasetPreviewTable
        columns={tableColumns}
        rows={tableRows}
        accessTier={accessTier}
        source={source}
        onUnlock={onUnlockClick}
      />
    </ChartCard>
  );

  return (
    <SectionWrapper
      id="regional-comparison"
      background="white"
      spacing="lg"
      maxWidth="wide"
      className={cn('', className)}
    >
      {/* Section header */}
      {(eyebrow || title) && (
        <div style={{ marginBottom: 'var(--space-2xl, 48px)' }}>
          <LabelHeadingPair
            label={eyebrow}
            heading={title}
            lede={lede}
            align="left"
            background="light"
          />
        </div>
      )}

      {/* Desktop: 2-col grid — hidden on mobile */}
      <div
        className="hidden lg:grid lg:grid-cols-2"
        style={{ gap: 'var(--space-lg, 24px)' }}
        aria-label="Regional comparison panels"
      >
        {mapPanel}
        {tablePanel}
      </div>

      {/* Mobile: single-col with ViewToggle */}
      <div className="lg:hidden">
        <TabStrip
          options={VIEW_OPTIONS}
          value={mobileView}
          onChange={setMobileView}
          ariaLabel="Regional comparison view"
          size="md"
          className="mb-4"
        />

        <TabStripPanel id="map" activeId={mobileView}>
          {mapPanel}
        </TabStripPanel>

        <TabStripPanel id="table" activeId={mobileView}>
          {tablePanel}
        </TabStripPanel>
      </div>
    </SectionWrapper>
  );
}
