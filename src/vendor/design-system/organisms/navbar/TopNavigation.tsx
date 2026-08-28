'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SkipLink } from '../../atoms/SkipLink';
import { useNavDropdown } from '../../hooks/useNavDropdown';
import { useAuthPopover } from '../../hooks/useAuthPopover';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import { SecondaryBar } from './SecondaryBar';
import { PrimaryNav } from './PrimaryNav';
import type { NavUser, NavItemConfig, MegaMenuEntry } from './types';

export interface TopNavigationProps {
  /** Logo content — renders inside LogoButton */
  logo: ReactNode;
  /** Logo click override (default: onNavigate('/')) */
  onLogoClick?: () => void;

  isAuthenticated: boolean;
  user?: NavUser | null;
  onNavigate: (path: string) => void;
  onSignOut: () => void;

  items?: NavItemConfig[];
  megaMenus?: MegaMenuEntry[];

  /** CTA button — injected to keep DS Button outside package boundary */
  ctaButton?: ReactNode;
  /** Company dropdown — render function receiving isOpen */
  companyDropdown?: (isOpen: boolean) => ReactNode;
  /** Mobile menu — render function receiving (isOpen, onClose) */
  mobileMenu?: (isOpen: boolean, onClose: () => void) => ReactNode;
}

/**
 * TopNavigation — canonical Ken Research top navigation organism (drop-in, slot-based).
 *
 * WHY:
 * - Every public Ken page needs persistent wayfinding + brand presence + global nav (Navbar.md L17–22).
 * - Replaces the zero-prop OG Navbar monolith that proliferated 3× per-project forks (Navbar.md L233 anti-pattern).
 * - SkipLink (WCAG 2.4.1) carried by the navbar — the only skip-link target in the workspace (Navbar.md L20).
 * - Auth state, scroll-direction, mega-menu state, dropdown a11y all owned by DS — consumers cannot fork them.
 * - Logo + CTA + Company + Mobile menu are render-slots so DS package stays free of brand assets / router / Button atom imports (header-anatomy.md L35 "logo content injection" pattern).
 *
 * WHAT:
 * - Composition: SkipLink + ARIA live region (dropdown announcements) + SecondaryBar (auth + company dropdown) + sticky PrimaryNav (logo + items + CTA) + backdrop-blur overlay (when mega menu open) + mega menu panels + mobile menu slot.
 * - Hooks owned: `useNavDropdown` (mega-menu state + keyboard nav + screen-reader announce) · `useAuthPopover` (sign-in popover) · `useMobileMenu` (drawer state).
 * - Variants: implicit by `isAuthenticated` (signed-out vs avatar+popover) · breakpoint-driven layouts in PrimaryNav (header-anatomy.md L11–82).
 * - Sticky shell at top:0 z-50 · `h-72px` · white bg w/ purple-tint shadow `rgba(128,108,224,0.15)` (header-anatomy.md L134).
 *
 * WHEN:
 * - Top of every public Ken page (Navbar.md L26–30).
 * - Report PDP (`projects/V0.2 -for design system/`) — Header consumer wraps this organism (report-pdp-anatomy.md L156–159).
 * - Listings (Report Store · Surveys) · Pillar landings · marketing pages.
 *
 * WHEN NOT:
 * - Case-study pages — use **CaseStudyNavbar** (scroll-spy + auto-hide · different IA) (CaseStudyNavbar.tsx WHEN-NOT).
 * - Admin/dashboard shells — use `DashboardLayout` (different IA · no public marketing nav) (Navbar.md L36).
 * - Modal/overlay/iframe-embed views — no nav chrome (Navbar.md L37–39).
 * - Nested under a contextual sub-navbar that already provides chrome — do not double-stack (Navbar.md L39).
 *
 * WHERE:
 * - `projects/V0.2 -for design system/src/app/App.tsx:174` · `App.tsx:178` (PDP composition).
 * - Reference build: `projects/topnav-v32/` (extracted standalone — dev team iterates here per header-anatomy.md L1).
 * - Pillar/product/listing page templates throughout `projects/*`.
 *
 * HOW:
 * ```tsx
 * <TopNavigation
 *   logo={<KenLogo />}                                  // injected · package never imports SVG (header-anatomy.md L35)
 *   isAuthenticated={false}
 *   onNavigate={(path) => router.push(path)}
 *   onSignOut={signOut}
 *   ctaButton={<Button variant="brand" size="sm">Book discovery</Button>}   // brand Button outside package boundary
 *   companyDropdown={(isOpen) => <CompanyDropdown isOpen={isOpen} />}        // render-fn slot
 *   mobileMenu={(isOpen, onClose) => <MobileMenu isOpen={isOpen} onClose={onClose} />}
 *   megaMenus={[{ id: 'industries', render: (open) => <IndustriesMega open={open} /> }]}
 * />
 * ```
 *
 * Composition: SkipLink atom · SecondaryBar molecule · PrimaryNav molecule · LogoButton atom (via slot) · framer-motion blur overlay.
 * Data contract: `TopNavigationProps` (see interface) — consumer provides logo + auth state + navigate/signout handlers + optional items/megaMenus/CTA/dropdown/mobile-menu slots.
 * A11y: SkipLink (WCAG 2.4.1) · `<nav>` landmark · aria-live polite for dropdown announcements (L98–100) · `aria-hidden` overlay · keyboard-accessible dropdowns via `useNavDropdown` (fixes Navbar.md L210 OG gap).
 * Motion: framer-motion `opacity 0→1 200ms` backdrop fade · sticky transform · MUST respect `useReducedMotion` at consumer-injected mega-menu layer (Navbar.md L226 OG gap closed).
 * Anti-patterns: ❌ don't inject route-aware components — pass `onNavigate` instead · ❌ don't import Button atom inside the package — pass `ctaButton` as ReactNode · ❌ don't hard-code mega-menus — pass `megaMenus[]` · ❌ don't bypass `onLogoClick` for `<a href>` (breaks SPA routing).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/TopNavigation.tsx (port pedigree)
 *               supersedes OG `Design_system_vs_26.../src/app/components/Navbar.tsx` 501-LOC zero-prop monolith (Navbar.md L1–7)
 * @reusabilityScore 5/5 ⭐⭐⭐⭐⭐ — every public Ken page touches it (Navbar.md L243)
 */
