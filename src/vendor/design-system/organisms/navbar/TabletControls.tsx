'use client';

import type { ReactNode } from 'react';
import { HamburgerIcon } from '../../atoms/HamburgerIcon';
import { Avatar } from '../../atoms/Avatar';
import { SearchBar } from '../../molecules/navbar/SearchBar';
import { AuthPopover } from './AuthPopover';
import type { NavUser, AuthPopoverConfig } from './types';

export interface TabletControlsProps {
  user?: NavUser | null;
  isAuthenticated: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  authPopover: Pick<
    AuthPopoverConfig,
    'isOpen' | 'toggle' | 'close' | 'onNavigate' | 'onSignOut' | 'popoverRef' | 'mobileButtonRef'
  >;
  ctaButton?: ReactNode;
}

/**
 * TabletControls — SearchBar + CTA + Avatar + Hamburger (768-1023px).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/TabletControls.tsx
 */
export function TabletControls({
  user,
  isAuthenticated,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  authPopover,
  ctaButton,
}: TabletControlsProps) {
  return (
    <div data-component="TabletControls" className="hidden md:flex lg:hidden items-center gap-3">
      <SearchBar />
      {ctaButton && <div className="shrink-0">{ctaButton}</div>}

      <div className="relative">
        <Avatar
          ref={authPopover.mobileButtonRef}
          size="md"
          initials={isAuthenticated && user ? user.initials : null}
          isActive={authPopover.isOpen}
          onClick={() => {
            authPopover.toggle();
            if (isMobileMenuOpen) onCloseMobileMenu();
          }}
        />
        <AuthPopover
          ref={authPopover.popoverRef}
          isOpen={authPopover.isOpen}
          user={isAuthenticated ? user : null}
          onClose={authPopover.close}
          onNavigate={authPopover.onNavigate}
          onSignOut={authPopover.onSignOut}
        />
      </div>

      <button
        type="button"
        className="
          flex items-center justify-center p-2.5 rounded-[8px]
          hover:bg-[var(--color-ramp-black-100)] active:bg-[var(--color-ramp-black-200)]
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2
        "
        onClick={() => {
          onToggleMobileMenu();
          if (authPopover.isOpen) authPopover.close();
        }}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <HamburgerIcon isOpen={isMobileMenuOpen} />
      </button>
    </div>
  );
}
