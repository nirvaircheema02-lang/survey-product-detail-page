// Organisms barrel — populated in Phase C/D (report-store + V0.2_report ports)

// Navbar — promoted from topnav-v32 (Phase C step 4b-d, 2026-05-08)
export type { NavUser, AuthPopoverConfig, NavItemConfig, MegaMenuEntry } from './navbar/types';
export { TopNavigation, type TopNavigationProps } from './navbar/TopNavigation';
export { PrimaryNav, type PrimaryNavProps } from './navbar/PrimaryNav';
export { SecondaryBar, type SecondaryBarProps } from './navbar/SecondaryBar';
export { DesktopNavItems, type DesktopNavItemsProps } from './navbar/DesktopNavItems';
export { MobileControls, type MobileControlsProps } from './navbar/MobileControls';
export { TabletControls, type TabletControlsProps } from './navbar/TabletControls';
export { AuthPopover, type AuthPopoverProps } from './navbar/AuthPopover';

// Promoted from Design_system_vs_26 OG (DS Port Batch 7, 2026-05-13 · self-contained organisms)
export { BrowseGrid } from './BrowseGrid';
export { CTABanner } from './CTABanner';
export { ComparisonTable } from './ComparisonTable';
export { FeaturedCarousel } from './FeaturedCarousel';
export { IndustryFocusBanner } from './IndustryFocusBanner';
export { NewsletterSignup } from './NewsletterSignup';
export { ProductHero } from './ProductHero';
export { ProductPageTemplate } from './ProductPageTemplate';
export { QuickAccessBar } from './QuickAccessBar';
export { ResearchMethodology } from './ResearchMethodology';
export { StatsRow } from './StatsRow';
export { TestimonialsRS } from './TestimonialsRS';
export { TopDownloads } from './TopDownloads';
export { TrendingTopics } from './TrendingTopics';
export { UpcomingReports } from './UpcomingReports';

// Promoted from Design_system_vs_26 OG (DS Port Phase 2, 2026-05-13 · case-study sections w/ hooks lifted)
export { HeroSection } from './HeroSection';
export { ChallengesSection } from './ChallengesSection';
export { MethodologySection } from './MethodologySection';
export { ImpactSection } from './ImpactSection';
export { ResourcesSection } from './ResourcesSection';
export { ClientContextSection } from './ClientContextSection';
export { EngagementObjectivesSection } from './EngagementObjectivesSection';
export { TestimonialSection } from './TestimonialSection';
export { ValuePillarsSection } from './ValuePillarsSection';
export { FinalCTASection } from './FinalCTASection';
export { CaseStudyNavbar } from './CaseStudyNavbar';
export { ReadingProgressBar } from './ReadingProgressBar';
export { StickyCTA } from './StickyCTA';

// Promoted from Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13 · adapter pattern — data via props)
export { AnalystPicks, type AnalystPicksProps } from './AnalystPicks';
export { CardListing, type CardListingProps } from './CardListing';
export { CustomResearchCTA, type CustomResearchCTAProps } from './CustomResearchCTA';
export { DailyDataHighlights, type DailyDataHighlightsProps } from './DailyDataHighlights';
export { FeaturedResearch, type FeaturedResearchProps } from './FeaturedResearch';
export { FiltersPanel, type FiltersPanelProps } from './FiltersPanel';
export { IndustrySectorsGrid, type IndustrySectorsGridProps } from './IndustrySectorsGrid';
export { IndustrySidebar, type IndustrySidebarProps } from './IndustrySidebar';
export { IndustrySpotlight, type IndustrySpotlightProps, type SpotlightStat } from './IndustrySpotlight';
export { KeyMarketIndicators, type KeyMarketIndicatorsProps } from './KeyMarketIndicators';
export { ListingToolbar, type ListingToolbarProps } from './ListingToolbar';
export { RecentlyViewed, type RecentlyViewedProps } from './RecentlyViewed';
export { RecommendedForYou, type RecommendedForYouProps } from './RecommendedForYou';
export { ReportPreview, type ReportPreviewProps } from './ReportPreview';
export { ReportStoreHero, type ReportStoreHeroProps } from './ReportStoreHero';

// Dummy stub organisms — Doc-first methodology proof (P1-18 + P1-19 · 2026-05-14)
// Tech team replaces with real TopNavigation / Footer organisms post-handover.
export { DummyHeader, type DummyHeaderProps } from './DummyHeader';
export { DummyFooter, type DummyFooterProps } from './DummyFooter';

// Promoted from V0_lite_report-legacy (DS Port 2026-05-15 · report PDP organisms)
export { FAQSection, type FAQSectionProps, type FAQItem } from './FAQSection';
export { MegaBreadcrumb, type MegaBreadcrumbProps, type BreadcrumbItem } from './MegaBreadcrumb';

// Promoted from report-store-legacy (DS Port 2026-05-15 · listing context + geographic discovery)
export { ListingContextBanner, type ListingContextBannerProps, type IndustryEntry } from './ListingContextBanner';
export { ExploreByRegion, type ExploreByRegionProps, type RegionEntry, type RegionReport } from './ExploreByRegion';

