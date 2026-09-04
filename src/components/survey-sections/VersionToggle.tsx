'use client';

/**
 * VersionToggle — compact V1/V2 review control.
 *
 * @what  A two-segment control for switching a section between two presentation
 *        directions during design/stakeholder review. Not an end-user feature.
 * @why   Lifted out of DashboardPreviewSection so the Hero's review toggle and
 *        the dashboard's are literally the same control rather than two
 *        look-alikes that drift apart. Behaviour and markup for `tone="light"`
 *        are unchanged from the dashboard's original local copy.
 * @how   The DS has no generic segmented control — its closest atom,
 *        `ViewToggle`, is hardwired to list/grid with lucide icons and a
 *        `ViewMode` union, so it cannot carry V1/V2 text labels. Rather than
 *        invent a look, this reuses ViewToggle's exact token vocabulary
 *        (warm-300 trough, warm-500 hairline, --radius-element outer /
 *        --radius-inner thumb, white+shadow active, black/35 rest) so it reads
 *        as the same control family. Deliberately quiet — a review affordance,
 *        not a page CTA, so it borrows no brand-red except for the focus ring.
 *
 *        `tone="dark"` is the same geometry on a dark surface, using the survey
 *        hero's own established chrome (white/[0.04–0.06] fills, white/10
 *        hairlines) instead of inverting to a bright white thumb, which would
 *        read as a flashy control on the near-black hero.
 *
 *        The DS also ships `SubtleVariantSwitcher`, which is purpose-built for
 *        exactly this job and even cites "hero variants" in its own docs — but
 *        it is a hover-expanding gear pill, a different shape from the segmented
 *        control already approved on the dashboard. Consistency between the two
 *        review controls won; swapping to it later is a one-line change.
 */

export type ReviewVersion = 'v1' | 'v2';

export interface VersionToggleProps {
  version: ReviewVersion;
  onChange: (v: ReviewVersion) => void;
  /** Surface the control sits on. */
  tone?: 'light' | 'dark';
  /** `data-component` value — kept per-consumer so existing hooks/selectors hold. */
  name?: string;
  ariaLabel?: string;
  className?: string;
}

const TROUGH: Record<'light' | 'dark', { background: string; border: string }> = {
  light: {
    background: 'var(--color-ramp-warm-300)',
    border: '1px solid var(--color-ramp-warm-500, rgba(0,0,0,0.08))',
  },
  dark: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
};

const SEGMENT: Record<'light' | 'dark', { active: string; rest: string }> = {
  light: {
    active: 'bg-white text-black shadow-sm',
    rest: 'text-black/35 hover:text-black/60',
  },
  dark: {
    active: 'bg-white/[0.16] text-white',
    rest: 'text-white/40 hover:text-white/65',
  },
};

export function VersionToggle({
  version,
  onChange,
  tone = 'light',
  name = 'VersionToggle',
  ariaLabel = 'Presentation version',
  className,
}: VersionToggleProps) {
  return (
    <div
      data-component={name}
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center p-0.5${className ? ` ${className}` : ''}`}
      style={{
        background: TROUGH[tone].background,
        borderRadius: 'var(--radius-element, 5px)',
        border: TROUGH[tone].border,
      }}
    >
      {(['v1', 'v2'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={version === v}
          className={`inline-flex h-7 min-w-[44px] items-center justify-center px-3 font-body text-[12px] font-medium tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${
            version === v ? SEGMENT[tone].active : SEGMENT[tone].rest
          }`}
          style={{ borderRadius: 'var(--radius-inner, 2.5px)' }}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
