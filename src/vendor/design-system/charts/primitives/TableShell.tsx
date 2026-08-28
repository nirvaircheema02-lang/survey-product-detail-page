'use client';

/**
 * TableShell · base semantic table primitive for all Ken data tables.
 *
 * WHY  · Ref 1 + Ref 2 DOM probes measured consistent table chrome:
 *        periwinkle-tinted header wash · horizontal-only row borders ·
 *        NO vertical grid lines · density variants per table purpose.
 *        Previous design nested <table> inside TableShell's own <table>
 *        → invalid HTML + 3 hydration errors confirmed in showcase console.
 *
 * WHAT · Renders a `<div>` wrapper containing a `<table>`. Children MUST be
 *        `<thead>` + `<tbody>` ONLY — no outer `<table>` wrapper from consumer.
 *        TableShell owns the <table> element. Header bg, sticky, density all
 *        applied internally via scoped <style> tag injection (NOT Tailwind
 *        arbitrary classes — those require v4 scan to compile reliably).
 *
 * BREAKING CHANGE (Sprint B.1 2026-05-25):
 *   BEFORE: <TableShell><table>...</table></TableShell>   → invalid HTML (nested <table>)
 *   AFTER:  <TableShell><thead>...</thead><tbody>...</tbody></TableShell>  → valid HTML
 *   PropertyTable + RankingTable updated to match.
 *
 * Sprint D.1 2026-05-26 — Bug fixes applied:
 *   Bug 1 · Cell padding 0px → density-mapped CSS vars + injected <style> tag
 *   Bug 2 · Sticky broken → maxHeight + overflowY:auto on wrapper creates v-scroll context
 *   Bug 3 · Inverted header not applying → <style> tag bypasses Tailwind v4 scan
 *   Bug 4 · Header wash bg missing → <style> tag bypasses Tailwind v4 scan
 *   Bug 5 · 16px font leak → density-mapped font-size CSS var
 *
 * WHEN · Wrap ALL Ken data tables.
 *        PropertyTable: variant="card" headerStyle="wash"        density="comfortable"
 *        RankingTable:  variant="card" headerStyle="wash"        density="standard"
 *        Open tables:   variant="open" headerStyle="transparent"
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/TableShell.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <TableShell variant="card" headerStyle="wash" density="comfortable" stickyHeader>
 *          <thead><tr><th scope="col">Name</th>...</tr></thead>
 *          <tbody><tr><td>Value</td></tr></tbody>
 *        </TableShell>
 *        ```
 *
 * Sticky mechanics (CSS + controlled overflow):
 *   stickyHeader=true → wrapper gets maxHeight + overflowY:auto (scroll context).
 *   thead th get position:sticky; top:0 via injected <style>.
 *   Background is pre-filled (NOT toggled on engage — ref-canonical).
 *   Signal: 2px border-bottom on sticky (vs 1px non-sticky). No shadow.
 *
 * A11y · `<caption>` via caption prop → visually hidden (sr-only).
 *        `ariaLabel` on `<table>` element. Use `<th scope="col|row">` in children.
 *
 * @relatedDoc REF-TABLES-DEEP-MINE-2026-05-25.md (33 tables · canonical table spec)
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4 (new)
 */

import { createContext, useContext, useId, useMemo } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { cn } from '../../lib/cn';
import { KEN_TABLE, KEN_TABLE_DENSITY } from '../theme/tokens';

// ─── Density context ─────────────────────────────────────────────────────────

/** Row density name → pixel height. */
export type TableDensity = 'compact' | 'standard' | 'comfortable' | 'spacious';

/** Card: Ref 1 bordered rounded card. Open: Ref 2 flush editorial. */
export type TableVariant = 'card' | 'open';

/** wash: periwinkle tint. transparent: border-bottom only. inverted: neutral dark (rgba(0,0,0,0.85)) + white text. */
export type TableHeaderStyle = 'wash' | 'transparent' | 'inverted';

/**
 * TableDensityContext · provides row height (px number) to child rows.
 * HOW · `const rowHeightPx = useTableDensity();` inside child row component.
 */
export const TableDensityContext = createContext<number>(KEN_TABLE_DENSITY.standard);

/** Read the current table row height in px from nearest TableShell ancestor. */
export function useTableDensity(): number {
  return useContext(TableDensityContext);
}

