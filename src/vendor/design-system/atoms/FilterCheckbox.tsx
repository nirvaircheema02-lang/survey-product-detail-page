/**
 * FilterCheckbox
 *
 * @what     Custom 16×16 checkbox row for filter panel selections. Renders a label + optional count.
 *           Visual states: default (white box / inset shadow) → checked (filled / white check icon).
 *           Selected row gets brand-red 2px left-border accent and tinted bg.
 * @why      Native `<input type="checkbox">` cannot be styled consistently cross-browser without
 *           hacks. Custom implementation gives pixel-perfect 16×16 with inset shadow on rest state
 *           and filled fill with Check icon on checked — Ken's canonical filter pattern.
 *           `div[role="checkbox"]` exposes correct ARIA semantics while allowing full style control.
 * @when     Inside FilterPanel accordion groups (Industry / Format / Region / Tags / Years).
 *           Any multi-select list where individual option rows need a clear checked/unchecked state.
 * @whenNot  Pill/tag multi-select → use `FilterChip` (toggle without checkbox box anatomy).
 *           Settings toggles → use a native checkbox or shadcn Switch.
 *           Single-select radio-style → use native `<input type="radio">` or shadcn RadioGroup.
 * @where    FiltersPanel (desktop aside) · MobileFilterSheet (full-screen sheet) · any checkbox list.
 * @how      `label` required. `checked` controls visual state. `onToggle` fires on click/Enter/Space.
 *           `count` shows result count. `indented` adds 28px left-padding for sub-category rows.
 *           `disabled` sets opacity 0.4 + blocks interaction.
 *
 * @a11y     role="checkbox" aria-checked={checked} aria-disabled={disabled} on outer div.
 *           tabIndex={disabled ? -1 : 0} — keyboard accessible.
 *           Enter/Space triggers onToggle (same as native checkbox convention).
 *           Focus-visible: 2px brand-red ring on outer container via :focus-visible.
 *           Color + icon together convey checked state (not color alone — WCAG 1.4.1).
 *           Custom box uses Check icon from lucide with aria-hidden (decorative within labeled row).
 * @motion   transition-all duration-150 on box · duration-100 on row bg/color.
 *           mouseEnter/Leave on outer div updates row bg inline (hover state without CSS class conflict).
 *           Reduced motion: transitions are sub-200ms — within 200ms threshold (no special skip needed).
 *
 * @canonicalSource report-store-legacy/src/app/components/FilterCheckbox.tsx
 * @portedBy aura-builder (Batch 3.1a · 2026-05-19)
 * @status   ready
 */
'use client';

import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FilterCheckboxProps {
  /** Display label of the filter option */
  label: string;
  /** Whether this checkbox is currently checked */
  checked: boolean;
  /** Callback when checkbox is toggled (click or keyboard Enter/Space) */
  onToggle: () => void;
  /** Optional result count displayed as muted micro-text to the right */
  count?: number | string;
  /** Sub-category row: adds extra left-padding (28px vs 16px) for visual hierarchy */
  indented?: boolean;
  /** Disabled state: grays out row, blocks interaction, removes from tab order */
  disabled?: boolean;
  /** Additional className forwarded to root element */
  className?: string;
}

export function FilterCheckbox({
  label,
  checked,
  onToggle,
  count,
  indented = false,
  disabled = false,
  className,
}: FilterCheckboxProps) {
  return (
    <div
      data-component="FilterCheckbox"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'flex items-center gap-2.5 select-none transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      style={{
        padding: indented ? '6px 16px 6px 28px' : '6px 16px',
        background: checked ? 'rgba(0,0,0,0.03)' : 'transparent',
        borderLeft: checked
          ? '2px solid rgba(0,0,0,0.6)'
          : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !checked) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.025)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = checked
            ? 'rgba(0,0,0,0.03)'
            : 'transparent';
        }
      }}
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
    >
      {/* Custom 16×16 checkbox box — inset shadow at rest, filled on checked */}
      <div
        className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150"
        aria-hidden="true"
        style={{
          borderRadius: 'var(--radius-inner)',
          border: checked
            ? '1.5px solid var(--surface-text)'
            : '1.5px solid rgba(0,0,0,0.18)',
          background: checked ? 'var(--surface-text)' : 'white',
          boxShadow: checked
            ? '0 1px 2px rgba(0,0,0,0.15)'
            : 'inset 0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        {checked && (
          <Check
            className="h-2.5 w-2.5"
            color="white"
            strokeWidth={3}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Label */}
      <span
        className="flex-1 text-left truncate transition-colors duration-100"
        style={{
          fontSize: 'var(--text-xs)',
          color: checked ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)',
        }}
      >
        {label}
      </span>

      {/* Count badge */}
      {count != null && (
        <span
          className="tabular-nums flex-shrink-0 transition-all duration-100"
          aria-label={`${count} results`}
          style={{
            fontSize: 'var(--text-2xs)',
            color: checked ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)',
            background: checked ? 'rgba(0,0,0,0.05)' : 'transparent',
            padding: checked ? '1px 6px' : '0',
            borderRadius: '9999px',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
