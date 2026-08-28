'use client';

/**
 * ErrorState · load-failure placeholder for charts and tables.
 *
 * WHY  · Charts and tables that fail to load (network error · malformed data ·
 *        timeout) should communicate failure clearly with a retry path.
 *        Blank or broken charts damage analyst trust in the data.
 *
 * WHAT · Centered layout: red-tinted icon + title + optional message + retry button.
 *        Icon: Lucide AlertCircle in brand-red accent.
 *        Retry: DS Button (variant="brand") when onRetry provided.
 *        Color: KEN_INK.body text + brand red for accent + icon.
 *
 * WHEN · Pass `errorMessage="..."` to chart/table components.
 *        Also use directly in catch boundaries or data-fetch error handlers.
 *
 * WHERE · `design-system/core-v2/src/charts/states/ErrorState.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <ErrorState
 *          message="Market data failed to load. Check your connection."
 *          onRetry={() => refetch()}
 *        />
 *        // Minimal (no retry):
 *        <ErrorState title="Chart unavailable" />
 *        ```
 *
 * A11y · role="alert" on wrapper (live region · announces to screen readers).
 *        AlertCircle icon aria-hidden. Button keyboard-accessible via DS Button.
 *
 * @module design-system/core-v2/src/charts/states/ErrorState
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '../../atoms/Button';

export interface ErrorStateProps {
  /** Title · default 'Failed to load' */
  title?: string;
  /** Optional error message · 1–2 sentences · e.g. "Network error. Check connection." */
  message?: string;
  /** Retry callback · renders DS Button when provided */
  onRetry?: () => void;
  /** Optional className on wrapper */
  className?: string;
}

export function ErrorState({
  title = 'Failed to load',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={['w-full flex flex-col items-center justify-center py-12 px-6 text-center', className ?? ''].join(' ')}
      role="alert"
      aria-live="assertive"
    >
      {/* Red-tinted icon — brand-red accent · KEN brand red #b01f24 · CTAs only context */}
      <span
        className="mb-4"
        style={{ color: 'var(--color-brand-red, #b01f24)' }}
        aria-hidden="true"
      >
        <AlertCircle size={32} />
      </span>

      <p
        className="font-body font-medium text-[var(--semantic-ink-strong)] mb-2"
        style={{ fontSize: '15px', lineHeight: 1.35 }}
      >
        {title}
      </p>

      {message && (
        <p
          className="font-body text-[var(--semantic-ink-muted)] max-w-[40ch] mb-5"
          style={{ fontSize: '13px', lineHeight: 1.6 }}
        >
          {message}
        </p>
      )}

      {onRetry && (
        <Button
          variant="brand"
          size="sm"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
