/**
 * CardReveal
 *
 * WHY · Listing grids with 20+ cards benefit from staggered entrance animation to reduce
 *        cognitive overload and add visual polish. Centralising the IntersectionObserver
 *        + prefers-reduced-motion logic in one wrapper prevents per-card duplication.
 * WHAT · Wrapper div that toggles `.card-reveal.is-visible` CSS class on viewport entry.
 *        Once revealed, stays revealed (one-shot). Props: children (ReactNode), delay (ms,
 *        default 0), className (string). CSS animation defined in DS base styles.
 * WHEN · Wrap each card in a grid or list that should animate in as the user scrolls.
 *        Use `delay` for stagger effect (e.g., index * 50ms per grid column).
 * WHEN NOT · Don't use on above-the-fold hero content — it should be immediately visible.
 *             Don't use inside HorizontalScroll (scroll container clips the entrance).
 *             Prefer Framer Motion `useInView` for scroll-scrubbed (not one-shot) effects.
 * WHERE · report-store-legacy CardListing.tsx · competition-benchmarking-listing-v02 CardListing.tsx
 * HOW ·
 *   ```tsx
 *   {reports.map((r, i) => (
 *     <CardReveal key={r.id} delay={i * 40}>
 *       <ReportCard {...r} />
 *     </CardReveal>
 *   ))}
 *   ```
 *
 * @reusabilityScore 3     // used across listing grids in 2 projects
 * @a11y_status reviewed-AA  // prefers-reduced-motion check in useEffect; skips animation
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useRef, useEffect, useState, type ReactNode } from "react";

interface CardRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function CardReveal({ children, delay = 0, className = "" }: CardRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "50px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div
      data-component="CardReveal"
      ref={ref}
      className={`card-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
