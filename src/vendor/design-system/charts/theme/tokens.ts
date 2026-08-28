/**
 * Ken Chart Design Tokens · canonical source of truth for all chart + table styling.
 *
 * WHY  · Highcharts resolves options at construction time, before CSS cascade.
 *        CSS custom properties (var(--token)) cannot be used directly in Highcharts config.
 *        These TS constants mirror the brand token values so Highcharts can read them.
 *        Single source prevents drift between chart instances.
 *
 * WHAT · 9 export groups: series palette · ink hierarchy · borders + grids ·
 *        table washes · row density · tooltip spec · motion · font families.
 *
 * WHEN · Imported by highcharts-base.ts (merged into every chart) and by
 *        TableShell (CSS-in-JS density + wash values). Consumer charts import
 *        series tokens for per-series color overrides.
 *
 * WHERE · DS layer only. Consumer projects import via
 *         `@kenresearch/design-system/charts`.
 *
 * HOW  · All values measured from Ref 1 + Ref 2 DOM probes (REF-DEEP-MINE-2026-05-25.md).
 *        Color names reference brand token vocabulary: periwinkle / perano / purple.
 *        Update here when brand palette changes — propagates to all chart instances.
 *
 * @relatedDoc design-system/core-v2/src/charts/theme/README.md
 * @relatedDoc projects/v1-project/v1-product-page-ver0.4/docs/_internal/REF-DEEP-MINE-2026-05-25.md
 */

// ─── Viz palette · periwinkle / perano / purple ─────────────────────────────

/**
 * Ken chart series colors · named by brand token role.
 *
 * WHY   · Periwinkle/perano/purple palette per COLOR-USAGE-GUIDE §3.2.
 *         Brand-red (#b01f24) reserved for CTAs only — never in chart data.
 * WHAT  · 6 named series slots covering single-series through 6-series charts.
 * WHEN  · Assign primary→secondary→tertiary per series order.
 *         Do NOT skip slots or randomise assignment.
 * WHERE · highcharts-base.ts `colors` array · per-chart color override props.
 * HOW   · `color: KEN_CHART_SERIES.primary` on chart options.
 */
// Bible § 1.7 v3 (2026-05-28 FINAL) · ORIGINAL Ken palette restored · v0.4 reference-aligned.
// Lesson from v0.4: editorial-soft feel comes from OPACITY VARIATION + section bg + spacing ·
// NOT from pre-blended desaturated hex. Solid #9488ec + white text reads premium · not dashboard-y.
// Soft tier = SAME color family at low opacity (e.g. `rgba(134,179,229,0.20)` for tier 3 perano).
// Plus neutral grays for "Other" semantic + sage green for growth-context emphasis (per user).
export const KEN_CHART_SERIES = {
  primary:    '#9488ec', // purple-500 L*62 · ORIGINAL · solid + white text reads editorial
  secondary:  '#c3c6f9', // periwinkle-500 L*78 · ORIGINAL
  tertiary:   '#86b3e5', // perano-800 L*70 · ORIGINAL · use at 0.20-0.30 opacity for tier 3 soft
  quaternary: '#7075c8', // periwinkle-800 L*55 · ORIGINAL · darker accent
  light:      '#a7c9ed', // perano-700 L*78 · ORIGINAL · slot 5
  neutral:    '#b8c4c0', // sage gray L*76 · "Other"/"Sparse" · neutral chrome only
  /** @deprecated Use neutral · kept for back-compat */
  darkest:    '#b8c4c0',
  // Emphasis tokens · darker · hover/active OR semantic emphasis
  accentEmphasis: '#5e51c8', // purple-700 · hover/active periwinkle
  /** @deprecated Alias removed. Use accentEmphasis or sageGrowth. */
  accentWarm:     '#5e51c8',
  // Per user direction (2026-05-28): green for growth-oriented data ONLY when necessary.
  // NOT a default · semantic emphasis: positive growth · success · upward trend.
  sageGrowth:     '#7da982', // muted sage green L*65 · ~50% sat · growth semantic ONLY
} as const;

