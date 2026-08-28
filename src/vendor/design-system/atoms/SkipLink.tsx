export interface SkipLinkProps {
  /** ID of the element to skip to (without #). Default: 'main-content' */
  targetId?: string;
  label?: string;
}

/**
 * SkipLink — WCAG 2.1 Level A "skip to main content" link · hidden until keyboard-focused.
 *
 * WHY:
 * - WCAG 2.4.1 (Level A) requires a way to bypass repeated blocks (nav · sidebar)
 * - Keyboard users skip through long nav every page load — SkipLink saves ~10 tabs per visit
 * - Visually hidden by default (`sr-only`) keeps page design clean
 * - Reveals on focus → keyboard users see it; mouse users never do
 * - Mount as FIRST focusable element in layout — first Tab press lands here
 *
 * WHAT: `<a>` with `sr-only focus:not-sr-only`. Hidden via screen-reader-only utility
 * until focused. On focus: white badge top-left w/ shadow + ring. Default `targetId`
 * is `main-content`. Default `label` "Skip to main content".
 *
 * WHEN:
 * - First focusable element in every layout template
 * - Every page that has a top nav · sidebar · or > 3 nav links
 * - Long-scroll pages w/ multiple landmark regions
 *
 * WHEN NOT:
 * - Pages with no nav (single-purpose forms) — nothing to skip
 * - Email templates — keyboard nav not applicable
 * - Embedded widgets / iframes — host page owns skip behavior
 * - Modal-only routes — focus trap handles bypass
 *
 * HOW:
 * ```tsx
 * // In root layout — FIRST focusable element
 * <html lang="en">
 *   <body>
 *     <SkipLink />
 *     <Navbar />
 *     <main id="main-content">{children}</main>
 *     <Footer />
 *   </body>
 * </html>
 *
 * // Custom target (e.g., article body inside long sidebar layout)
 * <SkipLink targetId="article-body" label="Skip to article" />
 * ```
 *
 * A11y: WCAG 2.4.1 Level A compliance. Semantic `<a href="#id">` · keyboard reachable.
 *       Focus-visible state shows 2px ring + shadow · 4.5:1 text contrast verified.
 *       Target element MUST exist + be focusable (use `id="main-content"` + `tabIndex={-1}`
 *       on `<main>` so screen-reader focus moves correctly).
 * Motion: None — instant visibility on focus.
 * Anti-patterns:
 *  - ❌ Never use `display:none` instead of `sr-only` (display:none removes from tab order)
 *  - ❌ Never place after Navbar (defeats purpose — user already tabbed through nav)
 *  - ❌ Never point to a non-existent ID (focus goes nowhere · breaks a11y)
 *  - ❌ Never hide on focus (must become visible for sighted keyboard users)
 *
 * @lifecycle stable
 * @a11y_status reviewed-AA (WCAG 2.1 Level A compliant)
 * @reusabilityScore 5/5 ⭐ (mandatory on every layout)
 * @promotedFrom topnav-v32/src/design-system/components/SkipLink.tsx
 */
export function SkipLink({
  targetId = 'main-content',
  label = 'Skip to main content',
}: SkipLinkProps) {
  return (
    <a
      data-component="SkipLink"
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-2 focus:left-2 focus:z-[100]
        focus:bg-[var(--color-foundation-white)] focus:text-[var(--surface-text)]
        focus:px-4 focus:py-2 focus:rounded-md focus:shadow-[var(--shadow-lg)]
        focus:outline-none focus:ring-2 focus:ring-[rgba(20,16,22,0.5)]
        focus-visible:ring-offset-2
        font-[var(--typography-family-body)] font-bold
        text-[var(--typography-size-nav-primary)] leading-[var(--typography-line-height-nav-primary)]
      "
    >
      {label}
    </a>
  );
}
