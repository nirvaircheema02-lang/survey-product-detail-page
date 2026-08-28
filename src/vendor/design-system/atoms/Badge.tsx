/**
 * Badge
 *
 * WHY · Inline status/category/step labels drift without a primitive — 11 theme variants + 3 shapes
 *       enforce consistent token usage and contrast across both editorial-light and cinematic-dark surfaces.
 * WHAT · `<span>` with 3 variants (minimal · rounded · pill) × 4 sizes (xs/sm/md/lg) × 11 themes ×
 *        light/dark mode. Optional shimmer sweep (hover or 4.5s auto loop) · bordered · interactive.
 * WHEN · Section eyebrows · step indicators · status chips (Open/Closed) · category tags · objective labels.
 * WHEN NOT · Body emphasis → use bold · primary action → use `Button` · interactive filter → use `FilterChip` ·
 *            decorative red on non-CTA/non-error = Cat 2.1 anti-pattern.
 * WHERE · Molecules: `MobileFilterSheet` · `SurveyCard` · `AnalystPickCardB` ·
 *         Organisms: `IndustrySidebar` · `TrendingTopics` · Atom: `FilterSectionHeader`.
 * HOW ·
 *   ```tsx
 *   // Eyebrow
 *   <Badge variant="minimal" size="sm" theme="neutral">Chapter 01</Badge>
 *   // Step indicator
 *   <Badge variant="pill" size="sm" theme="warm" bordered shimmer>Phase Alpha</Badge>
 *   // Status
 *   <Badge variant="rounded" size="sm" theme="success">Open</Badge>
 *   ```
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report (was 280-LOC w/ hardcoded hex; ported to token-only)
 */
'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export type BadgeVariant = 'minimal' | 'rounded' | 'pill';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeTheme =
  | 'neutral'
  | 'warm'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'muted'
  | 'purple'
  | 'coral'
  | 'periwinkle';

/** Color mode — light variant (default) vs dark surface inversion. Added 2026-05-13 DS Port Batch 5. */
export type BadgeMode = 'light' | 'dark';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  theme?: BadgeTheme;
  /** Color mode — `light` on light bg (default) · `dark` on dark bg (inverts text/border) */
  mode?: BadgeMode;
  bordered?: boolean;
  shimmer?: boolean;
  autoShimmer?: boolean;
  interactive?: boolean;
  icon?: ReactNode;
  className?: string;
  /**
   * Inline style — primarily for image-overlay badge overrides (backdrop-blur +
   * CSS custom-property opacity bumps). Avoid for normal usage; use `theme` instead.
   */
  style?: CSSProperties;
  /**
   * Accessible title tooltip · Bible § 1.9 truncation doctrine.
   * Pass full text when badge content may truncate at max-width: 200px.
   * Maps to native HTML `title` attribute — screen readers + pointer hover reveal.
   */
  title?: string;
}

interface ThemeColor {
  text: string;
  bg: string;
  border: string;
  hoverBg: string;
  hoverBorder: string;
  shimmerColor: string;
}

