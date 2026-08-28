'use client';

import { Search } from 'lucide-react';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * SearchBar — pill-shaped search input w/ purple beam orbit animation.
 *
 * Visible on desktop ≥1024px, between nav triggers and CTA.
 * 120×35px pill. Inner: white-ish bg + 2px inset. Outer: light-purple bg + purple shadow.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/molecules/SearchBar.tsx
 */
export function SearchBar({ placeholder = 'Search', onSearch, className = '' }: SearchBarProps) {
  return (
    <div data-component="SearchBar" className={`relative h-[35px] w-[120px] ${className}`}>
      <div className="bg-[var(--color-ramp-periwinkle-100)] overflow-clip relative rounded-[99px] shadow-[6.98px_-1.02px_14px_-4px_rgba(128,108,224,0.3)] size-full">
        {/* Purple beam orbit animation */}
        <div
          className="absolute blur-[4px] h-[31px] w-[65px] animate-beam-orbit"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 65 31" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(3.25 0 0 1.55 32.5 15.5)"><stop stop-color="rgba(128,108,224,1)" offset="0"/><stop stop-color="rgba(128,108,224,0)" offset="1"/></radialGradient></defs></svg>\')',
          }}
        />
        <div className="absolute bg-[var(--color-foundation-white)] content-stretch flex gap-[12.33px] inset-[2px] items-center px-[8px] rounded-[99px]">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder={placeholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="
                bg-transparent
                font-[var(--typography-family-body)] font-normal
                text-[var(--surface-text)] placeholder:text-[var(--surface-text)]
                outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ramp-purple-500,#806ce0)] focus-visible:ring-offset-1 rounded-sm w-full text-[14px] leading-[22px]
              "
              aria-label="Search Ken Research"
            />
          </div>
          <div className="shrink-0 size-[16px] flex items-center justify-center">
            <Search size={16} className="text-[var(--surface-text)]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
