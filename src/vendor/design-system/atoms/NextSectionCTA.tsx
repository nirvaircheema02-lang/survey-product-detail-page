/**
 * NextSectionCTA — Atom
 *
 * WHY: Long-scroll pages benefit from explicit "more content below" cues.
 *      Reduces user uncertainty about page depth · invites continued reading.
 * WHAT: Scroll-anchor button w/ animated chevron · jumps to target section.
 * WHEN: Between major sections in long case studies · report pages · whitepapers.
 * WHEN NOT: Short pages · listing pages · sticky-nav already present.
 *
 * HOW:
 * ```tsx
 * <section id="next-chapter">...</section>
 * <NextSectionCTA targetId="next-chapter" label="Continue to methodology" />
 *
 * // Dark mode (over black bg)
 * <NextSectionCTA targetId="impact" label="See impact" darkMode />
 * ```
 *
 * @promotedFrom Design_system_vs_26/src/app/components/NextSectionCTA.tsx
 * @portedDate 2026-05-12 — DS Port Batch 2 · Tier 2
 */
'use client';

import { ChevronDown } from 'lucide-react';

export interface NextSectionCTAProps {
  targetId: string;
  label: string;
  darkMode?: boolean;
  className?: string;
}

export function NextSectionCTA({
  targetId,
  label,
  darkMode = false,
  className = '',
}: NextSectionCTAProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-component="NextSectionCTA"
      className={`flex justify-center py-8 md:py-12 ${
        darkMode ? 'bg-black' : 'bg-white'
      } ${className}`}
    >
      <button
        type="button"
        onClick={scrollToSection}
        className={`group flex flex-col items-center gap-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded-sm ${
          darkMode
            ? 'text-white/60 hover:text-white focus-visible:ring-offset-black'
            : 'text-black/40 hover:text-black'
        }`}
        aria-label={`Navigate to ${label}`}
      >
        <span
          className="font-medium uppercase tracking-[2px] group-hover:tracking-[2.5px] transition-all"
          style={{ fontSize: 'var(--typography-size-xs, 0.8rem)' }}
        >
          {label}
        </span>
        <ChevronDown
          className="w-5 h-5 group-hover:translate-y-1 transition-transform animate-bounce"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
