import * as React from "react";

import { cn } from "./utils";

/**
 * Textarea — shadcn/ui base, aligned to DS v4.2 unified input system.
 *
 * Same 6-state color system as Input (see ui/input.tsx docblock).
 * RADIUS: rounded-[5px] = var(--radius-element)
 * FOCUS: Border-color change only — no ring.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[5px] border border-black/10 bg-white px-3 py-2 text-black/90 placeholder:text-black/30 transition-colors duration-150 outline-none resize-none",
        "hover:border-black/25",
        "focus:border-black/90 focus:outline-none focus-visible:outline-none",
        "aria-invalid:border-[var(--brand-red)] aria-invalid:text-black/90",
        "disabled:border-black/6 disabled:bg-black/[0.03] disabled:text-black/35 disabled:placeholder:text-black/20 disabled:cursor-not-allowed",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };