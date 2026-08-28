/**
 * WindowControls — Molecule
 *
 * WHAT: macOS-style three-dot window chrome + optional label.
 *       Three circles (close/minimise/maximise) aligned left, label right.
 *       Static — purely decorative, no functional close/min/max behaviour.
 *
 * WHY: V0_lite HeroSection.tsx (L462-477) uses this pattern at the top of
 *      the report preview card to simulate a browser/app window frame.
 *      Signals "this is a preview of real software" — contextual skeuomorphism.
 *      Consistent across preview cards so consumers don't re-implement the dots.
 *
 * WHEN: Inside any preview card, sample report card, or demo screenshot frame.
 *       Always paired with the card shell — never standalone.
 *
 * WHEN NOT: Do NOT use in production UI chrome — it's decorative only.
 *           Do NOT use as navigation affordance.
 *
 * WHERE: PreviewCard molecule · SampleReportPreview organism chapter headers ·
 *        HeroSection right-column preview card.
 *
 * HOW:
 * ```tsx
 * // Default (dark surface — white/20 dots)
 * <WindowControls label="Sample Preview" />
 *
 * // Light surface — black/20 dots
 * <WindowControls colorScheme="light" label="Chapter 2" />
 *
 * // No label
 * <WindowControls />
 * ```
 *
 * A11y: `aria-hidden="true"` on the entire control row — purely decorative.
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · HeroSection.tsx:462-477
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */

import { cn } from '../lib/cn';

export interface WindowControlsProps {
  /**
   * Optional label displayed on the right side of the control row.
   * Example: "Sample Preview", "Chapter 2".
   */
  label?: string;
  /**
   * Color scheme — adapts dot and label colors to the card surface.
   * "dark" → white/20 dots, white/40 label (cinematic preview cards).
   * "light" → black/20 dots, black/40 label (editorial preview cards).
   * @default 'dark'
   */
  colorScheme?: 'light' | 'dark';
  /** Additional className on the root wrapper div. */
  className?: string;
}

/**
 * WindowControls
 *
 * Static macOS-style three-dot chrome row with optional right-aligned label.
 * Entirely aria-hidden — decorative only.
 */
export function WindowControls({
  label,
  colorScheme = 'dark',
  className,
}: WindowControlsProps) {
  const isDark = colorScheme === 'dark';

  const dotClass = isDark ? 'bg-white/20' : 'bg-black/20';
  const labelClass = isDark ? 'text-white/40' : 'text-black/40';

  return (
    <div
      data-component="WindowControls"
      className={cn('flex items-center justify-between', className)}
      aria-hidden="true"
    >
      {/* Three dots — close, minimise, maximise */}
      <div className="flex items-center gap-2">
        <div className={cn('h-3 w-3 rounded-full', dotClass)} />
        <div className={cn('h-3 w-3 rounded-full', dotClass)} />
        <div className={cn('h-3 w-3 rounded-full', dotClass)} />
      </div>

      {/* Optional label */}
      {label && (
        <span
          className={cn('font-sans', labelClass)}
          style={{ fontSize: 'var(--text-xs)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
