'use client';

/**
 * CellTooltip · hover/focus/tap tooltip primitive · Ken DS chart layer.
 *
 * WHY  · Overflow:hidden parents (card tables, SVG containers) clip native
 *        CSS tooltips. createPortal to document.body bypasses all clip contexts.
 *        White + periwinkle border is ref-canonical (Ref 2 DOM probe).
 *        Touch pattern (Sprint G.3):
 *          - Single tap → show tooltip · auto-dismiss after 3 seconds
 *          - Long-press (≥500ms hold) → persistent tooltip · stays until tap elsewhere
 *          - 2nd tap while visible (≤500ms) → dismiss
 *
 * WHAT · Wrapper span that portals a styled tooltip div to document.body.
 *        Auto-flips at viewport edges. Reduced motion: instant show (no transition).
 *        A11y: role="tooltip" + aria-describedby wired to trigger on visibility.
 *
 * WHEN · Any cell in KenTreemap · KenHeatmap · KenGanttTimeline ·
 *        PropertyTable · RankingTable needs a tooltip overlay.
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/CellTooltip.tsx`
 *         Exported via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <CellTooltip content={<span>Full property name + detail</span>}>
 *          <div>Short truncated text</div>
 *        </CellTooltip>
 *        ```
 *
 * A11y · trigger gets aria-describedby={tooltipId} when tooltip visible ·
 *        tooltip has role="tooltip" · aria-hidden={!visible}.
 *
 * Mobile strategy (Sprint G.3):
 *   Single tap = show + 3s auto-dismiss.
 *   Long-press (500ms) = persistent (dismiss on tap anywhere else).
 *   Viewport edge flip verified at 390px.
 *
 * @module design-system/core-v2/src/charts/primitives/CellTooltip
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'framer-motion';
import { KEN_TOOLTIP } from '../theme/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CellTooltipProps {
  /**
   * Children element that triggers tooltip.
   * Wrapped in a <span> with event listeners.
   */
  children: ReactNode;
  /**
   * Tooltip content · accepts ReactNode for rich multi-line content.
   */
  content: ReactNode;
  /**
   * Position preference · default 'top'.
   * 'auto' checks viewport edges and flips accordingly.
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  /**
   * Show delay in ms · allows rapid hover to not flash tooltips.
   * @default 100
   */
  delayMs?: number;
  /**
   * Disable tooltip entirely · prop-driven.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional className on the tooltip element itself.
   */
  tooltipClassName?: string;
  /**
   * Optional inline style overrides on the trigger wrapper span.
   */
  wrapperStyle?: CSSProperties;
}

// ─── Tooltip style (ref-canonical: white bg · periwinkle border · 4px radius) ─

