// TODO (Step 9.5): Implement SectionBg pattern component
// Orchestrates section background variants per recipe alternation sequence.
// HARD GATE: same bg twice in sequence = wrong build (aura-qa asserts via getComputedStyle).
//
// Variant map:
//   'primary'  -> var(--section-bg-primary)  = white   (#ffffff)
//   'accent'   -> var(--section-bg-accent)   = warm    (#f5f2f1)
//   'contrast' -> var(--section-bg-contrast) = black   (#000000)
//
// Pattern overlay (optional):
//   'mesh'       -> DarkGradientMesh (contrast only)
//   'fade-mask'  -> .mask-fade-bottom utility
//   'glass'      -> .glass or .glass-dark utility

export type SectionBgVariant = 'primary' | 'accent' | 'contrast';
export type SectionBgPattern = 'mesh' | 'fade-mask' | 'glass' | undefined;

export interface SectionBgProps {
  variant: SectionBgVariant;
  pattern?: SectionBgPattern;
  className?: string;
  children?: React.ReactNode;
}

// Stub — returns null until Step 9.5 populates implementation
export const SectionBg = (_props: SectionBgProps): null => null;
