/**
 * FilterChip
 *
 * @what     Toggle pill for multi-select filter UI. Active/inactive states with optional count.
 *           Pill-shaped, brand-red active state, Check icon when active, 44px touch target on mobile.
 * @why      Filter UIs need a distinct "selected" visual signal without full button weight.
 *           Inline toggle (active/inactive) is cleaner than add/remove pairs (fewer clicks).
 *           Centralized atom prevents per-feature reimplementation of the active-state pattern.
 * @when     Mobile filter sheets · tag clouds · category quick-select bars · any multi-select
 *           context where user picks from a visible set of options.
 * @whenNot  Active-filter "dismiss" chips showing current selections → those need an X button
 *           and are closer to a Badge with close affordance. Never for single-select radio-style
 *           controls (use FilterCheckbox). Never for navigation links.
 * @where    FiltersPanel sidebar (desktop) · MobileFilterSheet (mobile) · ReportStoreHero tag cloud.
 * @how      `label` is required. `active` controls visual state. `onToggle` fires on click/Enter/Space.
 *           `count` shows available result count in muted micro-text. `disabled` grays + blocks interaction.
 *           `wrap` (opt-in) lets a long phrase label wrap instead of truncating. Focus-visible: 2px brand-red ring.
 *
 * @a11y     role="checkbox" aria-checked={active} — correct ARIA for toggle without native checkbox.
 *           tabIndex={disabled ? -1 : 0} — keyboard accessible. Enter/Space triggers toggle.
 *           Focus-visible ring: 2px --color-brand-red.
 *           Touch target: min-h-[40px] on component + parent responsibility for 44px on mobile.
 *           Color not sole indicator: Check icon + font-weight change accompany active state.
 * @motion   transition-all duration-100 on bg/border/color. No transform. Reduced-motion: color swap
 *           is not motion — no special handling needed.
 *
 * @canonicalSource report-store-legacy/src/app/components/FilterChip.tsx
 * @portedBy aura-builder (Batch 3.1a · 2026-05-19)
 * @status   ready
 */
'use client';

import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FilterChipProps {
  /** Display label of the filter option */
  label: string;
  /** Whether this chip is currently selected/active */
  active: boolean;
  /** Callback when chip is toggled (click or keyboard Enter/Space) */
  onToggle: () => void;
  /** Optional result count displayed in muted micro-text after label */
  count?: number | string;
  /** Disabled state: grays out chip, blocks interaction, removes from tab order */
  disabled?: boolean;
  /**
   * Allow a long label to wrap onto multiple lines instead of truncating with an
   * ellipsis. Off by default — short filter labels stay on one line exactly as before.
   * Turn on when the option text is a full phrase/sentence that must stay readable at
   * narrow widths (WCAG 1.4.10 reflow — truncated option text loses meaning).
   * @default false
   */
  wrap?: boolean;
  /** Additional className forwarded to root button element */
  className?: string;
}

export function FilterChip({
  label,
  active,
  onToggle,
  count,
  disabled = false,
  wrap = false,
  className,
}: FilterChipProps) {
  return (
    <button
      data-component="FilterChip"
      type="button"
      role="checkbox"
      aria-checked={active}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onToggle();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 transition-all duration-100',
        'min-h-[40px] select-none',
        wrap ? 'whitespace-normal text-left' : 'whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
        active && 'shadow-sm',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      style={{
        fontSize: 'var(--text-xs)',
        borderRadius: 'var(--radius-element)',
        border: `1px solid ${active ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`,
        background: active ? 'rgba(0,0,0,0.06)' : 'white',
        color: active ? 'var(--surface-text)' : 'rgba(0,0,0,0.55)',
        fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
      }}
    >
      {active && (
        <Check
          className="h-3 w-3 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <span className={wrap ? undefined : 'truncate'}>{label}</span>
      {count != null && (
        <span
          className="tabular-nums flex-shrink-0"
          aria-label={`${count} results`}
          style={{
            fontSize: 'var(--text-2xs)',
            color: 'rgba(0,0,0,0.25)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
