/**
 * ListingPageTemplate
 *
 * WHAT · Full page-shell for the Report Store listing page.
 *        Composes: Navbar · SkipLink · ReportStoreHero · Container (flex
 *        sidebar+content) → FiltersPanel sidebar (xl+) + ListingToolbar + CardListing
 *        main column · MobileFilterBar (fixed bottom) · Footer.
 *
 * WHY · The listing layout is a fixed composition pattern (CANON §3.1 Listing-layout +
 *       §2.10). Centralising it prevents per-page re-invention of the sidebar flex
 *       pattern, mobile filter bar positioning, and sticky offset management.
 *
 * WHEN · Report Store listing page.
 *        Any filterable grid listing: industry listings, regional listings.
 *
 * WHEN NOT · Report PDP → use PDPLayoutTemplate.
 *            Single-column content page → no sidebar needed.
 *
 * WHERE · `core-v2/src/templates/ListingPageTemplate.tsx`
 *
 * HOW ·
 * ```tsx
 * <ListingPageTemplate
 *   filtersPanelProps={{ filters: activeFilters }}
 *   listingToolbarProps={{ viewMode, onViewChange, count: total, onSortChange }}
 *   cardListingProps={{ items, viewMode, loading }}
 *   mobileFilterCount={activeFilterCount}
 *   onOpenMobileFilters={() => setMobileSheetOpen(true)}
 * />
 * ```
 *
 * @template Tier4
 * @batch 3.3e
 * @date 2026-05-19
 * @composedFrom Navbar · SkipLink · ReportStoreHero · FiltersPanel · ListingToolbar · CardListing · MobileFilterBar · Footer
 * @recipeRef SPACING-COMPOSITION-LAYOUT-CANON §2.10 · §3.1
 */
'use client';

import type { ReactNode } from 'react';
import { Navbar, type NavbarProps } from '../organisms/Navbar';
import { Footer, type FooterProps } from '../organisms/Footer';
import { SkipLink } from '../atoms/SkipLink';
import { ReportStoreHero, type ReportStoreHeroProps } from '../organisms/ReportStoreHero';
import { FiltersPanel, type FiltersPanelProps } from '../organisms/FiltersPanel';
import { ListingToolbar, type ListingToolbarProps } from '../organisms/ListingToolbar';
import { CardListing, type CardListingProps } from '../organisms/CardListing';
import { MobileFilterBar } from '../molecules/MobileFilterBar';

export interface ListingPageTemplateProps {
  /** Props forwarded to ReportStoreHero. Omit to hide hero entirely. */
  heroProps?: Partial<ReportStoreHeroProps>;

  /** Props forwarded to FiltersPanel */
  filtersPanelProps: FiltersPanelProps;

  /** Props forwarded to ListingToolbar */
  listingToolbarProps: ListingToolbarProps;

  /** Props forwarded to CardListing */
  cardListingProps: CardListingProps;

  /**
   * Active filter count — forwarded to MobileFilterBar badge.
   * Set to 0 when no filters active.
   */
  mobileFilterCount?: number;

  /**
   * Callback to open mobile filter sheet.
   * Required to wire MobileFilterBar to MobileFilterSheet consumer.
   */
  onOpenMobileFilters: () => void;

  /**
   * Optional sentinel or load-more element rendered at the bottom of the listing.
   */
  loadMoreSlot?: ReactNode;

  /** Props forwarded to Navbar */
  navbarProps?: Partial<NavbarProps>;

  /** Props forwarded to Footer */
  footerProps?: Partial<FooterProps>;
}

/**
 * ListingPageTemplate — report store listing page shell.
 *
 * Layout:
 * ```
 * <Navbar />
 * <SkipLink target="main" />
 * <ReportStoreHero />
 * <Container py-10 lg:py-12>
 *   <div flex gap-0 lg:gap-10>
 *     <aside 224px hidden xl:block sticky top-20> FiltersPanel
 *     <main id="main" flex-1>
 *       ListingToolbar
 *       CardListing
 *       loadMoreSlot
 *     </main>
 *   </div>
 * </Container>
 * <MobileFilterBar fixed bottom />
 * <Footer />
 * ```
 */
export function ListingPageTemplate({
  heroProps,
  filtersPanelProps,
  listingToolbarProps,
  cardListingProps,
  mobileFilterCount = 0,
  onOpenMobileFilters,
  loadMoreSlot,
  navbarProps = {},
  footerProps = {},
}: ListingPageTemplateProps) {
  return (
    <>
      {/* SKIP LINK */}
      <SkipLink targetId="main" label="Skip to main content" />

      {/* NAVBAR */}
      <header role="banner">
        <Navbar {...navbarProps} />
      </header>

      {/* HERO — optional search hero */}
      {heroProps && (
        <ReportStoreHero {...heroProps} />
      )}

      {/* LISTING BODY — py-10 lg:py-12 per CANON §2.10 */}
      <div
        className="max-w-[var(--container-page,75rem)] mx-auto px-4 sm:px-6 md:px-8 py-10 lg:py-12"
        data-template="ListingPageTemplate"
      >
        <div className="flex gap-0 lg:gap-10">
          {/* FILTERS SIDEBAR — 224px · hidden < xl (1280px) */}
          <aside
            className="w-56 flex-shrink-0 hidden xl:block"
            aria-label="Filters"
            role="complementary"
          >
            <div className="sticky top-20">
              <FiltersPanel {...filtersPanelProps} />
            </div>
          </aside>

          {/* CONTENT COLUMN */}
          <main
            id="main"
            className="flex-1 min-w-0"
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {/* TOOLBAR — sort · count · view toggle */}
            <ListingToolbar {...listingToolbarProps} />

            {/* CARD GRID / LIST */}
            <CardListing {...cardListingProps} />

            {/* LOAD MORE / SENTINEL */}
            {loadMoreSlot && (
              <div className="mt-6" data-slot="load-more">
                {loadMoreSlot}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER BAR — fixed bottom · only visible < xl */}
      <div className="xl:hidden">
        <MobileFilterBar
          activeFilterCount={mobileFilterCount}
          onOpenFilters={onOpenMobileFilters}
        />
      </div>

      {/* FOOTER */}
      <footer role="contentinfo">
        <Footer {...footerProps} />
      </footer>
    </>
  );
}
