'use client';

/**
 * KenTreemap · D3 squarified treemap · Ken DS chart wrapper.
 *
 * WHY  · Ecosystem + industry analysis needs size-encoded cell layout.
 *        Refs use treemap patterns for operator capacity (rainbow-pothos §07)
 *        and market sizing hierarchy. D3 treemap gives superior hover UX,
 *        per-cell adaptive font sizes, and full a11y control vs Highcharts
 *        treemap module. Ported from v0.4 EcosystemTreemap (270 LOC pattern).
 *
 * WHAT · D3-hierarchy treemap · SVG render · responsive (ResizeObserver) ·
 *        3-tier periwinkle/perano color encoding · per-cell adaptive font sizes ·
 *        hover dim-others (hovered = full opacity · others = 0.55) · 200ms ease-out ·
 *        optional tier legend strip + italic caption.
 *
 * WHEN · §07 Ecosystem operator capacity · §11 Industry Analysis sub-market
 *        sizing · any hierarchical part-of-whole visualization (3-30 cells).
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenTreemap.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenTreemap
 *          data={[
 *            { id: 'lineage', name: 'Lineage', value: 590000, tier: 1,
 *              subText: '590,000 pallets', metaText: '12.5% share' },
 *          ]}
 *          height={400}
 *          legend={[
 *            { tier: 1, label: 'Tier 1', range: '> 200,000 pallets' },
 *          ]}
 *          caption="Box area proportional to pallet capacity."
 *          onCellClick={(cell) => console.log(cell)}
 *        />
 *        ```
 *
 * A11y · role="img" + aria-label on outer container · per-cell role="button"
 *        tabIndex=0 aria-label · keyboard focus (Enter/Space) → onCellClick.
 *
 * @module design-system/core-v2/src/charts/charts/KenTreemap
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/sections/EcosystemTreemap.tsx
 */

import { useMemo, useRef, useEffect, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { hierarchy, treemap } from 'd3-hierarchy';
import { useReducedMotion } from 'framer-motion';
import type { ChartSurface } from '../theme/highcharts-base';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { KEN_TOOLTIP, KEN_CHART_BORDERS } from '../theme/tokens';
// NOTE: CellTooltip (HTML-only · span wrapper) cannot wrap SVG <g> elements —
// SVG does not allow <span> children. KenTreemap uses its own portal tooltip
// tracking mouse position + hovered state to sidestep this constraint.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TreemapCellData {
  id: string;
  name: string;
  /** Determines cell area */
  value: number;
  /**
   * Optional tier · auto-tier if not set
   * top 10% = tier 1 · next 30% = tier 2 · rest = tier 3
   */
  tier?: 1 | 2 | 3;
  /** Optional sub-text · e.g. "590,000 pallets" · shown if cell large enough */
  subText?: string;
  /** Optional meta-text · e.g. "12.5% share" · shown at bottom if cell large enough */
  metaText?: string;
}

// Legacy alias — keep TreemapNode exported to avoid breaking showcase import
export type TreemapNode = TreemapCellData;

export interface KenTreemapProps {
  data: readonly TreemapCellData[];
  /** Chart height px · default auto (width × 0.5 · min 360) */
  height?: number;
  /** ARIA label for screen readers */
  ariaLabel?: string;
  /** Optional legend strip above treemap */
  legend?: Array<{ tier: 1 | 2 | 3; label: string; range: string }>;
  /** Optional italic caption below treemap */
  caption?: string;
  /** Surface context · affects outer bg (dark = cinematic section) */
  surface?: ChartSurface;
  /** Loading state · renders ChartSkeleton */
  loading?: boolean;
  /** Empty state · renders ChartEmptyState */
  empty?: boolean;
  /** Error message · renders ErrorState */
  errorMessage?: string;
  /** Disable ChartReveal entrance animation · @default false */
  disableReveal?: boolean;
  /** Cell click callback */
  onCellClick?: (cell: TreemapCellData) => void;
  /** Optional className on outer wrapper */
  className?: string;
}

