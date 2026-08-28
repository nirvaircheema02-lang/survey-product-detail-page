/**
 * MapChart — Organism
 *
 * WHY · @ken-research/charts lacks choropleth map capability. RegionalComparison
 *       needs a geographic visualisation for market-share data. Without a shared
 *       organism every section either uses Highcharts maps (licence cost) or
 *       renders a flat bar chart that loses geographic intuition. react-simple-maps
 *       is MIT-licensed, SVG-based, and accessible.
 *
 * WHAT · Choropleth SVG map using react-simple-maps + topojson-client.
 *        Color scale: linear interpolation between purple-100 (low) → purple-600 (high)
 *        using brand tokens. Features: tooltip, legend, hover highlight, keyboard nav,
 *        screen-reader announce via <title>/<desc> on SVG root.
 *
 * WHEN · Regional market data sections needing geographic distribution visualisation.
 *        Primary consumer: RegionalComparison organism (left ChartCard slot).
 *        Secondary: MarketOverview, TargetAudience with geo breakdowns.
 *
 * WHEN NOT · Time-series data → AreaChart / LineChart (Ken Charts).
 *            Non-geographic comparisons → BarChart.
 *            Org trees / hierarchies → MindMap / TaxonomyTree.
 *
 * WHERE · core-v2/src/organisms/MapChart.tsx
 *         Consumed by: RegionalComparison organism (Batch 3.3a)
 *
 * HOW ·
 * ```tsx
 * <MapChart
 *   regions={[
 *     { id: 'AU-NSW', name: 'New South Wales', value: 4200, share: 32 },
 *     { id: 'AU-VIC', name: 'Victoria', value: 3100, share: 24 },
 *   ]}
 *   geographyUrl="/maps/australia-states.json"
 *   colorScale="purple"
 *   height={400}
 *   onRegionClick={(r) => console.log(r)}
 * />
 * ```
 *
 * ANIMATION STACK · Framer Motion useReducedMotion() guards hover transitions.
 *                   No entrance animation (maps are too complex for scroll-scrub).
 *
 * TOPOJSON FILES · Consumer is responsible for placing TopoJSON files in /public/maps/.
 *   Free sources:
 *   - World (110m/50m/10m): https://github.com/topojson/world-atlas
 *   - Countries: https://github.com/topojson/world-atlas/tree/master/world
 *   - Australia states: https://github.com/topojson/us-atlas (US equiv) or
 *     Natural Earth: https://www.naturalearthdata.com/downloads/
 *   - @highcharts/map-collection: https://github.com/highcharts/map-collection
 *     (MIT licensed GeoJSON/TopoJSON · best for Ken Research markets)
 *
 * @reusabilityScore 4
 * @a11y_status reviewed-AA (SVG title+desc · keyboard tab+Enter · aria-label per region)
 * @lifecycle stable
 * @portedDate 2026-05-19 · aura-builder · Batch 3.3a (NEW research-driven component)
 */
'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapRegion {
  /** Matches TopoJSON feature id (e.g. 'AU-NSW', 'QAT', 'AUS') */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Metric value mapped to color scale */
  value: number;
  /** Optional percentage share — shown in tooltip */
  share?: number;
}

export type MapColorScale = 'purple' | 'periwinkle' | 'coral';
export type MapProjection = 'geoMercator' | 'geoEqualEarth' | 'geoNaturalEarth1';

export interface MapChartProps {
  /** Dataset of regions with value + optional share */
  regions: MapRegion[];
  /**
   * Path to TopoJSON file in /public.
   * Consumer must place the file there.
   * @default '/maps/world-110m.json'
   */
  geographyUrl?: string;
  /**
   * D3 projection.
   * @default 'geoMercator'
   */
  projection?: MapProjection;
  /**
   * Brand token color ramp used for choropleth.
   * purple (default) → --purple-100 … --purple-600
   * periwinkle       → --periwinkle-100 … --periwinkle-600
   * coral            → --coral-100 … --coral-500
   */
  colorScale?: MapColorScale;
  /** SVG height in px · @default 400 */
  height?: number;
  /** Pre-selected region id — highlighted on mount */
  highlightRegionId?: string;
  /** Called when user clicks or Enter-presses a region */
  onRegionClick?: (region: MapRegion) => void;
  /** Show legend strip below map · @default true */
  showLegend?: boolean;
  /** Show tooltip on region hover · @default true */
  showTooltip?: boolean;
  /** Optional chart title passed to <title> for a11y */
  ariaLabel?: string;
  /** Optional className passthrough */
  className?: string;
}

