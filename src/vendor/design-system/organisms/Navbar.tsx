'use client';

/**
 * Navbar — Full Ken Research navigation organism.
 *
 * WHAT: Two-band sticky header:
 *   1. Utility bar (h-8 · bg-black · lg+ only) — trust tagline left · phone + email right
 *   2. Glass header (h-56px · backdrop-blur · sticky top-0 z-[--z-sticky]) —
 *      LogoButton · 4 nav links · Industries DropdownPanel · CmdKSearchTrigger ·
 *      Sign In · brand Demo CTA · HamburgerIcon (mobile) · MobileMenu slide-down
 *
 * WHY: Dual-band pattern (utility + main) matches report-store canonical. The utility
 *      bar handles trust/contact at minimal visual cost. Glass-header maintains
 *      content visibility through scroll. Active nav underline uses neutral black
 *      (ANTI_PATTERNS rule 19 — brand-red on nav active states is banned, use only for CTAs).
 *
 * WHEN: Top of every Ken Research page. One per page. Always sticky.
 *
 * WHEN NOT: Embedded iframes. Printing. Already using CaseStudyNavbar (don't double-nav).
 *
 * WHERE: Above <main> content. Before SkipLink target.
 *
 * HOW:
 * ```tsx
 * <Navbar
 *   activeHref="/"
 *   onSearchOpen={() => setCommandOpen(true)}
 *   onSignIn={() => router.push('/login')}
 *   onDemoRequest={() => router.push('/demo')}
 * />
 * ```
 *
 * A11y:
 * - <header role="banner"> landmark
 * - <nav aria-label="Primary navigation">
 * - aria-current="page" on active nav link
 * - SkipLink target id="main-nav" (consumer adds id="main-content" on <main>)
 * - Industries dropdown: aria-expanded + aria-controls
 * - Mobile menu: aria-expanded on hamburger button
 * - All touch targets ≥ 44px
 *
 * Motion: Framer AnimatePresence on DropdownPanel + MobileMenu. useReducedMotion applied
 *         in child molecules.
 *
 * @canonical report-store-legacy/src/app/components/Header.tsx (L30-195)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { useState, useRef } from 'react';
import { Phone } from 'lucide-react';
import { Container } from '../atoms/Container';
import { HamburgerIcon } from '../atoms/HamburgerIcon';
import { Button } from '../atoms/Button';
import { DropdownPanel } from '../molecules/DropdownPanel';
import { CmdKSearchTrigger } from '../molecules/CmdKSearchTrigger';
import { MobileMenu, type MobileNavLink } from '../molecules/MobileMenu';

// ── Static defaults (consumer overrides via props) ─────────────────────────

const DEFAULT_NAV_LINKS: MobileNavLink[] = [
  { label: 'Report Store', href: '/', active: true },
  { label: 'Insights', href: '/insights', active: false },
  { label: 'Survey', href: '/survey', active: false },
  { label: 'Consulting', href: '/consulting', active: false },
];

const DEFAULT_INDUSTRIES = [
  'Healthcare',
  'Technology & Telecom',
  'Banking & Financial Services',
  'Energy & Utilities',
  'Consumer & Retail',
  'Manufacturing',
  'Automotive & Transportation',
  'Chemicals & Materials',
];

export interface NavbarProps {
  /** Override active href to highlight correct nav link. */
  activeHref?: string;
  /** Nav link items. Defaults to report-store canonical nav. */
  navLinks?: MobileNavLink[];
  /** Industries dropdown items. */
  industries?: string[];
  /** Called when search trigger is clicked. Wire to command palette. */
  onSearchOpen?: () => void;
  /** Called when Sign In is clicked. */
  onSignIn?: () => void;
  /** Called when Demo CTA is clicked. */
  onDemoRequest?: () => void;
  /** Demo CTA label. Default: "Request a Demo". */
  demoLabel?: string;
  /** href builder for industry dropdown items. Default: () => "#". */
  industryHref?: (industry: string) => string;
  /** Phone number in utility bar. */
  phone?: string;
  /** Email in utility bar. */
  email?: string;
  /** Trust tagline in utility bar. */
  tagline?: string;
  className?: string;
}

