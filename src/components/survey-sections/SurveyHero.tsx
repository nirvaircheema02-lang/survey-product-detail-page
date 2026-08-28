'use client';

/**
 * SurveyHero — Bank vs NBFC Preference Survey (SMEs) hero
 *
 * @what  Approved/locked section (do not redesign) — matches the LIVE page
 *        (kenresearch.com/survey/bank-nbfc-perference) exactly: two pills
 *        ("Survey" + "SME Lending & Finance" — Figma shows only the latter,
 *        live ships both, explicit call to follow live here), a breadcrumb
 *        hidden below `md` (matches live's own `hidden md:block` wrapper),
 *        metadata row with the live page's actual icon choices, supporting
 *        insight blocks as bordered cards (the live page does NOT de-box
 *        these), a right-side decorative illustration, and the real "Trusted
 *        by leading brands" logo strip.
 * @why   Colors/spacing/icons below are copied from the live DOM's own computed
 *        styles (hex values converted to the nearest Tailwind opacity utility),
 *        not eyeballed from a screenshot. Logos are the real assets the live page
 *        serves (downloaded to public/images/logos/), not placeholders.
 * @how   The right-side illustration is a decorative approximation, not a pixel
 *        copy: matched to Figma's actual 3-card cluster (chrome-dot chart card,
 *        checklist card with one checked + three unchecked rows, bar-chart card
 *        with status dots + a footer bar) — no real text or numbers in Figma
 *        either, so recreating the same shapes doesn't risk fabricating data.
 *        `aria-hidden` + `pointer-events-none` throughout since it's decorative.
 *        The logo strip is a continuous auto-scrolling marquee (60s linear
 *        infinite, `globals.css`), matching live's own implementation rather
 *        than a static wrapped row — track is the logo list duplicated 2x with
 *        the 2nd copy `aria-hidden` so screen readers don't hear it twice.
 */

import Image from 'next/image';
import { Users, CircleStar, Clock, ChartColumn } from 'lucide-react';
import { Button } from '@kenresearch/design-system/atoms';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@kenresearch/design-system/ui/breadcrumb';
import { Fragment } from 'react';

const BREADCRUMB_LEVELS = [
  { label: 'Home', href: '/' },
  { label: 'Ken Survey', href: '/survey' },
  { label: 'CNDP Survey', href: '/survey/cndp' },
  { label: 'Bank vs NBFC Preference Survey (SMEs)', href: '#' },
];

// Figma shows only the category pill, but live (re-verified at mobile + desktop,
// 2026-08-26) ships both — explicit call to match live exactly for this element.
const PILLS = ['Survey', 'SME LENDING & FINANCE'];

const METADATA = [
  { icon: Users, label: 'Pan-India sample' },
  { icon: CircleStar, label: 'SME finance decision-makers (Founders & CFOs)' },
  { icon: Clock, label: '15-20 min' },
];

const SUPPORTING_INSIGHTS = [
  {
    icon: ChartColumn,
    title: 'Lender evaluation friction & drop-offs',
    description:
      'Identify where SME borrowers stall, switch lenders, or abandon credit applications mid-process.',
  },
  {
    icon: CircleStar,
    title: 'Selection drivers & pricing trade-offs',
    description:
      'Rank the approval speed thresholds, collateral expectations, and rate sensitivities that determine lender choice.',
  },
];

// Real assets downloaded from the live page's own "Trusted by leading brands" strip.
const TRUSTED_LOGOS = [
  { file: 'LBC_White.webp', name: 'LBC' },
  { file: 'Nasscom_white.webp', name: 'Nasscom' },
  { file: 'AGS_white.webp', name: 'AGS' },
  { file: 'Yash_white.webp', name: 'Yash' },
  { file: 'Medilines-white.webp', name: 'Medilines' },
  { file: 'Carsome_white.webp', name: 'Carsome' },
  { file: 'ema_partners_white.webp', name: 'EMA Partners' },
  { file: 'Aakaar_white.webp', name: 'Aakaar' },
];

/** Decorative, content-free UI-mockup shapes — matches Figma's 3-card cluster:
 *  a chart card (chrome dots + header bar + squiggle line), a checklist card
 *  (one checked row, three unchecked), and a bar-chart card (status dots +
 *  ascending bars + a footer bar). No real numbers/labels in Figma either, so
 *  this is a faithful decorative rebuild, not fabricated data. */
function HeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none"
    >
      {/* Card 1 — chart, top-right, largest */}
      <div className="absolute top-0 right-0 w-[260px] h-[212px] rounded-[14px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 shadow-2xl p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="size-1.5 rounded-full bg-white/25" />
          <span className="size-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 flex-1 max-w-[90px] rounded-full bg-white/10 ml-1.5" />
        </div>
        <svg viewBox="0 0 220 130" className="w-full h-[calc(100%-24px)]">
          <path
            d="M0,95 Q35,20 75,68 T160,38 T220,58"
            fill="none"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="75" cy="68" r="3" fill="white" fillOpacity="0.5" />
          <circle cx="160" cy="38" r="3" fill="white" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Card 2 — checklist, overlapping card 1's bottom-left corner */}
      <div className="absolute top-[178px] right-[68px] w-[230px] h-[128px] rounded-[14px] bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/10 shadow-2xl p-4 flex flex-col justify-center gap-3">
        {[
          { checked: true, w: 74 },
          { checked: false, w: 58 },
          { checked: false, w: 66 },
          { checked: false, w: 50 },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {row.checked ? (
              <svg viewBox="0 0 24 24" className="size-3.5 flex-shrink-0" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
                <path
                  d="M8 12.5l2.5 2.5L16 9"
                  stroke="white"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className="size-3.5 flex-shrink-0 rounded-full border-2 border-white/20" />
            )}
            <span className="h-2 rounded-full bg-white/10" style={{ width: `${row.w}%` }} />
          </div>
        ))}
      </div>

      {/* Card 3 — bar chart, bottom, separate */}
      <div className="absolute bottom-0 right-[24px] w-[220px] h-[142px] rounded-[14px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 shadow-2xl p-4 flex flex-col">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/15" />
          <span className="size-1.5 rounded-full bg-white/15" />
        </div>
        <div className="flex-1 flex items-end gap-2.5">
          {[35, 62, 45, 78].map((h, i) => (
            <span key={i} className="flex-1 rounded-t-[2px] bg-white/15" style={{ height: `${h}%` }} />
          ))}
        </div>
        <span className="mt-3 h-1.5 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

