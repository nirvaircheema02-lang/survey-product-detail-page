/**
 * FilterSearchInput — Atom (DS v4.3)
 *
 * WHAT: Search input with icon and clear button for filtering content.
 * WHY:  Extracted from listing page header for reuse across Research & Surveys pillars.
 * WHEN: In listing page toolbars OR inside SidebarPanel for search-within-filters.
 * HOW:  Renders a Search icon + input + conditional X clear button.
 *
 * INTERACTION STATES (container-pattern — focus on OUTER div, not inner input):
 *   Default     → borderColor rgba(0,0,0,0.1)
 *   Hover       → borderColor rgba(0,0,0,0.25) (Weber's Law: 150% increase)
 *   Focus-within → borderColor rgba(0,0,0,0.9) (near-black = unmistakable)
 *   Disabled    → borderColor rgba(0,0,0,0.06), color rgba(0,0,0,0.35), bg rgba(0,0,0,0.03)
 *   Clear btn   → color rgba(0,0,0,0.35) → hover rgba(0,0,0,0.6) → active scale(0.9)
 *
 * NOTE: Focus ring is on the OUTER container (focus-within), NOT the inner
 * <input>. The inner input has focus styles fully suppressed.
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * RADIUS: var(--radius-element) = 5px
 * FONT TOKENS: Input text → var(--text-xs) 12.8px
 */
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minWidth?: string;
  disabled?: boolean;
}

export function FilterSearchInput({
  value,
  onChange,
  placeholder = 'Search filters...',
  minWidth = '100%',
  disabled = false,
}: FilterSearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = disabled
    ? 'rgba(0,0,0,0.06)'
    : focused
      ? 'rgba(0,0,0,0.9)'
      : hovered
        ? 'rgba(0,0,0,0.25)'
        : 'rgba(0,0,0,0.1)';

  return (
    <div
      data-component="FilterSearchInput"
      className="flex items-center gap-2 px-3 py-2 transition-colors duration-150"
      style={{
        minWidth,
        borderRadius: 'var(--radius-element)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor,
        backgroundColor: disabled ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0)',
        cursor: disabled ? 'not-allowed' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Search
        size={14}
        className="flex-shrink-0"
        style={{ color: disabled ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.35)' }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 min-w-0 border-none outline-none focus:outline-none focus-visible:outline-none"
        style={{
          fontSize: 'var(--text-xs)',
          color: disabled ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.9)',
          backgroundColor: 'rgba(0,0,0,0)',
          cursor: disabled ? 'not-allowed' : undefined,
        }}
      />
      {value && !disabled && (
        <button
          onClick={() => onChange('')}
          className="transition-colors cursor-pointer active:scale-[0.9]"
          style={{ color: 'rgba(0,0,0,0.35)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.35)'; }}
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
