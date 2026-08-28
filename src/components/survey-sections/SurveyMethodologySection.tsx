'use client';

/**
 * SurveyMethodologySection — "Survey approach"
 *
 * @what  Approved/locked treatment (do not redesign) — all 5 modes (Online /
 *        CATI / F2F / FGDs / Mixed) as identical bordered cards (317px, 10px
 *        radius) inside one horizontally-scrolling carousel, matching both
 *        Figma's card treatment and the live production page's actual
 *        interaction (verified against live DOM 2026-08-26: a real Swiper
 *        carousel — 5 bordered cards, right-edge white fade mask, hover-reveal
 *        chevron nav button, no static grid).
 * @why   A later refactor pass replaced this with a de-boxed subgrid
 *        comparison to match the page's other de-boxed sections. That reads
 *        cleaner in isolation but drops both the approved Figma card chrome
 *        and the live page's carousel interaction — reverted back to this
 *        card+carousel version per explicit instruction. Uses the DS
 *        `HorizontalScroll` molecule rather than hand-rolled scroll/drag/fade
 *        logic — it's the same component already used for this exact pattern
 *        elsewhere (FeaturedCarousel, ExploreByRegion, RelatedReports), and its
 *        rendered nav-button/fade classes match the live page's byte-for-byte.
 * @how   All 5 mode/recommendation content comes from the survey-bank-nbfc
 *        data module. Per-card visual treatment does not vary by status tier
 *        on live (Primary/Optional/Selective only differ in the chip's text,
 *        not color or card styling).
 */

import { FileText, CircleCheckBig } from 'lucide-react';
import { SectionHeading, SectionLabel, Button, SectionWrapper } from '@kenresearch/design-system/atoms';
import { HorizontalScroll } from '@kenresearch/design-system/molecules';
import { METHODOLOGY_MODES, METHODOLOGY_RECOMMENDATION } from '@/data/survey-bank-nbfc';

export function SurveyMethodologySection() {
  return (
    <SectionWrapper
      id="methodology"
      aria-labelledby="methodology-heading"
      background="white"
      spacing="xl"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
      <div className="inline-flex mb-3">
        <SectionLabel background="light" variant="accent">
          Methodology
        </SectionLabel>
      </div>

      <SectionHeading level={2} id="methodology-heading" className="mb-4">
        Survey approach
      </SectionHeading>

      <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mb-12">
        For the Bank vs NBFC Preference Survey (SMEs), we recommend a quant-first design with
        flexible data-collection modes to balance reach, depth, and verification.
      </p>

      {/* ── 5-mode carousel — real bordered cards, matches live's swiper track ── */}
      <div className="pt-1 pb-8">
        <HorizontalScroll fadeBg="white" gap="gap-6">
          {METHODOLOGY_MODES.map((mode) => (
            <div
              key={mode.id}
              className="flex flex-col p-4 w-[317px] flex-shrink-0 min-h-[452px] border border-[#0000000F] rounded-[10px] hover:cursor-pointer hover:shadow-lg transition-shadow duration-500 ease-in-out"
            >
              <div className="flex justify-between pb-2">
                <span className="text-[#A23F2D] text-[9px] tracking-[1.2px] font-body font-semibold uppercase bg-[#EA7A5F14] p-1 rounded-[5px] h-fit">
                  {mode.status}
                </span>
                <span className="bg-[#806CE00F] p-2 rounded-[5px] h-fit">
                  <FileText size={24} strokeWidth={2} className="text-[#806CE0]" aria-hidden="true" />
                </span>
              </div>

              <div className="flex flex-col pb-2 border-b border-[#EAE5E3]">
                <h3 className="font-body font-medium text-[20px] text-black leading-[27px]">
                  {mode.name}
                </h3>
                {mode.description !== '' && (
                  <p className="font-body text-[12.8px] leading-[21px] text-black/60">
                    {mode.description}
                  </p>
                )}
              </div>

              {mode.bestFor.length > 0 && (
                <div className="py-2 border-b border-[#EAE5E3]">
                  <p className="pb-2 text-black/85 text-[16px] font-body font-medium leading-[20px]">
                    {mode.bestForLabel}
                  </p>
                  <div className="flex flex-col gap-2">
                    {mode.bestFor.map((item, n) => (
                      <div
                        key={item}
                        className="flex gap-1 font-body text-[12.8px] text-black/60 leading-[20px] ml-1"
                      >
                        <div className="w-3" aria-hidden="true">
                          {n + 1}
                        </div>
                        <div>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="py-2">
                <p className="pb-2 text-black/85 text-[16px] font-body font-medium leading-[20px]">
                  Deliverables
                </p>
                <div className="flex flex-col gap-2">
                  {mode.deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex font-body text-[12.8px] text-black/60 leading-[20px]"
                    >
                      <span className="flex items-center text-[#5A9E6F]">
                        <CircleCheckBig size={14} strokeWidth={2} className="mr-2" aria-hidden="true" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* ── Our Recommendation — full-width conclusion band, matches live's border-t/b ── */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 p-4 border-t lg:border-b border-black/[0.08]">
        <div>
          <h3 className="font-body font-semibold text-[17px] text-[var(--semantic-ink-strong)] mb-3">
            Our Recommendation
          </h3>
          <div className="space-y-2">
            <p className="font-body text-[14px] leading-relaxed text-[var(--semantic-ink-body)] max-w-[75ch]">
              <strong className="font-semibold text-[var(--semantic-ink-strong)]">
                Start with:
              </strong>{' '}
              {METHODOLOGY_RECOMMENDATION.startWith}
            </p>
            <p className="font-body text-[14px] leading-relaxed text-[var(--semantic-ink-body)] max-w-[75ch]">
              <strong className="font-semibold text-[var(--semantic-ink-strong)]">
                Consider adding:
              </strong>{' '}
              {METHODOLOGY_RECOMMENDATION.considerAdding}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap self-start lg:flex-shrink-0">
          <Button variant="brand" size="md" animatedArrow>
            Confirm approach
          </Button>
          <Button variant="secondary" size="md">
            Request timeline
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
