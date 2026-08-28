import { cn } from '../lib/cn';

export type StatusDotPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface StatusDotProps {
  visible: boolean;
  /** Hex or CSS var token. Default: var(--color-brand-red). */
  color?: string;
  /** Diameter in px. Default: 8 */
  size?: number;
  position?: StatusDotPosition;
  /** Border color. Default: var(--color-foundation-white). */
  borderColor?: string;
}

const positionClass: Record<StatusDotPosition, string> = {
  'top-right':    '-top-[1px] -right-[1px]',
  'top-left':     '-top-[1px] -left-[1px]',
  'bottom-right': '-bottom-[1px] -right-[1px]',
  'bottom-left':  '-bottom-[1px] -left-[1px]',
};

/**
 * StatusDot — small absolute-positioned circle · notification badge · online indicator.
 *
 * WHY:
 * - Centralizes "something is happening here" affordance across Avatar · Button · Card
 * - Border (1.5px white default) creates the floating-on-top look against any bg color
 * - 4 corner positions cover every parent-overlay scenario without per-component math
 * - Brand-red default for highest-priority signal · `color` prop allows green/yellow/etc.
 * - `visible` prop gates render — keeps consumers DRY (no per-instance conditional)
 *
 * WHAT: Absolutely-positioned `<div>` with `rounded-full`. Default 8px diameter,
 * brand-red bg, 1.5px white border. `position` controls corner placement via
 * `-top/-bottom/-left/-right [-1px]` offsets. Returns `null` when `visible=false`.
 * Parent must be `position: relative` for absolute positioning to anchor correctly.
 *
 * WHEN:
 * - Notification dot on Avatar (unread count · sign-in nudge)
 * - "New" indicator on a card or button
 * - Online/offline status on chat avatars
 * - "Action needed" signal on a menu trigger
 *
 * WHEN NOT:
 * - Count badges (number inside) → use `<Badge>` w/ pill style
 * - Skeleton/loading dots → use future `<Spinner>` or shimmer
 * - Filled-bg status pills with label → use `<Badge variant="status">`
 * - Standalone status indicators (no parent anchor) → use a plain `<div>` w/ explicit size
 *
 * HOW:
 * ```tsx
 * <div className="relative inline-block">
 *   <Avatar size="md" isActive={false} onClick={...} />
 *   <StatusDot visible={hasUnread} color="var(--color-brand-red)" position="top-right" />
 * </div>
 *
 * // Online indicator (green)
 * <StatusDot visible={isOnline} color="#10b981" position="bottom-right" size={10} />
 * ```
 *
 * A11y: `aria-hidden="true"` (decorative). Status meaning MUST be communicated via
 *       parent's `aria-label` ("Account · 3 unread"). Color alone insufficient for
 *       AT — pair w/ text or count in parent label.
 * Motion: None by default. Parent controls show/hide via `visible` prop.
 * Anti-patterns:
 *  - ❌ Never use as standalone status (requires parent anchor · positions absolutely)
 *  - ❌ Never rely on color alone for meaning (a11y · color-blind safety)
 *  - ❌ Never use diameter < 6px (becomes invisible) or > 14px (use Badge instead)
 *  - ❌ Never animate via JS (CSS transitions on parent handle hover-reveal cleanly)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (decorative · parent owns label)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/design-system/components/StatusDot.tsx
 */
export function StatusDot({
  visible,
  color = 'var(--color-brand-red)',
  size = 8,
  position = 'top-right',
  borderColor = 'var(--color-foundation-white)',
}: StatusDotProps) {
  if (!visible) return null;
  return (
    <div
      data-component="StatusDot"
      className={cn('absolute rounded-full', positionClass[position])}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor,
      }}
      aria-hidden="true"
    />
  );
}
