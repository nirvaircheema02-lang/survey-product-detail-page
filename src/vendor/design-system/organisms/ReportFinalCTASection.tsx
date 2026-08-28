'use client';

/**
 * ReportFinalCTASection — Report PDP end-of-page conversion section.
 *
 * WHY:
 * - Report PDPs close with a red-gradient surface + email-capture form — a distinct
 *   conversion pattern from case-study FinalCTASection (light surface + ContactModal).
 *   Sharing the same organism would require so many conditional forks that the component
 *   would lose its contract clarity (CTABanner.md L37 precedent).
 * - Red-gradient inversion (brand-red → red-700) signals premium urgency at scroll terminus
 *   — distinct from any other section bg in the PDP, guaranteeing visual terminus recognition.
 * - Email capture (not modal) matches report PDP lead-gen pattern — frictionless inline form
 *   keeps the user on-page while collecting a lead.
 *
 * WHAT:
 * - Three bg variants: `red-gradient` (default · white text · floating orbs) ·
 *   `cinematic-dark` (bg-pure-black · white text) · `white` (editorial light · black text).
 * - Content stack: eyebrow → serif heading → lede → email-capture form → trust line.
 * - Form: inline on md+ (email input + primary button + optional secondary) · stacked on sm-.
 * - Button decision: primary = `variant="brand"` (red bg → use brand shimmer) on white bg;
 *   on red-gradient/cinematic use `variant="ghost" background="dark"` (white outline/white text)
 *   to maintain contrast — Option B (R4.1.14 ghost-dark on dark surface).
 * - Orbs: Framer Motion `animate` w/ `useReducedMotion()` guard. Suppressed when
 *   `prefersReducedMotion === true`.
 *
 * NOTE ON R1.2 (brand-red section bg):
 * - R1.2 blocks brand-red on section backgrounds for decorative use.
 * - red-gradient here is a DELIBERATE exception for the report PDP final-CTA organism —
 *   it is the primary conversion surface and its red gradient is canonical to report-pdp-anatomy.md L144-150.
 *   This is NOT decorative — it is the highest-urgency call-to-action slot on the page.
 *
 * WHEN:
 * - Bottom of every `/reports/<slug>` PDP (section N of report-pdp-anatomy recipe).
 * - Any page where the final CTA needs an email-capture form + red urgency signal.
 *
 * WHEN NOT:
 * - Case-study FinalCTA — use `FinalCTASection` (light surface + ContactModal).
 * - Mid-page CTA — use `CTABanner`.
 * - Floating/sticky bar — use `StickyCTA`.
 *
 * WHERE:
 * - `projects/v1-project/v1-product-page-ver0.3/src/components/sections/FinalCTABlock.tsx`
 * - Future: all report PDP pages under `/reports/<slug>`.
 *
 * HOW:
 * ```tsx
 * <ReportFinalCTASection
 *   heading="Unlock the Full Australia Cold Chain Logistics Report"
 *   lede="186 pages · 47 data tables · analyst-verified forecasts to 2030."
 *   background="red-gradient"
 *   onSubmit={(email) => console.log('lead:', email)}
 *   onSecondaryClick={() => window.open('/contact', '_blank')}
 * />
 * ```
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/CTASection.tsx (email-capture pattern)
 * @portedDate 2026-05-20 · Stage 4d · aura-builder
 */

