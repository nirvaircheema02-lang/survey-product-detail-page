export type DropdownChevronSize = 10 | 12;

export interface DropdownChevronProps {
  isOpen: boolean;
  size?: DropdownChevronSize;
}

/**
 * DropdownChevron — small rotating SVG chevron indicating dropdown open/closed state.
 *
 * WHY:
 * - Universal "more below" affordance for dropdowns · accordions · select triggers
 * - 180° rotation on open = recognized convention (↓ closed · ↑ open)
 * - 2 sizes (10/12px) match nav contexts: secondary bar uses 10px · primary nav 12px
 * - `currentColor` stroke means parent text-color controls icon — no per-instance color prop
 * - `aria-hidden` keeps it decorative · parent button must own semantic state
 *
 * WHAT: Inline SVG with `transition-transform duration-300`. Rotates 180° when `isOpen=true`.
 * Stroke uses `currentColor` so it inherits parent text color (light vs dark surface safe).
 * Path geometry slightly different per size to keep visual weight balanced.
 *
 * WHEN:
 * - Dropdown trigger buttons (Company menu · main nav items w/ submenus)
 * - Accordion section headers
 * - Custom select / combobox triggers
 * - Expandable card affordances
 *
 * WHEN NOT:
 * - Standalone navigation arrow → use `<AnimatedArrow>` or Lucide `ChevronRight`
 * - Sort indicators → use `<ChevronUp>`/`<ChevronDown>` Lucide directly (no rotation)
 * - Back-to-top arrows → use `ArrowUp` from Lucide
 * - Pagination "next" buttons → use `ChevronRight` (not Down)
 *
 * HOW:
 * ```tsx
 * <button
 *   onClick={() => setOpen(!open)}
 *   aria-expanded={open}
 *   aria-haspopup="menu"
 *   className="flex items-center gap-1 text-[var(--surface-text)]"
 * >
 *   <span>Company</span>
 *   <DropdownChevron isOpen={open} size={12} />
 * </button>
 * ```
 *
 * A11y: `aria-hidden="true"` (decorative). Parent button MUST set `aria-expanded` to
 *       communicate open/closed state to AT. Stroke uses `currentColor` · contrast
 *       inherited from parent (parent's text-color must hit ≥3:1 vs surface).
 * Motion: 300ms transition on transform. Reduced-motion handled at DS layer.
 * Anti-patterns:
 *  - ❌ Never set color directly (use parent text-color · stroke inherits)
 *  - ❌ Never use w/o `aria-expanded` on parent (rotation alone is not a11y signal)
 *  - ❌ Never use size > 12 (visual heaviness · pick a different icon)
 *  - ❌ Never animate rotation outside this atom (defeats centralization)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (decorative · parent owns state semantics)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/app/components/navbar/atoms/DropdownChevron.tsx
 */
export function DropdownChevron({ isOpen, size = 12 }: DropdownChevronProps) {
  const viewBox = size === 10 ? '0 0 10 10' : '0 0 12 12';
  const path = size === 10 ? 'M8 3.5L5 6.5L2 3.5' : 'M9.75 4.5L6 8.25L2.25 4.5';

  return (
    <svg
      data-component="DropdownChevron"
      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      style={{ width: size, height: size }}
      fill="none"
      viewBox={viewBox}
      aria-hidden="true"
    >
      <path d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
