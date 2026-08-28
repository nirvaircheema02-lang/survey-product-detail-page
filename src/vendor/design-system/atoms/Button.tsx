/**
 * Button
 *
 * WHY · Conversion CTAs need brand-locked shimmer + consistent affordance across every surface.
 *       Inline `<button>` drifts — no shimmer, no ripple, no reduced-motion, no size tokens.
 * WHAT · 4 variants (primary · brand · secondary · ghost) × 5 sizes (xs/sm/md/lg/xl) ·
 *        always-on shimmer (700ms sweep) · optional AnimatedArrow · Material ripple ·
 *        loading/disabled states · icon left/right/iconOnly. Token-driven via `--composition-gradient-brand-*-shimmer`.
 * WHEN · Primary actions · form submit · hero CTAs · conversion moments. `brand` max 1-2/screen.
 *        `md` default · `sm` for nav · `xs` card-footer only (Cat 5.2).
 * WHEN NOT · Inline text links → `InlineLink` · exploratory nav → `CTALink` · decorative red = Cat 2.1.
 * WHERE · Molecules: `ReportCard` · `SurveyCard` · `AnalystPickCardB` ·
 *         Organisms: `ResourcesSection` · `NewsletterSignup` · `CardListing`.
 * HOW ·
 *   ```tsx
 *   // Primary CTA with animated arrow
 *   <Button variant="primary" size="md" animatedArrow>Get the Report</Button>
 *   // Brand CTA (max 1-2 per screen)
 *   <Button variant="brand" size="lg">Start Free Trial</Button>
 *   // Ghost on dark background
 *   <Button variant="ghost" background="dark" size="sm">Learn More</Button>
 *   ```
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom V0_lite_report (was 386-LOC w/ hardcoded hex; ported to token-only)
 */
'use client';

import {
  useState,
  useRef,
  cloneElement,
  isValidElement,
  type ReactNode,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { Loader2 } from 'lucide-react';
import { AnimatedArrow } from './AnimatedArrow';
import { cn } from '../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brand';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonBackground = 'light' | 'dark';
export type ButtonIconPosition = 'left' | 'right';

export interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  background?: ButtonBackground;
  fullWidth?: boolean;
  /**
   * Pill mode · content-width inline-flex · NOT full-width on mobile.
   * Use for toggle groups · filter chips · variant switchers.
   * Replaces `className="!w-auto flex-shrink-0"` workaround.
   * @default false
   */
  pill?: boolean;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  shimmerDuration?: number;
  animatedArrow?: boolean;
  /**
   * Render as anchor `<a>` element instead of `<button>`.
   * Keeps all classes, shimmer, ripple, animations identical.
   * Use for external links. For Next.js internal links, wrap w/ `<Link>`.
   * @default undefined
   */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  /**
   * Indicates the button's pressed/toggled state · for toggle/tab patterns.
   * Used by VariantToggle · StateDemo · viewport switchers.
   * Maps to native `aria-pressed` attribute.
   */
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed';
  /**
   * WAI-ARIA role override · for tab/option patterns.
   * E.g. `role="tab"` when inside a tablist.
   */
  role?: string;
  /**
   * Indicates the selected state · used with role="tab" or role="option".
   */
  'aria-selected'?: boolean | 'true' | 'false';
  /**
   * ID of the element this button controls · used with role="tab".
   */
  'aria-controls'?: string;
  /** Tab order override · typically -1 for non-active tabs in a tablist. */
  tabIndex?: number;
  /** DOM id attribute · forwarded to underlying element. */
  id?: string;
  /** Keyboard event handler · forwarded to underlying element. */
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

interface RippleType {
  x: number;
  y: number;
  size: number;
  key: number;
}

const iconSizeMap: Record<ButtonSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };
const gapMap: Record<ButtonSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
};

