'use client';

import { forwardRef } from 'react';
import { cn } from '../lib/cn';
import { StatusDot } from './StatusDot';

export type AvatarSize = 'sm' | 'md';

export interface AvatarProps {
  /** sm = 28px (inline desktop) · md = 40px (standalone mobile) */
  size?: AvatarSize;
  /** User initials — when provided renders text; otherwise renders person icon */
  initials?: string | null;
  /** Active state — darkens border, indicates expanded popover */
  isActive: boolean;
  onClick: () => void;
  /** Show notification dot. Default: shows when no initials (unauthenticated). */
  showDot?: boolean;
  dotColor?: string;
  ariaLabel?: string;
}

const sizeContainer: Record<AvatarSize, string> = {
  sm: 'size-[28px]',
  md: 'size-[40px]',
};

const sizeText: Record<AvatarSize, string> = {
  sm: 'text-[11px]',
  md: 'text-[13px]',
};

const sizeIcon: Record<AvatarSize, string> = {
  sm: 'size-[14px]',
  md: 'size-[18px]',
};

/**
 * Avatar — circular user-identity affordance · initials · icon fallback · optional status dot.
 *
 * WHY:
 * - Account/profile signal needed in nav across both authenticated + unauthenticated states
 * - Initials > silhouette > generic icon as personalization signal (status hierarchy)
 * - Active border state communicates "popover/menu open" (paired w/ AuthPopover)
 * - StatusDot composition keeps notification logic out of Avatar (separation of concerns)
 * - Two sizes match nav contexts: 28px inline desktop · 40px standalone mobile
 *
 * WHAT: `forwardRef` button atom rendering 28/40px circle. Shows initials when provided,
 * person SVG silhouette otherwise. `isActive` darkens border to indicate expanded state.
 * Composes `<StatusDot>` for notification badge (default visible when unauthenticated).
 *
 * WHEN:
 * - Top-nav account affordance (desktop + mobile)
 * - User profile menu triggers across surfaces
 * - Comment/reply attribution rows (sm size, inline w/ name)
 * - Team member listings (md size)
 *
 * WHEN NOT:
 * - Display-only profile pictures → use raw `<img>` (no button affordance · no click)
 * - Large hero profile imagery → use dedicated `ProfileHero` molecule (Avatar caps at 40px)
 * - Anonymous/system actors → use a `<Badge>` or icon, not Avatar
 * - Stack/group avatars (overlapping circles) → use future `AvatarStack` molecule
 *
 * HOW:
 * ```tsx
 * // Authenticated · md (standalone)
 * <Avatar size="md" initials="VC" isActive={open} onClick={togglePopover} />
 *
 * // Unauthenticated · sm (inline) · shows red dot prompting sign-in
 * <Avatar size="sm" initials={null} isActive={false} onClick={openSignIn} />
 * ```
 *
 * A11y: `aria-label` (default "Account options") · `aria-expanded={isActive}` · `aria-haspopup="true"`.
 *       Focus ring `ring-2 ring-[rgba(20,16,22,0.5)]` 2px offset. Touch-manipulation on md size.
 *       28px sm size below WCAG 2.5.5 44px floor — inline context only (paired w/ larger tap parent).
 * Motion: 200ms transition on border + bg. No transform animation (would distract in nav context).
 * Anti-patterns:
 *  - ❌ Never use sm size as standalone tap target (below 44px touch floor)
 *  - ❌ Never override border colors (active state intent baked in)
 *  - ❌ Never strip StatusDot composition (notification signal is the point for unauthenticated)
 *  - ❌ Never render >2 initials (3+ chars overflow the 28/40px container)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (md size · sm exempt for inline context)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/design-system/components/Avatar.tsx
 */
export const Avatar = forwardRef<HTMLButtonElement, AvatarProps>(
  (
    {
      size = 'md',
      initials,
      isActive,
      onClick,
      showDot,
      dotColor = 'var(--color-brand-red)',
      ariaLabel = 'Account options',
    },
    ref,
  ) => {
    const isAuthenticated = !!initials;
    const shouldShowDot = showDot ?? !isAuthenticated;

    return (
      <button
        data-component="Avatar"
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-expanded={isActive}
        aria-haspopup="true"
        className={cn(
          'relative flex items-center justify-center rounded-full border-[1.5px] transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2',
          sizeContainer[size],
          size === 'md' && 'touch-manipulation',
          isActive
            ? 'border-[var(--color-foundation-black)] bg-[var(--color-ramp-black-100)] text-[var(--surface-text)]'
            : 'border-[rgba(20,16,22,0.15)] bg-[var(--color-ramp-black-50)] text-[var(--surface-text)] hover:border-[rgba(20,16,22,0.4)] hover:bg-[var(--color-ramp-black-100)]',
          size === 'md' && !isActive && 'active:bg-[var(--color-ramp-black-200)]',
        )}
      >
        {isAuthenticated ? (
          <span className={cn('font-[var(--typography-family-body)] font-bold', sizeText[size], 'text-[var(--surface-text)]')}>
            {initials}
          </span>
        ) : (
          <svg
            className={cn(sizeIcon[size], 'text-[var(--surface-text-muted)]')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        )}
        <StatusDot visible={shouldShowDot} color={dotColor} />
      </button>
    );
  },
);

Avatar.displayName = 'Avatar';