// ─── Density maps ─────────────────────────────────────────────────────────────

/**
 * Cell horizontal padding by density.
 * Ref 1 canonical: th=14px, td=14px. Compact scales down, spacious scales up.
 */
const CELL_PADDING_X: Record<TableDensity, string> = {
  compact:     '8px',
  standard:    '12px',
  comfortable: '14px',
  spacious:    '18px',
};

/**
 * Cell vertical padding by density.
 * Ref 1 canonical: th=11px, td=10px. TableShell uses th=pad+1, td=pad.
 */
const CELL_PADDING_Y: Record<TableDensity, string> = {
  compact:     '4px',
  standard:    '8px',
  comfortable: '10px',
  spacious:    '14px',
};

/**
 * Header cell (th) vertical padding — 1px more than td per ref measurement.
 */
const TH_PADDING_Y: Record<TableDensity, string> = {
  compact:     '5px',
  standard:    '9px',
  comfortable: '11px',
  spacious:    '15px',
};

/**
 * Table body font-size by density.
 * Ref 1 canonical: 13px standard, 12px compact variant.
 */
const CELL_FONT_SIZE: Record<TableDensity, string> = {
  compact:     '11px',
  standard:    '12px',
  comfortable: '13px',
  spacious:    '14px',
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface TableShellProps {
  /**
   * MUST be `<thead>` + `<tbody>` ONLY — NO outer `<table>` wrapper.
   * TableShell renders the `<table>` element internally.
   */
  children: ReactNode;
  /**
   * Card: Ref 1 style — border 1px rgb(208,203,232) + 10px radius + overflow clip.
   * Open: Ref 2 style — no border, no radius, flush editorial.
   * @default 'card'
   */
  variant?: TableVariant;
  /**
   * wash: rgb(248,247,254) periwinkle wash (standard data tables).
   * transparent: no fill + 1px border-bottom only (editorial/qualitative).
   * inverted: rgba(0,0,0,0.85) neutral dark + white text (emphasis/featured · color-discipline 2026-05-22).
   * @default 'wash'
   */
  headerStyle?: TableHeaderStyle;
  /**
   * Row density. compact=28px · standard=40px · comfortable=45px · spacious=56px
   * @default 'standard'
   */
  density?: TableDensity;
  /**
   * Sticky thead. Pure CSS position:sticky.
   * Requires stickyHeader=true to create the v-scroll context (maxHeight + overflowY:auto).
   * 2px border-bottom = sticky signal. Pre-filled background (not toggled on engage).
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * Max height when stickyHeader=true — creates v-scroll context inside wrapper.
   * Sticky only works when the WRAPPER scrolls vertically (not the page).
   * @default '400px'
   */
  maxHeight?: string | number;
  /**
   * Alternate even-row background wash.
   * @default false
   */
  alternateRows?: boolean;
  /**
   * Horizontal overflow scroll on wrapper.
   * @default true for card · false for open
   */
  scrollX?: boolean;
  /** Additional class names on the outer wrapper div */
  className?: string;
  /** Visually hidden caption for screen readers. */
  caption?: string;
  /** aria-label on the `<table>` element. */
  ariaLabel?: string;
  /**
   * Optional ARIA role override on the `<table>` element.
   * Use `"treegrid"` when the table has expandable parent-child rows (KenHierarchyTable)
   * so that `aria-level` + `aria-expanded` on `<tr>` rows are semantically valid.
   * Per WAI-ARIA spec, `aria-level` on `row` is only permitted inside a `treegrid`.
   * @default undefined (uses native `<table>` implicit role)
   */
  tableRole?: 'treegrid' | 'grid';
  /**
   * @deprecated Use `headerStyle="wash"` or `headerStyle="transparent"`.
   * Kept for backward compat — ignored when headerStyle is explicitly set.
   */
  headerWash?: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function resolveHeaderBg(style: TableHeaderStyle): string {
  switch (style) {
    case 'wash':        return KEN_TABLE.headerWash;      // rgb(248,247,254)
    case 'transparent': return 'transparent';
    case 'inverted':    return KEN_TABLE.headerInverted;  // rgb(91,79,207)
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TableShell({
  children,
  variant = 'card',
  headerStyle,
  density = 'standard',
  stickyHeader = false,
  maxHeight,
  alternateRows = false,
  scrollX,
  className,
  caption,
  ariaLabel,
  tableRole,
  headerWash,
}: TableShellProps) {
  // Resolve headerStyle: explicit prop wins · fall back to legacy headerWash boolean
  const resolvedHeaderStyle: TableHeaderStyle =
    headerStyle ?? (headerWash === false ? 'transparent' : 'wash');

  const effectiveScrollX = scrollX ?? (variant === 'card');
  const rowHeightPx = KEN_TABLE_DENSITY[density];
  const headerBg = resolveHeaderBg(resolvedHeaderStyle);

  // Unique instance id for scoped <style> — avoids collision across multiple TableShells
  const instanceId = useId().replace(/:/g, '-');

  const padX = CELL_PADDING_X[density];
  const padY = CELL_PADDING_Y[density];
  const thPadY = TH_PADDING_Y[density];
  const fontSize = CELL_FONT_SIZE[density];

  // ─── Scoped style tag ─────────────────────────────────────────────────────
  // Bypasses Tailwind v4 arbitrary-class scan dependency.
  // useId is stable across SSR+client — no hydration mismatch.

  const scopedStyles = useMemo(() => {
    const sel = `[data-tableshell-id="${instanceId}"]`;
    const isInverted = resolvedHeaderStyle === 'inverted';
    const isTransparent = resolvedHeaderStyle === 'transparent';

    return `
      ${sel} td {
        padding: ${padY} ${padX};
        font-size: ${fontSize};
      }
      ${sel} th {
        padding: ${thPadY} ${padX};
        font-size: calc(${fontSize} - 1px);
        font-weight: 600;
        letter-spacing: 0.01em;
        text-align: left;
      }
      ${sel} thead th {
        background: ${isTransparent ? 'transparent' : headerBg};
        ${isInverted ? 'color: rgba(255,255,255,0.92);' : ''}
        ${isTransparent ? `border-bottom: 1px solid var(--table-open-last-row-border, ${KEN_TABLE.openLastRowBorder});` : ''}
        ${!isTransparent ? `border-bottom: 1px solid var(--table-row-divider, rgba(0,0,0,0.10));` : ''}
      }
      ${isInverted ? `
        ${sel} thead th * {
          color: rgba(255,255,255,0.92) !important;
        }
        ${sel} thead th [data-header-subtitle],
        ${sel} thead th .subtitle,
        ${sel} thead th p:last-child:not(:first-child),
        ${sel} thead th p[style*="italic"],
        ${sel} thead th p[class*="italic"] {
          color: rgba(255,255,255,0.78) !important;
        }
      ` : ''}
      ${stickyHeader ? `
        ${sel} thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          border-bottom: 2px solid var(--table-row-divider-strong, rgba(0,0,0,0.12));
        }
      ` : ''}
      ${alternateRows ? `
        ${sel} tbody tr:nth-child(even) {
          background: var(--table-alt-row-wash, ${KEN_TABLE.altRowWash});
        }
      ` : ''}
    `;
  }, [instanceId, resolvedHeaderStyle, headerBg, padX, padY, thPadY, fontSize, stickyHeader, alternateRows]);

  // ─── Outer wrapper style ──────────────────────────────────────────────────

  const wrapperStyle = useMemo<CSSProperties>(() => {
    const base: CSSProperties = {
      background: 'transparent',
      margin: '28px 0',
      ['--row-height' as string]: `${rowHeightPx}px`,
    };

    // Touch scroll enhancements (Sprint G.3): applied whenever horizontal scroll is active
    // overscroll-behavior-x:contain prevents page navigation swipe from triggering during table scroll
    // -webkit-overflow-scrolling:touch enables momentum scrolling on iOS (legacy but harmless on modern)
    const touchScrollProps: CSSProperties = effectiveScrollX
      ? {
          overscrollBehaviorX: 'contain' as CSSProperties['overscrollBehaviorX'],
          WebkitOverflowScrolling: 'touch' as unknown as undefined,
        }
      : {};

    if (stickyHeader) {
      const mh = typeof maxHeight === 'number' ? `${maxHeight}px` : (maxHeight ?? '400px');
      if (variant === 'card') {
        return {
          ...base,
          ...touchScrollProps,
          border: `1px solid ${KEN_TABLE.cardBorder}`,
          borderRadius: '10px',
          maxHeight: mh,
          overflowY: 'auto',
          overflowX: effectiveScrollX ? 'auto' : 'hidden',
        };
      }
      return {
        ...base,
        ...touchScrollProps,
        border: 'none',
        borderRadius: 0,
        maxHeight: mh,
        overflowY: 'auto',
        overflowX: effectiveScrollX ? 'auto' : 'visible',
      };
    }

    if (variant === 'card') {
      return {
        ...base,
        ...touchScrollProps,
        // Ref 1 canonical: rgb(208,203,232) periwinkle-tinted border · 10px radius
        border: `1px solid ${KEN_TABLE.cardBorder}`,
        borderRadius: '10px',
        overflowX: effectiveScrollX ? 'auto' : 'hidden',
      };
    }
    return {
      ...base,
      ...touchScrollProps,
      border: 'none',
      borderRadius: 0,
      overflow: effectiveScrollX ? 'auto' : 'visible',
    };
  }, [variant, effectiveScrollX, rowHeightPx, stickyHeader, maxHeight]);

  // ─── Table-level Tailwind classes ─────────────────────────────────────────
  // Static structural classes (border-collapse, row dividers, etc.) still via Tailwind.
  // Dynamic color/padding/font now via scoped <style> tag above.

  const tableClasses = cn(
    // Cell corner rule (UNIVERSAL): radius=0 on cells · wrapper clips corners
    '[&_td]:rounded-none [&_th]:rounded-none',
    // No vertical grid: border-right/left on cells = 0
    '[&_td]:border-r-0 [&_td]:border-l-0',
    '[&_th]:border-r-0 [&_th]:border-l-0',
    // Horizontal row dividers in tbody (1px hairline)
    '[&_tbody_tr]:border-b [&_tbody_tr]:border-[var(--table-row-divider,rgba(0,0,0,0.08))]',
    // Card: last tbody row → no border-bottom (wrapper border closes it)
    variant === 'card' && [
      '[&_tbody_tr:last-child_td]:border-b-0',
      '[&_tbody_tr:last-child_th]:border-b-0',
    ],
    // Open: last tbody row → explicit 1px bottom border (Ref 2 canonical)
    variant === 'open' && [
      '[&_tbody_tr:last-child_td]:border-b',
      '[&_tbody_tr:last-child_td]:border-[var(--table-open-last-row-border,rgb(228,226,240))]',
    ],
  );

  return (
    <TableDensityContext.Provider value={rowHeightPx}>
      {/* Scoped instance styles — bypasses Tailwind v4 arbitrary-class scan */}
      <style dangerouslySetInnerHTML={{ __html: scopedStyles }} />
      <div
        data-tableshell-id={instanceId}
        className={cn('tableshell', className)}
        style={wrapperStyle}
        // WCAG 2.1 SC 2.1.1 · axe:scrollable-region-focusable
        // Scrollable regions must be keyboard-focusable. tabIndex=0 when scrollX or
        // stickyHeader creates a scroll context. SR users can then reach + scroll content.
        tabIndex={(effectiveScrollX || stickyHeader) ? 0 : undefined}
      >
        <table
          aria-label={ariaLabel}
          // BUG-FIX G.12: tableRole prop enables role="treegrid" for KenHierarchyTable.
          // Per WAI-ARIA: aria-level on <tr> (row role) only valid inside treegrid.
          // Without this, axe flags aria-conditional-attr serious violation.
          role={tableRole}
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            ['--row-height' as string]: `${rowHeightPx}px`,
          }}
          className={tableClasses}
        >
          {caption && <caption className="sr-only">{caption}</caption>}
          {children}
        </table>
      </div>
    </TableDensityContext.Provider>
  );
}

// ─── Note on sticky ────────────────────────────────────────────────────────────
// stickyHeader=true sets maxHeight + overflowY:auto on wrapper — this creates the
// vertical scroll context that position:sticky requires. Without overflowY:auto,
// sticky binds to the page scroll which never v-scrolls the wrapper.
// maxHeight default: '400px'. Override via maxHeight prop for taller tables.
// ─────────────────────────────────────────────────────────────────────────────

// Re-export token values for convenience
export { KEN_TABLE, KEN_TABLE_DENSITY };
