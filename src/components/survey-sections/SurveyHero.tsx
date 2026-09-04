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
import { Users, CircleStar, Clock, ChartColumn, ArrowDown } from 'lucide-react';
import { Button } from '@/vendor/design-system/atoms';
import { VersionToggle, type ReviewVersion } from './VersionToggle';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/vendor/design-system/ui/breadcrumb';
import { Fragment, useEffect, useRef, useState } from 'react';

const BREADCRUMB_LEVELS = [
  { label: 'Home', href: '/' },
  { label: 'Ken Survey', href: '/survey' },
  { label: 'CNDP Survey', href: '/survey/cndp' },
  { label: 'Bank vs NBFC Preference Survey (SMEs)', href: '#' },
];

// Figma shows only the category pill, but live (re-verified at mobile + desktop,
// 2026-08-26) ships both — explicit call to match live exactly for this element.
const PILLS = ['Survey', 'SME LENDING & FINANCE'];

/** Same live dashboard the Interactive Dashboard section embeds — never a
 *  screenshot, never fabricated UI. The teaser is a CROP of it. */
const DASHBOARD_URL = 'https://ken-research-b2b-importer-dashboard.vercel.app/';

/** Existing anchor on DashboardPreviewSection (which already carries
 *  `scroll-mt-[120px]`). No new route, no new id invented. */
const DASHBOARD_ANCHOR = '#dashboard-preview';

/** Iframe layout size — a realistic desktop window, so the dashboard lays out
 *  its true desktop composition (sidebar + KPI grid + charts) rather than a
 *  stacked responsive variant that would then be cropped into nonsense. */
const TEASER_IFRAME_W = 1280;
const TEASER_IFRAME_H = 880;

/** How much of that layout the teaser frame reveals; the remainder is
 *  deliberately cropped past the right and bottom edges. At the 3:2 frame this
 *  shows the app header, filter bar, sidebar, the first KPI row and the top of
 *  the first chart — and cuts the donut chart and lower rows off, which is what
 *  says "there is more of this below". The tighter small-screen reveal keeps
 *  the crop legible instead of shrinking the whole app to illegibility. The
 *  16:10 frame matches the aspect DashboardPreviewSection's own StaticEmbed
 *  uses, so the page's two dashboard surfaces agree.
 *
 *  Reveal is DERIVED from a target on-screen scale rather than being a
 *  hard-coded width per breakpoint. A fixed reveal made the apparent size of
 *  the dashboard swing with the frame — at a 588px frame it clamped to scale 1
 *  and showed only 46% of the app, so the content read LARGER on desktop than
 *  on a narrow window. Deriving it keeps the app at a consistent ~0.68 on every
 *  screen; the bounds only bite at the extremes (the floor keeps phone text
 *  legible, the ceiling stops a wide frame revealing so much that nothing is
 *  cropped). */
const TEASER_TARGET_SCALE = 0.68;
const TEASER_REVEAL_MIN = 560;
const TEASER_REVEAL_MAX = 1000;

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

/** The approved hero copy block — identical markup in V1 and V2, only the
 *  wrapper width differs, so the two directions can never drift apart. */
function HeroCopy({ className }: { className: string }) {
  return (
    <div className={className}>
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
  );
}

/**
 * DashboardTeaser — a curated crop of the real dashboard (V2 only).
 *
 * @what  A large, cropped window onto the live dashboard: app header, filter
 *        bar, sidebar, first KPI row and the top of the first chart. The donut
 *        chart, lower KPI rows and right-hand actions fall outside the frame on
 *        purpose — the crop is the message.
 * @why   Proves the dashboard is a real deliverable, and points at the full
 *        experience further down the page instead of duplicating it. Not a
 *        marketing illustration: it is the actual product surface.
 * @how   The iframe is laid out at a full desktop size and scaled to fit, with
 *        `transform-origin: top left`, inside an `overflow-hidden` frame — so
 *        the frame crops rather than the app re-flowing into a narrow layout.
 *        Scale is derived from the measured frame width against a fixed reveal
 *        width, so the SAME slice of the dashboard is framed at every viewport.
 *
 *        `pointer-events: none` on the iframe means the whole teaser is one
 *        link target: clicks anywhere land on the anchor, never inside the
 *        embedded app. The anchor is a plain in-page `#dashboard-preview` —
 *        smooth scrolling comes from the DS's own `html { scroll-behavior:
 *        smooth }`, which already degrades to `auto` under
 *        `prefers-reduced-motion`. No JS scroll handler, no route, no modal.
 *
 *        The iframe mounts only after first paint, and only in V2, so the
 *        default (V1) page load never fetches a third-party app at all.
 */
