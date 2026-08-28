'use client';

/**
 * ResearchThemesSection — "What This Survey Investigates"
 *
 * @what  Eight themes as numbered editorial rows: a serif index numeral as the
 *        visual anchor, a single hairline rule per row, and a quiet text
 *        action that opens the real sample-questions preview. 4-up grid on
 *        desktop (2-up tablet, 1-up mobile) so all 8 read as 2 rows instead of
 *        4 — the whole section fits one viewport without an internal scroll.
 * @why   The previous 2-up/4-row layout was ~1300px tall at desktop — taller
 *        than a typical laptop viewport below the nav, so themes 05-08 needed
 *        a scroll most users wouldn't know to make. Widening to 4 columns and
 *        trimming per-row padding/type-scale (verified: 30px/17px/14px →
 *        22-28px/15px/13px) closes that gap without cutting any content.
 * @how   Adapted from the DS's own numbered-row technique in
 *        organisms/ValuePillarsSection.tsx (12-col grid · border-t ·
 *        serif numeral at --text-3xl in a 2-col slot). The "View sample
 *        questions" trigger is the real DS `CTALink` atom (Button → CTALink →
 *        InlineLink is the DS's 3-tier link hierarchy; CTALink is the
 *        canonical "lightweight action" tier and owns its own typography,
 *        AnimatedArrow, hover and focus ring — no bordered button per item,
 *        which would re-introduce the box feel this section deliberately
 *        removed). `CTALink` was fixed in the DS to forward `ref` and spread
 *        rest props so it survives Radix's `asChild` cloning (DialogTrigger
 *        injects aria-haspopup/aria-expanded/aria-controls/data-state + a ref
 *        for focus-return; CTALink silently dropped all of those before) —
 *        the same additive fix `TextLink` already had.
 *        Two className overrides, both token-based and both deliberate:
 *        (a) font-size pinned to --typography-size-nav-helper (13px) via the
 *        `length:` type hint. CTALink's own `sizeClass` is inert under Tailwind
 *        v4 — `text-[var(--x)]` compiles to `color:`, not `font-size:`, so
 *        CTALink (and TextLink before it) silently inherited 16px, i.e. the
 *        action rendered LARGER than the 15px title. `text-[length:var(--x)]`
 *        forces the font-size branch. Not fixed inside the atoms because that
 *        would change the rendered size of every existing CTALink/TextLink
 *        consumer — a breaking change to a shared default, logged instead.
 *        (b) ring-offset set to this section's own warm bg, since the DS
 *        default assumes white and showed as a mismatched white halo here.
 *        Each <article> is a flex column with the action pinned via mt-auto so
 *        all eight actions share a baseline per row regardless of how many
 *        lines the bullets wrap to.
 */

import { SectionHeading, SectionLabel, Button, CTALink, SectionWrapper } from '@kenresearch/design-system/atoms';
import { RESEARCH_THEMES, SAMPLE_QUESTIONS } from '@/data/survey-bank-nbfc';
import { SampleQuestionsDialog } from './SampleQuestionsDialog';

export function ResearchThemesSection() {
  return (
    <SectionWrapper
      id="research-themes"
      aria-labelledby="research-themes-heading"
      background="warm"
      spacing="xl"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
      <div className="inline-flex mb-3">
        <SectionLabel background="light" variant="accent">
          Research Themes
        </SectionLabel>
      </div>

      <SectionHeading
        level={2}
        id="research-themes-heading"
        className="mb-4"
      >
        What This Survey Investigates
      </SectionHeading>

      <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mb-8">
        Eight interconnected research themes that map the complete SME borrowing journey from
        first lender discovery to long-term institutional loyalty.
      </p>

      {/* Numbered editorial rows — no per-item card, border, or shadow. Only a
          hairline rule above each row separates them. 4-up on desktop (was 2-up)
          so all 8 themes read as 2 rows instead of 4 — the whole section fits
          one viewport instead of needing an internal scroll to see themes
          05-08. Numeral shrunk to match the narrower column without crowding
          the title/bullets. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-0">
        {RESEARCH_THEMES.map((theme) => {
          const sample = SAMPLE_QUESTIONS[theme.index];
          return (
            <article
              key={theme.index}
              className="grid grid-cols-[auto_1fr] gap-x-3 border-t border-[var(--border-soft)] pt-5 pb-6"
            >
              {/* Numeral sits one rung below the bullets on the DS ink ramp
                  (--semantic-ink-subtle .45 vs --semantic-ink-body .70): clearly
                  present, still unambiguously secondary to the title. Was
                  ink-strong/20 ≈ .18 alpha, which read as near-invisible at this
                  light display weight. Size/font/position unchanged. */}
              <span
                aria-hidden="true"
                className="font-display font-light leading-none tabular-nums text-[var(--semantic-ink-subtle)] text-[clamp(22px,2vw,28px)]"
              >
                {theme.index}
              </span>

              {/* Flex column + mt-auto on the action = every action in a row
                  shares a baseline even when a neighbour's bullets wrap to two
                  lines. <article> and this div both stretch to the grid row
                  height by default (align-items: stretch), so no h-full needed. */}
              <div className="flex flex-col">
                <h3 className="font-body font-semibold text-[15px] leading-snug text-[var(--semantic-ink-strong)] mb-2">
                  {theme.title}
                </h3>

                <ul className="space-y-1 mb-3">
                  {theme.points.map((p) => (
                    <li
                      key={p}
                      className="font-body text-[13px] leading-snug text-[var(--semantic-ink-body)]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>

                {sample && (
                  <SampleQuestionsDialog themeTitle={theme.title} data={sample}>
                    {/* DS CTALink atom — owns its own type treatment, animated
                        arrow, hover and focus ring. mt-auto pins it to the
                        bottom of the flex column so the whole row aligns.
                        Hover-only underline added here (scoped to this
                        section's usage, not the shared atom's default): the DS
                        CTALink removed underline in a 2026-05-15 correction,
                        but the broader Ken Research pattern (report-store's
                        legacy CTALink) reveals a thin underline under the text
                        on hover only — border reserved transparent at rest so
                        there's no 1px layout shift when it appears. Targets
                        span:first-child specifically so the underline sits
                        under the text only, not the arrow. */}
                    <CTALink
                      size="sm"
                      variant="default"
                      className="mt-auto self-start text-[length:var(--typography-size-nav-helper)] focus-visible:ring-offset-[var(--color-ramp-warm-300)] [&>span:first-child]:border-b [&>span:first-child]:border-b-transparent [&>span:first-child]:pb-px hover:[&>span:first-child]:border-b-[var(--brand-red)]/30"
                    >
                      View sample questions
                    </CTALink>
                  </SampleQuestionsDialog>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="brand" size="md">
          Request a scope validation call
        </Button>
      </div>
    </SectionWrapper>
  );
}
