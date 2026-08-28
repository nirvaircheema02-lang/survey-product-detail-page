'use client';

/**
 * PaywallOverlay — Generic blur-overlay wrapper that locks content behind a paywall UI.
 *
 * WHAT: A position:relative container. Renders `children` with blur + pointer-events-none.
 *       An absolutely-centered overlay shows a PREMIUM Badge + CTA Button.
 *       Reusable across charts, tables, and any locked-content region.
 *
 * WHY: Paywall UI is a recurring pattern across report PDP (charts, tables, sections).
 *      A single reusable molecule ensures consistent lock-state visual language:
 *      blur amount, badge variant, CTA size, and positioning are all standardized.
 *      Separating blur-children from overlay avoids re-implementing this in every organism.
 *
 * WHEN: Any locked/premium content block — chart cards, data tables, section previews,
 *       PreviewCard lower region.
 *
 * WHEN NOT: Full-page auth gates (use a modal/page). When content is actually unlocked.
 *
 * WHERE: PreviewCard · ChartCard (locked variant) · DatasetPreviewTable paywall row ·
 *        RegionalComparison locked view.
 *
 * HOW:
 * ```tsx
 * <PaywallOverlay onCTA={() => router.push('/purchase')} ctaLabel="Unlock Report">
 *   <SomeLockedChart />
 * </PaywallOverlay>
 * ```
 *
 * @canonical V0_lite_report-legacy/src/app/components/HeroSection.tsx premium overlay (L526-573)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 *
 * 2026-08-14 correction (readability leak, cross-report): default `blurPx` 4→10
 * and overlay opacity light 0.55→0.85 / dark 0.45→0.75, overlay's own
 * `backdropFilter` 2px→4px. At the old values, bold/large text (big KPI
 * numbers, short company names) stayed partially legible through the blur —
 * a 4px filter on ~20px+ bold text doesn't obscure the character shapes
 * enough, and a 55%-opacity scrim on top still let real pixels show through.
 * This is every consumer's DEFAULT (`PremiumGate.tsx` doesn't pass `blurPx`),
 * so every section using `PremiumGate`/`PaywallOverlay` gets the stronger
 * treatment from this one change — no per-section patch needed. `blurPx`/
 * `surface` remain overridable per-instance for a section that genuinely
 * needs a different strength.
 */

import { Crown } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export type PaywallSurface = 'dark' | 'light';

export interface PaywallOverlayProps {
  /** The content to blur/lock. Rendered with blur + pointer-events-none. */
  children: React.ReactNode;
  /** Called when the CTA button is clicked. */
  onCTA?: () => void;
  /** CTA button label. Default: "Unlock Full Report". */
  ctaLabel?: string;
  /** Badge label. Default: "PREMIUM". */
  badgeLabel?: string;
  /** Surface variant — affects blur + overlay style. */
  surface?: PaywallSurface;
  /** Blur intensity in px. Default: 4. */
  blurPx?: number;
  /** Whether to show the CTA button. Default: true. */
  showCTA?: boolean;
  className?: string;
}

export function PaywallOverlay({
  children,
  onCTA,
  ctaLabel = 'Unlock Full Report',
  badgeLabel = 'PREMIUM',
  surface = 'dark',
  blurPx = 10,
  showCTA = true,
  className = '',
}: PaywallOverlayProps) {
  const isDark = surface === 'dark';

  const overlayBg = isDark
    ? 'rgba(10,10,12,0.75)'
    : 'rgba(245,242,241,0.85)';

  return (
    <div
      data-component="PaywallOverlay"
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: 'inherit' }}
    >
      {/* Blurred locked content */}
      <div
        aria-hidden="true"
        style={{
          filter: `blur(${blurPx}px)`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      {/* Paywall overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          background: overlayBg,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
        role="status"
        aria-label={`${badgeLabel} content — ${ctaLabel} to access`}
      >
        {/* PREMIUM badge */}
        <Badge
          variant="pill"
          size="sm"
          theme={isDark ? 'neutral' : 'warm'}
          mode={isDark ? 'dark' : 'light'}
        >
          <Crown className="h-3 w-3 mr-1.5" aria-hidden="true" />
          {badgeLabel}
        </Badge>

        {/* CTA */}
        {showCTA && (
          <Button
            variant="brand"
            size="sm"
            onClick={onCTA}
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
