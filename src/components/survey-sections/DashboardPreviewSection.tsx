'use client';

/**
 * DashboardPreviewSection — "Interactive Dashboard" (scroll-to-immersive)
 *
 * @what  The REAL Ken Research B2B-importer dashboard, embedded live and
 *        interactive. Desktop: a tall scroll region containing a sticky 100vh
 *        stage. As the user scrolls, the editorial header fades out and the
 *        dashboard frame grows from a contained editorial figure (68vw) to a
 *        near-full-viewport immersive stage (97.5vw), where it becomes fully
 *        interactive — real filters, sidebar navigation, chart interactions.
 *        Scrolling on past reverses the whole thing back into page flow.
 *        Mobile/tablet + reduced-motion: the same real dashboard, embedded
 *        directly at a large static size, no expansion choreography.
 * @why   Replaces a screenshot + hover-CTA + redirect. The experience IS the
 *        CTA — there is deliberately no "Open Dashboard" button, no modal, no
 *        new tab, no feature-card list (the live dashboard demonstrates its own
 *        filters/KPIs/exports far better than copy describing them).
 * @how   Verified before building (2026-08-28): the dashboard origin sends NO
 *        `X-Frame-Options` and NO CSP `frame-ancestors`, and an iframe probe
 *        from this origin fired `load` with zero console errors — embedding is
 *        permitted, not bypassed. It is also a FIXED APP-SHELL: at 1440x900 its
 *        document does not scroll vertically and has exactly one inner scroll
 *        pane, so it can't fight the parent page for vertical scroll the way a
 *        long document in an iframe would.
 *
 *        Three things protect against the nested-scroll trap the brief warns of:
 *        1. The iframe is `pointer-events: none` during expand/collapse, so
 *           wheel events over it always reach the page. It only becomes
 *           interactive once the stage has fully settled.
 *        2. The immersive stage stops just short of the viewport (97.5vw /
 *           93vh), leaving a thin margin of page surface on all sides. That
 *           margin is now small, so the primary guarantee is the measured
 *           scroll-chaining below, not the gutter.
 *        3. No wheel hijacking, no scroll locking, no carousel — the section is
 *           an ordinary tall block with an ordinary `position: sticky` child, so
 *           native scrolling (and backward scrolling) is never intercepted.
 *
 *        One motion value drives everything: `expand` maps section progress
 *        0→1→1→0 across [enter · hold · exit], so the exit is the entry played
 *        backwards for free and backward scrolling reverses correctly by
 *        construction rather than by a second set of rules.
 *
 *        Navbar: NOT rewritten and NOT wrapped (wrapping would break its
 *        `position: sticky`, since a wrapper becomes its sticky containing
 *        block). Instead this section toggles `data-dashboard-immersive` on
 *        <body>; a scoped rule in globals.css translates/fades the navbar's two
 *        bands while that attribute is set, and is completely inert otherwise.
 *
 *        Two presentation modes share this one dashboard, switched by a small
 *        V1/V2 segmented toggle in the section header (stakeholder review):
 *          V1 `ImmersiveEmbed`   — the approved scroll-to-immersive takeover:
 *                                  header fades, frame travels and grows to
 *                                  near-fullscreen, site navbar retreats.
 *          V2 `ScaleFocusEmbed`  — scale-focus: a large centred preview that
 *                                  pins, then scales up in place about a fixed
 *                                  centre via `transform` alone (no reflow, no
 *                                  travel) to fill the band below the navbar,
 *                                  holds interactive, and scales back down.
 *                                  Header untouched, navbar visible throughout.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { SectionHeading, SectionLabel } from '@/vendor/design-system/atoms';
import { VersionToggle, type ReviewVersion } from './VersionToggle';

/** The real, deployed dashboard — never a screenshot, never fabricated UI. */
const DASHBOARD_URL = 'https://ken-research-b2b-importer-dashboard.vercel.app/';

const DASHBOARD_TITLE =
  'Ken Research interactive survey dashboard — India B2B Importer Research Study';

const SUPPORTING_TEXT =
  'Every mandate ships with a live dashboard alongside the report. Explore the real thing below.';

