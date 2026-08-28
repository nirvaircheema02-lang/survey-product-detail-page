'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import { NavDropdownTrigger } from '../../molecules/navbar/NavDropdownTrigger';
import { SearchBar } from '../../molecules/navbar/SearchBar';
import type { NavItemConfig } from './types';

const DEFAULT_NAV_ITEMS: NavItemConfig[] = [
  { id: 'reports',    label: 'Reports' },
  { id: 'industries', label: 'Industries' },
  { id: 'survey',     label: 'Surveys' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'insights',   label: 'Insights' },
];

export interface DesktopNavItemsProps {
  items?: NavItemConfig[];
  activeDropdown: string | null;
  onMouseEnter: (menu: string) => void;
  onKeyDown: (e: KeyboardEvent, menu: string) => void;
  /** Injected CTA button — keeps DS Button outside package boundary */
  ctaButton?: ReactNode;
}

/**
 * DesktopNavItems — primary nav triggers + search + CTA. Visible ≥1024px.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/DesktopNavItems.tsx
 */
export function DesktopNavItems({
  items = DEFAULT_NAV_ITEMS,
  activeDropdown,
  onMouseEnter,
  onKeyDown,
  ctaButton,
}: DesktopNavItemsProps) {
  return (
    <>
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        {items.map((item) => (
          <NavDropdownTrigger
            key={item.id}
            label={item.label}
            isOpen={activeDropdown === item.id}
            onMouseEnter={() => onMouseEnter(item.id)}
            onKeyDown={(e) => onKeyDown(e, item.id)}
          />
        ))}
        <SearchBar />
      </div>
      {ctaButton && <div className="hidden lg:block">{ctaButton}</div>}
    </>
  );
}
