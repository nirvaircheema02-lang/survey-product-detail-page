/**
 * FilterCheckboxItem — Atom (DS v4.3)
 *
 * WHAT: Checkbox-style filter option with check square, label, and optional count.
 * WHY:  Extracted from 3x duplicate inline checkbox patterns in the sidebar
 *       (Tags, Regions, Publish Year all share identical checkbox anatomy).
 * WHEN: Inside sidebar filter sections for multi-select options.
 * HOW:  Renders a clickable row: [checkbox] [label] [count?]
 *       With border-left active indicator and filled checkbox when checked.
 *
 * vs FilterCheckbox (atom):
 *   FilterCheckbox   = single-select radio-button-style (borderLeft + text only)
 *   FilterCheckboxItem = multi-select checkbox-style (square check + borderLeft)
 *
 * INTERACTION STATES:
 *   Default    → checkbox border rgba(0,0,0,0.18), label rgba(0,0,0,0.5)
 *   Hover      → bg rgba(0,0,0,0.02)
 *   Checked    → checkbox filled black + white check, label 0.85, bg 0.03, borderLeft 0.6
 *   Focus      → role="checkbox" + tabIndex for keyboard access
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * RADIUS: Checkbox → var(--radius-inner) = 2.5px (DS checkbox mark radius)
 * FONT TOKENS: Label → var(--text-xs) | Count → var(--text-card-micro)
 */
import { useState } from 'react';
import { Check } from 'lucide-react';

interface FilterCheckboxItemProps {
  label: string;
  checked?: boolean;
  count?: number;
  onChange?: () => void;
  /** Show tooltip on truncated labels (uses native title attribute) */
  showTooltip?: boolean;
}

export function FilterCheckboxItem({
  label,
  checked = false,
  count,
  onChange,
  showTooltip = true,
}: FilterCheckboxItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-component="FilterCheckboxItem"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className="flex items-center gap-2.5 cursor-pointer transition-all duration-100 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
      style={{
        padding: '6px 16px',
        backgroundColor: checked ? 'rgba(0,0,0,0.03)' : hovered ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0)',
        borderLeftWidth: '2px',
        borderLeftStyle: 'solid',
        borderLeftColor: checked ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
      }}
      onClick={onChange}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange?.(); } }}
    >
      {/* Checkbox square */}
      <div
        className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150"
        style={{
          borderRadius: 'var(--radius-inner)',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          borderColor: checked ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.18)',
          backgroundColor: checked ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
          boxShadow: checked
            ? '0 1px 2px rgba(0,0,0,0.15)'
            : '0 1px 2px rgba(0,0,0,0.04) inset',
        }}
      >
        {checked && <Check size={10} style={{ color: 'rgba(255,255,255,1)' }} strokeWidth={3} />}
      </div>

      {/* Label */}
      <span
        className="flex-1 text-left truncate transition-colors duration-100"
        title={showTooltip ? label : undefined}
        style={{
          fontSize: 'var(--text-xs)',
          color: checked ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)',
        }}
      >
        {label}
      </span>

      {/* Count */}
      {count !== undefined && (
        <span
          className="tabular-nums flex-shrink-0 transition-colors duration-100"
          style={{
            fontSize: 'var(--text-card-micro)',
            color: checked ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
