import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import svgPaths from '../assets/figma/svg-fodxwe3cpi';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useHeroVisibility } from '../hooks/useHeroVisibility';
import { useActiveSection } from '../hooks/useActiveSection';
import { Button } from '../atoms/Button';
import { ChevronDown } from 'lucide-react';

/**
 * CaseStudyNavbar — case-study-only navbar w/ scroll-spy ribbon + auto-hide-on-scroll + two-state (hero vs scrolled).
 *
 * WHY:
 * - Case studies are 8+ section scrolls — continuous wayfinding is essential · scroll-spy ribbon highlights the active section (Navbar.md L17, L155).
 * - Brand impression must establish at hero state (dark secondary bar + "Latest reports" promo) then collapse to utility mode mid-scroll (Navbar.md L18, L283).
 * - Single primary CTA ("Schedule a Demo") surfaces in hero state + mobile drawer · StickyCTA picks up scrolled-state CTA burden (Navbar.md L19, L284).
 * - SkipLink (WCAG 2.4.1) carried by the navbar — the only skip-link target in the workspace (Navbar.md L20).
 * - All scroll-direction · hero-visibility · active-section state owned here so consumers cannot reconstruct any of it (Navbar.md L22).
 * - Distinct from `TopNavigation` (product/marketing IA · mega-menus · no scroll-spy) — case-study IA is anchor-section-driven not mega-menu-driven.
 *
 * WHAT:
 * - Fixed-top container · `translate-y-0` ↔ `-translate-y-full` based on scroll-direction (auto-hide on down · reveal on up · Navbar.md L152–153).
 * - Two visual states driven by `useHeroVisibility`:
 *   - **Hero-state:** dark secondary bar (Latest reports + Procurement + Company dropdown + Login) + white main bar (logo + Services/Industries/Resources + small 93px search + brand "Schedule a Demo" CTA · Navbar.md L150).
 *   - **Scrolled-state:** dark bar hidden · main bar shows hamburger + login + wide 175px search (NO Resources) + section ribbon below (Navbar.md L151).
 * - Mobile drawer (`<lg`): full menu w/ chevron-expand triggers + Company submenu + brand CTA (Navbar.md L153, L186–187).
 * - Section ribbon (md+ · scrolled-state only): 7 hard-coded sections — `client-context · challenges · engagement · methodology · impact · testimonial · resources` · clicked = smooth-scroll · active = black bg + `aria-current="page"` (Navbar.md L96, L206).
 *
 * WHEN:
 * - Top of any `/case-studies/<slug>` page — `template-v3` · `template-v28` · future case studies.
 * - Long-form anchor-section scroll pages where users need to know "where am I" continuously.
 *
 * WHEN NOT:
 * - Product/pillar pages — use **TopNavigation** (multi-pillar mega-menu IA · no scroll-spy).
 * - Listing pages — use TopNavigation + ListingToolbar.
 * - Single-section pages — no scroll-spy needed · use TopNavigation only.
 * - Admin/dashboard shells — use `DashboardLayout` (Navbar.md L36).
 * - Modal/overlay/iframe-embed views — no nav chrome (Navbar.md L37–39).
 *
 * WHERE:
 * - `projects/casestudy-templates/template-v3/` · `template-v28/` (Navbar.md L46).
 * - `projects/v0-lite-report-legacy/` · `projects/report-store-legacy/` (legacy duplicates — pre-port forks · Navbar.md L45–47).
 * - Section IDs the ribbon scrolls TO must exist on consumer `<section>` elements — coupling contract:
 *   `#hero` (HeroSection · for `useHeroVisibility`) · `#client-context` · `#challenges` · `#engagement` · `#methodology` · `#impact` · `#testimonial` · `#resources`.
 *
 * HOW:
 * ```tsx
 * // Consumer page composition (per case-study recipe · Navbar.md L264–272)
 * <CaseStudyNavbar />                            // order 0 · fixed · z-50 · OWNS scroll-direction + section-tracking
 * <main id="main-content">                       // skip-link target
 *   <section id="hero"><HeroSection /></section> // MUST have id="hero" for useHeroVisibility
 *   <section id="client-context">...</section>   // ribbon-tracked
 *   <section id="challenges">...</section>
 *   <section id="engagement">...</section>
 *   <section id="methodology">...</section>
 *   <section id="impact">...</section>
 *   <section id="testimonial">...</section>
 *   <section id="resources">...</section>
 *   <FinalCTASection />
 * </main>
 * ```
 *
 * Composition: `Button` atom (variant=brand · CTA) · `lucide-react/ChevronDown` · inline SVG paths from `figma/svg-fodxwe3cpi` (logo + chevrons + login · port-target = static asset · Navbar.md L102, L234).
 *   Hooks: `useScrollDirection` · `useHeroVisibility` (reads existence of `#hero`) · `useActiveSection` (intersection-observer on section IDs).
 * Data contract: **OG = zero props** (Navbar.md L108–109 central anti-pattern · main reason consumers forked it 3×). Recommended `CaseStudyNavbarProps { sections?, cta?, showSecondaryBar?, secondaryPromo?, companyMenu?, loginHref?, logoHref? }` (Navbar.md L131–141) — refactor pending.
 * A11y: SkipLink (L57–62 · WCAG 2.4.1) · focus rings on links · hamburger has `aria-label` · ribbon uses `aria-current="page"`. KNOWN GAPS: outer wrapper is `<div>` not `<nav aria-label="Primary">` (Navbar.md L209) · Company dropdown is hover-only w/o `aria-expanded` (Navbar.md L210) · mobile drawer not focus-trapped (Navbar.md L211) · no `aria-controls` hamburger→drawer (Navbar.md L212) · Logo SVG has no `<title>` (Navbar.md L213) · search-as-button without button-name (Navbar.md L214 · matches `feedback_a11y_patterns.md` axe pattern).
 * Motion: navbar hide-on-scroll-down `transition-transform duration-300 ease-in-out` (L52–55) · logo position shift hero→scrolled 300ms · Company dropdown 200ms opacity+translate · mobile drawer `animate-in slide-in-from-top-2 duration-300` · chevron-rotate on hover. KNOWN GAP: NO `useReducedMotion` guard — hide-on-scroll-down triggers vestibular distress on motion-sensitive users · DS-violation (Navbar.md L226).
 * Anti-patterns: ❌ don't omit `id="hero"` on the first section — `useHeroVisibility` breaks · ribbon never shows · ❌ don't use on product/marketing pages (wrong IA) · ❌ don't replicate inline Figma SVG paths — promote to static asset on next port · ❌ don't hover-only dropdowns — must be keyboard-accessible on refactor · ❌ don't hard-code the 7-section list — lift to `sections?` prop · ❌ don't double-stack with TopNavigation.
 *
 * @promotedFrom Design_system_vs_26.../src/app/components/Navbar.tsx (501 LOC zero-prop monolith · Navbar.md L1–7) — renamed to CaseStudyNavbar 2026-05-13 to avoid collision w/ topnav-v32 TopNavigation
 * @reusabilityScore 5/5 ⭐⭐⭐⭐⭐ as a pattern · BUT 0/5 maintainability AS WRITTEN — per-project forks proliferated specifically because OG is unportable (Navbar.md L243–245). Refactor target #1.
 */
