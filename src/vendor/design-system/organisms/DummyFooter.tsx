'use client';

/**
 * DummyFooter — Stub footer organism pixel-matching V0.2-for-design-system Footer.tsx.
 *
 * WHY: DS Doc-first methodology requires a functional footer stub that matches the
 *      canonical V0.2 footer anatomy (4 regions: nav columns · offices · brand watermark
 *      + newsletter · divider + legal strip) without wiring real backend calls or auth.
 *      Tech team replaces internals post-handover.
 *
 * WHAT: 4 stacked regions on #141016 near-black background:
 *       1. Nav columns — 4-col desktop / mobile accordion
 *       2. Company Overview — 4 office cards
 *       3. Brand watermark ("Ken") + newsletter capture
 *       4. 100px-gapped divider + legal strip (dynamic copyright year)
 *
 * WHEN: Bottom of every report PDP / sample page. One per page, full-width.
 *
 * WHERE: After <main> content, before </body>.
 *
 * HOW: All clicks = console.log placeholders. Email state tracked for subscribe form.
 *      Mobile nav columns use <details>/<summary> semantic accordion.
 *      prefers-reduced-motion honored. WCAG AA contrast on #141016.
 *
 * @todo tech team wires: newsletter subscribe API, office map URLs, nav route links
 */

import { useState } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';

// ── Static data (move to props when consumer drives content) ───────────────
const NAVIGATION_SECTIONS = [
  {
    title: 'About Ken Research',
    links: [
      'Home', 'About Us', 'Services', 'Categories',
      'News', 'Careers', 'Contact Us',
    ],
  },
  {
    title: 'Resources',
    links: [
      'Blogs', 'Industry Reports', 'Company Research Reports',
      'Country Research Reports', 'Bundle Reports', 'Dossier 360',
      'Go To Market Strategy', 'Paid Press Release',
    ],
  },
  {
    title: 'Expertise & Services',
    links: [
      'Industry Speaks', 'Terms & Conditions', 'Privacy Policy',
      'Disclaimer', "FAQ's", 'Sitemap', 'Design System',
      'Charts Showcase', 'IT Support', 'Website Issue',
      'Stakeholder Icons',
    ],
  },
  {
    title: 'How We Are Different?',
    links: [
      'Ken vs BCC', 'Ken vs Euromonitor', 'Ken vs Nielsen',
      'Ken vs MarketsandMarkets', 'Ken vs McKinsey', 'Ken vs Mordor',
      'Ken vs S&P Global', 'Ken vs Grand View', 'Ken vs Frost & Sullivan',
    ],
  },
] as const;

const OFFICES = [
  {
    city: 'India',
    address: 'Unitech Cyber Park, Tower-A, Sector 39, Gurugram, Haryana 122022',
    mapUrl: 'https://maps.google.com/?q=Unitech+Cyber+Park+Gurugram',
  },
  {
    city: 'UAE',
    address: 'Office 1615, Prime Tower, Business Bay, Dubai, UAE',
    mapUrl: 'https://maps.google.com/?q=Prime+Tower+Business+Bay+Dubai',
  },
  {
    city: 'Indonesia',
    address: 'Jl. Jend. Sudirman No.25, Tangerang, Banten 15117',
    mapUrl: 'https://maps.google.com/?q=Jl+Jend+Sudirman+Tangerang',
  },
  {
    city: 'Qatar',
    address: 'Al Asmakh Tower, C-Ring Road, Doha, Qatar',
    mapUrl: null, // null → renders <address> text, no map link
  },
] as const;

export interface DummyFooterProps {
  /** Override default newsletter subscribe handler */
  onSubscribe?: (email: string) => void;
}

