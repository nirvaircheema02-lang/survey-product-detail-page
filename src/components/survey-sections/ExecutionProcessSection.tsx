'use client';

/**
 * ExecutionProcessSection — "How we execute"
 *
 * @what  9-step serpentine (snake) process timeline. Desktop: step 01 alone on
 *        row 1, steps 02-04 flow left→right, 05-07 flow right→left (visually
 *        07|06|05), 08-09 + brand CTA on row 4 — one continuous ~2px near-black
 *        connector line with rounded U-turns snaking through all rows (CSS
 *        border segments on absolutely-positioned divs, aria-hidden). Steps are
 *        a single semantic <ol>; visual reordering is grid placement only, so
 *        DOM/SR order stays 01→09. No description text, no scroll-linked state
 *        — a static "Step NN" pill + icon chip + title per step, exactly as
 *        approved (Figma "Survey product page", node 3668-1845). Mobile/tablet:
 *        vertical timeline with icon chips on a left hairline rail.
 * @why   A prior pass rebuilt this section to match the LIVE production page's
 *        elaborate scroll-spotlight/travelling-beam interaction instead of the
 *        actual approved Figma design, which is this plain static serpentine —
 *        reverted per the Figma export (pixel-sampled: connector ≈
 *        rgba(0,0,0,0.85), pill/icon chrome white-on-warm, no description
 *        shown at all). "Exact design, static is fine" per explicit instruction
 *        2026-08-28, overriding the earlier live-match pass.
 * @how   Two layered behaviours, both `useReducedMotion()`-guarded:
 *        1. Each step scroll-reveals (fade + rise, `whileInView`, fires once) —
 *           a generic one-time content-reveal already used everywhere else on
 *           this page, not part of what Figma shows/doesn't show either way.
 *        2. Small hover/focus polish already established elsewhere on this
 *           page (pill border tint, icon lift) — not a departure from "static":
 *           the section's baseline appearance never changes with scroll
 *           position, which is what "static" actually distinguishes here.
 *        Motion lives on an inner wrapper, never the `<li>` itself, so the
 *        serpentine's `DESKTOP_POS` grid-placement classes are undisturbed.
 *        The connector is pure CSS border segments — no SVG measurement layer,
 *        since there's no scroll-scrubbed fill to draw on top of it anymore.
 */

import {
  Crosshair,
  PenTool,
  ClipboardCheck,
  SlidersHorizontal,
  Rocket,
  ShieldCheck,
  Database,
  BarChart3,
  Send,
} from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { SectionHeading, SectionLabel, Button, SectionWrapper } from '@kenresearch/design-system/atoms';
import { EXECUTION_STEPS, type ExecutionStep } from '@/data/survey-bank-nbfc';

const ICON_MAP: Record<ExecutionStep['icon'], typeof Crosshair> = {
  crosshair: Crosshair,
  pen: PenTool,
  clipboard: ClipboardCheck,
  sliders: SlidersHorizontal,
  rocket: Rocket,
  shield: ShieldCheck,
  database: Database,
  chart: BarChart3,
  send: Send,
};

/**
 * Desktop serpentine placement (3-col grid):
 * row 1 → 01 · row 2 → 02 03 04 (L→R) · row 3 → 07 06 05 (05 placed col 3, so the
 * flow reads R→L) · row 4 → 08 09 + CTA in col 3.
 */
const DESKTOP_POS: Record<ExecutionStep['number'], string> = {
  '01': 'col-start-1 row-start-1',
  '02': 'col-start-1 row-start-2',
  '03': 'col-start-2 row-start-2',
  '04': 'col-start-3 row-start-2',
  '05': 'col-start-3 row-start-3',
  '06': 'col-start-2 row-start-3',
  '07': 'col-start-1 row-start-3',
  '08': 'col-start-1 row-start-4',
  '09': 'col-start-2 row-start-4',
};

/** Connector stroke — pixel-sampled from the Figma export (~rgb(35,35,34) over
 *  the warm-300 page bg ≈ 85% black), not a semantic ink token: this is a
 *  decorative diagram line, not text/border chrome. */
const LINE = 'border-[rgba(0,0,0,0.85)]';

