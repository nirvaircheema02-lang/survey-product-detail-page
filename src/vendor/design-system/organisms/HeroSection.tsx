import { ChevronDown } from 'lucide-react';

/**
 * HeroSection — case-study editorial hero on cinematic-dark surface w/ 4-card meta grid + scroll-cue.
 *
 * WHY:
 * - Case studies must ground the reader in "who · what · where · who-led" before narrative begins — the 4-card meta grid is that contract sales engineers sign off on per engagement (HeroSection.md L17, L277).
 * - Editorial-light voice on cinematic-dark surface = signature Ken case-study look (DESIGN.md cinematic case-study variant · HeroSection.md L18).
 * - Serif H1 + light weight + clamp font-size = brand display typography · `Noto Serif` echoes Economist/HBR editorial tradition (HeroSection.md L19, L278).
 * - Bouncing scroll-cue ChevronDown = explicit "scroll for more" affordance — long case studies hide depth, this signals it (HeroSection.md L20, L282).
 * - Hero must bridge to next section via `#client-context` scroll target — declares itself the start of the narrative (HeroSection.md L21).
 *
 * WHAT:
 * - Black `<section>` · grid-pattern overlay (0.02 opacity 50px stripe · subliminal "data" texture · HeroSection.md L283) · inner `max-w-container-content` wrapper.
 * - Content stack: "CASE STUDY" editorial label (uppercase tracking-3px) · large serif `<h1>` (clamp `1.75rem → 5vw → var(--text-3xl)`) · responsive 1/2/4-col meta-card grid (Client · Industry · Geography · Engagement Owner) · bottom-centered scroll-cue button w/ animate-bounce ChevronDown.
 * - Variants: **single variant only** — black-only · 4-cards-only · bottom-cue-only (HeroSection.md L154).
 *
 * WHEN:
 * - Top of every `/case-studies/<slug>` page — primary consumers `projects/casestudy-templates/template-v3/` + `template-v28/` (HeroSection.md L26, L46–47).
 * - Engagement deep-dives where Client/Industry/Geography/Owner are the framing (HeroSection.md L28).
 * - Project showcases w/ tabular metadata · cinematic-dark surface required (HeroSection.md L30).
 *
 * WHEN NOT:
 * - Product/catalog pages — use **ProductHero** (search-led black hero · HeroSection.md L36).
 * - Report PDP — use bespoke ReportPDPHero (image + 4-tab cockpit).
 * - Listing pages — use ProductHero or no hero (HeroSection.md L37).
 * - Marketing landing — use larger editorial hero (cinematic w/ video bg · not built · HeroSection.md L38).
 * - When meta isn't 4 dimensions — currently locks to 4 cards · fork for 3 or 5 (HeroSection.md L40).
 *
 * WHERE:
 * - `projects/casestudy-templates/template-v3/` · `template-v28/` (primary consumers · HeroSection.md L46–47).
 * - DS reference build: `Design_system_vs_26.../src/app/components/HeroSection.tsx` (HeroSection.md L48).
 * - Worked example: `design-system-audit/worked-examples/v0-lite-report-legacy/` (legacy pre-port).
 * - **Coupling:** must render w/ `id="hero"` so `useHeroVisibility` (CaseStudyNavbar) detects it (HeroSection.md L62, L266).
 *
 * HOW:
 * ```tsx
 * // OG (current shape) — zero-prop · all content hard-coded · DO NOT REPLICATE
 * <section id="hero"><HeroSection /></section>
 *
 * // Recommended port shape (HeroSection.md L68–80) — prop-lifted
 * <HeroSection
 *   label="Case Study"
 *   title="Evaluating India's Transformer Bushing Market for IPO Readiness — ₹110 Cr TAM and Competitive Positioning Insights"
 *   meta={[
 *     { label: 'Client', value: 'Yash Highvoltage Insulators' },
 *     { label: 'Industry', value: 'Power Transmission • Electrical Equipment • Grid Infrastructure' },
 *     { label: 'Geography', value: 'India' },
 *     { label: 'Engagement Owner', value: 'Director – Strategy' },
 *   ]}
 *   scrollTargetId="client-context"
 *   scrollCueLabel="Explore the Case Study"
 * />
 * ```
 *
 * Composition: NO DS atoms (raw HTML + Tailwind · HeroSection.md L101) · `lucide-react/ChevronDown` icon · no hooks · `scrollIntoView({ behavior: 'smooth' })` to `#client-context`.
 * Data contract: **OG = zero props** (HeroSection.md L109 anti-pattern · refactor priority high). Recommended `HeroSectionProps { label?, title, meta[{label, value}], scrollTargetId?, scrollCueLabel?, className? }`.
 * A11y: `<section>` landmark · `<h1>` semantic · `aria-label` on scroll-cue · focus ring · smooth-scroll respects OS reduced-motion. KNOWN GAPS: meta cards should be `<dl><dt><dd>` not `<div>` (HeroSection.md L203 · matches `feedback_a11y_patterns.md` definition-list rule) · `animate-bounce` ignores `prefers-reduced-motion` (HeroSection.md L206, L217) · ChevronDown missing `aria-hidden="true"` (HeroSection.md L205).
 * Motion: card hover bg fade 300ms · scroll-cue hover tracking-expand + translate-y + color shift · idle `animate-bounce` on ChevronDown (vestibular concern — wrap in `motion-safe:animate-bounce` on port · HeroSection.md L217).
 * Anti-patterns: ❌ don't replicate the zero-prop hard-coded shape — lift props on next iteration · ❌ don't use on light surface — no variant exists · ❌ don't omit `id="hero"` wrapper — breaks CaseStudyNavbar `useHeroVisibility` coupling · ❌ don't use for non-case-study pages — wrong IA · ❌ don't keep dead imports (TrendingUp/Handshake/Zap/MapPin · HeroSection.md L102, L224).
 *
 * @promotedFrom Design_system_vs_26.../src/app/components/HeroSection.tsx (DS Port Phase 2, 2026-05-13)
 * @reusabilityScore 4/5 ⭐⭐⭐⭐☆ — pattern is cross-case-study but zero-prop OG shape forces copy-paste-edit · drops to 3/5 in-practice · 5/5 after prop-lifting (HeroSection.md L235)
 */
