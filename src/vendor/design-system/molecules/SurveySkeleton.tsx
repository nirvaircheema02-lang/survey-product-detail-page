/**
 * SurveySkeleton
 *
 * WHY · Survey listing pages need a content-aware shimmer placeholder that mirrors the
 *        exact structure of SurveyCard (grid and list variants) during data fetching.
 *        Using SkeletonCard here would produce wrong structure (image area + no progress bar).
 * WHAT · Shimmer-animated placeholder matching SurveyCard `grid` (badge row → icon+title →
 *        description → meta → progress bar → footer) or `list` (accent bar → icon →
 *        title+meta → progress → status+date → CTA) layout. Props: variant ("grid"|"list",
 *        default "grid"), className.
 * WHEN · Render N SurveySkeletons while survey listing data is loading. Match N to the
 *        grid column count × 1-2 rows for layout continuity.
 * WHEN NOT · Don't use for report data loading — use SkeletonCard. Don't show after data
 *             has resolved — replace immediately with SurveyCard instances.
 * WHERE · Surveys pillar pages (no current project consumer · DS sample page only)
 * HOW ·
 *   ```tsx
 *   {loading && Array.from({ length: 4 }).map((_, i) => (
 *     <SurveySkeleton key={i} variant="grid" />
 *   ))}
 *   ```
 *
 * @reusabilityScore 2     // Surveys pillar only · mirrors SurveyCard usage
 * @a11y_status reviewed-AA  // purely decorative shimmer · no interactive affordances
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */

interface SurveySkeletonProps {
  variant?: 'grid' | 'list';
  className?: string;
}

export function SurveySkeleton({ variant = 'grid', className }: SurveySkeletonProps) {
  if (variant === 'list') {
    return (
      <div
        data-component="SurveySkeleton"
        className={`flex bg-white overflow-hidden ${className ?? ''}`}
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 'var(--rc-radius-card)',
        }}
      >
        {/* Accent bar */}
        <div className="w-1.5 flex-shrink-0 skeleton-shimmer self-stretch" />

        {/* Icon */}
        <div className="flex items-center py-3 px-4 gap-4 flex-1 min-w-0">
          <div
            className="w-10 h-10 flex-shrink-0 skeleton-shimmer"
            style={{ borderRadius: 'var(--radius-element, 5px)' }}
          />

          {/* Title + meta */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="h-4 w-3/4 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
              <div className="h-3 w-20 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-shrink-0 w-24 hidden sm:flex flex-col gap-1">
            <div className="h-2.5 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
            <div className="h-1.5 w-full skeleton-shimmer" style={{ borderRadius: 'var(--radius-full)' }} />
          </div>

          {/* Status + date */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
            <div className="h-5 w-14 skeleton-shimmer" style={{ borderRadius: 'var(--radius-element, 5px)' }} />
            <div className="h-3 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 hidden sm:block">
            <div className="h-7 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-element, 5px)' }} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Grid Layout ─────────────────────────────
  return (
    <div
      data-component="SurveySkeleton"
      className={`bg-white overflow-hidden flex flex-col ${className ?? ''}`}
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 'var(--rc-radius-card)',
        padding: 'var(--card-padding-md, 16px)',
      }}
    >
      {/* Header: badge + status */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-20 skeleton-shimmer" style={{ borderRadius: 'var(--radius-full)' }} />
        <div className="h-5 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-element, 5px)' }} />
      </div>

      {/* Icon + title */}
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="w-8 h-8 flex-shrink-0 skeleton-shimmer"
          style={{ borderRadius: 'var(--radius-element, 5px)' }}
        />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-4 w-full skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
          <div className="h-4 w-2/3 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="h-3 w-full skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
        <div className="h-3 w-5/6 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-3 w-20 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
        <div className="h-3 w-12 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="h-3 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
          <div className="h-3 w-12 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
        </div>
        <div className="h-1.5 w-full skeleton-shimmer" style={{ borderRadius: 'var(--radius-full)' }} />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="h-3 w-16 skeleton-shimmer" style={{ borderRadius: 'var(--radius-inner, 2.5px)' }} />
        <div className="h-7 w-24 skeleton-shimmer" style={{ borderRadius: 'var(--radius-element, 5px)' }} />
      </div>
    </div>
  );
}