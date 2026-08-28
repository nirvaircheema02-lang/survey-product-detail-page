/**
 * SubtleVariantSwitcher — Atom (designer tool)
 *
 * WHY: Design exploration needs an unobtrusive way to toggle between
 *      visual variants of a section without disrupting page layout.
 *      Designer/developer tool — NOT end-user facing.
 * WHAT: Small floating control at section corner showing current variant.
 *       Expands on hover w/ variant descriptions.
 * WHEN: Sections w/ multiple visual modes (card styles · hero variants).
 *       Design-review sessions for quick A/B comparison.
 * WHEN NOT: Production end-user builds · single-variant sections ·
 *           inside scroll-locked containers.
 *
 * HOW:
 * ```tsx
 * <section className="relative">
 *   <SubtleVariantSwitcher
 *     sectionName="Hero"
 *     currentVariant={variant}
 *     variants={[
 *       { id: 'a', label: 'Editorial', description: 'Light surface' },
 *       { id: 'b', label: 'Cinematic', description: 'Dark hero' },
 *     ]}
 *     onVariantChange={setVariant}
 *     position="top-right"
 *   />
 *   {variant === 'a' ? <HeroA /> : <HeroB />}
 * </section>
 * ```
 *
 * @promotedFrom Design_system_vs_26/src/app/components/SubtleVariantSwitcher.tsx
 * @portedDate 2026-05-12 — DS Port Batch 2 · Tier 2
 *
 * 2026-08-14 — added click/tap-to-open (the trigger pill is now a real
 * <button>) alongside the existing hover-open. Previously hover was the
 * ONLY way to open the variant list: no keyboard path, unreliable on touch
 * (flagged from LayoutVariantSwitcher.tsx's consumer-side doc comment,
 * competition-benchmarking-2026). Escape and outside click/tap now close it.
 *
 * NOT a raw onClick toggle (`prev => !prev`) — verified via real Playwright
 * `.click()` (which moves the pointer onto the element before the click,
 * same as any real mouse) that a toggle fights the hover handler: the
 * pointer-in from approaching the button fires `onMouseEnter` (opens it)
 * microtasks before the click's own handler runs, so a toggle immediately
 * re-closes what hover just opened — net effect, first click does nothing.
 * `onClick` therefore always sets expanded to `true` (idempotent, matches
 * hover's own semantics exactly) — closing is exclusively `onMouseLeave` /
 * outside click-tap / Escape, never the trigger's own click.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';

export interface VariantOption {
  id: string;
  label: string;
  description?: string;
}

export interface SubtleVariantSwitcherProps {
  /** Section name for the label */
  sectionName: string;
  /** Currently active variant ID */
  currentVariant: string;
  /** Array of variant options */
  variants: VariantOption[];
  /** Callback when variant changes */
  onVariantChange: (variantId: string) => void;
  /** Position relative to the section */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Color theme */
  theme?: 'light' | 'dark';
}

export function SubtleVariantSwitcher({
  sectionName,
  currentVariant,
  variants,
  onVariantChange,
  position = 'top-right',
  theme = 'light',
}: SubtleVariantSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = theme === 'dark';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const currentLabel =
    variants.find((v) => v.id === currentVariant)?.label || currentVariant;

  // Trigger anchored to the viewport/container BOTTOM ('bottom-left' |
  // 'bottom-right') → open the dropdown UPWARD so it can't get pushed past
  // the bottom viewport edge (e.g. LayoutVariantSwitcher.tsx's bottom-docked
  // instance in competition-benchmarking-2026 — trigger sits near the
  // viewport bottom, so opening downward pushed the whole options list
  // off-screen). Top-anchored triggers ('top-left' | 'top-right') keep
  // opening downward — unchanged, there's normally more room below them.
  const opensUpward = position.startsWith('bottom-');

  // Closes the expanded list from outside the control — Escape (keyboard,
  // no native equivalent) or a click/tap outside `rootRef` (mouse + touch;
  // 'touchstart' alongside 'mousedown' since touch has no hover to fall
  // back on). Only wired while expanded, so hover-only usage never pays for
  // a listener it doesn't need. Enter/Space need no handler here — they're
  // native `<button>` activation on the trigger below, handled for free.
  useEffect(() => {
    if (!isExpanded) return;

    function handleOutsideInteraction(event: MouseEvent | TouchEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <div
      ref={rootRef}
      data-component="SubtleVariantSwitcher"
      className={`absolute z-20 ${positionClasses[position]}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(true)}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          text-xs font-medium cursor-pointer select-none
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset
          ${
            isDark
              ? 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/80 border border-white/10'
              : 'bg-black/5 text-black/50 hover:bg-black/8 hover:text-black/70 border border-black/10'
          }
        `}
      >
        <Settings className="w-3 h-3" strokeWidth={2} />
        <span>
          {sectionName}: {currentLabel}
        </span>
      </button>

      {isExpanded && (
        <div
          className={`
            absolute rounded-[5px] overflow-hidden shadow-lg min-w-[200px]
            ${opensUpward ? 'bottom-full mb-2' : 'mt-2'}
            ${position.includes('right') ? 'right-0' : 'left-0'}
            ${
              isDark
                ? 'bg-black/90 border border-white/15 backdrop-blur-md'
                : 'bg-white border border-black/10 backdrop-blur-md'
            }
          `}
        >
          <div
            className={`px-3 py-2 text-xs font-medium uppercase tracking-wider border-b ${
              isDark
                ? 'text-white/40 border-white/10'
                : 'text-black/40 border-black/10'
            }`}
          >
            Variants
          </div>
          {variants.map((variant) => {
            const isActive = variant.id === currentVariant;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onVariantChange(variant.id)}
                className={`
                  w-full px-3 py-2.5 text-left text-sm transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset
                  ${
                    isActive
                      ? isDark
                        ? 'bg-white/15 text-white'
                        : 'bg-black/8 text-black'
                      : isDark
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-black/60 hover:bg-black/5 hover:text-black'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0`}
                    style={{
                      backgroundColor: isActive
                        ? 'var(--color-brand-red)'
                        : isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.15)',
                    }}
                  />
                  <div>
                    <div className="font-medium">{variant.label}</div>
                    {variant.description && (
                      <div
                        className={`text-xs mt-0.5 ${
                          isDark ? 'text-white/40' : 'text-black/40'
                        }`}
                      >
                        {variant.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
