/**
 * ResearchMethodology
 *
 * WHAT:
 * Research methodology section for report PDP pages. Displays a horizontal stepper
 * (StepperHorizontal) above a 3-column grid of MethodologyCards. Clicking a stepper
 * step or a card sets `activeStep` — the active card receives dual-shadow elevation.
 * Preceded by a section header (SectionLabel + SectionHeading + lede paragraph).
 *
 * WHY:
 * Buyers are sceptical of market research quality. A visible methodology section
 * removes the "how do they know this?" objection before it becomes a bounce.
 * The stepper + card pattern (vs. bullet list prose) signals structured, multi-phase
 * process — trust signal via information architecture (Gestalt: grouping structured
 * data reads as rigour). Miller's Law: 3 steps fits 7±2 working memory ceiling.
 *
 * WHEN:
 * - Report PDP pages — Chapter N "Research Methodology" section.
 * - Any section that needs to show a multi-step research or data process visually.
 *
 * WHEN NOT:
 * - Generic FAQ / help sections (use FAQSection).
 * - More than 7 steps (stepper becomes unreadable on mobile).
 * - Pages where the methodology is purely decorative / not buyer-facing.
 *
 * WHERE:
 * - `projects/V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx` (canonical).
 * - Chapter 11 in the V1 product page PDP recipe.
 *
 * HOW:
 * ```tsx
 * import { ResearchMethodology } from '@kenresearch/design-system/organisms';
 * import { Search, CircleCheckBig, FileCheck } from 'lucide-react';
 *
 * <ResearchMethodology
 *   sectionLabel="CHAPTER 11 - OUR APPROACH"
 *   heading="Research Methodology"
 *   description="Our multi-layered approach combines rigorous desk research with
 *                primary data collection and expert validation."
 *   steps={[
 *     { id: 1, tabLabel: 'Approach',       icon: Search,           title: 'Desk Research',   subtitle: '...', bullets: [...] },
 *     { id: 2, tabLabel: 'Data Collection', icon: CircleCheckBig, title: 'Primary Research', subtitle: '...', bullets: [...] },
 *     { id: 3, tabLabel: 'Validation',      icon: FileCheck,       title: 'Validation',       subtitle: '...', bullets: [...] },
 *   ]}
 *   sectionId="methodology"
 * />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report-legacy/src/app/components/ChapterMethodology.tsx
 */
'use client';

import { useState } from 'react';
import type { ComponentType } from 'react';
import { SectionLabel } from '../atoms/SectionLabel';
import { SectionHeading } from '../atoms/SectionHeading';
import { StepperHorizontal } from '../molecules/StepperHorizontal';
import { MethodologyCard } from '../molecules/MethodologyCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single methodology step powering both a stepper tab and a card. */
export interface MethodologyStep {
  /** Unique numeric ID — used for active state + stepper. */
  id: number;
  /** Short tab label for the stepper (e.g. "Approach", "Data Collection"). */
  tabLabel: string;
  /**
   * Lucide icon component rendered in the card icon-box.
   */
  icon: ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
  /** Card heading — method step name. */
  title: string;
  /** Card subtitle — 1-line descriptor of the step. */
  subtitle: string;
  /** Bullet list items detailing what happens in this step (3–5 recommended). */
  bullets: string[];
}

export interface ResearchMethodologyProps {
  /**
   * Section anchor ID for scroll navigation and aria.
   * @default "methodology"
   */
  sectionId?: string;
  /**
   * Eyebrow label above section heading.
   * @default "OUR APPROACH"
   */
  sectionLabel?: string;
  /**
   * H2 heading text.
   * @default "Research Methodology"
   */
  heading?: string;
  /**
   * Subtext below heading. Keep to 1–2 sentences.
   * @default "Our multi-layered approach combines rigorous desk research with primary data collection and expert validation to ensure accuracy and reliability."
   */
  description?: string;
  /**
   * Array of methodology steps (2–7).
   * // TODO: replace w/ real API — derive from report chapter metadata
   */
  steps: MethodologyStep[];
  /**
   * Initially active step ID.
   * @default first step id
   */
  defaultActiveId?: number;
  /** Section background. Applied as Tailwind bg class on the `<section>`. */
  background?: 'white' | 'warm' | 'black-50';
  /** Optional className on the root `<section>`. */
  className?: string;
}

// Background token map
const bgMap = {
  white: 'var(--white)',
  warm: 'var(--warm-300)',
  'black-50': 'var(--black-50)',
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResearchMethodology({
  sectionId = 'methodology',
  sectionLabel = 'OUR APPROACH',
  heading = 'Research Methodology',
  description = 'Our multi-layered approach combines rigorous desk research with primary data collection and expert validation to ensure accuracy and reliability.',
  steps,
  defaultActiveId,
  background = 'warm',
  className,
}: ResearchMethodologyProps) {
  const initialId = defaultActiveId ?? (steps.length > 0 ? steps[0].id : 1);
  const [activeStep, setActiveStep] = useState(initialId);

  // StepperHorizontal expects { id, label } shape
  const stepperSteps = steps.map((s) => ({ id: s.id, label: s.tabLabel }));

  return (
    <section
      id={sectionId}
      data-component="ResearchMethodology"
      className={`scroll-mt-[72px]${className ? ` ${className}` : ''}`}
      style={{
        background: bgMap[background],
        paddingTop: 'var(--section-py-mobile)',
        paddingBottom: 'var(--section-py-mobile)',
      }}
    >
      {/* Container — standard content max-width */}
      <div
        style={{
          maxWidth: 'var(--container-content)',
          margin: '0 auto',
          paddingLeft: 'var(--padding-mobile)',
          paddingRight: 'var(--padding-mobile)',
        }}
        className="sm:px-6 md:px-8 lg:pt-20 lg:pb-20"
      >
        {/* ----------------------------------------------------------------
            Section header block
        ---------------------------------------------------------------- */}
        <div
          style={{
            maxWidth: 'var(--container-prose)',
            marginBottom: 'var(--section-header-mb)',
          }}
        >
          <div className="inline-flex mb-3">
            <SectionLabel style="text" background="light">
              {sectionLabel}
            </SectionLabel>
          </div>
          <SectionHeading level={2} align="left">
            {heading}
          </SectionHeading>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--black-500)',
              marginTop: 'var(--pair-heading-description)',
              lineHeight: 'var(--leading-relaxed)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {description}
          </p>
        </div>

        {/* ----------------------------------------------------------------
            Stepper tabs — centered on sm+, horizontal scroll on mobile
        ---------------------------------------------------------------- */}
        <StepperHorizontal
          steps={stepperSteps}
          activeId={activeStep}
          onStepChange={setActiveStep}
          className="mb-10"
        />

        {/* ----------------------------------------------------------------
            3-column methodology card grid
        ---------------------------------------------------------------- */}
        <div className="grid gap-4 lg:gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <MethodologyCard
              key={step.id}
              stepId={step.id}
              icon={step.icon}
              title={step.title}
              subtitle={step.subtitle}
              bullets={step.bullets}
              isActive={step.id === activeStep}
              onClick={() => setActiveStep(step.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
