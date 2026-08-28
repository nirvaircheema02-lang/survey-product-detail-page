// TODO (Step 9.5): Implement CarouselFadeMask pattern component
// Source: design-system/core/src/app/components/ChallengesSection.tsx
// Purpose: Overflow hint for horizontal card carousels via gradient fade masks.
// CRITICAL: mask color MUST match parent section bg — mismatch = hard line artifact.
//   Warm section:  linear-gradient(to right/left, #f5f2f1, transparent)
//   White section: linear-gradient(to right/left, #ffffff, transparent)
//   Black section: linear-gradient(to right/left, #000000, transparent)
// Use CSS var (--section-bg-current) to auto-match parent via CSS custom property inheritance.

export interface CarouselFadeMaskProps {
  side?: 'left' | 'right' | 'both';
  className?: string;
  children?: React.ReactNode;
}

// Stub — returns null until Step 9.5 populates implementation
export const CarouselFadeMask = (_props: CarouselFadeMaskProps): null => null;
