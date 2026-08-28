/**
 * StatCard
 *
 * WHY · Hero sections and key-stats strips need animated numeric tiles that count up
 *        on scroll entry, adding cinematic polish to otherwise static numbers. Inlining
 *        per-hero would duplicate count-up logic and Framer Motion config across surfaces.
 * WHAT · Animated stat tile with optional icon, count-up value (via useAnimatedCounter),
 *        and label. Framer Motion entrance (fade+slide) + hover (scale+lift) built in.
 *        Props: icon (LucideIcon), value (string), label (string), color (CSS var/hex),
 *        delay (seconds), animate (bool), className.
 * WHEN · In HeroSection stat rows, KeyStats strips, and Chapter metric grids on
 *        V0_lite_report and case-study pages. Use `animate=true` for count-up effect;
 *        `animate=false` for static display.
 * WHEN NOT · Don't use for non-numeric stats (text-only highlights → use a plain text
 *             element). Don't use in editorial-light contexts without verifying color
 *             contrast — default accent purple may fail on light bg.
 * WHERE · V0_lite_report HeroSection.tsx · case-study pages KeyStats section
 * HOW ·
 *   ```tsx
 *   <StatCard
 *     icon={TrendingUp}
 *     value="$45.2B"
 *     label="Market size by 2030"
 *     color="var(--color-accent-purple)"
 *     delay={0.1}
 *     animate
 *   />
 *   ```
 *
 * @reusabilityScore 3     // hero + key-stats across cinematic-dark surfaces
 * @a11y_status pending-review  // motion may need useReducedMotion guard
 * @lifecycle stable
 * @promotedFrom V0_lite_report (HeroSection.tsx StatCard inline component)
 */
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { cn } from '../lib/cn';

export interface StatCardProps {
  /** Optional icon — when absent, stat renders without icon row */
  icon?: LucideIcon;
  /** Display value (e.g. "$45.2B", "32.5%", "200+") */
  value: string;
  label: string;
  /** Hex/CSS-var color for icon + glow accent. Default: var(--color-accent-purple). */
  color?: string;
  /**
   * Surface preset — overrides default text/border/bg when set.
   * `light` = editorial-light surface (white bg · dark text).
   * `dark`  = cinematic-dark surface (white/4% bg · white text).
   * When provided, `color` still controls accent/icon color.
   */
  surface?: 'light' | 'dark';
  /** Stagger delay (seconds) for entrance animation. Default 0. */
  delay?: number;
  /** When true, animates value from 0 to numeric portion of `value`. Default false. */
  animate?: boolean;
  className?: string;
}

/**
 * StatCard — animated stat tile w/ icon + value + label.
 *
 * Used in: HeroSection stat row, KeyStats strip, Chapter1 metric grid.
 * `animate=true` triggers count-up via useAnimatedCounter when scrolled into view.
 *
 * Format detection by suffix: `B` (billions, 1 decimal), `%` (percent, 1 decimal),
 * `+` (count w/ plus suffix), default = integer.
 *
 * @promotedFrom V0_lite_report (HeroSection.tsx StatCard inline component)
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  color = 'var(--color-accent-purple)',
  surface,
  delay = 0,
  animate = false,
  className,
}: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const numericValue = animate ? parseFloat(value.replace(/[^0-9.]/g, '')) : 0;
  const { count, ref } = useAnimatedCounter(numericValue, 2000);

  /* Surface preset classes — only applied when `surface` prop is set */
  const surfaceValueColor =
    surface === 'light'
      ? 'var(--surface-text-primary, #000)'
      : surface === 'dark'
        ? 'var(--variant-cinematic-text-primary, #FAFAFA)'
        : undefined;
  const surfaceLabelColor =
    surface === 'light' ? 'var(--surface-text-muted, rgba(0,0,0,0.55))' : surface === 'dark' ? 'rgba(250,250,250,0.6)' : undefined;
  const surfaceBorder =
    surface === 'light' ? '1px solid rgba(0,0,0,0.10)' : surface === 'dark' ? '1px solid rgba(255,255,255,0.10)' : undefined;
  const surfaceBg =
    surface === 'light' ? '#ffffff' : surface === 'dark' ? 'rgba(255,255,255,0.04)' : undefined;

  const formatValue = (val: number): string => {
    if (!animate) return value;
    if (value.includes('B')) return `$${val.toFixed(1)}B`;
    if (value.includes('%')) return `${val.toFixed(1)}%`;
    if (value.includes('+')) return `${val}+`;
    return val.toString();
  };

  return (
    <motion.div
      data-component="StatCard"
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -4 }}
      className={cn('group relative space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2', className)}
      style={surface ? { background: surfaceBg, border: surfaceBorder, borderRadius: 'var(--radius-card)', padding: 'var(--space-4)' } : undefined}
    >
      <div
        className="absolute inset-0 rounded-[var(--radius-card)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"
        style={{ backgroundColor: `${color}20` }}
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          {Icon && (
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-button)] transition-all duration-300"
              style={{ backgroundColor: `${color}15` }}
              whileHover={shouldReduceMotion ? undefined : { rotate: 5, scale: 1.1 }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
            </motion.div>
          )}
          <p
            className="text-[var(--typography-size-xs)] uppercase tracking-wider opacity-70"
            style={surfaceLabelColor ? { color: surfaceLabelColor, opacity: 1 } : undefined}
          >
            {label}
          </p>
        </div>
        <p
          className="text-[var(--typography-size-xl)] font-[var(--typography-family-display)] font-light tabular-nums leading-none mt-2"
          style={{ color: surfaceValueColor ?? color }}
        >
          {formatValue(count)}
        </p>
      </div>
    </motion.div>
  );
}
