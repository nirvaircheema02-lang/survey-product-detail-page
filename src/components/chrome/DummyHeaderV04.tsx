'use client';

/**
 * DummyHeaderV04 — v0.4 top navigation (DS-canonical · static dummy)
 *
 * @what  Two-band header matching topnav-v32 visual aesthetic.
 *        Tailwind class tokens · DS atoms throughout · zero inline-style for token values.
 *        Composes: Button (CTA + Sign up) · TextLink (helper nav) ·
 *        HamburgerIcon (mobile) · DropdownChevron (chevrons).
 * @why   Project-local dummy · NOT replacing canonical DS Navbar (report-store pattern).
 *        Matches topnav-v32 (localhost:3005) per user 2026-05-20 brief G14.
 * @when  v0.4 chrome L1. Sticky top:0 z-50.
 * @how   Mobile-first · single 60px bar default · lg+ utility 38px + primary 70px.
 *
 * Bars border-b w/ DS --black-100 hairline. No shadow. Editorial light surface.
 */

import { useState } from 'react';
import Link from 'next/link';
import { Search, UserCircle2, LogIn } from 'lucide-react';
import { Button } from '@kenresearch/design-system/atoms';
import { TextLink } from '@kenresearch/design-system/atoms';
import { HamburgerIcon } from '@kenresearch/design-system/atoms';
import { DropdownChevron } from '@kenresearch/design-system/atoms';

export interface DummyHeaderV04Props {
  /** Optional controlled hamburger state · used to lift state for SideTOC drawer */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const SECONDARY_LINKS = [
  { id: 'procurement', label: 'Procurement', href: '#' },
  { id: 'expert-panel', label: 'Expert Panel', href: '#' },
];

const NAV_ITEMS = [
  { id: 'reports', label: 'Reports' },
  { id: 'industries', label: 'Industries' },
  { id: 'survey', label: 'Surveys' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'insights', label: 'Insights' },
];

export function DummyHeaderV04({ mobileOpen, onMobileOpenChange }: DummyHeaderV04Props = {}) {
  // Uncontrolled fallback when parent doesn't lift state
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = mobileOpen ?? internalOpen;
  const setOpen = onMobileOpenChange ?? setInternalOpen;

  return (
    <header
      role="banner"
      data-component="DummyHeaderV04"
      className="sticky top-0 z-[50] bg-[var(--color-foundation-white)]"
      style={{ zIndex: 50 }}
    >
      {/* ─── UTILITY BAR · lg+ only · h-[38px] ─────────────────── */}
      <div className="hidden lg:block h-[38px] border-b border-[var(--black-100)]">
        <div className="h-full mx-auto flex items-center justify-between max-w-[var(--container-page,1240px)] px-6">
          {/* left helper links · DS TextLink sm */}
          <nav aria-label="Secondary navigation" className="flex items-center gap-6">
            {SECONDARY_LINKS.map((l) => (
              <TextLink key={l.id} href={l.href} size="sm">
                {l.label}
              </TextLink>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer text-[var(--semantic-ink-body)] hover:text-[var(--semantic-ink-strong)] transition-colors font-body text-[13px] leading-none"
            >
              Company
              <DropdownChevron isOpen={false} size={10} />
            </button>
          </nav>

          {/* right auth */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="inline-flex items-center gap-1.5 text-[var(--semantic-ink-body)] hover:text-[var(--semantic-ink-strong)] transition-colors font-body text-[13px] leading-none no-underline"
            >
              <LogIn size={13} strokeWidth={1.75} />
              Sign in
            </Link>
            <Button
              variant="secondary"
              size="sm"
              icon={<UserCircle2 />}
              iconPosition="left"
              onClick={() => {}}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>

      {/* ─── PRIMARY BAR · 60px mobile · 70px lg+ ──────────────── */}
      <div className="h-[60px] lg:h-[70px] border-b border-[var(--black-100)]">
        <div className="h-full mx-auto flex items-center justify-between max-w-[var(--container-page,1240px)] px-5">
          {/* LEFT · Logo · rotated diamond + wordmark */}
          <Link
            href="/"
            aria-label="Ken Research home"
            className="flex items-center gap-2 no-underline"
          >
            <span
              aria-hidden="true"
              className="inline-block w-[22px] h-[22px] bg-[var(--color-brand-red)] rotate-45 rounded-[var(--radius-2xs,2.5px)]"
            />
            <span className="font-body font-bold text-[17px] tracking-[0.04em] text-[var(--semantic-ink-strong)] leading-none">
              KEN RESEARCH
            </span>
          </Link>

          {/* CENTER · nav items · lg+ only */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="inline-flex items-center gap-1 bg-transparent border-0 px-1 py-2 cursor-pointer text-[var(--semantic-ink-body)] hover:text-[var(--semantic-ink-strong)] transition-colors font-body font-normal text-[14px] leading-none"
              >
                {item.label}
                <DropdownChevron isOpen={false} size={12} />
              </button>
            ))}
          </nav>

          {/* RIGHT · desktop search + brand CTA · mobile avatar + hamburger */}
          <div className="flex items-center gap-3">
            {/* desktop search pill */}
            <div className="hidden lg:flex items-center gap-2 border border-[var(--black-200)] rounded-[var(--radius-xs,5px)] pl-3.5 pr-1.5 py-1.5 bg-[var(--color-foundation-white)]">
              <span className="font-body text-[13px] text-[var(--semantic-ink-subtle)] leading-none">
                Search
              </span>
              <button
                type="button"
                aria-label="Open search"
                className="w-6 h-6 inline-flex items-center justify-center bg-transparent border-0 cursor-pointer text-[var(--semantic-ink-body)] hover:text-[var(--semantic-ink-strong)]"
              >
                <Search size={14} strokeWidth={1.75} />
              </button>
            </div>

            {/* desktop CTA · DS Button brand sm */}
            <div className="hidden lg:block">
              <Button variant="brand" size="sm" onClick={() => {}}>
                Book discovery call
              </Button>
            </div>

            {/* mobile avatar w/ NEW dot */}
            <button
              type="button"
              aria-label="Account"
              className="lg:hidden relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--black-200)] bg-[var(--color-foundation-white)] cursor-pointer text-[var(--semantic-ink-body)]"
            >
              <UserCircle2 size={18} strokeWidth={1.5} />
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0.5 w-[7px] h-[7px] rounded-full bg-[var(--color-brand-red)] border-[1.5px] border-[var(--color-foundation-white)]"
              />
            </button>

            {/* mobile hamburger · DS HamburgerIcon stateful · opens SideTOC drawer */}
            <button
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="side-toc-drawer"
              onClick={() => setOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 bg-transparent border-0 cursor-pointer text-[var(--semantic-ink-strong)]"
            >
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