/**
 * Scroll choreography, as fractions of the section's own scroll progress.
 * Section is 360vh tall with a 100vh sticky stage → 260vh of scrollable travel:
 *   enter   0 → .18  ≈  47vh of scroll  (settles early — see note below)
 *   hold  .18 → .68  ≈ 130vh            (stable immersive region)
 *   exit  .68 → 1    ≈  83vh            (unchanged)
 *
 * ENTRY TIMING (tightened 2026-08-28): the entry ran to .42 (≈109vh) which
 * read as sluggish — the dashboard was still growing long after the user had
 * committed to the section. Shortened to .18 so it settles into the immersive
 * position early, while still ramping across ~420px of scroll at 900px tall,
 * which is several wheel notches: fast, but nowhere near a jump. ONLY the
 * entry moved; the hold's end, the exit ramp, and the reverse are untouched,
 * so the approved return-to-original-position behaviour is bit-identical.
 */
const ENTER_END = 0.18;
const HOLD_END = 0.68;

/**
 * Interactivity is armed strictly INSIDE the hold, never mid-motion — tracked
 * to ENTER_END (not left at its old .44) so the shortened entry doesn't leave
 * a dead stretch where the dashboard looks immersive but ignores clicks.
 * The disarm point is exit-side and therefore unchanged.
 */
const INTERACTIVE_FROM = 0.22;
const INTERACTIVE_TO = 0.66;

/**
 * Navbar retreats late in the expansion and returns early in the exit. The
 * hide point is kept at the SAME relative position within the entry
 * (.30/.42 ≈ .71 → .71 × .18 ≈ .13), so the retreat still lands just as the
 * dashboard reaches full size rather than after it. Return point unchanged.
 */
const NAV_HIDE_FROM = 0.13;
const NAV_HIDE_TO = 0.78;

/** V1 = scroll-to-immersive takeover · V2 = fixed-position scale focus. Same dashboard in both. */
export type DashboardVersion = ReviewVersion;

// ─── Shared header block ──────────────────────────────────────────────────────

/**
 * Eyebrow + heading + one line of support, with the version toggle right-aligned
 * on the same row at lg+ and dropping below the copy on narrower widths.
 */
function DashboardHeader({ id, toggle }: { id: string; toggle?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
      <div className="min-w-0">
        <div className="mb-3 inline-flex">
          <SectionLabel background="light" variant="accent">
            Interactive Dashboard
          </SectionLabel>
        </div>
        <SectionHeading level={2} id={id} className="mb-4">
          See your survey findings in an interactive dashboard
        </SectionHeading>
        <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[60ch]">
          {SUPPORTING_TEXT}
        </p>
      </div>
      {toggle ? <div className="shrink-0 lg:pt-1">{toggle}</div> : null}
    </div>
  );
}

// ─── The live embed ───────────────────────────────────────────────────────────

/**
 * Mounts the iframe only once the section is near the viewport, so a heavy
 * third-party app isn't fetched on initial page load — but with a generous
 * rootMargin so it is always ready well before the user can reach it.
 */
function useNearViewport(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near]);
  return near;
}

function DashboardFrame({ mounted, interactive }: { mounted: boolean; interactive: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[var(--radius-element,5px)] bg-[var(--color-foundation-white)]"
      // `pointer-events` is the nested-scroll guard: until the stage has settled,
      // the iframe cannot swallow wheel events, so the page always scrolls.
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      {mounted ? (
        <iframe
          src={DASHBOARD_URL}
          title={DASHBOARD_TITLE}
          className="h-full w-full border-0"
          // Same-origin is deliberately NOT granted — the embed needs none of it.
          sandbox="allow-scripts allow-popups allow-forms"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        // Neutral placeholder — never a fake dashboard, just the frame's own bg.
        <div aria-hidden="true" className="h-full w-full bg-[var(--warm-200,#f9f7f6)]" />
      )}
    </div>
  );
}

// ─── Simple embed — mobile/tablet, and reduced motion at any width ───────────