const sizeStyles = (size: ButtonSize, iconOnly: boolean): string => {
  /* xs uses literal classes (no DS token for 28px button — added 2026-05-13 Cat 5.2 anti-pattern: xs reserved for card footer CTAs only) */
  if (size === 'xs') {
    if (iconOnly) return 'w-7 h-7 p-0';
    return 'px-2.5 h-7 min-w-[60px]';
  }
  /* Explicit per-size classes (NOT template literals) — Tailwind v4 static
     scanner can only resolve fully-spelled arbitrary utilities. Template
     `h-[var(--button-height-${size})]` was never emitted → buttons rendered
     at 24px. Fixed 2026-05-13. */
  const heightMap: Record<Exclude<ButtonSize, 'xs'>, string> = {
    sm: 'h-[var(--button-height-sm)]',
    md: 'h-[var(--button-height-md)]',
    lg: 'h-[var(--button-height-lg)]',
    xl: 'h-[var(--button-height-xl)]',
  };
  const widthMap: Record<Exclude<ButtonSize, 'xs'>, string> = {
    sm: 'w-[var(--button-height-sm)]',
    md: 'w-[var(--button-height-md)]',
    lg: 'w-[var(--button-height-lg)]',
    xl: 'w-[var(--button-height-xl)]',
  };
  const pxMap: Record<Exclude<ButtonSize, 'xs'>, string> = {
    sm: 'px-[var(--button-px-sm)]',
    md: 'px-[var(--button-px-md)]',
    lg: 'px-[var(--button-px-lg)]',
    xl: 'px-[var(--button-px-xl)]',
  };
  const minWMap: Record<Exclude<ButtonSize, 'xs'>, string> = {
    sm: 'min-w-[var(--button-min-width-sm)]',
    md: 'min-w-[var(--button-min-width-md)]',
    lg: 'min-w-[var(--button-min-width-lg)]',
    xl: 'min-w-[var(--button-min-width-xl)]',
  };
  const s = size as Exclude<ButtonSize, 'xs'>;
  if (iconOnly) return `${widthMap[s]} ${heightMap[s]} p-0`;
  return `${pxMap[s]} ${heightMap[s]} ${minWMap[s]}`;
};

const fontStyle = (size: ButtonSize): { fontSize: string } => {
  /* Token map per size · all from base.css button-font-* tokens + --text-xs for xs.
     Bug fixed 2026-05-19 (Batch 3.1a): xs used --typography-size-xs (non-standard);
     lg fell through to --button-font-md (same as md). Corrected per canonical source. */
  const map: Record<ButtonSize, string> = {
    xs: 'var(--text-xs)',           /* 12.8px · card footer CTAs only (Cat 5.2) */
    sm: 'var(--button-font-sm)',    /* 0.875rem = 14px */
    md: 'var(--button-font-md)',    /* 1rem = 16px */
    lg: 'var(--button-font-lg)',    /* 1.125rem = 18px */
    xl: 'var(--button-font-lg)',    /* same as lg · no --button-font-xl in base.css */
  };
  return { fontSize: map[size] };
};

