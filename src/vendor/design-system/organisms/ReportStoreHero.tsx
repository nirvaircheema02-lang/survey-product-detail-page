/**
 * ReportStoreHero — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Report Store hero section wrapping ProductHero with RS-specific defaults.
 * WHY:  Encapsulates the hero configuration so the template doesn't inline props.
 * WHEN: Top of ReportStorePage (Home mode).
 * HOW:  Accepts copy + badges via props w/ sensible defaults.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { ProductHero } from './ProductHero';

export interface ReportStoreHeroProps {
  label?: string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  badges?: string[];
}

export function ReportStoreHero({
  label = 'Report Store',
  title = 'Premium market intelligence on demand',
  subtitle = 'Search 1M+ reports across industries, regions, and time horizons. Updated quarterly by Ken analysts.',
  searchPlaceholder = 'Search reports, industries, regions...',
  badges = ['1M+ reports', '50+ industries', '6 regions', 'Updated quarterly'],
}: ReportStoreHeroProps) {
  return (
    <ProductHero
      data-component="ReportStoreHero"
      label={label}
      title={title}
      subtitle={subtitle}
      searchPlaceholder={searchPlaceholder}
      badges={badges}
    />
  );
}
