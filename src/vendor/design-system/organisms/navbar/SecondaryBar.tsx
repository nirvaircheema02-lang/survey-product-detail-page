'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import { TextLink } from '../../atoms/TextLink';
import { Avatar } from '../../atoms/Avatar';
import { AuthButtons } from '../../molecules/navbar/AuthButtons';
import { CompanyTrigger } from '../../molecules/navbar/CompanyTrigger';
import { AuthPopover } from './AuthPopover';
import type { NavUser, AuthPopoverConfig } from './types';

export interface SecondaryBarProps {
  activeDropdown: string | null;
  onMouseEnter: (menu: string) => void;
  onMouseLeave: () => void;
  onKeyDown: (e: KeyboardEvent, menu: string) => void;
  isAuthenticated: boolean;
  user?: NavUser | null;
  authPopover: Pick<
    AuthPopoverConfig,
    'isOpen' | 'toggle' | 'close' | 'onNavigate' | 'onSignOut' | 'popoverRef' | 'desktopButtonRef'
  >;
  /** Injected company dropdown content — keeps package boundary clean */
  companyDropdown?: ReactNode;
}

/**
 * SecondaryBar — 40px desktop top bar above PrimaryNav.
 *
 * Left: utility links (Procurement, Expert Panel) + Company dropdown.
 * Right: AuthButtons (logged-out) OR user name + Avatar + AuthPopover (logged-in).
 * Hidden on mobile (`hidden md:block`).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/SecondaryBar.tsx
 */
export function SecondaryBar({
  activeDropdown,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  isAuthenticated,
  user,
  authPopover,
  companyDropdown,
}: SecondaryBarProps) {
  return (
    <div
      data-component="SecondaryBar"
      className="bg-[var(--color-ramp-black-50)] border-b border-[var(--border-soft)] h-[40px] relative w-full z-[60] hidden md:block"
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <TextLink href="/procurement" size="sm">Procurement</TextLink>
          <TextLink href="/expert-panel" size="sm">Expert Panel</TextLink>

          <CompanyTrigger
            isOpen={activeDropdown === 'company'}
            onMouseEnter={() => onMouseEnter('company')}
            onKeyDown={(e) => onKeyDown(e, 'company')}
            dropdown={companyDropdown}
          />
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative flex items-center gap-3">
              <span className="font-[var(--typography-family-body)] font-normal text-[var(--surface-text-muted)] text-[12px]">
                {user.name}
              </span>
              <Avatar
                ref={authPopover.desktopButtonRef}
                size="sm"
                initials={user.initials}
                isActive={authPopover.isOpen}
                onClick={authPopover.toggle}
              />
              <AuthPopover
                ref={authPopover.popoverRef}
                isOpen={authPopover.isOpen}
                user={user}
                onClose={authPopover.close}
                onNavigate={authPopover.onNavigate}
                onSignOut={authPopover.onSignOut}
              />
            </div>
          ) : (
            <AuthButtons
              onSignIn={() => authPopover.onNavigate('/auth?mode=signin')}
              onSignUp={() => authPopover.onNavigate('/auth?mode=signup')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
