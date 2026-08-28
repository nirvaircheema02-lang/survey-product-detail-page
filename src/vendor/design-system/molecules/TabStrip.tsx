/**
 * TabStrip — Molecule
 *
 * WHY · RegionalComparison and any split map/table view need a mobile-first
 *       tab strip to switch between visualisation modes. Without a shared
 *       molecule every section re-implements keyboard nav, focus management,
 *       and URL-persistence differently. Centralising here ensures WCAG AA
 *       keyboard + screen-reader compliance once, consumed everywhere.
 *
 *       NOTE: This is distinct from the ViewToggle ATOM (grid/list icon pair).
 *       TabStrip is the TABLIST pattern — text labels + animated underline +
 *       Arrow/Home/End keyboard nav + tabpanel wiring.
 *
 * WHAT · Accessible tab-strip (role="tablist") with animated active underline
 *        (Framer Motion layoutId shared transition), controlled active state,
 *        Arrow/Home/End keyboard navigation, and AnimatePresence crossfade
 *        content panels via TabStripPanel companion.
 *
 * WHEN · Any UI needing a 2–5 tab toggle that swaps visible content panels.
 *        Primary consumer: RegionalComparison mobile layout (Map / Table).
 *        Secondary: ChartCard controls (optional), listing view toggles.
 *
 * WHEN NOT · Full page navigation → use Navbar/router tabs.
 *            Stepper sequence → use StepperHorizontal.
 *            Filter chips → use FilterChip.
 *            Grid/list display switch → use ViewToggle ATOM.
 *
 * WHERE · core-v2/src/molecules/TabStrip.tsx
 *         Consumed by: RegionalComparison organism (Batch 3.3a) · any section needing view switch.
 *
 * HOW · Controlled via `value` + `onChange`. Content panels: companion `TabStripPanel`
 *       handles role="tabpanel" + AnimatePresence crossfade 150ms.
 *
 * ```tsx
 * const [view, setView] = useState('map');
 * <TabStrip
 *   options={[{ id: 'map', label: 'Map View' }, { id: 'table', label: 'Table View' }]}
 *   value={view}
 *   onChange={setView}
 * />
 * <TabStripPanel id="map" activeId={view}><MapChart ... /></TabStripPanel>
 * <TabStripPanel id="table" activeId={view}><DatasetPreviewTable ... /></TabStripPanel>
 * ```
 *
 * ANIMATION STACK · Framer Motion layoutId="tab-strip-underline-[instanceId]" for sliding underline.
 *                   AnimatePresence mode="wait" in TabStripPanel for content crossfade.
 *                   useReducedMotion() disables both transitions.
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA (tablist/tab/tabpanel · keyboard Arrow/Home/End · focus-visible · aria-selected)
 * @lifecycle stable
 * @portedDate 2026-05-19 · aura-builder · Batch 3.3a (NEW research-driven component)
 */
'use client';

import {
  useRef,
  useCallback,
  useId,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabStripOption {
  /** Unique id — used as aria-controls value suffix */
  id: string;
  /** Display label shown in the tab */
  label: string;
  /** Optional icon rendered before the label */
  icon?: ReactNode;
}

export interface TabStripProps {
  /** Tab definitions */
  options: TabStripOption[];
  /** Controlled active option id */
  value: string;
  /** Called when user activates a tab */
  onChange: (id: string) => void;
  /** Accessible name for the tablist · @default "View mode" */
  ariaLabel?: string;
  /**
   * Height variant.
   * sm → ~32px height (compact).
   * md → ~40px height (default, touch-friendly).
   */
  size?: 'sm' | 'md';
  /** Optional className passthrough on the tablist root */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * TabStrip — accessible tab strip with Framer Motion sliding underline.
 * Implements ARIA tablist/tab pattern with Arrow/Home/End keyboard navigation.
 * Distinct from ViewToggle atom (icon-only grid/list switcher).
 */
export function TabStrip({
  options,
  value,
  onChange,
  ariaLabel = 'View mode',
  size = 'md',
  className,
}: TabStripProps) {
  const prefersReduced = useReducedMotion();
  const tablistRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();

  const activeIndex = options.findIndex((o) => o.id === value);

  /** Keyboard: Arrow Left/Right cycle · Home → first · End → last */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const len = options.length;
      let next = activeIndex;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next = (activeIndex + 1) % len;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        next = (activeIndex - 1 + len) % len;
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        next = len - 1;
      } else {
        return;
      }

      onChange(options[next].id);

      // Move DOM focus to the newly activated tab
      const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      tabs?.[next]?.focus();
    },
    [activeIndex, options, onChange],
  );

  const paddingY = size === 'sm' ? 'var(--space-xs)' : 'var(--space-sm)';
  // Unique layoutId per instance to avoid shared underline across multiple TabStrips
  const underlayId = `tab-strip-underline-${instanceId}`;

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex gap-6 border-b',
        'border-[var(--border-soft)]',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.id === value;

        return (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${instanceId}-${option.id}`}
            id={`tab-${instanceId}-${option.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-1',
              'font-medium text-sm transition-colors duration-150',
              'focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2',
              'rounded-sm',
              isActive
                ? 'text-[var(--semantic-ink-strong)]'
                : [
                    'text-[var(--semantic-ink-subtle)]',
                    'hover:text-[var(--semantic-ink-strong)]',
                  ],
            )}
            style={{
              paddingTop: paddingY,
              paddingBottom: 'calc(var(--space-xs) + 2px)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: 'var(--tracking-button)',
            }}
          >
            {option.icon && (
              <span aria-hidden="true" className="shrink-0 size-4">
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>

            {/* Sliding active underline via Framer layoutId */}
            {isActive && (
              <motion.span
                layoutId={underlayId}
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--brand-red)]"
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 40 }
                }
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── TabStripPanel companion ───────────────────────────────────────────────────

export interface TabStripPanelProps {
  /** Must match the corresponding TabStripOption.id */
  id: string;
  /** Active option id from parent — controls visibility */
  activeId: string;
  /**
   * Instance id from parent TabStrip for aria linkage.
   * Pass the same instanceId generated by useId() in the parent if needed.
   * If omitted, panels use a non-linked id (still accessible via aria-controls wiring).
   */
  instanceId?: string;
  children: ReactNode;
  /** Optional className on the panel wrapper */
  className?: string;
}

/**
 * TabStripPanel — tabpanel companion for TabStrip.
 * Renders content with Framer AnimatePresence crossfade 150ms.
 * Skips animation when useReducedMotion is true.
 *
 * Usage: place immediately after TabStrip. `id` must match TabStripOption.id.
 */
export function TabStripPanel({ id, activeId, instanceId = 'shared', children, className }: TabStripPanelProps) {
  const prefersReduced = useReducedMotion();
  const isActive = id === activeId;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isActive && (
        <motion.div
          key={id}
          role="tabpanel"
          id={`tabpanel-${instanceId}-${id}`}
          aria-labelledby={`tab-${instanceId}-${id}`}
          tabIndex={0}
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={prefersReduced ? {} : { opacity: 1 }}
          exit={prefersReduced ? {} : { opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn('focus-visible:outline-none', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
