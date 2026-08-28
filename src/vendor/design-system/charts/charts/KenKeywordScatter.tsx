'use client';

/**
 * KenKeywordScatter · positioned keyword cloud · Ken DS chart.
 *
 * WHY  · §11 Industry Analysis and §16 Future Outlook need a text-weight
 *        visualization showing relative importance of trends/signals. Classic
 *        word-cloud layout with Ken brand typography. NOT Bricolage — DM Sans
 *        only (Ken font pair · MEMORY decision 2026-05-25). Refs show keyword
 *        scatter in strategic outlook panels.
 *
 * WHAT · Absolute-positioned text items inside a relative container. Dual
 *        encoding: font-size (weight → scale) + opacity (weight → visibility).
 *        Positions deterministic via seeded spiral layout (stable across re-renders).
 *        Hover: lift + brighten + scale 1.05. Click callback for drill-down.
 *
 * WHEN · §11 top technology trends · §16 strategic signals · any 15-40 keyword
 *        visualization. Weight range 0-1 (1 = most important).
 *
 * WHERE · `design-system/core-v2/src/charts/charts/KenKeywordScatter.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenKeywordScatter
 *          keywords={[
 *            { id: 'k1', text: 'AI-vision', weight: 1.0 },
 *            { id: 'k2', text: 'Reefer-EV', weight: 0.85 },
 *          ]}
 *          width={800}
 *          height={400}
 *        />
 *        ```
 *
 * A11y · role="list" + role="listitem" per keyword + aria-label on wrapper.
 *        Focus-visible styles on interactive keywords.
 *
 * @module design-system/core-v2/src/charts/charts/KenKeywordScatter
 */

import { useMemo, useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChartReveal } from '../primitives/ChartReveal';
import { ChartSkeleton } from '../states/ChartSkeleton';
import { ChartEmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { KEN_CHART_FONT, KEN_CHART_SERIES_ARRAY } from '../theme/tokens';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KeywordItem {
  id: string;
  text: string;
  /** Importance weight 0-1 · drives font-size + opacity */
  weight: number;
  /** Optional color override · default = KEN_CHART_SERIES_ARRAY rotation by index */
  color?: string;
}

export interface KenKeywordScatterProps {
  keywords: readonly KeywordItem[];
  /** Container width px · default 800 */
  width?: number;
  /** Container height px · default 400 */
  height?: number;
  /** Minimum font size px for weight=0 items · default 11 */
  minFontSize?: number;
  /** Maximum font size px for weight=1 items · default 28 */
  maxFontSize?: number;
  /** Minimum opacity for weight=0 items · default 0.45 */
  minOpacity?: number;
  /** Maximum opacity for weight=1 items · default 1 */
  maxOpacity?: number;
  /** ARIA label for the container */
  ariaLabel?: string;
  /** Surface context */
  surface?: ChartSurface;
  /** Loading state */
  loading?: boolean;
  /** Empty state */
  empty?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Disable ChartReveal entrance · @default false */
  disableReveal?: boolean;
  /** Keyword click callback */
  onKeywordClick?: (keyword: KeywordItem) => void;
  /** Optional className on outer wrapper */
  className?: string;
}

// ─── Deterministic position algorithm ────────────────────────────────────────
// Simple Lehmer LCG for deterministic pseudo-random numbers seeded by keyword id.
// Ensures positions are stable across re-renders (no React hydration mismatch).

function lcgRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashId(id: string): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) + h) ^ id.charCodeAt(i);
  }
  return h >>> 0;
}

interface Pos { x: number; y: number }

/**
 * Computes positions for all keywords using seeded grid-jitter layout.
 * Distributes keywords across container area · prevents center-cluster.
 * Each keyword placed in a grid cell + small jittered offset · deterministic by id.
 * Heavier keywords get earlier (more central) cells when sorted by weight descending.
 */
