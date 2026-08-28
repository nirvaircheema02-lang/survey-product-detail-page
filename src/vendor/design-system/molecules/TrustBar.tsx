/**
 * TrustBar — Horizontal strip of trust signals: ISO certification + award badge + client logo pills.
 *
 * WHAT: A flex row with two trust badges (Shield ISO + Award rating) on the left,
 *       and a horizontally-scrollable set of client name pills on the right.
 *       No interactivity — purely presentational trust layer.
 *
 * WHY: Social proof at the fold line reduces bounce. ISO 27001 + "Top 10 Global
 *      Research Firm" credentialize enterprise buyers scanning for vendor quality
 *      (Cialdini authority + social-proof heuristics). Horizontal scroll on mobile
 *      avoids wrapping that makes the strip look sparse.
 *
 * WHEN: Top of Footer organism. Optionally reusable inside AssociationStrip.
 *
 * WHEN NOT: Above the fold hero (too many trust signals dilute hierarchy).
 *           Do not use on cinematic-dark sections without onDark prop.
 *
 * WHERE: Footer organism · top trust band.
 *
 * HOW:
 * ```tsx
 * <TrustBar onDark />
 * <TrustBar clientLogos={['Fortune 500', 'McKinsey', 'Deloitte']} />
 * ```
 *
 * @canonical report-store-legacy/src/app/components/Footer.tsx (L42-68)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 *
 * 2026-08-14 correction: client-logo row was `overflow-x-auto sm:overflow-visible`
 * — at `sm:` (640px+) it went `flex-nowrap` + `overflow-visible` simultaneously,
 * so once the row didn't fit its container it could neither wrap nor scroll and
 * just spilled past it (confirmed as a real page-level horizontal-overflow
 * source in a narrower consumer layout, pixel-matched: offending pill's right
 * edge landed exactly on the page's measured `scrollWidth`). Dropped the
 * `sm:overflow-visible` override — plain `overflow-x-auto` at every width is a
 * strict safety net, not a behavior change: when the row already fits (the
 * common case this was written for), `overflow-x:auto` shows no scrollbar and
 * looks identical to `overflow-visible`; it only ever activates when content
 * genuinely doesn't fit, which is exactly the case that was broken.
 */

import { Shield, Award } from 'lucide-react';

export interface TrustBarProps {
  /** Client logos to render as pills. Default: canonical 5. */
  clientLogos?: string[];
  /** Render on dark surface. Adjusts text/border opacity. */
  onDark?: boolean;
  /** ISO badge label. Default: "ISO 27001 Certified". */
  isoLabel?: string;
  /** Award badge label. Default: "Top 10 Global Research Firm". */
  awardLabel?: string;
  /** "Trusted by:" prefix label. Default: "Trusted by:". */
  trustedByLabel?: string;
  className?: string;
}

const DEFAULT_LOGOS = [
  'Fortune 500',
  'McKinsey',
  'Deloitte',
  'BCG',
  'KPMG',
];

export function TrustBar({
  clientLogos = DEFAULT_LOGOS,
  onDark = false,
  isoLabel = 'ISO 27001 Certified',
  awardLabel = 'Top 10 Global Research Firm',
  trustedByLabel = 'Trusted by:',
  className = '',
}: TrustBarProps) {
  const textColor = onDark ? 'rgba(255,255,255,0.40)' : 'var(--black-500)';
  const pillBg = onDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const pillText = onDark ? 'rgba(255,255,255,0.50)' : 'var(--black-600)';
  const dividerColor = onDark ? 'rgba(255,255,255,0.10)' : 'var(--black-200)';
  const iconColor = onDark ? 'rgba(255,255,255,0.30)' : 'var(--black-400)';

  return (
    <div
      data-component="TrustBar"
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
    >
      {/* Left: trust badges */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2" style={{ color: textColor }}>
          <Shield
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            style={{ color: iconColor }}
          />
          <span style={{ fontSize: 'var(--text-xs)' }}>{isoLabel}</span>
        </div>
        <div
          className="hidden sm:block w-px h-4"
          style={{ background: dividerColor }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-2" style={{ color: textColor }}>
          <Award
            className="h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            style={{ color: iconColor }}
          />
          <span style={{ fontSize: 'var(--text-xs)' }}>{awardLabel}</span>
        </div>
      </div>

      {/* Right: client logo pills — horizontal scroll on mobile */}
      <div
        className="flex items-center gap-3 flex-wrap sm:flex-nowrap overflow-x-auto pb-0.5 sm:pb-0"
        style={{ scrollbarWidth: 'none', color: textColor, fontSize: 'var(--text-xs)' }}
      >
        <span className="flex-shrink-0">{trustedByLabel}</span>
        {clientLogos.map((logo) => (
          <span
            key={logo}
            className="flex-shrink-0 px-2 py-0.5"
            style={{
              background: pillBg,
              color: pillText,
              borderRadius: 'var(--radius-element)',
              fontSize: 'var(--text-xs)',
              whiteSpace: 'nowrap',
            }}
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
