'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useMobileMenu — mobile push menu state + body scroll lock side-effect.
 *
 * Locks `document.body.style.overflow = 'hidden'` while open. Cleanup on unmount.
 * Used by MobileControls (hamburger button) + TopNavigation (mobile menu close).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/hooks/useMobileMenu.ts
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, close };
}
