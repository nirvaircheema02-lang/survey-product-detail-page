/**
 * RevealImage
 *
 * WHY · Images that pop in without transition create a jarring "blink" in card grids,
 *        especially on slow connections. Wrapping in a fade-on-load molecule gives a
 *        polished reveal without requiring per-site CSS duplication.
 * WHAT · Wraps ImageWithFallback with an opacity-0 → 1 transition on the native `onLoad`
 *        event. Props: all `ImgHTMLAttributes<HTMLImageElement>` plus placeholderBg
 *        (string, default "rgba(0,0,0,0.04)") for the loading state background.
 * WHEN · Any image inside a card or feature section where a smooth load-in is desirable.
 *        Best used when the parent container already has a fixed aspect ratio so the
 *        placeholder doesn't collapse.
 * WHEN NOT · Don't use for hero images where the LCP image must load immediately visible
 *             (opacity: 0 delays perceived load). Don't use inside <picture> or Next.js
 *             `<Image>` — use ImageWithFallback directly instead.
 * WHERE · Available for card usage · no direct project-level consumer identified
 * HOW ·
 *   ```tsx
 *   <RevealImage src="/covers/rpt-001.jpg" alt="Report cover" className="w-full h-full object-cover" />
 *   ```
 *
 * @reusabilityScore 2     // utility wrapper · used sparingly in card contexts
 * @a11y_status pending-review  // relies on ImageWithFallback for alt text enforcement
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useState, type ImgHTMLAttributes } from "react";
import { ImageWithFallback } from '../atoms/ImageWithFallback';

interface RevealImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholderBg?: string;
}

export function RevealImage({ placeholderBg = "rgba(0,0,0,0.04)", className = "", style, ...rest }: RevealImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <ImageWithFallback
      data-component="RevealImage"
      {...rest}
      className={className}
      style={{
        ...style,
        backgroundColor: placeholderBg,
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onLoad={() => setLoaded(true)}
    />
  );
}