/**
 * Ordered array of series colors · passed to Highcharts `colors` option.
 *
 * WHY  · Highcharts assigns colors by array index. Canonical order matters
 *        for multi-series visual consistency across all charts.
 * HOW  · `colors: [...KEN_CHART_SERIES_ARRAY]` in highcharts-base.ts.
 */
export const KEN_CHART_SERIES_ARRAY = [
  KEN_CHART_SERIES.primary,
  KEN_CHART_SERIES.secondary,
  KEN_CHART_SERIES.tertiary,
  KEN_CHART_SERIES.quaternary,
  KEN_CHART_SERIES.light,
  KEN_CHART_SERIES.neutral, // slot 6 = "Other" semantic · Bible § 1.5 soft-first
] as const;

/**
 * Luminance-stepped tier colors · color-blind safe · 3-tier viz only.
 *
 * WHY  · Original KEN_CHART_SERIES uses hue variance within periwinkle/perano/purple.
 *        Blue-spectrum color blindness (~5% population) merges tiers that differ
 *        only by hue. Luminance-step ensures monochrome conversion still distinguishes.
 *        L* values: darkest≈30 · mid≈55 · primary≈62 · secondary≈78 · light≈90.
 *        Each adjacent step ≥15 L* points → passes monochrome distinguish test.
 *
 * WHAT · 6 named luminance-stepped values · same periwinkle hue · different lightness.
 *        `darkest` (#3d3499) = L*≈30 · `primary` (#5e51c8) = L*≈45 ·
 *        `quaternary` (#7075c8) = L*≈55 · `secondary` (#9488ec) = L*≈62 ·
 *        `tertiary` (#c3c6f9) = L*≈78 · `light` (#e0e3fb) = L*≈90.
 *
 * WHEN · Use for tier-encoded viz: KenTreemap · KenHeatmap · KenGanttTimeline.
 *        NOT for Highcharts chart series (KEN_CHART_SERIES still owns those).
 *
 * WHERE · Imported by TIER_COLORS maps in KenTreemap · KenHeatmap · KenGanttTimeline.
 *
 * HOW  · `fill: KEN_CHART_SERIES_LUMINANCE_SAFE.primary` for tier 1.
 */
// Bible § 1.7 v3 (2026-05-28 FINAL) · ORIGINAL Ken palette · v0.4 reference-aligned.
// Soft feel achieved via OPACITY VARIATION in tier maps (e.g. rgba periwinkle 0.20-0.30)
// NOT via pre-blended desaturated hex values.
export const KEN_CHART_SERIES_LUMINANCE_SAFE = {
  /** L*≈30 · darkest periwinkle · emphasis only · hover/active · NEVER default */
  darkest:    '#3d3499',
  /** L*≈45 · primary deep · accent / hover step */
  primary:    '#5e51c8',
  /** L*≈55 · quaternary periwinkle-800 · semi-deep accent */
  quaternary: '#7075c8',
  /** L*≈62 · secondary periwinkle / Ken purple-500 · DEFAULT tier-1 fill */
  secondary:  '#9488ec',
  /** L*≈78 · tertiary periwinkle-500 · mid fill */
  tertiary:   '#c3c6f9',
  /** L*≈90 · lightest periwinkle · soft fill OR use perano at 0.20 opacity for editorial */
  light:      '#e0e3fb',
} as const;

// ─── Ink hierarchy ───────────────────────────────────────────────────────────

/**
 * Ink opacity levels · applied to black (#000) base · used for axis labels,
 * chart text, table cell text.
 *
 * WHY  · Unified text hierarchy across charts and tables.
 *        Direct match with DS semantic ink tokens (semantic-ink-strong etc.)
 *        expressed as inline rgba for Highcharts use.
 * WHEN · strong = chart titles / data labels · body = axis labels ·
 *        muted = tick labels · subtle = meta / source lines · faint = disabled.
 */
