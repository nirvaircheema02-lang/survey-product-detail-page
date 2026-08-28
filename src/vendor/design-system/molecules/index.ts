// Molecules barrel — populated in Phase C (co-development with V0_lite_report port)

// Navbar molecules — promoted from topnav-v32 (Phase C step 4c, 2026-05-08)
export { NavDropdownTrigger, type NavDropdownTriggerProps } from './navbar/NavDropdownTrigger';
export { SearchBar, type SearchBarProps } from './navbar/SearchBar';
export { AuthButtons, type AuthButtonsProps } from './navbar/AuthButtons';
export { CompanyTrigger, type CompanyTriggerProps } from './navbar/CompanyTrigger';

// Promoted from V0_lite_report (Phase C step 6, 2026-05-08)
export { StatCard, type StatCardProps } from './StatCard';

// Promoted from Design_system_vs_26 OG (DS Port Batch 3, 2026-05-12)
export { CardReveal } from './CardReveal';
export { HorizontalScroll } from './HorizontalScroll';
export { ScrollFade } from './ScrollFade';
export { RevealImage } from './RevealImage';
export { BackToTop } from './BackToTop';
export { EmptyState } from './EmptyState';
export { SkeletonCard } from './SkeletonCard';
export { CardMetaRow, type CardMetaVariant } from './CardMetaRow';
export { CardFooterRow } from './CardFooterRow';
export { IndustryBadge } from './IndustryBadge';
export { LoadMoreSentinel } from './LoadMoreSentinel';
export { ActiveFilterChipBar } from './ActiveFilterChip';
export { CompletionBadge } from './CompletionBadge';
export { SidebarPanel } from './SidebarPanel';

// Promoted from Design_system_vs_26 OG (DS Port Batch 6, 2026-05-13 · after Card/Button/Badge API expansion)
export { ReportCard } from './ReportCard';
export { ReportGridCard } from './ReportGridCard';
export { AnalystPickCardB } from './AnalystPickCardB';
export { CategoryListCard } from './CategoryListCard';
export { DataHighlightCard } from './DataHighlightCard';
export { SurveyCard } from './SurveyCard';
export { SurveySkeleton } from './SurveySkeleton';
export { ResponseChart } from './ResponseChart';
export { QuestionPreview } from './QuestionPreview';
export { FilterAccordion } from './FilterAccordion';
export { MobileFilterSheet } from './MobileFilterSheet';

// Promoted from v1-product-page-ver0.2 (Sprint 1 Foundation · 2026-05-18 · day-1 promotion per DECISIONS D1)
export { ChartCard, type ChartCardProps, type ChartCardAccessLevel, type ChartCardVariant } from './ChartCard';

// Ported from V0_lite_report-legacy + V0.2-for-ds (Batch 3.1c · 2026-05-19)
export { LabelHeadingPair, type LabelHeadingPairProps, type LabelHeadingAlign, type LabelHeadingBackground } from './LabelHeadingPair';
export { StatPairRow, type StatPairRowProps, type StatPairRowItem } from './StatPairRow';
export { CTARowResponsive, type CTARowResponsiveProps, type CTAButtonSpec } from './CTARowResponsive';
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbLevel, type BreadcrumbNavItem } from './Breadcrumb';
export { AccordionItem, type AccordionItemProps } from './AccordionItem';
export { WindowControls, type WindowControlsProps } from './WindowControls';
export { MetadataStrip, type MetadataStripProps, type MetadataItem } from './MetadataStrip';
export { ChartTitleHeader, type ChartTitleHeaderProps, type ChartLegendItem } from './ChartTitleHeader';

// Ported from V0_lite_report-legacy (Batch 3.2a · 2026-05-19)
export { StepperHorizontal, type StepperHorizontalProps, type StepperStep } from './StepperHorizontal';
export { FAQContactCTA, type FAQContactCTAProps } from './FAQContactCTA';
export { MethodologyCard, type MethodologyCardProps } from './MethodologyCard';
// Batch 3.2a-REDO · 2026-05-19 · V0.2 canonical re-port (v0.3-sourced DELETED)
// MapFallback: N/A — not in V0.2 · RegionalComparison organism (Batch 3.3) replaces it
export { DatasetPreviewTable, type DatasetPreviewTableProps, type DatasetAccessTier, type DatasetColumn, type DatasetRow } from './DatasetPreviewTable';
export { TextCard, type TextCardProps, type TextCardStat } from './TextCard';
export { IconCard, type IconCardProps, type IconCardIconSize } from './IconCard';
export { AnalysisCard, type AnalysisCardProps } from './AnalysisCard';
export { SegmentationCard, type SegmentationCardProps, type SegmentationItem } from './SegmentationCard';
export { StakeholderCard, type StakeholderCardProps } from './StakeholderCard';
export { TimelineCard, type TimelineCardProps } from './TimelineCard';
export { StatCardGroup, type StatCardGroupProps, type StatCardGroupItem } from './StatCardGroup';
export { ComparisonParameterCard, type ComparisonParameterCardProps } from './ComparisonParameterCard';

// Batch 3.3a · 2026-05-19 · Map UI story (NEW research-driven components)
// NOTE: TabStrip is the tablist pattern (text labels + animated underline + Arrow nav + tabpanel wiring).
// Distinct from ViewToggle ATOM (icon-only grid/list switch for listing surfaces).
export {
  TabStrip,
  TabStripPanel,
  type TabStripProps,
  type TabStripPanelProps,
  type TabStripOption,
} from './TabStrip';

// Batch 3.3b · 2026-05-19 · CHROME organisms supporting molecules
export { DropdownPanel, type DropdownPanelProps } from './DropdownPanel';
export { CmdKSearchTrigger, type CmdKSearchTriggerProps } from './CmdKSearchTrigger';
export { MobileMenu, type MobileMenuProps, type MobileNavLink } from './MobileMenu';
export { TrustBar, type TrustBarProps } from './TrustBar';
export { PreviewCard, type PreviewCardProps, type PreviewCardSurface } from './PreviewCard';
export { PaywallOverlay, type PaywallOverlayProps, type PaywallSurface } from './PaywallOverlay';

// Batch 3.3d · 2026-05-19 · LISTING surface molecules (report-store-legacy canonical)
export { MobileFilterBar, type MobileFilterBarProps } from './MobileFilterBar';
export {
  CheckboxFilterSection,
  type CheckboxFilterSectionProps,
  type FilterItem,
} from './CheckboxFilterSection';
