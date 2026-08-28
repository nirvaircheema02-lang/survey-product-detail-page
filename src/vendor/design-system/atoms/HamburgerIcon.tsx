export interface HamburgerIconProps {
  isOpen: boolean;
}

/**
 * HamburgerIcon — animated 3-bar hamburger ↔ X morph for mobile nav toggle.
 *
 * WHY:
 * - Universal mobile menu affordance — bars→X morph signals state change without label
 * - In-component animation prevents each consumer rebuilding the 3-bar transform math
 * - 3 bars (not 2) is the recognized hamburger convention — fewer feels like a different glyph
 * - Pure CSS transforms (no Framer) keep the icon lightweight for nav-bar rendering
 * - 2.5px bar weight chosen for visual parity w/ Lucide icons at 24px
 *
 * WHAT: 24px-wide stack of 3 rounded bars. When `isOpen=true`: bar 1 rotates 45° + slides
 * down · bar 2 fades + scales out · bar 3 rotates -45° + slides up — forming an X.
 * Uses CSS class toggles on each bar (no JS animation library).
 *
 * WHEN:
 * - Mobile hamburger button inside `<Navbar>` (default usage)
 * - Off-canvas drawer toggle
 * - Any sm/md viewport menu trigger that swaps to a panel
 *
 * WHEN NOT:
 * - Desktop nav (no need — full menu visible)
 * - Tab triggers → use `<DropdownChevron>` (rotation convention)
 * - "More options" overflow menu → use Lucide `MoreHorizontal` / `MoreVertical`
 * - Close-only icons → use Lucide `X` (no morph needed)
 *
 * HOW:
 * ```tsx
 * <button
 *   onClick={() => setOpen(!open)}
 *   aria-expanded={open}
 *   aria-label={open ? 'Close menu' : 'Open menu'}
 *   aria-controls="mobile-menu"
 *   className="p-3"
 * >
 *   <HamburgerIcon isOpen={open} />
 * </button>
 * ```
 *
 * A11y: `aria-hidden` set (decorative). Parent button MUST provide `aria-label` that
 *       swaps w/ state ("Open menu" → "Close menu") and `aria-expanded={isOpen}`.
 *       Touch target = parent's padding (≥44×44px on mobile · parent responsibility).
 * Motion: 300ms ease-out on each bar's transform + opacity + scale. Reduced-motion handled at DS layer.
 * Anti-patterns:
 *  - ❌ Never use directly without a button wrapper (icon-only · no semantic role)
 *  - ❌ Never override bar color via className (uses `--color-foundation-black` token)
 *  - ❌ Never use on desktop nav (mobile-first affordance · loses meaning at lg)
 *  - ❌ Never animate manually (icon owns its morph — re-implementing causes drift)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (decorative · parent owns semantics)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom topnav-v32/src/app/components/navbar/atoms/HamburgerIcon.tsx
 */
export function HamburgerIcon({ isOpen }: HamburgerIconProps) {
  return (
    <div data-component="HamburgerIcon" className="w-[24px] flex flex-col gap-[5px]" aria-hidden="true">
      <div
        className={`h-[2.5px] bg-[var(--color-foundation-black)] rounded-full transition-all duration-300 ease-out ${
          isOpen ? 'rotate-45 translate-y-[7.5px]' : ''
        }`}
      />
      <div
        className={`h-[2.5px] bg-[var(--color-foundation-black)] rounded-full transition-all duration-300 ease-out ${
          isOpen ? 'opacity-0 scale-75' : ''
        }`}
      />
      <div
        className={`h-[2.5px] bg-[var(--color-foundation-black)] rounded-full transition-all duration-300 ease-out ${
          isOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
        }`}
      />
    </div>
  );
}
