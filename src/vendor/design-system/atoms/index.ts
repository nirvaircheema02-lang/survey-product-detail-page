// Atoms barrel — populated in Phase C (atom promotion from V0_lite_report port)
// @promotedFrom markers in JSDoc per atom (Step 10)

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize, type ButtonBackground } from './Button';
export { CTALink, type CTALinkProps, type CTALinkVariant, type CTALinkSize } from './CTALink';
export { Card, type CardProps, type CardVariant, type CardPadding, type CardShadow, type CardElement } from './Card';
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize, type BadgeTheme, type BadgeMode } from './Badge';
export { InlineLink, type InlineLinkProps } from './InlineLink';
export { SectionHeading, type SectionHeadingProps, type HeadingLevel, type HeadingAlign } from './SectionHeading';
export { SectionLabel, type SectionLabelProps, type SectionLabelStyle, type SectionLabelBackground, type SectionLabelVariant } from './SectionLabel';
export { SectionWrapper, type SectionWrapperProps, type SectionBackground, type SectionSpacing, type SectionMaxWidth } from './SectionWrapper';
export { AnimatedArrow, type AnimatedArrowProps, type AnimatedArrowColor } from './AnimatedArrow';
export { ScrollProgress } from './ScrollProgress';
export { ScrollToTop } from './ScrollToTop';

// Promoted from topnav-v32 (Phase C step 4b-c, 2026-05-08)
export { TextLink, type TextLinkProps, type TextLinkSize } from './TextLink';
export { StatusDot, type StatusDotProps, type StatusDotPosition } from './StatusDot';
export { Divider, type DividerProps, type DividerOrientation, type DividerVariant } from './Divider';
export { SkipLink, type SkipLinkProps } from './SkipLink';
export { LogoButton, type LogoButtonProps } from './LogoButton';
export { DropdownChevron, type DropdownChevronProps, type DropdownChevronSize } from './DropdownChevron';
export { HamburgerIcon, type HamburgerIconProps } from './HamburgerIcon';
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar';
export { MenuItem, type MenuItemProps } from './MenuItem';

// Promoted from Design_system_vs_26 OG (DS Port Batch 1, 2026-05-12 · Tier 1)
export { Container, type ContainerProps, type ContainerMaxWidth } from './Container';
export { FadeInSection, type FadeInSectionProps } from './FadeInSection';
export { Tooltip, type TooltipProps } from './Tooltip';
export { IconBadge, type IconBadgeProps, type IconBadgeSize } from './IconBadge';
export { Label, type LabelProps, type LabelVariant } from './Label';
export { iconColors, type IconColorType } from './iconColors';
export { industryIconMap, getIndustryIcon } from './industryIconMap';

// Promoted from Design_system_vs_26 OG (DS Port Batch 2, 2026-05-12 · Tier 2)
export { CollapsibleSection, type CollapsibleSectionProps } from './CollapsibleSection';
export { ViewToggle, type ViewToggleProps, type ViewMode } from './ViewToggle';
export { NextSectionCTA, type NextSectionCTAProps } from './NextSectionCTA';
export { SubtleVariantSwitcher, type SubtleVariantSwitcherProps, type VariantOption } from './SubtleVariantSwitcher';

// Promoted from Design_system_vs_26 OG (DS Port Batch 3, 2026-05-12)
// REWRITTEN Batch 3.1a 2026-05-19 — FilterChip is now a toggle chip matching report-store-legacy canonical
export { FilterChip, type FilterChipProps } from './FilterChip';
export { ImageWithFallback } from './ImageWithFallback';

// Promoted from Design_system_vs_26 OG (DS Port Batch 6, 2026-05-13)
export { CategoryListItem } from './CategoryListItem';
// REWRITTEN Batch 3.1a 2026-05-19 — FilterCheckbox now has canonical 16×16 custom checkbox box
export { FilterCheckbox, type FilterCheckboxProps } from './FilterCheckbox';

// Promoted from Design_system_vs_26 OG (DS Port Batch 8, 2026-05-13)
export { ContactModal } from './ContactModal';
export { ResourceCard } from './ResourceCard';
export { FilterCheckboxItem } from './FilterCheckboxItem';
export { FilterIndustryItem } from './FilterIndustryItem';
export { FilterSearchInput } from './FilterSearchInput';
export { FilterSectionHeader } from './FilterSectionHeader';
export { AnimatedArrowQuickRef } from './AnimatedArrowQuickRef';
// SpacingHelpers exports multiple components (visualization helpers · doc-page use only)
export { SpacingScaleVisualization, MarginPaddingGuide, ComponentSpacingExamples, ListFormSpacingDemo, ResponsiveSpacingDemo, VisualRhythmDemo } from './SpacingHelpers';

// Promoted from Design_system_vs_26 OG (DS Port Phase 6, 2026-05-15 · Tier 3)
export { TableOfContents, type TableOfContentsProps, type TOCSection, type TOCSubsection } from './TableOfContents';
export { CodeBlockWithCopy, CodeBlock, type CodeBlockWithCopyProps, type CodeLanguage } from './CodeBlockWithCopy';

// Blur-blob composition background atoms (§16 · 2026-05-15)
export { HeroBackground, type HeroBackgroundProps } from './HeroBackground';
export { CTABackground, type CTABackgroundProps } from './CTABackground';

// Promoted from v1-product-page-ver0.2 (Sprint 1 Foundation · 2026-05-18 · day-1 promotion per PHASE-2-PROPOSAL 2c)
export { AnswerBlock, type AnswerBlockProps } from './AnswerBlock';

// Batch 3.1b · 2026-05-19 · Type + Stat atoms (V0.2-for-ds + V0_lite canonical sources)
export { SectionHeader, type SectionHeaderProps } from './SectionHeader';
export { OverheadText, type OverheadTextProps } from './OverheadText';
export { BodyText, type BodyTextProps } from './BodyText';
export { StatPair, type StatPairProps } from './StatPair';
export { StatBadge, type StatBadgeProps, type StatBadgeVariant } from './StatBadge';
export { IconBox, type IconBoxProps, type IconBoxColor, type IconBoxSize } from './IconBox';
export { InlineStats, type InlineStatsProps } from './InlineStats';

// Batch 3.2a-REDO · 2026-05-19 · V0.2 canonical re-port (v0.3-sourced DELETED · V0.2 canonical replaces)
export { ProgressBar, type ProgressBarProps, type ProgressBarSize } from './ProgressBar';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';

// NOTE: 13 of 14 "atoms" originally deferred to `_consumer-coupled/` were promoted to organisms in
// Phase 2 (2026-05-13) after lifting required hooks (useActiveSection · useScrollDirection · useHeroVisibility ·
// useSectionProgress · useScrollAnimation · useResponsiveGutter · useReadingProgress · useMagneticEffect)
// into core-v2/src/hooks/. See organisms/index.ts for the moved exports.
// FigmaButtonComparison stays in `_consumer-coupled/` — doc-page only · figma SVG imports · not a runtime atom.
