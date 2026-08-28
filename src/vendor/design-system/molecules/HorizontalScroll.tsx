/**
 * HorizontalScroll
 *
 * WHY · Analyst picks, featured carousels, and tag filters need a drag-scrollable
 *        horizontal track with mouse/touch/wheel support and fade-edge affordances.
 *        Native CSS `overflow-x: scroll` lacks the fade-mask + momentum physics needed
 *        for premium cinematic feel.
 * WHAT · Viewport div + CSS-transformed track. Handles wheel, touch swipe, mouse drag
 *        with momentum. Renders left/right chevron nav buttons on hover. Fade gradients
 *        indicate scrollability. Props: children (ReactNode), fadeBg (string, default
 *        "white"), gap (Tailwind class, default "gap-4"), className (string).
 * WHEN · Any horizontally scrollable carousel: AnalystPicks, TopDownloads,
 *        RecommendedForYou, ExploreByRegion, tag/filter chips row.
 * WHEN NOT · Don't use for vertical lists. Don't use when items should wrap to next
 *             line — use a flex-wrap container. Don't wrap CardReveal children inside
 *             HorizontalScroll (scroll container clips entrance animations).
 * WHERE · report-store-legacy AnalystPicks.tsx + TopDownloads.tsx + RecommendedForYou.tsx
 *          + ExploreByRegion.tsx + ListingContextBanner.tsx ·
 *          competition-benchmarking-listing-v02 AnalystPicks.tsx + TopDownloads.tsx +
 *          RecommendedForYou.tsx
 * HOW ·
 *   ```tsx
 *   <HorizontalScroll fadeBg="var(--warm-100)" gap="gap-3">
 *     {items.map((item) => <Card key={item.id} {...item} />)}
 *   </HorizontalScroll>
 *   ```
 *
 * @reusabilityScore 5     // used in 5+ sections across 2+ projects
 * @a11y_status pending-review  // keyboard scroll not wired; nav buttons have aria-label
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
  fadeBg?: string;
  gap?: string;
  className?: string;
}

export function HorizontalScroll({ children, fadeBg = "white", gap = "gap-4", className = "" }: HorizontalScrollProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const maxScrollRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const clamp = (val: number) => Math.max(0, Math.min(maxScrollRef.current, val));

  const applyTransform = useCallback((animated: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animated ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
    track.style.transform = `translateX(-${scrollPosRef.current}px)`;
  }, []);

  const updateFades = useCallback(() => {
    const pos = scrollPosRef.current;
    const max = maxScrollRef.current;
    setCanScrollLeft(pos > 2);
    setCanScrollRight(pos < max - 2);
  }, []);

  const scrollTo = useCallback((pos: number, animated: boolean) => {
    scrollPosRef.current = clamp(pos);
    applyTransform(animated);
    updateFades();
  }, [applyTransform, updateFades]);

  const updateBounds = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    maxScrollRef.current = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (scrollPosRef.current > maxScrollRef.current) scrollTo(maxScrollRef.current, false);
    updateFades();
  }, [scrollTo, updateFades]);

  useEffect(() => {
    updateBounds();
    const ro = new ResizeObserver(updateBounds);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [updateBounds, children]);

  const scrollByDirection = (direction: "left" | "right") => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const amount = viewport.clientWidth * 0.7;
    scrollTo(scrollPosRef.current + (direction === "left" ? -amount : amount), true);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (delta === 0) return;
      e.preventDefault();
      scrollTo(scrollPosRef.current + delta, false);
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [scrollTo]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let isDragging = false, startX = 0, startScroll = 0, lastX = 0, lastTime = 0, velocity = 0, hasMoved = false;

    const begin = (clientX: number) => {
      isDragging = true; hasMoved = false; startX = clientX; startScroll = scrollPosRef.current;
      lastX = clientX; lastTime = performance.now(); velocity = 0;
      const track = trackRef.current;
      if (track) {
        const ct = getComputedStyle(track).transform;
        if (ct && ct !== "none") { const m = new DOMMatrixReadOnly(ct); scrollPosRef.current = -m.m41; startScroll = scrollPosRef.current; }
        track.style.transition = "none";
      }
    };
    const move = (clientX: number) => {
      if (!isDragging) return;
      const dx = startX - clientX;
      if (Math.abs(dx) > 3) hasMoved = true;
      const now = performance.now(); const dt = now - lastTime;
      if (dt > 0) velocity = (lastX - clientX) / dt;
      lastX = clientX; lastTime = now;
      scrollTo(startScroll + dx, false);
    };
    const end = () => { if (!isDragging) return; isDragging = false; if (Math.abs(velocity) > 0.2) scrollTo(scrollPosRef.current + velocity * 250, true); };

    const onTouchStart = (e: TouchEvent) => begin(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => { move(e.touches[0].clientX); if (hasMoved) e.preventDefault(); };
    const onTouchEnd = () => end();
    const onMouseDown = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a, button, input, select, textarea, [role='button']")) return; e.preventDefault(); begin(e.clientX); };
    const onMouseMove = (e: MouseEvent) => { if (!isDragging) return; e.preventDefault(); move(e.clientX); };
    const onMouseUp = () => end();
    const onClick = (e: MouseEvent) => { if (hasMoved) { e.stopPropagation(); e.preventDefault(); } };

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("mousedown", onMouseDown);
    viewport.addEventListener("click", onClick, true);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("mousedown", onMouseDown);
      viewport.removeEventListener("click", onClick, true);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [scrollTo]);

  return (
    <div data-component="HorizontalScroll" className={`relative group/scroll ${className}`}>
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${fadeBg}, transparent)` }} />
          <button onClick={() => scrollByDirection("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-black/[0.06] opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1" aria-label="Scroll left">
            <ChevronLeft className="h-4 w-4 text-black/60" />
          </button>
        </>
      )}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${fadeBg}, transparent)` }} />
          <button onClick={() => scrollByDirection("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-black/[0.06] opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1" aria-label="Scroll right">
            <ChevronRight className="h-4 w-4 text-black/60" />
          </button>
        </>
      )}
      <div ref={viewportRef} style={{ overflowX: "clip", overflowY: "visible" }}>
        <div ref={trackRef} className={`flex ${gap}`} style={{ cursor: "grab", willChange: "transform" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
