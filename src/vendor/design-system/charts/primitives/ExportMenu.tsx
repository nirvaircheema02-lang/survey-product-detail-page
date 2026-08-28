'use client';

/**
 * ExportMenu · icon-only button + popover menu for chart data export.
 *
 * WHY  · B2B research consumers need raw data access for independent analysis.
 *        Premium research products (Gartner · Forrester · IBISWorld) all provide
 *        chart data export. Missing this is a table-stakes gap.
 *
 * WHAT · Small icon-only button (12×12 download icon) in top-right of ChartFigure.
 *        Click opens a compact menu with "Download CSV" option.
 *        CSV generated via `dataTableToCSV` from the ChartFigure `dataTable` prop.
 *        PNG export deferred — CSS-grid charts need html-to-image dep (too heavy for G.5).
 *
 * WHEN · Render when `ChartFigure enableExport={true}` AND `dataTable` prop is provided.
 *        DataTable supplies both the sr-only a11y table AND the export source.
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/ExportMenu.tsx`
 *         Used internally by ChartFigure only.
 *
 * HOW  · ```tsx
 *        <ChartFigure
 *          title="Revenue by year"
 *          enableExport
 *          dataTable={{ caption: 'Revenue data', headers: ['Year', 'AUD Mn'], rows: [...] }}
 *        >
 *          <KenColumnChart ... />
 *        </ChartFigure>
 *        ```
 *
 * A11y · Button: aria-label "Export chart data" · aria-expanded on open.
 *        Menu: role="menu" · menu items role="menuitem" · keyboard: Escape closes ·
 *        Tab/click outside closes · focus returns to trigger on close.
 *
 * @module design-system/core-v2/src/charts/primitives/ExportMenu
 */

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { KEN_CHART_FONT, KEN_INK, KEN_CHART_BORDERS } from '../theme/tokens';
import { dataTableToCSV, downloadCSV } from '../utils/csv';
import type { ChartDataTableProps } from './ChartDataTable';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExportMenuProps {
  /** Data source for CSV export — same prop as ChartFigure `dataTable` */
  dataTable: ChartDataTableProps;
  /** Filename for downloaded CSV (without extension) */
  filename?: string;
  /**
   * Surface context — drives icon/border/bg colors for contrast.
   * 'light' (default): muted ink on white bg.
   * 'dark': white-alpha text + rgba border + subtle elevation on #0a0a0c.
   * @default 'light'
   */
  surface?: 'light' | 'dark';
}

// ─── Download icon (inline SVG · no dep) ─────────────────────────────────────

function DownloadIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 1v6m0 0L4 5m2 2 2-2M2 9h8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExportMenu({ dataTable, filename = 'chart-data', surface = 'light' }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // ─── Surface-aware color tokens ───────────────────────────────────────────
  const iconColor     = surface === 'dark' ? 'rgba(255,255,255,0.75)'  : KEN_INK.muted;
  const borderColor   = surface === 'dark' ? 'rgba(255,255,255,0.18)'  : KEN_CHART_BORDERS.default;
  const bgColor       = surface === 'dark' ? 'rgba(255,255,255,0.06)'  : 'transparent';
  const hoverBg       = surface === 'dark' ? 'rgba(255,255,255,0.12)'  : 'rgba(148,136,236,0.08)';
  const hoverColor    = surface === 'dark' ? 'rgba(255,255,255,0.92)'  : KEN_INK.strong;
  const menuBg        = '#ffffff'; // menu dropdown stays white on both surfaces (canonical)
  const menuItemColor = KEN_INK.body; // dropdown text — always on white bg · light constant correct
  const menuItemHover = 'rgba(148,136,236,0.06)';

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to trigger
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Close on Escape or outside click
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, close]);

  const handleCSV = useCallback(() => {
    const csv = dataTableToCSV(dataTable.headers, dataTable.rows);
    downloadCSV(filename, csv);
    close();
  }, [dataTable, filename, close]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Export chart data"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: `1px solid ${borderColor}`,
          background: bgColor,
          color: iconColor,
          cursor: 'pointer',
          transition: 'background-color 150ms ease-out, color 150ms ease-out',
          outline: 'none',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
          (e.currentTarget as HTMLButtonElement).style.color = hoverColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = bgColor;
          (e.currentTarget as HTMLButtonElement).style.color = iconColor;
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid rgba(148,136,236,0.5)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
      >
        <DownloadIcon />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label="Export options"
          style={{
            position: 'absolute',
            top: '28px',
            right: 0,
            zIndex: 100,
            background: menuBg,
            border: `1px solid ${KEN_CHART_BORDERS.tooltipBorder}`,
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            minWidth: '140px',
            padding: '4px 0',
            fontFamily: KEN_CHART_FONT.sans,
          }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: menuItemColor,
              textAlign: 'left',
              fontFamily: KEN_CHART_FONT.sans,
              transition: 'background-color 100ms ease-out',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = menuItemHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <DownloadIcon />
            <span>Download CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}