export function TopNavigation({
  logo,
  onLogoClick,
  isAuthenticated,
  user,
  onNavigate,
  onSignOut,
  items,
  megaMenus = [],
  ctaButton,
  companyDropdown,
  mobileMenu,
}: TopNavigationProps) {
  const shouldReduceMotion = useReducedMotion();
  const dropdown = useNavDropdown();
  const authPopover = useAuthPopover();
  const mobile = useMobileMenu();

  const handleAuthNavigate = (path: string) => {
    authPopover.close();
    onNavigate(path);
  };

  const handleSignOut = () => {
    authPopover.close();
    onSignOut();
  };

  const handleLogoClick = onLogoClick ?? (() => onNavigate('/'));

  const authPopoverConfig = {
    isOpen: authPopover.isOpen,
    toggle: authPopover.toggle,
    close: authPopover.close,
    onNavigate: handleAuthNavigate,
    onSignOut: handleSignOut,
    popoverRef: authPopover.popoverRef,
    mobileButtonRef: authPopover.mobileButtonRef,
    desktopButtonRef: authPopover.desktopButtonRef,
  };

  return (
    <>
      <SkipLink />
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {dropdown.announcement}
      </div>

      <SecondaryBar
        activeDropdown={dropdown.activeDropdown}
        onMouseEnter={dropdown.handleMouseEnter}
        onMouseLeave={dropdown.handleMouseLeave}
        onKeyDown={dropdown.handleKeyDown}
        isAuthenticated={isAuthenticated}
        user={user}
        authPopover={authPopoverConfig}
        companyDropdown={companyDropdown?.(dropdown.activeDropdown === 'company')}
      />

      <div className="sticky top-0 z-[50] w-full" onMouseLeave={dropdown.handleMouseLeave}>
        {dropdown.activeDropdown &&
          !dropdown.activeDropdown.includes('company') &&
          !dropdown.activeDropdown.includes('mobile') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="fixed inset-0 bg-black/[0.02] backdrop-blur-[2px] z-[45]"
              aria-hidden="true"
              onMouseEnter={dropdown.closeAll}
            />
          )}

        <nav className="relative bg-[var(--color-foundation-white)] backdrop-blur-[4px] h-[72px] border-b border-[var(--border-soft)] z-[50]">
          <PrimaryNav
            logo={logo}
            onLogoClick={handleLogoClick}
            isAuthenticated={isAuthenticated}
            user={user}
            isMobileMenuOpen={mobile.isOpen}
            onToggleMobileMenu={mobile.toggle}
            onCloseMobileMenu={mobile.close}
            authPopover={authPopoverConfig}
            items={items}
            activeDropdown={dropdown.activeDropdown}
            onMouseEnter={dropdown.handleMouseEnter}
            onKeyDown={dropdown.handleKeyDown}
            ctaButton={ctaButton}
          />
        </nav>

        {megaMenus.map((menu) => (
          <span key={menu.id}>{menu.render(dropdown.activeDropdown === menu.id)}</span>
        ))}

        {mobileMenu?.(mobile.isOpen, mobile.close)}
      </div>
    </>
  );
}
