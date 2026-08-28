'use client';

import svgPaths from "../assets/figma/svg-oz6ytj1r6m";
import { Button } from '../atoms/Button';
import { ContactModal } from '../atoms/ContactModal';
import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * FinalCTASection — case-study end-of-page conversion section (light surface · centered · ContactModal-triggered).
 *
 * WHY:
 * - Every case-study page needs an explicit final conversion moment — closes the narrative w/ a clear "what's next" ask.
 * - Centered layout = unambiguous focal point at scroll terminus · compresses peripheral attention to the button pair (CTABanner.md L19, L305).
 * - Primary ("Get Customized Report") + secondary ("Book Discovery Call") = 1 strong CTA + 1 alternate path · reduces decision-paralysis exit / bounce-back (CTABanner.md L20, L306).
 * - Light/white surface (NOT cinematic-dark) — case-study FinalCTA inverts from the dark hero open · creates "warm landing" close per case-study recipe bg-alternation.
 * - ContactModal trigger on secondary CTA keeps user on-page (no router transition) · captures lead w/o losing context.
 * - Distinct from `CTABanner` (Product/listings · background-configurable · no modal) — case-study finale has fixed layout + bespoke ContactModal coupling (CTABanner.md L37).
 *
 * WHAT:
 * - `<section>` w/ light bg + top border (`border-t border-black/10`) · `max-w-container-narrow` inner cap · centered text.
 * - Content stack: editorial label "Final Conversion Section" (uppercase tracking-3px) · serif `<h2>` (clamp `1.75rem → 5vw → var(--text-3xl)`) · paragraph body · 2-button row (`flex-col sm:flex-row gap-6`).
 * - Primary Button: variant=primary · size=lg · right-arrow icon (slides on hover via `group-hover:translate-x-1`).
 * - Secondary Button: variant=secondary · size=lg · `onClick` opens `ContactModal`.
 * - Variants: single (case-study-only · light-surface-only · fixed copy currently hard-coded).
 *
 * WHEN:
 * - Bottom of every `/case-studies/<slug>` page — section 9 of the case-study recipe (HeroSection.md L265).
 * - Long-form narrative pages where the close needs both a strong primary action AND a fallback discovery call.
 * - Anywhere the bg-alternation rule lands a white surface as the closer (case-study black-hero → white-close pattern).
 *
 * WHEN NOT:
 * - Product/catalog page bottom — use **CTABanner** (background-configurable · 3 surface variants · slot children · no modal · CTABanner.md L27).
 * - Mid-page CTA — use `<Button>` inline or future `<InlineCTA>` molecule (CTABanner.md L36).
 * - Side-bar lead capture — use future `LeadCaptureCard` (CTABanner.md L38).
 * - Floating/sticky bottom-bar — use **StickyCTA** (CTABanner.md L39).
 * - Report PDP final CTA — use **FinalCTA** w/ red-gradient inversion (report-pdp-anatomy.md L144–150 · DIFFERENT organism · same conceptual slot).
 *
 * WHERE:
 * - `projects/casestudy-templates/template-v3/` · `template-v28/` — bottom of every case-study page.
 * - Case-study recipe order (HeroSection.md L255–266): `Navbar → HeroSection → ClientContextSection → ChallengesSection → EngagementObjectivesSection → MethodologySection → ImpactSection → TestimonialSection → ResourcesSection → FinalCTASection`.
 * - Sibling organism: `CTABanner` (CTABanner.md L276 · alternative bottom-CTA for product pages · different layout + modal-less).
 *
 * HOW:
 * ```tsx
 * // OG (current shape) — zero-prop · all content hard-coded · DO NOT REPLICATE for new case studies
 * <FinalCTASection />
 *
 * // Recommended port shape — prop-lifted (mirrors CTABanner contract · CTABanner.md L137–151)
 * <FinalCTASection
 *   label="Final Conversion Section"
 *   title="Ready to Unlock Strategic Insights for Your Business?"
 *   subtitle="Partner with our team..."
 *   primaryText="Get Customized Report"
 *   primaryShowArrow
 *   secondaryText="Book Discovery Call"
 *   onPrimaryClick={() => router.push('/contact?type=custom')}
 *   onSecondaryClick={() => setContactOpen(true)}
 * />
 * ```
 *
 * Composition: `Button` atom (variant=primary + variant=secondary · size=lg) · `ContactModal` atom (controlled via local `isModalOpen` state) · inline SVG arrow path from `figma/svg-oz6ytj1r6m` · `useState` for modal open/close.
 * Data contract: **Current = zero props** (anti-pattern — all copy + handlers hard-coded). Recommended: prop-lift `label · title · subtitle · primaryText · primaryIcon? · primaryShowArrow? · secondaryText · onPrimaryClick · onSecondaryClick · className` per CTABanner pattern.
 * A11y: semantic `<section>` landmark · `<h2>` heading (NOT `<h1>` — HeroSection already owns the page H1) · real `<Button>` atoms (keyboard-accessible by inheritance) · ContactModal handles focus-trap + ESC + return-focus on close. KNOWN GAP: no `aria-label` on button-row group · label `<span>` could be promoted to semantic eyebrow.
 * Motion: primary Button shimmer + arrow-slide on hover (Button atom signature · CTABanner.md L249) · secondary Button bg-shift on hover · ContactModal entrance handled by atom · reduced-motion respected at Button atom layer (CTABanner.md L252).
 * Anti-patterns: ❌ don't replicate the zero-prop hard-coded shape across case studies — lift to props · ❌ don't use on dark surface (no variant exists · use CTABanner background="black" instead) · ❌ don't bypass ContactModal for secondary CTA — that's the case-study lead-capture contract · ❌ don't omit `flex-col sm:flex-row` on button row — long labels overflow on mobile (CTABanner.md L219 anti-pattern · already correctly handled here · DO NOT REGRESS) · ❌ don't promote this organism to H1 — HeroSection owns the page H1.
 *
 * @promotedFrom Design_system_vs_26.../src/app/components/FinalCTASection.tsx — case-study sibling to OG CTABanner (CTABanner.md L37, L276)
 * @reusabilityScore 4/5 ⭐⭐⭐⭐☆ — pattern is cross-case-study but zero-prop hard-coded copy forces copy-paste-edit · drops to 3/5 in-practice · 5/5 after prop-lifting (mirrors HeroSection.md L235 same flaw).
 */
