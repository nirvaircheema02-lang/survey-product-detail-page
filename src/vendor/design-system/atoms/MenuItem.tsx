'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface MenuItemProps {
  icon: ReactNode;
  label: string;
  /** Secondary text below label */
  subtitle?: string;
  onClick: () => void;
  /** Danger variant — red text + red hover bg (destructive actions) */
  danger?: boolean;
  /** Wrap icon in 32px rounded background square */
  iconBg?: boolean;
  /** Min tap target height in px. Default 40 (mobile = 44 recommended). */
  minHeight?: number;
}

/**
 * MenuItem — popover/dropdown menu row · icon + label (+ optional subtitle) · default + danger variants.
 *
 * WHY:
 * - Popovers need a consistent row anatomy across AuthPopover · settings · context menus
 * - Danger variant centralizes destructive-action styling (Sign out · Delete) — no per-menu overrides
 * - `iconBg` wraps icon in 32px tinted square — visual hierarchy for "primary" vs "tertiary" rows
 * - `role="menuitem"` correct ARIA role inside parent `role="menu"` popover (WAI-ARIA pattern)
 * - 40px default minHeight balances density · 44px mobile recommendation handled by parent menu wrapper
 *
 * WHAT: `<button role="menuitem">` w/ flex row layout. Hover bg = ramp-black-50 (or error-bg for danger).
 * Active bg = ramp-black-100 (or error-bg-hover). Text + icon turn brand-red on danger.
 * Subtitle slot renders a 2-line stack (label + 10px muted subtitle) when provided.
 *
 * WHEN:
 * - AuthPopover rows (Sign in · Profile · Sign out)
 * - Settings dropdown options
 * - Context menus (Edit · Duplicate · Delete)
 * - Account switcher rows
 *
 * WHEN NOT:
 * - Navigation list items in a sidebar → use `<CategoryListItem>` (count + chevron anatomy)
 * - Form select options → use native `<select>` or future `<Combobox>` molecule
 * - Multi-select filter rows → use `<FilterCheckboxItem>`
 * - Inline button rows in a card → use `<Button variant="ghost">`
 *
 * HOW:
 * ```tsx
 * <div role="menu" aria-label="Account menu" className="bg-white shadow-lg rounded-lg p-1">
 *   <MenuItem icon={<User size={14} />} label="Profile" onClick={openProfile} />
 *   <MenuItem icon={<Settings size={14} />} label="Settings" subtitle="Preferences & billing" onClick={openSettings} />
 *   <Divider variant="subtle" />
 *   <MenuItem icon={<LogOut size={14} />} label="Sign out" danger onClick={signOut} />
 * </div>
 * ```
 *
 * A11y: `role="menuitem"` + semantic `<button>` · keyboard activatable. Parent should
 *       wrap in `role="menu"` + roving tabindex for arrow-key navigation (consumer responsibility).
 *       Touch target ≥40px default (set 44 on mobile via `minHeight` prop).
 *       Color contrast: text vs hover-bg verified · danger variant brand-red on light bg ≥4.5:1.
 * Motion: `transition-colors` only · no transform. Reduced-motion neutral (color != motion).
 * Anti-patterns:
 *  - ❌ Never use outside a `role="menu"` parent (menuitem role requires menu container)
 *  - ❌ Never use danger variant for non-destructive actions (loses warning signal)
 *  - ❌ Never override `hover:bg` via className (defeats variant system)
 *  - ❌ Never nest interactive elements inside (button can't contain button/link)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (parent menu wrapper responsibility for roving tabindex)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/design-system/components/MenuItem.tsx
 */
export function MenuItem({
  icon,
  label,
  subtitle,
  onClick,
  danger = false,
  iconBg = false,
  minHeight = 40,
}: MenuItemProps) {
  const hoverBg = danger
    ? 'hover:bg-[var(--semantic-status-error-bg)] active:bg-[var(--semantic-status-error-bg-hover)]'
    : 'hover:bg-[var(--color-ramp-black-50)] active:bg-[var(--color-ramp-black-100)]';

  const textColor = danger ? 'text-[var(--color-brand-red)]' : 'text-[var(--surface-text)]';
  const iconColor = danger ? 'text-[var(--color-brand-red)]' : 'text-[var(--surface-text-muted)]';

  return (
    <button
      data-component="MenuItem"
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[8px]',
        'transition-colors touch-manipulation text-left bg-transparent border-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1',
        hoverBg,
      )}
      style={{ minHeight }}
    >
      {iconBg ? (
        <div className="size-[32px] rounded-[8px] bg-[var(--color-ramp-black-100)] flex items-center justify-center flex-shrink-0">
          <span className={cn('size-[14px]', iconColor)}>{icon}</span>
        </div>
      ) : (
        <span className={cn('size-[14px] flex-shrink-0', iconColor)}>{icon}</span>
      )}

      {subtitle ? (
        <div>
          <p className={cn('font-[var(--typography-family-body)] font-medium text-[13px]', textColor)}>{label}</p>
          <p className="font-[var(--typography-family-body)] text-[10px] text-[var(--surface-text-subtle)]">{subtitle}</p>
        </div>
      ) : (
        <span className={cn('font-[var(--typography-family-body)] text-[13px]', textColor)}>{label}</span>
      )}
    </button>
  );
}
