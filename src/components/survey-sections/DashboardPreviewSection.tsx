'use client';

/**
 * DashboardPreviewSection — "Interactive Dashboard Preview" (new section)
 *
 * @what  Two layout variants behind a review-only V1/V2 toggle in the section's
 *        top-right corner, so both can be compared live without a redeploy:
 *          V1 — left content block + the real dashboard as a large, absolutely-
 *               positioned layer bled to the section's true right edge.
 *          V2 — heading + a 3-up row of small bordered feature cards sitting
 *               beside it, a lede paragraph, then the real dashboard full-width
 *               in normal document flow (contained, not bled off-screen).
 *               Composition only is adapted from a reference image the user
 *               supplied — never its colors, icon treatment, or fabricated
 *               dashboard content. Same real Ken screenshot as V1.
 * @why   `SectionWrapper`'s inner div is intentionally capped at
 *        `var(--container-page)` (1200px) and padded — correct for every other
 *        section, but it makes V1's true edge-to-edge bleed impossible from
 *        inside it (confirmed visually: a percentage/negative-margin escape from
 *        within a centered+padded+max-width ancestor left a dead gutter). So
 *        this section hand-rolls `SectionWrapper`'s own background/spacing values
 *        on a plain `<section>` instead. `SectionWrapper` itself is intentionally
 *        left unmodified — this is a narrow, one-section exception.
 * @how   No real internal dashboard route exists yet in this repo (confirmed via
 *        repo-wide search) — `DASHBOARD_HREF` is a placeholder, not an invented
 *        URL. `overflow-hidden` lives on the outer section so V1's bleed can
 *        never grow `document.body.scrollWidth`. The V1/V2 toggle is a review
 *        aid for this design pass, not a real end-user feature — plain local
 *        state, no persistence.
 */

import { useState } from 'react';
import { SlidersHorizontal, Gauge, FileDown } from 'lucide-react';
import { SectionHeading, SectionLabel, Card } from '@/vendor/design-system/atoms';
import { DashboardPreviewCard } from './DashboardPreviewCard';

// TODO: replace w/ real dashboard route once one exists in this project — no
// internal dashboard page/route exists yet (repo-wide check, 2026-08-25).
const DASHBOARD_HREF = '#dashboard-preview-destination-tbd';

const FEATURES = [
  {
    icon: SlidersHorizontal,
    label: 'Live Filters',
    description: 'Slice respondent data by city, sector, or company size in real time.',
  },
  {
    icon: Gauge,
    label: 'Snapshot KPIs',
    description: 'See sample size, completion rate, and key metrics at a glance.',
  },
  {
    icon: FileDown,
    label: 'Export-ready Insights',
    description: 'Pull charts and breakdowns straight into your own deck.',
  },
];

const V2_LEDE =
  'Every Ken Research survey ships with a live dashboard alongside the report — explore respondent-level metrics, cut findings by segment, and pull the views your team needs without waiting on a fresh export.';

type Variant = 'v1' | 'v2';

// ─── Shared eyebrow + heading ─────────────────────────────────────────────────

function Eyebrow() {
  return (
    <div className="inline-flex mb-3">
      <SectionLabel background="light" variant="accent">
        Interactive Dashboard
      </SectionLabel>
    </div>
  );
}

// ─── V1 — left content column + large bled dashboard layer ───────────────────

