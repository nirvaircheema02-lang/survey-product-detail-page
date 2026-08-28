'use client';

/**
 * ChartEmptyState · no-data placeholder for charts and tables.
 *
 * WHY  · Charts and tables with no data should communicate empty state clearly
 *        rather than rendering blank/broken. Premium B2B research tools document
 *        the data contract (what the chart shows when empty vs loading vs error).
 *
 * WHAT · Centered layout: optional icon + title + optional description + optional CTA.
 *        Uses DS Button for CTA (variant="secondary" size="sm").
 *        Icon: Lucide Inbox by default.
 *
 * WHEN · Pass `empty={true}` to chart/table components.
 *        Also use directly in sections where data hasn't loaded or isn't available.
 *
 * WHERE · `design-system/core-v2/src/charts/states/EmptyState.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ChartEmptyState
 *          title="No data available"
 *          description="Market data for this segment isn't available in the selected date range."
 *          cta={{ label: 'Request data', onClick: () => {} }}
 *        />
 *        ```
 *
 * A11y · role="status" on wrapper · button keyboard-accessible via DS Button.
 *
 * @module design-system/core-v2/src/charts/states/EmptyState
 */

import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../../atoms/Button';

export interface ChartEmptyStateProps {
  /**
   * Optional icon — defaults to Lucide Inbox if not provided.
   * Pass null to suppress icon entirely.
   */
  icon?: ReactNode | null;
  /** Title text — required · concise · e.g. "No data available" */
  title: string;
  /** Optional description — 1–2 sentences explaining why + what to do */
  description?: string;
  /** Optional CTA button */
  cta?: {
    label: string;
    onClick: () => void;
  };
  /** Optional className on wrapper */
  className?: string;
}

export function ChartEmptyState({
  icon,
  title,
  description,
  cta,
  className,
}: ChartEmptyStateProps) {
  const iconEl = icon === null
    ? null
    : icon !== undefined
    ? icon
    : <Inbox size={32} aria-hidden="true" />;

  return (
    <div
      className={['w-full flex flex-col items-center justify-center py-12 px-6 text-center', className ?? ''].join(' ')}
      role="status"
      aria-label={title}
    >
      {iconEl && (
        <span className="text-[var(--semantic-ink-subtle)] mb-4">
          {iconEl}
        </span>
      )}
      <p
        className="font-body font-medium text-[var(--semantic-ink-strong)] mb-2"
        style={{ fontSize: '15px', lineHeight: 1.35 }}
      >
        {title}
      </p>
      {description && (
        <p
          className="font-body text-[var(--semantic-ink-muted)] max-w-[40ch] mb-5"
          style={{ fontSize: '13px', lineHeight: 1.6 }}
        >
          {description}
        </p>
      )}
      {cta && (
        <Button
          variant="secondary"
          size="sm"
          onClick={cta.onClick}
        >
          {cta.label}
        </Button>
      )}
    </div>
  );
}