export interface HeroMetaItem {
  /** Card eyebrow · uppercase · tracked · e.g. "Client" */
  label: string;
  /** Card body · plain string e.g. "Acme Logistics" */
  value: string;
}

export interface HeroSectionProps {
  /** Section eyebrow · default "Case Study". */
  eyebrow?: string;
  /** Hero H1 title · default = Yash case-study title (backward-compat). */
  title?: string;
  /** 4-item meta grid · keep at 4 for layout · default = Yash meta (backward-compat). */
  meta?: HeroMetaItem[];
  /** Scroll target id · default "client-context". */
  scrollTargetId?: string;
  /** Scroll-cue label · default "Explore the Case Study". */
  scrollCueLabel?: string;
  className?: string;
}

const DEFAULT_META: HeroMetaItem[] = [
  { label: 'Client', value: 'Yash Highvoltage Insulators' },
  { label: 'Industry', value: 'Power Transmission • Electrical Equipment • Grid Infrastructure' },
  { label: 'Geography', value: 'India' },
  { label: 'Engagement Owner', value: 'Director – Strategy' },
];

export function HeroSection({
  eyebrow = 'Case Study',
  title = "Evaluating India's Transformer Bushing Market for IPO Readiness — ₹110 Cr TAM and Competitive Positioning Insights",
  meta = DEFAULT_META,
  scrollTargetId = 'client-context',
  scrollCueLabel = 'Explore the Case Study',
  className,
}: HeroSectionProps = {}) {
  const scrollToTarget = () => {
    const element = document.getElementById(scrollTargetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section data-component="HeroSection" className={`py-12 sm:py-14 md:py-16 flex items-center justify-center relative overflow-hidden ${className ?? ''}`} style={{ background: 'var(--bg-pure-black)' }}>
      <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 relative z-10">
        <div className="mb-6 md:mb-8">
          <span className="font-medium text-white/40 uppercase tracking-[3px]" style={{ fontSize: 'var(--text-nav)' }}>{eyebrow}</span>
        </div>

        <h1 className="leading-[1.15] font-light text-white tracking-tight mb-10 sm:mb-12 md:mb-14" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 5vw, var(--text-3xl))' }}>
          {title}
        </h1>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 sm:mb-14 md:mb-16">
          {meta.map(item => (
            <div key={item.label} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 md:p-6 hover:bg-white/10 transition-all duration-300" style={{ borderRadius: 'var(--radius-element)' }}>
              <dt className="uppercase tracking-[2px] text-white/40 font-medium mb-3 md:mb-4" style={{ fontSize: 'var(--text-xs)' }}>{item.label}</dt>
              <dd className="font-normal text-white/70 leading-[1.5]" style={{ fontSize: 'var(--text-sm)' }}>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={scrollToTarget}
            className="group flex flex-col items-center gap-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-black text-white/60 hover:text-white rounded-sm"
            aria-label={`Navigate to ${scrollCueLabel}`}
          >
            <span
              className="font-medium uppercase tracking-[2px] group-hover:tracking-[2.5px] transition-all"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {scrollCueLabel}
            </span>
            <ChevronDown
              className="w-5 h-5 group-hover:translate-y-1 transition-transform motion-safe:animate-bounce"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}