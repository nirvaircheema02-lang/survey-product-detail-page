/**
 * CustomResearchCTA — Organism (DS v4.3 · Phase 3 adapter)
 *
 * WHAT: Report Store–specific CTA banner wrapping CTABanner with RS copy.
 * WHY:  Encapsulates the final CTA configuration.
 * WHEN: Section 8 of ReportStorePage (Home mode), or bottom of listing page.
 * HOW:  Thin wrapper around CTABanner. Accepts copy via props w/ sensible defaults.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import { CTABanner } from './CTABanner';

export interface CustomResearchCTAProps {
  label?: string;
  title?: string;
  subtitle?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function CustomResearchCTA({
  label = 'Custom Research',
  title = "Need research that doesn't exist yet?",
  subtitle = 'Our analysts build custom studies tailored to your strategic questions',
  primaryText = 'Request custom research',
  secondaryText = 'Talk to an analyst',
  onPrimaryClick,
  onSecondaryClick,
}: CustomResearchCTAProps) {
  return (
    <CTABanner
      data-component="CustomResearchCTA"
      label={label}
      title={title}
      subtitle={subtitle}
      primaryText={primaryText}
      primaryShowArrow
      secondaryText={secondaryText}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
    />
  );
}
