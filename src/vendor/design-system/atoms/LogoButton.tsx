import type { ReactNode } from 'react';

export interface LogoButtonProps {
  /** Click handler · used when no href provided · button affordance */
  onClick?: () => void;
  /** Optional href · when set · renders as `<a>` instead of `<button>` (proper home-link semantics) · added Batch 3.3b */
  href?: string;
  children: ReactNode;
  ariaLabel?: string;
}

/**
 * LogoButton — clickable wrapper around the Ken logo · subtle hover scale · accessible focus ring.
 *
 * WHY:
 * - Logo in nav must be tappable (returns to home) — semantic `<button>` not `<div>`
 * - Logo SVG itself stays decorative · LogoButton owns the focus + click affordance
 * - Subtle `scale(1.02)` + opacity hover = "alive" signal w/o competing w/ CTA shimmer
 * - Visible focus ring satisfies WCAG 2.4.7 for keyboard users (logo == primary home link)
 * - Composes children rather than hardcoding SVG → swap brand mark variants freely
 *
 * WHAT: Transparent button w/ no border · adapts to child SVG dimensions. Hover triggers
 * opacity 90 + scale 1.02. Focus-visible reveals 2px ring at 50% opacity. Always rendered
 * as first element in primary nav bar (logical reading order + skip-link target).
 *
 * WHEN:
 * - First element of `<Navbar>` (every page header)
 * - Footer logo (returns to home from page bottom)
 * - Splash / login screens where logo doubles as home affordance
 *
 * WHEN NOT:
 * - Decorative logo in marketing collateral (no interaction needed) → use raw `<Logo>` SVG
 * - Embedded logo inside a Card (would create nested click target) → use plain SVG
 * - Email / static HTML contexts → button affordance is wrong
 * - Watermark / background usage → semantic button is overkill
 *
 * HOW:
 * ```tsx
 * <LogoButton onClick={() => router.push('/')}>
 *   <KenLogo width={120} height={28} />
 * </LogoButton>
 * ```
 *
 * A11y: `aria-label` (default "Ken Research Home"). Focus-visible 2px ring w/ 2px offset.
 *       Semantic `<button>` — Enter/Space activate. Touch target inherits Logo SVG size
 *       (must be ≥44px on mobile — consumer responsibility).
 * Motion: 200ms ease-out on opacity + transform. Reduced-motion handled via DS-layer global rule.
 * Anti-patterns:
 *  - ❌ Never wrap Logo in `<a>` AND LogoButton (nested interactive elements)
 *  - ❌ Never add `bg-*` className (transparent by design · sits on any nav bg)
 *  - ❌ Never remove `aria-label` (logo is graphic — needs text equivalent)
 *  - ❌ Never use for non-home navigation (logo = home convention)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/app/components/navbar/atoms/LogoButton.tsx
 * @canonicalSource report-store-legacy Header.tsx logo region
 * @verifiedBy aura-builder (Batch 3.1a · 2026-05-19) — SVG children composition correct · focus ring updated to brand-red
 */
export function LogoButton({
  onClick,
  href,
  children,
  ariaLabel = 'Ken Research Home',
}: LogoButtonProps) {
  const className = `
        flex items-center
        hover:opacity-90 hover:scale-[1.02]
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2
        rounded-[3px] bg-transparent border-none cursor-pointer
      `;

  if (href) {
    return (
      <a
        data-component="LogoButton"
        href={href}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      data-component="LogoButton"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
