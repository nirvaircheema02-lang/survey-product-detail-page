'use client';

/**
 * DashboardPreviewSection — "Interactive Dashboard" (scale focus)
 *
 * @what  The REAL Ken Research B2B-importer dashboard, embedded live and
 *        interactive. Desktop: a large centred preview that pins, scales up in
 *        place to fill the viewport band, holds there fully interactive, then
 *        scales back down and releases. Mobile/tablet + reduced motion: the same
 *        dashboard embedded at a large static size, no choreography.
 * @why   Replaces a screenshot + hover-CTA + redirect. The experience IS the
 *        CTA — there is deliberately no "Open Dashboard" button, no modal, no
 *        new tab, no feature-card list (the live dashboard demonstrates its own
 *        filters/KPIs/exports far better than copy describing them).
 * @how   Verified before building (2026-08-28): the dashboard origin sends NO
 *        `X-Frame-Options` and NO CSP `frame-ancestors`, and an iframe probe
 *        from this origin fired `load` with zero console errors — embedding is
 *        permitted, not bypassed. It is also a FIXED APP-SHELL: at 1440x900 its
 *        document does not scroll vertically and has exactly one inner scroll
 *        pane, so it cannot fight the parent page for vertical scroll.
 *
 *        Three things protect against the nested-scroll trap:
 *        1. The iframe is `pointer-events: none` outside the hold, so wheel
 *           events over it always reach the page during the ramps.
 *        2. The stage keeps page surface above, below and either side of the
 *           card at every size.
 *        3. No wheel hijacking, no scroll locking, no carousel — the section is
 *           an ordinary tall block with an ordinary `position: sticky` child, so
 *           native scrolling (and backward scrolling) is never intercepted.
 *
 *        The site navbar is never touched: it stays visible throughout, and the
 *        card is centred in the band BELOW it so it can never grow underneath.
 *
 *        A V1 "scroll-to-immersive takeover" variant and a V1/V2 review toggle
 *        existed during design review; scale-focus was chosen as final and the
 *        scaffolding was removed. Both live in git history (see cf2e248).
 */
import { useEffect, useRef, useState } from 'react';
import {
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { SectionHeading, SectionLabel } from '@/vendor/design-system/atoms';

/** The real, deployed dashboard — never a screenshot, never fabricated UI. */
const DASHBOARD_URL = 'https://ken-research-b2b-importer-dashboard.vercel.app/';

const DASHBOARD_TITLE =
  'Ken Research interactive survey dashboard — India B2B Importer Research Study';

const SUPPORTING_TEXT =
  'Every mandate ships with a live dashboard alongside the report. Explore the real thing below.';

// ─── Shared header block ──────────────────────────────────────────────────────

/** Eyebrow + heading + one line of support. */
function DashboardHeader({ id }: { id: string }) {
  return (
    <div className="flex flex-col gap-6">
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
 *        nothing. The header is untouched, the site navbar is never hidden or
 *        moved, and the only property that ever animates is a single `scale`.
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
function ScaleFocusEmbed({ headingId }: { headingId: string }) {
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
        <DashboardHeader id={headingId} />
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

  // Desktop-only gate for the scale-focus experience. Tracked in state (not a
  // CSS breakpoint) because the two branches are genuinely different
  // DOM/behaviour, not one layout restyled.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Below lg, and at any width under reduced motion, the scroll choreography is
  // dropped entirely for the same dashboard embedded at a large static size.
  if (reducedMotion || !isDesktop) {
    return <StaticEmbed headingId={headingId} />;
  }

  return <ScaleFocusEmbed headingId={headingId} />;
}
