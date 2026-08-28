/**
 * TargetAudience
 *
 * WHAT · Multi-card audience organism. Left: 2-col grid of StakeholderCard (6–8 cards).
 *        Right: aside callout card (p-8 padding) with benefit checklist + stat + secondary CTA.
 *        Dot-pattern bg texture. Layout: lg:grid-cols-3 (2-col left + 1-col right).
 *
 * WHY · Report PDPs need a "Who Is This For" section that maps stakeholder types to the
 *       value they receive. The aside callout card aggregates the cross-cutting benefit
 *       (pages of insights + Talk to Expert CTA) — this drives lead capture from a
 *       heterogeneous audience (Investors, Regulators, Distributors, etc.).
 *       Law of Similarity — grid cards share visual chrome; aside callout breaks the grid
 *       to draw eye to the primary CTA.
 *
 * WHEN · Report PDP "Target Audience / Key Stakeholders" chapter.
 *        Any section listing 6–8 audience types with a summary callout panel.
 *
 * WHEN NOT · Fewer than 4 audience types → use a simple list or AnalysisCard grid.
 *            No aside callout needed → use a 2-col StakeholderCard grid directly.
 *
 * WHERE · core-v2/src/organisms/TargetAudience.tsx
 *         Consumer: V0.2 report PDP
 *
 * HOW · `stakeholders` typed as `StakeholderEntry[]` (icon + title + description).
 *       `callout` typed for the right panel (heading + benefits + stat + CTA).
 *       LabelHeadingPair for section header. StakeholderCard molecule for each audience card.
 *       Aside card uses Card-like div with p-8 padding and CardContent-equivalent padding.
 *       Dot-pattern via --pattern-* tokens (absolute overlay, pointer-events-none).
 *       useReducedMotion available for future entrance animation.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/TargetAudience.tsx:62
 * @ported 2026-05-19 · aura-builder · Batch 3.3c (DATA organisms)
 * @token_refactor
 *   V0.2 `py-24 lg:py-32` → py-12 md:py-20 (--section-py-lg)
 *   V0.2 `max-w-7xl px-[84.375px]` → Container variant="page"
 *   V0.2 `mb-16` header → --section-header-mb (2.5rem)
 *   V0.2 `text-sm` eyebrow → LabelHeadingPair label prop
 *   V0.2 `text-4xl tracking-tight` → var(--text-2xl) (39px) + --tracking-display-tight
 *   V0.2 `text-base leading-relaxed` → var(--text-sm) + var(--leading-relaxed)
 *   V0.2 `rounded-[10px]` aside → var(--radius-sm)
 *   V0.2 `text-xl font-bold text-foreground` → var(--text-base, 1.25rem) + bold + var(--black-900)
 *   V0.2 `text-[var(--purple-500)]` icon color → kept (token exists)
 *   V0.2 `p-8` aside CardContent → padding: var(--space-8, 2rem)
 */

'use client';

import { type ReactNode } from 'react';
import { CircleCheckBig, Sparkles } from 'lucide-react';
import { Container } from '../atoms/Container';
import { LabelHeadingPair } from '../molecules/LabelHeadingPair';
import { StakeholderCard } from '../molecules/StakeholderCard';
import { Button } from '../atoms/Button';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Data for a single stakeholder card */
export interface StakeholderEntry {
  /** Icon element (Phosphor/Lucide/any ReactNode) */
  icon: ReactNode;
  /** Stakeholder type heading */
  title: string;
  /** Short description of what they gain */
  description: string;
}

/** Callout stat inside the aside panel */
export interface CalloutStat {
  /** Formatted value (e.g., "82+") */
  value: string;
  /** Label below the value */
  label: string;
}

/** Right-side callout panel data */
export interface AudienceCallout {
  /** Callout heading (h3) */
  heading: string;
  /** Benefit list items */
  benefits: string[];
  /** Bottom stat — e.g., "82+" pages */
  stat?: CalloutStat;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
}

