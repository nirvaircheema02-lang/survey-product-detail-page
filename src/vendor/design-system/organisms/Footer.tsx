'use client';

/**
 * Footer — Ken Research site footer organism.
 *
 * WHAT: Dark bg-black footer with 4 regions:
 *   1. TrustBar (ISO + Award + 5 client logo pills) — separated by border-b
 *   2. 5-col content grid: Brand col (2-col span) + Industries + Services + Company
 *   3. Bottom bar: copyright · InlineLinks (Privacy / Terms) · LinkedIn + Twitter/X SVG icons
 *
 * WHY: Dark footer anchors the page visually (weight at base = stable composition).
 *      TrustBar at entry converts hesitant buyers on scroll-end. 5-col grid gives
 *      institutional breadth without clutter — matches enterprise research firm norms
 *      (FT / McKinsey / Gartner footer pattern). Social icons = organic reach capture.
 *
 * WHEN: Bottom of every Ken Research page. One per page. Full-width.
 *
 * WHEN NOT: Embedded iframes / print views / Storybook isolated component testing
 *           without mocked router context.
 *
 * WHERE: After <main>, before </body>. Pairs with Navbar organism at top.
 *
 * HOW:
 * ```tsx
 * <Footer />
 * <Footer industries={customIndustries} services={customServices} />
 * ```
 *
 * A11y:
 * - <footer role="contentinfo"> landmark
 * - <nav aria-label="Footer navigation">
 * - Links: focus-visible ring · text-decoration on hover for sighted users
 * - Copyright: dynamic year (client-rendered)
 * - Social: aria-label per icon link
 *
 * @canonical report-store-legacy/src/app/components/Footer.tsx (L42-204)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { Mail, Phone, MapPin } from 'lucide-react';
import { Container } from '../atoms/Container';
import { TrustBar } from '../molecules/TrustBar';

// ── Static defaults ────────────────────────────────────────────────────────

const DEFAULT_INDUSTRIES = [
  'Healthcare',
  'Technology & Telecom',
  'Banking & Financial Services',
  'Energy & Utilities',
  'Consumer & Retail',
  'Manufacturing',
];

const DEFAULT_SERVICES = [
  'Market Research Reports',
  'Custom Research',
  'Consulting Services',
  'Survey Solutions',
  'Procurement Research',
];

const DEFAULT_COMPANY = [
  'About Us',
  'Careers',
  'Press Releases',
  'Blog',
  'Contact Us',
];

const DEFAULT_CLIENT_LOGOS = ['Fortune 500', 'McKinsey', 'Deloitte', 'BCG', 'KPMG'];

// ── Types ──────────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  /** Industries column links. */
  industries?: string[];
  /** Services column links. */
  services?: string[];
  /** Company column links. */
  company?: string[];
  /** Client logo pills for TrustBar. */
  clientLogos?: string[];
  /** Brand description copy. */
  description?: string;
  /** Contact email. */
  email?: string;
  /** Contact phone. */
  phone?: string;
  /** Location text. */
  location?: string;
  /** LinkedIn URL. */
  linkedInUrl?: string;
  /** Twitter/X URL. */
  twitterUrl?: string;
  /** Privacy Policy URL. */
  privacyUrl?: string;
  /** Terms of Service URL. */
  termsUrl?: string;
  /** Link href builder for list items. Default: () => "#". */
  hrefBuilder?: (label: string) => string;
}

export function Footer({
  industries = DEFAULT_INDUSTRIES,
  services = DEFAULT_SERVICES,
  company = DEFAULT_COMPANY,
  clientLogos = DEFAULT_CLIENT_LOGOS,
  description = 'Enterprise-grade market intelligence platform. Actionable insights across 14 industry verticals for informed strategic decisions.',
  email = 'info@kenresearch.com',
  phone = '+91 9015 006 060',
  location = 'Gurgaon, Haryana, India',
  linkedInUrl = '#',
  twitterUrl = '#',
  privacyUrl = '#',
  termsUrl = '#',
  hrefBuilder = () => '#',
}: FooterProps) {
  return (
    <footer
      data-component="Footer"
      role="contentinfo"
      className="bg-black"
      style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
    >
      {/* ── Region 1: Trust bar ──────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <Container maxWidth="page" className="py-6">
          <TrustBar clientLogos={clientLogos} onDark />
        </Container>
      </div>

      {/* ── Region 2: 5-col content grid ─────────────────────────────────── */}
      <Container maxWidth="page" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column — spans 2 cols on lg */}
          <div className="md:col-span-2">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--brand-red)', borderRadius: 'var(--radius-element)' }}
              >
                <span className="text-white font-bold" style={{ fontSize: 'var(--text-sm)' }}>K</span>
              </div>
              <div>
                <span
                  className="text-white tracking-tight block leading-tight"
                  style={{ fontSize: 'var(--text-nav)' }}
                >
                  Ken Research
                </span>
                <span
                  className="text-white/40 uppercase leading-tight"
                  style={{ fontSize: '9px', letterSpacing: '0.12em' }}
                >
                  Market Intelligence
                </span>
              </div>
            </div>

            <p
              className="text-white/50 leading-relaxed mb-6 max-w-sm"
              style={{ fontSize: 'var(--text-nav)' }}
            >
              {description}
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{ fontSize: 'var(--text-nav)' }}
              >
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" color="var(--black-500)" />
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{ fontSize: 'var(--text-nav)' }}
              >
                <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" color="var(--black-500)" />
                {phone}
              </a>
              <div className="flex items-start gap-2.5 text-white/50" style={{ fontSize: 'var(--text-nav)' }}>
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" color="var(--black-500)" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Industries */}
          <FooterLinkColumn heading="Industries" links={industries} hrefBuilder={hrefBuilder} />

          {/* Services */}
          <FooterLinkColumn heading="Services" links={services} hrefBuilder={hrefBuilder} />

          {/* Company */}
          <FooterLinkColumn heading="Company" links={company} hrefBuilder={hrefBuilder} />
        </div>
      </Container>

      {/* ── Region 3: Bottom bar ─────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        <Container maxWidth="page" className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 order-2 sm:order-1" style={{ fontSize: 'var(--text-xs)' }}>
              &copy; {new Date().getFullYear()} Ken Research Pvt. Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-4 order-1 sm:order-2">
              <a
                href={privacyUrl}
                className="text-white/50 hover:text-white transition-colors underline underline-offset-2 decoration-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{ fontSize: 'var(--text-xs)' }}
              >
                Privacy Policy
              </a>
              <a
                href={termsUrl}
                className="text-white/50 hover:text-white transition-colors underline underline-offset-2 decoration-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                style={{ fontSize: 'var(--text-xs)' }}
              >
                Terms of Service
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-3" aria-label="Social media links">
                <a
                  href={linkedInUrl}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                  aria-label="Ken Research on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={twitterUrl}
                  className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
                  aria-label="Ken Research on X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

// ── Internal: Footer link column ───────────────────────────────────────────

interface FooterLinkColumnProps {
  heading: string;
  links: string[];
  hrefBuilder: (label: string) => string;
}

function FooterLinkColumn({ heading, links, hrefBuilder }: FooterLinkColumnProps) {
  return (
    <nav aria-label={`${heading} links`}>
      <h3
        className="text-white mb-4 uppercase"
        style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.15em',
          fontWeight: 'var(--font-weight-heading)',
        }}
      >
        {heading}
      </h3>
      <ul className="space-y-0.5">
        {links.map((link) => (
          <li key={link}>
            <a
              href={hrefBuilder(link)}
              className="block py-1.5 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
              style={{ fontSize: 'var(--text-nav)' }}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
