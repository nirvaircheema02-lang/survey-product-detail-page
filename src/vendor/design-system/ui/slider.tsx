"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabel,
  showValueTooltip = false,
  tooltipAlwaysVisible = false,
  tooltipPosition = "above",
  formatValue = (v: number) => String(v),
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Accessible name for the thumb(s) — Radix's `Root` does not forward `aria-label`
   * to the inner `Thumb`, which is the element that actually carries `role="slider"`.
   * Without this, screen readers announce an unnamed slider (axe: aria-input-field-name).
   * When multiple thumbs exist, the same label is applied to all of them; pass a more
   * specific label per-thumb by extending this prop if a two-handle range slider is added.
   */
  thumbLabel?: string;
  /** Shows a small value tooltip above/below the thumb while dragging or focused
   *  (or always — see tooltipAlwaysVisible). Opt-in — off by default so existing
   *  consumers are unaffected. @default false */
  showValueTooltip?: boolean;
  /** Show the tooltip regardless of drag/focus state — for a slider acting as a
   *  persistent live-value readout (e.g. the Commercial Terms calculator) rather
   *  than a drag-feedback affordance. @default false */
  tooltipAlwaysVisible?: boolean;
  /** 'below' renders the tooltip under the thumb with a small connecting tick,
   *  matching the live report-store calculator's slider. @default 'above' */
  tooltipPosition?: "above" | "below";
  /** Formats the value shown in the tooltip. @default String(value) */
  formatValue?: (value: number) => string;
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const [activeThumb, setActiveThumb] = React.useState<number | null>(null);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          // bg-muted (--black-50/#fafafa) reads as almost no track at all against a
          // white section — bumped to bg-input (--black-200/#e5e5e5), the same family
          // already used for form-control borders, so the empty portion of the track
          // is clearly visible as a control rather than nearly invisible.
          "bg-input relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            // Figma's filled portion is solid black, not brand-red — red on this
            // workspace is reserved for CTAs (Button/CTALink), and a slider fill
            // isn't one. bg-primary (--color-primary → brand-red) would blur that
            // distinction, so the fill uses the foundation-black token directly.
            "bg-[var(--color-foundation-black)] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabel}
          onPointerDown={() => setActiveThumb(index)}
          onPointerUp={() => setActiveThumb(null)}
          onFocus={() => setActiveThumb(index)}
          onBlur={() => setActiveThumb(null)}
          className="relative border-[var(--color-foundation-black)] bg-[var(--color-foundation-black)] ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        >
          {showValueTooltip &&
            (tooltipAlwaysVisible || activeThumb === index) &&
            (tooltipPosition === "below" ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-[var(--color-foundation-black)] px-2 py-1 text-[12px] font-medium leading-none text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
              >
                {formatValue(_values[index])}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 -top-2 h-2 w-[1.5px] -translate-x-1/2 bg-[var(--color-foundation-black)]"
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-[var(--color-foundation-black)] px-2 py-1 text-[12px] font-medium leading-none text-white"
              >
                {formatValue(_values[index])}
              </span>
            ))}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
