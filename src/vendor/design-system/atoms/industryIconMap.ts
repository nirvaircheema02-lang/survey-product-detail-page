/**
 * industryIconMap — Utility (DS v4.3 · DS Port Phase 3, 2026-05-13)
 *
 * WHY: Centralises the industry → icon relationship so organisms
 *      (IndustrySectorsGrid · ReportStoreHero · BrowseGrid) render
 *      consistent icons per industry without each duplicating a mapping.
 * WHAT: Map<industry label, LucideIcon> + safe getter w/ Cpu fallback.
 * WHEN: Any organism that renders an icon per industry label.
 * WHEN NOT: Don't add UI/nav icons here (use lucide directly).
 * HOW: Import map · or call `getIndustryIcon(label)` for safe fallback.
 *
 * ICON COLORS: Use iconColors.content (#806ce0) for content icons,
 *              iconColors.utility (#737373) for UI/nav icons. See iconColors.ts.
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Phase 3, 2026-05-13)
 */
import {
  Cpu,
  Stethoscope,
  Zap,
  Landmark,
  Car,
  Plane,
  ShoppingCart,
  Wheat,
  Shield,
  Gem,
  GraduationCap,
  UtensilsCrossed,
  Factory,
  Film,
  FlaskConical,
  Building2,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export const industryIconMap: Record<string, LucideIcon> = {
  // ── Primary (short names) ──
  'Technology': Cpu,
  'Healthcare': Stethoscope,
  'Energy': Zap,
  'Financial Services': Landmark,
  'Automotive': Car,
  'Aerospace': Plane,
  'Logistics': Truck,
  'Agriculture': Wheat,
  'Cybersecurity': Shield,
  'Materials': Gem,

  // ── Extended (FULL_INDUSTRIES labels) ──
  'Technology & Telecom': Cpu,
  'Healthcare & Life Sciences': Stethoscope,
  'Energy & Utilities': Zap,
  'Banking & Financial Services': Landmark,
  'Automotive & Transportation': Car,
  'Defense & Security': Shield,
  'Consumer & Retail': ShoppingCart,
  'Education & Training': GraduationCap,
  'Food & Beverage': UtensilsCrossed,
  'Manufacturing': Factory,
  'Media & Entertainment': Film,
  'Mining & Chemicals': FlaskConical,
  'Public Sector': Building2,
};

/**
 * Safe getter — returns Cpu fallback if no mapping exists.
 */
export function getIndustryIcon(industry: string): LucideIcon {
  return industryIconMap[industry] ?? Cpu;
}
