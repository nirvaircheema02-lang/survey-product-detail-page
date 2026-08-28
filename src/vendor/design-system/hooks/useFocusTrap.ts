'use client';

import { useEffect, useRef } from 'react';

/**
 * Trap keyboard focus inside a container — for modals, dashboards, drawers.
 *
 * Returns a ref to attach to the trapping container. Tab/Shift+Tab cycle
 * within focusable descendants. First focusable receives focus on activation.
 *
 * Pair with `useKeyboardNavigation({ onEscape })` for full modal a11y.
 *
 * @example
 *   const trapRef = useFocusTrap(isOpen);
 *   return <div ref={trapRef} role="dialog">...</div>;
 *
 * @promotedFrom V0_lite_report
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    return () => container.removeEventListener('keydown', handleTab);
  }, [isActive]);

  return containerRef;
}