const TOOLTIP_STYLE: CSSProperties = {
  position: 'fixed',
  background: KEN_TOOLTIP.background,
  border: `${KEN_TOOLTIP.borderWidth}px solid ${KEN_TOOLTIP.border}`,
  borderRadius: `${KEN_TOOLTIP.borderRadius}px`,
  padding: `${KEN_TOOLTIP.padding}px`,
  color: KEN_TOOLTIP.color,
  fontSize: KEN_TOOLTIP.fontSize,
  // Subtle shadow helps detached overlay read vs page. Refs use shadow:none on
  // recharts tooltips but those are in-canvas. Portal tooltips need subtle lift.
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  maxWidth: '280px',
  pointerEvents: 'none',
  zIndex: 1000,
  lineHeight: 1.5,
  fontFamily: "'DM Sans', -apple-system, sans-serif",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CellTooltip({
  children,
  content,
  position = 'top',
  delayMs = 100,
  disabled = false,
  tooltipClassName,
  wrapperStyle,
}: CellTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<number>(0);
  // Touch state: tracks long-press timer + persistent mode (Sprint G.3)
  const touchStateRef = useRef<{
    longPressTimer: ReturnType<typeof setTimeout> | null;
    persistent: boolean;
    autoDismissTimer: ReturnType<typeof setTimeout> | null;
  }>({ longPressTimer: null, persistent: false, autoDismissTimer: null });
  const prefersReduced = useReducedMotion();
  const uid = useId();
  const tooltipId = `cell-tooltip-${uid.replace(/:/g, '')}`;
  const [mounted, setMounted] = useState(false);

  // Portal requires client mount
  useEffect(() => {
    setMounted(true);
    return () => {
      // FIX 2 (G.10): Clear all timers + hide tooltip on unmount.
      // Without this, tooltip state persists across surface toggle
      // and appears at (0,0) when the anchor ref is stale.
      if (delayTimer.current) clearTimeout(delayTimer.current);
      if (touchStateRef.current.longPressTimer) clearTimeout(touchStateRef.current.longPressTimer);
      if (touchStateRef.current.autoDismissTimer) clearTimeout(touchStateRef.current.autoDismissTimer);
      setVisible(false);
    };
  }, []);

  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // FIX 2 REVISED (G.11): Guard for unmounted / invisible anchors only.
    // Previous guard `top+bottom+left+right === 0` had FALSE POSITIVE: a valid
    // visible cell at viewport position (0,0,W,H) would also satisfy that condition
    // (left=0, top=0) and tooltip was suppressed for ALL real hovers.
    // Correct guard: check actual dimensions · width > 0 AND height > 0.
    // Width/height zero ONLY when element is detached / display:none / not measured.
    if (rect.width === 0 && rect.height === 0) {
      setVisible(false);
      return;
    }

    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 60;
    const gap = 6;

    let effectivePosition = position;
    if (position === 'auto') {
      // Check viewport space — prefer top, flip to bottom if not enough
      effectivePosition = rect.top > tooltipHeight + gap + 20 ? 'top' : 'bottom';
    }

    let top: number;
    let left: number;

    if (effectivePosition === 'top') {
      top = rect.top - tooltipHeight - gap;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      // BUG A fix: if computed top would clip into viewport top (< 8px safety margin),
      // flip to BELOW the anchor rather than just clamping at 8px.
      // Clamping-only caused tooltip to render over/inside nav bar at near-top anchors.
      if (top < 8) {
        top = rect.bottom + gap;
      }
    } else if (effectivePosition === 'bottom') {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      // Mirror flip: if bottom placement would overflow viewport bottom, flip above.
      const vpHeight = window.innerHeight;
      if (top + tooltipHeight + 8 > vpHeight) {
        top = rect.top - tooltipHeight - gap;
      }
    } else if (effectivePosition === 'left') {
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.left - tooltipWidth - gap;
    } else {
      // right
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = rect.right + gap;
    }

    // Clamp horizontal to viewport (vertical flip already handled above)
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    left = Math.max(8, Math.min(left, vpWidth - tooltipWidth - 8));
    top = Math.max(8, Math.min(top, vpHeight - tooltipHeight - 8));

    setCoords({ top, left });
  }, [position]);

  const show = useCallback(() => {
    if (disabled) return;
    if (delayTimer.current) clearTimeout(delayTimer.current);
    delayTimer.current = setTimeout(() => {
      setVisible(true);
      // Compute position AFTER next paint so tooltipRef.current has dimensions
      requestAnimationFrame(computePosition);
    }, delayMs);
  }, [disabled, delayMs, computePosition]);

  const hide = useCallback(() => {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    if (touchStateRef.current.autoDismissTimer) {
      clearTimeout(touchStateRef.current.autoDismissTimer);
      touchStateRef.current.autoDismissTimer = null;
    }
    touchStateRef.current.persistent = false;
    setVisible(false);
  }, []);

  // Auto-dismiss after 3s (single-tap touch mode · not used for mouse/focus)
  const showWithAutoDismiss = useCallback(() => {
    if (disabled) return;
    if (touchStateRef.current.autoDismissTimer) {
      clearTimeout(touchStateRef.current.autoDismissTimer);
      touchStateRef.current.autoDismissTimer = null;
    }
    setVisible(true);
    requestAnimationFrame(computePosition);
    touchStateRef.current.autoDismissTimer = setTimeout(() => {
      if (!touchStateRef.current.persistent) {
        setVisible(false);
        touchStateRef.current.autoDismissTimer = null;
      }
    }, 3000);
  }, [disabled, computePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    const now = Date.now();
    const elapsed = now - lastTapRef.current;

    // Second tap within 500ms while visible → dismiss
    if (elapsed < 500 && visible) {
      if (touchStateRef.current.longPressTimer) {
        clearTimeout(touchStateRef.current.longPressTimer);
        touchStateRef.current.longPressTimer = null;
      }
      hide();
      return;
    }

    // First tap: record time
    lastTapRef.current = now;
    touchStateRef.current.persistent = false;

    // Start long-press timer (500ms)
    if (touchStateRef.current.longPressTimer) {
      clearTimeout(touchStateRef.current.longPressTimer);
    }
    touchStateRef.current.longPressTimer = setTimeout(() => {
      // Long-press fired — make persistent
      touchStateRef.current.persistent = true;
      touchStateRef.current.longPressTimer = null;
      if (touchStateRef.current.autoDismissTimer) {
        clearTimeout(touchStateRef.current.autoDismissTimer);
        touchStateRef.current.autoDismissTimer = null;
      }
      // Tooltip should already be showing; re-compute position from touch coords
      const touch = e.touches[0];
      if (touch) {
        // We can't use e.touches[0] after timeout (synthetic event pooled) — use triggerRef instead
      }
      setVisible(true);
      requestAnimationFrame(computePosition);
    }, 500);
  }, [disabled, visible, hide, computePosition]);

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    if (touchStateRef.current.longPressTimer) {
      // Released before long-press threshold → single tap → show + auto-dismiss
      clearTimeout(touchStateRef.current.longPressTimer);
      touchStateRef.current.longPressTimer = null;
      // Only show if not already visible (hide handled by touchStart elapsed check)
      if (!visible) {
        showWithAutoDismiss();
      }
    }
    // If long-press already fired (persistent=true), don't auto-dismiss on release
  }, [disabled, visible, showWithAutoDismiss]);

  // Dismiss persistent tooltip when user taps outside trigger element
  // Only registered when tooltip is visible AND persistent (long-press) mode is active
  useEffect(() => {
    if (!visible || !touchStateRef.current.persistent) return;
    const onOutsideTouchStart = (e: TouchEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        if (touchStateRef.current.autoDismissTimer) {
          clearTimeout(touchStateRef.current.autoDismissTimer);
          touchStateRef.current.autoDismissTimer = null;
        }
        touchStateRef.current.persistent = false;
        setVisible(false);
      }
    };
    document.addEventListener('touchstart', onOutsideTouchStart, { passive: true });
    return () => document.removeEventListener('touchstart', onOutsideTouchStart);
  }, [visible]);

  const transitionStyle: CSSProperties = prefersReduced
    ? {}
    : {
        transition: 'opacity 150ms ease-out, transform 150ms ease-out',
        transform: visible ? 'translateY(0)' : 'translateY(4px)',
      };

  const tooltipStyle: CSSProperties = {
    ...TOOLTIP_STYLE,
    ...transitionStyle,
    opacity: visible ? 1 : 0,
    top: coords.top,
    left: coords.left,
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-describedby={visible ? tooltipId : undefined}
        style={{ display: 'contents', ...wrapperStyle }}
      >
        {children}
      </span>

      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            aria-hidden={!visible}
            className={tooltipClassName}
            style={tooltipStyle}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
