/**
 * ScrollFade
 *
 * WHY · Tag chips, category pills, and short carousels need native `overflow-x: auto`
 *        scroll (no JS-transform overhead) with fade-edge affordances. ScrollFade is a
 *        lighter sibling to HorizontalScroll — uses real CSS scroll, no momentum physics,
 *        suitable for shorter tracks where native scroll performance is acceptable.
 * WHAT · Overflow-x scroll container with left/right fade-gradient overlays and optional
 *        chevron navigation buttons on hover. Props: children (ReactNode), fadeBg (string,
 *        default "white"), fadeWidth (px, default 32), showButtons (bool, default false),
 *        className, style, innerClassName.
 * WHEN · Tag/chip rows, filter pill tracks, short feature carousels where native scroll
 *        is sufficient and JS-transform momentum is overkill.
 * WHEN NOT · Don't use for long card carousels (20+ cards) — use HorizontalScroll for
 *             momentum/drag support. Don't use when content must never be clipped (use flex-wrap).
 * WHERE · report-store-legacy IndustryReportSection.tsx + QuickAccess.tsx +
 *          competition-benchmarking-listing-v02 IndustryReportSection.tsx + QuickAccess.tsx
 * HOW ·
 *   ```tsx
 *   <ScrollFade fadeBg="var(--warm-100)" showButtons>
 *     {tags.map((tag) => <FilterChip key={tag} label={tag} />)}
 *   </ScrollFade>
 *   ```
 *
 * @reusabilityScore 3     // tag rows + short carousels in listing pages
 * @a11y_status pending-review  // nav buttons have aria-label; keyboard arrow scroll not wired
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useRef, useState, useEffect, useCallback, type ReactNode, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollFadeProps {
  children: ReactNode;
  fadeBg?: string;
  fadeWidth?: number;
  showButtons?: boolean;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
}

export function ScrollFade({ children, fadeBg = "white", fadeWidth = 32, showButtons = false, className = "", style, innerClassName = "" }: ScrollFadeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [update, children]);

  const scrollByAmount = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -(el.clientWidth * 0.6) : el.clientWidth * 0.6, behavior: "smooth" });
  }, []);

  return (
    <div data-component="ScrollFade" className={`relative ${showButtons ? "group/sf" : ""} ${className}`} style={style}>
      {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: fadeWidth, background: `linear-gradient(to right, ${fadeBg}, transparent)` }} />}
      {showButtons && canScrollLeft && (
        <button onClick={() => scrollByAmount("left")} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-black/[0.06] opacity-0 group-hover/sf:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1" aria-label="Scroll left">
          <ChevronLeft className="h-3.5 w-3.5 text-black/50" />
        </button>
      )}
      {canScrollRight && <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: fadeWidth, background: `linear-gradient(to left, ${fadeBg}, transparent)` }} />}
      {showButtons && canScrollRight && (
        <button onClick={() => scrollByAmount("right")} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-black/[0.06] opacity-0 group-hover/sf:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1" aria-label="Scroll right">
          <ChevronRight className="h-3.5 w-3.5 text-black/50" />
        </button>
      )}
      <div ref={scrollRef} className={`overflow-x-auto ${innerClassName}`} style={{ scrollbarWidth: "none" }} onScroll={update}>
        {children}
      </div>
    </div>
  );
}
