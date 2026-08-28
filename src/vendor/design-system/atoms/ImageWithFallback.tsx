import React, { useState } from 'react'

/**
 * ImageWithFallback — `<img>` drop-in that swaps to a neutral placeholder on load error.
 *
 * WHY:
 * - 3rd-party / user-uploaded images can 404 (deleted CDN asset · expired signed URL · broken refs)
 * - Broken-image-icon (browser default) looks unpolished + reveals failure to end user
 * - Need a quiet · branded · token-free fallback that keeps layout intact (no width/height collapse)
 * - Decouples image-failure handling from every consumer — single source of truth
 * - Preserves `data-original-url` for debugging in DevTools when fallback engages
 *
 * WHAT: Wraps native `<img>`. On `onError`, swaps to inline base64 SVG placeholder
 * (small camera/landscape icon at 30% opacity). Fallback renders inside `bg-gray-100`
 * container that keeps the original `className` + `style` so layout doesn't reflow.
 *
 * WHEN:
 * - User-generated content thumbnails (avatars · uploaded report covers)
 * - 3rd-party CDN imagery (industry logos · partner brand marks)
 * - Any `<img>` whose src is dynamic + not guaranteed to exist
 * - Card thumbnails in `ResourceCard` / `ReportCard` molecules
 *
 * WHEN NOT:
 * - Decorative images bundled w/ the build → use raw `<img>` (no failure mode)
 * - Hero / above-the-fold imagery → use Next `<Image>` w/ priority + explicit fallback page
 * - Icons → use Lucide React components (vector, never fails)
 * - SVG illustrations imported as React components
 *
 * HOW:
 * ```tsx
 * <ImageWithFallback
 *   src={report.coverUrl}
 *   alt={report.title}
 *   className="w-full aspect-video object-cover rounded-[5px]"
 * />
 * ```
 *
 * A11y: Passes through `alt` to working image. Fallback uses generic `"Error loading image"`
 *       alt — consider passing more context-aware alt via parent. `data-original-url` preserved
 *       for debugging.
 * Motion: None — purely state-driven swap on error event.
 * Anti-patterns:
 *  - ❌ Never use for decorative/static bundled imagery (over-engineering)
 *  - ❌ Never strip the fallback container `className` passthrough (would collapse layout)
 *  - ❌ Never replace base64 SVG w/ external asset (introduces 2nd failure point)
 *  - ❌ Never use as `<Image>` substitute on hero (no Next optimization · no priority hint)
 *
 * @lifecycle stable
 * @a11y_status pending-review (fallback alt is generic — consider context-aware)
 * @reusabilityScore 4/5 ⭐
 * @promotedFrom shadcn-figma utility · standard fallback pattern (no OG audit doc)
 */
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      data-component="ImageWithFallback"
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img data-component="ImageWithFallback" src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
