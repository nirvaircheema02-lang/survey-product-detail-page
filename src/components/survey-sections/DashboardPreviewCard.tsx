'use client';

/**
 * DashboardPreviewCard — clickable dashboard screenshot preview
 *
 * @what  A real dashboard screenshot, large and cropped ("half dashboard" — a
 *        product interface entering the frame, not a screenshot fitted inside a
 *        card). The whole area is clickable via a plain non-semantic wrapper
 *        (mouse/touch convenience only — carries no ARIA role, so it is correctly
 *        invisible to assistive tech). The actual accessible control is one real
 *        DS `Button` (variant="primary" size="md", rendered as a genuine `<a>`),
 *        centered at its natural size, revealed on hover/focus.
 *        Variant history — `brand` size="lg" (red gradient) read as an oversized
 *        custom pill dominating the preview. `primary` (dark gradient) had been
 *        rejected earlier only because the scrim was then `black/40`, which
 *        darkened the screenshot until a dark button sat dark-on-dark. With the
 *        scrim reduced to `black/20` the screenshot stays light, so `primary`
 *        now has strong figure/ground separation. `secondary` was re-checked
 *        against the same render and rejected: its rest border is `black/12`,
 *        so a white slab over a light dashboard loses its silhouette entirely.
 * @why   Button's own hover chrome (shimmer sweep, animated arrow, shadow) is
 *        self-managed via internal React state on its own root element — it can't
 *        simultaneously be "invisible until hovered" AND "the full-card hit area"
 *        without either losing its real hover state or stretching a dark
 *        always-visible pill over the whole image. Splitting the hit-area (div)
 *        from the visible control (Button) resolves that without approximating
 *        Button's styling by hand and without nesting interactive elements
 *        (`<a>` inside `<a>` — or `<button>` inside `<a>` — is invalid HTML and
 *        breaks keyboard/AT navigation).
 * @how   `group` on the outer div drives the scrim + Button-wrapper opacity via
 *        `group-hover`/`group-focus-within` (the real Button sitting inside means
 *        focusing it via Tab triggers `:focus-within` on the ancestor for free).
 *        Mobile (below `sm`): scrim + Button visible by default, no hover reliance.
 */

import Image from 'next/image';
import { Button } from '@/vendor/design-system/atoms';

export interface DashboardPreviewCardProps {
  /** Path to the real dashboard screenshot (public/ asset or remote URL). Never fabricated. */
  screenshotSrc: string;
  screenshotAlt: string;
  /** Destination for the dashboard. Configurable — left as a placeholder until a real route exists. */
  dashboardHref: string;
  ctaLabel?: string;
  /** Tailwind aspect-ratio class for the screenshot frame. @default 'aspect-[1440/705]' */
  aspectRatio?: string;
  /** object-position for the crop — which part of the real screenshot stays visible. @default 'object-top' */
  imagePosition?: string;
  sizes?: string;
}

export function DashboardPreviewCard({
  screenshotSrc,
  screenshotAlt,
  dashboardHref,
  ctaLabel = 'Open Interactive Dashboard',
  aspectRatio = 'aspect-[1440/705]',
  imagePosition = 'object-top',
  sizes = '(min-width: 1100px) 1100px, 100vw',
}: DashboardPreviewCardProps) {
  return (
    <div
      data-component="DashboardPreviewCard"
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-xs,5px)] shadow-[var(--shadow-lg)] bg-[var(--warm-300,#f5f2f1)] ${aspectRatio}`}
      onClick={() => {
        window.location.href = dashboardHref;
      }}
    >
      <Image
        src={screenshotSrc}
        alt={screenshotAlt}
        fill
        sizes={sizes}
        className={`object-cover ${imagePosition} transition-transform duration-[220ms] ease-out group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
      />

      {/* Scrim — subtle, never a heavy dark-out. `black/20`, not `black/40`:
          40% greyed the dashboard out, which is the one thing this preview is
          for. 20% is enough separation for the dark `primary` CTA to sit on
          while every KPI number and chart bar behind stays readable.
          Visible by default on mobile (no hover reliance), hover/focus-reveal
          on desktop. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/20 sm:bg-black/0 transition-colors duration-[220ms] ease-out sm:group-hover:bg-black/20 sm:group-focus-within:bg-black/20 motion-reduce:transition-none"
      />

      {/* The one real, accessible control — a genuine DS Button rendered as <a>,
          not a stretched hit-area, so its own hover/shimmer/arrow state is real. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center opacity-100 sm:opacity-0 transition-opacity duration-[220ms] ease-out sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 motion-reduce:transition-none">
        <Button variant="primary" size="md" animatedArrow href={dashboardHref}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
