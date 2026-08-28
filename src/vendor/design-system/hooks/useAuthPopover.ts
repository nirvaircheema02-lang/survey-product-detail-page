'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAuthPopover — auth popover state + outside-click dismissal.
 *
 * Manages 3 refs (popover card + mobile trigger + desktop trigger) for proper
 * boundary detection. mousedown listener auto-closes when click target is
 * outside ALL three refs.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/hooks/useAuthPopover.ts
 */
export function useAuthPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsidePopover = popoverRef.current?.contains(target);
      const isInsideMobileButton = mobileButtonRef.current?.contains(target);
      const isInsideDesktopButton = desktopButtonRef.current?.contains(target);

      if (!isInsidePopover && !isInsideMobileButton && !isInsideDesktopButton) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { isOpen, toggle, close, open, popoverRef, mobileButtonRef, desktopButtonRef };
}