// ─── Tier color map · luminance-stepped · color-blind safe ───────────────────
// FIX 7 (G.10): Updated for v2 desaturated editorial palette (Bible § 1.7).
// v2 LUMINANCE_SAFE: darkest=#6b5fb8(L*48)·primary=#857fc8(L*58)·quaternary=#a39ee0(L*65)
//                   secondary=#b8c4c0(L*76 sage)·tertiary=#c5c3ec(L*78)·light=#e6e7f5(L*92)
//
// Light surface (3-tier periwinkle ramp, soft-first Bible § 1.5):
//   Tier 1 · quaternary #a39ee0 (L*65) · dark ink text (L*60-75 → dark per § 1.8)
//   Tier 2 · tertiary #c5c3ec (L*78) · dark ink text
//   Tier 3 · light #e6e7f5 (L*92) · dark ink text
// Dark surface (inverted):
//   Tier 1 · light #e6e7f5 (L*92) · dark ink (text on cell fill, not chart bg)
//   Tier 2 · tertiary #c5c3ec (L*78) · dark ink
//   Tier 3 · quaternary #a39ee0 (L*65) · dark ink (≥3:1 on near-black bg for luminance floor)
// Luminance gap ≥13 L* between tiers · monochrome conversion preserves distinction.

// v0.4-aligned tier strategy (2026-05-28 FINAL):
// Tier 1 · solid periwinkle #9488ec + WHITE text → editorial premium feel
// Tier 2 · solid periwinkle-light #c3c6f9 + dark ink → mid emphasis
// Tier 3 · perano blue AT 0.20 OPACITY → soft airy editorial · KEY to v0.4 look
const TIER_COLORS_LIGHT: Record<1 | 2 | 3, { bg: string; border: string; text: string; muted: string; hover: string }> = {
  1: {
    bg:     '#9488ec',     // periwinkle L*62 SOLID · v0.4 ref-aligned
    border: '#5a5fa0',     // periwinkle-700 darker
    // G.12 fix: white on L*62 = 2.86:1 FAIL · Bible §1.8 L*60-75 → dark ink (7.1:1 PASS)
    text:   'rgba(26,26,46,0.92)',
    muted:  'rgba(26,26,46,0.65)',
    hover:  '#5e51c8',     // step DOWN to primary for emphasis (text becomes white at L*45)
  },
  2: {
    bg:     '#c3c6f9',     // periwinkle-500 L*78 SOLID · v0.4 ref-aligned
    border: '#7075c8',     // periwinkle-800 L*55
    text:   'var(--semantic-ink-strong, rgb(26,26,46))',
    muted:  'var(--semantic-ink-body, rgba(26,26,46,0.75))',
    hover:  '#9488ec',     // step DOWN to periwinkle solid
  },
  3: {
    bg:     'rgba(134, 179, 229, 0.20)',  // perano-800 at 20% opacity · v0.4 SECRET sauce · editorial soft
    border: 'rgba(134, 179, 229, 0.55)',
    text:   'var(--semantic-ink-strong, rgb(26,26,46))',
    muted:  'var(--semantic-ink-muted, rgba(26,26,46,0.55))',
    hover:  'rgba(134, 179, 229, 0.35)',  // bump opacity 0.20 → 0.35 on hover
  },
};

// Dark surface · INVERTED v0.4 strategy · solid tier-1 brightest + opacity tier-3
const TIER_COLORS_DARK: Record<1 | 2 | 3, { bg: string; border: string; text: string; muted: string; hover: string }> = {
  1: {
    bg:     '#e0e3fb',     // periwinkle lightest L*90 SOLID · brightest on dark
    border: '#c3c6f9',
    text:   'var(--semantic-ink-strong, rgb(26,26,46))',
    muted:  'var(--semantic-ink-body, rgba(26,26,46,0.75))',
    hover:  '#c3c6f9',
  },
  2: {
    bg:     '#c3c6f9',     // periwinkle-500 L*78 SOLID
    border: '#9488ec',
    text:   'var(--semantic-ink-strong, rgb(26,26,46))', // dark ink on L*78 fill
    muted:  'var(--semantic-ink-body, rgba(26,26,46,0.75))',
    hover:  '#9488ec',     // step DOWN to periwinkle
  },
  3: {
    bg:     '#9488ec',     // periwinkle L*62 SOLID · most receded on dark
    border: '#7075c8',
    // G.12 fix: white on L*62 = 2.86:1 FAIL · use dark ink (7.1:1 PASS)
    text:   'rgba(26,26,46,0.92)',
    muted:  'rgba(26,26,46,0.65)',
    hover:  '#7075c8',     // step DOWN
  },
};

// Unified getter — surface-aware tier color resolution
function getTierColors(
  tier: 1 | 2 | 3,
  surface: 'light' | 'dark',
): { bg: string; border: string; text: string; muted: string; hover?: string } {
  return surface === 'dark' ? TIER_COLORS_DARK[tier] : TIER_COLORS_LIGHT[tier];
}