/** Fades + rises each step into place as it scrolls into view (fires once).
 *  Reduced-motion collapses to a plain opacity fade, no rise — same contract
 *  as every other motion usage on this page. Wraps step CONTENT only, never
 *  the `<li>`, so the serpentine's grid-placement classes stay undisturbed. */
function StepReveal({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reducedMotion ? 0.15 : 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function StepPill({ number }: { number: ExecutionStep['number'] }) {
  return (
    <span className="relative z-[1] inline-flex h-7 items-center rounded-full border border-[var(--border-soft)] bg-white px-3 font-body text-[12px] font-medium text-[var(--semantic-ink-strong)] shadow-sm transition-colors duration-200 group-hover:border-[var(--color-brand-red)]/40">
      Step {number}
    </span>
  );
}

/** Icon chip + title only — no description, matching the Figma export exactly
 *  (the live site's hover-reveal description was part of the reverted pass). */
function StepBody({ step }: { step: ExecutionStep }) {
  const Icon = ICON_MAP[step.icon];
  return (
    <div className="mt-4 flex items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-soft)] bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--color-brand-red)]/40 group-hover:shadow-md motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        aria-hidden="true"
      >
        <Icon size={18} strokeWidth={1.6} className="text-[var(--semantic-ink-body)] transition-colors duration-200 group-hover:text-[var(--color-brand-red)]" />
      </span>
      <p className="min-w-0 flex-1 max-w-[30ch] font-body text-[15px] font-medium leading-snug text-[var(--semantic-ink-strong)]">
        {step.title}
      </p>
    </div>
  );
}

/**
 * Mobile rail fill — one per gap between chips. Each takes an equal slice of the
 * list's scroll progress, so the red thread advances chip-by-chip down the
 * timeline exactly over the existing hairline track.
 */
function RailFill({
  progress,
  index,
  total,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const reducedMotion = useReducedMotion();
  const scaleY = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-8 left-5 top-10 w-px origin-top bg-[var(--color-brand-red)]"
      style={{ scaleY: reducedMotion ? 1 : scaleY }}
    />
  );
}

export function ExecutionProcessSection() {
  /* ── Mobile rail: vertical timeline's own scroll-scrubbed fill ────────────── */
  const mobileListRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress: mobileScroll } = useScroll({
    target: mobileListRef,
    offset: ['start 0.85', 'end 0.6'],
  });
  const mobileFill = useTransform(mobileScroll, [0, 0.9], [0, 1]);
  const railSegments = EXECUTION_STEPS.length - 1;

  return (
    <SectionWrapper
      id="execution-process"
      aria-labelledby="execution-process-heading"
      background="warm"
      spacing="lg"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
        <div className="mb-3 inline-flex">
          <SectionLabel background="light" variant="accent">
            Execution Process
          </SectionLabel>
        </div>

        <SectionHeading
        level={2}
        id="execution-process-heading"
        className="mb-4"
      >
        How we execute
      </SectionHeading>

        <p className="mb-12 max-w-[70ch] font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)]">
          A proven 9-step process from scoping to delivery, designed to ensure quality, speed, and
          actionable insights.
        </p>

        {/* ── Desktop: serpentine flow ─────────────────────────────────────── */}
        <div className="relative hidden grid-cols-3 gap-x-8 gap-y-14 px-10 lg:grid">
          {/* Connector layer — decorative, painted beneath the steps */}
          {/* 01 → row 2: drop from icon chip (chip center x=19px), through the gap */}
          <div aria-hidden="true" className="pointer-events-none relative col-start-1 row-start-1">
            <div className={`absolute -bottom-4 left-[19px] top-[84px] w-0 border-l-2 ${LINE}`} />
          </div>
          <div aria-hidden="true" className="pointer-events-none relative col-start-1 row-start-2">
            <div
              className={`absolute -top-10 left-[19px] h-[55px] w-10 rounded-bl-[28px] border-b-2 border-l-2 ${LINE}`}
            />
          </div>
          {/* Row 2 horizontal line (ends where the right U-turn begins) */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative col-span-3 col-start-1 row-start-2"
          >
            <div className={`absolute left-[57px] right-0 top-[13px] border-t-2 ${LINE}`} />
          </div>
          {/* Right U-turn: row 2 → row 3 (verticals run in the px-10 padding zone) */}
          <div aria-hidden="true" className="pointer-events-none relative col-start-3 row-start-2">
            <div
              className={`absolute -bottom-4 -right-10 top-[13px] w-10 rounded-tr-[28px] border-r-2 border-t-2 ${LINE}`}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none relative col-start-3 row-start-3">
            <div
              className={`absolute -right-10 -top-10 h-[55px] w-10 rounded-br-[28px] border-b-2 border-r-2 ${LINE}`}
            />
          </div>
          {/* Row 3 horizontal line (full content width, corners meet it on both ends) */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative col-span-3 col-start-1 row-start-3"
          >
            <div className={`absolute inset-x-0 top-[13px] border-t-2 ${LINE}`} />
          </div>
          {/* Left U-turn: row 3 → row 4 */}
          <div aria-hidden="true" className="pointer-events-none relative col-start-1 row-start-3">
            <div
              className={`absolute -bottom-4 -left-10 top-[13px] w-10 rounded-tl-[28px] border-l-2 border-t-2 ${LINE}`}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none relative col-start-1 row-start-4">
            <div
              className={`absolute -left-10 -top-10 h-[55px] w-10 rounded-bl-[28px] border-b-2 border-l-2 ${LINE}`}
            />
          </div>
          {/* Row 4 horizontal line — runs under 08 + 09, terminates beneath the CTA */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative col-span-3 col-start-1 row-start-4"
          >
            <div
              className={`absolute left-0 top-[13px] w-[calc(66.666%+24px)] border-t-2 ${LINE}`}
            />
          </div>

          {/* Steps — one semantic ordered list; grid placement only reorders visually */}
          <ol role="list" className="contents">
            {EXECUTION_STEPS.map((step) => (
              <li
                key={step.number}
                tabIndex={0}
                className={`group relative rounded-[4px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-red)] ${DESKTOP_POS[step.number] ?? ''}`}
              >
                <StepReveal>
                  <div className="flex">
                    <StepPill number={step.number} />
                  </div>
                  <StepBody step={step} />
                </StepReveal>
              </li>
            ))}
          </ol>

          {/* CTA occupies the serpentine's final position (row 4 · col 3), centered on the line */}
          <div className="relative col-start-3 row-start-4 -mt-1.5 justify-self-start self-start">
            <Button variant="brand" size="md" animatedArrow>
              Request a commercial proposal
            </Button>
          </div>
        </div>

        {/* ── Mobile / tablet: vertical timeline ───────────────────────────── */}
        <div className="lg:hidden">
          <ol ref={mobileListRef} role="list" className="space-y-8">
            {EXECUTION_STEPS.map((step, i) => {
              const Icon = ICON_MAP[step.icon];
              return (
                <li key={step.number} className="group relative">
                  <StepReveal>
                    <div className="flex items-start gap-4">
                      {/* Rail segment: chip bottom → next chip top (skipped after last step) */}
                      {i < railSegments && (
                        <>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-8 left-5 top-10 w-px bg-[var(--border-soft)]"
                          />
                          <RailFill progress={mobileFill} index={i} total={railSegments} />
                        </>
                      )}
                      <span
                        className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-soft)] bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--color-brand-red)]/40 group-hover:shadow-md motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                        aria-hidden="true"
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.6}
                          className="text-[var(--semantic-ink-body)] transition-colors duration-200 group-hover:text-[var(--color-brand-red)]"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <StepPill number={step.number} />
                        <h3 className="mt-2.5 font-body text-[15px] font-medium leading-snug text-[var(--semantic-ink-strong)]">
                          {step.title}
                        </h3>
                        {/* Always visible on touch — there is no hover state to reveal it. */}
                        <p className="mt-1 font-body text-[13px] leading-snug text-[var(--semantic-ink-muted)]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </StepReveal>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 pl-14">
            <Button variant="brand" size="lg" animatedArrow fullWidth>
              Request a commercial proposal
            </Button>
          </div>
        </div>
    </SectionWrapper>
  );
}