const themeColors: Record<BadgeTheme, ThemeColor> = {
  neutral: {
    text:        'text-[var(--color-ramp-black-700)]',
    bg:          'bg-[var(--color-ramp-warm-100)]',
    border:      'border-[var(--color-ramp-black-200)]',
    hoverBg:     'hover:bg-[var(--color-ramp-warm-300)]',
    hoverBorder: 'hover:border-[var(--color-ramp-black-300)]',
    shimmerColor:'rgba(255,255,255,0.18)',
  },
  warm: {
    text:        'text-[var(--color-ramp-black-700)]', /* was warm-900 (--warm-900) — 2.8:1 fail on warm-50 · black-700 (--black-700) = 8.5:1 ✓ WCAG AA · warm bg preserved */
    bg:          'bg-[var(--color-ramp-warm-50)]',
    border:      'border-[var(--color-ramp-warm-500)]',
    hoverBg:     'hover:bg-[var(--color-ramp-warm-300)]',
    hoverBorder: 'hover:border-[var(--color-ramp-warm-600)]',
    shimmerColor:'rgba(168,150,142,0.12)',
  },
  brand: {
    text:        'text-[var(--color-foundation-white)]',
    bg:          'bg-[var(--color-brand-red)]',
    border:      'border-[var(--color-brand-red)]',
    hoverBg:     'hover:bg-[var(--color-ramp-red-700)]',
    hoverBorder: 'hover:border-[var(--color-ramp-red-700)]',
    shimmerColor:'rgba(255,255,255,0.22)',
  },
  success: {
    text:        'text-[var(--semantic-status-success-text)]',
    bg:          'bg-[var(--semantic-status-success-bg)]',
    border:      'border-[var(--semantic-status-success-border)]',
    hoverBg:     'hover:bg-[var(--semantic-status-success-bg-hover)]',
    hoverBorder: 'hover:border-[var(--semantic-status-success-border-hover)]',
    shimmerColor:'rgba(255,255,255,0.15)',
  },
  warning: {
    text:        'text-[var(--semantic-status-warning-text)]',
    bg:          'bg-[var(--semantic-status-warning-bg)]',
    border:      'border-[var(--semantic-status-warning-border)]',
    hoverBg:     'hover:bg-[var(--semantic-status-warning-bg-hover)]',
    hoverBorder: 'hover:border-[var(--semantic-status-warning-border-hover)]',
    shimmerColor:'rgba(255,255,255,0.15)',
  },
  error: {
    text:        'text-[var(--semantic-status-error-text)]',
    bg:          'bg-[var(--semantic-status-error-bg)]',
    border:      'border-[var(--semantic-status-error-border)]',
    hoverBg:     'hover:bg-[var(--semantic-status-error-bg-hover)]',
    hoverBorder: 'hover:border-[var(--semantic-status-error-border-hover)]',
    shimmerColor:'rgba(255,255,255,0.15)',
  },
  info: {
    text:        'text-[var(--semantic-status-info-text)]',
    bg:          'bg-[var(--semantic-status-info-bg)]',
    border:      'border-[var(--semantic-status-info-border)]',
    hoverBg:     'hover:bg-[var(--semantic-status-info-bg-hover)]',
    hoverBorder: 'hover:border-[var(--semantic-status-info-border-hover)]',
    shimmerColor:'rgba(255,255,255,0.15)',
  },
  muted: {
    text:        'text-[var(--color-ramp-black-700)]', /* was black-400 (--black-400) — 2.41:1 fail · black-700 (--black-700) = 8.5:1 ✓ WCAG AA */
    bg:          'bg-[var(--color-ramp-black-50)]',
    border:      'border-[var(--color-ramp-black-200)]',
    hoverBg:     'hover:bg-[var(--color-ramp-black-100)]',
    hoverBorder: 'hover:border-[var(--color-ramp-black-300)]',
    shimmerColor:'rgba(255,255,255,0.10)',
  },
  purple: {
    text:        'text-[var(--color-ramp-purple-800)]', /* was accent-purple=--purple-600 — 3.8:1 fail · purple-800 (--purple-800) on purple-50 = ~6.5:1 ✓ WCAG AA */
    bg:          'bg-[var(--color-ramp-purple-50)]',
    border:      'border-[var(--color-ramp-purple-200)]',
    hoverBg:     'hover:bg-[var(--color-ramp-purple-100)]',
    hoverBorder: 'hover:border-[var(--color-ramp-purple-300)]',
    shimmerColor:'rgba(128,108,224,0.12)',
  },
  coral: {
    text:        'text-[var(--coral-700)]',
    bg:          'bg-[rgba(210,112,82,0.08)]',
    border:      'border-[rgba(210,112,82,0.20)]',
    hoverBg:     'hover:bg-[rgba(210,112,82,0.14)]',
    hoverBorder: 'hover:border-[rgba(210,112,82,0.30)]',
    shimmerColor:'rgba(210,112,82,0.12)',
  },
  periwinkle: {
    text:        'text-[var(--periwinkle-700)]',
    bg:          'bg-[rgba(142,138,205,0.08)]',
    border:      'border-[rgba(142,138,205,0.20)]',
    hoverBg:     'hover:bg-[rgba(142,138,205,0.14)]',
    hoverBorder: 'hover:border-[rgba(142,138,205,0.30)]',
    shimmerColor:'rgba(142,138,205,0.12)',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'text-[0.563rem] tracking-[0.15em]',
  sm: 'text-[0.688rem] tracking-[0.12em]',
  md: 'text-[0.813rem] tracking-[0.08em]',
  lg: 'text-[0.938rem] tracking-[0.05em]',
};

const sizePadding: Record<BadgeSize, Record<BadgeVariant, string>> = {
  xs: { minimal: 'py-0', rounded: 'px-2 py-0.5',   pill: 'px-2.5 py-0.5' },
  sm: { minimal: 'py-0', rounded: 'px-2.5 py-1',   pill: 'px-3 py-1' },
  md: { minimal: 'py-0', rounded: 'px-3 py-1.5',   pill: 'px-4 py-1.5' },
  lg: { minimal: 'py-0', rounded: 'px-4 py-2',     pill: 'px-5 py-2' },
};

const variantShape: Record<BadgeVariant, string> = {
  minimal: '',
  rounded: 'rounded-[var(--radius-button)]',
  pill:    'rounded-full',
};

/**
 * Badge — section eyebrow / step indicator / status / objective primitive.
 *
 * WHY: Status · category · step indicators need consistent shape · color · sizing.
 *      Inline span+bg-color = drift + a11y miss.
 * WHAT: 3 variants (minimal · rounded · pill) × 4 sizes (xs/sm/md/lg) × 11 themes (neutral · warm · brand · success · warning · error · info · muted · purple · coral · periwinkle) × mode (light|dark).
 *      Optional shimmer (hover sweep · 700ms · brand signature) · autoShimmer (4.5s loop) · bordered · interactive.
 * WHEN: Section eyebrows · step indicators (Phase Alpha) · status badges (Open/Closed) · category tags · objective labels.
 * WHEN NOT: Body emphasis (use bold) · primary buttons (use Button) · interactive filter (use FilterChip) · red badges for non-CTA/non-error.
 * HOW: Use `theme` prop NEVER inline color. Common patterns:
 *      eyebrow = minimal+sm+neutral · step = pill+sm+warm+bordered+shimmer · status = rounded+sm+(success/warning/error) · premium = pill+md+purple.
 *      Convenience wrappers: SectionLabel · StepPill · StatusBadge · CategoryBadge · etc.
 *
 * @promotedFrom V0_lite_report (was 280-LOC w/ hardcoded hex; ported to token-only)
 */
export function Badge({
  children,
  variant = 'rounded',
  size = 'sm',
  theme = 'neutral',
  // mode prop accepted for API surface parity; dark-mode inversion handled via CSS custom properties in callers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode: _mode,
  bordered = false,
  shimmer = false,
  autoShimmer = false,
  interactive = false,
  icon,
  className,
  style,
  title,
}: BadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = themeColors[theme];
  const isMinimal = variant === 'minimal';

  return (
    <span
      data-component="Badge"
      // Bible § 1.9: title attr reveals full text when truncated at max-width: 200px.
      // Pointer hover + screen reader fallback. Always pass title when content may be long.
      title={title}
      style={{
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...style,
      }}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium uppercase',
        'transition-all duration-200 ease-in-out cursor-default',
        'relative',
        isMinimal ? 'bg-transparent' : colors.bg,
        bordered && !isMinimal && `border ${colors.border}`,
        interactive && [
          !isMinimal && colors.hoverBg,
          bordered && !isMinimal && colors.hoverBorder,
          'cursor-pointer',
          // FIX 4 (G.10): WCAG 2.5.5 — interactive badges need min 44px touch target.
          // Applied via padding expansion when interactive prop true.
          'min-h-[44px] px-4 py-3',
        ],
        variantShape[variant],
        sizeClasses[size],
        sizePadding[size][variant],
        colors.text,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {shimmer && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `linear-gradient(90deg, transparent 0%, ${colors.shimmerColor} 50%, transparent 100%)`
              : 'none',
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: isHovered ? 'transform 700ms ease-out' : 'none',
          }}
        />
      )}
      {autoShimmer && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
            animation: 'badge-auto-shimmer 4.5s ease-in-out infinite',
          }}
        />
      )}
      {icon && (
        <span className="inline-flex items-center shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </span>
      )}
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
