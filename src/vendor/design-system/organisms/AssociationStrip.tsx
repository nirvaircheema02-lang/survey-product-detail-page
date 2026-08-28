/**
 * AssociationStrip
 *
 * WHAT:
 * Horizontal trust/association strip displaying: left side — certification badges
 * (ISO icons + label), right side — "Trusted by:" label + client logo pills with
 * optional grayscale-on-hover-color treatment. Divided by `divide-x` borders.
 * Light surface only (editorial light variant).
 *
 * WHY:
 * Social proof reduces purchase anxiety for high-ticket research reports (>$3000).
 * Displaying recognisable client logos and ISO certifications triggers the authority
 * and social-proof heuristics (Cialdini) before users reach the price. The strip
 * should be visually lightweight — secondary to content — so it uses small text and
 * muted logo pills, not large logos.
 *
 * WHEN:
 * - Below the HeroSection on a report PDP, or just above the Footer.
 * - Any page needing a compact trust signal row without dedicating a full section.
 *
 * WHEN NOT:
 * - Full testimonial/social proof sections (use TestimonialsRS organism).
 * - When logos are large brand marks needing SVG — provide a custom logo row.
 *
 * WHERE:
 * - `projects/report-store-legacy/src/app/components/Footer.tsx:42-68` (canonical trust bar).
 * - Any report PDP or landing page needing compact trust signals.
 *
 * HOW:
 * ```tsx
 * import { AssociationStrip } from '@kenresearch/design-system/organisms';
 *
 * <AssociationStrip
 *   certifications={[
 *     { id: 'iso', icon: Shield, label: 'ISO 27001 Certified' },
 *     { id: 'top10', icon: Award, label: 'Top 10 Global Research Firm' },
 *   ]}
 *   trustedByLabel="Trusted by"
 *   logos={[
 *     { id: 'fortune', name: 'Fortune 500' },
 *     { id: 'mckinsey', name: 'McKinsey' },
 *     { id: 'deloitte', name: 'Deloitte' },
 *     { id: 'bcg', name: 'BCG' },
 *     { id: 'kpmg', name: 'KPMG' },
 *   ]}
 *   background="light"
 * />
 * ```
 *
 * @wwwwh-complete true
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom report-store-legacy/src/app/components/Footer.tsx:42-68 (trust bar pattern)
 */

import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A certification/award badge shown on the left side. */
export interface AssociationCertification {
  /** Unique key. */
  id: string;
  /** Lucide icon for the certification. */
  icon: LucideIcon;
  /** Short label, e.g. "ISO 27001 Certified". */
  label: string;
}

/** A client/partner logo pill on the right side. */
export interface AssociationLogo {
  /** Unique key. */
  id: string;
  /** Display name shown inside the pill. */
  name: string;
  /**
   * Optional href if the logo should link somewhere.
   * If omitted, rendered as a `<span>` (not a link).
   */
  href?: string;
}

export interface AssociationStripProps {
  /**
   * Certification/award badges shown on the left.
   * // TODO: replace w/ real API — static data for now
   */
  certifications?: AssociationCertification[];
  /**
   * Label before the logo pills: "Trusted by".
   * @default "Trusted by"
   */
  trustedByLabel?: string;
  /**
   * Client/partner logo pills on the right.
   * // TODO: replace w/ real API — static data for now
   */
  logos?: AssociationLogo[];
  /**
   * Surface background.
   * "light" = `var(--white)` · "warm" = `var(--warm-300)`
   * @default "light"
   */
  background?: 'light' | 'warm';
  /** Optional className on the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AssociationStrip({
  certifications = [],
  trustedByLabel = 'Trusted by',
  logos = [],
  background = 'light',
  className,
}: AssociationStripProps) {
  const bgToken = background === 'warm' ? 'var(--warm-300)' : 'var(--white)';

  return (
    <div
      data-component="AssociationStrip"
      className={className}
      style={{
        background: bgToken,
        borderTop: '1px solid var(--black-100)',
        borderBottom: '1px solid var(--black-100)',
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: 'var(--container-page)',
          margin: '0 auto',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
          paddingLeft: 'var(--padding-mobile)',
          paddingRight: 'var(--padding-mobile)',
        }}
        className="sm:px-6 md:px-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: certification badges */}
          {certifications.length > 0 && (
            <div
              className="flex items-center gap-4 flex-wrap"
              aria-label="Certifications and awards"
            >
              {certifications.map((cert, idx) => {
                const Icon = cert.icon;
                return (
                  <div key={cert.id} className="flex items-center gap-2">
                    {/* Separator */}
                    {idx > 0 && (
                      <div
                        aria-hidden="true"
                        className="hidden sm:block"
                        style={{ width: '1px', height: '1rem', background: 'var(--black-200)' }}
                      />
                    )}
                    <Icon
                      aria-hidden="true"
                      style={{ width: '1rem', height: '1rem', color: 'var(--black-400)' }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--black-500)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {cert.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Right: trusted by logos */}
          {logos.length > 0 && (
            <div
              className="flex items-center gap-3 flex-wrap justify-center sm:justify-end"
              aria-label="Trusted by clients"
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--black-400)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {trustedByLabel}:
              </span>
              {logos.map((logo) =>
                logo.href ? (
                  <a
                    key={logo.id}
                    href={logo.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="hover:text-opacity-80 transition-opacity"
                    style={{
                      display: 'inline-block',
                      padding: '2px var(--space-2)',
                      borderRadius: 'var(--radius-element)',
                      background: 'var(--black-50)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
                      fontFamily: 'var(--font-sans)',
                      textDecoration: 'none',
                    }}
                  >
                    {logo.name}
                  </a>
                ) : (
                  <span
                    key={logo.id}
                    style={{
                      display: 'inline-block',
                      padding: '2px var(--space-2)',
                      borderRadius: 'var(--radius-element)',
                      background: 'var(--black-50)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--black-500)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {logo.name}
                  </span>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
