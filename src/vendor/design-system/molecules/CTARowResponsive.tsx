/**
 * CTARowResponsive — Molecule
 *
 * WHAT: 3-tier responsive CTA pair that changes button SIZE and LAYOUT at three breakpoints.
 *       — Mobile (<sm): stacked column, `size="sm"`, full-width stretch
 *       — Tablet (sm–md): horizontal row, `size="md"`, natural widths
 *       — Desktop (md+): horizontal row, `size="lg"`, natural widths
 *       Composes two Button atoms (primary + secondary) — no custom button logic.
 *
 * WHY: V0_lite HeroSection.tsx (L285-345) repeats this exact 3-tier visibility pattern every
 *      time a CTA pair appears. Three `<div>` blocks with `hidden sm:flex md:hidden` etc is
 *      visual noise. Extracting as a molecule keeps hero/section code readable.
 *      Fitts' Law — buttons grow on desktop where mouse targets are less precise.
 *
 * WHEN: Any section with a primary + secondary CTA pair that needs responsive sizing.
 *       Hero sections, chapter CTAs, FinalCTA blocks.
 *
 * WHEN NOT: Do NOT use for single-button CTAs — use Button directly.
 *           Do NOT use for navigation link pairs — use CTALink atoms.
 *           Do NOT use inside cards — card CTAs have their own sizing.
 *
 * WHERE: HeroSection left-column CTA area · FinalCTASection · chapter-level CTA rows.
 *
 * HOW:
 * ```tsx
 * import { FileText } from 'lucide-react';
 *
 * <CTARowResponsive
 *   primary={{
 *     label: 'Download Sample Report',
 *     onClick: () => console.log('primary'),
 *     animatedArrow: true,
 *   }}
 *   secondary={{
 *     label: 'Request Custom Report',
 *     icon: <FileText />,
 *     onClick: () => console.log('secondary'),
 *   }}
 * />
 *
 * // On dark background — ghost secondary
 * <CTARowResponsive
 *   background="dark"
 *   primary={{ label: 'Get Started', animatedArrow: true }}
 *   secondary={{ label: 'Learn More', href: '/about' }}
 * />
 * ```
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · HeroSection.tsx:285-345
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */
'use client';

import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { cn } from '../lib/cn';

export interface CTAButtonSpec {
  /** Button label text. */
  label: string;
  /** href — renders a plain anchor when provided (no router dep). */
  href?: string;
  /** Click handler. */
  onClick?: () => void;
  /** Show animated arrow on primary CTA. */
  animatedArrow?: boolean;
  /** Left-side icon (secondary CTA typically has a document/file icon). */
  icon?: ReactNode;
  /** Additional className on the button. */
  className?: string;
}

export interface CTARowResponsiveProps {
  /** Primary CTA — rendered as `variant="brand"` Button. */
  primary: CTAButtonSpec;
  /** Secondary CTA — rendered as `variant="secondary"` or `variant="ghost"` on dark. */
  secondary: CTAButtonSpec;
  /**
   * Surface background — controls secondary button variant.
   * "light" → secondary variant. "dark" → ghost variant.
   * @default 'light'
   */
  background?: 'light' | 'dark';
  /** Additional className on the root wrapper. */
  className?: string;
}

/**
 * CTARowResponsive
 *
 * 3-tier responsive CTA pair via visibility classes.
 * Uses 3 sibling div blocks: mobile / tablet / desktop — each hidden except its breakpoint.
 */
export function CTARowResponsive({
  primary,
  secondary,
  background = 'light',
  className,
}: CTARowResponsiveProps) {
  const secondaryVariant = background === 'dark' ? 'ghost' : 'secondary';

  const PrimaryBtn = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
    const btn = (
      <Button
        variant="brand"
        size={size}
        animatedArrow={primary.animatedArrow}
        onClick={primary.onClick}
        className={cn('font-sans font-bold', primary.className)}
      >
        {primary.label}
      </Button>
    );
    return primary.href ? (
      <a href={primary.href} className="contents">{btn}</a>
    ) : btn;
  };

  const SecondaryBtn = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
    const btn = (
      <Button
        variant={secondaryVariant}
        size={size}
        background={background}
        icon={secondary.icon}
        onClick={secondary.onClick}
        className={cn('font-sans font-medium', secondary.className)}
      >
        {secondary.label}
      </Button>
    );
    return secondary.href ? (
      <a href={secondary.href} className="contents">{btn}</a>
    ) : btn;
  };

  return (
    <div data-component="CTARowResponsive" className={cn('pt-2', className)}>
      {/* Mobile (<sm): stacked, full-width, sm size */}
      <div className="flex flex-col items-stretch gap-2 sm:hidden">
        <PrimaryBtn size="sm" />
        <SecondaryBtn size="sm" />
      </div>

      {/* Tablet (sm–md): side by side, md size */}
      <div className="hidden sm:flex md:hidden flex-row items-center gap-3">
        <PrimaryBtn size="md" />
        <SecondaryBtn size="md" />
      </div>

      {/* Desktop (md+): side by side, lg size */}
      <div className="hidden md:flex flex-row items-center gap-4">
        <PrimaryBtn size="lg" />
        <SecondaryBtn size="lg" />
      </div>
    </div>
  );
}
