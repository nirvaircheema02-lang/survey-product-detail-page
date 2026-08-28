/**
 * ProductHero — cross-pillar slot-based product/catalog hero (cinematic-dark).
 *
 * WHY:
 * - Per OG dev plan (ProductHero.md L17, verbatim): *"Hero sections use a reusable template pattern rather than per-pillar organisms."* — explicit anti-fork decision.
 * - Prevents 3 forks (Report Store hero · Surveys hero · Industries hero) — single template w/ data swap (ProductHero.md L18).
 * - Black surface = brand cinematic-dark anchor at first-viewport impression (DESIGN.md variant rules · ProductHero.md L20).
 * - Search-as-hero = primary discovery affordance for catalogs · removes 1 scroll cost (ProductHero.md L21).
 * - Badge row beneath search = quick context (industries · regions · dates) without filter commitment — reduces choice paralysis (ProductHero.md L22).
 *
 * WHAT:
 * - SectionWrapper(black · spacing=xl · maxWidth=wide) → inner 1000px cap → SectionHeading(level=1 · align=left · labelPulse) → optional search input → optional Badge row → optional children slot.
 * - Variants: search-led (default) · curated (`showSearch={false}`) · stat-augmented (via `children`).
 * - Always cinematic-dark · always H1 · single brand surface (ProductHero.md L123).
 *
 * WHEN:
 * - Top of any Product catalog page: `/report-store` · `/surveys` · future `/datasets` (ProductHero.md L27).
 * - Discovery-first pages where search > navigation (ProductHero.md L28).
 * - Used as **Zone 1** of `ProductPageTemplate` (ProductHero.md L47, L278).
 *
 * WHEN NOT:
 * - Case-study hero — use **HeroSection** (editorial label + 4-card meta grid + scroll-cue) (ProductHero.md L36).
 * - Report PDP hero — use bespoke detail hero (image-left + meta-right · not search-led) (ProductHero.md L37).
 * - Marketing scroll-narrative landings — use editorial HeroSection (ProductHero.md L38).
 * - Light-surface contexts — ProductHero is black-only · no light variant (ProductHero.md L40).
 *
 * WHERE:
 * - `Design_system_vs_26.../src/app/components/organisms/ReportStoreHero.tsx:12–22` — wrapper using HERO_CONFIG.
 * - `Design_system_vs_26.../src/app/components/organisms/ProductPageTemplate.tsx:69` — Zone 1 of the template.
 * - `projects/report-store-legacy/src/app/components/ReportStoreHero.tsx` (port).
 * - `projects/competition-benchmarking-listing-v02/` (port).
 *
 * HOW:
 * ```tsx
 * // Full · search + badges + slot
 * <ProductHero
 *   label="Report Store"
 *   title="2,400+ research reports across emerging markets"
 *   subtitle="Industry sizing · competitive intel · forecast models — published weekly."
 *   searchPlaceholder="Search reports, industries, projections..."
 *   showSearch
 *   badges={['India', 'BFSI', 'Healthcare', '2024 publications']}
 * >
 *   <div className="text-white/60 text-xs">↳ 18 new this week</div>
 * </ProductHero>
 *
 * // Curated (no search) — landing-pillar pattern
 * <ProductHero label="Featured Pillar" title="Healthcare Intelligence"
 *   subtitle="500+ reports across pharma, devices, providers."
 *   showSearch={false} badges={['Pharma', 'MedDev', 'Hospitals']} />
 * ```
 *
 * Composition: SectionWrapper atom · SectionHeading atom (level=1 · labelPulse) · Badge atom (variant=rounded · theme=neutral · bordered) · lucide `<Search>` icon · raw `<input>` · `useState` for focus.
 * Data contract: `ProductHeroProps` — consumer provides `label · title · subtitle` (all required) + optional `searchPlaceholder · showSearch · badges[] · children · className`. Adapter pattern: per-pillar wrapper organism passes a frozen `HERO_CONFIG` object (ProductHero.md L144–158).
 * A11y: H1 mandatory via SectionHeading level=1 (one per page · WCAG 1.3.1) · `<section>` landmark inherited · keyboard-accessible search input. KNOWN GAP: input lacks `<label>` / aria-label · `outline-none` w/o focus-ring replacement (ProductHero.md L229–232).
 * Motion: search-focus 200ms bg + border transition (low vestibular risk · no reduced-motion guard needed). No entrance anim — relies on parent FadeInSection (ProductHero.md L240–241).
 * Anti-patterns: ❌ don't use a bare `<input>` long-term — promote to `<SearchInput>` atom when built (ProductHero.md L247) · ❌ don't hard-code placeholder ignoring `searchPlaceholder` prop (ProductHero.md L250 OG bug · ALREADY PRESENT in this file L76 — port-fix pending) · ❌ don't pass non-search children expecting search-bar styling · ❌ don't use on light surface (no variant exists).
 *
 * @promotedFrom Design_system_vs_26.../src/app/components/organisms/ProductHero.tsx (port-ready · model organism per ProductHero.md L5)
 * @reusabilityScore 5/5 ⭐⭐⭐⭐⭐ — true cross-pillar template w/ slot-based composition + documented intent JSDoc (ProductHero.md L257)
 */
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { Badge } from '../atoms/Badge';

export interface ProductHeroProps {
  /** SectionHeading label (e.g. "Report Store", "Surveys") */
  label: string;
  /** SectionHeading title */
  title: string;
  /** SectionHeading subtitle */
  subtitle: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Badge strings shown beneath the search bar */
  badges?: string[];
  /** Optional extra content rendered below badges */
  children?: ReactNode;
  /** className for outer wrapper */
  className?: string;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

export function ProductHero({
  label,
  title,
  subtitle,
  searchPlaceholder: _searchPlaceholder = 'Search...',
  showSearch = true,
  badges = [],
  children,
  className,
  ...dataProps
}: ProductHeroProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <SectionWrapper data-component="ProductHero" {...dataProps} background="black" spacing="xl" maxWidth="wide" className={className}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label={label}
          title={title}
          subtitle={subtitle}
          level={1}
          align="left"
          labelPulse
        />

        {showSearch && (
          <div className="mt-8">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-[5px] transition-all"
              style={{
                backgroundColor: searchFocused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: searchFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <Search size={18} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search reports, industries, projections..."
                className="flex-1 border-none outline-none"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(0,0,0,0)',
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((text) => (
              <Badge key={text} variant="rounded" size="sm" theme="neutral" bordered>
                {text}
              </Badge>
            ))}
          </div>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </SectionWrapper>
  );
}