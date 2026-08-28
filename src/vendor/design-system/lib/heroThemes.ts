/**
 * @module heroThemes
 *
 * WHO   Ken Research Design System · core-v2
 * WHAT  Canonical Hero Section multi-blob glow composition theme configs
 *       for 4 variants: darkPremium · light · warmEditorial · darkEmber.
 * WHY   Hero + CTA section backgrounds are NOT solid colors or simple gradients.
 *       They are multi-layer glow blob compositions — large blurred radial orbs
 *       layered over a base bg — expressing distinct design DNA per variant.
 *       This file is the single source of truth for those compositions so every
 *       consumer page pulls the same canonical pattern.
 * WHEN  Imported by HeroBackground atom + any page-level HeroSection organism
 *       that wants to render the layered bg composition.
 * HOW   Each variant defines: base background classes · decorative card blurs ·
 *       accent overlay colors · badge theming · an ordered glows[] array of
 *       Framer-Motion-ready blob descriptors (className + animate + transition).
 *       Blob colors reference var(--token) only — zero hex literals.
 *
 * @promotedFrom projects/V0_lite_report-legacy/src/app/components/heroThemes.ts
 * @promotedDate 2026-05-15
 * @canonical    true — do NOT edit the V0_lite source; maintain this file only
 */

import type { CSSProperties } from 'react';
import type { TargetAndTransition, Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Union of all available hero variant keys. */
export type HeroVariant = 'darkPremium' | 'light' | 'warmEditorial' | 'darkEmber';

/**
 * A single decorative glow blob descriptor — Framer Motion ready.
 * className positions + sizes the orb; animate + transition drive the pulse loop.
 * style is used when the color cannot be expressed as a Tailwind utility (rare).
 */
export interface GlowBlob {
  /** Tailwind utility classes: position · size · rounded · bg · blur · opacity */
  className: string;
  /** Framer Motion animate object — pass directly to <motion.div animate={…}> */
  animation: TargetAndTransition;
  /** Framer Motion transition object — pass directly to <motion.div transition={…}> */
  transition: Transition;
  /** Optional inline style overrides (e.g. color-mix() expressions not expressible in Tailwind) */
  style?: CSSProperties;
}

/**
 * Complete theme configuration for one Hero variant.
 * All color values are token references (var(--token)) or Tailwind utilities
 * that map to declared CSS custom properties — zero hardcoded hex.
 */
export interface HeroTheme {
  /** Display name for dev tooling / switcher UI */
  name: string;

  // --- Base surface ---

  /** Tailwind bg gradient or solid class for the outermost section element */
  background: string;
  /** Tailwind text color class for hero heading */
  textColor: string;
  /** Tailwind gradient-from/to classes for subtitle gradient text (space-separated) */
  subtitleGradient: string;
  /** Tailwind text color class for body/description copy */
  bodyText: string;
  /** Tailwind text class for stat numerals */
  statText: string;
  /** Tailwind text class for stat labels (includes group-hover variant) */
  statLabel: string;

  // --- Button / Badge surface ---

  /** Which Button background mode to apply — feeds into Button atom `background` prop */
  buttonBackground: 'light' | 'dark';
  /**
   * Badge variant shorthand (legacy mapping — prefer badgeTheme for new consumers).
   * @deprecated Use badgeTheme + badgeGlow instead.
   */
  badgeVariant: 'purple' | 'default';

  // --- Preview card surface ---

  /** Tailwind bg class for the in-hero preview card */
  previewCardBg: string;
  /** CSS border-color value for the preview card — use var(--token) or border-opacity tokens */
  previewCardBorder: string;
  /** Tailwind text class for text inside the preview card */
  previewCardText: string;

  // --- Decorative card accent blurs (inline card area) ---

  /** Tailwind bg utility class for top-right decorative blur behind card */
  cardDecorBlur1: string;
  /** Tailwind bg utility class for bottom-left decorative blur behind card */
  cardDecorBlur2: string;
  /** Tailwind bg class for accent content overlay bg (e.g. inline metric cards) */
  accentOverlayBg: string;
  /** CSS border-color value for accent overlays — use var(--token) */
  accentOverlayBorder: string;

  // --- Modal accent theming ---

  /** Tailwind bg class for the premium section inside the expanded preview modal */
  modalAccentBg: string;
  /** CSS border-color value for the modal premium section border */
  modalAccentBorder: string;
  /** CSS border-color value for the modal premium section border on hover */
  modalAccentBorderHover: string;

  // --- Badge theming ---

  /** Badge theme applied to PREMIUM CONTENT badges in this variant */
  badgeTheme: 'purple' | 'warm' | 'neutral' | 'brand';
  /** Tailwind shadow class for badge glow (matches badge theme colour family) */
  badgeGlow: string;
  /** True = continuous shimmer animation (light variants only) */
  badgeAutoShimmer: boolean;
  /** Optional inline styles for the badge — use only when gradient is unavoidable */
  badgeStyle?: CSSProperties;

  // --- Card decor opacity override ---

  /** Tailwind opacity class applied to cardDecorBlur elements (pure black bgs need higher opacity) */
  cardDecorOpacity: string;

  // --- Glow blob composition ---

  /**
   * Ordered array of decorative glow blobs.
   * Render each as a Framer <motion.div> with pointer-events-none + aria-hidden.
   * Animation may be empty ({}) for static blobs.
   */
  glows: GlowBlob[];
}

// ---------------------------------------------------------------------------
// Variant definitions
// NOTE on blob colors:
//   darkPremium/light: purple-family → bg-[var(--purple-600)] replaces bg-content-icon
//   light: bg-[var(--perano-500)] replaces bg-perano
//          bg-[var(--periwinkle-500)] replaces bg-periwinkle
//   warmEditorial: bg-[var(--coral-400)] replaces bg-coral-light (coral-400 = light coral)
//                  bg-[var(--perano-500)] replaces bg-perano
//                  bg-[var(--coral-400)] also replaces bg-orange-accent (closest warm ramp stop)
//   darkEmber: bg-[var(--coral-500)] replaces bg-coral
//              bg-[var(--coral-400)] replaces bg-coral-light
//              bg-[var(--amber-200)] replaces bg-amber-light (light golden warm)
//              bg-[var(--coral-400)] replaces bg-orange-accent
//
//   rgba() strings in border/overlay slots:
//   rgba(128,108,224,*) → purple-600 alpha: use color-mix(in srgb, var(--purple-600) X%, transparent)
//   rgba(249,155,133,*) → coral-500 alpha:  use color-mix(in srgb, var(--coral-500) X%, transparent)
//   rgba(255,255,255,*) → white alpha:      use var(--border-on-dark-card) etc where matching
//   rgba(0,0,0,*)       → black alpha:      use var(--border-card) etc where matching
// ---------------------------------------------------------------------------

export const heroThemes: Record<HeroVariant, HeroTheme> = {

  // --------------------------------------------------------------------------
  // darkPremium — pure black-to-gray gradient base, purple glow blobs (minimal)
  // --------------------------------------------------------------------------
  darkPremium: {
    name: "Dark Premium",

    // Base bg: dark diagonal gradient. Tailwind gradient classes reference
    // system neutral ramp (gray-800/700 = black-700/600 territory, compatible).
    background: "bg-gradient-to-br from-black via-gray-800 to-gray-700",

    textColor: "text-white",
    subtitleGradient: "from-white to-white/70",
    bodyText: "text-white/70",
    statText: "text-white",
    statLabel: "text-white/50 group-hover:text-white/70",
    buttonBackground: "dark",
    badgeVariant: "default",

    previewCardBg: "bg-white/5",
    // white at 10% opacity — matches --border-on-dark-card
    previewCardBorder: "var(--border-on-dark-card)",
    previewCardText: "text-white/90",

    // purple-600 for card decor blobs
    cardDecorBlur1: "bg-[var(--purple-600)]",
    cardDecorBlur2: "bg-[var(--periwinkle-500)]",

    // purple-600 at 5% and 20% opacity
    accentOverlayBg: "bg-[color-mix(in_srgb,var(--purple-600)_5%,transparent)]",
    accentOverlayBorder: "color-mix(in srgb, var(--purple-600) 20%, transparent)",
    modalAccentBg: "bg-[color-mix(in_srgb,var(--purple-600)_5%,transparent)]",
    modalAccentBorder: "color-mix(in srgb, var(--purple-600) 20%, transparent)",
    modalAccentBorderHover: "color-mix(in srgb, var(--purple-600) 40%, transparent)",

    badgeTheme: "purple",
    badgeGlow: "shadow-md shadow-black/15",
    badgeAutoShimmer: false,

    cardDecorOpacity: "opacity-[0.10]",

    glows: [
      {
        // Top-right: purple-600 orb, bleeds off corner, ultra-subtle (3% opacity)
        className: "absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--purple-600)] blur-3xl opacity-[0.03]",
        animation: { scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] },
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      },
      {
        // Bottom-left: periwinkle-500 orb, soft diagonal counterpart (3% opacity)
        className: "absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--periwinkle-500)] blur-3xl opacity-[0.03]",
        animation: { scale: [1, 1.3, 1], opacity: [0.03, 0.05, 0.03] },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }
      },
      {
        // Center: transparent placeholder — keeps blob array length consistent for consumers
        className: "absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent blur-3xl",
        animation: { opacity: [0, 0, 0] },
        transition: { duration: 1 }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // light — white/off-white base, vibrant perano + periwinkle blobs
  // --------------------------------------------------------------------------
  light: {
    name: "Light",

    // Base bg: white to periwinkle-50 tint (barely perceptible blush)
    background: "bg-gradient-to-br from-white via-white to-[var(--periwinkle-50)]",

    textColor: "text-black",
    // Subtitle gradient: purple-600 to black — expressed via CSS var
    subtitleGradient: "from-[var(--purple-600)] to-black",
    bodyText: "text-[var(--black-500)]",
    statText: "text-black",
    statLabel: "text-[var(--black-500)] group-hover:text-[var(--black-600)]",
    buttonBackground: "light",
    badgeVariant: "purple",

    previewCardBg: "bg-white/80",
    // black at 10% opacity — matches --border-section
    previewCardBorder: "var(--border-section)",
    previewCardText: "text-black/90",

    cardDecorBlur1: "bg-[var(--perano-500)]",
    cardDecorBlur2: "bg-[var(--periwinkle-500)]",

    // purple-600 at 5% and 20% opacity — same semantics as darkPremium overlay
    accentOverlayBg: "bg-[color-mix(in_srgb,var(--purple-600)_5%,transparent)]",
    accentOverlayBorder: "color-mix(in srgb, var(--purple-600) 20%, transparent)",
    modalAccentBg: "bg-[color-mix(in_srgb,var(--purple-600)_5%,transparent)]",
    modalAccentBorder: "color-mix(in srgb, var(--purple-600) 20%, transparent)",
    modalAccentBorderHover: "color-mix(in srgb, var(--purple-600) 40%, transparent)",

    badgeTheme: "purple",
    // Dark-bg badge on light page — styled via inline badgeStyle
    badgeGlow: "!text-white !border-[var(--black-800)] shadow-xl shadow-black/30",
    badgeAutoShimmer: true,
    // gradient expressed as inline style — color-mix() in gradient not yet universally supported
    badgeStyle: { background: "linear-gradient(135deg, var(--black-900), var(--black-900), var(--black-900))" },

    cardDecorOpacity: "opacity-[0.10]",

    glows: [
      {
        // Top-right: perano-500 (cool sky blue), large diffused corner bleed
        // Provides cool ambient light on the card side
        className: "absolute -right-16 -top-24 h-[480px] w-[480px] rounded-full bg-[var(--perano-500)] blur-[100px]",
        animation: { scale: [1, 1.12, 1], opacity: [0.35, 0.50, 0.35] },
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      },
      {
        // Bottom-left: periwinkle-500 (medium purple-blue), diagonal tension with blob 1
        className: "absolute -bottom-20 -left-16 h-[420px] w-[420px] rounded-full bg-[var(--periwinkle-500)] blur-[100px]",
        animation: { scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }
      },
      {
        // Center-right: purple-600 (deep purple), subtle halo behind card area
        // Gives the preview card a "lit from behind" depth effect
        className: "absolute top-1/3 right-[15%] h-[300px] w-[450px] rounded-full bg-[var(--purple-600)] blur-[120px]",
        animation: { opacity: [0.04, 0.07, 0.04], scale: [1, 1.05, 1] },
        transition: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // warmEditorial — warm-100 base, coral + perano blobs — editorial warmth
  // --------------------------------------------------------------------------
  warmEditorial: {
    name: "Warm Editorial",

    // Base bg: warm-100 to warm-50 to white — editorial signature palette
    background: "bg-gradient-to-br from-[var(--warm-100)] via-[var(--warm-50)] to-white",

    textColor: "text-black",
    // Subtitle: coral-500 to black
    subtitleGradient: "from-[var(--coral-500)] to-black",
    bodyText: "text-[var(--black-500)]",
    statText: "text-black",
    statLabel: "text-[var(--black-500)] group-hover:text-[var(--black-600)]",
    buttonBackground: "light",
    badgeVariant: "purple",

    previewCardBg: "bg-white/90",
    // black at 6% — hairline card border on warm bg
    previewCardBorder: "var(--border-hairline)",
    previewCardText: "text-black/90",

    // coral-400 is the light coral ("coral-light" in legacy code)
    cardDecorBlur1: "bg-[var(--coral-400)]",
    cardDecorBlur2: "bg-[var(--perano-500)]",

    // coral-500 at 5% and 15%
    accentOverlayBg: "bg-[color-mix(in_srgb,var(--coral-500)_5%,transparent)]",
    accentOverlayBorder: "color-mix(in srgb, var(--coral-500) 15%, transparent)",
    modalAccentBg: "bg-[color-mix(in_srgb,var(--coral-500)_5%,transparent)]",
    modalAccentBorder: "color-mix(in srgb, var(--coral-500) 15%, transparent)",
    modalAccentBorderHover: "color-mix(in srgb, var(--coral-500) 30%, transparent)",

    badgeTheme: "purple",
    badgeGlow: "!text-white !border-[var(--black-800)] shadow-xl shadow-black/30",
    badgeAutoShimmer: true,
    badgeStyle: { background: "linear-gradient(135deg, var(--black-900), var(--black-900), var(--black-900))" },

    cardDecorOpacity: "opacity-[0.10]",

    glows: [
      {
        // Top-left: coral-400 (light coral) — warm editorial anchor
        // Echoes BannerSection dark's coral orbs and ReportHighlights warm glow
        className: "absolute -left-12 -top-20 h-[450px] w-[500px] rounded-full bg-[var(--coral-400)] blur-[120px]",
        animation: { scale: [1, 1.1, 1], opacity: [0.10, 0.16, 0.10] },
        transition: { duration: 9, repeat: Infinity, ease: "easeInOut" }
      },
      {
        // Bottom-right: perano-500, periwinkle washed blue
        // Barely-there cool accent that doesn't compete with warmth
        className: "absolute -bottom-16 -right-12 h-[420px] w-[420px] rounded-full bg-[var(--perano-500)] blur-[120px]",
        animation: { scale: [1, 1.12, 1], opacity: [0.15, 0.22, 0.15] },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
      },
      {
        // Center: coral-400 haze bridging the two zones
        // Echoes ReportHighlights subtle coral radial glow
        // (legacy used bg-orange-accent which maps to coral-400 — lightest warm ramp step w/ hue)
        className: "absolute top-[40%] left-[35%] h-[350px] w-[500px] rounded-full bg-[var(--coral-400)] blur-[130px]",
        animation: { opacity: [0.06, 0.10, 0.06], scale: [1, 1.06, 1] },
        transition: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // darkEmber — pure black base, coral + amber blob field, no animation (static)
  // --------------------------------------------------------------------------
  darkEmber: {
    name: "Dark Ember",

    background: "bg-black",

    textColor: "text-white",
    // coral-400 to white/70 — warm ember gradient
    subtitleGradient: "from-[var(--coral-400)] to-white/70",
    bodyText: "text-white/70",
    statText: "text-white",
    statLabel: "text-white/50 group-hover:text-white/70",
    buttonBackground: "dark",
    badgeVariant: "default",

    previewCardBg: "bg-white/5",
    // coral-500 at 10% — warm border tint on card
    previewCardBorder: "color-mix(in srgb, var(--coral-500) 10%, transparent)",
    previewCardText: "text-white/90",

    // coral-500 for primary decor blob; coral-400 for secondary
    cardDecorBlur1: "bg-[var(--coral-500)]",
    cardDecorBlur2: "bg-[var(--amber-200)]",

    // coral-500 at 5% and 12%
    accentOverlayBg: "bg-[color-mix(in_srgb,var(--coral-500)_5%,transparent)]",
    accentOverlayBorder: "color-mix(in srgb, var(--coral-500) 12%, transparent)",
    modalAccentBg: "bg-[color-mix(in_srgb,var(--coral-500)_5%,transparent)]",
    modalAccentBorder: "color-mix(in srgb, var(--coral-500) 12%, transparent)",
    modalAccentBorderHover: "color-mix(in srgb, var(--coral-500) 24%, transparent)",

    badgeTheme: "purple",
    badgeGlow: "shadow-md shadow-black/15",
    badgeAutoShimmer: false,

    cardDecorOpacity: "opacity-[0.18]",

    glows: [
      {
        // Primary coral: top-left, large diffused wash — warm side anchor
        // coral-500 at 10% opacity, 160px blur, 650px orb
        className: "absolute -left-24 -top-20 h-[650px] w-[650px] rounded-full bg-[var(--coral-500)] opacity-[0.10] blur-[160px]",
        animation: {},
        transition: {}
      },
      {
        // Coral-400 (light coral): upper-right, softer illuminating card area
        // coral-400 at 6% opacity, 140px blur, 500px orb
        className: "absolute -top-12 -right-16 h-[500px] w-[500px] rounded-full bg-[var(--coral-400)] opacity-[0.06] blur-[140px]",
        animation: {},
        transition: {}
      },
      {
        // Amber-200 (light gold): bottom-right, golden warmth for lower card zone
        // amber-200 at 6% opacity, 160px blur, 550px orb
        className: "absolute -bottom-24 -right-20 h-[550px] w-[550px] rounded-full bg-[var(--amber-200)] opacity-[0.06] blur-[160px]",
        animation: {},
        transition: {}
      },
      {
        // Coral-400 center bridge: blends coral and amber into continuous ember field
        // coral-400 at 5% opacity, 180px blur, wide 600×400 ellipse
        className: "absolute top-[35%] left-[30%] h-[400px] w-[600px] rounded-full bg-[var(--coral-400)] opacity-[0.05] blur-[180px]",
        animation: {},
        transition: {}
      },
      {
        // Deep coral secondary: bottom-left, ember depth
        // coral-500 at 5% opacity, 140px blur, 400px orb
        className: "absolute -bottom-16 -left-12 h-[400px] w-[400px] rounded-full bg-[var(--coral-500)] opacity-[0.05] blur-[140px]",
        animation: {},
        transition: {}
      }
    ]
  }
};

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

/**
 * Get theme configuration by variant key.
 *
 * @param variant - One of 'darkPremium' | 'light' | 'warmEditorial' | 'darkEmber'
 * @returns The full HeroTheme config for that variant
 */
export function getHeroTheme(variant: HeroVariant): HeroTheme {
  return heroThemes[variant];
}

/**
 * Get all available hero variant keys in declaration order.
 *
 * @returns Array of all HeroVariant keys
 */
export function getAllHeroVariants(): HeroVariant[] {
  return Object.keys(heroThemes) as HeroVariant[];
}
