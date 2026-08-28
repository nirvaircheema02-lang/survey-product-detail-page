/**
 * StepperPlusGridTemplate
 *
 * WHAT · Composition shell for the Research Methodology section.
 *        StepperHorizontal (top, centered) + 3-col MethodologyCard grid with active
 *        state synced to stepper. LabelHeadingPair header above the stepper.
 *
 * WHY · The methodology section needs a step-picker + card grid coupling.
 *       Centralising the active-state sync logic (useState hook) prevents each
 *       consumer duplicating the pattern (CANON §2.7). Template is the single
 *       source of the activeStep ↔ stepper ↔ card grid coupling.
 *
 * WHEN · Report PDP Research Methodology section (section 24).
 *        Any multi-step visual methodology or process breakdown with cards.
 *
 * WHEN NOT · Do NOT use for linear wizards or sequential checkout flows.
 *            Do NOT use when more than 7 steps (stepper unreadable on mobile).
 *
 * WHERE · `core-v2/src/templates/StepperPlusGridTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <StepperPlusGridTemplate
 *   id="methodology"
 *   background="white"
 *   label="CHAPTER 24 · RESEARCH METHODOLOGY"
 *   heading="How We Gather and Validate Data"
 *   steps={methodologySteps}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom SectionWrapper · LabelHeadingPair · StepperHorizontal · MethodologyCard
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.7
 */
'use client';

import { useState, type CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { StepperHorizontal } from '../molecules/StepperHorizontal';
import { MethodologyCard } from '../molecules/MethodologyCard';

export type StepperBg = 'white' | 'warm';

export interface MethodologyStep {
  /** Unique numeric id (1-based) — matches StepperHorizontal.step.id */
  id: number;
  /** Stepper label text shown in step pill */
  label: string;
  /** Icon component for MethodologyCard icon-box */
  icon: LucideIcon;
  /** Card title */
  title: string;
  /** Card subtitle / short description */
  subtitle: string;
  /** Bullet points for card body */
  bullets: string[];
}

export interface StepperPlusGridTemplateProps {
  /** HTML id for anchor scroll */
  id: string;

  /** Background variant. Defaults to 'white'. */
  background?: StepperBg;

  /** Eyebrow label */
  label: string;

  /** Section h2 heading */
  heading: string;

  /** Optional lede paragraph */
  lede?: string;

  /** Array of methodology steps — drives both stepper and card grid */
  steps: MethodologyStep[];

  /** Extra className for SectionWrapper */
  className?: string;
}

/**
 * StepperPlusGridTemplate — methodology step-picker + 3-col card grid shell.
 *
 * Manages activeStep state locally. Syncs stepper + card grid active state.
 * Composition: SectionWrapper → LabelHeadingPair → StepperHorizontal (mb-10/12) →
 *   3-col MethodologyCard grid (active elevation on matching card).
 */
export function StepperPlusGridTemplate({
  id,
  background = 'white',
  label,
  heading,
  lede,
  steps,
  className,
}: StepperPlusGridTemplateProps) {
  const [activeId, setActiveId] = useState<number>(steps[0]?.id ?? 1);

  return (
    <SectionWrapper
      id={id}
      background={background}
      spacing="lg"
      maxWidth="wide"
      className={className}
      style={{ scrollMarginTop: 'var(--scroll-margin-section, 72px)' } as CSSProperties}
      data-template="StepperPlusGridTemplate"
    >
      {/* SECTION HEADER BLOCK */}
      <div className="mb-10 md:mb-12">
        <LabelHeadingPair
          label={label}
          heading={heading}
          headingId={`${id}-heading`}
          headingLevel={2}
          labelVariant="accent"
          lede={lede}
        />
      </div>

      {/* STEPPER — centered on sm+, horizontally scrollable on mobile */}
      <StepperHorizontal
        steps={steps}
        activeId={activeId}
        onStepChange={setActiveId}
        className="mb-10 md:mb-12 sm:justify-center overflow-x-auto"
      />

      {/* 3-COL CARD GRID — gap-4 mobile · gap-5 desktop (CANON §2.7) */}
      <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
        {steps.map((step) => (
          <MethodologyCard
            key={step.id}
            stepId={step.id}
            icon={step.icon}
            title={step.title}
            subtitle={step.subtitle}
            bullets={step.bullets}
            isActive={step.id === activeId}
            onClick={() => setActiveId(step.id)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
