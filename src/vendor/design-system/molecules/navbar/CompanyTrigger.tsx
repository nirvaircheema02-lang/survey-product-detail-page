'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import { DropdownChevron } from '../../atoms/DropdownChevron';

export interface CompanyTriggerProps {
  label?: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  dropdown: ReactNode;
}

/**
 * CompanyTrigger — secondary bar dropdown trigger ("Company").
 *
 * Helper-text-sized button + DropdownChevron(10px) + hover color transition.
 * Desktop only. Dropdown panel injected via render prop.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/molecules/CompanyTrigger.tsx
 */
export function CompanyTrigger({
  label = 'Company',
  isOpen,
  onMouseEnter,
  onKeyDown,
  dropdown,
}: CompanyTriggerProps) {
  return (
    <div data-component="CompanyTrigger" className="relative" onMouseEnter={onMouseEnter}>
      <button
        type="button"
        className="
          flex items-center gap-1
          font-[var(--typography-family-body)] font-normal
          text-[var(--surface-text-muted)] hover:text-[var(--color-brand-red)]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2
          rounded-[3px] transition-colors
          text-[var(--typography-size-nav-helper)] leading-[var(--typography-line-height-nav-helper)]
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
        onKeyDown={onKeyDown}
      >
        {label}
        <DropdownChevron isOpen={isOpen} size={10} />
      </button>
      {dropdown}
    </div>
  );
}