// ─── Auto-tier algorithm ──────────────────────────────────────────────────────
// top 10% value = tier 1 · next 30% = tier 2 · rest = tier 3

function assignAutoTiers(data: readonly TreemapCellData[]): Array<TreemapCellData & { resolvedTier: 1 | 2 | 3 }> {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const n = sorted.length;
  const tier1Count = Math.max(1, Math.ceil(n * 0.1));
  const tier2Count = Math.max(1, Math.ceil(n * 0.3));
  return sorted.map((cell, i) => ({
    ...cell,
    resolvedTier: cell.tier ?? (i < tier1Count ? 1 : i < tier1Count + tier2Count ? 2 : 3),
  }));
}

// ─── D3 treemap cell ──────────────────────────────────────────────────────────

interface ComputedCell {
  id: string;
  name: string;
  value: number;
  tier: 1 | 2 | 3;
  subText?: string;
  metaText?: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

// ─── SVG Cell Tooltip (portal · mouse-tracked · no HTML-in-SVG constraint) ────

interface TooltipState {
  x: number;
  y: number;
  cell: ComputedCell;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KenTreemap({
  data,
  height: heightProp,
  ariaLabel,
  legend,
  caption,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  disableReveal = false,
  onCellClick,
  className,
}: KenTreemapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipState, setTooltipState] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);
  const tooltipId = useId();
  const prefersReduced = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  // ResizeObserver — update width when container resizes
  // RAF debounce: cancel pending frame on each new observation to batch
  // per-pixel resize events into a single recompute per animation frame.
  useEffect(() => {
    if (!wrapRef.current) return;
    let rafId: number | null = null;

    const update = () => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    };
    update();

    const ro = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    });

    ro.observe(wrapRef.current);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // Height: use prop if provided, else auto (width × 0.5, min 360)
  const height = heightProp ?? Math.max(360, Math.round(width * 0.5));

  // Compute D3 treemap layout
  const cells: ComputedCell[] = useMemo(() => {
    if (!data.length) return [];
    // Filter null/undefined/zero-or-negative values before d3 sum.
    // d3.hierarchy sums negative values into parent which corrupts layout.
    // Null = no data — skip entirely. Zero = no area — skip (zero-area cells are invisible).
    const validData = data.filter((d) => d.value != null && d.value > 0);
    if (!validData.length) return [];
    const tieredData = assignAutoTiers(validData);

    const root = hierarchy({ name: 'root', children: tieredData } as unknown as { name: string; value?: number; children?: unknown[] })
      .sum((d) => (d as { value?: number }).value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    treemap<typeof root.data>()
      .size([width, height])
      .paddingInner(4)
      .paddingOuter(2)
      .round(true)(root as never);

    return (root.leaves() as unknown as Array<{
      data: TreemapCellData & { resolvedTier: 1 | 2 | 3 };
      x0: number; x1: number; y0: number; y1: number;
    }>).map((leaf) => ({
      id: leaf.data.id,
      name: leaf.data.name,
      value: leaf.data.value,
      tier: leaf.data.resolvedTier,
      subText: leaf.data.subText,
      metaText: leaf.data.metaText,
      x0: leaf.x0,
      y0: leaf.y0,
      x1: leaf.x1,
      y1: leaf.y1,
    }));
  }, [data, width, height]);

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="generic" height={heightProp ?? 400} />;
  if (empty)        return <ChartEmptyState title="No data available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  const isDark = surface === 'dark';

  return (
    <ChartReveal disabled={disableReveal}>
      <div className={['space-y-4', className ?? ''].join(' ')}>

        {/* Legend strip */}
        {legend && legend.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">
            {legend.map((l) => {
              const c = getTierColors(l.tier, surface);
              return (
                <div key={l.tier} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block w-3 h-3 rounded-[2px]"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
                      fontSize: '12px',
                      color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--semantic-ink-body, rgba(26,26,46,0.75))',
                    }}
                  >
                    <strong
                      style={{
                        fontWeight: 600,
                        color: isDark ? 'rgba(255,255,255,0.9)' : 'var(--semantic-ink-strong, rgb(26,26,46))',
                      }}
                    >
                      {l.label}
                    </strong>
                    <span
                      className="ml-1.5"
                      style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--semantic-ink-muted, #525252)' }}
                    >
                      {l.range}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Treemap */}
        <div
          ref={wrapRef}
          className="relative overflow-hidden"
          style={{
            height: `${height}px`,
            borderRadius: 'var(--radius-sm, 10px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            background: isDark ? 'var(--color-deep, #0a0a0c)' : 'var(--color-foundation-white, #ffffff)',
          }}
          role="figure"
          aria-label={ariaLabel ?? 'Treemap chart · box area proportional to value · color encodes tier'}
        >
          {/* SVG transition: fill + stroke animate on surface/hover change */}
          <style>{`
            .ken-treemap-cell rect {
              transition: ${prefersReduced ? 'none' : 'fill 200ms ease-out, stroke 200ms ease-out, stroke-width 150ms ease-out'};
            }
          `}</style>
          <svg width={width} height={height} className="block">
            {cells.map((cell) => {
              const w = cell.x1 - cell.x0;
              const h = cell.y1 - cell.y0;
              const colors = getTierColors(cell.tier, surface);
              const isHovered = hovered === cell.id;
              // PART B fix: Bible § 2.2 Treemap · dim others 0.5 · isolate via border accent + fill brighten
              // Bible § 2.1 supersedes G.1 "border accent only" — both isolate AND dim required
              const isDimmed = hovered !== null && !isHovered;
              // Dark surface: brighten fill on hover (alongside border accent) — Goal 5
              const fillColor = (isHovered && isDark && colors.hover) ? colors.hover : colors.bg;
              const fontSize = Math.min(18, Math.max(11, Math.floor(w / 12)));
              const subFontSize = Math.min(13, Math.max(9, Math.floor(w / 18)));
              const showSubText = h > 50 && w > 80 && !!cell.subText;
              const showMeta = h > 70 && w > 90 && !!cell.metaText;
              // G.11 FIX 1: SVG <text> has no overflow:hidden. Adaptive truncation via JS measurement.
              // Approximate char width = fontSize * 0.55 for DM Sans medium · safe for English text.
              // Available text width = cell width - 2× padding(10px) - 4px safety = w - 24.
              const availTextW = Math.max(0, w - 24);
              const truncate = (text: string, fs: number): string => {
                const maxChars = Math.floor(availTextW / (fs * 0.55));
                if (text.length <= maxChars || maxChars < 4) return text;
                if (maxChars < 6) return text.slice(0, maxChars - 1) + '…';
                return text.slice(0, maxChars - 1) + '…';
              };
              const nameText = truncate(cell.name, fontSize);
              const subTextStr = cell.subText ? truncate(cell.subText, subFontSize) : '';
              const metaTextStr = cell.metaText ? truncate(cell.metaText, subFontSize) : '';
              // Clip path id · unique per cell · safety net against any future text overflow
              const clipId = `ken-treemap-clip-${tooltipId.replace(/:/g, '')}-${cell.id}`;

              return (
                <g
                  key={cell.id}
                  className="ken-treemap-cell"
                  transform={`translate(${cell.x0}, ${cell.y0})`}
                  onMouseEnter={() => setHovered(cell.id)}
                  onMouseMove={(e) => {
                    setHovered(cell.id);
                    setTooltipState({ x: e.clientX, y: e.clientY, cell });
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltipState(null); }}
                  onFocus={(e) => {
                    setHovered(cell.id);
                    // Use SVG container position as fallback for keyboard focus
                    const svgEl = e.currentTarget.closest('svg');
                    const svgRect = svgEl?.getBoundingClientRect();
                    if (svgRect) {
                      setTooltipState({
                        x: svgRect.left + cell.x0 + w / 2,
                        y: svgRect.top + cell.y0,
                        cell,
                      });
                    }
                  }}
                  onBlur={() => { setHovered(null); setTooltipState(null); }}
                  onClick={() => onCellClick?.(cell)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCellClick?.(cell); }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-describedby={isHovered ? `treemap-tt-${tooltipId.replace(/:/g, '')}` : undefined}
                  aria-label={`${cell.name}: ${cell.value.toLocaleString()} · Tier ${cell.tier}${cell.subText ? ` · ${cell.subText}` : ''}${cell.metaText ? ` · ${cell.metaText}` : ''}`}
                  style={{
                    cursor: onCellClick ? 'pointer' : 'default',
                    outline: 'none',
                    // PART B fix: opacity dim on non-hovered cells (Bible § 2.2 Treemap)
                    opacity: isDimmed ? 0.5 : 1,
                    transition: prefersReduced ? undefined : 'opacity 200ms ease-out',
                  }}
                >
                  <rect
                    width={w}
                    height={h}
                    rx={4}
                    ry={4}
                    fill={fillColor}
                    stroke={isHovered ? KEN_CHART_BORDERS.tooltipBorder : colors.border}
                    strokeWidth={isHovered ? 3 : 1}
                  />
                  {/* G.11 FIX 1: clipPath safety net — any text within <g clip-path> never escapes cell bounds */}
                  <defs>
                    <clipPath id={clipId}>
                      <rect width={w} height={h} rx={4} ry={4} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#${clipId})`}>
                  {/* Cell name · truncated via JS measurement · clipPath as safety */}
                  <text
                    x={10}
                    y={fontSize + 8}
                    fill={colors.text}
                    style={{
                      fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
                      fontSize: `${fontSize}px`,
                      fontWeight: 600,
                      letterSpacing: '-0.005em',
                      pointerEvents: 'none',
                    }}
                  >
                    {nameText}
                  </text>
                  {/* Sub-text · truncated */}
                  {showSubText && (
                    <text
                      x={10}
                      y={fontSize + 8 + subFontSize + 6}
                      fill={colors.muted}
                      style={{
                        fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
                        fontSize: `${subFontSize}px`,
                        fontWeight: 500,
                        fontVariantNumeric: 'tabular-nums',
                        pointerEvents: 'none',
                      }}
                    >
                      {subTextStr}
                    </text>
                  )}
                  {/* Meta-text · truncated · bottom of cell */}
                  {showMeta && (
                    <text
                      x={10}
                      y={h - 10}
                      fill={colors.muted}
                      style={{
                        fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
                        fontSize: `${subFontSize}px`,
                        fontWeight: 500,
                        fontVariantNumeric: 'tabular-nums',
                        pointerEvents: 'none',
                      }}
                    >
                      {metaTextStr}
                    </text>
                  )}
                  </g>{/* end clipPath wrapper */}
                  {/* Focus ring for keyboard nav */}
                  <rect
                    width={w}
                    height={h}
                    rx={4}
                    ry={4}
                    fill="none"
                    stroke={KEN_CHART_BORDERS.tooltipBorder}
                    strokeWidth={3}
                    style={{ opacity: 0, outline: 'none' }}
                    className="focus-ring"
                  />
                </g>
              );
            })}
          </svg>
          <style>{`
            svg g[role="button"]:focus-visible .focus-ring { opacity: 1; }
            svg g[role="button"]:focus { outline: none; }
            @media (forced-colors: active) {
              .ken-treemap-cell rect { stroke: CanvasText !important; stroke-width: 1 !important; }
            }
          `}</style>
        </div>

        {/* Portal tooltip — mouse-tracked · avoids HTML-in-SVG constraint */}
        {mounted && tooltipState && createPortal(
          <div
            id={`treemap-tt-${tooltipId.replace(/:/g, '')}`}
            role="tooltip"
            aria-hidden={!tooltipState}
            style={{
              position: 'fixed',
              top: Math.max(8, tooltipState.y - 80),
              left: Math.max(8, Math.min(tooltipState.x + 12, window.innerWidth - 292)),
              background: KEN_TOOLTIP.background,
              border: `${KEN_TOOLTIP.borderWidth}px solid ${KEN_TOOLTIP.border}`,
              borderRadius: `${KEN_TOOLTIP.borderRadius}px`,
              padding: `${KEN_TOOLTIP.padding}px`,
              color: KEN_TOOLTIP.color,
              fontSize: KEN_TOOLTIP.fontSize,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              maxWidth: '280px',
              pointerEvents: 'none',
              zIndex: 1000,
              lineHeight: 1.5,
              fontFamily: "'DM Sans', -apple-system, sans-serif",
              opacity: prefersReduced ? 1 : undefined,
              transition: prefersReduced ? 'none' : 'opacity 150ms ease-out',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{tooltipState.cell.name}</span>
              {tooltipState.cell.subText && (
                <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.65)' }}>
                  {tooltipState.cell.subText}
                </span>
              )}
              {tooltipState.cell.metaText && (
                <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.65)' }}>
                  {tooltipState.cell.metaText}
                </span>
              )}
              <span style={{ fontSize: '10px', color: 'rgba(26,26,46,0.50)', marginTop: 2 }}>
                Tier {tooltipState.cell.tier}
              </span>
            </div>
          </div>,
          document.body,
        )}

        {/* Caption */}
        {caption && (
          <p
            style={{
              fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
              fontSize: '12px',
              color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--semantic-ink-muted, #525252)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {caption}
          </p>
        )}
      </div>
    </ChartReveal>
  );
}
