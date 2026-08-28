'use client';

/**
 * DummyHeader — Stub top navigation organism for PDP sample pages.
 *
 * WHY: DS Doc-first methodology requires a functional header stub that pixel-matches
 *      topnav-v32 visually without wiring real mega-menus or auth state. Tech team
 *      replaces internals post-handover; design team gets a real-looking shell now.
 *
 * WHAT: 72px sticky primary bar + 40px secondary utility bar (desktop-only).
 *       5 nav triggers (Reports · Industries · Surveys · Consulting · Insights).
 *       120×35px pill search w/ 6s purple beam-orbit animation.
 *       Brand-red "Book discovery call" CTA.
 *       Mobile hamburger → drawer. SkipLink at top. WCAG AA.
 *
 * WHEN: Any sample / prototype page. Replace with TopNavigation organism pre-production.
 *
 * WHERE: Mounts above <main id="main-content"> in any consumer page.
 *
 * HOW: All click handlers = console.log placeholders per handover spec.
 *      prefers-reduced-motion honored via useReducedMotion().
 *
 * @todo tech team wires: mega-menus, auth state, search API, router links
 */

import { useState, useEffect } from 'react';
import { useReducedMotion, motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu, ChevronDown } from 'lucide-react';
import { SkipLink } from '../atoms/SkipLink';
import { Button } from '../atoms/Button';

const NAV_ITEMS = [
  { id: 'reports',    label: 'Reports' },
  { id: 'industries', label: 'Industries' },
  { id: 'surveys',    label: 'Surveys' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'insights',   label: 'Insights' },
] as const;

const SECONDARY_TAGS = [
  'Healthcare',
  'Energy',
  'Fintech',
  'Logistics',
  'Consumer',
];

export interface DummyHeaderProps {
  /** Active route id — highlights matching nav item */
  activeId?: string;
}