function StaticEmbed({ headingId }: { headingId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useNearViewport(ref);

  return (
    <section
      id="dashboard-preview"
      aria-labelledby={headingId}
      className="bg-[var(--color-foundation-white)] py-12 md:py-20 scroll-mt-[120px]"
    >
      <div className="mx-auto max-w-[var(--container-page)] px-4 sm:px-6 md:px-8">
        <DashboardHeader id={headingId} />

        <div
          ref={ref}
          className="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-element,5px)] border border-[var(--border-soft)] shadow-[var(--shadow-lg)] sm:aspect-[16/10]"
        >
          <DashboardFrame mounted={mounted} interactive />
        </div>
      </div>
    </section>
  );
}

// ─── Scroll-to-immersive — desktop ───────────────────────────────────────────

function ImmersiveEmbed({ headingId, toggle }: { headingId: string; toggle?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mounted = useNearViewport(sectionRef);

  const [interactive, setInteractive] = useState(false);

  /**
   * Section progress, 0→1, measured explicitly rather than via framer's
   * `useScroll({ target })`. That hook measured this particular section as a
   * dead range (verified: its change event never fired once across a clean
   * rebuild, so every derived value stayed pinned at 0). A direct
   * rect-based reading is equivalent — `-top / (height - viewportHeight)` is
   * exactly the `['start start', 'end end']` range — and it is deterministic
   * and inspectable, which matters more here than hook brevity. The same
   * plain-listener approach already drives ExecutionProcessSection.
   *
   * Measured synchronously in the passive listener, deliberately NOT
   * rAF-coalesced: an rAF latch (`if (pending) return`) deadlocks wherever rAF
   * is throttled — a backgrounded/hidden tab never runs the callback, so the
   * latch never clears and progress freezes at whatever it was (reproduced
   * exactly that way here). One getBoundingClientRect on one element per scroll
   * event is cheap, and is what this page's other scroll tracker already does.
   *
   * A ResizeObserver re-measures too, because the first reading happens during
   * hydration when layout above this section may still be settling.
   */
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        scrollYProgress.set(0);
        return;
      }
      const raw = -rect.top / travel;
      scrollYProgress.set(raw < 0 ? 0 : raw > 1 ? 1 : raw);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      ro.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [scrollYProgress]);

  /**
   * The single source of truth: 0 → 1 → 1 → 0 across enter / hold / exit.
   * Because it is symmetric, the exit is the entrance reversed and backward
   * scrolling reverses correctly without any second code path.
   * V2 does not use this curve at all — it is a separate, animation-free
   * component, so nothing here has to branch on presentation mode.
   */
  const expand = useTransform(
    scrollYProgress,
    [0, ENTER_END, HOLD_END, 1],
    [0, 1, 1, 0],
  );

  // Frame geometry — resized responsively rather than transform-scaled, so the
  // dashboard re-lays-out at its real resolution and its text never goes blurry.
  //
  // Immersive endpoints tightened 2026-08-28 (94vw/88vh → 97.5vw/93vh): the old
  // 3vw/6vh gutters read as dead whitespace rather than intentional margin.
  // 97.5vw is deliberately under 100 — `vw` includes the scrollbar gutter, so
  // 100vw would overflow the content box on any scrollbar-present viewport;
  // 97.5vw of 1440 = 1404px against a ~1425px content area, which clears it
  // with room to spare. `topVh` is (100 − heightVh) / 2 = 3.5 so the frame stays
  // exactly centred vertically. Only the endpoints moved — the start values,
  // the easing, and everything the `expand` curve drives are untouched.
  const widthVw = useTransform(expand, [0, 1], [68, 97.5]);
  const heightVh = useTransform(expand, [0, 1], [56, 93]);
  const topVh = useTransform(expand, [0, 1], [36, 3.5]);

  const frameWidth = useMotionTemplate`${widthVw}vw`;
  const frameHeight = useMotionTemplate`${heightVh}vh`;
  const frameTop = useMotionTemplate`${topVh}vh`;

  // Editorial header yields to the dashboard early in the expansion.
  const headerOpacity = useTransform(expand, [0, 0.55], [1, 0]);
  const headerY = useTransform(expand, [0, 0.55], [0, -24]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const shouldInteract = v >= INTERACTIVE_FROM && v <= INTERACTIVE_TO;
    setInteractive((prev) => (prev === shouldInteract ? prev : shouldInteract));

    const hideNav = v >= NAV_HIDE_FROM && v <= NAV_HIDE_TO;
    // Reused, never rewritten: globals.css owns the transition, this only flips
    // the flag. Cleaned up on unmount below so it can never leak to other pages.
    if (document.body.dataset.dashboardImmersive === 'true' !== hideNav) {
      if (hideNav) document.body.dataset.dashboardImmersive = 'true';
      else delete document.body.dataset.dashboardImmersive;
    }
  });

  useEffect(() => {
    return () => {
      delete document.body.dataset.dashboardImmersive;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="dashboard-preview"
      aria-labelledby={headingId}
      className="relative bg-[var(--color-foundation-white)] scroll-mt-[120px]"
      style={{ height: '360vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Editorial header — normal flow at the top of the stage. */}
        <motion.div
          className="mx-auto max-w-[var(--container-page)] px-4 pt-[12vh] sm:px-6 md:px-8"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <DashboardHeader id={headingId} toggle={toggle} />
        </motion.div>

        {/* Dashboard frame — absolutely placed so the header fading out can
            never shove it around, and so its box can grow independently. */}
        <motion.div
          className="absolute overflow-hidden rounded-[var(--radius-element,5px)] border border-[var(--border-soft)] shadow-[var(--shadow-lg)]"
          style={{
            width: frameWidth,
            height: frameHeight,
            top: frameTop,
            left: '50%',
            x: '-50%',
          }}
        >
          <DashboardFrame mounted={mounted} interactive={interactive} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── V2 — scale focus ─────────────────────────────────────────────────────────

/**
 * V2 geometry.
 *
 * The card's LAYOUT BOX is fixed at the enlarged size and never changes; only a
 * `transform: scale()` on that outer frame changes. This is the core of the
 * design:
 *
 *   · A transform does not participate in layout, so scaling literally cannot
 *     move anything — not the card, not the heading, not the section below it.
 *     Zero layout shift is structural here, not something to be tuned.
 *   · The iframe keeps ONE layout width for the entire interaction, so the
 *     dashboard never re-flows mid-animation. Resizing the box instead would
 *     make the embedded app re-lay-out on every scroll tick — sidebar, legends
 *     and chart rows shifting under a frame that is itself changing size.
 *   · The focus state is scale(1) — pixel-native, so the state the user actually
 *     reads is perfectly crisp. Only the preview is downscaled, and downscaling
 *     never blurs the way upscaling does.
 *
 * Two independent heights, and it matters which is which:
 *
 *   CARD_VH  sizes the FOCUS state. Pushed to 88vh so the enlarged dashboard
 *            uses nearly the whole band below the navbar (~26px of margin at
 *            1440×900, ~18px at 1024×768) without ever clipping its own header
 *            row or filter bar.
 *   STAGE_VH sizes the RESTING composition, and is deliberately fitted to the
 *            PREVIEW (69vh ≈ preview height + ~25px), not to the focus card.
 *            The stage is what sets the whitespace around the card at rest, so
 *            hugging the preview is what keeps the release state tight; the
 *            focus card simply overflows the stage, harmlessly, since a
 *            transform is not clipped by its parent's height.
 *
 * The card centre sits at `NAV/2 + 50vh`, i.e. centred in the band between the
 * navbar and the viewport floor. That single expression keeps the focus card
 * clear of the navbar at every viewport height without a special case.
 */
const V2_NAV_H = 57; // px — measured height of the sticky Navbar
const V2_STAGE_VH = 69;
const V2_CARD_VW = 98;
const V2_CARD_VH = 88;

/**
 * Preview size, as a proportion of the focus size rather than a pixel width —
 * so it stays correctly weighted at 1024 and at 1920 instead of being tuned for
 * one screen. 0.72 shows substantially more of the dashboard than a small
 * thumbnail would (the KPI row, both charts and the full sidebar are legible),
 * while still leaving the scale-up a real 1.39× to perform.
 */
const V2_PREVIEW_RATIO = 0.72;

/**
 * Scroll budget in viewport heights, across the pinned span:
 *
 *   lead 0.2 · up 0.7 · hold 0.6 · down 0.7 · tail 0.15   = 2.35vh
 *
 * LEAD holds the preview perfectly still while the heading finishes scrolling
 * away above it, so at the moment the card starts growing nothing else on
 * screen is moving. TAIL does the same at the other end, so the card is never
 * mid-scale at the instant the stage unpins. The ramps are the longest part of
 * the budget on purpose — a scrub this gradual is what makes it read as
 * controlled rather than reactive.
 */
const V2_LEAD_VH = 0.2;
const V2_UP_VH = 0.7;
const V2_HOLD_VH = 0.6;
const V2_DOWN_VH = 0.7;
const V2_TAIL_VH = 0.15;
const V2_TRAVEL_VH = V2_LEAD_VH + V2_UP_VH + V2_HOLD_VH + V2_DOWN_VH + V2_TAIL_VH;
const V2_LEAD_END = V2_LEAD_VH / V2_TRAVEL_VH;
const V2_UP_END = (V2_LEAD_VH + V2_UP_VH) / V2_TRAVEL_VH;
const V2_HOLD_END = (V2_LEAD_VH + V2_UP_VH + V2_HOLD_VH) / V2_TRAVEL_VH;
const V2_DOWN_END = (V2_TRAVEL_VH - V2_TAIL_VH) / V2_TRAVEL_VH;

/**
 * easeInOutCubic. Flatter tangents at both ends than the stock `easeInOut`
 * (0.42/0.58), so the card eases out of rest and back into it without the small
 * kick a shallower curve gives at the moment motion starts and stops.
 */
const V2_EASE = cubicBezier(0.65, 0, 0.35, 1);

/**
 * Light spring on the final scale. Scroll events are discrete and irregularly
 * spaced — especially on a trackpad — so a directly-mapped scrub can micro-step.
 * Damping it removes that without meaningful lag, and because the spring settles
 * exactly on its target, the focus state still rests at precisely scale(1) and
 * stays pixel-native.
 */
const V2_SPRING = { stiffness: 210, damping: 38, mass: 0.55, restDelta: 0.0004 };

/** Armed only once the scale has fully settled — never during a ramp. */
const V2_INTERACTIVE_FROM = V2_UP_END + 0.015;
const V2_INTERACTIVE_TO = V2_HOLD_END - 0.015;

/**
 * V2: centred preview → scale up in place → sticky interactive → scale down.
 *
 * @what  The same live dashboard, presented first as a large centred preview at
 *        72% size. Once the section pins, the frame scales up in place to fill
 *        the viewport band, holds there fully interactive, scales back down, and
 *        releases into page flow.
 * @why   Deliberately NOT V1. V1 is a takeover: the header fades, the frame
 *        travels from 36vh up to 3.5vh and the site navbar retreats. V2 moves
 *        nothing. The header is untouched, the navbar is never touched (this
 *        component does not know `data-dashboard-immersive` exists), and the
 *        only property that ever animates is a single `scale`.
 * @how   The card is flex-centred in a pinned stage and scaled about its own
 *        centre (`transform-origin: center`). Because a transform is not layout,
 *        there is no x/y translation, no repositioning and no reflow of the card
 *        or of anything around it — the card cannot drift, by construction.
 *
 *        Ordering is enforced by the phase curve: pin → settle → scale → arm
 *        interactivity → hold → scale → settle → release. The stage pins BEFORE
 *        the scale rather than after, because those two cannot happen the other
 *        way round: an unpinned element scrolls with the page, so scaling it
 *        while unpinned would be exactly the vertical drift this design exists
 *        to avoid. Pinning first is what makes "in place" true.
 *
 *        Scroll safety: no wheel hijacking, no scroll locking — an ordinary tall
 *        block with an ordinary `position: sticky` child. The iframe is
 *        `pointer-events: none` outside the hold, so it can neither swallow the
 *        wheel events that drive the ramps nor be clicked mid-animation.
 */
function ScaleFocusEmbed({ headingId, toggle }: { headingId: string; toggle?: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const mounted = useNearViewport(railRef);
  const [interactive, setInteractive] = useState(false);

  /**
   * Rail progress 0→1 across the pinned span, measured the same explicit way as
   * V1 (see the note there on why `useScroll` is not used, and why this is read
   * synchronously in the passive listener rather than rAF-coalesced).
   * 0 = the stage has just pinned; 1 = it is about to release.
   */
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const measure = () => {
      const vh = window.innerHeight;
      // Mirrors the stage's CSS `top` exactly — see the style prop below.
      const stageTop = ((50 - V2_STAGE_VH / 2) / 100) * vh + V2_NAV_H / 2;
      const stageH = (V2_STAGE_VH / 100) * vh;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - stageH;
      if (travel <= 0) {
        progress.set(0);
        return;
      }
      const raw = (stageTop - rect.top) / travel;
      progress.set(raw < 0 ? 0 : raw > 1 ? 1 : raw);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      ro.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [progress]);

  /**
   * 0 = preview, 1 = focus. Flat at both ends (lead / tail) and symmetric, so
   * the scale-down is the scale-up played backwards and reverse scrolling is
   * correct by construction rather than by a second set of rules.
   */
  const focus = useTransform(
    progress,
    [0, V2_LEAD_END, V2_UP_END, V2_HOLD_END, V2_DOWN_END, 1],
    [0, 0, 1, 1, 0, 0],
    { ease: [V2_EASE, V2_EASE, V2_EASE, V2_EASE, V2_EASE] },
  );

  /** The ONE animated property in the whole section. */
  const rawScale = useTransform(focus, [0, 1], [V2_PREVIEW_RATIO, 1]);
  const scale = useSpring(rawScale, V2_SPRING);

  useMotionValueEvent(progress, 'change', (v) => {
    const shouldInteract = v >= V2_INTERACTIVE_FROM && v <= V2_INTERACTIVE_TO;
    setInteractive((prev) => (prev === shouldInteract ? prev : shouldInteract));
  });

  return (
    <section
      id="dashboard-preview"
      aria-labelledby={headingId}
      className="relative bg-[var(--color-foundation-white)] py-12 md:py-20 scroll-mt-[120px]"
    >
      {/* Header stays in ordinary page flow — no motion, no pinning, no fade. */}
      <div className="mx-auto max-w-[var(--container-page)] px-4 sm:px-6 md:px-8">
        <DashboardHeader id={headingId} toggle={toggle} />
      </div>

      {/* Rail = stage height + pinned travel. No ancestor of the sticky child
          may carry `overflow: hidden` — that would make it the scroll container
          and silently break pinning — so neither the section nor the rail does. */}
      <div
        ref={railRef}
        className="relative mt-4 md:mt-6"
        style={{ height: `${V2_STAGE_VH + V2_TRAVEL_VH * 100}vh` }}
      >
        <div
          className="sticky flex items-center justify-center"
          style={{
            // Centres the stage — and therefore the card — in the band between
            // the navbar and the viewport floor: NAV/2 + 50vh − STAGE/2.
            top: `calc(${50 - V2_STAGE_VH / 2}vh + ${V2_NAV_H / 2}px)`,
            height: `${V2_STAGE_VH}vh`,
          }}
        >
          {/* Fixed layout box, scaled about its own centre. Width/height are
              constants — only `scale` is a motion value — so the iframe holds a
              single layout for the whole interaction and never reflows. */}
          <motion.div
            className="shrink-0 overflow-hidden rounded-[var(--radius-element,5px)] border border-[var(--border-soft)] shadow-[var(--shadow-lg)]"
            style={{
              width: `${V2_CARD_VW}vw`,
              height: `${V2_CARD_VH}vh`,
              scale,
              transformOrigin: 'center center',
            }}
          >
            <div className="relative h-full w-full">
              <DashboardFrame mounted={mounted} interactive={interactive} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function DashboardPreviewSection() {
  const headingId = 'dashboard-preview-heading';
  const reducedMotion = useReducedMotion();

  /** Local review state — V1 is the default, per brief. */
  const [version, setVersion] = useState<DashboardVersion>('v1');

  // Desktop-only gate for the immersive experience. Tracked in state (not a CSS
  // breakpoint) because the two branches are genuinely different DOM/behaviour,
  // not one layout restyled — and because `useScroll` must not run against a
  // section that isn't the one on screen.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Reduced motion and below-lg both collapse to the same static embed, where
  // V1 and V2 would be visually identical — so the toggle is omitted there
  // rather than shipped as a control that appears to do nothing.
  if (reducedMotion || !isDesktop) {
    return <StaticEmbed headingId={headingId} />;
  }

  const toggle = (
    <VersionToggle
      version={version}
      onChange={setVersion}
      name="DashboardVersionToggle"
      ariaLabel="Dashboard presentation version"
    />
  );

  // Keyed so switching fully unmounts the other mode: that tears down V1's
  // scroll listener and runs its cleanup, which restores the navbar if the user
  // flips to V2 mid-immersive.
  return version === 'v1' ? (
    <ImmersiveEmbed key="v1" headingId={headingId} toggle={toggle} />
  ) : (
    <ScaleFocusEmbed key="v2" headingId={headingId} toggle={toggle} />
  );
}
