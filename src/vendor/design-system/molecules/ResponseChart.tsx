/**
 * ResponseChart
 *
 * WHY · Survey results pages need a data-visualisation component that avoids adding a
 *        heavy chart library (Recharts/Victory) to the DS bundle. A pure-CSS bar chart
 *        + SVG donut covers the primary survey analytics use cases at negligible cost.
 * WHAT · Two display modes: `horizontal` (default) — horizontal progress bars with
 *        label + count; `donut` — SVG ring chart for a single completion percentage.
 *        Props: title (string), data ({label, value, color?}[]), mode ("horizontal"|"donut"),
 *        total (optional override), className.
 * WHEN · On survey result/analytics pages within the Surveys pillar. Use `horizontal`
 *        for option-by-option response distribution; use `donut` for overall completion rate.
 * WHEN NOT · Don't use for time-series or multi-series charts — bring in a proper chart
 *             library for those. Don't use for report market data visualisations — those
 *             need real axis labels and interactive tooltips.
 * WHERE · Surveys pillar (no current project consumer · DS sample page only)
 * HOW ·
 *   ```tsx
 *   <ResponseChart title="Preferred region" data={[
 *     { label: "Asia Pacific", value: 42 },
 *     { label: "North America", value: 31 },
 *   ]} />
 *
 *   <ResponseChart mode="donut" data={[{ label: "Completed", value: 78 }]} total={100} />
 *   ```
 *
 * @reusabilityScore 2     // Surveys pillar only
 * @a11y_status pending-review  // SVG chart has no aria-label; bar values visible text only
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */
import { Card } from '../atoms/Card';

interface ResponseBarData {
  label: string;
  value: number;
  color?: string;
}

interface ResponseChartProps {
  title?: string;
  data: ResponseBarData[];
  mode?: 'horizontal' | 'donut';
  total?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--chart-palette-3)',   // purple-600 — content signal
  'var(--green-700)',          // success green
  'var(--chart-palette-1)',   // brand red
  'var(--amber-500)',          // amber warning
  'var(--chart-palette-blue)', // medium blue · canonical chart data series
  'rgba(0,0,0,0.25)',         // neutral
];

export function ResponseChart({ title, data, mode = 'horizontal', total, className }: ResponseChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const computedTotal = total ?? data.reduce((sum, d) => sum + d.value, 0);

  if (mode === 'donut') {
    // Simple donut for overall completion
    const completedPct = computedTotal > 0 && data.length > 0
      ? Math.round((data[0].value / computedTotal) * 100)
      : 0;

    return (
      <Card data-component="ResponseChart" padding="md" className={`flex flex-col items-center ${className ?? ''}`}>
        {title && (
          <p className="text-black/60 mb-4 self-start" style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{title}</p>
        )}
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={data[0]?.color ?? 'var(--chart-palette-3)'}
              strokeWidth="3"
              strokeDasharray={`${completedPct} ${100 - completedPct}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-black tabular-nums" style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-serif)', fontWeight: 'var(--font-weight-light)' as any }}>
              {completedPct}%
            </span>
          </div>
        </div>
        {data.length > 1 && (
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-xs)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
                <span className="text-black/50">{d.label}</span>
                <span className="text-black/30 tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  }

  // ─── Horizontal Bar Chart ─────────────────────
  return (
    <Card data-component="ResponseChart" padding="md" className={className}>
      {title && (
        <p className="text-black/60 mb-4" style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{title}</p>
      )}
      <div className="space-y-3">
        {data.map((d, i) => {
          const pct = Math.round((d.value / maxValue) * 100);
          const barColor = d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                <span className="text-black/60 truncate mr-2">{d.label}</span>
                <span className="text-black/40 tabular-nums flex-shrink-0">{d.value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {computedTotal > 0 && (
        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--black-200)', fontSize: 'var(--text-xs)' }}>
          <span className="text-black/35">Total</span>
          <span className="text-black/50 tabular-nums">{computedTotal}</span>
        </div>
      )}
    </Card>
  );
}