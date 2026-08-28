/**
 * SkeletonCard
 *
 * WHY · Listing pages that progressively load or fetch data need a content-aware shimmer
 *        placeholder that exactly mirrors the ReportCard layout (grid or list). Generic
 *        grey boxes break layout flow; SkeletonCard preserves the visual grid/list rhythm
 *        during loading states.
 * WHAT · Renders a shimmer-animated placeholder matching ReportCard `grid` layout (image
 *        aspect ratio → badge row → title lines → meta → footer) or `list` layout
 *        (thumbnail | content lines | date+CTA). Props: variant ("grid"|"list", default
 *        "grid"), aspectRatio (string, default "16/9"), className.
 * WHEN · Render N SkeletonCards while the initial fetch/load is in progress. N should
 *        match the expected grid column count × 1-2 rows for visual continuity.
 * WHEN NOT · Don't use for non-report data (survey listings → SurveySkeleton). Don't
 *             show SkeletonCard after data has loaded — swap to ReportCard immediately.
 * WHERE · report-store-legacy CardListing.tsx · competition-benchmarking-listing-v02 CardListing.tsx
 * HOW ·
 *   ```tsx
 *   {loading && Array.from({ length: 6 }).map((_, i) => (
 *     <SkeletonCard key={i} variant="grid" />
 *   ))}
 *   ```
 *
 * @reusabilityScore 3     // all listing pages using ReportCard
 * @a11y_status reviewed-AA  // purely decorative; no interactive affordances; aria-hidden via CSS shimmer
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */

interface SkeletonCardProps {
  variant?: "grid" | "list";
  aspectRatio?: string;
  className?: string;
}

export function SkeletonCard({ variant = "grid", aspectRatio = "16/9", className }: SkeletonCardProps) {
  if (variant === "list") {
    return (
      <div data-component="SkeletonCard" className={`flex bg-white overflow-hidden ${className || ""}`} style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: "var(--rc-radius-card)" }}>
        <div className="w-16 sm:w-20 flex-shrink-0 skeleton-shimmer self-stretch" />
        <div className="flex-1 min-w-0 flex flex-col py-2.5 px-3 sm:px-4 gap-2">
          <div className="h-4 w-20 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
          <div className="h-3.5 w-full skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
          <div className="h-3.5 w-2/3 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
          <div className="h-3 w-1/2 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
        </div>
        <div className="hidden sm:flex flex-col items-end flex-shrink-0 justify-between py-2.5 pr-4">
          <div className="h-3 w-16 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
          <div className="h-7 w-24 skeleton-shimmer" style={{ borderRadius: "var(--radius-element, 5px)" }} />
        </div>
      </div>
    );
  }

  return (
    <div data-component="SkeletonCard" className={`bg-white overflow-hidden flex flex-col ${className || ""}`} style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: "var(--rc-radius-card)" }}>
      <div className="w-full skeleton-shimmer" style={{ aspectRatio }} />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-4 w-20 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-full skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
          <div className="h-3.5 w-3/4 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
        </div>
        <div className="h-3 w-2/3 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
        <div className="h-3 w-1/2 skeleton-shimmer" style={{ borderRadius: "var(--radius-inner, 2.5px)" }} />
      </div>
    </div>
  );
}