function DashboardTeaser() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      const reveal = Math.min(
        TEASER_REVEAL_MAX,
        Math.max(TEASER_REVEAL_MIN, w / TEASER_TARGET_SCALE),
      );
      // Never exceed 1: upscaling a live iframe softens its text, the exact
      // failure the dashboard section is built to avoid.
      setScale(Math.min(1, w / reveal));
    };

    measure();
    window.addEventListener('resize', measure);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, []);

  // Deferred one tick past first paint so a third-party app can never sit on
  // the hero's own LCP.
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <a
      href={DASHBOARD_ANCHOR}
      data-component="HeroDashboardTeaser"
      aria-label="Explore the interactive dashboard — jumps to the Interactive Dashboard section below"
      className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-element,5px)] border border-white/10 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-foundation-black,#0a0a0c)]"
    >
      <div
        ref={frameRef}
        className="absolute inset-0 overflow-hidden rounded-[var(--radius-element,5px)] bg-white"
      >
        {mounted && scale > 0 ? (
          <iframe
            src={DASHBOARD_URL}
            title="Preview of the Ken Research interactive survey dashboard"
            // Decorative duplicate of the embed further down the page: kept out
            // of the a11y tree and out of the tab order so it is not announced
            // or entered twice.
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{ width: TEASER_IFRAME_W, height: TEASER_IFRAME_H, transform: `scale(${scale})` }}
            sandbox="allow-scripts"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : null}
      </div>

      {/* Hover/focus treatment — a light scrim only, so the dashboard stays
          clearly readable underneath. Tailwind scopes `hover:` to
          `@media (hover: hover)`, so touch devices never get a stuck state. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[var(--color-foundation-black,#0a0a0c)]/0 transition-colors duration-300 group-hover:bg-[var(--color-foundation-black,#0a0a0c)]/25 group-focus-visible:bg-[var(--color-foundation-black,#0a0a0c)]/25"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 inline-flex translate-y-1 items-center gap-2 rounded-[var(--radius-inner,3px)] bg-[var(--color-foundation-black,#0a0a0c)]/70 px-3 py-2 font-body text-[13px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        Explore Dashboard
        <ArrowDown size={14} strokeWidth={2} className="text-white/80" />
      </span>
    </a>
  );
}

export function SurveyHero() {
  /** Local review state — V1 is the approved hero and stays the default. */
  const [version, setVersion] = useState<ReviewVersion>('v1');

  return (
    <section
      aria-label="Survey hero"
      data-component="SurveyHero"
      className="relative w-full overflow-hidden bg-[var(--color-foundation-black,#0a0a0c)]"
    >
      <div className="relative mx-auto max-w-[var(--container-page,1240px)] px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        {/* Absolutely positioned so V1's own flow is untouched by its presence. */}
        <VersionToggle
          version={version}
          onChange={setVersion}
          tone="dark"
          name="HeroVersionToggle"
          ariaLabel="Hero presentation version"
          className="absolute right-4 top-6 z-30 sm:right-6 lg:right-8"
        />

        {version === 'v1' ? <HeroIllustration /> : null}

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

        {version === 'v1' ? (
          <HeroCopy className="relative max-w-[720px] space-y-5" />
        ) : (
          /* V2 — copy column narrowed to 46% so the dashboard teaser gets 54%.
             `minmax(0,…)` on both tracks stops the iframe's fixed layout width
             from blowing the grid out.

             The teaser deliberately does NOT bleed to the viewport edge. An
             earlier pass ran it flush right, which left a 0px right gutter
             against the copy's 152px left gutter — and every other band in this
             hero (insight cards, logo strip) respects the container gutter, so
             the teaser was the only element breaking the page's rhythm. It now
             ends on the same grid line as everything else: symmetric gutters,
             with the crop produced inside the frame rather than by the viewport
             clipping it. */
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-12">
            <HeroCopy className="relative space-y-5" />
            <DashboardTeaser />
          </div>
        )}

        {/* Supporting insight blocks — bordered cards, matching the live page
            exactly (this was previously de-boxed in error; the live page keeps
            these contained).

            V1 only. In V2 the dashboard teaser already carries the "what you
            get" job visually, and these two cards restated it in prose directly
            under it — so V2 drops them and lets the teaser do the work. V1 is
            the approved live-matching hero and keeps them. */}
        {version === 'v1' ? (
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
        ) : null}

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
