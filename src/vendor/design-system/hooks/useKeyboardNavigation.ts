'use client';

import { useEffect } from 'react';

export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * Window-scoped keyboard event handler — fires named callbacks per key.
 *
 * Use for: modal dismiss (Escape), list navigation (Arrow keys),
 * carousel control, custom keyboard-first interactions.
 *
 * Pair with `useFocusTrap` for modal a11y.
 *
 * @example
 *   useKeyboardNavigation({
 *     onEscape: closeModal,
 *     onArrowDown: focusNext,
 *     enabled: isModalOpen,
 *   });
 *
 * @promotedFrom V0_lite_report
 */
export function useKeyboardNavigation(options: KeyboardNavigationOptions): void {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':    if (onEscape)    { event.preventDefault(); onEscape(); }    break;
        case 'Enter':     if (onEnter)     { event.preventDefault(); onEnter(); }     break;
        case 'ArrowUp':   if (onArrowUp)   { event.preventDefault(); onArrowUp(); }   break;
        case 'ArrowDown': if (onArrowDown) { event.preventDefault(); onArrowDown(); } break;
        case 'ArrowLeft': if (onArrowLeft) { event.preventDefault(); onArrowLeft(); } break;
        case 'ArrowRight':if (onArrowRight){ event.preventDefault(); onArrowRight(); }break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, enabled]);
}
