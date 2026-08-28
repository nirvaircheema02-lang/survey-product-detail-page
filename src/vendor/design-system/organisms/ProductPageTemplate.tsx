/**
 * ProductPageTemplate
 *
 * WHY · Product pages (Report Store · Surveys) share a fixed zone order. Assembling zones inline per page
 *       leads to zone-order drift and mismatched prop signatures across projects.
 * WHAT · Declarative template composing 7 fixed zones: Hero → FeaturedCarousel → StatsRow? → afterStats slot →
 *        BrowseGrid → afterBrowse slot → beforeCta slot → CTABanner. Bespoke sections injected via slot props.
 * WHEN · Any report-store or survey product listing page in the Ken Research front-end.
 * WHEN NOT · Case-study pages (use the case-study organism stack directly) · single-product detail pages.
 * WHERE · `report-store-v07` top-level page · planned V0.2_report report-store surface.
 * HOW ·
 *   ```tsx
 *   <ProductPageTemplate
 *     hero={{ label: "Report Store", title: "Market Intelligence Hub", ... }}
 *     featured={{ label: "Featured", title: "Top Reports", children: <Carousel /> }}
 *     browse={{ label: "Browse", title: "All Reports", items: reports, renderCard: (r) => <ReportCard {...r} /> }}
 *     cta={{ label: "Get Access", title: "Ready to Start?", primaryText: "Request Demo" }}
 *     afterStats={<IndustryFilterSection />}
 *   />
 *   ```
 *
 * @reusabilityScore 3
 * @a11y_status pending-review
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */
/**
 * ProductPageTemplate — Template (cross-pillar)
 *
 * Declarative page template for Product pages (Report Store, Surveys).
 * Accepts configuration objects for each section zone and renders
 * the full organism stack with optional bespoke sections injected
 * between fixed zones.
 *
 * Zone Layout:
 *   1. Hero (ProductHero)
 *   2. Featured (FeaturedCarousel)
 *   3. Stats (StatsRow) — optional
 *   4. afterStats slot — bespoke sections
 *   5. Browse (BrowseGrid)
 *   6. afterBrowse slot — bespoke sections
 *   7. CTA (CTABanner)
 *
 * Usage:
 * ```tsx
 * <ProductPageTemplate
 *   hero={{ label: 'Report Store', title: '...', ... }}
 *   featured={{ label: 'Featured', title: '...', children: ... }}
 *   stats={{ label: '...', title: '...', stats: [...] }}
 *   browse={{ label: '...', title: '...', items: [...], renderCard: ... }}
 *   cta={{ label: '...', title: '...', primaryText: '...' }}
 *   afterStats={<CustomSection />}
 * />
 * ```
 */
import type { ReactNode } from 'react';
import { ProductHero, type ProductHeroProps } from './ProductHero';
import { FeaturedCarousel, type FeaturedCarouselProps } from './FeaturedCarousel';
import { StatsRow, type StatsRowProps } from './StatsRow';
import { BrowseGrid, type BrowseGridProps } from './BrowseGrid';
import { CTABanner, type CTABannerProps } from './CTABanner';

export interface ProductPageTemplateProps {
  /** Hero section config */
  hero: ProductHeroProps;
  /** Featured carousel config */
  featured: FeaturedCarouselProps;
  /** Stats row config — omit to skip */
  stats?: StatsRowProps;
  /** Browse grid config */
  browse: BrowseGridProps<any>;
  /** CTA banner config */
  cta: CTABannerProps;
  /** Bespoke content injected after Stats / before Browse */
  afterStats?: ReactNode;
  /** Bespoke content injected after Browse / before CTA */
  afterBrowse?: ReactNode;
  /** Bespoke content injected before CTA */
  beforeCta?: ReactNode;
}

export function ProductPageTemplate({
  hero,
  featured,
  stats,
  browse,
  cta,
  afterStats,
  afterBrowse,
  beforeCta,
}: ProductPageTemplateProps) {
  return (
    <>
      {/* Zone 1: Hero */}
      <ProductHero {...hero} />

      {/* Zone 2: Featured */}
      <FeaturedCarousel {...featured} />

      {/* Zone 3: Stats (optional) */}
      {stats && <StatsRow {...stats} />}

      {/* Zone 4: After-Stats slot (bespoke) */}
      {afterStats}

      {/* Zone 5: Browse Grid */}
      <BrowseGrid {...browse} />

      {/* Zone 6: After-Browse slot (bespoke) */}
      {afterBrowse}

      {/* Zone 7: Before-CTA slot (bespoke) */}
      {beforeCta}

      {/* Zone 8: CTA Banner */}
      <CTABanner {...cta} />
    </>
  );
}
