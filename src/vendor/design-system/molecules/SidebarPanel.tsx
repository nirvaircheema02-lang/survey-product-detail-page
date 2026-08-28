/**
 * SidebarPanel — Molecule (DS v4.3)
 *
 * WHAT: Reusable sticky sidebar container with header, scrollable body, and optional footer.
 * WHY:  Captures the exact container pattern (sticky positioning, elevation, max-height,
 *        header/footer zones, scroll behavior) so future pages — TOC, side nav, settings —
 *        get identical placement and spacing by importing one component.
 * WHEN: Desktop filter sidebar, TOC sidebar, settings panel.
 * HOW:  Renders a flex column with optional header/footer and scrollable children zone.
 *
 * VARIANTS:
 *   inline  → Original: border-right separator, flush with parent (default)
 *   card    → Standalone sticky card with rounded-[10px], subtle shadow, border,
 *             viewport-aware max-height — matches production report store reference.
 *
 * INTERACTION STATES:
 *   Visible     → Rendered
 *   Hidden      → visible=false returns null (no DOM)
 *   No interactive states — this is a layout container
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * LAYOUT TOKENS:
 *   Default width  → 15rem (240px)
 *   Border         → rgba(0,0,0,0.08)
 *   Shadow         → 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)
 *   Radius         → 10px (card variant, DS container radius)
 *   Sticky top     → 72px (below nav bar)
 *   Max-height     → calc(100vh - 88px) (viewport-aware, card variant)
 *
 * RESPONSIVE: Hidden below lg by default (card variant). Always visible in inline.
 */
import { ReactNode, RefObject } from 'react';

type SidebarVariant = 'inline' | 'card';

interface SidebarPanelProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  width?: string;
  className?: string;
  visible?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** 'inline' = border-right flush panel (legacy). 'card' = standalone sticky card. */
  variant?: SidebarVariant;
  /** Sticky top offset in px (card variant). Defaults to 72. */
  stickyTop?: number;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

export function SidebarPanel({
  children,
  header,
  footer,
  width = '15rem',
  className = '',
  visible = true,
  scrollRef,
  variant = 'inline',
  stickyTop = 72,
  ...dataProps
}: SidebarPanelProps) {
  if (!visible) return null;

  // ── Card variant — standalone sticky sidebar card ──
  if (variant === 'card') {
    return (
      <aside
        data-component="SidebarPanel"
        {...dataProps}
        className={`flex-shrink-0 hidden lg:block ${className}`}
        style={{ width }}
      >
        <div
          className="sticky overflow-hidden flex flex-col"
          style={{
            top: `${stickyTop}px`,
            maxHeight: `calc(100vh - ${stickyTop + 16}px)`,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0,0,0,0.08)',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          {header && (
            <div
              className="flex-shrink-0"
              style={{
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'rgba(0,0,0,0.06)',
              }}
            >
              {header}
            </div>
          )}

          <div
            ref={scrollRef}
            className="overflow-y-auto flex-1 scrollbar-hide"
          >
            {children}
          </div>

          {footer && (
            <div
              className="flex-shrink-0"
              style={{
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(0,0,0,0.06)',
                backgroundColor: 'var(--black-50, rgba(250,250,250,1))',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </aside>
    );
  }

  // ── Inline variant — original border-right panel ──
  return (
    <aside
      data-component="SidebarPanel"
      {...dataProps}
      className={`flex-shrink-0 flex flex-col ${className}`}
      style={{
        width,
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: 'rgba(0,0,0,0.06)',
      }}
    >
      {header && (
        <div
          style={{
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'rgba(0,0,0,0.06)',
          }}
        >
          {header}
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'rgba(0,0,0,0.06)',
          }}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
