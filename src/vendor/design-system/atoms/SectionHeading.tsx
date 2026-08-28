import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type HeadingLevel = 1 | 2 | 3;
export type HeadingAlign = 'left' | 'center' | 'right';

export interface SectionHeadingProps {
  level?: HeadingLevel;
  /** Inline content — if `title` not provided, children renders as heading */
  children?: ReactNode;
  /** Eyebrow text above heading (alias of `label` for backward compat) */
  eyebrow?: string;
  /** OG-pattern label prop (small eyebrow text · same as `eyebrow`) · added Batch 7 */
  label?: string;
  /** Title — when provided, overrides children */
  title?: string;
  /** Subtitle description below heading */
  subtitle?: string;
  /** Right-aligned slot for actions (links · buttons) · added Batch 7 */
  action?: ReactNode;
  /** Right-aligned slot alias · added Batch 7 */
  endSlot?: ReactNode;
  /** Pulsing animation on label · added Batch 7 */
  labelPulse?: boolean;
  align?: HeadingAlign;
  className?: string;
  /** Optional id on the heading element · for aria-labelledby targets · added Batch 3.2c (2026-05-19) */
  id?: string;
}

const alignClass: Record<HeadingAlign, string> = {
  left:   'text-left',
  center: 'text-center',
  right:  'text-right',
};

/**
 * SectionHeading — h1/h2/h3 w/ optional eyebrow + Major-Third typography scale.
 *
 * WHY: Every section needs consistent eyebrow + heading + optional subtitle/action. Major Third scale (1.25×) for editorial rhythm.
 * WHAT: Renders semantic h1/h2/h3 in Noto Serif · optional eyebrow label · subtitle (sans) · right action slot · pulse-dot.
 *      Sizes: level=1 hero (39→48.8px) · level=2 section h2 default (31.25→39px) · level=3 subsection (25→31.25px).
 * WHEN: Every `SectionWrapper` block · prefer level=2 default · level=1 hero only · level=3 sub-sections.
 * WHEN NOT: Single-h1-per-page rule applies (Cat 3.1) · don't use Sans for headings (Cat 3.2) · don't use --text-3xl for h2 (Cat 3.1).
 * HOW: Both prop shapes work: `eyebrow` OR `label` · `children` OR `title` · `subtitle` · `action` OR `endSlot` · `labelPulse`.
 *
 * @promotedFrom V0_lite_report
 * @apiExtended 2026-05-13 — DS Port Batch 7 · OG SectionHeading shape compat
 */
export function SectionHeading({
  level = 2,
  children,
  eyebrow,
  label,
  title,
  subtitle,
  action,
  endSlot,
  labelPulse,
  align = 'left',
  className,
  id,
}: SectionHeadingProps) {
  /* Major Third scale (1.25× ratio · matches Figma + legacy) — 2026-05-14 legacy-vs-new parity fix
     L1 = h1 backup: 2.441 → 3.052rem (39 → 48.8px)
     L2 = h2 default: 1.953 → 2.441rem (31.3 → 39px) · was undersized text-xl/text-2xl (20/24px)
     L3 = h3: 1.563 → 1.953rem (25 → 31.3px) */
  const sizeClass = {
    1: 'text-[2.441rem] sm:text-[3.052rem] leading-tight tracking-[-0.02em]',
    2: 'text-[1.953rem] sm:text-[2.441rem] leading-tight tracking-[-0.015em]',
    3: 'text-[1.563rem] sm:text-[1.953rem] leading-tight tracking-[-0.01em]',
  } as const;

  const fontClass = {
    1: 'font-display font-light',
    2: 'font-display font-light',
    3: 'font-body font-medium sm:font-display sm:font-light',
  } as const;

  const eyebrowText = label || eyebrow;
  const headingContent = title || children;
  const rightSlot = action || endSlot;
  const hasRightSlot = !!rightSlot;

  const headingEl =
    level === 1 ? (
      <h1 id={id} className={cn(fontClass[1], sizeClass[1])}>{headingContent}</h1>
    ) : level === 2 ? (
      <h2 id={id} className={cn(fontClass[2], sizeClass[2])}>{headingContent}</h2>
    ) : (
      <h3 id={id} className={cn(fontClass[3], sizeClass[3])}>{headingContent}</h3>
    );

  return (
    <div
      data-component="SectionHeading"
      className={cn(
        alignClass[align],
        hasRightSlot && 'flex items-end justify-between gap-6',
        className,
      )}
    >
      <div className={cn(hasRightSlot && 'flex-1')}>
        {eyebrowText && (
          <p className="text-xs uppercase tracking-wider mb-3 text-[var(--semantic-ink-body)] font-body inline-flex items-center gap-2">
            {labelPulse && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--brand-red)' }}
                aria-hidden
              />
            )}
            {eyebrowText}
          </p>
        )}
        {headingEl}
        {subtitle && (
          <p className="mt-3 text-base text-[var(--semantic-ink-body)] font-body max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {hasRightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
    </div>
  );
}