export const KEN_INK = {
  strong: 'rgba(0, 0, 0, 0.90)',
  body:   'rgba(0, 0, 0, 0.75)',
  muted:  'rgba(0, 0, 0, 0.60)',
  subtle: 'rgba(0, 0, 0, 0.45)',
  faint:  'rgba(0, 0, 0, 0.30)',
} as const;

// ─── Borders · grids · washes ────────────────────────────────────────────────

/**
 * Chart borders, grid lines and dividers.
 *
 * WHY  · Ref 2 DOM probe measured tooltip border as rgb(228,226,240) —
 *        periwinkle-tinted, NOT neutral gray (#d4d4d4 was wrong in earlier docs).
 *        Grid hairline at 5% black opacity per ref visual weight.
 * WHAT · tooltipBorder: periwinkle wash (measured Ref 2) ·
 *        gridLine: hairline 5% black opacity · hairline/default: table dividers.
 */
export const KEN_CHART_BORDERS = {
  /** Tooltip border · periwinkle-tinted · measured Ref 2 recharts tooltip DOM probe */
  tooltipBorder:   'rgb(228, 226, 240)',
  /** Y-axis grid lines · 5% black opacity hairline · matches ref visual weight */
  gridLine:        'rgba(0, 0, 0, 0.05)',
  /** Grid line stroke weight · 0.5px hairline per ref */
  gridLineWeight:  0.5,
  /** Table row divider · near-invisible hairline */
  hairline:        '#f5f5f5',
  /** Component border default */
  default:         '#e5e5e5',
} as const;

// ─── Table washes ────────────────────────────────────────────────────────────

/**
 * Table background wash tokens · periwinkle-tinted per ref measurement.
 *
 * WHY  · Ref 1 measured rgb(248,247,254) for table header · NOT neutral #f5f5f5 gray.
 *        This subtle periwinkle cast aligns the table chrome with the brand viz palette.
 * WHAT · headerWash: applied to <th> backgrounds ·
 *        altRowWash: even-row striping (optional) ·
 *        rowDivider: horizontal hairline between rows ·
 *        rowDividerStrong: section-break line.
 * WHERE · TableShell.tsx inline styles · consumed via KEN_TABLE constants.
 */
/**
 * NOTE: KEN_TABLE values are TS-side constants for Highcharts (pre-CSS resolution).
 * The same values are exposed as CSS custom properties in base.css under `--table-*`.
 * Update BOTH if values change (tokens.ts + base.css `--table-*` block).
 */
export const KEN_TABLE = {
  /** Header background · periwinkle-tinted wash · Ref 1 measured rgb(248,247,254) */
  headerWash:        'rgb(248, 247, 254)',
  /** Even-row background for alternating rows (optional · opt-in via alternateRows prop) */
  altRowWash:        'rgb(252, 251, 255)',
  /** Horizontal row divider · hairline 8% black opacity */
  rowDivider:        'rgba(0, 0, 0, 0.08)',
  /** Section-break divider · slightly stronger 12% black opacity */
  rowDividerStrong:  'rgba(0, 0, 0, 0.12)',
  /** Card variant outer border · periwinkle-tinted · Ref 1 measured rgb(208,203,232) · slightly darker than tooltipBorder */
  cardBorder:        'rgb(208, 203, 232)',
  /** Inverted header bg · neutral dark · NOT chart series purple (color-discipline 2026-05-22) */
  headerInverted:    'rgba(0, 0, 0, 0.85)',
  /** Open variant last-row border · Ref 2 measured rgb(228,226,240) · same as tooltipBorder family */
  openLastRowBorder: 'rgb(228, 226, 240)',
} as const;

// ─── Row density ─────────────────────────────────────────────────────────────

/**
 * Table row heights in px · 4 named densities.
 *
 * WHY  · Ref 2 measured mo-table rows at 45px · ql-table rows at 29-33px.
 *        Matching densities per table PURPOSE, not a single standard.
 * WHAT · compact: ranking/qualitative tables · standard: property listings ·
 *        comfortable: market overview · spacious: hero/showcase tables.
 * WHERE · TableShell.tsx CSS custom property --row-height ·
 *         consumers read via context or directly.
 */
