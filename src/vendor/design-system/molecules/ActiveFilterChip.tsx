/**
 * ActiveFilterChipBar — Molecule (DS v4.3)
 *
 * WHAT: Bar of active filter chips with count label and "Clear all" action.
 * WHY:  Extracted the active-filter-pills bar from listing pages into a composable
 *        molecule. Renders only when filters are active.
 * WHEN: Below the listing header toolbar, above the card grid.
 * HOW:  Maps a list of active filters to FilterChip atoms + a clear-all button.
 *
 * INTERACTION STATES:
 *   Empty         → Returns null (no DOM rendered)
 *   With filters  → Renders "X FILTERS" count + chips + clear button
 *   Clear all btn → color rgba(0,0,0,0.4) → hover rgba(0,0,0,0.8) → active scale(0.95)
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS:
 *   "X FILTERS" label → var(--text-card-micro) 10px + uppercase + tracking-[0.1em]
 *   "Clear all" link   → var(--text-xs) 12.8px
 */
import { X } from 'lucide-react';

interface ActiveFilter {
  label: string;
  category?: string;
  onRemove: () => void;
}

interface ActiveFilterChipBarProps {
  filters: ActiveFilter[];
  onClearAll?: () => void;
}

/**
 * DismissChip — local-only inline component for ActiveFilterChipBar.
 * NOT a standalone DS atom. FilterChip atom = toggle chip (active/inactive).
 * Dismiss chip = display-only chip with X button. Different anatomy.
 */
function DismissChip({ label, category, onRemove }: ActiveFilter) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1"
      style={{
        fontSize: 'var(--text-xs)',
        borderRadius: 'var(--radius-element)',
        backgroundColor: 'rgba(0,0,0,0.06)',
        color: 'rgba(0,0,0,0.7)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.08)',
      }}
    >
      {category && (
        <span
          className="uppercase tracking-[0.08em]"
          style={{ fontSize: 'var(--text-card-micro)', color: 'rgba(0,0,0,0.35)' }}
        >
          {category}
        </span>
      )}
      <span style={{ color: 'rgba(0,0,0,0.7)' }}>{label}</span>
      <button
        onClick={onRemove}
        className="transition-colors cursor-pointer active:scale-[0.9] ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
        style={{ color: 'rgba(0,0,0,0.3)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.5)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)'; }}
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

export function ActiveFilterChipBar({ filters, onClearAll }: ActiveFilterChipBarProps) {
  if (filters.length === 0) return null;

  return (
    <div
      data-component="ActiveFilterChipBar"
      className="flex items-center gap-2 mt-3 pt-3 flex-wrap"
      style={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <span
        className="uppercase tracking-[0.1em] tabular-nums mr-1"
        style={{
          fontSize: 'var(--text-card-micro)',
          color: 'rgba(0,0,0,0.35)',
        }}
      >
        {filters.length} {filters.length === 1 ? 'FILTER' : 'FILTERS'}
      </span>
      {filters.map((f) => (
        <DismissChip key={`${f.category || ''}-${f.label}`} label={f.label} category={f.category} onRemove={f.onRemove} />
      ))}
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 transition-colors ml-auto cursor-pointer active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
          style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.8)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.4)'; }}
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      )}
    </div>
  );
}