export function CaseStudyNavbar() {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const scrollDirection = useScrollDirection();
  const isHeroVisible = useHeroVisibility();
  const activeSection = useActiveSection();
  const shouldReduceMotion = useReducedMotion();

  // Determine if navbar should hide · vestibular safety · disable auto-hide for users w/ reduced-motion preference (R6.4 · 2026-05-15)
  const shouldHide = !shouldReduceMotion && !isHeroVisible && scrollDirection === 'down';

  const sections = [
    { id: 'client-context', label: 'Context' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'engagement', label: 'Objectives' },
    { id: 'methodology', label: 'Approach' },
    { id: 'impact', label: 'Impact' },
    { id: 'testimonial', label: 'Testimonial' },
    { id: 'resources', label: 'Resources' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div
      data-component="CaseStudyNavbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        shouldHide ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Skip to Content Link - WCAG 2.4.1 */}
      <a 
        href="#main-content" 
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-white focus-visible:text-black focus-visible:rounded focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
      >
        Skip to main content
      </a>

      <div className="flex flex-col w-full shadow-[0px_8px_12px_-4px_rgba(128,108,224,0.15)]">
        
        {/* ============================================
            SECONDARY MENU - Dark Bar 
            Only visible when at Hero section
            ============================================ */}
        {isHeroVisible && (
          <div className="bg-[var(--variant-cinematic-bg-navbar)] h-[40px] relative shrink-0 w-full z-[2] hidden lg:block">
            {/* Content Container with max-width */}
            <div className="max-w-[var(--container-page)] mx-auto h-full relative">
              {/* Left Side - Latest Reports */}
              <div 
                className="absolute left-4 sm:left-6 md:left-8 lg:left-[40px] flex gap-[8px] items-center max-w-[50%]"
                style={{ top: 'calc(50% + 0.1px)', transform: 'translateY(-50%)' }}
              >
                <div className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-white tracking-[0.24px] leading-[14.4px] whitespace-nowrap">
                  Latest reports:
                </div>
                <div className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white/80 leading-[14.4px] truncate">
                  India Makhana Market Outlook to 2030
                </div>
                <div className="hidden xl:flex items-center gap-[2px] px-[6px] py-[2px] rounded-[5px] hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-[var(--white)] leading-[16.8px] whitespace-nowrap">
                    CTA here
                  </span>
                  <div className="w-[13px] h-[13px] relative shrink-0">
                    <svg className="absolute inset-0" fill="none" viewBox="0 0 12 12">
                      <path d="M3 9L9 3M9 3H4.125M9 3V7.875" stroke="var(--white)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Side - Procurement, Company, Login */}
              <div 
                className="absolute right-4 sm:right-6 md:right-8 lg:right-[49.71px] flex gap-[12px] items-center"
                style={{ bottom: '17.5%', top: '17.5%' }}
              >
                {/* Procurement */}
                <a 
                  href="#" 
                  className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white leading-[26px] hover:text-white/80 transition-colors whitespace-nowrap hidden xl:flex items-center px-2 py-1 rounded-sm h-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--variant-cinematic-bg-navbar)]"
                >
                  Procurement
                </a>

                {/* Company Dropdown */}
                <div 
                  className="relative h-[26px] w-[78px] hidden xl:block"
                  onMouseEnter={() => setShowCompanyDropdown(true)}
                  onMouseLeave={() => setShowCompanyDropdown(false)}
                >
                  <button
                    className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white leading-[26px] hover:text-white/80 transition-colors whitespace-nowrap h-full w-full flex items-center justify-center rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--variant-cinematic-bg-navbar)]"
                    aria-expanded={showCompanyDropdown}
                    aria-haspopup="menu"
                  >
                    Company
                  </button>

                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute bg-black flex flex-col items-start px-[24px] py-[12px] rounded-[8px] top-[26px] left-1/2 -translate-x-1/2 w-[158px] transition-all duration-200 ${
                      showCompanyDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white hover:text-white/80 h-[26px] flex items-center w-full transition-colors whitespace-nowrap">
                      Our Story
                    </a>
                    <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white hover:text-white/80 h-[26px] flex items-center w-full transition-colors whitespace-nowrap">
                      Our Experts
                    </a>
                    <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white hover:text-white/80 h-[26px] flex items-center w-full transition-colors whitespace-nowrap">
                      Careers
                    </a>
                    <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white hover:text-white/80 h-[26px] flex items-center w-full transition-colors whitespace-nowrap">
                      Contact Us
                    </a>
                  </div>
                </div>

                {/* Login */}
                <a 
                  href="#" 
                  className="flex gap-[4px] items-center hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--variant-cinematic-bg-navbar)] rounded-sm px-1 py-0.5"
                >
                  <div className="w-[14px] h-[14px] relative shrink-0">
                    <svg className="absolute inset-0" fill="none" viewBox="0 0 14 14">
                      <path d={svgPaths.p2119a80} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.pfd41100} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.p9c2c600} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-white leading-[26px] whitespace-nowrap">
                    Log in
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            MAIN NAVIGATION - White Bar (All Devices)
            ============================================ */}
        <div className="backdrop-blur-[4px] bg-white min-h-[56px] sm:h-[60px] relative shrink-0 w-full z-[1]">
          {/* Content Container with max-width */}
          <div className="max-w-[var(--container-page)] mx-auto h-full relative">
            
            {/* Logo Container - Position changes based on hero visibility */}
            <div 
              className={`absolute flex gap-[6px] items-center z-10 transition-all duration-300 ${
                isHeroVisible 
                  ? 'left-4 sm:left-6 md:left-8 lg:left-[48px]' 
                  : 'left-4 sm:left-6 md:left-8 lg:left-[76px]'
              }`}
              style={{ bottom: '33.33%', top: '33.33%' }}
            >
              {/* Logo Icon */}
              <div className="h-[18px] sm:h-[20px] w-[13.5px] sm:w-[15px] relative shrink-0">
                <svg className="absolute inset-0" fill="none" viewBox="0 0 14.819 20">
                  <path d={svgPaths.p2fe9b640} fill="black" />
                  <path d={svgPaths.p6164f00} fill="#D72B31" />
                </svg>
              </div>
              {/* Logo Text */}
              <div className="h-[10px] sm:h-[11px] w-[120px] sm:w-[137px] overflow-clip shrink-0">
                <svg className="block w-full h-full" fill="none" viewBox="0 0 137 10.6122">
                  <path d={svgPaths.p1b7f80} fill="black" />
                  <path d={svgPaths.pae3d200} fill="black" />
                </svg>
              </div>
            </div>

            {/* ============================================
                DESKTOP NAVIGATION - Different layouts per state
                ============================================ */}
            {isHeroVisible ? (
              // STATE 1: At Hero - Services, Industries, Resources, Small Search (93px)
              // Using EXACT Figma inset positioning
              <div className="absolute flex gap-[24px] items-center justify-center hidden lg:flex" style={{ inset: '21.82% 32.67% 19.85% 32.74%' }}>
                {/* Services */}
                <button className="flex gap-[4px] items-center justify-center rounded-[5px] hover:opacity-70 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-[14px] text-[var(--black)] leading-[22px] whitespace-nowrap">
                    Services
                  </span>
                  <div className="w-[12px] h-[12px] relative shrink-0">
                    <svg className="absolute inset-0 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 12 12">
                      <path d="M9.75 4.5L6 8.25L2.25 4.5" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Industries */}
                <button className="flex gap-[4px] items-center justify-center rounded-[5px] hover:opacity-70 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-[14px] text-[var(--black)] leading-[22px] whitespace-nowrap">
                    Industries
                  </span>
                  <div className="w-[12px] h-[12px] relative shrink-0">
                    <svg className="absolute inset-0 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 12 12">
                      <path d="M9.75 4.5L6 8.25L2.25 4.5" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Resources */}
                <button className="flex gap-[4px] items-center justify-center rounded-[5px] hover:opacity-70 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-[14px] text-[var(--black)] leading-[22px] whitespace-nowrap">
                    Resources
                  </span>
                  <div className="w-[12px] h-[12px] relative shrink-0">
                    <svg className="absolute inset-0 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 12 12">
                      <path d="M9.75 4.5L6 8.25L2.25 4.5" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Search Bar - Small (93px) */}
                <div className="h-[35px] flex items-center justify-center">
                  <button className="bg-[var(--periwinkle-100)] h-[30px] flex items-center gap-2 rounded-[99px] shadow-[6.98px_-1.02px_14px_-4px_rgba(128,108,224,0.3)] relative overflow-hidden group hover:shadow-lg transition-all w-[93px]">
                    {/* Oval Gradient Effect */}
                    <div 
                      className="absolute blur-[4px] h-[31px] w-[65px] pointer-events-none"
                      style={{
                        left: '-22.77px',
                        top: '3.68px',
                        backgroundImage: "radial-gradient(ellipse 32.5px 15.5px at center, rgba(128,108,224,1) 0%, rgba(128,108,224,0) 100%)"
                      }}
                    />
                    {/* Search Content */}
                    <div className="absolute inset-[2px] bg-[var(--warm-50)] flex items-center justify-between px-[8px] rounded-[99px]">
                      <span className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[22px]">
                        Search
                      </span>
                      <div className="w-[16px] h-[16px] relative shrink-0">
                        <svg className="absolute inset-0" fill="none" viewBox="0 0 16 16">
                          <path d={svgPaths.p888ea00} stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.531 10.531L13.996 13.996" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // STATE 2: After Scroll - Services, Industries, Wide Search (175px) - NO Resources!
              <div className="absolute flex gap-[24px] items-center justify-center hidden lg:flex" style={{ bottom: '20.83%', right: '139.73px', top: '20.83%' }}>
                {/* Services */}
                <button className="flex gap-[4px] items-center justify-center rounded-[5px] hover:opacity-70 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-[14px] text-[var(--black)] leading-[22px] whitespace-nowrap">
                    Services
                  </span>
                  <div className="w-[12px] h-[12px] relative shrink-0">
                    <svg className="absolute inset-0 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 12 12">
                      <path d="M9.75 4.5L6 8.25L2.25 4.5" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Industries */}
                <button className="flex gap-[4px] items-center justify-center rounded-[5px] hover:opacity-70 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-[14px] text-[var(--black)] leading-[22px] whitespace-nowrap">
                    Industries
                  </span>
                  <div className="w-[12px] h-[12px] relative shrink-0">
                    <svg className="absolute inset-0 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 12 12">
                      <path d="M9.75 4.5L6 8.25L2.25 4.5" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Search Bar - Wide (175px) */}
                <div className="h-[35px] flex items-center justify-center">
                  <button className="bg-[var(--periwinkle-100)] h-[30px] flex items-center gap-2 rounded-[99px] shadow-[0.16px_-7.84px_14px_-4px_rgba(128,108,224,0.3)] relative overflow-hidden group hover:shadow-lg transition-all w-[175px]">
                    {/* Oval Gradient Effect - Wider */}
                    <div 
                      className="absolute blur-[4px] h-[31px] w-[145.56px] pointer-events-none"
                      style={{
                        left: '13.23px',
                        top: '23.58px',
                        backgroundImage: "radial-gradient(ellipse 72.78px 15.5px at center, rgba(128,108,224,1) 0%, rgba(128,108,224,0) 100%)"
                      }}
                    />
                    {/* Search Content */}
                    <div className="absolute inset-[2px] bg-[var(--warm-50)] flex items-center justify-between px-[8px] rounded-[99px]">
                      <span className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[22px]">
                        Search
                      </span>
                      <div className="w-[16px] h-[16px] relative shrink-0">
                        <svg className="absolute inset-0" fill="none" viewBox="0 0 16 16">
                          <path d={svgPaths.p888ea00} stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.531 10.531L13.996 13.996" stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================
                RIGHT SIDE ACTIONS - State-dependent positioning
                ============================================ */}
            
            {/* Hamburger Menu - Only when NOT at hero */}
            {!isHeroVisible && (
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="absolute left-4 sm:left-6 md:left-8 lg:left-[40px] hidden lg:flex items-center justify-center px-[6px] py-[8px] rounded-[3px] border border-[rgba(20,16,22,0.1)] hover:bg-black/5 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                style={{ bottom: '28.33%', top: '28.33%' }}
                aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              >
                <div className="h-[10px] w-[14px] relative">
                  <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-0" />
                  <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-[4px]" />
                  <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-[8px]" />
                </div>
              </button>
            )}

            {/* Login - Only when NOT at hero (black text) */}
            {!isHeroVisible && (
              <a 
                href="#" 
                className="absolute right-4 sm:right-6 md:right-8 lg:right-[47.71px] hidden lg:flex gap-[4px] items-center hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded-sm"
                style={{ bottom: '28.33%', top: '28.33%' }}
              >
                <div className="w-[14px] h-[14px] relative shrink-0">
                  <svg className="absolute inset-0" fill="none" viewBox="0 0 14 14">
                    <path d={svgPaths.p2119a80} stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPaths.pfd41100} stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPaths.p9c2c600} stroke="var(--black)" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-['DM_Sans',sans-serif] font-normal text-[12px] text-[var(--black)] leading-[26px] whitespace-nowrap">
                  Log in
                </span>
              </a>
            )}

            {/* Schedule Demo Button - Only when AT hero */}
            {isHeroVisible && (
              <div 
                className="absolute right-4 sm:right-6 md:right-8 lg:right-[47.84px] hidden sm:flex items-center"
                style={{ bottom: '21%', top: '21%' }}
              >
                <Button
                  variant="brand"
                  size="sm"
                  className="font-['DM_Sans',sans-serif] font-bold text-[14px] leading-[16.8px] whitespace-nowrap"
                >
                  Schedule a Demo
                </Button>
              </div>
            )}

            {/* Mobile Menu Button - Always visible below lg */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden absolute right-4 sm:right-6 flex items-center justify-center w-11 h-11 rounded-[3px] border border-black/10 hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
              style={{ bottom: '28.33%', top: '28.33%' }}
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            >
              <div className="h-[10px] w-[14px] relative">
                <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-0" />
                <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-[4px]" />
                <div className="absolute bg-[var(--black)] h-[2px] left-0 right-0 rounded-[5px] top-[8px]" />
              </div>
            </button>
          </div>
        </div>

        {/* ============================================
            MOBILE MENU DROPDOWN (Below lg screens)
            ============================================ */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-black/10 shadow-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col p-4 sm:p-6 space-y-1 max-h-[calc(100vh-60px)] overflow-y-auto">
              
              {/* Main Navigation Links */}
              <div className="space-y-1 pb-4 border-b border-black/10">
                <button className="font-['DM_Sans',sans-serif] font-bold text-[14px] sm:text-[15px] text-[var(--black)] leading-[22px] py-3 px-2 hover:bg-black/5 rounded-[5px] transition-colors flex items-center justify-between group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px]">
                  Services
                  <ChevronDown className="w-4 h-4 text-black/40 group-hover:translate-y-0.5 transition-transform" />
                </button>
                <button className="font-['DM_Sans',sans-serif] font-bold text-[14px] sm:text-[15px] text-[var(--black)] leading-[22px] py-3 px-2 hover:bg-black/5 rounded-[5px] transition-colors flex items-center justify-between group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px]">
                  Industries
                  <ChevronDown className="w-4 h-4 text-black/40 group-hover:translate-y-0.5 transition-transform" />
                </button>
                <button className="font-['DM_Sans',sans-serif] font-bold text-[14px] sm:text-[15px] text-[var(--black)] leading-[22px] py-3 px-2 hover:bg-black/5 rounded-[5px] transition-colors flex items-center justify-between group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px]">
                  Resources
                  <ChevronDown className="w-4 h-4 text-black/40 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Company Submenu */}
              <div className="space-y-1 py-4 border-b border-black/10">
                <div className="font-['DM_Sans',sans-serif] font-medium text-[11px] text-black/40 uppercase tracking-wider px-2 mb-2">
                  Company
                </div>
                <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px] flex items-center">
                  Our Story
                </a>
                <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px] flex items-center">
                  Our Experts
                </a>
                <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px] flex items-center">
                  Careers
                </a>
                <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px] flex items-center">
                  Contact Us
                </a>
              </div>

              {/* Additional Links - Only when hero visible (secondary nav items) */}
              {isHeroVisible && (
                <div className="space-y-1 py-4 border-b border-black/10 xl:hidden">
                  <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px] flex items-center">
                    Procurement
                  </a>
                  <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px]">
                    <div className="w-[14px] h-[14px] relative shrink-0">
                      <svg className="absolute inset-0" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p2119a80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.pfd41100} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p9c2c600} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    Log in
                  </a>
                </div>
              )}

              {/* Login when hero NOT visible */}
              {!isHeroVisible && (
                <div className="space-y-1 py-4 border-b border-black/10 xl:hidden">
                  <a href="#" className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[var(--black)] leading-[26px] py-2.5 px-2 hover:bg-black/5 rounded-[5px] transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 min-h-[44px]">
                    <div className="w-[14px] h-[14px] relative shrink-0">
                      <svg className="absolute inset-0" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p2119a80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.pfd41100} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p9c2c600} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    Log in
                  </a>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="pt-4 space-y-3">
                {/* Schedule Demo - Always in mobile menu */}
                <Button 
                  variant="brand" 
                  size="md" 
                  fullWidth={true}
                  className="font-['DM_Sans',sans-serif] font-bold"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            SECTION NAVIGATION - Only visible when NOT at hero
            Appears below navbar, moves with it
            ============================================ */}
        {!isHeroVisible && (
          <div className="bg-white/95 backdrop-blur-sm border-t border-black/5 hidden md:block">
            <div className="max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8">
              <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 min-h-[44px] rounded-[5px] font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${
                      activeSection === section.id
                        ? 'bg-black text-white'
                        : 'text-black/60 hover:text-black hover:bg-black/5'
                    }`}
                    style={{ fontSize: 'var(--text-xs)' }}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}