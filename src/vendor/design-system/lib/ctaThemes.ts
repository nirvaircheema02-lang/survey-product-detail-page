/**
 * @module ctaThemes
 *
 * WHO   Ken Research Design System · core-v2
 * WHAT  Canonical CTA Section background composition configs for 2 variants:
 *       dark · light (1:1 mirror relationship — dark is primary, light inverses it).
 * WHY   CTA sections use the same multi-layer blob composition pattern as Hero
 *       sections but with a different palette emphasis (coral + orange warmth)
 *       and an added noise overlay + edge vignette layer. Extracting this config
 *       keeps CTABackground.tsx render-only and tokens canonical in one place.
 * WHEN  Imported by CTABackground atom + any page-level CTASection organism.
 * HOW   Each variant defines: base bg classes · an ordered blobs[] array ·
 *       noise overlay config · edge vignette · top hairline glow.
 *       All colors are var(--token) — zero hex literals.
 *       The dark/light pairing mirrors each blob slot 1:1:
 *         dark blob 1 (coral/10) ↔ light blob 1 (warm-400/60)
 *         dark blob 2 (coral-400/8) ↔ light blob 2 (perano-300/50)
 *         dark blob 3 (coral-400/7) ↔ light blob 3 (coral-200/45)
 *         dark blob 4 (brand-red/6) ↔ light blob 4 (warm-300/40)
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/CTASection.tsx (L18-83)
 * @promotedDate 2026-05-15
 * @canonical    true — maintain this file; do NOT edit the V0_lite source
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** CTA variant keys. */
export type CTAVariant = 'dark' | 'light';

/**
 * A single decorative blob layer in the CTA section background.
 * Rendered as an absolutely-positioned div — pointer-events-none + aria-hidden.
 */
export interface CTABlob {
  /**
   * Tailwind utility classes: absolute position · size · rounded-full ·
   * bg-[var(--token)] · opacity · blur · translate
   */
  className: string;
}

/**
 * Noise overlay config — SVG feTurbulence grain at very low opacity
 * composited with mix-blend-overlay for cinematic film-grain texture.
 */
export interface CTANoiseConfig {
  /** Tailwind + inline style classes for the noise layer container */
  className: string;
  /** backgroundImage data-URI for the SVG feTurbulence filter */
  backgroundImage: string;
  /** CSS backgroundRepeat value */
  backgroundRepeat: string;
  /** CSS backgroundSize value */
  backgroundSize: string;
}

/**
 * Complete background composition for one CTA variant.
 * Render in order: baseClasses on section → gradient overlay → blobs[] →
 * noise → vignette → topHairline.
 */
export interface CTATheme {
  /** Display label */
  name: string;

  /** Tailwind classes applied to the outermost <section> element */
  baseClasses: string;

  /**
   * Full-inset gradient overlay div.
   * For dark: from-coral/12 to-orange-accent/10 diagonal.
   * For light: coral-100 to white to perano-200 diagonal.
   */
  gradientOverlay: string;

  /** Ordered array of blob layers — render in index order, all pointer-events-none */
  blobs: CTABlob[];

  /** Grain texture overlay — renders above blobs, below vignette */
  noise: CTANoiseConfig;

  /**
   * Edge vignette div.
   * Dark: radial-gradient to black/15 at edges.
   * Light: radial-gradient to warm-200/40 at edges.
   */
  vignette: string;

  /**
   * Top 1px horizontal hairline gradient — decorative section separator.
   * Dark: via coral-500/30.
   * Light: via coral-300/30.
   */
  topHairline: string;
}

// ---------------------------------------------------------------------------
// Noise SVG data-URI (identical for both variants — same grain, different context)
// SVG feTurbulence fractal noise · opacity 0.02 · mix-blend-overlay
// ---------------------------------------------------------------------------

// Shared noise data-URI extracted as constant to avoid duplication
const NOISE_SVG_URI =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

