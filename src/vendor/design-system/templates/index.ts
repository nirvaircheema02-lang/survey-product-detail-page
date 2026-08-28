// Templates barrel — Tier 4 · greenfield composition shells
// Batch 3.3e · 2026-05-19 · aura-builder
//
// Templates are COMPOSITION SHELLS — they accept slot/content props and
// compose existing atoms + molecules + organisms. They do NOT re-implement
// primitives. Import from subpath for tree-shaking:
//   import { ChapterSectionTemplate } from '@kenresearch/design-system/templates'

// DEFAULT chapter section recipe — sections 3-27 on report PDP
export { ChapterSectionTemplate, type ChapterSectionTemplateProps, type ChapterBg } from './ChapterSectionTemplate';

// HERO variants — cinematic dark + editorial light
export { HeroCinematicTemplate, type HeroCinematicTemplateProps } from './HeroCinematicTemplate';
export { HeroEditorialTemplate, type HeroEditorialTemplateProps } from './HeroEditorialTemplate';

// PAGE-SHELL templates — full page chrome layouts
export { PDPLayoutTemplate, type PDPLayoutTemplateProps } from './PDPLayoutTemplate';
export { ListingPageTemplate, type ListingPageTemplateProps } from './ListingPageTemplate';

// DATA VISUALISATION recipe — chart + table 2-col
export { DataChartTemplate, type DataChartTemplateProps, type ChartSlotProps, type DataChartBg } from './DataChartTemplate';

// CARD GRID recipe — 2/3/2 staggered segmentation grid
export {
  MultiCardGridTemplate,
  type MultiCardGridTemplateProps,
  type MultiCardBg,
  type MultiCardTakeawayItem,
  type MultiCardItem,
} from './MultiCardGridTemplate';

// ACCORDION LIST recipe — FAQ / definitions / TOC reference
export {
  AccordionListTemplate,
  type AccordionListTemplateProps,
  type AccordionListItem,
  type AccordionBg,
} from './AccordionListTemplate';

// STEPPER + GRID recipe — methodology section
export {
  StepperPlusGridTemplate,
  type StepperPlusGridTemplateProps,
  type MethodologyStep,
  type StepperBg,
} from './StepperPlusGridTemplate';