function computePositions(
  keywords: readonly KeywordItem[],
  width: number,
  height: number,
  minFontSize: number,
  maxFontSize: number,
): Pos[] {
  const sorted = [...keywords].sort((a, b) => b.weight - a.weight);
  const padding = 16;
  const n = sorted.length;

  // Grid dimensions · aim for ~16:9 aspect ratio cells (matching common container)
  const aspect = width / height;
  const cols = Math.ceil(Math.sqrt(n * aspect));
  const rows = Math.ceil(n / cols);
  const cellW = (width - padding * 2) / cols;
  const cellH = (height - padding * 2) / rows;

  // Cell visit order · spiral from center outward · heavier keywords near center
  const visitOrder: Array<{ row: number; col: number }> = [];
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      visitOrder.push({ row: r, col: c });
    }
  }
  visitOrder.sort((a, b) => {
    const da = Math.hypot(a.col - cx, a.row - cy);
    const db = Math.hypot(b.col - cx, b.row - cy);
    return da - db;
  });

  const positions: Pos[] = new Array(n);

  sorted.forEach((kw, i) => {
    const cell = visitOrder[i];
    const rand = lcgRand(hashId(kw.id));
    // Center of cell + jitter (±30% of cell size)
    const jitterX = (rand() - 0.5) * cellW * 0.6;
    const jitterY = (rand() - 0.5) * cellH * 0.6;
    const fontSize = minFontSize + (maxFontSize - minFontSize) * kw.weight;
    const estW = kw.text.length * fontSize * 0.55;
    const estH = fontSize * 1.3;
    const cellCenterX = padding + cell.col * cellW + cellW / 2;
    const cellCenterY = padding + cell.row * cellH + cellH / 2;
    const rawX = cellCenterX + jitterX - estW / 2;
    const rawY = cellCenterY + jitterY - estH / 2;

    positions[i] = {
      x: Math.max(padding, Math.min(width - estW - padding, rawX)),
      y: Math.max(padding, Math.min(height - estH - padding, rawY)),
    };
  });

  // Map back to original order
  const result: Pos[] = new Array(keywords.length);
  sorted.forEach((kw, i) => {
    const origIdx = keywords.findIndex((k) => k.id === kw.id);
    if (origIdx !== -1) result[origIdx] = positions[i];
  });
  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KenKeywordScatter({
  keywords,
  width = 800,
  height = 400,
  minFontSize = 11,
  maxFontSize = 28,
  minOpacity = 0.45,
  maxOpacity = 1,
  ariaLabel,
  surface = 'light',
  loading,
  empty,
  errorMessage,
  disableReveal = false,
  onKeywordClick,
  className,
}: KenKeywordScatterProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDark = surface === 'dark';
  const containerRef = useRef<HTMLDivElement | null>(null);
  // PART B fix: dim-others pattern per Bible § 2.2 Scatter
  // Hovered = full opacity + scale 1.05 · others = opacity 0.3 + label hidden (via opacity)
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Track actual rendered container width for responsive position recompute
  const [actualWidth, setActualWidth] = useState(width);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;

    // RAF debounce: cancel pending frame on new fire — prevents per-pixel
    // layout recompute during drag-resize. Max one recompute per frame.
    let rafId: number | null = null;

    const ro = new ResizeObserver((entries) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const entry = entries[0];
        if (entry) {
          const w = Math.floor(entry.contentRect.width);
          if (w > 0) setActualWidth(w);
        }
        rafId = null;
      });
    });

    ro.observe(el);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const positions = useMemo(
    () => computePositions(keywords, actualWidth, height, minFontSize, maxFontSize),
    [keywords, actualWidth, height, minFontSize, maxFontSize],
  );

  // State guards AFTER all hooks
  if (loading)      return <ChartSkeleton type="bubble" height={height} />;
  if (empty)        return <ChartEmptyState title="No keywords available" />;
  if (errorMessage) return <ErrorState message={errorMessage} />;

  return (
    <ChartReveal disabled={disableReveal}>
      <div
        className={['w-full', className ?? ''].join(' ')}
        role="img"
        aria-label={ariaLabel ?? 'Keyword importance chart'}
      >
        <div
          ref={containerRef}
          role="list"
          aria-label={ariaLabel ?? 'Keywords by importance'}
          style={{
            position: 'relative',
            width: '100%',
            height,
            overflow: 'hidden',
            background: isDark ? 'transparent' : 'transparent',
          }}
        >
          {keywords.map((kw, i) => {
            const pos = positions[i] ?? { x: 0, y: 0 };
            const fontSize = minFontSize + (maxFontSize - minFontSize) * kw.weight;
            // G.7 Phase 5 a11y fix: opacity encoding causes WCAG 1.4.3 failures on light surface.
            // At minOpacity=0.45 · #5e51c8 on white = 2.7:1 after alpha compositing — fails 4.5:1.
            // Light surface: weight encoded by font-size only (opacity = 1) per WCAG compliance.
            // Dark surface: dual encoding via opacity (dark bg gives headroom for alpha compositing).
            const baseOpacity = isDark
              ? minOpacity + (maxOpacity - minOpacity) * kw.weight
              : 1;
            // FIX 3 FINAL (G.10): WCAG 4.5:1 floor for text on white · within Ken periwinkle/perano family.
            // Alternate 3 distinct hues from EXISTING palette · creates visual variety without leaving brand.
            //   #5e51c8 = purple-700 (Ken accentEmphasis) · ~7:1 on white ✓
            //   #3d3499 = purple-900 (deepest periwinkle in original) · ~10:1 on white ✓
            //   #4b6694 = perano-900 (deepest perano blue · existing family) · ~7:1 on white ✓
            const LIGHT_SAFE_COLORS = [
              '#5e51c8',  // purple-700 periwinkle deep
              '#4b6694',  // perano-900 deep blue (cool hue variant within Ken palette)
              '#3d3499',  // purple-900 darkest periwinkle
              '#4b6694',  // alternate perano
              '#5e51c8',  // alternate periwinkle
            ];
            const colorPalette = isDark ? KEN_CHART_SERIES_ARRAY : LIGHT_SAFE_COLORS;
            const color = kw.color ?? colorPalette[i % colorPalette.length];
            const isClickable = !!onKeywordClick;
            const transition = prefersReducedMotion ? undefined : 'transform 0.15s ease-out, opacity 0.15s ease-out';
            // PART B fix: Bible § 2.2 Scatter · dim others 0.3 · hovered = full opacity + scale
            const isHoveredKw = hoveredId === kw.id;
            const isDimmedKw = hoveredId !== null && !isHoveredKw;
            const effectiveOpacity = isDimmedKw ? 0.3 : isHoveredKw ? 1 : baseOpacity;

            return (
              <span
                key={kw.id}
                role="listitem"
                tabIndex={isClickable ? 0 : undefined}
                aria-label={`${kw.text} · weight ${Math.round(kw.weight * 100)}%`}
                onClick={isClickable ? () => onKeywordClick(kw) : undefined}
                onKeyDown={isClickable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onKeywordClick(kw); }
                } : undefined}
                onMouseEnter={(e) => {
                  setHoveredId(kw.id);
                  if (!prefersReducedMotion) {
                    const el = e.currentTarget;
                    el.style.transform = `translate(${pos.x}px, ${pos.y}px) translateY(-2px) scale(1.05)`;
                  }
                }}
                onMouseLeave={(e) => {
                  setHoveredId(null);
                  if (!prefersReducedMotion) {
                    const el = e.currentTarget;
                    el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                  }
                }}
                onFocus={(e) => {
                  setHoveredId(kw.id);
                  e.currentTarget.style.outline = '2px solid rgba(148,136,236,0.6)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  setHoveredId(null);
                  e.currentTarget.style.outline = 'none';
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  fontSize,
                  opacity: effectiveOpacity,
                  fontFamily: KEN_CHART_FONT.sans,
                  fontWeight: kw.weight > 0.7 ? 700 : kw.weight > 0.4 ? 500 : 400,
                  color,
                  cursor: isClickable ? 'pointer' : 'default',
                  transition,
                  userSelect: 'none',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  // Focus ring for keyboard nav
                  outline: 'none',
                }}
              >
                {kw.text}
              </span>
            );
          })}
        </div>
      </div>
    </ChartReveal>
  );
}