export const ctaThemes: Record<CTAVariant, CTATheme> = {

  // --------------------------------------------------------------------------
  // dark — pure black-to-gray base, coral ember blob field
  // --------------------------------------------------------------------------
  dark: {
    name: "Dark",

    // Section base: black diagonal gradient
    baseClasses: "bg-gradient-to-br from-black via-gray-800 to-black",

    // Full-inset gradient overlay: coral tint TL to orange-accent tint TR
    // coral-500 at 12%; coral-400 at 10%
    gradientOverlay:
      "absolute inset-0 bg-gradient-to-tr from-[color-mix(in_srgb,var(--coral-500)_12%,transparent)] via-transparent to-[color-mix(in_srgb,var(--coral-400)_10%,transparent)]",

    blobs: [
      {
        // Top-left: coral-500 at 10% opacity, 600px orb, -50% translated off corner
        className:
          "absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[var(--coral-500)] opacity-[0.10] blur-[140px] -translate-x-1/2 -translate-y-1/2"
      },
      {
        // Bottom-right: coral-400 (orange-accent proxy) at 8% opacity, 700px orb
        className:
          "absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-[var(--coral-400)] opacity-[0.08] blur-[160px] translate-x-1/2 translate-y-1/2"
      },
      {
        // Mid-right: coral-400 (light coral) at 7% opacity, 400px orb
        className:
          "absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--coral-400)] opacity-[0.07] blur-[120px]"
      },
      {
        // Mid-left: brand-red at 6% opacity, 500px orb
        // brand-red reserved for CTAs — here used as a 6% ghost tint for ember depth
        className:
          "absolute bottom-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[var(--brand-red)] opacity-[0.06] blur-[150px]"
      }
    ],

    noise: {
      className: "absolute inset-0 opacity-[0.02] mix-blend-overlay",
      backgroundImage: NOISE_SVG_URI,
      backgroundRepeat: "repeat",
      backgroundSize: "200px 200px"
    },

    // Radial vignette — darkens edges toward black
    vignette:
      "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.15)_100%)]",

    // Top hairline: coral-500 at 30%
    topHairline:
      "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--coral-500)_30%,transparent)] to-transparent"
  },

  // --------------------------------------------------------------------------
  // light — white base, warm/perano blob field (mirrors dark 1:1 per slot)
  // --------------------------------------------------------------------------
  light: {
    name: "Light",

    // Section base: pure white
    baseClasses: "bg-white",

    // Full-inset gradient overlay: coral-100 TL to white mid to perano-200 TR
    gradientOverlay:
      "absolute inset-0 bg-gradient-to-tr from-[var(--coral-100)] via-white to-[var(--perano-200)]",

    blobs: [
      {
        // Top-left: warm-400 at 60% opacity, 600px orb (mirrors dark coral/10)
        className:
          "absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[var(--warm-400)] opacity-60 blur-[140px] -translate-x-1/2 -translate-y-1/2"
      },
      {
        // Bottom-right: perano-300 at 50% opacity, 700px orb (mirrors dark orange-accent/8)
        className:
          "absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-[var(--perano-300)] opacity-50 blur-[160px] translate-x-1/2 translate-y-1/2"
      },
      {
        // Mid-right: coral-200 at 45% opacity, 400px orb (mirrors dark coral-light/7)
        className:
          "absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--coral-200)] opacity-45 blur-[120px]"
      },
      {
        // Mid-left: warm-300 at 40% opacity, 500px orb (mirrors dark brand-red/6 slot)
        className:
          "absolute bottom-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[var(--warm-300)] opacity-40 blur-[150px]"
      }
    ],

    noise: {
      className: "absolute inset-0 opacity-[0.02] mix-blend-overlay",
      backgroundImage: NOISE_SVG_URI,
      backgroundRepeat: "repeat",
      backgroundSize: "200px 200px"
    },

    // Radial vignette — warm-200 tint at edges (dark analog: to-black/15)
    vignette:
      "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,color-mix(in_srgb,var(--warm-200)_40%,transparent)_100%)]",

    // Top hairline: coral-300 at 30%
    topHairline:
      "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--coral-300)_30%,transparent)] to-transparent"
  }
};

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

/**
 * Get CTA theme configuration by variant key.
 *
 * @param variant - 'dark' | 'light'
 * @returns The full CTATheme config for that variant
 */
export function getCTATheme(variant: CTAVariant): CTATheme {
  return ctaThemes[variant];
}
