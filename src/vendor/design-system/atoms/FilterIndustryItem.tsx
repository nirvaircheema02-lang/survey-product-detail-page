/**
 * FilterIndustryItem — Atom (DS v4.3)
 *
 * WHAT: Single-select industry row for sidebar filter panels.
 * WHY:  Extracted from inline industry row pattern in ReportStoreListingDemoContent.
 *       Industries use a radio-style single-select (not checkbox multi-select)
 *       with chevron expand/collapse, borderLeft indicator, and report count.
 * WHEN: Inside the Industries section of sidebar filter panels.
 * HOW:  Renders a clickable row: [chevron] [label] [count]
 *       With borderLeft active indicator and nested sub-industry children.
 *
 * vs FilterCheckbox (atom):
 *   FilterCheckbox      = original single-select text row (no chevron, no count)
 *   FilterIndustryItem  = expandable industry row with chevron + count + children slot
 *
 * vs FilterCheckboxItem (atom):
 *   FilterCheckboxItem  = multi-select checkbox with square check (Tags, Regions, Years)
 *   FilterIndustryItem  = single-select expandable row (Industries)
 *
 * INTERACTION STATES:
 *   Default    → chevron right, label 0.5, count 0.18, no borderLeft
 *   Selected   → chevron down, label 0.9, count 0.45, borderLeft 3px black, bg 0.04
 *   Hover      → bg rgba(0,0,0,0.02)
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS: Label → var(--text-xs) | Count → var(--text-card-micro)
 */
import { ReactNode, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface FilterIndustryItemProps {
  /** Industry label */
  label: string;
  /** Report count displayed on the right */
  count: number;
  /** Whether this industry is currently selected */
  selected?: boolean;
  /** Click handler to select/deselect */
  onClick?: () => void;
  /** Nested content (sub-industry list) rendered when selected */
  children?: ReactNode;
}

export function FilterIndustryItem({
  label,
  count,
  selected = false,
  onClick,
  children,
}: FilterIndustryItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div data-component="FilterIndustryItem">
      {/* Industry row */}
      <button
        type="button"
        className="w-full flex items-center gap-1.5 px-3 py-2 cursor-pointer transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
        style={{
          borderLeftWidth: '3px',
          borderLeftStyle: 'solid',
          borderLeftColor: selected ? 'rgb(0,0,0)' : 'rgba(0,0,0,0)',
          backgroundColor: selected ? 'rgba(0,0,0,0.04)' : hovered ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0)',
        }}
        onClick={onClick}
        aria-pressed={selected}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className="p-0.5 flex-shrink-0"
          style={{ borderRadius: 'var(--radius-inner)' }}
        >
          {selected
            ? <ChevronDown size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />
            : <ChevronRight size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />
          }
        </span>
        <span
          className="flex-1 text-left truncate transition-colors"
          title={label}
          style={{
            fontSize: 'var(--text-xs)',
            color: selected ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </span>
        <span
          className="tabular-nums flex-shrink-0"
          style={{
            fontSize: 'var(--text-card-micro)',
            color: selected ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)',
          }}
        >
          {count.toLocaleString()}
        </span>
      </button>

      {/* Nested sub-industries (rendered when selected) */}
      {selected && children && (
        <div
          className="ml-7"
          style={{
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'rgba(0,0,0,0.08)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