export interface TargetAudienceProps {
  /** Section id for scroll-spy. @default "target-audience" */
  id?: string;
  /** Eyebrow label, e.g. "CHAPTER 10 - Key Stakeholders" */
  label: string;
  /** Section heading — ReactNode for inline spans */
  heading: ReactNode;
  /** Optional lede paragraph */
  lede?: string;
  /** Stakeholder audience cards (6–8 recommended) */
  stakeholders: StakeholderEntry[];
  /** Right-side callout panel (optional — omit to use full-width grid) */
  callout?: AudienceCallout;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * TargetAudience — audience grid with aside callout organism.
 * Composes LabelHeadingPair + StakeholderCard grid (left 2-col) + callout Card (right).
 */
export function TargetAudience({
  id = 'target-audience',
  label,
  heading,
  lede,
  stakeholders,
  callout,
}: TargetAudienceProps) {
  return (
    <section
      id={id}
      aria-label={typeof heading === 'string' ? heading : label}
      className="py-12 md:py-20 relative overflow-hidden"
      style={{ backgroundColor: 'var(--black-50)' }}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          opacity: 'var(--pattern-opacity)',
          backgroundImage: `radial-gradient(circle, var(--black-900) var(--pattern-dot-size), transparent 0)`,
          backgroundSize: `var(--pattern-grid-size) var(--pattern-grid-size)`,
        }}
      />

      <Container maxWidth="page" className="relative">
        {/* ── Section header ── */}
        <div style={{ marginBottom: 'var(--section-header-mb, 2.5rem)' }}>
          <LabelHeadingPair
            label={label}
            heading={heading}
            lede={lede}
            ledeMaxWidth="max-w-3xl"
          />
        </div>

        {/* ── Grid: left stakeholders + right callout ── */}
        {callout ? (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Stakeholder cards — 2/3 width on lg */}
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                {stakeholders.map((stakeholder, i) => (
                  <StakeholderCard
                    key={i}
                    icon={stakeholder.icon}
                    title={stakeholder.title}
                    description={stakeholder.description}
                  />
                ))}
              </div>
            </div>

            {/* Callout panel — 1/3 width on lg */}
            <aside>
              <div
                className="h-full border transition-colors duration-300 hover:border-[var(--black-400)]"
                style={{
                  backgroundColor: 'var(--white)',
                  borderColor: 'var(--black-200)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-8, 2rem)',
                }}
                aria-label="What you'll gain from this report"
              >
                {/* Callout heading with icon */}
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: 'var(--space-6, 1.5rem)' }}
                >
                  <Sparkles
                    className="size-5 shrink-0"
                    style={{ color: 'var(--purple-500)' }}
                    aria-hidden="true"
                  />
                  <h3
                    className="font-bold"
                    style={{
                      fontSize: 'var(--text-base, 1.25rem)',
                      color: 'var(--black-900)',
                    }}
                  >
                    {callout.heading}
                  </h3>
                </div>

                {/* Benefits checklist */}
                <ul className="space-y-4 list-none p-0" aria-label="Report benefits">
                  {callout.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CircleCheckBig
                        className="size-5 shrink-0 mt-0.5"
                        style={{ color: 'var(--purple-500)' }}
                        aria-hidden="true"
                      />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--black-900)' }}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Stat + CTA footer */}
                {(callout.stat || callout.ctaLabel) && (
                  <div
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: 'var(--space-6, 1.5rem)',
                      marginTop: 'var(--space-8, 2rem)',
                      borderTop: '1px solid var(--black-100)',
                    }}
                  >
                    {callout.stat && (
                      <div>
                        <p
                          className="font-bold"
                          style={{ fontSize: 'var(--text-base, 1.25rem)', color: 'var(--black-900)' }}
                        >
                          {callout.stat.value}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--black-500)' }}>
                          {callout.stat.label}
                        </p>
                      </div>
                    )}
                    {callout.ctaLabel && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={callout.onCtaClick}
                      >
                        {callout.ctaLabel}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        ) : (
          /* Full-width stakeholder grid (no callout) */
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakeholders.map((stakeholder, i) => (
              <StakeholderCard
                key={i}
                icon={stakeholder.icon}
                title={stakeholder.title}
                description={stakeholder.description}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
