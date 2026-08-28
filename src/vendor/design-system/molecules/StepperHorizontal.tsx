/**
 * StepperHorizontal — Molecule
 *
 * WHAT: Horizontally scrollable step-tab row. Each step is a labelled button
 *       with a circular step-number badge. Active step = black-fill + white text.
 *       Inactive = white + warm-500 border + coral-50 hover. ChevronRight separators.
 *       Mobile: scrolls horizontally (hidden scrollbar, step number visible, label hidden).
 *       Desktop (sm+): justify-center, full labels visible.
 *
 * WHY: Methodology sections need a non-linear step-picker UI. A horizontal stepper
 *      lets users jump to any step without scrolling past all preceding ones
 *      (Miller's Law — chunk 3-7 steps, keyboard-navigable). Active visual state
 *      (elevated dual-shadow on grid card below) signals which card is selected.
 *
 * WHEN: Research Methodology section stepper. Any 2-7-step chooser with
 *       tab-like switching where step order matters (Approach → Collect → Validate).
 *
 * WHEN NOT: Wizard / checkout flows requiring sequential validation — use <form> steps.
 *           More than 7 steps — stepper becomes unreadable on mobile.
 *           Navigation links — use Navbar / Breadcrumb instead.
 *
 * WHERE: ResearchMethodology organism · StepperPlusGridTemplate.
 *
 * HOW:
 * ```tsx
 * const steps = [
 *   { id: 1, label: 'Approach' },
 *   { id: 2, label: 'Data Collection' },
 *   { id: 3, label: 'Validation' },
 * ];
 * const [active, setActive] = useState(1);
 *
 * <StepperHorizontal steps={steps} activeId={active} onStepChange={setActive} />
 * ```
 *
 * A11y:
 * - Each button: `aria-pressed={isActive}`, `aria-label="Step N: Label"`
 * - ChevronRight separators: `aria-hidden="true"`
 * - Step number badge: `aria-hidden="true"` (number in aria-label above)
 * - Focus ring: `focus-visible:ring-2 focus-visible:ring-[--brand-red]`
 *
 * Motion: no Framer motion (pure CSS transitions). Reduced-motion: instant via
 *         `transition-none` guard is not needed — only `transition-all duration-200`
 *         which respects `@media (prefers-reduced-motion: reduce)` at DS global layer.
 *
 * Tokens: --warm-500, --black-100, --black-900, --coral-50, --coral-100,
 *         --radius-sm, --text-compact, --text-nav-helper (13px step number).
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · ChapterMethodology.tsx:86-123
 * @ported 2026-05-19 · aura-builder · Batch 3.2a
 * @status ready
 */
'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StepperStep {
  /** Unique identifier — also used as the step number badge value. */
  id: number;
  /** Short label shown sm+ breakpoint. Hidden on mobile (step number only). */
  label: string;
}

export interface StepperHorizontalProps {
  /** Array of steps in display order. */
  steps: StepperStep[];
  /** ID of the currently active step. */
  activeId: number;
  /**
   * Called when user clicks a step button. Receives the step ID.
   * Consumer owns state — component is fully controlled.
   */
  onStepChange: (id: number) => void;
  /** Additional className on the scroll container. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * StepperHorizontal
 *
 * Horizontal step-picker bar. Controlled — consumer manages activeId + onStepChange.
 */
export function StepperHorizontal({
  steps,
  activeId,
  onStepChange,
  className,
}: StepperHorizontalProps) {
  return (
    <div
      data-component="StepperHorizontal"
      role="group"
      aria-label="Methodology steps"
      className={cn(
        // Horizontal scroll on mobile, centered on sm+
        'flex items-center gap-1 sm:gap-2',
        'overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center',
        className
      )}
      // Hidden scrollbar: canonical V0_lite pattern (rule 22a — inline style for scrollbarWidth)
      style={{ scrollbarWidth: 'none' }}
    >
      {steps.map((step, idx) => {
        const isActive = step.id === activeId;
        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            {/* Step button */}
            <button
              type="button"
              onClick={() => onStepChange(step.id)}
              aria-pressed={isActive}
              aria-label={`Step ${step.id}: ${step.label}`}
              className={cn(
                // Layout
                'inline-flex items-center justify-center gap-2',
                'h-12 rounded-[var(--radius-sm)] px-4 sm:px-6',
                // Typography
                'font-sans font-medium',
                // Transition — respects @media prefers-reduced-motion at DS global layer
                'transition-all duration-200',
                // Focus ring
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2',
                // State variants
                isActive
                  ? 'bg-[var(--black-900)] text-white hover:bg-[var(--black-900)]'
                  : [
                      'bg-white text-black',
                      'border border-[var(--warm-500)]',
                      'hover:border-black hover:bg-[var(--coral-50)]',
                      'active:bg-[var(--coral-100)]',
                    ]
              )}
              // Inline font-size per rule 22a — --text-nav-helper (13px) maps V0_lite 0.875rem for button label
              style={{ fontSize: 'var(--text-nav-helper)' }}
            >
              {/* Step number badge — aria-hidden, number already in aria-label above */}
              <span
                aria-hidden="true"
                className={cn(
                  'size-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--black-100)] text-[var(--black-500)]'
                )}
                // Inline: --text-nav-helper is 13px; step number badge uses same 13px (V0_lite 0.75rem ~ 12px)
                style={{ fontSize: 'var(--text-nav-helper)' }}
              >
                {step.id}
              </span>

              {/* Label — hidden on mobile, visible sm+ */}
              <span className="hidden sm:inline whitespace-nowrap">{step.label}</span>
            </button>

            {/* Separator chevron — not on last step */}
            {idx < steps.length - 1 && (
              <ChevronRight
                aria-hidden="true"
                className="h-5 w-5 mx-1 sm:mx-2 flex-shrink-0"
                style={{ color: 'var(--black-300)' }}
                strokeWidth={2}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
