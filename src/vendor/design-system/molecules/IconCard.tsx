/**
 * IconCard
 *
 * WHAT · Card with a circular/square icon container, h3 title (DM Sans, 25px, weight 400),
 *        optional description text, and flexible children slot for nested content.
 *        Used in 3-column grids for Growth Drivers, Challenges, and Opportunities.
 *
 * WHY · GrowthDriversChallenges organism nests topic lists (h4 + p + ul) inside each
 *       column card. Without a shared molecule the icon-container pattern (size, color,
 *       radius, hover) drifts per-section. V0.2 used this for RegionalComparison icon
 *       headers too. One molecule prevents both.
 *
 * WHEN · GrowthDriversChallenges 3-col grid. Any section that needs an icon-led card
 *        with arbitrary content body. Icon + title-only variant (no description, no children)
 *        also valid for compact feature rows.
 *
 * WHEN NOT · Pure text-only cards → TextCard. Numbered analysis cards → AnalysisCard.
 *            Stakeholder cards (horizontal icon + text) → StakeholderCard.
 *
 * WHERE · core-v2/src/molecules/IconCard.tsx
 *         Consumed by: GrowthDriversChallenges organism
 *
 * HOW · `iconBgColor` and `iconColor` accept CSS var strings (token-only).
 *       `showIconBg` prop controls whether icon container has a background.
 *       h3 enforces DM Sans body font (V0.2 heading rule inside cards).
 *       Border via `--black-200` CSS var. No motion — entrance handled by parent.
 *
 * @canonical_source projects/V0.2 -for design system/src/app/components/ui/icon-card.tsx
 * @ported 2026-05-19 · aura-builder · Batch 3.2a-REDO (V0.2 canonical)
 * @token_refactor
 *   V0.2 `rounded-[var(--radius-md)]` (10px V0.2) → `--radius-sm` (10px core-v2)
 *   V0.2 inline `style={{ fontSize: '16px' }}` → `var(--text-sm)` (16px)
 *   V0.2 `var(--shadow-brand-purple)` → kept (token exists in base.css)
 *   V0.2 `style={{ borderColor: 'var(--black-200)' }}` → consolidated into style prop
 */

import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

/** Icon container size variants */
export type IconCardIconSize = 'sm' | 'md' | 'lg';

const iconSizeClasses: Record<IconCardIconSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
};

export interface IconCardProps {
  /** Icon element — Phosphor or Lucide icon recommended */
  icon: ReactNode;
  /** Card heading (rendered as h3, DM Sans per V0.2 DS rule for card headings) */
  title: string;
  /** Optional single-paragraph description */
  description?: string;
  /**
   * Custom content rendered below the title (replaces description).
   * Use for nested topic lists in GrowthDriversChallenges.
   */
  children?: ReactNode;
  /** Icon container size. @default 'md' */
  iconSize?: IconCardIconSize;
  /**
   * Background color for the icon container.
   * Pass a CSS var string. @default 'var(--purple-100)'
   */
  iconBgColor?: string;
  /**
   * Icon foreground color (passed as `color` CSS property to icon wrapper).
   * Pass a CSS var string. @default 'var(--purple-500)'
   */
  iconColor?: string;
  /** Whether to render a tinted background behind the icon. @default true */
  showIconBg?: boolean;
  /** Additional classes for the root element. */
  className?: string;
}

export function IconCard({
  icon,
  title,
  description,
  children,
  iconSize = 'md',
  iconBgColor = 'var(--purple-100)',
  iconColor = 'var(--purple-500)',
  showIconBg = true,
  className,
}: IconCardProps) {
  return (
    <div
      className={cn(
        'h-full p-4 border transition-shadow duration-300',
        'hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--white)',
        borderColor: 'var(--black-200)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Icon container */}
      <div
        className={cn(
          'mb-4 flex items-center justify-center',
          iconSizeClasses[iconSize],
        )}
        style={{
          backgroundColor: showIconBg ? iconBgColor : 'transparent',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        <div style={{ color: iconColor }}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-3"
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: 'var(--black-900)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {title}
      </h3>

      {/* Content */}
      {children ?? (
        description ? (
          <p
            style={{
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--black-500)',
            }}
          >
            {description}
          </p>
        ) : null
      )}
    </div>
  );
}
