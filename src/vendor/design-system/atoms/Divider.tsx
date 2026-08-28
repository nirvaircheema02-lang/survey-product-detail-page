import { cn } from '../lib/cn';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'subtle' | 'strong';

export interface DividerProps {
  className?: string;
  orientation?: DividerOrientation;
  /** subtle = popovers (6% opacity); strong = sections (border grey). */
  variant?: DividerVariant;
}

const variantClass: Record<DividerVariant, string> = {
  subtle: 'bg-[var(--border-soft)]',
  strong: 'bg-[var(--border-default)]',
};

/**
 * Divider — 1px horizontal or vertical separator line · subtle or strong variant.
 *
 * WHY:
 * - Source of truth for ALL separator usage — prevents per-component drift (border-color zoo)
 * - 2 variants map to 2 contexts: subtle (popover internals) · strong (page sections)
 * - Token-locked colors (`--border-soft` · `--border-default`) keep light/dark variants consistent
 * - Orientation prop avoids consumers hand-rolling `w-px h-full` vs `h-px w-full`
 * - `role="separator"` + `aria-orientation` give AT semantic awareness when relevant
 *
 * WHAT: Single `<div>` with bg-color + sizing class mapped from variant + orientation.
 * Horizontal: `h-px w-full`. Vertical: `w-px h-full`. Subtle uses `--border-soft`
 * (6% opacity). Strong uses `--border-default`. `aria-hidden="true"` keeps it AT-neutral
 * (decorative · semantic separator role still present for ATs that surface it).
 *
 * WHEN:
 * - Section separators inside a Card body (variant=subtle)
 * - Page-section dividers between major content blocks (variant=strong)
 * - Vertical divider between inline buttons / navbar items (orientation=vertical)
 * - Menu / popover internal grouping (variant=subtle)
 *
 * WHEN NOT:
 * - Decorative line work in illustrations → use SVG
 * - Negative-space separation → use spacing tokens (no line · less visual noise)
 * - Border on a container → use Tailwind `border-*` on the container itself
 * - Semantic content section break → use native `<hr>` (Divider is visual-only)
 *
 * HOW:
 * ```tsx
 * // Inside a popover menu
 * <MenuItem icon={...} label="Profile" />
 * <Divider variant="subtle" />
 * <MenuItem icon={...} label="Sign out" danger />
 *
 * // Vertical between nav items
 * <div className="flex items-center gap-3 h-6">
 *   <Link>Reports</Link>
 *   <Divider orientation="vertical" />
 *   <Link>Surveys</Link>
 * </div>
 * ```
 *
 * A11y: `role="separator"` + `aria-orientation` set · `aria-hidden="true"` keeps it
 *       decorative-by-default. No focus/keyboard interaction. Color via tokens — contrast
 *       not a concern (visual hairline · not text).
 * Motion: None — static element.
 * Anti-patterns:
 *  - ❌ Never use as a border on a Card (use `border` class on Card itself)
 *  - ❌ Never override bg-color via className (defeats variant token purpose)
 *  - ❌ Never use vertical orientation without explicit parent height (collapses)
 *  - ❌ Never stack 2 Dividers (use spacing token instead)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (decorative · AT-neutral)
 * @reusabilityScore 5/5 ⭐
 * @promotedFrom topnav-v32/src/design-system/components/Divider.tsx
 */
export function Divider({
  className,
  orientation = 'horizontal',
  variant = 'subtle',
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  return (
    <div
      data-component="Divider"
      className={cn(
        isHorizontal ? 'h-[1px] w-full' : 'w-[1px] h-full',
        variantClass[variant],
        className,
      )}
      role="separator"
      aria-orientation={orientation}
      aria-hidden="true"
    />
  );
}