function V1Layout() {
  return (
    <>
      {/* No z-index here (unlike a normal SectionWrapper) — this div's own
          padded/centered box spans the full content width even though the text
          inside is narrower, and giving it a z-index above the dashboard layer
          silently stole its pointer events across that invisible extra width
          (caught via a real Playwright hover-timeout, not a hunch). */}
      <div className="max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8 relative">
        <div className="lg:max-w-[380px] xl:max-w-[420px]">
          <Eyebrow />

          <SectionHeading level={2} id="dashboard-preview-heading" className="mb-10">
            See your survey findings in an interactive dashboard
          </SectionHeading>

          <div className="space-y-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={[
                  'flex items-start gap-3',
                  i > 0 ? 'pt-6 border-t border-[var(--border-soft)]' : '',
                ].join(' ')}
              >
                <f.icon
                  size={20}
                  strokeWidth={1.6}
                  className="text-[var(--semantic-ink-muted)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-body font-semibold text-[14px] text-[var(--semantic-ink-strong)] mb-1">
                    {f.label}
                  </p>
                  <p className="font-body text-[13px] leading-relaxed text-[var(--semantic-ink-body)]">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop — dashboard as a layer anchored to the section's true right edge
          (this section has no side padding of its own, so right-0 lands exactly
          on the viewport edge, not an approximation of it). Nudged below
          dead-center to sit a little lower against the content block. */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-[38%] w-[46%] xl:w-[44%] z-[2]">
        <DashboardPreviewCard
          screenshotSrc="/images/dashboard-preview-b2b-importer.png"
          screenshotAlt="Ken Research survey dashboard — Executive Overview, showing respondent KPIs, city-wise distribution, and category mix charts"
          dashboardHref={DASHBOARD_HREF}
          aspectRatio="aspect-[4/3]"
          imagePosition="object-left-top"
          sizes="60vw"
        />
      </div>

      {/* Mobile/tablet — normal flow, full width, below the content. Separate
          instance rather than reusing the absolute one under different classes:
          the two layout modes are different enough that one node flexing between
          them is harder to reason about and verify than two simple, independent
          ones. */}
      <div className="lg:hidden max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8 mt-10">
        <DashboardPreviewCard
          screenshotSrc="/images/dashboard-preview-b2b-importer.png"
          screenshotAlt="Ken Research survey dashboard — Executive Overview, showing respondent KPIs, city-wise distribution, and category mix charts"
          dashboardHref={DASHBOARD_HREF}
          aspectRatio="aspect-[4/3]"
          imagePosition="object-top"
          sizes="100vw"
        />
      </div>
    </>
  );
}

// ─── V2 — heading + feature-card row, lede, full-width contained dashboard ────
// Composition (heading beside a 3-up feature-card row, lede below, full-width
// dashboard below that) is adapted from the reference image's layout only —
// icon colors, dashboard content, and branding are not reused from it.

function V2Layout() {
  return (
    <div className="max-w-[var(--container-page)] mx-auto px-4 sm:px-6 md:px-8">
      <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
        <div className="lg:max-w-[420px] lg:flex-shrink-0">
          <Eyebrow />
          <SectionHeading level={2} id="dashboard-preview-heading" className="mb-0 lg:mb-0">
            See your survey findings in an interactive dashboard
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 lg:mt-0 lg:w-[600px] lg:flex-shrink-0">
          {FEATURES.map((f) => (
            <Card key={f.label} variant="white" padding="md" shadow="sm">
              <f.icon
                size={22}
                strokeWidth={1.6}
                className="text-[var(--semantic-ink-muted)] mb-3"
                aria-hidden="true"
              />
              <p className="font-body font-semibold text-[14px] text-[var(--semantic-ink-strong)] mb-1">
                {f.label}
              </p>
              <p className="font-body text-[13px] leading-relaxed text-[var(--semantic-ink-body)]">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mt-8 mb-10">
        {V2_LEDE}
      </p>

      <DashboardPreviewCard
        screenshotSrc="/images/dashboard-preview-b2b-importer.png"
        screenshotAlt="Ken Research survey dashboard — Executive Overview, showing respondent KPIs, city-wise distribution, and category mix charts"
        dashboardHref={DASHBOARD_HREF}
        aspectRatio="aspect-[1440/705]"
        imagePosition="object-top"
        sizes="(min-width: 1280px) 1200px, 100vw"
      />
    </div>
  );
}

// ─── Review-only V1/V2 toggle ──────────────────────────────────────────────────

function VariantToggle({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
}) {
  const base = 'px-3 py-1.5 text-[12px] font-body font-semibold tracking-wide transition-colors';
  return (
    <div
      className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-8 z-20 inline-flex rounded-[var(--radius-sm)] border border-[var(--border-default)] overflow-hidden bg-white shadow-[var(--shadow-sm)]"
      role="group"
      aria-label="Preview layout variant"
    >
      {(['v1', 'v2'] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={variant === v}
          onClick={() => onChange(v)}
          className={`${base} ${
            variant === v
              ? 'bg-[var(--color-foundation-black)] text-white'
              : 'bg-transparent text-[var(--semantic-ink-muted)] hover:text-[var(--semantic-ink-strong)]'
          }`}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function DashboardPreviewSection() {
  const [variant, setVariant] = useState<Variant>('v1');

  return (
    <section
      id="dashboard-preview"
      aria-labelledby="dashboard-preview-heading"
      className={`relative overflow-hidden bg-[var(--color-foundation-white)] py-12 md:py-20 scroll-mt-[120px] ${
        variant === 'v1' ? 'lg:min-h-[520px]' : ''
      }`}
    >
      <VariantToggle variant={variant} onChange={setVariant} />
      {variant === 'v1' ? <V1Layout /> : <V2Layout />}
    </section>
  );
}
