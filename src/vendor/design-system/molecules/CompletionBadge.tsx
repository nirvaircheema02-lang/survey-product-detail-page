/**
 * CompletionBadge
 *
 * WHY · Survey cards and detail pages need a compact, glanceable status indicator that
 *        communicates lifecycle state (draft → active → completed → closed) without
 *        cluttering the layout with verbose labels.
 * WHAT · Inline-flex pill with a coloured dot + status label + optional response
 *        progress fraction (e.g., "Active · 42/100 (42%)"). Props: status
 *        ("draft"|"active"|"completed"|"closed"), responseCount, targetCount, className.
 * WHEN · On SurveyCard molecules and survey detail/management pages within the Surveys
 *        pillar. Anywhere a lifecycle status needs to be shown alongside other metadata.
 * WHEN NOT · Don't use for report availability states — use Badge atom with the appropriate
 *             theme instead. Don't use for binary on/off states — a plain Badge suffices.
 * WHERE · Surveys pillar pages (no current project consumer · DS sample page only)
 * HOW ·
 *   ```tsx
 *   <CompletionBadge status="active" responseCount={42} targetCount={100} />
 *   ```
 *
 * @reusabilityScore 2     // Surveys pillar only · no cross-pillar usage yet
 * @a11y_status pending-review
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */

interface CompletionBadgeProps {
  status: 'draft' | 'active' | 'completed' | 'closed';
  responseCount?: number;
  targetCount?: number;
  className?: string;
}

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    bg: 'rgba(0,0,0,0.04)',
    text: 'rgba(0,0,0,0.45)',
    dot: 'rgba(0,0,0,0.25)',
  },
  active: {
    label: 'Active',
    bg: 'rgba(22, 163, 74, 0.08)',
    text: 'var(--green-700)',
    dot: 'var(--green-500)',
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(128, 108, 224, 0.08)',
    text: 'var(--purple-600)',
    dot: 'var(--purple-600)',
  },
  closed: {
    label: 'Closed',
    bg: 'rgba(0,0,0,0.04)',
    text: 'rgba(0,0,0,0.35)',
    dot: 'rgba(0,0,0,0.2)',
  },
};

export function CompletionBadge({ status, responseCount, targetCount, className }: CompletionBadgeProps) {
  const config = STATUS_CONFIG[status];
  const hasProgress = typeof responseCount === 'number' && typeof targetCount === 'number' && targetCount > 0;
  const progressPct = hasProgress ? Math.min(100, Math.round((responseCount! / targetCount!) * 100)) : null;

  return (
    <div
      data-component="CompletionBadge"
      className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
      style={{
        padding: '3px 8px',
        borderRadius: 'var(--radius-element, 5px)',
        background: config.bg,
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        color: config.text,
      }}
    >
      {/* Status dot — pulses for active */}
      <span
        className={status === 'active' ? 'animate-pulse' : ''}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
        }}
      />
      <span>{config.label}</span>
      {hasProgress && (
        <>
          <span style={{ color: 'rgba(0,0,0,0.2)', margin: '0 1px' }}>·</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {responseCount}/{targetCount}
          </span>
          <span style={{ color: 'rgba(0,0,0,0.25)' }}>({progressPct}%)</span>
        </>
      )}
    </div>
  );
}