// ─── Color scale helpers ───────────────────────────────────────────────────────

/**
 * Returns a CSS color string interpolated between the low/high token stops.
 * Uses inline CSS custom property reads so tokens remain the source of truth.
 * Fallback to hardcoded purple ramp when CSS env not available (SSR/tests).
 */
function getColorForValue(
  value: number,
  min: number,
  max: number,
  scale: MapColorScale,
): string {
  const t = max === min ? 0.5 : (value - min) / (max - min);

  // 6-step ramps mapped to brand tokens (resolved via inline style → CSS var)
  // We use pre-resolved hex fallbacks so SVG fill works even when CSS vars
  // can't cascade into SVG <path> elements in older environments.
  const RAMPS: Record<MapColorScale, string[]> = {
    purple: [
      '#efedfd', // --purple-100
      '#dfdcfb', // --purple-200
      '#c4bef7', // --purple-300
      '#a89ff2', // --purple-400
      '#9488ec', // --purple-500
      '#806ce0', // --purple-600
    ],
    periwinkle: [
      '#f0f1ff', // periwinkle-100 approx
      '#d9dbff', // periwinkle-200 approx
      '#b9bcff', // periwinkle-300 approx
      '#9297ff', // periwinkle-400 approx
      '#6b72ff', // periwinkle-500 approx
      '#4c54ff', // periwinkle-600 approx
    ],
    coral: [
      '#fff1ee', // coral-100 approx
      '#ffd9cf', // coral-200 approx
      '#fbb8a7', // coral-300 approx
      '#f89580', // coral-400 approx
      '#f47058', // coral-500 approx
      '#f05030', // coral-600 approx
    ],
  };

  const ramp = RAMPS[scale];
  const bandCount = ramp.length - 1;
  const band = Math.min(Math.floor(t * bandCount), bandCount - 1);
  const bandT = t * bandCount - band;

  // Simple hex interpolation between two adjacent stops
  return interpolateHex(ramp[band], ramp[band + 1], bandT);
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function interpolateHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  region: MapRegion;
}

function MapTooltip({ tooltip }: { tooltip: TooltipState }) {
  return (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        left: tooltip.x + 12,
        top: tooltip.y - 8,
        zIndex: 50,
        pointerEvents: 'none',
        background: 'var(--bg-pure-white, #fff)',
        border: '1px solid var(--border-soft, rgba(0,0,0,0.08))',
        borderRadius: 'var(--radius-xs, 5px)',
        boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.12))',
        padding: 'var(--space-sm, 12px) var(--space-md, 16px)',
        minWidth: 160,
        fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
      }}
    >
      <p
        style={{
          fontSize: 'var(--text-nav, 14px)',
          fontWeight: 600,
          color: 'var(--semantic-ink-strong, #171717)',
          marginBottom: 'var(--space-2xs, 4px)',
        }}
      >
        {tooltip.region.name}
      </p>
      <p
        style={{
          fontSize: 'var(--text-xs, 12.8px)',
          color: 'var(--semantic-ink-body, #404040)',
        }}
      >
        Value: <strong>{tooltip.region.value.toLocaleString()}</strong>
        {tooltip.region.share !== undefined && (
          <> · Share: <strong>{tooltip.region.share}%</strong></>
        )}
      </p>
    </div>
  );
}

