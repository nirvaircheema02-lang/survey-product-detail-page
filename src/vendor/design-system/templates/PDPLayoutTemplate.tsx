/**
 * PDPLayoutTemplate
 *
 * WHAT · Full page-shell for a Report PDP (Product Detail Page).
 *        Composes: Navbar (sticky top z-1000) · SkipLink (target="#main") ·
 *        sticky TOC sidebar (lg+, 88px top offset) · `<main id="main">` content slot ·
 *        FinalCTASection · Footer.
 *
 * WHY · The PDP layout is a fixed composition pattern (CANON §3.1 PDP-layout).
 *       Centralising Navbar + SkipLink + TOC sidebar + main + Footer chrome
 *       prevents per-page re-invention and ensures correct z-ladder, sticky offsets,
 *       and landmark roles are applied consistently across all report PDP pages.
 *
 * WHEN · Every Report PDP page (V1 Product Page, report detail, case-study detail).
 *        Any long-form page with sticky TOC sidebar + content column layout.
 *
 * WHEN NOT · Listing page → use ListingPageTemplate.
 *            Single-column landing page → no TOC sidebar needed.
 *
 * WHERE · `core-v2/src/templates/PDPLayoutTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <PDPLayoutTemplate
 *   tocSections={tocSections}
 *   mainContent={<ReportPDPSections data={data} />}
 *   showFinalCTA
 *   finalCTAProps={{ headline: 'Get Full Access', singleCTA: true }}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom Navbar · SkipLink · TableOfContentsSidebar · FinalCTASection · Footer
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §3.1
 */

import type { ReactNode } from 'react';
import { Navbar, type NavbarProps } from '../organisms/Navbar';
import { Footer, type FooterProps } from '../organisms/Footer';
import { SkipLink } from '../atoms/SkipLink';
import {
  TableOfContentsSidebar,
  type TableOfContentsSidebarProps,
} from '../organisms/TableOfContentsSidebar';
import { FinalCTASection, type FinalCTASectionProps } from '../organisms/FinalCTASection';

export interface PDPLayoutTemplateProps {
  /**
   * TOC sections array forwarded to TableOfContentsSidebar.
   * Omit to render without sidebar (single-column layout).
   */
  tocSections?: TableOfContentsSidebarProps['sections'];

  /**
   * The main content slot — all chapter sections rendered here.
   * Renders inside `<main id="main">` for skip-link target.
   */
  mainContent: ReactNode;

  /**
   * Show FinalCTASection before Footer.
   * @default true
   */
  showFinalCTA?: boolean;

  /**
   * Props forwarded to FinalCTASection.
   * Defaults to singleCTA=true (report PDP mode).
   */
  finalCTAProps?: Partial<FinalCTASectionProps>;

  /**
   * Props forwarded to Navbar.
   * Omit to use default Navbar (no auth state, no active section).
   */
  navbarProps?: Partial<NavbarProps>;

  /**
   * Props forwarded to Footer.
   * Omit to use default Footer.
   */
  footerProps?: Partial<FooterProps>;
}

/**
 * PDPLayoutTemplate — report PDP page-shell.
 *
 * Layout:
 * ```
 * <header> Navbar (sticky z-1000) </header>
 * <SkipLink target="main" />
 * <div flex>
 *   <aside sticky top-[88px] lg:block>  TableOfContentsSidebar
 *   <main id="main"> {mainContent} </main>
 * </div>
 * <FinalCTASection />
 * <footer> Footer </footer>
 * ```
 *
 * Z-ladder: Navbar z-1000 · TOC z-100 · Modal-backdrop z-9990 · Modal z-9999
 * (CANON §3.2).
 */
export function PDPLayoutTemplate({
  tocSections,
  mainContent,
  showFinalCTA = true,
  finalCTAProps = {},
  navbarProps = {},
  footerProps = {},
}: PDPLayoutTemplateProps) {
  const hasTOC = tocSections && tocSections.length > 0;

  return (
    <>
      {/* SKIP LINK — keyboard users bypass nav chrome */}
      <SkipLink targetId="main" label="Skip to main content" />

      {/* NAVBAR — sticky top z-1000 */}
      <header role="banner">
        <Navbar {...navbarProps} />
      </header>

      {/* PAGE BODY — TOC sidebar + main content */}
      <div
        className={hasTOC ? 'flex gap-0 relative' : 'relative'}
        style={{ minHeight: '100vh' }}
      >
        {/* TOC SIDEBAR — sticky · 88px top (navbar 64 + 24 breathing) · hidden < lg */}
        {hasTOC && (
          <aside
            className="hidden lg:block flex-shrink-0"
            style={{
              width: 'var(--toc-width, 255px)',
              position: 'sticky',
              top: 'var(--sticky-toc-top, 88px)',
              alignSelf: 'flex-start',
              height: 'fit-content',
              zIndex: 'var(--z-sticky, 100)',
            }}
            aria-label="Table of contents"
            role="navigation"
          >
            <TableOfContentsSidebar sections={tocSections} />
          </aside>
        )}

        {/* MAIN CONTENT — landmark target for skip-link */}
        <main
          id="main"
          className="flex-1 min-w-0"
          tabIndex={-1}
          style={{ outline: 'none' }}
        >
          {mainContent}
        </main>
      </div>

      {/* FINAL CTA SECTION */}
      {showFinalCTA && (
        <FinalCTASection singleCTA {...finalCTAProps} />
      )}

      {/* FOOTER */}
      <footer role="contentinfo">
        <Footer {...footerProps} />
      </footer>
    </>
  );
}
