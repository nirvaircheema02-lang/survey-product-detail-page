/**
 * @barrel lib
 *
 * Public exports from the core-v2 lib utilities.
 * Import from this barrel rather than direct file paths:
 *   import { cn } from '@kenresearch/design-system/lib'
 *   import { getHeroTheme, type HeroVariant } from '@kenresearch/design-system/lib'
 */

export { cn } from './cn';
export { cva, type VariantProps } from './variants';

// Hero section multi-blob glow composition theme configs (§16 · 2026-05-15)
export {
  heroThemes,
  getHeroTheme,
  getAllHeroVariants,
  type HeroVariant,
  type HeroTheme,
  type GlowBlob,
} from './heroThemes';

// CTA section multi-blob glow composition theme configs (§16 · 2026-05-15)
export {
  ctaThemes,
  getCTATheme,
  type CTAVariant,
  type CTATheme,
  type CTABlob,
  type CTANoiseConfig,
} from './ctaThemes';