// Batch 3.2b organisms — ported 2026-05-19 (TableOfContentsSidebar · KeyStatsStrip · ResearchMethodology · SampleReportPreview · AssociationStrip)
export {
  TableOfContentsSidebar,
  type TableOfContentsSidebarProps,
  type TOCSectionItem,
} from './TableOfContentsSidebar';
export {
  KeyStatsStrip,
  type KeyStatsStripProps,
  type StatItem as KeyStatItem,
} from './KeyStatsStrip';
export {
  SampleReportPreview,
  type SampleReportPreviewProps,
  type SampleTOCItem,
  type SampleChapter,
  type SidebarTOCState,
} from './SampleReportPreview';
export {
  AssociationStrip,
  type AssociationStripProps,
  type AssociationCertification,
  type AssociationLogo,
} from './AssociationStrip';
// ResearchMethodology re-exported (was already exported above — no-op duplicate removed)

// New organisms — DS Port Phase 4 (2026-05-15 · long-form reader + industry browse)
export { LongFormReader, type LongFormReaderProps, type Chapter } from './LongFormReader';
export {
  IndustryReportSection,
  type IndustryReportSectionProps,
  type Industry,
  type IndustryReportItem,
} from './IndustryReportSection';

// Batch 3.2c organisms — D3 MindMap engine + Scope + Taxonomy (ported 2026-05-19 · V0.2 canonical)
export {
  MindMap,
  type MindMapProps,
  type MindMapNode,
  type MindMapHierarchyNode,
} from './MindMap';
export { MindMapModal, type MindMapModalProps } from './MindMapModal';
export { ScopeOfReport, type ScopeOfReportProps } from './ScopeOfReport';
export { TaxonomyTree, type TaxonomyTreeProps } from './TaxonomyTree';

// Batch 3.3a · 2026-05-19 · Map UI story (NEW research-driven + V0.2 port)
export {
  MapChart,
  type MapChartProps,
  type MapRegion,
  type MapColorScale,
  type MapProjection,
} from './MapChart';
export {
  RegionalComparison,
  type RegionalComparisonProps,
} from './RegionalComparison';

// Batch 3.3b · 2026-05-19 · CHROME organisms (Navbar · Footer · ReportHeroSection)
export { Navbar, type NavbarProps } from './Navbar';
export { Footer, type FooterProps, type FooterLink } from './Footer';
export {
  ReportHeroSection,
  type ReportHeroSectionProps,
  type HeroBadge,
} from './ReportHeroSection';
// Convenience re-exports · types used by ReportHeroSection consumers (sourced from molecules)
export type { BreadcrumbLevel, BreadcrumbNavItem } from '../molecules/Breadcrumb';
export type { MetadataItem } from '../molecules/MetadataStrip';

// Batch 3.3c · 2026-05-19 · DATA organisms (7 V0.2 canonical ports)
export {
  SegmentationSection,
  type SegmentationSectionProps,
  type SegmentationCardData,
  type SegmentationStat,
  type TakeawayPoint,
} from './SegmentationSection';
export {
  GrowthDriversChallenges,
  type GrowthDriversChallengesProps,
  type ColumnCategory,
  type ColumnData,
  type TopicItem,
  type GDCStatItem,
} from './GrowthDriversChallenges';
export {
  MarketDataTable,
  type MarketDataTableProps,
  type MarketDataColumn,
  type MarketDataRow,
  type TableRowPeriod,
  type TextCardInsight,
} from './MarketDataTable';
export {
  CompetitiveLandscape,
  type CompetitiveLandscapeProps,
  type CompetitorEntry,
  type MarketDynamicsBar,
  type ComparisonParam,
  type AnalysisItem,
  type TopPlayer,
  type GDCStat,
} from './CompetitiveLandscape';
export {
  TargetAudience,
  type TargetAudienceProps,
  type StakeholderEntry,
  type AudienceCallout,
  type CalloutStat,
} from './TargetAudience';
export {
  MarketAnalysis,
  type MarketAnalysisProps,
  type ChartSlotItem,
  type MarketInsight,
} from './MarketAnalysis';
export {
  MarketOverview,
  type MarketOverviewProps,
  type MarketOverviewStat,
  type OutlookStat,
  type TimelinePeriod,
} from './MarketOverview';

// Batch 3.3d · 2026-05-19 · LISTING organisms (report-store-legacy canonical ports)
// REMOVED 2026-05-19: ReportCardOrganism (duplicate of molecules/ReportCard · molecule wins · canonical established May 15)
// REMOVED 2026-05-19: ReportCardListing (duplicate of CardListing · CardListing wins · OG canonical)
// RelatedReports now consumes molecules/ReportCard directly
export {
  RelatedReports,
  type RelatedReportsProps,
} from './RelatedReports';

// Stage 4d · 2026-05-20 · Report PDP final-CTA organism (red-gradient + email-capture form)
export {
  ReportFinalCTASection,
  type ReportFinalCTASectionProps,
  type ReportFinalCTABackground,
} from './ReportFinalCTASection';
