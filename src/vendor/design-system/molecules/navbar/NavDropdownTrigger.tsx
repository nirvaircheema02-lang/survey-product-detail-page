'use client';

import type { KeyboardEvent } from 'react';
import { DropdownChevron } from '../../atoms/DropdownChevron';

export interface NavDropdownTriggerProps {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  className?: string;
}

/**
 * NavDropdownTrigger — main-nav-level dropdown trigger w/ label + chevron + hover underline.
 *
 * Gradient underline (black→grey→red) scales 0→1 on hover. 60px tall vertical center.
 * Use for primary nav items (Reports, Industries, Surveys, Consulting, Insights).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/molecules/NavDropdownTrigger.tsx
 */
export function NavDropdownTrigger({
  label,
  isOpen,
  onMouseEnter,
  onKeyDown,
  className = '',
}: NavDropdownTriggerProps) {
  return (
    <div
      data-component="NavDropdownTrigger"
      className={`relative h-[60px] flex items-center group ${className}`}
      onMouseEnter={onMouseEnter}
    >
      <button
        type="button"
        onKeyDown={onKeyDown}
        className="
          relative flex items-center gap-1
          font-[var(--typography-family-body)] font-normal
          text-[var(--surface-text)] hover:text-[var(--color-brand-red)]
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2
          transition-colors rounded-[var(--radius-button)] py-1 pb-2
          text-[var(--typography-size-nav-primary)] leading-[var(--typography-line-height-nav-primary)]
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${label} menu`}
      >
        {label}
        <DropdownChevron isOpen={isOpen} size={12} />
        <div
          className="
            absolute bottom-0 left-0 right-0 h-[2px] rounded-full
            bg-gradient-to-r from-[var(--color-foundation-black)] via-[var(--surface-text-muted)] to-[var(--color-brand-red)]
            transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100
          "
        />
      </button>
    </div>
  );
}