export const KEN_TABLE_DENSITY = {
  /** Ranking / qualitative tables · most compact · Ref 2 ql-table ~29-33px */
  compact:      28,
  /** Property listings · default · Ref 1 data-table 40px */
  standard:     40,
  /** Market overview · generous · Ref 2 mo-table 45px */
  comfortable:  45,
  /** Hero/showcase tables · max breathroom */
  spacious:     56,
} as const;

// ─── Tooltip spec ────────────────────────────────────────────────────────────

/**
 * Canonical Highcharts tooltip configuration · ref-aligned.
 *
 * WHY  · Ref 2 Recharts tooltip DOM probe measured:
 *        bg=#fff · border=rgb(228,226,240) · radius=4px · padding=10px · no shadow.
 *        Previous config used dark bg (rgba(20,20,20,0.96)) which contradicts refs.
 *        White tooltip with periwinkle border is the ref-canonical pattern.
 * WHAT · All values for Highcharts tooltip options object.
 * WHERE · highcharts-base.ts tooltip config.
 * HOW  · Pass directly: `tooltip: { ...KEN_TOOLTIP }` in buildKenChartBase().
 */
export const KEN_TOOLTIP = {
  /** White background · Ref 2 measured rgb(255,255,255) */
  background:   'rgb(255, 255, 255)',
  /** Periwinkle-tinted border · Ref 2 measured rgb(228,226,240) */
  border:       KEN_CHART_BORDERS.tooltipBorder,
  /** 1px border */
  borderWidth:  1,
  /** 4px radius · Ref 2 measured · was 6px in previous config */
  borderRadius: 4,
  /** 10px padding · Ref 2 measured */
  padding:      10,
  /** 11px body text */
  fontSize:     '11px',
  /** Near-black with blue cast · Ref 2 measured rgb(26,26,46) */
  color:        'rgb(26, 26, 46)',
  /** No box-shadow · Ref 2 confirms shadow: none */
  shadow:       false,
} as const;

// ─── Motion canonical ────────────────────────────────────────────────────────

/**
 * Chart entrance animation spec · Framer Motion canonical values.
 *
 * WHY  · Ref 1 all chart blocks animate with fadeInUp 0.6s ease-out on enter.
 *        Framer Motion equivalent via whileInView + viewport once:true.
 *        Unified timing across all chart/table/stat-strip blocks.
 * WHAT · reveal: Framer Motion props for ChartReveal.tsx ·
 *        highchartsAnim: Highcharts internal animation duration (matched).
 * WHERE · ChartReveal.tsx · highcharts-base.ts chart.animation.
 */
export const KEN_CHART_MOTION = {
  reveal: {
    /** Animation duration in seconds · Ref 1 measured 0.6s */
    duration: 0.6,
    /** Easing · Ref 1 ease-out (decelerating · premium not bouncy) */
    ease:     'easeOut',
    /** Initial state · invisible + 20px below final position */
    initial:  { opacity: 0, y: 20 },
    /** Final/enter state */
    enter:    { opacity: 1, y: 0 },
    /** Viewport trigger · once per session · -50px margin for early trigger */
    viewport: { once: true, margin: '-50px' },
  },
  /** Highcharts internal animation duration · matched to reveal for visual cohesion */
  highchartsAnim: { duration: 380 },
} as const;

// ─── Typography (chart-internal) ─────────────────────────────────────────────

/**
 * Font family strings for Highcharts inline config.
 *
 * WHY  · Highcharts resolves fontFamily at construction · not from CSS cascade.
 *        Must pass literal font-stack strings, not CSS var().
 * WHAT · sans: DM Sans (body / axis labels / data labels) ·
 *        serif: Noto Serif (chart titles if used inside Highcharts title).
 * WHEN · Passed to chart.style.fontFamily · xAxis.labels.style.fontFamily etc.
 */
export const KEN_CHART_FONT = {
  sans:  "'DM Sans', -apple-system, sans-serif",
  serif: "'Noto Serif', Georgia, serif",
} as const;
