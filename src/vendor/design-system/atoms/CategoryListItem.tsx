/**
 * CategoryListItem — single category navigation row · IconBadge · label · count · chevron.
 *
 * WHY:
 * - Reusable row pattern for CategoryListCard · sidebar industry lists · grouped-item nav
 * - Active state via 3px black borderLeft + bg tint communicates "you are here" w/o color
 * - Monochromatic opacity-based color system avoids per-category accent colors (DS v4.3)
 * - IconBadge composition centralizes icon affordance (no per-instance icon styling)
 * - Chevron hover translate (0.5px) hints at navigation intent without being distracting
 *
 * WHAT: Full-width button row. Left: optional IconBadge. Center: truncate label.
 * Right: tabular-nums count (locale-formatted) + optional chevron. Active state =
 * 3px black borderLeft + 4% bg tint + darker text. Pure rgba() inline styles.
 *
 * WHEN:
 * - CategoryListCard · sidebar industry lists
 * - IndustrySectorsGrid compact mode
 * - Any vertical list-based navigation w/ label + count anatomy
 * - "Browse by X" pickers w/ many items
 *
 * WHEN NOT:
 * - Multi-select filtering → use `<FilterCheckboxItem>` (checkbox affordance)
 * - Horizontal nav tabs → use future `<TabBar>` molecule
 * - Heavy detail rows (description + meta) → use `<ResourceCard>` minimal variant
 * - Single-row callouts → use `<CTALink>` (richer affordance)
 *
 * HOW:
 * ```tsx
 * <CategoryListItem
 *   label="Industrials"
 *   count={142}
 *   icon={Factory}
 *   active={selected === 'industrials'}
 *   onClick={() => setSelected('industrials')}
 * />
 * ```
 *
 * A11y: Semantic `<button>` · keyboard activatable. Truncate via CSS — full label
 *       NOT exposed to AT (consider `title` attribute · future enhancement).
 *       Active state communicates via border + text-darkening · color-blind safe.
 *       SMELL — no `aria-pressed` for active state (toggle-semantics gap).
 * Motion: 150ms transition-all. Chevron `translate-x-0.5` on group-hover (subtle nudge).
 *         Reduced-motion handled at DS layer.
 * Anti-patterns:
 *  - ❌ Never use Tailwind color classes (DS v4.3 forbids · inline rgba only)
 *  - ❌ Never override borderLeft (active indicator is signature)
 *  - ❌ Never use as form input row (no checkbox/radio semantics)
 *  - ❌ Never render w/o count for nav lists where count drives discovery
 *
 * @lifecycle stable
 * @a11y_status pending-review (missing aria-pressed · truncate label not exposed to AT)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom Design_system_vs_26 OG (audit CategoryListItem.md · DS Port Batch 5)
 */
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { IconBadge } from './IconBadge';

interface CategoryListItemProps {
  /** Display label */
  label: string;
  /** Optional count badge */
  count?: number;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Whether the item is currently selected/active */
  active?: boolean;
  /** Whether to show trailing chevron */
  showChevron?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

export function CategoryListItem({
  label,
  count,
  icon,
  active = false,
  showChevron = true,
  onClick,
  className = '',
}: CategoryListItemProps) {
  return (
    <button
      data-component="CategoryListItem"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset ${className}`}
      aria-pressed={active}
      style={{
        borderLeft: active ? '3px solid rgba(0,0,0,0.9)' : '3px solid rgba(0,0,0,0)',
        backgroundColor: active ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0)',
      }}
    >
      {icon && (
        <IconBadge
          icon={icon}
          size="xs"
          color={active ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)'}
          bgColor={active ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'}
        />
      )}

      <span
        className="flex-1 text-left truncate transition-colors"
        style={{
          fontSize: 'var(--text-sm)',
          color: active ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.55)',
        }}
      >
        {label}
      </span>

      {count !== undefined && (
        <span
          className="tabular-nums flex-shrink-0"
          style={{
            fontSize: 'var(--text-xs)',
            color: active ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.2)',
          }}
        >
          {count.toLocaleString()}
        </span>
      )}

      {showChevron && (
        <ChevronRight
          size={14}
          className="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: active ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)' }}
        />
      )}
    </button>
  );
}
