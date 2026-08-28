/**
 * MethodologyCard — Molecule
 *
 * WHAT: Single card in a 3-col ResearchMethodology grid. Icon-box + title + subtitle
 *       row, then a bullet list. Active state (controlled via isActive) applies
 *       dual-shadow elevation. Inactive state has minimal shadow + border.
 *       Card bg = --bg-card-methodology gradient. Clickable — whole card is interactive.
 *
 * WHY: Methodology steps need a card-per-step visual that communicates content depth
 *      (icon + title + bullets = structured data, not prose). Active elevation
 *      (dual-shadow) visually couples this card to the StepperHorizontal tab above —
 *      Miller's Law: group related controls so the connection is obvious.
 *      ChevronRight bullets = decorative content-structure markers (NOT disclosure),
 *      using --icon-content (#806ce0 = purple-600) per V0_lite design decision.
 *
 * WHEN: ResearchMethodology 3-col card grid. Each card corresponds to a stepper step.
 *       Always rendered as a set of 3 (or N) in a `grid md:grid-cols-3 gap-4 lg:gap-5`.
 *
 * WHEN NOT: Do NOT use as a standalone card — it requires context from stepper above.
 *           Do NOT use for non-methodology content (use DataHighlightCard for data cards).
 *           Do NOT remove isActive prop — elevation is load-bearing for stepper coupling.
 *
 * WHERE: ResearchMethodology organism · StepperPlusGridTemplate.
 *
 * HOW:
 * ```tsx
 * import { Search } from 'lucide-react';
 * <MethodologyCard
 *   stepId={1}
 *   icon={Search}
 *   title="Desk Research"
 *   subtitle="Comprehensive secondary research from authoritative sources."
 *   bullets={[
 *     'Market reports from healthcare & AI associations',
 *     'Government publications on FDA, EMA, NMPA policies',
 *   ]}
 *   isActive={activeStep === 1}
 *   onClick={() => setActiveStep(1)}
 * />
 * ```
 *
 * A11y:
 * - Root is a `<div>` with `role="button"` + `tabIndex={0}` + `aria-pressed={isActive}`
 *   + Enter/Space keyboard handler (clickable card pattern).
 * - Icon-box: `aria-hidden="true"` (decorative).
 * - Bullet ChevronRight icons: `aria-hidden="true"` (decorative pointers).
 * - 44px+ touch target ensured by card height (py-4 sm:py-5 fills beyond 44px).
 *
 * Motion: `transition-all duration-300` CSS — DS global @media prefers-reduced-motion
 *         disables automatically. No Framer (shadow-only transition, not layout).
 *
 * Tokens: --bg-card-methodology, --shadow-card-active, --radius-sm, --black-200,
 *         --black-500, --black-900, --purple-600 (icon-content alias), --text-sm,
 *         --text-nav-helper (13px subtitle + bullets).
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · ChapterMethodology.tsx:127-191
 * @ported 2026-05-19 · aura-builder · Batch 3.2a
 * @status ready
 */
'use client';

import type { ComponentType, KeyboardEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MethodologyCardProps {
  /**
   * Step identifier — used for data-step attribute (accessible + test-targeting).
   */
  stepId: number;
  /**
   * Lucide icon component (or any SVG icon component) for the icon-box.
   * Rendered at h-4 w-4 with `color={iconContentColor}`.
   */
  icon: ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
  /** Card title — main step name (e.g. "Desk Research"). */
  title: string;
  /** Card subtitle — 1-line descriptor below title. */
  subtitle: string;
  /** Bullet list items. 3-5 items recommended. */
  bullets: string[];
  /**
   * Active state. When true, applies --shadow-card-active dual elevation.
   * Should match the current StepperHorizontal activeId.
   */
  isActive?: boolean;
  /**
   * Click handler — consumer updates active state.
   * Called when user clicks the card OR presses Enter/Space.
   */
  onClick?: () => void;
  /** Additional className on root card element. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

// --icon-content alias (#806ce0 = purple-600) — per V0_lite design decision (decorative content bullets)
const ICON_CONTENT_COLOR = 'var(--icon-content, #806ce0)';
// Icon-box bg: rgba(purple-600, 0.1) — per V0_lite literal, expressed as rgba token-reference
const ICON_BOX_BG = 'rgba(128, 108, 224, 0.1)'; // = purple-600 @ 10% alpha · no token yet

/**
 * MethodologyCard
 *
 * Single research methodology step card. Controlled active state drives
 * dual-shadow elevation (--shadow-card-active). Composes no DS atoms —
 * card content is tightly coupled to methodology pattern.
 */
export function MethodologyCard({
  stepId,
  icon: Icon,
  title,
  subtitle,
  bullets,
  isActive = false,
  onClick,
  className,
}: MethodologyCardProps) {
  // Keyboard handler — Enter/Space trigger onClick (role=button pattern)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      data-component="MethodologyCard"
      data-step={stepId}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        // Shape
        'group rounded-[var(--radius-sm)] h-full cursor-pointer',
        // Border
        'border border-[var(--black-200)]',
        // Transition — CSS only, DS global reduces-motion handles @media
        'transition-all duration-300',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2',
        className
      )}
      style={{
        // Gradient bg: --bg-card-methodology token (added Batch 3.0)
        background: 'var(--bg-card-methodology, linear-gradient(135deg, rgba(243,244,255,0.5) 0%, rgba(250,250,250,0.3) 100%))',
        // Shadow: active = dual elevation (--shadow-card-active) · inactive = minimal
        boxShadow: isActive
          ? 'var(--shadow-card-active, 0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04))'
          : '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div className="px-3 py-4 sm:px-4 sm:py-5">
        {/* Icon + Title row */}
        <div className="flex items-center gap-3 mb-4">
          {/* Icon box — decorative, aria-hidden */}
          <div
            aria-hidden="true"
            className="size-10 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: ICON_BOX_BG }}
          >
            <Icon
              className="h-4 w-4"
              strokeWidth={2}
              color={ICON_CONTENT_COLOR}
            />
          </div>

          {/* Title + subtitle */}
          <div className="min-w-0">
            <h3
              className="font-sans font-medium leading-[1.25]"
              style={{ fontSize: 'var(--text-sm)', color: 'black' }}
            >
              {title}
            </h3>
            <p
              className="mt-0.5"
              style={{
                // Rule 22a: V0_lite uses 0.813rem (13px) · map to --text-nav-helper
                fontSize: 'var(--text-nav-helper)',
                color: 'var(--black-500)',
                // leading-snug in core-v2 = 1.3 · V0_lite used leading-snug at 1.3 here too
                lineHeight: 'var(--leading-snug, 1.3)',
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Bullet list — ChevronRight as decorative content-structure marker */}
        <ul className="space-y-2">
          {bullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 transition-colors duration-200 group-hover:text-black"
              style={{
                fontSize: 'var(--text-nav-helper)',
                color: 'var(--black-500)',
              }}
            >
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 mt-[3px] flex-shrink-0"
                strokeWidth={2}
                color={ICON_CONTENT_COLOR}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
