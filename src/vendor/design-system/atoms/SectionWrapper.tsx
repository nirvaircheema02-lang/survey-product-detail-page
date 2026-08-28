/**
 * SectionWrapper
 *
 * WHY · Every page section needs consistent vertical rhythm + container + bg alternation.
 *       Inline `<section className="py-N max-w-N bg-N">` causes drift (Cat 4.2 + 4.3 anti-patterns).
 * WHAT · `<section>` with spacing (sm/md/lg/xl) · maxWidth (content/wide/full) ·
 *        background (white/warm/black/periwinkle/coral/mesh) · optional `id` for anchor scroll.
 *        Bg applied via inline style (not Tailwind arbitrary var) to avoid v4 JIT silently producing transparent.
 * WHEN · Every top-level section in any page. Apply per recipe alternation sequence (white → warm → white → black).
 * WHEN NOT · Never double-wrap — one SectionWrapper per organism (Cat 4.5 · double-padding bug).
 *            Never pass inline `style={{ background }}` — use `background` prop.
 * WHERE · All case-study organisms · report-store page sections · V0_lite_report HeroSection container.
 * HOW ·
 *   ```tsx
 *   // Standard warm break section
 *   <SectionWrapper background="warm" spacing="lg" id="challenges">
 *     <ChallengesSection challenges={data} />
 *   </SectionWrapper>
 *   // Cinematic dark hero (mesh activates cinematic gradient via data-variant-section)
 *   <SectionWrapper background="mesh" spacing="xl">
 *     <HeroSection />
 *   </SectionWrapper>
 *   ```
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report
 */
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type SectionBackground = 'white' | 'warm' | 'black' | 'periwinkle' | 'coral' | 'mesh';
export type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl';
export type SectionMaxWidth = 'content' | 'wide' | 'full';

export interface SectionWrapperProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  background?: SectionBackground;
  spacing?: SectionSpacing;
  maxWidth?: SectionMaxWidth;
  borderTop?: boolean;
  className?: string;
  id?: string;
}

// Text color classes only — backgrounds applied via inline style to avoid Tailwind v4
// arbitrary var() limitation (bg-[var(--token)] silently becomes transparent in v4 JIT).
// Background color is applied via bgStyle map below. (LEARNINGS 2026-05-11)
const textClass: Record<SectionBackground, string> = {
  white:      'text-[var(--color-foundation-black)]',
  warm:       'text-[var(--color-foundation-black)]',
  black:      'text-[var(--color-foundation-white)]',
  periwinkle: 'text-[var(--color-foundation-black)]',
  coral:      'text-[var(--color-foundation-black)]',
  mesh:       'text-[var(--color-foundation-white)]', // mesh bg supplied by [data-variant-section="cinematic"]
};

const bgStyle: Record<SectionBackground, string | undefined> = {
  white:      'var(--color-foundation-white)',
  warm:       'var(--color-ramp-warm-300)',
  black:      'var(--color-foundation-black)',
  periwinkle: 'var(--color-ramp-periwinkle-200)',
  coral:      'var(--color-ramp-coral-50)',
  mesh:       undefined, // mesh bg from cinematic data-variant-section CSS
};

const spacingClass: Record<SectionSpacing, string> = {
  sm: 'py-8 md:py-12',   // 32 / 48
  md: 'py-10 md:py-16',  // 40 / 64
  lg: 'py-12 md:py-20',  // 48 / 80
  xl: 'py-16 md:py-24',  // 64 / 96
};

const maxWidthClass: Record<SectionMaxWidth, string> = {
  content: 'max-w-[var(--container-content)]', // 1000px
  wide:    'max-w-[var(--container-page)]',    // 1200px
  full:    'max-w-full',
};

/**
 * SectionWrapper — page section primitive w/ recipe alternation backgrounds.
 *
 * WHY: Every page section needs consistent vertical rhythm (spacing) · container width · bg alternation.
 *      Inline `<section className="py-N max-w-N bg-N">` = drift (Cat 4.2 + 4.3 anti-patterns).
 * WHAT: Renders `<section>` w/ spacing (sm/md/lg/xl/2xl) · maxWidth (page/content/narrow/prose/compact) ·
 *      background (white/warm/black/mesh) · optional `id` for anchor scroll.
 * WHEN: Every top-level section in any page · alternation per recipe (white → warm → white → black pattern).
 * WHEN NOT: Never wrap an organism in another SectionWrapper (Cat 4.5 · double-padding bug).
 *      Never pass inline `style={{ background }}` — always use `background` prop.
 * HOW: Aura-qa samples computed bg per section + asserts alternation HARD GATE.
 *      `background="mesh"` activates cinematic dark gradient via `data-variant-section="cinematic"` (hero/resources only).
 *
 * @promotedFrom V0_lite_report
 */
export function SectionWrapper({
  children,
  background = 'white',
  spacing = 'lg',
  maxWidth = 'wide',
  borderTop = false,
  className,
  id,
  ...rest
}: SectionWrapperProps) {
  return (
    <section
      data-component="SectionWrapper"
      id={id}
      data-section-bg={background}
      data-variant-section={background === 'mesh' ? 'cinematic' : undefined}
      {...rest}
      style={bgStyle[background] ? { backgroundColor: bgStyle[background] } : undefined}
      className={cn(
        textClass[background],
        spacingClass[spacing],
        borderTop && 'border-t border-[var(--border-default)]',
        className,
      )}
    >
      <div className={cn(maxWidthClass[maxWidth], 'mx-auto px-4 sm:px-6 md:px-8 relative z-[1]')}>
        {children}
      </div>
    </section>
  );
}