export function Navbar({
  activeHref = '/',
  navLinks = DEFAULT_NAV_LINKS,
  industries = DEFAULT_INDUSTRIES,
  onSearchOpen,
  onSignIn,
  onDemoRequest,
  demoLabel = 'Request a Demo',
  industryHref = () => '#',
  phone = '+91 9015 006 060',
  email = 'info@kenresearch.com',
  tagline = 'Trusted by 50,000+ professionals worldwide',
  className = '',
}: NavbarProps) {
  const [industryOpen, setIndustryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const industryTriggerRef = useRef<HTMLButtonElement>(null);

  // Mark nav links active based on activeHref if not already set via prop
  const resolvedLinks: MobileNavLink[] = navLinks.map((link) => ({
    ...link,
    active: link.href === activeHref,
  }));

  return (
    <>
      {/* ── Utility bar — lg+ only ────────────────────────────────────────── */}
      <div
        className="hidden lg:block bg-black text-white/40"
        role="complementary"
        aria-label="Utility information bar"
      >
        <Container maxWidth="page" className="flex items-center justify-between h-8">
          <div className="flex items-center gap-4" style={{ fontSize: 'var(--text-2xs)' }}>
            <span>{tagline}</span>
          </div>
          <div className="flex items-center gap-4" style={{ fontSize: 'var(--text-2xs)' }}>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
            >
              <Phone className="h-3 w-3" aria-hidden="true" color="rgba(255,255,255,0.40)" />
              {phone}
            </a>
            <span className="text-white/20" aria-hidden="true">|</span>
            <a
              href={`mailto:${email}`}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
            >
              {email}
            </a>
          </div>
        </Container>
      </div>

      {/* ── Main glass header ─────────────────────────────────────────────── */}
      <header
        data-component="Navbar"
        className={`sticky top-0 w-full ${className}`}
        style={{
          background: 'var(--glass-header-bg)',
          backdropFilter: 'var(--glass-header-blur)',
          WebkitBackdropFilter: 'var(--glass-header-blur)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          zIndex: 'var(--z-sticky)',
        }}
      >
        <Container maxWidth="page" className="flex h-[56px] items-center justify-between">

          {/* Logo */}
          <a
            href="/"
            aria-label="Ken Research home"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 rounded-sm"
          >
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--brand-red)', borderRadius: 'var(--radius-element)' }}
            >
              <span className="text-white font-bold" style={{ fontSize: 'var(--text-sm)' }}>K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-black tracking-tight leading-tight" style={{ fontSize: 'var(--text-nav)' }}>
                Ken Research
              </span>
              <span className="text-black/40 uppercase leading-tight" style={{ fontSize: '9px', letterSpacing: '0.12em' }}>
                Market Intelligence
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5">
            {resolvedLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={`relative px-3.5 py-2 rounded-md transition-colors ${
                  link.active
                    ? 'text-black'
                    : 'text-black/60 hover:text-black'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1`}
                style={{ fontSize: 'var(--text-nav)' }}
              >
                {link.label}
                {/* Active underline — neutral black, NOT brand-red (rule 19) */}
                {link.active && (
                  <span
                    className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-black rounded-full"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}

            {/* Industries dropdown trigger */}
            <div className="relative">
              <button
                ref={industryTriggerRef}
                type="button"
                id="industries-trigger"
                aria-haspopup="menu"
                aria-expanded={industryOpen}
                aria-controls="industries-panel"
                onClick={() => setIndustryOpen((prev) => !prev)}
                className="flex items-center gap-1 transition-colors px-3.5 py-2 rounded-md text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
                style={{ fontSize: 'var(--text-nav)', minHeight: '44px' }}
              >
                Industries
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${industryOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: 'var(--black-400)' }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <DropdownPanel
                items={industries}
                isOpen={industryOpen}
                onClose={() => setIndustryOpen(false)}
                anchorRef={industryTriggerRef}
                hrefBuilder={industryHref}
              />
            </div>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <CmdKSearchTrigger onOpen={onSearchOpen ?? (() => {})} />

            {/* Divider */}
            <div
              className="hidden sm:block h-5 w-px"
              style={{ background: 'var(--warm-500)' }}
              aria-hidden="true"
            />

            {/* Sign In */}
            <button
              type="button"
              onClick={onSignIn}
              className="hidden sm:flex items-center whitespace-nowrap rounded-md transition-colors h-8 px-3 text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
              style={{ fontSize: 'var(--text-nav)', minHeight: '44px' }}
            >
              Sign In
            </button>

            {/* Demo CTA — brand-red (CTA only — rule 19) */}
            <Button
              variant="brand"
              size="sm"
              className="hidden md:inline-flex"
              onClick={onDemoRequest}
            >
              {demoLabel}
            </Button>

            {/* Mobile hamburger — HamburgerIcon is display-only, wrap in button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
            >
              <HamburgerIcon isOpen={mobileOpen} />
            </button>
          </div>
        </Container>

        {/* Mobile slide-down menu */}
        <MobileMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navLinks={resolvedLinks}
          onSignIn={onSignIn}
          onDemoRequest={onDemoRequest}
          demoLabel={demoLabel}
        />
      </header>
    </>
  );
}
