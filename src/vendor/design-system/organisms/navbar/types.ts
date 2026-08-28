/**
 * Navbar — shared type definitions.
 *
 * SecondaryBar, MobileControls, AuthPopover all share user shape + auth config.
 * Centralized to eliminate drift.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/types.ts
 */

import type { ReactNode, RefObject } from 'react';

/** Authenticated user shape used throughout the navbar */
export interface NavUser {
  name: string;
  email: string;
  initials: string;
}

/** Auth popover state + handlers passed from layout to organisms */
export interface AuthPopoverConfig {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  popoverRef: RefObject<HTMLDivElement | null>;
  mobileButtonRef: RefObject<HTMLButtonElement | null>;
  desktopButtonRef: RefObject<HTMLButtonElement | null>;
}

/** Primary nav item descriptor (drives DesktopNavItems triggers) */
export interface NavItemConfig {
  /** Unique dropdown ID (e.g. 'reports', 'industries') */
  id: string;
  /** Display label (e.g. 'Reports', 'Industries') */
  label: string;
}

/** Mega menu entry — maps a dropdown ID to its React component */
export interface MegaMenuEntry {
  /** Must match a NavItemConfig.id */
  id: string;
  /** Render function receiving isOpen boolean */
  render: (isOpen: boolean) => ReactNode;
}
