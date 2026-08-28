'use client';

/**
 * ChartSkeleton · loading placeholder for chart canvas areas.
 *
 * WHY  · Charts load async (Highcharts init + data fetch). Users see blank space
 *        without a skeleton — jarring and unprofessional. Skeleton maintains
 *        layout stability (no CLS) and communicates loading intent.
 *
 * WHAT · SVG-based gray-tone placeholder per chart type with optional shimmer.
 *        Shimmer: 1.5s ease-in-out infinite periwinkle-tinted animation.
 *        Respects prefers-reduced-motion (static placeholder when reduced).
 *
 * WHEN · Wrap chart components with `loading={true}` prop, which renders this
 *        skeleton instead of the chart. Also use directly in skeleton screens.
 *
 * WHERE · `design-system/core-v2/src/charts/states/ChartSkeleton.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ChartSkeleton type="bar" height={320} />
 *        <ChartSkeleton type="pie" height={280} animate={false} />
 *        ```
 *
 * A11y · role="status" + aria-label="Loading chart" on wrapper.
 *        Shimmer animation respects prefers-reduced-motion.
 *
 * @module design-system/core-v2/src/charts/states/ChartSkeleton
 */

import { useReducedMotion } from 'framer-motion';
// KEN_CHART_SERIES colors referenced as rgb literals below (primary #9488ec → rgba(148,136,236,x))

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonChartType = 'bar' | 'line' | 'pie' | 'bubble' | 'generic';

export interface ChartSkeletonProps {
  /** Chart type — renders type-appropriate SVG placeholder */
  type?: SkeletonChartType;
  /** Height in px · should match chart height · default 320 */
  height?: number;
  /** Width in px or CSS string · default '100%' */
  width?: number | string;
  /**
   * Enable shimmer animation.
   * Automatically disabled when prefers-reduced-motion is active.
   * @default true
   */
  animate?: boolean;
  /** Optional className on wrapper */
  className?: string;
}

// ─── Shimmer gradient ─────────────────────────────────────────────────────────

// Subtle periwinkle tint shimmer — brand-aligned, not generic gray
const SHIMMER_BASE = 'rgba(148, 136, 236, 0.08)';   // KEN_CHART_SERIES.primary at 8% opacity
const SHIMMER_PEAK = 'rgba(148, 136, 236, 0.18)';   // peak at 18%

const shimmerKeyframes = `
@keyframes ken-skeleton-shimmer {
  0%   { opacity: 0.6; }
  50%  { opacity: 1;   }
  100% { opacity: 0.6; }
}
`;

// ─── SVG shape sets per type ──────────────────────────────────────────────────

function BarShapes({ w, h }: { w: number; h: number }) {
  const bars = [
    { x: 40,  barH: h * 0.65, delay: 0 },
    { x: 100, barH: h * 0.45, delay: 0.2 },
    { x: 160, barH: h * 0.8,  delay: 0.4 },
    { x: 220, barH: h * 0.55, delay: 0.6 },
    { x: 280, barH: h * 0.7,  delay: 0.1 },
    { x: 340, barH: h * 0.4,  delay: 0.3 },
  ];
  const barW = Math.min(40, (w - 40) / bars.length - 8);
  return (
    <>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={h - b.barH - 20}
          width={barW}
          height={b.barH}
          rx={2}
          fill={SHIMMER_BASE}
        />
      ))}
      {/* X axis baseline */}
      <line x1={30} y1={h - 20} x2={w - 10} y2={h - 20} stroke={SHIMMER_BASE} strokeWidth={1} />
    </>
  );
}

function LineShapes({ w, h }: { w: number; h: number }) {
  const points = [
    [40, h * 0.6], [100, h * 0.4], [160, h * 0.55], [220, h * 0.3],
    [280, h * 0.45], [340, h * 0.25], [400, h * 0.35],
  ];
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
    .join(' ');
  return (
    <>
      <path d={pathD} fill="none" stroke={SHIMMER_BASE} strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={4} fill={SHIMMER_BASE} />
      ))}
      <line x1={30} y1={h - 20} x2={w - 10} y2={h - 20} stroke={SHIMMER_BASE} strokeWidth={1} />
    </>
  );
}

