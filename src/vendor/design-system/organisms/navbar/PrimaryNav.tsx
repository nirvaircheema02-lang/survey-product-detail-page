'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import { LogoButton } from '../../atoms/LogoButton';
import { MobileControls } from './MobileControls';
import { TabletControls } from './TabletControls';
import { DesktopNavItems } from './DesktopNavItems';
import type { NavUser, AuthPopoverConfig, NavItemConfig } from './types';

export interface PrimaryNavProps {
  /** Injected logo content — keeps asset outside package boundary */
  logo: ReactNode;
  onLogoClick: () => void;

  isAuthenticated: boolean;
  user?: NavUser | null;

  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;

  authPopover: AuthPopoverConfig;

  items?: NavItemConfig[];
  activeDropdown: string | null;
  onMouseEnter: (menu: string) => void;
  onKeyDown: (e: KeyboardEvent, menu: string) => void;

  /** Injected CTA button — keeps DS Button outside package boundary */
  ctaButton?: ReactNode;
}

/**
 * PrimaryNav — primary navigation content strip (logo + responsive controls).
 *
 * Renders LogoButton + (MobileControls | TabletControls | DesktopNavItems) by breakpoint.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/PrimaryNav.tsx
 */
export function PrimaryNav({
  logo,
  onLogoClick,
  isAuthenticated,
  user,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  authPopover,
  items,
  activeDropdown,
  onMouseEnter,
  onKeyDown,
  ctaButton,
}: PrimaryNavProps) {
  return (
    <div data-component="PrimaryNav" className="max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8 h-full flex items-center justify-between">
      <LogoButton onClick={onLogoClick}>{logo}</LogoButton>

      <MobileControls
        user={user}
        isAuthenticated={isAuthenticated}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={onToggleMobileMenu}
        onCloseMobileMenu={onCloseMobileMenu}
        authPopover={authPopover}
      />

      <TabletControls
        user={user}
        isAuthenticated={isAuthenticated}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={onToggleMobileMenu}
        onCloseMobileMenu={onCloseMobileMenu}
        authPopover={authPopover}
        ctaButton={ctaButton}
      />

      <DesktopNavItems
        items={items}
        activeDropdown={activeDropdown}
        onMouseEnter={onMouseEnter}
        onKeyDown={onKeyDown}
        ctaButton={ctaButton}
      />
    </div>
  );
}