export function DummyHeader({ activeId }: DummyHeaderProps) {
  const reduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleNavClick(id: string) {
    console.log('// TODO: tech team wires nav click', id);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('// TODO: tech team wires search', searchQuery);
  }

  function handleCTA() {
    console.log('// TODO: tech team wires Book discovery call CTA');
  }

  function handleToggleMobileMenu() {
    console.log('// TODO: tech team wires mobile menu toggle');
    setMobileOpen(prev => !prev);
  }

  return (
    <>
      <SkipLink targetId="main-content" />

      {/* ── Secondary utility bar (desktop-only · 40px · scrolls away) ──────── */}
      <div
        className="hidden md:flex items-center justify-between h-[40px] px-6 border-b"
        style={{
          background: 'var(--color-foundation-white)',
          borderColor: 'rgba(0,0,0,0.05)',
        }}
        aria-label="Utility navigation"
      >
        {/* Industry pill tags */}
        <div className="flex items-center gap-2" role="list" aria-label="Industry quick-links">
          {SECONDARY_TAGS.map(tag => (
            <button
              key={tag}
              role="listitem"
              onClick={() => console.log('// TODO: tech team wires tag', tag)}
              style={{
                fontSize: 'var(--typography-size-xs)',
                color: 'var(--color-foundation-black-500)',
                background: 'var(--color-ramp-warm-200)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-smooth)',
              }}
              className="hover:!text-[var(--color-red-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Auth state placeholder */}
        <div
          style={{
            fontSize: 'var(--typography-size-xs)',
            color: 'var(--color-foundation-black-500)',
          }}
        >
          <button
            onClick={() => console.log('// TODO: tech team wires sign in')}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)]"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
          >
            Sign in
          </button>
          <span className="mx-2 opacity-30">|</span>
          <button
            onClick={() => console.log('// TODO: tech team wires sign up')}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)]"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit' }}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* ── Primary sticky nav (72px) ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-[50] w-full"
        style={{
          background: 'var(--color-foundation-white)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0px 8px 12px -4px rgba(128,108,224,0.15)',
        }}
      >
        <nav
          aria-label="Primary navigation"
          className="flex items-center justify-between px-4 md:px-6 lg:px-8"
          style={{ height: '72px' }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); console.log('// TODO: tech team wires home link'); }}
            aria-label="Ken Research Home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2 rounded-sm"
            style={{ transition: 'opacity var(--motion-duration-fast) var(--motion-easing-smooth)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--typography-size-lg)',
                fontWeight: 700,
                color: 'var(--color-foundation-black)',
                letterSpacing: '-0.01em',
              }}
            >
              Ken Research
            </span>
          </a>

          {/* Desktop nav triggers (≥1024px) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8" role="menubar" aria-label="Site navigation">
            {NAV_ITEMS.map(item => {
              const isActive = item.id === activeId;
              return (
                <div key={item.id} className="relative h-[72px] flex items-center group">
                  <button
                    role="menuitem"
                    data-mega-menu={item.id}
                    onClick={() => handleNavClick(item.id)}
                    aria-label={`${item.label} menu`}
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)] focus-visible:ring-offset-2 rounded-sm"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--typography-size-nav)',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--color-brand-red)' : 'var(--color-foundation-black)',
                      padding: 0,
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={12}
                      aria-hidden="true"
                      style={{
                        color: 'var(--color-foundation-black-500)',
                        transition: 'transform var(--motion-duration-fast) var(--motion-easing-smooth)',
                      }}
                      className="group-hover:rotate-180"
                    />
                  </button>

                  {/* Gradient underline hover signature */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                    style={{
                      background: 'linear-gradient(to right, var(--semantic-surface-cinematic-1), var(--black-500), var(--brand-red))',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right cluster: search + CTA (desktop) / hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Search bar — 120×35px pill · purple beam-orbit · desktop only */}
            <form
              className="hidden md:flex"
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Search Ken Research"
            >
              <div
                className="relative flex items-center overflow-hidden"
                style={{
                  width: '120px',
                  height: '35px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--periwinkle-100)',
                  boxShadow: '6px -1px 14px -4px rgba(128,108,224,0.3)',
                }}
              >
                {/* Purple beam orbit animation */}
                {!reduced && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      width: '65px',
                      height: '31px',
                      background: 'radial-gradient(ellipse, rgba(128,108,224,0.6) 0%, transparent 70%)',
                      filter: 'blur(4px)',
                      animation: 'ken-beam-orbit 6s linear infinite',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  />
                )}

                {/* Inner pill */}
                <div
                  className="absolute inset-[2px] flex items-center px-2 gap-1"
                  style={{
                    background: 'var(--warm-50)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  <input
                    type="search"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search Ken Research"
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '11px',
                      color: 'var(--color-foundation-black)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(20,16,22,0.5)] rounded-full"
                  >
                    <Search
                      size={14}
                      aria-hidden="true"
                      style={{ color: 'var(--color-foundation-black-500)' }}
                    />
                  </button>
                </div>
              </div>
            </form>

            {/* CTA button — desktop + tablet */}
            <div className="hidden md:block">
              <Button
                variant="brand"
                size="sm"
                onClick={handleCTA}
              >
                Book discovery call
              </Button>
            </div>

            {/* Mobile hamburger (< 768px) */}
            <button
              className="md:hidden flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)]"
              onClick={handleToggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background var(--motion-duration-fast) var(--motion-easing-smooth)',
              }}
            >
              {mobileOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={reduced ? { opacity: 1 } : { opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: '100%' }}
              transition={{ duration: reduced ? 0.1 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 top-[72px] z-[49] md:hidden overflow-y-auto"
              style={{ background: 'var(--color-foundation-white)' }}
            >
              <nav aria-label="Mobile navigation" className="p-6 flex flex-col gap-2">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    data-mega-menu={item.id}
                    onClick={() => {
                      handleNavClick(item.id);
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-between w-full text-left py-4 border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,16,22,0.5)] rounded-sm"
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--typography-size-base)',
                      fontWeight: 400,
                      color: 'var(--color-foundation-black)',
                      padding: '16px 0',
                    }}
                  >
                    {item.label}
                    <ChevronDown size={16} aria-hidden="true" style={{ color: 'var(--color-foundation-black-500)' }} />
                  </button>
                ))}

                <div className="pt-6 flex flex-col gap-3">
                  <Button
                    variant="brand"
                    size="md"
                    fullWidth
                    onClick={() => {
                      handleCTA();
                      setMobileOpen(false);
                    }}
                  >
                    Book discovery call
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={() => {
                      console.log('// TODO: tech team wires search mobile');
                      setMobileOpen(false);
                    }}
                  >
                    Search reports...
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── CSS keyframes for beam orbit animation ──────────────────────────── */}
      <style>{`
        @keyframes ken-beam-orbit {
          0%   { transform: translate(-10px, 0px); }
          25%  { transform: translate(60px, 0px); }
          50%  { transform: translate(60px, 2px); }
          75%  { transform: translate(-10px, 2px); }
          100% { transform: translate(-10px, 0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ken-beam-orbit { 0%, 100% { transform: none; } }
        }
      `}</style>
    </>
  );
}