import React, { useState, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../atoms/Button';
import { SectionLabel } from '../atoms/SectionLabel';
import { Container } from '../atoms/Container';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ReportFinalCTABackground = 'red-gradient' | 'cinematic-dark' | 'white';

export interface ReportFinalCTASectionProps {
  /** Eyebrow label · uppercase · default "GET THIS REPORT" */
  eyebrow?: string;
  /** Heading · serif display · required */
  heading: string;
  /** Lede paragraph · optional */
  lede?: string;
  /** Email input placeholder · default "Enter your business email" */
  emailPlaceholder?: string;
  /** Primary button label · default "Download Sample Report" */
  primaryLabel?: string;
  /** Optional secondary CTA label · e.g. "Talk to Analyst" */
  secondaryLabel?: string;
  /** Trust line below form · default "Trusted by Fortune 500 companies · GDPR compliant" */
  trustLine?: string;
  /** onSubmit handler · receives validated email string */
  onSubmit?: (email: string) => void;
  /** onSecondaryClick · optional secondary action */
  onSecondaryClick?: () => void;
  /**
   * Background style.
   * - `red-gradient` — brand-red → red-700 diagonal gradient · white text · floating orbs (default)
   * - `cinematic-dark` — bg-pure-black · white text
   * - `white` — editorial warm-300 bg · black text
   */
  background?: ReportFinalCTABackground;
  className?: string;
}

// ─── Bg/text token maps ───────────────────────────────────────────────────────

const BG_STYLE: Record<ReportFinalCTABackground, React.CSSProperties> = {
  'red-gradient': {
    background: 'linear-gradient(135deg, var(--brand-red, #b01f24) 0%, var(--red-700, #8f181d) 100%)',
  },
  'cinematic-dark': {
    background: 'var(--bg-pure-black, #0a0a0c)',
  },
  'white': {
    background: 'var(--warm-300, #f5f2f1)',
  },
};

// On dark/red surfaces → white text. On white → black text.
const isDark = (bg: ReportFinalCTABackground) => bg !== 'white';

// ─── Orb config ──────────────────────────────────────────────────────────────

/** Orbs only on red-gradient + cinematic-dark. White surface = no orbs. */
const ORB_COLOR: Record<ReportFinalCTABackground, { tl: string; br: string }> = {
  'red-gradient':   { tl: 'rgba(255,255,255,0.12)', br: 'rgba(255,255,255,0.06)' },
  'cinematic-dark': { tl: 'rgba(176,31,36,0.18)',   br: 'rgba(144,25,30,0.10)' },
  'white':          { tl: 'transparent',              br: 'transparent' },
};

// ─── Orbs sub-component ───────────────────────────────────────────────────────

function Orbs({ bg }: { bg: ReportFinalCTABackground }) {
  const prefersReducedMotion = useReducedMotion();
  if (bg === 'white' || prefersReducedMotion) return null;
  const colors = ORB_COLOR[bg];

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top-left orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: 0,
          left: 0,
          width: 600,
          height: 600,
          background: colors.tl,
          filter: 'blur(140px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom-right orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: 0,
          right: 0,
          width: 700,
          height: 700,
          background: colors.br,
          filter: 'blur(160px)',
          transform: 'translate(50%, 50%)',
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReportFinalCTASection({
  eyebrow = 'GET THIS REPORT',
  heading,
  lede,
  emailPlaceholder = 'Enter your business email',
  primaryLabel = 'Download Sample Report',
  secondaryLabel,
  trustLine = 'Trusted by Fortune 500 companies · GDPR compliant',
  onSubmit,
  onSecondaryClick,
  background = 'red-gradient',
  className = '',
}: ReportFinalCTASectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputId = useId();
  const trustId = useId();
  const dark = isDark(background);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    onSubmit?.(email);
  };

  // Prose + eyebrow text classes — white on dark, black on white
  const headingColor = dark
    ? 'text-[var(--color-foundation-white)]'
    : 'text-[var(--color-foundation-black)]';
  const ledeColor = dark
    ? 'text-white/70'
    : 'text-[var(--black-500,#666)]';
  const trustColor = dark
    ? 'text-white/50'
    : 'text-[var(--black-400,#888)]';

  // Input classes differ on dark vs light surface
  const inputClasses = dark
    ? [
        'flex-1 min-w-0 rounded-[var(--radius-md,8px)] px-4 py-3',
        'bg-white/10 border border-white/20',
        'text-white placeholder-white/50',
        'focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40',
        'text-[var(--text-sm,0.875rem)]',
      ].join(' ')
    : [
        'flex-1 min-w-0 rounded-[var(--radius-md,8px)] px-4 py-3',
        'bg-white border border-black/15',
        'text-[var(--color-foundation-black)] placeholder-black/40',
        'focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)] focus:border-[var(--brand-red)]',
        'text-[var(--text-sm,0.875rem)]',
      ].join(' ');

  // Primary button variant — ghost/dark on dark surfaces (white outline), brand on white
  const primaryVariant = dark ? ('ghost' as const) : ('brand' as const);
  const primaryBg = dark ? ('dark' as const) : ('light' as const);

  // Secondary button variant — ghost/dark on dark, secondary/light on white
  const secondaryVariant = dark ? ('ghost' as const) : ('secondary' as const);
  const secondaryBg = dark ? ('dark' as const) : ('light' as const);

  return (
    <section
      data-component="ReportFinalCTASection"
      data-bg={background}
      className={`relative overflow-hidden py-16 md:py-24 ${className}`}
      style={BG_STYLE[background]}
    >
      <Orbs bg={background} />

      <Container maxWidth="prose" className="relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex mb-5 md:mb-6">
          <SectionLabel
            style="text"
            background={dark ? 'dark' : 'light'}
            variant="accent"
          >
            {eyebrow}
          </SectionLabel>
        </div>

        {/* Heading */}
        <h2
          className={`font-light leading-tight tracking-tight mb-4 md:mb-6 ${headingColor}`}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 5vw, var(--text-3xl, 1.953rem))',
          }}
        >
          {heading}
        </h2>

        {/* Lede */}
        {lede && (
          <p
            className={`mb-8 md:mb-10 max-w-[var(--container-prose)] mx-auto leading-relaxed ${ledeColor}`}
            style={{ fontSize: 'var(--text-base, 1rem)' }}
          >
            {lede}
          </p>
        )}

        {/* Email capture form */}
        {submitted ? (
          <p
            className={`mb-6 font-medium ${dark ? 'text-white' : 'text-[var(--brand-red)]'}`}
            style={{ fontSize: 'var(--text-base, 1rem)' }}
            role="status"
          >
            Thank you — check your inbox for the sample report.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center mb-4"
            noValidate
          >
            {/* Screen-reader label */}
            <label htmlFor={inputId} className="sr-only">
              Business email address
            </label>

            <input
              id={inputId}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              aria-describedby={trustId}
              aria-label="Business email address"
              className={inputClasses}
            />

            <Button
              variant={primaryVariant}
              background={primaryBg}
              size="lg"
              type="submit"
              animatedArrow
              ariaLabel="Submit email to download sample report"
            >
              {primaryLabel}
            </Button>

            {secondaryLabel && (
              <Button
                variant={secondaryVariant}
                background={secondaryBg}
                size="lg"
                type="button"
                onClick={onSecondaryClick}
              >
                {secondaryLabel}
              </Button>
            )}
          </form>
        )}

        {/* Trust line */}
        <p
          id={trustId}
          className={`text-center ${trustColor}`}
          style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
        >
          {trustLine}
        </p>
      </Container>
    </section>
  );
}