/**
 * Button — primary CTA atom w/ shimmer + ripple + animated arrow + multi-variant.
 *
 * WHY: Conversion CTAs need consistent affordance · brand-locked shimmer
 *      is Ken signature interaction · respects reduced-motion at DS layer.
 * WHAT: 4 variants (primary · brand · secondary · ghost) × 5 sizes (xs · sm · md · lg · xl) ·
 *      always-on shimmer · opt-in AnimatedArrow · Material ripple · loading/disabled states.
 *      Variants token-driven via `--composition-gradient-brand-*-shimmer`.
 * WHEN: Primary actions · submit forms · CTAs · conversion moments.
 *      `brand` for max 1-2 per screen · `md` default · `sm` for nav · `xs` card-footer only.
 * WHEN NOT: Inline text links (use `InlineLink`) · exploratory nav (use `CTALink`) ·
 *      decorative red NEVER (Cat 2.1 anti-pattern).
 * HOW: Token-only · shimmer ALWAYS on (DO NOT disable · brand signature) · AnimatedArrow
 *      OPT-IN via `animatedArrow={true}` for urgency · ripple toggle via `ripple={false}`.
 *
 * @promotedFrom V0_lite_report (was 386-LOC w/ hardcoded hex; ported to token-only)
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  background = 'light',
  fullWidth = false,
  pill = false,
  icon,
  iconPosition = 'right',
  iconOnly = false,
  loading = false,
  disabled = false,
  ripple = true,
  shimmerDuration = 700,
  animatedArrow = false,
  href,
  target,
  rel,
  onClick,
  className,
  type = 'button',
  ariaLabel,
  'aria-pressed': ariaPressed,
  role,
  'aria-selected': ariaSelected,
  'aria-controls': ariaControls,
  tabIndex,
  id,
  onKeyDown,
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const iconSize = iconSizeMap[size];

  /* Arrow color · per RS-legacy Button.tsx getArrowColor() L64-72 · canonical:
     - primary/brand · always white (high contrast on dark gradient)
     - secondary light · brand-red ON HOVER · black/70 rest (matches 2-state text color · color: var(--brand-red))
     - secondary dark · always white
     - ghost dark · always white · ghost light · always black */
  const arrowColor: 'white' | 'black' | 'brand' = (() => {
    if (variant === 'primary' || variant === 'brand') return 'white';
    if (variant === 'secondary') {
      if (background === 'dark') return 'white';
      return isHovering ? 'brand' : 'black';
    }
    if (variant === 'ghost') return background === 'dark' ? 'white' : 'black';
    return 'black';
  })();

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (!ripple || disabled || loading) return;
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - rippleSize / 2;
    const y = event.clientY - rect.top - rippleSize / 2;
    const newRipple: RippleType = { x, y, size: rippleSize, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (onClick && !disabled && !loading) onClick(event);
  };

  const variantClass = (() => {
    if (variant === 'primary' || variant === 'brand') {
      return 'text-[var(--color-foundation-white)] disabled:opacity-50';
    }
    /* GHOST · transparent fill · outline only · subtle tint on hover.
       SECONDARY · two-state per OG R4.1.1 (COMPONENTS.md L18 · "Two-state · neutral rest → brand-red hover").
         · Light bg · rest = black/12 border · text 70% black · hover transitions to brand-red text+border (inline-style driven by isHovering).
         · Dark bg · white outline · white tint hover (no brand-red on dark per OG L43). */
    if (variant === 'ghost') {
      if (background === 'dark') {
        return 'bg-transparent text-[var(--color-foundation-white)] border-[1.5px] border-white/30 hover:border-white/60 hover:bg-white/[0.05] active:bg-white/10 disabled:border-white/10 disabled:text-white/40';
      }
      return 'bg-transparent text-[var(--color-foundation-black)] border-[1.5px] border-black/30 hover:border-black/60 hover:bg-black/[0.03] active:bg-black/10 disabled:border-black/10 disabled:text-black/40';
    }
    if (variant === 'secondary') {
      if (background === 'dark') {
        return 'bg-white/[0.05] text-[var(--color-foundation-white)] border-[1.5px] border-white/40 hover:border-white hover:bg-white/[0.12] active:bg-white/[0.18] disabled:border-white/20 disabled:text-white/40';
      }
      /* Light-mode secondary 2-state · color+border via variantInlineStyle (isHovering→brand-red) */
      return 'bg-white border-[1.5px] disabled:border-black/20 disabled:text-black/40 transition-colors duration-300';
    }
    return '';
  })();

  const variantInlineStyle = (() => {
    const fs = fontStyle(size);
    if (variant === 'primary') {
      return {
        ...fs,
        backgroundImage: 'var(--composition-gradient-brand-dark-shimmer)',
        boxShadow: isHovering ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
      };
    }
    if (variant === 'brand') {
      return {
        ...fs,
        backgroundImage: 'var(--composition-gradient-brand-red-shimmer)',
        boxShadow: isHovering
          ? '0 12px 32px rgba(176,31,36,0.25)'
          : '0 4px 16px rgba(176,31,36,0.15)',
      };
    }
    /* Light-mode secondary · 2-state · brand-red hover (R4.1.1) · color + border + soft red shadow */
    if (variant === 'secondary' && background !== 'dark') {
      return {
        ...fs,
        color: isHovering ? 'var(--brand-red)' : 'rgba(0,0,0,0.70)',
        borderColor: isHovering ? 'var(--brand-red)' : 'rgba(0,0,0,0.12)',
        boxShadow: isHovering
          ? '0 4px 16px rgba(176,31,36,0.12)'
          : '0 2px 8px rgba(0,0,0,0.04)',
      };
    }
    return fs;
  })();

  const shimmerLayer = (() => {
    if (variant === 'brand') {
      return 'bg-[image:var(--composition-gradient-brand-red-shimmer)]';
    }
    if (variant === 'primary') {
      return 'bg-[image:var(--composition-gradient-brand-dark-shimmer)]';
    }
    if (variant === 'ghost') {
      /* Ghost shimmer · RS-canonical (Button.tsx L227-237) · subtle · 20% dark / 10% light */
      return background === 'dark'
        ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
        : 'bg-gradient-to-r from-transparent via-black/10 to-transparent';
    }
    return '';
  })();

  const Spinner = () => (
    <Loader2 size={iconSize} strokeWidth={2.5} className="animate-spin flex-shrink-0" />
  );

  const IconWrapper = ({ children: iconChildren }: { children: ReactNode }) => {
    if (isValidElement(iconChildren)) {
      return cloneElement(iconChildren as ReactElement<{ size?: number; strokeWidth?: number; className?: string }>, {
        size: iconSize,
        strokeWidth: 2,
        className: 'flex-shrink-0',
      });
    }
    return <span className="inline-flex items-center flex-shrink-0">{iconChildren}</span>;
  };

  const renderIcon = () =>
    animatedArrow ? (
      <AnimatedArrow size={iconSize} color={arrowColor} isHovered={isHovering} />
    ) : (
      <IconWrapper>{icon}</IconWrapper>
    );

  const sharedClassName = cn(
    'group relative inline-flex items-center justify-center font-medium tracking-[0.0875px]',
    'transition-all duration-300 rounded-[var(--radius-button)] overflow-hidden whitespace-nowrap',
    gapMap[size],
    sizeStyles(size, iconOnly),
    variantClass,
    fullWidth ? 'w-full' : pill ? 'inline-flex w-auto flex-shrink-0' : iconOnly ? '' : 'w-full sm:w-auto',
    disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2',
    className,
  );

  const sharedProps = {
    'data-component': 'Button',
    id,
    className: sharedClassName,
    style: variantInlineStyle,
    'aria-label': ariaLabel || (iconOnly ? 'Button' : undefined),
    'aria-pressed': ariaPressed,
    'aria-selected': ariaSelected,
    'aria-controls': ariaControls,
    role,
    tabIndex,
    onKeyDown,
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  };

  const innerContent = (
    <>
      {shimmerLayer && (
        <div
          className={cn(
            'absolute inset-0 w-[200%] transition-transform ease-out pointer-events-none',
            'motion-reduce:transition-none motion-reduce:transform-none',
            shimmerLayer,
            isHovering ? '-translate-x-1/2' : 'translate-x-0',
          )}
          style={{ transitionDuration: `${shimmerDuration}ms` }}
        />
      )}

      {/* Secondary shimmer · RS-canonical (Button.tsx L211-223):
          - Light bg · rest = white 80% glow · hover = brand-red 8% glow (subtle red emphasis on hover)
          - Dark bg · rest = white 15% glow · hover = white 15% (same · no brand-red on dark per OG) */}
      {variant === 'secondary' && (
        <div
          className={cn(
            'absolute inset-0 w-[200%] pointer-events-none transition-transform ease-out',
            'motion-reduce:transition-none',
            isHovering ? '-translate-x-1/2' : 'translate-x-0',
          )}
          style={{
            transitionDuration: `${shimmerDuration}ms`,
            backgroundImage: (() => {
              if (background === 'dark') {
                return 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)';
              }
              return isHovering
                ? 'linear-gradient(to right, transparent, rgba(176,31,36,0.08), transparent)'
                : 'linear-gradient(to right, transparent, rgba(255,255,255,0.80), transparent)';
            })(),
          }}
        />
      )}

      {ripples.map((r) => (
        <span
          key={r.key}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            backgroundColor:
              variant === 'primary' || variant === 'brand'
                ? 'rgba(255,255,255,0.30)'
                : 'rgba(0,0,0,0.10)',
            animation: 'ripple 600ms ease-out',
          }}
        />
      ))}

      {loading && iconPosition === 'left' && !iconOnly && (
        <span className="relative z-10"><Spinner /></span>
      )}
      {!loading && (icon || animatedArrow) && iconPosition === 'left' && !iconOnly && (
        <span className="relative z-10 overflow-visible">{renderIcon()}</span>
      )}

      {!iconOnly && (
        <span className={cn('relative z-10 inline-flex items-center', loading && 'opacity-70')}>
          {children}
        </span>
      )}

      {iconOnly && !loading && (icon || animatedArrow) && (
        <span className="relative z-10 overflow-visible">{renderIcon()}</span>
      )}
      {iconOnly && loading && <span className="relative z-10"><Spinner /></span>}

      {!loading && (icon || animatedArrow) && iconPosition === 'right' && !iconOnly && (
        <span className="relative z-10 overflow-visible">{renderIcon()}</span>
      )}
      {loading && iconPosition === 'right' && !iconOnly && (
        <span className="relative z-10"><Spinner /></span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        {...sharedProps}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      data-component="Button"
      ref={buttonRef}
      id={id}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={sharedClassName}
      style={variantInlineStyle}
      aria-label={ariaLabel || (iconOnly ? 'Button' : undefined)}
      aria-pressed={ariaPressed}
      aria-selected={ariaSelected}
      aria-controls={ariaControls}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {innerContent}
    </button>
  );
}