function PieShapes({ w, h }: { w: number; h: number }) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.38;
  const innerR = r * 0.55;
  // 4 arcs approximated as full circle + segments
  const segments = [
    { start: 0,   end: 130, fill: SHIMMER_BASE },
    { start: 132, end: 220, fill: SHIMMER_PEAK },
    { start: 222, end: 300, fill: SHIMMER_BASE },
    { start: 302, end: 358, fill: SHIMMER_BASE },
  ];

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(startAngle: number, endAngle: number, outerR: number, iR: number) {
    const s = polarToXY(startAngle, outerR);
    const e = polarToXY(endAngle, outerR);
    const si = polarToXY(endAngle, iR);
    const ei = polarToXY(startAngle, iR);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} L ${si.x} ${si.y} A ${iR} ${iR} 0 ${large} 0 ${ei.x} ${ei.y} Z`;
  }

  return (
    <>
      {segments.map((seg, i) => (
        <path key={i} d={arcPath(seg.start, seg.end, r, innerR)} fill={seg.fill} />
      ))}
    </>
  );
}

function BubbleShapes({ w, h }: { w: number; h: number }) {
  const bubbles = [
    { cx: w * 0.2,  cy: h * 0.5,  r: 30 },
    { cx: w * 0.5,  cy: h * 0.3,  r: 50 },
    { cx: w * 0.75, cy: h * 0.6,  r: 35 },
    { cx: w * 0.35, cy: h * 0.7,  r: 20 },
    { cx: w * 0.65, cy: h * 0.4,  r: 45 },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={i % 2 === 0 ? SHIMMER_BASE : SHIMMER_PEAK} />
      ))}
      <line x1={30} y1={h - 20} x2={w - 10} y2={h - 20} stroke={SHIMMER_BASE} strokeWidth={1} />
      <line x1={30} y1={10}     x2={30}      y2={h - 20} stroke={SHIMMER_BASE} strokeWidth={1} />
    </>
  );
}

function GenericShapes({ w, h }: { w: number; h: number }) {
  return (
    <>
      <rect x={10}      y={10}       width={w - 20}    height={h * 0.15} rx={3} fill={SHIMMER_BASE} />
      <rect x={10}      y={h * 0.2}  width={w * 0.6}   height={h * 0.08} rx={3} fill={SHIMMER_BASE} />
      <rect x={10}      y={h * 0.35} width={w - 20}    height={h * 0.5}  rx={3} fill={SHIMMER_PEAK} />
      <rect x={10}      y={h * 0.9}  width={w * 0.4}   height={h * 0.06} rx={3} fill={SHIMMER_BASE} />
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartSkeleton({
  type = 'generic',
  height = 320,
  width = '100%',
  animate = true,
  className,
}: ChartSkeletonProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;
  const svgW = 440; // viewBox width — scales via preserveAspectRatio

  return (
    <div
      className={['w-full', className ?? ''].join(' ')}
      role="status"
      aria-label="Loading chart"
      style={{ width, height, position: 'relative', overflow: 'hidden' }}
    >
      {shouldAnimate && <style>{shimmerKeyframes}</style>}
      <svg
        viewBox={`0 0 ${svgW} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height={height}
        style={{
          display: 'block',
          animation: shouldAnimate ? 'ken-skeleton-shimmer 1.5s ease-in-out infinite' : undefined,
        }}
        aria-hidden="true"
      >
        {type === 'bar'     && <BarShapes    w={svgW} h={height} />}
        {type === 'line'    && <LineShapes   w={svgW} h={height} />}
        {type === 'pie'     && <PieShapes    w={svgW} h={height} />}
        {type === 'bubble'  && <BubbleShapes w={svgW} h={height} />}
        {type === 'generic' && <GenericShapes w={svgW} h={height} />}
      </svg>
      <span className="sr-only">Loading chart data</span>
    </div>
  );
}
