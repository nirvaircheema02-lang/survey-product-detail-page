import * as React from "react";

import { cn } from "./utils";

/**
 * Input — shadcn/ui base, aligned to DS v4.2 unified input system.
 *
 * 6-STATE COLOR SYSTEM (monochromatic black/opacity):
 *   Default  → border-black/10, text-black/90, placeholder-black/30, bg-white
 *   Hover    → border-black/25  (Weber's Law: 150% increase = clearly noticeable)
 *   Focus    → border-black/90  (border-color change, NO ring — inputs already have borders)
 *   Filled   → border-black/15  (slightly stronger = "has content" signal)
 *   Error    → border via aria-invalid + var(--brand-red)
 *   Disabled → border-black/6, text-black/35, bg-black/[0.03], cursor-not-allowed
 *
 * RADIUS: rounded-[5px] = var(--radius-element) = var(--radius-xs)
 * FOCUS: Border-color change only — no outline ring (suppressed globally in CSS).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-[5px] border border-black/10 bg-white px-3 py-1 text-black/90 placeholder:text-black/30 transition-colors duration-150 outline-none",
        "hover:border-black/25",
        "focus:border-black/90 focus:outline-none focus-visible:outline-none",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:border-[var(--brand-red)] aria-invalid:text-black/90",
        "disabled:border-black/6 disabled:bg-black/[0.03] disabled:text-black/35 disabled:placeholder:text-black/20 disabled:pointer-events-none disabled:cursor-not-allowed",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };