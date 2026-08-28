/**
 * BackToTop
 *
 * WHY · Long listing and report pages require a quick escape back to the top; native browser
 *        "back to top" UX is absent on most platforms. This molecule provides a persistent,
 *        scroll-triggered floating button without cluttering the initial viewport.
 * WHAT · Fixed-position circular button that appears after `threshold` px of scroll (default
 *        600px). Props: threshold (number), className (string). Animates in/out with
 *        scale + opacity; hidden from pointer events when invisible.
 * WHEN · Place once per page on any long-scroll surface: report store listing, case study,
 *        report PDP. Mobile positioning (bottom-16) clears the MobileFilterBar.
 * WHEN NOT · Don't use on short pages (<2× viewport height). Don't use more than once per page.
 * WHERE · report-store-legacy App.tsx · competition-benchmarking-listing-v02 App.tsx
 * HOW ·
 *   ```tsx
 *   <BackToTop threshold={600} />
 *   ```
 *
 * @reusabilityScore 4     // every long-scroll page in the workspace
 * @a11y_status reviewed-AA  // aria-label + tabIndex managed by visibility state
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export function BackToTop({ threshold = 600, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <button
      data-component="BackToTop"
      aria-label="Back to top"
      title="Scroll to top"
      className={`fixed bottom-16 right-4 lg:bottom-6 lg:right-6 z-50 w-11 h-11 flex items-center justify-center bg-white text-black/70 backdrop-blur-sm cursor-pointer shadow-md border border-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${className || ""}`}
      style={{
        borderRadius: "var(--radius-full)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(8px)",
        transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}