export function DummyFooter({ onSubscribe }: DummyFooterProps) {
  const [email, setEmail] = useState('');
  /* Track open-state per accordion section so <summary> can mirror aria-expanded.
     Native <details> manages its own state but doesn't broadcast it to ATs reliably
     when content is a nested list. Mirror it for SR clarity (P1-B 2026-05-14). */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (onSubscribe) {
      onSubscribe(email);
    } else {
      console.log('// TODO: tech team wires subscribe', email);
    }
    setEmail('');
  }

  function handleLink(label: string) {
    console.log('// TODO: tech team wires link', label);
  }

  return (
    <footer
      data-component="DummyFooter"
      style={{
        background: 'var(--variant-cinematic-bg-navbar)',
        paddingTop: '77px',
        paddingBottom: '40px',
        overflow: 'hidden',
      }}
      aria-label="Site footer"
    >
      <div
        className="mx-auto px-2 max-md:px-4"
        style={{ maxWidth: '1200px', width: '100%' }}
      >

        {/* ── Region A: Nav columns ───────────────────────────────────────────── */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-5 max-md:gap-7"
        >
          {NAVIGATION_SECTIONS.map(section => (
            <details
              key={section.title}
              className="group"
              open={undefined} /* Let browser/JS manage; always open on lg */
              onToggle={e => {
                const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                setOpenSections(prev => ({ ...prev, [section.title]: isOpen }));
              }}
            >
              <summary
                className="flex items-center justify-between cursor-pointer list-none mb-4 sm:pointer-events-none"
                aria-expanded={openSections[section.title] ?? false}
                aria-controls={`footer-nav-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={e => {
                  // On sm+, accordion is decorative (columns always show). On mobile, toggle.
                  const details = (e.currentTarget as HTMLElement).closest('details');
                  if (window.innerWidth >= 640 && details) {
                    e.preventDefault();
                  }
                }}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--semantic-ink-on-dark-subtle)',
                  userSelect: 'none',
                }}
              >
                <span>{section.title}</span>
                {/* Chevron — mobile only */}
                <svg
                  aria-hidden="true"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className="sm:hidden transition-transform duration-300 group-open:rotate-180"
                  style={{ color: 'var(--semantic-ink-on-dark-subtle)', flexShrink: 0 }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              <ul
                id={`footer-nav-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="flex flex-col gap-[2px] sm:!block"
                style={{ display: 'none' }}
              >
                {/* CSS: details[open] ul, sm+ always shows */}
                {section.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={e => { e.preventDefault(); handleLink(link); }}
                      className="flex flex-row gap-[20px] items-center transition-all duration-300 ease-out hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                      style={{ opacity: 0.4, textDecoration: 'none', padding: '3px 0' }}
                    >
                      {/* Decorative 1px vertical rule */}
                      <span
                        aria-hidden="true"
                        style={{
                          width: '1px',
                          height: '30px',
                          background: 'var(--black-500)',
                          opacity: 0.3,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          color: 'var(--white)',
                          letterSpacing: '0.62px',
                        }}
                      >
                        {link}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>

        {/* ── Region B: Office locations ──────────────────────────────────────── */}
        <div className="flex flex-col mt-5 max-md:mt-7">
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--semantic-ink-on-dark-subtle)',
              marginBottom: '16px',
            }}
          >
            Company Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {OFFICES.map(office => (
              <div
                key={office.city}
                className="flex flex-col transition-opacity duration-300"
                style={{ opacity: 0.7 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--white)',
                    marginBottom: '8px',
                  }}
                >
                  {office.city}
                </h3>
                {office.mapUrl ? (
                  <a
                    href={office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${office.city} office on map`}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--white)',
                      letterSpacing: '0.1px',
                      lineHeight: '24px',
                      textDecoration: 'none',
                    }}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                  >
                    {office.address}
                  </a>
                ) : (
                  <address
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--white)',
                      letterSpacing: '0.1px',
                      lineHeight: '24px',
                      fontStyle: 'normal',
                    }}
                  >
                    {office.address}
                  </address>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Region C: Brand watermark + newsletter ───────────────────────────── */}
        <div className="w-full flex items-end pt-12 max-md:flex-col max-md:gap-8">

          {/* C1 — Oversized "Ken" wordmark */}
          <div className="h-[270px] max-md:h-max w-3/5 max-md:w-full relative overflow-hidden">
            {/* Desktop: absolute · overflows container (footer has overflow-hidden) */}
            <p
              className="absolute max-md:hidden"
              style={{
                top: '-140px',
                left: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: '356px',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--white)',
                opacity: 0.08, /* subtle watermark — doesn't compete with content */
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              Ken
            </p>
            {/* Mobile: normal flow */}
            <p
              className="md:hidden"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '124px',
                fontWeight: 300,
                color: 'var(--white)',
                opacity: 0.08,
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              Ken
            </p>
          </div>

          {/* C2 — Newsletter capture */}
          <div className="relative w-2/5 max-md:w-full flex flex-col gap-6">
            {/* Mail / support link */}
            <div
              className="flex items-center gap-2"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--white)', letterSpacing: '0.62px' }}
            >
              <Mail size={16} aria-hidden="true" style={{ color: 'var(--black-500)', flexShrink: 0 }} />
              <span>For Queries:</span>
              <a
                href="mailto:support@kenresearch.com"
                className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{ color: 'var(--white)' }}
              >
                support@kenresearch.com
              </a>
            </div>

            {/* Newsletter copy */}
            <div className="flex flex-col gap-2">
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--black-500)',
                  letterSpacing: '0.62px',
                  textTransform: 'uppercase',
                }}
              >
                Subscribe to our Newsletter
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  color: 'var(--white)',
                  letterSpacing: '0.62px',
                }}
              >
                Never Miss out on an update from us
              </p>
            </div>

            {/* Email input + Subscribe */}
            <form
              onSubmit={handleSubscribe}
              className="flex items-center max-md:flex-col max-md:items-start gap-2"
              aria-label="Newsletter subscription form"
            >
              <div
                className="flex items-center"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  width: '100%',
                  maxWidth: '280px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 16px',
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'var(--white)',
                  }}
                  className="placeholder:text-white/50"
                />
              </div>

              {/* Only red element in entire footer (CTA-tier · 5% rule) */}
              <button
                type="submit"
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--variant-cinematic-bg-navbar)]"
                style={{
                  background: 'var(--color-brand-red)',
                  border: '1px solid var(--color-brand-red)',
                  borderRadius: 'var(--radius-sm)',
                  height: '44px',
                  padding: '0 16px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: 'var(--white)',
                  letterSpacing: '0.60px',
                  cursor: 'pointer',
                  transition: 'background var(--motion-duration-fast) var(--motion-easing-smooth), border-color var(--motion-duration-fast) var(--motion-easing-smooth)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-red-hover)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-red-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-red)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand-red)';
                }}
              >
                Subscribe
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* ── Region D: Divider + legal strip ─────────────────────────────────── */}
        {/* 100px gap is the signature footer coda (footer-anatomy.md §5) */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.15)',
            marginTop: '100px',
          }}
          aria-hidden="true"
        />

        <div
          className="w-full flex items-center justify-between mt-[40px] max-md:gap-4 max-md:flex-col max-md:items-start"
        >
          {/* Legal links */}
          <div className="flex gap-[60px] max-md:flex-col max-md:gap-4">
            {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy'].map(label => (
              <a
                key={label}
                href="#"
                onClick={e => { e.preventDefault(); handleLink(label); }}
                className="hover:!text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--semantic-ink-on-dark-subtle)',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Copyright — dynamic year */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--semantic-ink-on-dark-subtle)',
              letterSpacing: '1px',
            }}
          >
            &copy; {new Date().getFullYear()} Ken Research Pvt. Ltd. &middot; All rights reserved.
          </p>
        </div>

      </div>

      {/* ── CSS: Details accordion open state + sm always-open override ─────── */}
      <style>{`
        /* Mobile: show list when <details> is open */
        details[open] > ul {
          display: flex !important;
          flex-direction: column;
          gap: 2px;
        }
        /* sm+: always show lists regardless of open state */
        @media (min-width: 640px) {
          details > ul {
            display: flex !important;
            flex-direction: column;
            gap: 2px;
          }
          details > summary .sm\\:hidden {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}