export function SurveyHero() {
  return (
    <section
      aria-label="Survey hero"
      data-component="SurveyHero"
      className="relative w-full overflow-hidden bg-[var(--color-foundation-black,#0a0a0c)]"
    >
      <div className="relative mx-auto max-w-[var(--container-page,1240px)] px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <HeroIllustration />

        {/* Breadcrumb — hidden below md to match live exactly (verified: live's
            own breadcrumb wrapper is literally classed "hidden md:block"). */}
        <div className="hidden md:block">
          <BreadcrumbRoot>
            <BreadcrumbList className="text-white/60 gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-body mb-6 sm:mb-8">
              {BREADCRUMB_LEVELS.map((b, i) => {
                const last = i === BREADCRUMB_LEVELS.length - 1;
                return (
                  <Fragment key={b.label}>
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage className="text-white font-medium">{b.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={b.href}
                          className="text-white/60 hover:text-white/90 transition-colors"
                        >
                          {b.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!last && <BreadcrumbSeparator className="text-white/30 [&>svg]:size-3" />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </BreadcrumbRoot>
        </div>

        <div className="relative max-w-[720px] space-y-5">
          {/* Two pill badges — exact live-page treatment (not the SectionLabel
              eyebrow atom: these are a distinct, dark-hero-specific pill style
              the live page hand-rolls, confirmed via its own computed styles). */}
          <div className="flex flex-wrap items-center gap-2">
            {PILLS.map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-[13px] py-[7px] text-[12.8px] text-white/50 bg-white/[0.04] border border-white/10 rounded-[8px] font-medium leading-[18px] tracking-[0.6px]"
              >
                {p}
              </span>
            ))}
          </div>

          <h1 className="font-display font-light text-white tracking-[-0.02em] leading-[1.1] text-[clamp(28px,4vw,48px)]">
            Bank vs NBFC Preference Survey (SMEs)
          </h1>

          <p className="font-body font-normal text-white/[0.78] leading-relaxed text-[16px] max-w-[64ch]">
            Small and medium enterprises weigh interest rates, approval timelines, and relationship
            flexibility when choosing between banks and NBFCs for credit, so you can sharpen
            acquisition targeting, recalibrate pricing tiers, and reduce borrower attrition.
          </p>

          {/* Metadata row — icons/colors match the live page's own computed styles
              (text-white/40 icons, text-white/50 labels). */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
            {METADATA.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-2 text-[12.8px] text-white/50 font-body"
              >
                <m.icon size={16} strokeWidth={2} className="text-white/40" aria-hidden="true" />
                {m.label}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Button variant="brand" size="md" animatedArrow>
              Talk to a Survey Consultant
            </Button>
          </div>
        </div>

        {/* Supporting insight blocks — bordered cards, matching the live page
            exactly (this was previously de-boxed in error; the live page keeps
            these contained). */}
        <div className="relative mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[820px]">
          {SUPPORTING_INSIGHTS.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 px-[17px] py-[17px] bg-white/[0.03] border border-white/[0.08] rounded-[10px]"
            >
              <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-white/[0.06] rounded-[5px]">
                <item.icon size={14} strokeWidth={2} className="text-white/90" aria-hidden="true" />
              </span>
              <div>
                <p className="font-body font-medium text-white/90 text-[14px] leading-[21px]">
                  {item.title}
                </p>
                <p className="font-body text-white/50 text-[12.8px] leading-[16.8px] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted-by logo strip — real Ken Research client logos, continuous
            auto-scrolling marquee (matches live's own implementation: a
            60s-linear-infinite track with edge fade masks, not a static
            wrapped row). Track is the logo list duplicated 2x — the
            translateX(-50%) loop only needs 2 copies to read as seamless;
            the 2nd copy is aria-hidden so the 8 logos aren't announced twice. */}
        <div className="relative mt-10 sm:mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-[11px] font-semibold tracking-[0.15em] uppercase mb-5">
            Trusted by leading brands
          </p>
          <div className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-[var(--color-foundation-black,#0a0a0c)] to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-[var(--color-foundation-black,#0a0a0c)] to-transparent"
            />
            <div className="survey-hero-marquee-track flex w-max items-center gap-10">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
                  {TRUSTED_LOGOS.map((logo) => (
                    <Image
                      key={`${copy}-${logo.file}`}
                      src={`/images/logos/${logo.file}`}
                      alt={copy === 0 ? logo.name : ''}
                      width={120}
                      height={40}
                      className="h-6 sm:h-7 w-auto object-contain opacity-70"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