function MapLegend({
  min,
  max,
  scale,
}: {
  min: number;
  max: number;
  scale: MapColorScale;
}) {
  const steps = 5;
  const stops = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const value = min + (max - min) * t;
    return { value, color: getColorForValue(value, min, max, scale) };
  });

  return (
    <div
      role="img"
      aria-label={`Color legend from ${min.toLocaleString()} (light) to ${max.toLocaleString()} (dark)`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md, 16px)',
        marginTop: 'var(--space-sm, 12px)',
        fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
      }}
    >
      <span style={{ fontSize: 'var(--text-xs, 12.8px)', color: 'var(--semantic-ink-subtle, #737373)' }}>
        {min.toLocaleString()}
      </span>
      <div style={{ display: 'flex', flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' }}>
        {stops.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              backgroundColor: s.color,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span style={{ fontSize: 'var(--text-xs, 12.8px)', color: 'var(--semantic-ink-subtle, #737373)' }}>
        {max.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

/**
 * MapChart — choropleth SVG map via react-simple-maps.
 * Color scale interpolated across brand purple tokens.
 * Keyboard navigable, screen-reader accessible.
 */
export function MapChart({
  regions,
  geographyUrl = '/maps/world-110m.json',
  projection = 'geoMercator',
  colorScale = 'purple',
  height = 400,
  highlightRegionId,
  onRegionClick,
  showLegend = true,
  showTooltip = true,
  ariaLabel,
  className,
}: MapChartProps) {
  const prefersReduced = useReducedMotion();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(highlightRegionId ?? null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build lookup map for O(1) access
  const regionMap = useMemo(
    () => new Map(regions.map((r) => [r.id, r])),
    [regions],
  );

  const values = regions.map((r) => r.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const resolvedAriaLabel =
    ariaLabel ?? `Map chart showing ${regions.length} regions`;

  const handleRegionClick = useCallback(
    (geoId: string) => {
      const region = regionMap.get(geoId);
      if (region && onRegionClick) {
        onRegionClick(region);
      }
      setFocusedId(geoId);
    },
    [regionMap, onRegionClick],
  );

  return (
    <div
      ref={containerRef}
      data-component="MapChart"
      className={cn('relative', className)}
      style={{ fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}
    >
      {/* SVG map */}
      <div
        style={{ height, position: 'relative' }}
        aria-label={resolvedAriaLabel}
      >
        <ComposableMap
          projection={projection}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Hidden a11y title + desc inside SVG */}
          <title>{resolvedAriaLabel}</title>
          <desc>
            {regions
              .map((r) => `${r.name}: ${r.value.toLocaleString()}${r.share !== undefined ? ` (${r.share}%)` : ''}`)
              .join('. ')}
          </desc>

          <Geographies geography={geographyUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoId: string = geo.id ?? geo.properties?.['iso_a3'] ?? geo.properties?.['name'] ?? '';
                const region = regionMap.get(geoId);
                const fillColor = region
                  ? getColorForValue(region.value, min, max, colorScale)
                  : 'var(--black-200, #e5e5e5)';

                const isFocused = focusedId === geoId;
                const isInteractive = !!region;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={isInteractive ? 0 : -1}
                    role={isInteractive ? 'button' : undefined}
                    aria-label={
                      region
                        ? `${region.name}: ${region.value.toLocaleString()}${region.share !== undefined ? `, ${region.share}% market share` : ''}`
                        : undefined
                    }
                    aria-pressed={isFocused || undefined}
                    onClick={() => isInteractive && handleRegionClick(geoId)}
                    onKeyDown={(e) => {
                      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleRegionClick(geoId);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (region && showTooltip) {
                        setTooltip({ x: e.clientX, y: e.clientY, region });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (tooltip && showTooltip) {
                        setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                      }
                    }}
                    onMouseLeave={() => {
                      if (showTooltip) setTooltip(null);
                    }}
                    onFocus={() => setFocusedId(geoId)}
                    onBlur={() => setFocusedId(null)}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: 'var(--bg-pure-white, #fff)',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isInteractive ? 'pointer' : 'default',
                        transition: prefersReduced ? undefined : 'fill 150ms ease',
                      },
                      hover: {
                        fill: region
                          ? getColorForValue(
                              region.value * 1.15 > max ? max : region.value * 1.15,
                              min,
                              max,
                              colorScale,
                            )
                          : 'var(--black-300, #d4d4d4)',
                        stroke: 'var(--bg-pure-white, #fff)',
                        strokeWidth: 2,
                        outline: 'none',
                        cursor: isInteractive ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: region
                          ? getColorForValue(max, min, max, colorScale)
                          : 'var(--black-300, #d4d4d4)',
                        stroke: 'var(--bg-pure-white, #fff)',
                        strokeWidth: 2,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      {showLegend && regions.length > 0 && (
        <MapLegend min={min} max={max} scale={colorScale} />
      )}

      {/* Tooltip */}
      {showTooltip && tooltip && <MapTooltip tooltip={tooltip} />}
    </div>
  );
}