export type FinalCTABackground = 'white' | 'warm' | 'black';

export interface FinalCTASectionProps {
  /** Section eyebrow · default "Final Conversion Section". */
  eyebrow?: string;
  /** H2 title · default Yash conversion copy. */
  title?: string;
  /** Body subtitle · default Yash copy. */
  subtitle?: string;
  /** Primary button label · default "Get Customized Report". */
  primaryLabel?: string;
  /** Secondary button label · default "Book Discovery Call". */
  secondaryLabel?: string;
  /** Section background variant · default `white` (RS-canonical case-study recipe). For dark case-study recipe use `black`. */
  background?: FinalCTABackground;
  /** Optional primary CTA click handler · falls back to no-op. */
  onPrimaryClick?: () => void;
  /**
   * Show animated orbs background (report PDP variant · V0_lite CTASection pattern).
   * Orbs suppressed when `useReducedMotion()` returns true.
   * @default false
   */
  showOrbs?: boolean;
  /**
   * Hide secondary "Book Discovery Call" button — single-CTA mode (report PDP pattern).
   * @default false
   */
  singleCTA?: boolean;
}

const finalCtaBgMap: Record<FinalCTABackground, string> = {
  white: 'var(--white)',
  warm: 'var(--bg-warm)',
  black: 'var(--bg-pure-black)',
};

const finalCtaTextOnBg: Record<FinalCTABackground, { eyebrow: string; title: string; body: string; border: string }> = {
  white: { eyebrow: 'text-black/40', title: 'text-black', body: 'text-black/70', border: 'border-black/10' },
  warm:  { eyebrow: 'text-black/40', title: 'text-black', body: 'text-black/70', border: 'border-black/10' },
  black: { eyebrow: 'text-white/40', title: 'text-white', body: 'text-white/70', border: 'border-white/10' },
};

export function FinalCTASection({
  eyebrow = 'Final Conversion Section',
  title = 'Ready to Unlock Strategic Insights for Your Business?',
  subtitle = "Partner with our team of industry experts to transform market complexity into actionable strategy. Let's discuss how we can help you achieve your business goals.",
  primaryLabel = 'Get Customized Report',
  secondaryLabel = 'Book Discovery Call',
  background = 'white',
  onPrimaryClick,
  showOrbs = false,
  singleCTA = false,
}: FinalCTASectionProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const ink = finalCtaTextOnBg[background];
  const renderOrbs = showOrbs && !prefersReducedMotion;

  return (
    <>
      <section
        data-component="FinalCTASection"
        className={`py-12 sm:py-16 md:py-20 border-t relative overflow-hidden ${ink.border}`}
        style={{ background: finalCtaBgMap[background] }}
      >
        {/* Orbs background — report PDP variant · V0_lite CTASection pattern */}
        {renderOrbs && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {/* Top-left orb */}
            <div
              className="absolute rounded-full"
              style={{
                top: 0, left: 0,
                width: '600px', height: '600px',
                background: background === 'black'
                  ? 'var(--coral-500, #e08070)'
                  : 'var(--warm-400, #e8deda)',
                opacity: 0.1,
                filter: 'blur(140px)',
                transform: 'translate(-50%, -50%)',
              }}
            />
            {/* Bottom-right orb */}
            <div
              className="absolute rounded-full"
              style={{
                bottom: 0, right: 0,
                width: '700px', height: '700px',
                background: background === 'black'
                  ? 'var(--perano-400, #9098d0)'
                  : 'var(--perano-300, #b4bcdf)',
                opacity: 0.08,
                filter: 'blur(160px)',
                transform: 'translate(50%, 50%)',
              }}
            />
          </div>
        )}
        <div className="max-w-[var(--container-narrow)] mx-auto px-4 sm:px-6 md:px-8 text-center">
          <span className={`font-medium ${ink.eyebrow} uppercase tracking-[3px] mb-6 md:mb-8 block`} style={{ fontSize: 'var(--text-nav)' }}>{eyebrow}</span>

          <h2 className={`leading-[1.15] font-light ${ink.title} mb-6 md:mb-8 tracking-tight`} style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 5vw, var(--text-3xl))' }}>
            {title}
          </h2>

          <p className={`leading-[1.7] ${ink.body} mb-10 md:mb-12 max-w-[var(--container-prose)] mx-auto`} style={{ fontSize: 'var(--text-base)' }}>
            {subtitle}
          </p>

          {/* CTA row — dual or single depending on singleCTA prop.
              Per R4.1.14 · black surface → primary uses variant="brand" · light surface → variant="primary".
              singleCTA=true (report PDP) hides secondary button. */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button
              variant={background === 'black' ? 'brand' : 'primary'}
              size="lg"
              fullWidth={false}
              icon={
                <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.33333 8H12.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p1d405500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
              }
              iconPosition="right"
              onClick={onPrimaryClick}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
            >
              {primaryLabel}
            </Button>

            {!singleCTA && (
              <Button
                variant={background === 'black' ? 'ghost' : 'secondary'}
                background={background === 'black' ? 'dark' : 'light'}
                size="lg"
                fullWidth={false}
                onClick={() => setIsModalOpen(true)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}